---
title: NestJS 教程 09：管道与异常过滤器
date: 2026-02-26
description: 用 Pipe 治理输入质量，用 Exception Filter 治理错误出口，建立稳定后端接口边界。
---

# NestJS 教程 09：管道与异常过滤器

> 系列说明：本文是 NestJS 教程第 9 篇，目标是把输入校验与异常治理拆清楚，形成可复用的工程闭环。

后端最怕两件事：脏输入和乱报错。NestJS 把这两件事交给两个专职角色：

- `Pipe`：负责转换、校验、清洗输入
- `Exception Filter`：负责把异常统一翻译成稳定的 HTTP 响应结构

## 1. 在请求链路中的位置

```text
请求进入
  ↓
中间件 Middleware
  ↓
守卫 Guard
  ↓
拦截器 Interceptor before
  ↓
管道 Pipe（校验/转换参数）
  ↓
控制器 Controller
  ↓
拦截器 Interceptor after
  ↓
响应发出

如果任意环节 throw 异常
  ↓
过滤器 Exception Filter（统一错误响应）
```

一句话：Pipe 管输入，Filter 管异常。

## 2. 管道：把输入从未知变成可信

### 2.1 `ParseIntPipe` 入门

```ts
@Delete(':id')
remove(@Param('id', ParseIntPipe) id: string) {
  return this.personService.remove(+id)
}
```

效果：

- `/person/123` 通过
- `/person/abc` 抛 `BadRequestException`（400）

### 2.2 自定义管道：校验 + 定制报错

```ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform
} from '@nestjs/common'

@Injectable()
export class ValidatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (Number.isNaN(parseInt(value))) {
      throw new BadRequestException(`参数${metadata.data}错误`)
    }
    return typeof value === 'number' ? value : parseInt(value)
  }
}
```

使用方式：

```ts
@Delete(':id')
remove(@Param('id', new ValidatePipe()) id: number) {
  return this.personService.remove(id)
}
```

### 2.3 挂载粒度

1. 参数级：影响单个参数
2. 方法级：影响单个路由处理函数
3. 全局级：影响所有路由

全局示例：

```ts
app.useGlobalPipes(new ParseIntPipe())
```

## 3. 过滤器：把异常翻译成统一响应

### 3.1 为什么需要 Filter

Nest 默认会返回错误，但默认结构不一定符合你的项目规范。Filter 的价值是统一错误出口，给前端和日志系统稳定契约。

### 3.2 自定义过滤器

```ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class MyExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = exception.getStatus()
    let resMessage: string | Record<string, any> = exception.getResponse()

    if (resMessage && typeof resMessage === 'object') {
      resMessage = (resMessage as any).message
    }

    response.status(status).json({
      statusCode: status,
      message: resMessage || exception.message,
      path: request.url,
      success: false
    })
  }
}
```

关键点：

- `@Catch(HttpException)` 只抓 HTTP 异常
- `exception.getStatus()` 取状态码
- `exception.getResponse()` 可能是 string 或 object，需要标准化

### 3.3 挂载粒度

方法级：

```ts
@Delete(':id')
@UseFilters(MyExceptionFilter)
remove(@Param('id', ParseIntPipe) id: string) {
  return this.personService.remove(+id)
}
```

控制器级：

```ts
@Controller('person')
@UseFilters(MyExceptionFilter)
export class PersonController {}
```

全局级：

```ts
app.useGlobalFilters(new MyExceptionFilter())
```

或使用依赖注入：

```ts
import { APP_FILTER } from '@nestjs/core'

providers: [
  {
    provide: APP_FILTER,
    useClass: MyExceptionFilter
  }
]
```

## 4. 一个完整组合套路

目标：`DELETE /person/:id`

- `id` 必须是数字
- 非法输入返回统一错误结构

实现：

```ts
@Delete(':id')
@UseFilters(MyExceptionFilter)
remove(@Param('id', ParseIntPipe) id: string) {
  return this.personService.remove(+id)
}
```

运行行为：

1. `/person/123`：Pipe 通过，业务正常执行
2. `/person/abc`：Pipe 抛异常，Filter 接管并统一返回 JSON

## 5. 实战建议

Pipe 负责：

- 类型转换（string -> number/boolean/date）
- 参数校验（格式、范围、必填）
- 请求体清洗（trim、默认值、白名单）

Filter 负责：

- 统一错误响应结构
- 记录异常日志（path、status、traceId）
- 屏蔽敏感错误细节
- 按异常类型输出不同响应

## 6. 常见坑

1. Filter 不生效：`@Catch(HttpException)` 只抓 HttpException，`throw new Error()` 可能进不来。
2. `message` 结构不稳定：`getResponse()` 在验证场景里可能是对象或数组，需要格式化。
3. Pipe 抛错为何是 400：Nest 默认异常链路会处理，你加 Filter 主要是为了统一输出。

## 小结

- Pipe 把输入质量问题挡在业务逻辑外
- Filter 把错误出口统一成稳定契约
- 两者组合能显著提升后端可维护性和前后端协作效率
