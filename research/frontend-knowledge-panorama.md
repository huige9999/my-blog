---
title: 前端知识体系全景
date: 2025-11-07
description: 前端工程师完整知识体系全景图
---

> 以知识领域为维度，用层级标题穷举前端知识地图。从语言核心到架构前沿，覆盖前端工程师需要掌握的完整知识体系。

---

## 一、语言核心

### 1.1 JavaScript 语言原理

#### 1.1.1 执行机制
- 执行上下文（全局/函数/eval）
- 调用栈与执行栈
- 作用域（全局/函数/块级）
- 作用域链
- 闭包
- 变量提升与暂时性死区
- this 指向（默认/隐式/显式/new/箭头函数）

#### 1.1.2 原型与继承
- 原型对象
- 原型链
- `__proto__` 与 `prototype`
- `Object.create`
- `class` 语法糖
- 继承方式（原型链/构造函数/组合/寄生组合）
- `instanceof` 与 `isPrototypeOf`

#### 1.1.3 异步编程
- 回调函数
- Promise（手写实现）
- async / await
- 事件循环（Event Loop）
- 宏任务与微任务
- `queueMicrotask`
- `requestAnimationFrame`
- `requestIdleCallback`
- 异步迭代器 `for await...of`

#### 1.1.4 高级特性
- Proxy / Reflect
- Iterator / Generator
- Symbol
- WeakMap / WeakSet / WeakRef
- Map / Set
- 解构赋值
- 展开运算符
- 模板字面量与标签模板

#### 1.1.5 内存管理
- 垃圾回收机制（标记清除/引用计数）
- 内存泄漏场景
- WeakRef 与 FinalizationRegistry
- 内存分析工具

#### 1.1.6 模块化
- CommonJS（CJS）
- ES Modules（ESM）
- AMD / CMD
- UMD
- 动态导入 `import()`
- 模块解析机制

#### 1.1.7 编程思想
- 面向对象编程
- 函数式编程（纯函数/柯里化/组合/函子）
- 设计模式（单例/观察者/发布订阅/策略/代理/装饰器/工厂/适配器/迭代器）
- 数据结构（栈/队列/链表/树/图/哈希表）
- 算法（排序/搜索/递归/动态规划/贪心/回溯）
- 复杂度分析（时间/空间）

### 1.2 TypeScript 类型体系

#### 1.2.1 基础类型
- 原始类型注解
- 数组/元组
- enum 枚举
- union / intersection
- literal types 字面量类型
- `unknown` / `any` / `never` / `void`

#### 1.2.2 泛型
- 泛型函数
- 泛型接口
- 泛型类
- 泛型约束 `extends`
- 默认泛型参数
- 常用泛型工具（`Record` / `Partial` / `Required` / `Pick` / `Omit` / `Exclude` / `Extract` / `ReturnType`）

#### 1.2.3 高级类型
- 条件类型 `Conditional Types`
- 映射类型 `Mapped Types`
- 索引类型 `Index Types`（`keyof` / 索引访问）
- 模板字面量类型
- 递归类型
- 类型推导 `infer`
- 类型守卫 `Type Guards`
- 函数重载

#### 1.2.4 工程类型
- 声明文件 `.d.ts`
- 命名空间 `namespace`
- 模块类型
- `tsconfig.json` 配置
- 类型体操（实战练习）
- 组件 Props 类型设计
- 接口返回类型建模
- SDK 类型导出

---

## 二、Web 平台

### 2.1 HTML

#### 2.1.1 文档结构
- DOCTYPE 与文档模式
- 语义化标签（`header` / `nav` / `main` / `article` / `section` / `aside` / `footer`）
- 元信息标签（`meta` / `link` / `title` / `base`）
- SEO 相关标签

#### 2.1.2 表单与交互
- 表单元素与属性
- 表单验证（内置 / 自定义）
- 新增输入类型（`date` / `email` / `range` / `color`）
- `datalist` / `output`

#### 2.1.3 多媒体
- `video` / `audio`
- `picture` / `source`
- `track` 字幕

