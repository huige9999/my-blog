---
title: NestJS 教程 18：Passport 与循环引用问题
date: 2026-03-07
description: 使用 Passport 简化本地登录与 JWT 鉴权流程，并处理 Auth/User 模块互相依赖导致的循环引用问题。
---

## Passport 简化流程与循环引用问题

先安装 Passport 相关依赖：

```shell
pnpm add @nestjs/passport passport passport-local passport-jwt -S
pnpm add @types/passport-local @types/passport-jwt -D
```

为了与已有登录逻辑解耦，这里新增 `Auth` 模块专门处理认证流程：

```shell
nest g mo auth
nest g s auth --no-spec
```

## AuthService 与模块互引问题

在 `auth.service.ts` 中注入 `UserService`，封装用户校验逻辑：

```ts
async validateUser(username: string, password: string): Promise<any> {
  const findUser = await this.userService.findOneByUsername(username)
  if (findUser && findUser.password === md5(password)) {
    return findUser
  }
  return null
}
```

这里要注意两点：

1. 导出问题：`UserModule` 需要导出 `UserService`，否则 `AuthModule` 不能注入。
2. 循环依赖问题：当 `UserModule` 与 `AuthModule` 互相引用时，要用 `forwardRef(() => Module)` 延迟解析。

## 本地策略（LocalStrategy）

在 `auth` 模块中引入 `PassportModule`，并新增 `LocalStrategy` 继承 `PassportStrategy(Strategy)`。

`validate(username, password)` 会调用 `AuthService.validateUser`，校验失败抛 `UnauthorizedException`。

注册为 provider 后，就可以在控制器里直接使用：

```ts
@UseGuards(AuthGuard('local'))
@Post('loginPassport')
async loginPassport(@Req() req) {
  return req.user
}
```

登录成功与失败效果：

![Passport 本地登录成功](/assets/91.png)

![Passport 本地登录失败](/assets/92.png)

## JWT 策略（JwtStrategy）

继续在 `AuthModule` 中引入 `JwtModule`，并注册 `JwtStrategy`。

核心配置：

- `jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()`：从请求头 Bearer Token 读取 JWT
- `ignoreExpiration: false`：过期即拒绝
- `secretOrKey`：验签密钥

同时在 `AuthService` 增加 `login` 方法，返回 `access_token`：

```ts
async login(user: LoginUserDto) {
  const payload = { username: user.username, sub: user.password }
  return {
    access_token: this.jwtService.sign(payload),
  }
}
```

控制器登录改为返回 token：

```ts
@UseGuards(AuthGuard('local'))
@Post('loginPassport')
async loginPassport(@Req() req) {
  return this.authService.login(req.user)
}
```

生成 token：

![Passport 登录返回 JWT](/assets/93.png)

受保护路由用 `@UseGuards(AuthGuard('jwt'))`。

未携带 token：

![JWT 未携带 Token](/assets/94.png)

携带 token 后：

![JWT 鉴权通过](/assets/95.png)

## 环境变量配置（避免硬编码）

为了避免把数据库与 JWT 配置硬编码在代码中，可通过 `.env` + `@nestjs/config` 管理：

```shell
pnpm add @nestjs/config -S
```

在 `AppModule` 中全局启用：

```ts
ConfigModule.forRoot({ isGlobal: true })
```

然后把 TypeORM 和 JwtModule 改为 `forRootAsync/registerAsync`，通过 `ConfigService` 读取：

- `DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PASSWORD`、`DB_DATABASE`
- `JWT_SECRET`、`JWT_EXPIRE_TIME`
