---
title: NestJS 教程 05：模块边界与动态模块
date: 2026-02-23
description: 讲清 Module 的作用域、imports/exports 规则、@Global 的取舍与动态模块设计。
---

# NestJS 教程 05：模块边界与动态模块

> 系列说明：本文是 NestJS 教程第 5 篇，目标是建立 Nest 模块系统的完整心智模型，减少依赖注入相关踩坑。

## 1. 模块的本质：作用域 + 依赖边界

在 NestJS 中，模块不是“目录结构”，而是 DI 容器中的边界分区：

```ts
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: []
})
export class SomeModule {}
```

关键字段：

- `controllers`：当前模块的路由入口
- `providers`：当前模块注册的可注入对象
- `imports`：引入其他模块，并消费其 `exports`
- `exports`：把本模块 provider 对外暴露

一句话：模块默认隔离，依赖通过 `imports/exports` 打通。

## 2. 根模块与模块树

Nest 从 `AppModule` 出发，递归扫描 `imports` 构建模块依赖树，并完成 provider 实例化。

```ts
@Module({
  imports: [UserModule, OrderModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
```

这时 `AppModule` 是根，`UserModule/OrderModule` 是子模块。

## 3. 为什么“exports 了还要 imports”

典型场景：`OrderService` 需要注入 `UserService`。

第一步：在 `UserModule` 导出 `UserService`。

```ts
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
```

第二步：在 `OrderModule` 导入 `UserModule`。

```ts
@Module({
  imports: [UserModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
```

然后才能在 `OrderService` 中注入：

```ts
@Injectable()
export class OrderService {
  @Inject(UserService)
  private userService: UserService
}
```

心智模型：

- `exports`：我愿意给外部用
- `imports`：我显式声明要用谁

## 4. `@Global()`：导入一次，全局可见

```ts
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
```

优点：减少重复 `imports`。  
代价：依赖关系变隐式，模块边界变模糊。

建议：

- 适合全局基础设施模块：Config、Logger、Cache
- 不建议业务模块（User/Order）滥用全局化

## 5. 动态模块：imports 时可传配置

动态模块让模块定义按运行时参数生成：

```ts
import { DynamicModule, Module } from '@nestjs/common'

@Module({})
export class AuthModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options
        },
        AuthService
      ],
      exports: [AuthService]
    }
  }
}
```

使用时：

```ts
imports: [AuthModule.register({ role: 'admin' })]
```

这也是 Nest 生态常见写法来源：

- `TypeOrmModule.forRoot(...)`
- `JwtModule.register(...)`
- `ConfigModule.forRoot(...)`

## 6. `register/forRoot/forFeature` 语义约定

- `register`：按次传配置（可多实例）
- `forRoot`：根模块一次性全局配置
- `forFeature`：局部模块补充特性配置

不是语法强制，但几乎是社区通用约定。

## 7. 踩坑清单

- 只 `exports` 不 `imports`，注入失败
- 把业务模块做成全局模块，依赖隐式化
- 动态模块忘写 `exports`，外部无法消费 provider

## 小结

1. 模块是 DI 作用域边界，不是文件夹概念
2. 跨模块注入的原则是：B `exports` + A `imports`
3. `@Global()` 要克制使用，优先显式依赖
4. 动态模块本质是“把运行时配置注入模块”

下一篇：`NestJS 教程 07` 进入 AOP，讲清横切关注点与 Before/After/Around 的实现方式。
