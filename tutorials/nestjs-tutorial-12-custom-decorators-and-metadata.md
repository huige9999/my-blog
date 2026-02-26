---
title: NestJS 教程 12：自定义装饰器与元数据
date: 2026-03-01
description: 掌握方法装饰器、参数装饰器、装饰器合并与类元数据读取的核心套路。
---

# NestJS 教程 12：自定义装饰器与元数据

> 系列说明：本文是 NestJS 教程第 12 篇，目标是把“声明信息”和“运行逻辑”拆分清楚，形成可复用的装饰器设计习惯。

在 NestJS 里，装饰器不只是语法糖，它的核心价值是：用 metadata 声明约束，再由 Guard/Interceptor/Pipe 在运行时读取并执行。

## 1. 装饰器本质：贴 metadata

可以把它理解成“贴纸条”：

- `@SetUser('admin')` 在方法上贴“允许 admin”
- Guard 执行时读取这张纸条并决定放行或拦截

## 2. 自定义方法装饰器：`SetUser`

定义：

```ts
import { SetMetadata } from '@nestjs/common'

export const SetUser = (...args: string[]) => SetMetadata('SetUser', args)
```

使用：

```ts
@Get()
@SetUser('admin', 'user')
@UseGuards(CustomGuard)
getHello(): string {
  return this.appService.getHello()
}
```

在 Guard 里读取：

```ts
import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class CustomGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector

  canActivate(context: ExecutionContext): boolean {
    const users = this.reflector.get('SetUser', context.getHandler())
    console.log(users) // ['admin', 'user']
    return true
  }
}
```

要点：

- 方法元数据读取目标是 `context.getHandler()`
- 装饰器只负责声明，不自动执行业务

## 3. 自定义参数装饰器：`createParamDecorator`

定义 `GetUser`，从 query 取值：

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    return request.query[data]
  }
)
```

使用：

```ts
@Get('hello2')
getHello2(@GetUser('name') u: string): string {
  console.log(u)
  return this.appService.getHello()
}
```

请求 `GET /hello2?name=jack` 时，`u` 会是 `jack`。

## 4. 复刻内置参数装饰器思路

你可以基于同一套路做：

- `MyHeaders`：从 `request.headers` 取值
- `MyQuery`：从 `request.query` 取值
- `MyParam`：从 `request.params` 取值

这类装饰器本质是“参数取值策略”。

## 5. 装饰器合并：`applyDecorators`

当一个路由堆了多层装饰器：

```ts
@Get('hello1')
@SetUser('admin', 'user')
@UseGuards(CustomGuard)
```

可以封装成语义化组合装饰器：

```ts
import { applyDecorators, Get, UseGuards } from '@nestjs/common'

export function MyCombinedDecorator(path: string, ...user: string[]) {
  return applyDecorators(Get(path), SetUser(...user), UseGuards(CustomGuard))
}
```

使用：

```ts
@MyCombinedDecorator('hello1', 'admin', 'user')
getHello(): string {
  return this.appService.getHello()
}
```

## 6. 自定义类装饰器：`MyController`

定义：

```ts
import { applyDecorators, Controller, SetMetadata } from '@nestjs/common'

export function MyController(path: string, metaData: string) {
  return applyDecorators(Controller(path), SetMetadata('MyClass', metaData))
}
```

使用：

```ts
@MyController('', 'app-controller')
export class AppController {}
```

读取类元数据：

```ts
const metaData = this.reflector.get('MyClass', context.getClass())
```

对比：

- 方法元数据：`context.getHandler()`
- 类元数据：`context.getClass()`

## 7. 请求链路视角

方法装饰器链路：

```text
请求进来
  ↓
命中 Controller 方法
  ↓
Guard 读取类/方法 metadata
  ↓
放行后执行业务
```

参数装饰器链路：

```text
准备调用方法
  ↓
执行 createParamDecorator 工厂函数
  ↓
计算参数并注入方法
```

## 小结

- 方法/类装饰器用于声明 metadata
- 参数装饰器用于定义参数来源
- `applyDecorators` 用于封装常用组合，降低 Controller 噪音

常见工程化落地：

- `@Roles(...)` + `RolesGuard`
- `@Public()` 跳过鉴权
- `@CurrentUser()` 自动注入当前用户