#### 2.1.4 Web Components
- Custom Elements
- Shadow DOM
- HTML Templates (`template` / `slot`)

### 2.2 CSS

#### 2.2.1 布局
- 盒模型（`content-box` / `border-box`）
- Flexbox
- Grid
- 浮动与清除浮动
- 定位（`static` / `relative` / `absolute` / `fixed` / `sticky`）
- 多列布局
- 响应式设计（媒体查询 / `clamp()` / 容器查询）

#### 2.2.2 视觉
- 渐变（线性 / 径向 / 锥形）
- 阴影（`box-shadow` / `text-shadow` / `filter: drop-shadow`）
- 滤镜 `filter`
- 混合模式 `mix-blend-mode`
- 裁剪与遮罩 `clip-path` / `mask`
- `object-fit` / `object-position`

#### 2.2.3 动画
- `transition`
- `@keyframes` + `animation`
- `transform`（2D / 3D）
- `will-change`
- `@scroll-timeline` 滚动驱动动画
- `View Transitions API`

#### 2.2.4 现代 CSS
- CSS 变量（自定义属性）
- CSS 嵌套
- `:has()` / `:is()` / `:where()` / `:not()`
- `calc()` / `min()` / `max()` / `clamp()`
- `color-mix()` / 相对颜色
- 逻辑属性（`margin-inline` / `padding-block`）
- `@layer` 层叠层
- `@container` 容器查询
- `subgrid`
- `accent-color`
- `scroll-snap`
- `text-wrap: balance`

#### 2.2.5 预处理器与方案
- Sass / SCSS
- Less
- PostCSS
- Tailwind CSS
- CSS Modules
- CSS-in-JS（Styled Components / Emotion）
- 原子化 CSS（UnoCSS）

### 2.3 DOM

#### 2.3.1 节点操作
- 节点类型（元素/文本/属性/注释/文档）
- 节点增删改查
- `querySelector` / `querySelectorAll`
- `closest` / `matches`
- 节点克隆与替换

#### 2.3.2 属性与样式
- 特性操作（`getAttribute` / `setAttribute` / `dataset`）
- 类名操作（`classList`）
- 样式操作（`style` / `getComputedStyle`）
- 尺寸与位置（`offsetWidth` / `clientWidth` / `scrollWidth` / `getBoundingClientRect`）
- `IntersectionObserver`

### 2.4 事件系统

#### 2.4.1 事件机制
- 事件传播（捕获 → 目标 → 冒泡）
- 事件委托
- `addEventListener` / `removeEventListener`
- `event.preventDefault` / `event.stopPropagation` / `event.stopImmediatePropagation`

#### 2.4.2 事件类型
- 鼠标事件
- 键盘事件
- 触摸事件
- 拖拽事件
- 滚动事件
- 输入事件（`input` / `change` / `compositionend`）
- 手势事件（`pointerdown` / `pointermove` / `pointerup`）
- 自定义事件（`CustomEvent` / `dispatchEvent`）

### 2.5 浏览器机制

#### 2.5.1 渲染原理
- 渲染流水线（解析 → 构建 DOM/CSSOM → 布局 → 绘制 → 合成）
- 回流（Reflow）与重绘（Repaint）
- 合成层与 GPU 加速
- 关键渲染路径
- 层叠上下文

#### 2.5.2 存储
- Cookie
- `localStorage` / `sessionStorage`
- `IndexedDB`
- `Cache API`
- `StorageManager`

#### 2.5.3 线程与进程
- 浏览器多进程架构
- 渲染进程（主线程 / 合成线程 / 光栅线程）
- Web Worker
- Service Worker
- SharedWorker
- `postMessage` 跨线程通信

#### 2.5.4 历史、导航与路由
- `History API`（`pushState` / `replaceState` / `popstate`）
- `Navigation API`
- `Hash` 路由
- URL / Location / URLSearchParams

### 2.6 Web API

#### 2.6.1 图形
- Canvas 2D
- SVG
- WebGL
- WebGPU

