---
title: NestJS 教程 19：通过环境变量获取配置信息
date: 2026-03-08
description: 用 .env 与 @nestjs/config 管理数据库和 JWT 配置，替代硬编码并支持异步模块注册。
---

## 通过环境变量获取配置信息

前面在配置 MySQL 和 JWT 时，很多值是直接硬编码在代码里的。实际生产环境不推荐这样做，应该通过环境变量或配置服务统一管理。

可以先在项目根目录创建 `.env`：

```env
DB_USER=root
DB_HOST=localhost
DB_PORT=3306
DB_PASSWORD=123456
DB_DATABASE=login_test
JWT_SECRET=MySecret
JWT_EXPIRE_TIME=7d
```

## 1. 安装配置模块

```shell
pnpm add @nestjs/config -S
```

在 `AppModule` 中引入并全局注册 `ConfigModule`：

```ts
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

全局后，其他模块无需重复引入即可使用 `ConfigService`。

## 2. TypeORM 改为异步配置

为了从环境变量读取数据库配置，把 `TypeOrmModule.forRoot` 改为 `forRootAsync`：

```ts
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    synchronize: true,
    logging: true,
    autoLoadEntities: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    timezone: 'Z',
  }),
})
```

这样数据库连接参数可随环境切换，不需要改源码。

## 3. JwtModule 改为异步配置

在 `AuthModule` 中同样使用 `registerAsync`：

```ts
JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRE_TIME'),
    },
  }),
})
```

这样 JWT 密钥和过期时间也能统一由环境变量管理，避免硬编码泄露风险。

## 小结

通过 `.env` + `@nestjs/config`，可以把数据库和鉴权配置从代码中剥离出来。后续在不同环境（本地、测试、生产）只需替换环境变量，不必改业务代码。
