---
title: NestJS 教程 16：状态保存方式
date: 2026-03-05
description: 讲清 Cookie、LocalStorage/SessionStorage、Session、JWT 四种状态保存方式及其核心差异。
---

## 状态保存的方式

HTTP 协议是无状态的，也就是说上一次请求和下一次请求之间是没有关联的，但是很多时候我们需要状态的保持，特别是登录状态的保持。

一般来说，在不考虑第三方平台的情况下，常见状态保持方式有下面几种：

- Cookie
- LocalStorage/SessionStorage
- Session
- JWT Token

至于什么是 Cookie、Session、LocalStorage/SessionStorage、JWT，这里不再重复基础定义。下面主要总结它们在工程实践中的特点。

### 1. Cookie

- 原理：将信息存储在浏览器 Cookie 中，客户端每次发请求时会自动携带 Cookie 信息，服务端可据此识别状态。
- 特点：
  - 自动发送：浏览器会自动把 Cookie 附加到请求头。
  - 安全控制：可通过 `HttpOnly`（防 XSS）、`Secure`（仅 HTTPS）、`SameSite`（防 CSRF）增强安全性。
  - 大小限制：单个 Cookie 通常不超过 4KB。

### 2. LocalStorage/SessionStorage

- 原理：登录后将 Token 或其他凭证存储在浏览器 `localStorage` 或 `sessionStorage` 中，前端请求时手动添加到 HTTP 头。
- 特点：
  - 存储容量较大，数据不会随请求自动发送。
  - 易受 XSS 影响，需要额外的前端安全防护。

### 3. 服务器端 Session

- 原理：登录后服务端生成唯一 Session ID 并保存到服务端存储；浏览器通过 Cookie 保存 Session ID。后续请求由服务端根据 Session ID 识别用户状态。
- 特点：
  - 服务端存储用户状态，安全性相对更高。
  - 在分布式系统里需要共享 Session 存储（例如 Redis 集群），否则会有状态不一致问题。

### 4. JWT（JSON Web Token）

- 原理：把用户信息编码为 Token，通常通过 Bearer Token 方式传给客户端。客户端保存后，后续请求通过 `Authorization` 头携带。
- 特点：
  - 无状态：服务端不必保存会话状态，更适合分布式系统。
  - 自包含：Token 可携带必要用户信息，减少部分数据库查询。
  - 安全边界明确：若缺乏签名与过期等策略，Token 可能被伪造或泄露。

![状态保持方式对比图1](/assets/81.png)

![状态保持方式对比图2](/assets/82.png)