#### 2.6.2 媒体
- `getUserMedia`（摄像头/麦克风）
- MediaRecorder
- WebRTC
- Web Audio API
- Speech API（语音识别/合成）

#### 2.6.3 文件
- `File` / `Blob` / `FileReader`
- `File System Access API`
- 拖拽上传
- 断点续传

#### 2.6.4 其他
- `Clipboard API`
- `Notification API`
- `Fullscreen API`
- `Geolocation API`
- `Web Share API`
- `ResizeObserver`
- `MutationObserver`
- `PerformanceObserver`
- `requestAnimationFrame`
- `requestIdleCallback`
- PWA（`manifest` / `Service Worker` / 离线缓存）

---

## 三、框架生态

### 3.1 Vue 体系

#### 3.1.1 Vue 3 核心
- 响应式原理（`Proxy` / `reactive` / `ref` / `computed` / `watch` / `watchEffect`）
- Composition API
- 模板编译（模板 → AST → 渲染函数）
- 虚拟 DOM 与 Diff 算法
- 组件通信（`props` / `emit` / `provide/inject` / `v-model`）
- 生命周期钩子
- 自定义指令
- 插件机制
- 内置组件（`Teleport` / `Suspense` / `KeepAlive` / `Transition` / `TransitionGroup`）
- `<script setup>` 语法

#### 3.1.2 Vue 生态
- Vue Router（路由配置 / 守卫 / 懒加载 / 动态路由）
- Pinia（Store 定义 / Action / Getter / 插件 / 持久化）
- VueUse（工具函数集）
- Vuex（Vue 2 状态管理）
- Element Plus / Ant Design Vue / Naive UI
- Vuetify / PrimeVue

#### 3.1.3 Vue SSR
- Nuxt 3（约定式路由 / 服务端渲染 / 静态生成 / 混合渲染）
- `createSSRApp`

### 3.2 React 体系

#### 3.2.1 React 核心
- JSX 编译机制
- 函数组件
- Hooks（`useState` / `useEffect` / `useMemo` / `useCallback` / `useRef` / `useContext` / `useReducer` / `useImperativeHandle` / `useLayoutEffect` / `useId`）
- 自定义 Hooks
- 组件渲染机制
- Fiber 架构
- 调和（Reconciliation）与 Diff
- 并发模式（Concurrent Mode / `startTransition` / `useDeferredValue`）
- 错误边界（Error Boundary）
- Context
- `forwardRef`
- Suspense
- Server Components

#### 3.2.2 React 生态
- React Router（路由配置 / 嵌套路由 / 路由守卫 / 数据路由）
- Redux（Store / Action / Reducer / Middleware / Toolkit）
- Zustand
- Jotai
- Recoil
- React Query / TanStack Query（服务端状态管理）
- SWR
- Ant Design / Material UI / Chakra UI / shadcn/ui
- React Hook Form / Formik
- React Use / Ahooks

#### 3.2.3 React SSR
- Next.js（App Router / Pages Router / SSR / SSG / ISR / RSC）
- Remix

### 3.3 状态管理（跨框架）

#### 3.3.1 状态分类
- 本地状态（组件内部）
- 全局状态（应用共享）
- 服务端状态（接口数据缓存）
- URL 状态（路由参数）
- 表单状态（表单数据与校验）
- 缓存状态（本地持久化）

#### 3.3.2 状态管理方案
- Flux 架构思想
- 响应式状态（Proxy / Signal）
- 原子化状态（Jotai / Recoil）
- 有限状态机（XState）
- 状态持久化策略

### 3.4 其他框架
- Angular（模块 / 依赖注入 / RxJS / 信号）
- Svelte（编译时框架 / SvelteKit）
- Solid.js（细粒度响应式 / 无虚拟 DOM）
- Qwik（可恢复性 / 延迟加载）
- Preact（轻量 React）

---

## 四、前端工程化

### 4.1 构建工具

#### 4.1.1 Webpack
- 入口/输出/Loader/Plugin
- 代码分割（`splitChunks`）
- Tree Shaking
- 模块联邦（Module Federation）
- 性能优化（缓存/多线程/分包）
- Loader 编写
- Plugin 编写

