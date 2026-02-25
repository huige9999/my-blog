---
title: NestJS 教程 04：装饰器与参数获取实战
date: 2026-02-21
description: 从装饰器与元数据出发，系统掌握 NestJS 的参数装饰器与路由匹配细节。
---

# NestJS 教程 04：装饰器与参数获取实战

> 系列说明：本文是 NestJS 教程第 4 篇，目标是把 `@Controller/@Get/@Body/@Param/@Query` 这套机制用清楚、用稳定。

## 1. NestJS 的“魔法”本质：装饰器 + 元数据

NestJS 的很多能力，本质都依赖装饰器写入元数据，再由框架在启动阶段读取并执行：

- 路由注册
- 参数解析
- 依赖注入
- AOP 扩展（如拦截器）

所以 `@Controller`、`@Get`、`@Body` 不是语法糖，而是给框架的“声明式说明书”。

## 2. TypeScript 装饰器类型与 Nest 常用子集

TS 常见装饰器有 5 类：

1. 类装饰器（Class Decorator）
2. 方法装饰器（Method Decorator）
3. 属性装饰器（Property Decorator）
4. 参数装饰器（Parameter Decorator）
5. 访问器装饰器（Accessor Decorator）

Nest 核心主要围绕前 4 类构建。

## 3. Nest 常用装饰器速览

### 3.1 类装饰器

- `@Controller`：声明控制器（路由入口）
- `@Injectable`：声明可注入 provider
- `@Module`：声明模块边界与依赖
- `@UseInterceptors`：类级别绑定拦截器

### 3.2 方法装饰器

- `@Get/@Post/@Put/@Delete/@Patch/@Options/@Head`
- `@UseInterceptors`：方法级别生效

方法装饰器决定了一个接口的 `HTTP method + path`。

### 3.3 属性装饰器

最常见于 DTO 校验字段（配合 `ValidationPipe`）：

- `@IsNotEmpty`
- `@IsString`
- `@IsNumber`

### 3.4 参数装饰器

- `@Body`：请求体
- `@Param`：路径参数
- `@Query`：查询参数
- `@Headers`：请求头
- `@Ip`：客户端 IP
- `@Req/@Request`：原始 request
- `@Res/@Response`：原始 response（会接管响应）

## 4. 五种常见传参方式与 Nest 接法

后端高频参数来源可以归纳为：

1. url param，如 `/person/123`
2. query，如 `/person?name=jack&age=19`
3. form-urlencoded，请求体
4. json，请求体
5. form-data（multipart），常用于上传

其中 url param 与 query 都走 URL；form-urlencoded/json/form-data 都在 body。

## 5. `@Param` 与 `@Query` 实战

```ts
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find')
  query(@Query('name') name: string, @Query('age') age: number) {
    return this.userService.query(name, age)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }
}
```

### 路由顺序坑位

`@Get('find')` 必须放在 `@Get(':id')` 前面。  
Nest 按声明顺序匹配，否则 `/user/find` 会被误当成 `id = 'find'`。

## 6. `@Body` + DTO：接收 `form-urlencoded/json`

```ts
export class CreateUserDto {
  name: string
  age: number
}
```

```ts
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }
}
```

```ts
@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user ---' + JSON.stringify(createUserDto) + '---'
  }
}
```

## 7. `@Ip/@Headers/@Req/@Res` 与响应接管

不接管响应时：

```ts
@Get('other')
other(@Ip() ip: string, @Headers() headers: Record<string, any>, @Req() request: Request) {
  console.log(ip)
  console.log(headers)
  console.log(request.url)
  return 'other'
}
```

接管响应时（使用 `@Res()`）：

```ts
@Get('other')
other(
  @Ip() ip: string,
  @Headers() headers: Record<string, any>,
  @Req() request: Request,
  @Res() response: Response
) {
  console.log(ip)
  console.log(headers)
  console.log(request.url)
  response.end('other')
}
```

注意：一旦注入 `@Res()`，就要自己结束响应，否则会出现请求挂起或响应异常。

## 小结

1. 装饰器是在声明“角色、路由、参数来源”
2. 参数装饰器决定了方法参数从哪一段 HTTP 请求中取值
3. 路由匹配顺序会直接影响接口是否命中
4. `@Res()` 是手动挡，使用后要自行返回响应

下一篇：`NestJS 教程 05` 继续讲中间件与守卫的职责边界、执行顺序和全局注册方式。
