---
title: NestJS 教程 03：IoC 与依赖注入实战
date: 2026-02-20
description: 从 IoC/DI 概念到 NestJS Providers 多种注入方式的实战用法。
---

# NestJS 教程 03：IoC 与依赖注入实战

> 系列说明：本文是 NestJS 教程第 3 篇，目标是彻底理解 NestJS 的 IoC 容器与注入机制。

## 1. 为什么需要 IoC

传统写法常见这样手动组装依赖：

```ts
const dataSource = new DataSource(config)
const dao = new Dao(dataSource)
const service = new Service(dao)
const controller = new Controller(service)
```

问题是：

- 依赖关系硬编码，耦合高
- 很难统一管理生命周期
- 容易反复创建实例，难以复用单例

IoC（控制反转）就是把“对象创建与管理”交给容器；DI（依赖注入）是 IoC 的实现方式。

## 2. 用简化容器理解 IoC/DI

```js
class Container {
  constructor() {
    this.services = new Map()
  }

  register(name, service) {
    this.services.set(name, service)
  }

  get(name) {
    const service = this.services.get(name)
    if (typeof service === 'function') {
      const instance = service(this)
      this.services.set(name, instance)
      return instance
    }
    return service
  }
}
```

容器化后，业务代码只声明“我需要什么”，不再关心“它是怎么创建出来的”。

## 3. IoC 在 NestJS 里的对应关系

NestJS 核心装饰器：

- `@Controller()`：请求入口（消费者）
- `@Injectable()`：可被容器管理并注入的提供者
- `@Module()`：声明模块边界，组织控制器与提供者

```ts
@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
```

## 4. 两种常见注入方式

### 构造器注入（推荐）

```ts
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll()
  }
}
```

### 属性注入（按需使用）

```ts
@Controller('user')
export class UserController {
  @Inject(UserService)
  private userService: UserService

  @Get()
  findAll() {
    return this.userService.findAll()
  }
}
```

## 5. Providers 的 3 种常见策略

### `useClass`

```ts
providers: [
  {
    provide: 'app_service',
    useClass: AppService
  }
]
```

使用时：

```ts
constructor(@Inject('app_service') private readonly appService: AppService) {}
```

### `useValue`

```ts
providers: [
  {
    provide: 'car_config',
    useValue: { brand: 'BYD', price: 100000 }
  }
]
```

### `useFactory` + `inject`

```ts
const createRandomFactory = (
  carConfig: { brand: string; price: number },
  appService: AppService
) => {
  return {
    randomId: Math.random(),
    brandName: carConfig.brand,
    greeting: appService.getHello()
  }
}

@Module({
  providers: [
    AppService,
    { provide: 'car_config', useValue: { brand: 'BYD', price: 100000 } },
    {
      provide: 'dynamic_data',
      useFactory: createRandomFactory,
      inject: ['car_config', AppService]
    }
  ]
})
export class AppModule {}
```

适用场景：动态配置、SDK 初始化、依赖组合计算。

## 小结

1. IoC 解决的是“谁管理对象生命周期”
2. DI 解决的是“依赖如何被注入”
3. NestJS 用模块 + providers + decorators 把这套机制工程化

至此，NestJS 教程前三篇完成了从 CLI 上手、架构分层到 IoC/DI 的核心闭环。