#### 4.1.2 Vite
- 开发服务器（ESM 原生导入）
- 预构建（Esbuild 依赖预打包）
- Rollup 生产构建
- 插件机制（Rollup 插件兼容）
- HMR 热更新原理
- 环境变量与模式

#### 4.1.3 其他构建工具
- Rollup（库打包 / Tree Shaking）
- Esbuild（极速编译）
- Rspack（Rust Webpack 替代）
- Turbopack
- Parcel
- SWC（Rust 编写的 Babel 替代）

#### 4.1.4 编译与转译
- Babel（AST 转换 / Preset / Plugin）
- PostCSS（CSS AST 转换 / Autoprefixer）
- SWC

### 4.2 包管理

#### 4.2.1 包管理器
- npm
- yarn
- pnpm（硬链接/符号链接/store 机制）
- Corepack

#### 4.2.2 包管理策略
- 语义化版本（SemVer）
- 锁文件（`package-lock` / `yarn.lock` / `pnpm-lock`）
- 依赖类型（`dependencies` / `devDependencies` / `peerDependencies`）
- npm scripts
- Monorepo（pnpm workspace / Turborepo / Nx / Lerna）
- npm 发包与版本管理

### 4.3 代码规范

#### 4.3.1 静态检查
- ESLint（规则 / 插件 / 配置继承）
- Stylelint（CSS 规范）
- TSLint（已废弃，迁移至 ESLint）
- Markuplint（HTML 规范）
- `tsc --noEmit`（类型检查）

#### 4.3.2 格式化
- Prettier
- EditorConfig

#### 4.3.3 提交规范
- Commitlint（提交信息规范）
- Husky（Git Hooks）
- `lint-staged`
- Conventional Commits

### 4.4 CI / CD

#### 4.4.1 持续集成
- GitHub Actions
- GitLab CI
- Jenkins
- 自动化流水线配置

#### 4.4.2 部署
- 静态部署（Nginx / CDN）
- Docker 容器化
- 多环境部署（dev / staging / production）
- 灰度发布
- 版本回滚
- Serverless 部署

### 4.5 版本管理
- Git（分支策略 / Rebase vs Merge / Cherry-pick / Stash）
- Git Flow / GitHub Flow / Trunk-based
- 代码审查（Code Review）
- CHANGELOG 管理
- `changesets` / `standard-version`

---

## 五、网络与通信

### 5.1 网络协议

#### 5.1.1 HTTP
- HTTP/1.1（请求方法 / 状态码 / Header / 缓存控制）
- HTTP/2（多路复用 / 头部压缩 / 服务端推送）
- HTTP/3（QUIC / UDP）
- HTTPS（TLS / 证书 / 握手）
- TCP 三次握手 / 四次挥手
- DNS 解析
- CDN 原理

#### 5.1.2 实时通信
- WebSocket
- Server-Sent Events（SSE）
- WebRTC
- Socket.IO
- 长轮询 / 短轮询

### 5.2 API 设计与通信

#### 5.2.1 接口规范
- RESTful API
- GraphQL（Schema / Resolver / 查询 / 变更 / 订阅）
- gRPC（Protocol Buffers）
- tRPC（端到端类型安全）
- OpenAPI / Swagger（接口文档）

#### 5.2.2 请求处理
- `fetch` / `XMLHttpRequest`
- Axios（拦截器 / 取消请求 / 重试）
- 请求取消（`AbortController`）
- 请求重试策略
- 并发控制
- 防抖与节流
- 接口缓存
- Mock 数据（Mock.js / MSW）

#### 5.2.3 接口封装
- 统一 Request 封装
- 错误码设计
- 错误处理机制
- 登录过期处理
- 全局 Loading
- 请求/响应拦截
- 接口类型自动生成

### 5.3 鉴权与安全

#### 5.3.1 认证
- Cookie + Session
- Token（JWT）
- Refresh Token
- OAuth 2.0
- SSO 单点登录
- CAS

