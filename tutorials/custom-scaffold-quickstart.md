---
title: 自定义脚手架：快速入门
date: 2024-03-15
description: 用最小实现跑通 CLI 脚手架，理解 shebang、bin、npm link 的完整链路。
---

# 自定义脚手架：快速入门

这是“自定义脚手架”系列的第一篇，目标是跑通一个**最小可用的 CLI**：能在终端被执行、知道命令是如何被解析和分发的。

## 为什么要自己做脚手架？

虽然 `vue-cli`、CRA 等已经很好用，但在实际工作中往往需要更符合公司要求的工程化配置，比如：

- 公司规范的 webpack 方案
- 统一的前端工具链
- API 封装与基础依赖
- 统一的项目结构与约束

这些事可以手动做（复制模板或下载旧项目），但把它们**固化进脚手架**会更省事：初始化更快、标准更统一、落地更一致。

顺带一提，自己做脚手架并不复杂，还能加深对 Node.js、npm、CLI 生态的理解。（偶尔还能小小装个 X 😄）

## 实现脚手架的核心思路

把脚手架抽象成一条固定流程，本质上就是：

1. 用户交互选择模板
2. 从 git 拉取模板到本地，并按交互结果写入配置/安装依赖
3. 美化输出（提示、进度、错误）

可选的是：把脚手架发布到 npm，像 `vue-cli` 一样全局安装后即可使用。

## 快速开始

### 1) 初始化项目

```bash
mkdir huige-cli
cd huige-cli
npm init -y
```

### 2) 使用 ESM

在 `package.json` 中添加：

```json
{
  "type": "module"
}
```

### 3) 创建可执行入口

新建 `index.js`：

```js
#!/usr/bin/env node

console.log('hello huige-cli')
```

给脚本增加可执行权限（Linux/macOS 必须）：

```bash
chmod +x index.js
```

**shebang 解释**

`#!/usr/bin/env node` 是脚本的解释器声明。  
当你直接运行 `./index.js` 时，系统会把 `#!` 后面的内容当作解释器：

```bash
env node ./index.js
```

为什么用 `/usr/bin/env`？  
为了不写死 Node 的绝对路径，让系统从当前环境的 `PATH` 中找到正确的 `node`。

心智模型：`/usr/bin/env` 是“找人机器”，`node` 是要找的人，脚本是要做的事。

### 4) 声明 bin

在 `package.json` 中增加 `bin` 字段：

```json
{
  "bin": {
    "huige-cli": "./index.js"
  }
}
```

`bin` 的作用：把可执行文件注册成命令。  
全局安装时会进入全局命令路径；本地安装时会映射到 `node_modules/.bin`。

链路是：

`bin` 声明命令名 → npm 创建命令入口（全局或 .bin） → 入口执行脚本 → shebang 找到 node → node 执行脚本

### 5) 本地调试（npm link）

先把包链接到全局：

```bash
npm link
```

检查是否成功：

```bash
npm list -g
```

你会看到类似输出：

```text
/home/vichel/.nvm/versions/node/v22.21.1/lib
└── huige-cli@1.0.0 -> ./../../../../../projects/person/huige-cli
```

说明：`npm link` 会在全局做一个“软连接”，模拟 `npm install -g` 的效果。  
真正的命令入口由 `package.json` 的 `bin` 字段决定。

### 6) 执行命令

```bash
huige-cli
```

你会看到：

```text
hello huige-cli
```

## 小结

到这里，你已经有了一个能跑起来的最小脚手架。下一步就是：

1. 通过nodejs代码拉取git repository 

2. 通过命令行交互，做出不同选择，拉取不同模板

这部分我们在后续文章展开。
