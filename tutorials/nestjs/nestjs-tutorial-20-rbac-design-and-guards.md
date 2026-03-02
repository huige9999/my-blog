---
title: NestJS 教程 20：RBAC 权限设计与守卫落地
date: 2026-03-09
description: 合并 RBAC 权限设计 1/2，完整实现用户-角色-权限模型、JWT 登录、全局登录守卫与权限守卫。
---

## RBAC 权限设计

在用户量和权限量都上来后，直接做「用户-权限」映射会让维护和查询成本快速上升。RBAC（基于角色的访问控制）通过「用户 -> 角色 -> 权限」降低复杂度。

![RBAC 流程](/assets/96.png)

![ACL 与 RBAC 对比](/assets/97.png)

![RBAC 关系示意](/assets/98.png)

### RBAC0 核心模型

- 用户（User）
- 角色（Role）
- 权限（Permission）

用户和角色多对多，角色和权限多对多。

![RBAC 表结构](/assets/99.png)

![实体关系设计](/assets/100.png)

## 工程初始化与实体建模

```shell
nest n rbac-test -g -p pnpm
pnpm add @nestjs/typeorm typeorm mysql2 -S
nest g res user --no-spec
```

在 `AppModule` 配置 TypeORM 后，定义 `User`、`Role`、`Permission` 三个实体，并通过 `@ManyToMany + @JoinTable` 建立关系。

## 初始化测试数据

在 `UserService` 中通过 `EntityManager` 构建并保存用户、角色、权限与映射关系，提供 `GET /user/initData` 初始化入口。

![初始化数据成功](/assets/101.png)

## 登录与 JWT

先做登录 DTO 校验：

```shell
pnpm add class-validator class-transformer -S
```

校验示例：

![登录参数校验](/assets/102.png)

查询用户时带上角色关联：

```ts
this.entityManager.findOne(User, {
  where: { username: loginUserDto.username },
  relations: { roles: true },
})
```

![登录查询返回角色](/assets/103.png)

登录成功后签发 JWT：

```shell
pnpm add @nestjs/jwt -S
```

```ts
const token = this.jwtService.sign({
  user: { username: result.username, roles: result.roles },
})
```

![登录返回 JWT](/assets/104.png)

## 登录守卫（LoginGuard）

新增 `employee`、`department` 两个模块后，需要控制未登录访问：

![未做保护时可访问](/assets/105.png)

实现 `LoginGuard`：

- 读取请求头 `authorization`
- 校验 JWT
- 失败抛 `UnauthorizedException`

未携带 token：

![未携带 token](/assets/106.png)

携带 token：

![携带 token 可访问](/assets/107.png)

把 `LoginGuard` 注册为全局守卫（`APP_GUARD`）后，所有路由都会被保护。

![全局守卫生效1](/assets/108.png)

![全局守卫生效2](/assets/109.png)

但这会误伤 `/user/login`。解决方案是自定义装饰器：

```ts
export const LoginRequired = () => SetMetadata('LoginRequired', true)
```

在需要登录控制的 Controller 上标注 `@LoginRequired()`，在守卫里用 `Reflector.getAllAndOverride` 判断是否需要校验。

## 权限守卫（PermissionGuard）

仅登录还不够，还要做接口级权限控制：

1. 从 JWT 或 request 获取当前用户角色
2. 根据角色查询权限集合
3. 读取路由声明的权限要求并匹配

定义权限装饰器：

```ts
export const PermissionRequired = (...permissions: string[]) =>
  SetMetadata('PermissionRequired', permissions)
```

在路由上使用，例如：

```ts
@PermissionRequired('新增 员工')
@PermissionRequired('查询 部门')
```

`PermissionGuard` 中读取 `PermissionRequired` 元数据，逐项和用户权限比对，不满足则拒绝访问。

![全局守卫误伤登录示例](/assets/110.png)

## 小结

这一篇把 RBAC 从模型到实现跑通了：

- 数据层：用户-角色-权限多对多建模
- 认证层：JWT 登录态
- 授权层：`LoginGuard` + `PermissionGuard`
- 工程层：自定义装饰器 + 全局守卫组合