#### 5.3.2 跨域
- 同源策略
- CORS（简单请求 / 预检请求）
- JSONP
- 代理服务器
- `postMessage` 跨域通信

#### 5.3.3 安全防护
- XSS（反射型 / 存储型 / DOM 型）
- CSRF
- CSP（内容安全策略）
- 点击劫持
- 敏感信息保护
- 前端加密边界
- 依赖安全审计（`npm audit`）

---

## 六、跨端开发

### 6.1 移动端 H5

#### 6.1.1 移动 Web
- 响应式适配（`rem` / `vw` / `vh`）
- `viewport` 配置
- 1px 问题
- 安全区域（`safe-area-inset`）
- 触摸事件处理
- 手势库（Hammer.js / AlloyFinger）
- 移动端调试

### 6.2 小程序

#### 6.2.1 微信小程序
- WXML / WXSS / WXS
- 原生组件与自定义组件
- 生命周期
- 路由与导航
- 开放能力（登录 / 支付 / 分享）
- 云开发

#### 6.2.2 其他小程序
- 支付宝小程序
- 百度小程序
- 抖音小程序
- 快手小程序

### 6.3 跨端框架

#### 6.3.1 UniApp
- Vue 语法跨端
- 条件编译
- 原生插件
- 多端发布

#### 6.3.2 Taro
- React / Vue 语法跨端
- 多端适配

#### 6.3.3 跨端原生渲染
- React Native
- Flutter
- Weex

### 6.4 桌面端

#### 6.4.1 Electron
- 主进程与渲染进程
- IPC 通信
- 原生 API 调用
- 打包与分发
- 自动更新
- 性能优化

#### 6.4.2 其他桌面方案
- Tauri（Rust + Web）
- Wails（Go + Web）

### 6.5 其他端
- 浏览器插件（Chrome Extension / Manifest V3）
- Hybrid App（WebView / JSBridge）
- 快应用
- 智能电视 / 车机端

---

## 七、服务端与全栈

### 7.1 Node.js

#### 7.1.1 核心机制
- 事件循环（Node 与浏览器的差异）
- 模块系统（CJS / ESM）
- Buffer / Stream
- `fs` 文件系统
- `path` / `url` / `querystring`
- `child_process` / `cluster`
- `net` / `http` / `https`
- 错误处理与进程管理

#### 7.1.2 框架
- Express
- Koa（中间件 / 洋葱模型）
- NestJS（模块 / 控制器 / 服务 / 守卫 / 拦截器 / 管道 / 装饰器）
- Egg.js
- Fastify
- Hono

### 7.2 数据库

#### 7.2.1 关系型
- MySQL（基础 SQL / 索引 / 事务 / 连接查询）
- PostgreSQL

#### 7.2.2 非关系型
- MongoDB（文档存储 / Mongoose）
- Redis（缓存 / 会话 / 消息队列）

#### 7.2.3 ORM
- Prisma
- TypeORM
- Sequelize
- Drizzle ORM

### 7.3 BFF 与服务聚合
- BFF 层设计
- 接口聚合与裁剪
- 权限中间层
- 数据格式转换
- GraphQL 网关

### 7.4 部署与运维

#### 7.4.1 服务部署
- Linux 基础
- Nginx（反向代理 / 负载均衡 / 静态服务）
- Docker（镜像 / 容器 / Dockerfile / Docker Compose）
- PM2 进程管理

#### 7.4.2 运维与自动化
- CI/CD 流水线
- 日志系统
- 监控告警
- 自动化运维
- Kubernetes 基础

### 7.5 SSR 与 SSG
- 服务端渲染原理
- 静态站点生成
- ISR（增量静态再生）
- Hydration（水合）
- 流式 SSR

---

## 八、可视化与图形

### 8.1 图形基础

#### 8.1.1 Canvas
- 2D 绑图 API
- 动画与帧循环
- 像素操作
- 离屏 Canvas
- 性能优化

#### 8.1.2 SVG
- 基本图形
- `path` 与路径命令
- `viewBox` 与坐标系统
- SVG 动画
- SVG 滤镜

