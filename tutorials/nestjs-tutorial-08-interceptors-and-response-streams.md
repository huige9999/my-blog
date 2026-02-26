---
title: NestJS 教程 08：拦截器与返回值数据流
date: 2026-02-25
description: 系统理解 Interceptor 的定位、执行顺序与 RxJS 数据流加工能力。
---

# NestJS 教程 08：拦截器与返回值数据流

> 系列说明：本文是 NestJS 教程第 8 篇，重点讲清拦截器在请求链路中的位置，以及如何用 RxJS 对返回值做工程化加工。

## 1. 拦截器到底是什么：给路由处理函数包一层

把一次 HTTP 请求想象成一个处理链，拦截器像是给路由处理函数套了一个外壳：

```text
Request
  -> (Interceptor before)
  -> Controller -> Service
  -> (Interceptor after)
Response
```

它和中间件、守卫最大的不同点在于：拦截器能拿到并加工 Controller 的返回值。

## 2. 与 Middleware / Guard 的区别

### Middleware：更靠近底层 HTTP

- 更像 Express 的 `req/res/next`
- 适合做 CORS、cookie、raw body、通用日志等处理
- 不擅长改造 Controller 返回值

### Guard：门禁系统

- 只关心能不能进（返回 true/false）
- 适合鉴权、权限、角色控制

### Interceptor：处理链包装器

- 既能在请求前做事，也能在响应后做事
- 关键能力是改造返回值、统一格式、缓存、超时、异常转换、性能统计
- 和 RxJS 强绑定，因为它处理的是返回值数据流

一句话总结：

- `Middleware` 处理 HTTP 外层
- `Guard` 决定是否放行
- `Interceptor` 包住 handler，处理前后逻辑和返回值

## 3. 拦截器的基本结构：`intercept(context, next)`

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('进入拦截器 before')
    return next.handle() // 必须调用，否则不会进入 Controller
  }
}
```

### `ExecutionContext`

用于获取请求上下文，例如：

```ts
const req = context.switchToHttp().getRequest()
console.log(req.url)
```

常见用途：

- 打印请求/响应日志
- 读取 headers（如 traceId、缓存策略）
- 按路由做条件分支处理

### `CallHandler`

`handle()` 会继续执行后续流程，最终进入 Controller，并拿到返回值。

## 4. 为什么拦截器离不开 RxJS

拦截器里最关键的一句：

```ts
return next.handle()
```

`next.handle()` 返回的是 `Observable`，你可以通过 operators 对数据流加工：

- `map` 改造返回结果
- `filter` 过滤数据
- `tap` 打日志但不改数据
- `catchError` 统一异常处理
- `timeout` 超时控制
- `toArray` 将多次发射收束成数组

## 5. 使用方式：方法级 / 控制器级 / 全局

### 方法级：只拦一个路由

```ts
@Get('name')
@UseInterceptors(AuthInterceptor)
findName() {
  return from(['hello', 'worldA', 'abc'])
}
```

### 控制器级：拦整个 Controller

```ts
@Controller('person')
@UseInterceptors(TimeoutInterceptor)
export class PersonController {}
```

### 全局级：拦所有请求

推荐在模块里使用 `APP_INTERCEPTOR`：

```ts
import { APP_INTERCEPTOR } from '@nestjs/core'

providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: TimeoutInterceptor
  }
]
```

相比在 `main.ts` 中直接 `new TimeoutInterceptor()`，这种方式更利于依赖注入和测试。

## 6. 执行顺序：先进后出

当同时配置全局、控制器级、路由级拦截器时：

- 请求进入：全局 -> 控制器 -> 路由
- 响应返回：路由 -> 控制器 -> 全局

这是典型的 LIFO（先进后出）模型。

## 7. 实战：加工返回值流水线

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { catchError, filter, map, Observable, tap, toArray } from 'rxjs'

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('---auth before interceptor---')

    return next.handle().pipe(
      map((data) => data.toUpperCase()),
      filter((data) => data.includes('A')),
      tap((data) => console.log('auth after interceptor', data)),
      toArray(),
      catchError((err) => {
        console.log('---catchError---', err)
        throw new Error(err)
      })
    )
  }
}
```

假设 Controller 返回：

```ts
import { from } from 'rxjs'

return from(['hello', 'worldA', 'abc'])
```

流水线过程：

1. 发射：`hello`、`worldA`、`abc`
2. `map`：`HELLO`、`WORLDA`、`ABC`
3. `filter`：`WORLDA`、`ABC`
4. `tap`：打印日志
5. `toArray`：返回 `["WORLDA","ABC"]`

## 8. 三个生产常用模板

### 统一响应结构

```ts
import { map } from 'rxjs'

return next.handle().pipe(
  map((data) => ({
    code: 0,
    message: 'ok',
    data,
    time: Date.now()
  }))
)
```

### 统计耗时

```ts
import { tap } from 'rxjs'

const start = Date.now()
return next.handle().pipe(
  tap(() => console.log('cost(ms)=', Date.now() - start))
)
```

### 超时控制

```ts
import { timeout } from 'rxjs'

return next.handle().pipe(
  timeout(1000)
)
```

## 9. 什么时候优先用拦截器

- 统一响应格式（`code/message/data`）
- 接口耗时统计、日志跟踪
- 超时、重试、缓存等请求控制
- 对返回值做映射、过滤、脱敏
- 统一异常转换

## 小结

- `Middleware`：HTTP 外层通用处理
- `Guard`：是否允许进入
- `Interceptor`：包裹 handler，处理前后逻辑并加工返回值（RxJS）

拦截器的核心价值是把 Controller 返回值变成可加工的数据流，让接口输出实现标准化与可组合。
