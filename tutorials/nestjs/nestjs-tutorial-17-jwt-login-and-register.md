---
title: NestJS 教程 17：JWT 登录注册后端处理
date: 2026-03-06
description: 从用户注册与登录出发，完成 DTO 校验、密码加密、JWT 签发与 Guard 鉴权的一套 NestJS 后端实现。
---

## JWT 登录注册后端实现

先创建一个简单的用户表结构来保存账号信息，这里数据库示例使用 `login_test`。

![创建数据库](/assets/83.png)

项目初始化与依赖安装：

```shell
nest n nest_jwt -g -p pnpm
pnpm add typeorm mysql2 @nestjs/typeorm @nestjs/jwt -S
```

在 `AppModule` 中先接好 TypeORM：

```ts
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'login_test',
  synchronize: true,
  logging: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  connectorPackage: 'mysql2',
  timezone: 'Z',
})
```

然后创建用户资源：

```shell
nest g res user --no-spec
```

## 用户实体与 DTO 校验

`User` 实体包含用户名、密码、创建时间、更新时间。时间字段可用 `@CreateDateColumn` 和 `@UpdateDateColumn` 自动维护。

注册和登录虽然字段看起来一样，但语义不同，校验规则也不同，因此分别定义 `RegisterUserDto` 与 `LoginUserDto`。

安装校验依赖：

```shell
pnpm add class-validator class-transformer
```

注册 DTO 里可以限制用户名格式、密码复杂度；登录 DTO 只做必填校验。Controller 中通过 `@Body(ValidationPipe)` 触发参数校验。

![DTO 校验测试](/assets/84.png)

## 注册逻辑

注册流程：

1. 按用户名查询是否已存在。
2. 已存在则抛出异常。
3. 不存在则加密密码后入库。

密码示例用 `md5` 处理（生产环境建议使用更安全的哈希方案，例如 `bcrypt`/`argon2`）。

```shell
pnpm add md5 -S
pnpm add @types/md5 -D
```

注册成功与数据库结果：

![注册成功](/assets/85.png)

![数据库用户数据](/assets/86.png)

用户名重复时：

![用户名重复](/assets/87.png)

## 登录与 JWT 签发

登录流程：

1. 根据用户名查询用户。
2. 用户不存在或密码不匹配则抛出异常。
3. 校验通过后返回用户信息。

接入 JWT：

```ts
JwtModule.register({
  global: true,
  secret: 'MySecret',
  signOptions: { expiresIn: '7d' },
})
```

登录成功后在 Controller 中调用 `JwtService.signAsync` 生成 token，并通过响应头 `authorization` 返回。

![登录返回 JWT](/assets/88.png)

## Guard 保护登录态路由

新增 `LoginGuard`，在 `canActivate` 中读取请求头 `authorization`，解析并校验 Bearer Token：

- 缺少或格式错误：抛出 `UnauthorizedException`
- 校验失败：抛出 `UnauthorizedException`
- 校验成功：把用户信息挂到 `request.user` 并放行

然后在需要登录态的路由上加 `@UseGuards(LoginGuard)`。

未携带 token 访问：

![未登录访问受限](/assets/89.png)

携带 token 后访问：

![携带 JWT 访问成功](/assets/90.png)