#### 8.1.3 WebGL / WebGPU
- 着色器（Vertex Shader / Fragment Shader）
- 缓冲区与属性
- 纹理映射
- 光照模型
- 矩阵变换
- WebGPU（计算着色器）

### 8.2 可视化库

#### 8.2.1 图表
- ECharts（配置式 / 大数据量 / 联动）
- AntV（G2 / G6 / S2 / L7）
- Chart.js
- D3.js（数据驱动 / 底层绑定）

#### 8.2.2 3D
- Three.js（场景 / 相机 / 材质 / 光源 / 动画）
- Babylon.js
- Cesium（地图 3D）

#### 8.2.3 动画
- GSAP
- Lottie
- Framer Motion（React）
- Anime.js
- CSS 动画

### 8.3 专业场景

#### 8.3.1 富文本编辑
- 富文本编辑器原理
- ProseMirror / TipTap
- Slate.js
- Quill
- 协同编辑（OT / CRDT）

#### 8.3.2 图形编辑
- 拖拽编排
- 流程图 / 拓扑图（AntV X6 / JointJS / GoJS）
- 节点编辑器
- 低代码画布
- bpmn.js

#### 8.3.3 地图
- 地图引擎（Mapbox / Leaflet / 高德 / 百度地图）
- 地理信息可视化
- 大屏数据可视化

---

## 九、性能、质量与安全

### 9.1 性能优化

#### 9.1.1 加载性能
- 首屏优化
- 白屏优化
- 代码分割与懒加载
- 资源预加载（`preload` / `prefetch` / `preconnect`）
- 图片优化（格式 / 压缩 / 响应式 / 懒加载 / WebP / AVIF）
- 字体优化
- HTTP 缓存策略（强缓存 / 协商缓存）
- CDN 加速
- Gzip / Brotli 压缩
- Tree Shaking
- 包体积分析与优化

#### 9.1.2 渲染性能
- 关键渲染路径优化
- 减少回流与重绘
- 虚拟列表 / 虚拟滚动
- 复杂计算转移（Web Worker）
- `requestAnimationFrame` 调度
- GPU 加速（`transform` / `will-change`）
- 避免强制同步布局

#### 9.1.3 运行时性能
- 防抖与节流
- 事件委托
- 内存泄漏排查
- 长任务拆分
- 大数据渲染优化

#### 9.1.4 性能指标与监控
- Core Web Vitals（LCP / FID / CLS / INP）
- Performance API
- Lighthouse
- 性能监控方案
- 性能预算

### 9.2 测试

#### 9.2.1 测试类型
- 单元测试
- 组件测试
- 集成测试
- E2E 端到端测试
- 快照测试
- 视觉回归测试
- 性能测试
- 可访问性测试

#### 9.2.2 测试工具
- Vitest
- Jest
- Testing Library（`@testing-library/vue` / `@testing-library/react`）
- Cypress
- Playwright
- Mock Service Worker（MSW）
- Puppeteer

#### 9.2.3 测试策略
- 测试金字塔
- 测试覆盖率
- Mock 与 Stub
- TDD 测试驱动开发

### 9.3 监控与质量

#### 9.3.1 错误监控
- 异常捕获（`window.onerror` / `unhandledrejection`）
- 错误上报
- Source Map 反解
- 日志系统
- 错误边界

#### 9.3.2 行为监控
- 埋点（手动 / 自动 / 无痕）
- 用户行为追踪
- 页面 PV / UV
- 自定义事件上报

#### 9.3.3 性能监控
- Web Vitals 采集
- 资源加载耗时
- 接口耗时
- 渲染帧率

#### 9.3.4 质量门禁
- 代码评审机制
- Lint 门禁
- 测试覆盖率门禁
- 灰度发布策略
- 回滚机制

### 9.4 安全

#### 9.4.1 前端安全
- XSS 防御（转义 / CSP / HttpOnly Cookie）
- CSRF 防御（Token / SameSite）
- 点击劫持防御（`X-Frame-Options` / CSP）
- 前端水印
- 防调试
- URL 安全

