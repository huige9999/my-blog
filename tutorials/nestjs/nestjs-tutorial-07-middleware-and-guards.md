---
title: NestJS 教程 07：中间件与守卫的职责边界
date: 2026-02-22
description: 通过完整请求链路理解 Middleware 与 Guard 的执行顺序、适用场景与全局注册方式。
---

# NestJS 教程 07：中间件与守卫的职责边界

> 系列说明：本文是 NestJS 教程第 7 篇，重点是把“通用请求处理”和“路由准入控制”拆清楚，避免权限与日志逻辑混写。

## 1. 请求链路中的位置

简化执行链路如下：

```text
HTTP Request
   │
   ▼
[全局 Middleware] (before)
   │
   ▼
[局部 Middleware] (before)
   │
   ▼
[Guard: canActivate] -> true 放行 / false 403
   │
   ▼
[Controller Handler]
   │
   ▼
HTTP Response
   ▲
   │
[局部 Middleware] (after)
   ▲
   │
[全局 Middleware] (after)
```

直觉上可以这样理解：

- Middleware 像洋葱层，`next()` 前后都能处理
- Guard 像门禁，只判断是否能进入路由

## 2. 中间件：全局与局部

### 2.1 全局中间件示例

```ts
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('before 全局中间件 --- ' + req.url)
    next()
    console.log('after 全局中间件 --- ' + res.statusCode)
  }
}
```

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(new LoggerMiddleware().use)
  await app.listen(process.env.PORT ?? 3000)
}
```

`after` 日志最后出现，是因为它写在 `next()` 后，只有后续链路执行完才会回到当前位置。

### 2.2 局部中间件示例

```ts
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'

@Module({
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService]
})
export class PersonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PersonMiddleware).forRoutes({
      path: '/person',
      method: RequestMethod.GET
    })
  }
}
```

这样只会命中 `GET /person`，不会影响其它方法或路径。

### 2.3 类中间件可注入依赖

```ts
@Injectable()
export class PersonMiddleware implements NestMiddleware {
  @Inject(PersonService)
  private personService: PersonService

  use(req: Request, res: Response, next: NextFunction) {
    console.log('before 中间件 --- ' + req.url)
    console.log('调用注入的服务 --- ' + this.personService.findAll())
    next()
    console.log('after 中间件 --- ' + res.statusCode)
  }
}
```

## 3. 守卫 Guard：准入判断

```ts
import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class PersonGuard implements CanActivate {
  @Inject(PersonService)
  private personService: PersonService

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('person guard')
    console.log('调用注入的守卫 ' + this.personService.findAll())
    return true
  }
}
```

局部绑定：

```ts
@Controller('person')
@UseGuards(PersonGuard)
export class PersonController {}
```

返回 `false` 时默认响应 403。

## 4. 全局 Guard 的正确注册方式

错误写法（会丢失 DI 能力）：

```ts
app.useGlobalGuards(new PersonGuard())
```

这会绕过 Nest 容器，导致注入属性可能是 `undefined`。

正确写法：使用 `APP_GUARD` 交给容器创建。

```ts
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [PersonModule],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: PersonGuard
    }
  ]
})
export class AppModule {}
```

## 5. 一次请求的典型日志顺序

当同时启用全局中间件、局部中间件与全局守卫，请求 `GET /person` 时可能看到：

```text
before 全局中间件 --- /person
before 中间件 --- /person
person guard
person controller findAll
after 中间件 --- 200
after 全局中间件 --- 200
```

## 6. `exports` 的作用

像 `PersonService` 这类被 Guard 依赖的 provider，如果在功能模块里定义，通常需要：

- 在功能模块 `exports: [PersonService]`
- 在使用方模块 `imports: [PersonModule]`

这样容器才能跨模块解析依赖。

## 小结

1. Middleware 适合做 HTTP 层通用处理
2. Guard 适合做“是否允许进入路由”的准入决策
3. 需要注入能力的全局 Guard 必须用 `APP_GUARD` 注册

下一篇：`NestJS 教程 06` 进入模块机制，讲清 `imports/exports`、`@Global()` 与动态模块。
