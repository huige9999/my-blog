---
title: NestJS 教程 21：日志体系与 AOP 日志落地
date: 2026-03-10
description: 合并日志处理与面向切面日志处理，完整搭建 Nest 内置日志、Winston、自定义日志器与中间件/拦截器/过滤器日志链路。
---

## 为什么日志体系重要

开发环境调试相对容易，但生产环境通常无法直接附加调试器，日志就是定位问题和回溯行为的核心数据源。一个可用的日志体系至少要满足：

- 可观测：知道请求做了什么、在哪失败
- 可检索：按级别、按时间、按模块快速定位
- 可维护：日志代码不污染业务逻辑

## 1. Nest 内置 Logger

Nest 默认开启日志，应用启动即可看到格式化输出：

![Nest 启动日志](/assets/111.png)

你也可以按级别控制输出：

```ts
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn'],
})
```

在业务中建议用 `Logger` 替换 `console.log`，并带上上下文。

![Service 中输出日志](/assets/112.png)

## 2. 自定义日志器模块

可以创建 `LoggerModule` 并实现 `MyLogger`（继承 `ConsoleLogger` 或实现 `LoggerService`），统一日志格式，再通过 DI 注入使用。

在 `main.ts` 中切换日志器：

```ts
const app = await NestFactory.create(AppModule, { bufferLogs: true })
app.useLogger(app.get(MyLogger))
```

`bufferLogs: true` 表示先缓存启动日志，待自定义 logger 准备好后统一输出。

## 3. 第三方日志器 Winston

生产环境通常会接入 Winston：

```shell
pnpm add winston winston-daily-rotate-file dayjs -S
pnpm add chalk@4 -S
```

![安装依赖](/assets/113.png)

通过 Winston 可以实现：

- 多级别日志（error/warn/info/debug）
- 控制台彩色输出
- 按天滚动文件
- 保留周期清理

配置后控制台输出效果：

![Winston 启动输出](/assets/114.png)

![接口请求日志输出](/assets/115.png)

优化格式后：

![彩色格式化日志](/assets/116.png)

同时落盘：

![日志文件落盘](/assets/117.png)

## 4. 面向切面的日志处理（AOP 思路）

手工在每个路由写日志效率低，建议用全局切面能力统一采集。

### 4.1 中间件：采集请求入口

`LoggerMiddleware` 适合记录请求信息：

- URL、Method、IP
- Params / Query / Body
- 状态码分级写入 info/warn/error

应用到全局路由后：

![中间件日志输出](/assets/118.png)

### 4.2 拦截器：采集响应结果

`ResponseInterceptor` 在 `next.handle()` 后记录响应数据，适合统计成功响应与返回结构。

![拦截器日志输出](/assets/119.png)

### 4.3 过滤器：采集异常出口

`HttpExceptionFilter` 统一捕获异常并记录错误日志，同时返回标准化错误响应。

![异常响应示例](/assets/120.png)

![后台异常日志](/assets/121.png)

## 小结

这一篇把 Nest 日志从“能打印”提升到“可运营”：

- 基础层：内置 Logger + 自定义 Logger
- 持久层：Winston + 日志轮转
- 切面层：中间件（请求）+ 拦截器（响应）+ 过滤器（异常）

最终目标是统一格式、统一入口、统一异常出口，让日志真正可用于生产排障和审计分析。