#### 9.4.2 供应链安全
- 依赖安全审计
- 锁文件完整性
- 私有 npm 仓库安全
- CI/CD 管道安全

#### 9.4.3 数据安全
- 敏感信息脱敏
- 前端加密（RSA / AES / HTTPS）
- 权限控制（RBAC / ABAC）
- 接口越权防护
- 上传安全

---

## 十、架构与前沿

### 10.1 前端架构

#### 10.1.1 项目架构
- 目录结构设计
- 模块划分与职责分层
- 业务域划分
- 分层架构（`views` / `components` / `hooks` / `services` / `api` / `utils` / `constants` / `types`）
- 路由模型
- 权限模型（路由权限 / 按钮权限 / 数据权限）
- 多租户架构

#### 10.1.2 业务建模
- 表单模型（动态表单 / 联动 / 校验 / Schema 驱动）
- 表格模型（列配置 / 虚拟滚动 / 可编辑 / 导入导出）
- 字典模型
- 枚举模型
- 菜单模型
- 状态机模型

#### 10.1.3 架构模式
- 插件化架构
- 配置化架构
- 领域驱动设计（DDD）
- 洋葱架构
- 六边形架构

### 10.2 基础设施

#### 10.2.1 组件库
- 组件库设计（设计规范 / API 设计 / 文档 / 主题系统）
- 组件库开发（Vue 组件库 / React 组件库）
- 组件库打包与发布
- 组件库文档（Storybook / VitePress / Dumi）
- 物料体系

#### 10.2.2 脚手架
- 项目脚手架设计
- 脚手架开发（CLI / 模板引擎 / 交互式问答）
- 脚手架插件机制

#### 10.2.3 工具链
- 代码生成器
- 接口类型自动生成
- 图标管理
- 国际化工具链
- 设计稿转代码（D2C）

### 10.3 微前端

#### 10.3.1 微前端方案
- qiankun
- Module Federation
- single-spa
- wujie
- iframe 方案
- Web Components 方案

#### 10.3.2 微前端关键问题
- 应用间通信
- 样式隔离
- JS 沙箱
- 公共依赖处理
- 路由管理
- 子应用生命周期

### 10.4 低代码

#### 10.4.1 低代码平台
- 页面搭建（拖拽 / 配置 / 渲染）
- 表单设计器
- 流程设计器
- 报表设计器
- 物料与组件管理
- 出码与 schema

#### 10.4.2 相关技术
- JSON Schema
- 动态渲染引擎
- 表达式引擎
- 事件绑定机制
- 数据源管理

### 10.5 国际化
- i18n 方案（`vue-i18n` / `react-intl` / `i18next`）
- 语言包管理
- 动态切换
- 日期 / 数字 / 货币格式化
- RTL 适配

### 10.6 主题系统
- CSS 变量方案
- 预处理器方案
- 运行时主题切换
- 暗黑模式
- 品牌色定制

### 10.7 AI + 前端

#### 10.7.1 AI 应用前端
- Chat UI（对话界面 / 流式输出 / 打字机效果）
- 多轮会话管理
- 上下文管理
- 中断与重新生成
- 知识库管理界面
- 文档上传与解析界面
- Agent 工作流 UI
- MCP 工具管理
- Prompt 管理
- 模型参数配置
- 调用日志与 Trace 可视化

#### 10.7.2 AI 工程化
- LangChain
- LangGraph
- 流式响应处理（SSE / WebSocket）
- 向量检索前端
- AI Copilot 嵌入业务系统
- AI 表单生成 / AI 报表生成
- 低代码 + AI
- 从零实现 Coding Agent

#### 10.7.3 AI 辅助开发
- AI Code Review
- AI 辅助测试
- AI 辅助调试
- AI IDE（Cursor / Copilot / Claude Code）

### 10.8 前沿关注
- Edge Computing（边缘计算）
- WebAssembly（WASM）
- Web Components 标准化
- WebGPU 普及
- AI Native 应用架构
- B/S 与 C/S 融合
