---
title: NestJS 教程 22：GraphQL 快速入门与 Nest 集成
date: 2026-03-11
description: 合并 GraphQL 快速入门与 Nest 中使用 GraphQL，覆盖 schema/resolver、Query/Mutation、Apollo Client 与 Nest GraphQL 实战接入。
---

## GraphQL 基本认知

REST 常见问题是“接口按场景不断膨胀”，而 GraphQL 由客户端声明自己需要的数据结构，服务端提供统一查询入口。

核心概念：

- `schema`：类型定义与查询/变更入口
- `resolver`：对应字段或操作的数据解析函数
- `Query`：查询
- `Mutation`：增删改

## 1. 用 Apollo Server 快速入门

先建一个 Node Demo：

```shell
pnpm add @apollo/server
```

定义 `Employee`、`Department`、`Query` 的 schema，再实现对应 resolver，最后启动 server。

运行后可在沙盒中直接执行查询：

![GraphQL Sandbox](/assets/122.png)

前端客户端接入（React）：

![Apollo Client 安装](/assets/123.png)

## 2. Query 参数查询与 Mutation

按条件查询：

- 在 `Query` 中新增 `employeesByDepartmentName(name: String!)`
- resolver 中按参数返回过滤结果

![按条件查询](/assets/124.png)

![参数打印](/assets/125.png)

增删改处理：

- 在 `schema` 增加 `Mutation`：`addEmployee/updateEmployee/deleteEmployee`
- 在 resolver 中实现对应函数

![Mutation 新增员工](/assets/126.png)

![新增后查询验证](/assets/127.png)

## 3. 在 Nest 中使用 GraphQL

创建项目并安装依赖：

```shell
nest new nest-graphql -g -p pnpm
pnpm add @nestjs/graphql@12 @nestjs/apollo@12 @apollo/server graphql
```

在 `AppModule` 中引入：

```ts
GraphQLModule.forRoot({
  driver: ApolloDriver,
  typePaths: ['./**/*.graphql'],
  playground: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
})
```

然后：

1. 新建 `schema.graphql`
2. 生成 resolver（如 `nest g resolver employee --no-spec`）
3. 用 `@Query`、`@Mutation`、`@Args` 实现业务逻辑

推荐安装 GraphQL 语法高亮插件：

![VSCode GraphQL 插件](/assets/128.png)

命令行创建 resolver：

![创建 Resolver](/assets/129.png)

启动后访问 `/graphql` 即可调试：

![Nest GraphQL 页面](/assets/130.png)

## 4. 前后端联调

Nest 端开启 CORS 后，前端 Apollo Client 只需把地址改到：

```ts
uri: 'http://localhost:3000/graphql'
```

即可复用之前的 `useQuery/useMutation` 代码进行联调。

## 小结

这篇把 GraphQL 从“独立 Apollo Demo”到“Nest 实战接入”完整串起来了：

- 先掌握 schema/resolver 基础模型
- 再落地 Query + Mutation
- 最后迁移到 Nest GraphQL 模块化开发与前端联调
