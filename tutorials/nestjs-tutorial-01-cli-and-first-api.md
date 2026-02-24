---
title: NestJS 教程 01：快速上手 Nest CLI 与第一个接口
date: 2026-02-18
description: 从安装 CLI 到跑通第一个可测试的 NestJS 接口。
---

# NestJS 教程 01：快速上手 Nest CLI 与第一个接口

> 系列说明：本文是 NestJS 教程第 1 篇，目标是从 0 到跑通第一个可访问接口。

## 1. 安装 Nest CLI 与常用命令

Nest CLI 是 Nest 官方脚手架。先全局安装：

```bash
npm i -g @nestjs/cli
```

安装完成后可执行 `nest -h` 查看帮助。日常最常用命令如下：

- `nest new`（别名 `nest n`）：创建新项目
- `nest build`（别名 `nest b`）：构建项目
- `nest start`（别名 `nest s`）：启动项目
- `nest info`（别名 `nest i`）：查看环境与依赖信息
- `nest add`：安装插件或模块
- `nest generate`（别名 `nest g`）：生成模块化代码

## 2. 创建项目

先看参数：

```bash
nest new -h
```

常见参数：

- `--skip-git` / `--skip-install`：跳过初始化
- `--package-manager`：指定 npm/yarn/pnpm
- `--language`：TS 或 JS
- `--strict`：启用 TS 严格模式

创建项目：

```bash
nest n my-nest-project
```

生成后的核心结构：

```text
my-nest-project/
├── src/
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── nest-cli.json
├── package.json
└── tsconfig.json
```

## 3. 用 generate 快速搭骨架

常规生成：

```bash
nest g controller user
nest g service user
nest g module user
```

一键生成 RESTful CRUD 资源：

```bash
nest g resource person
```

交互时建议选择：

1. 传输层选 `REST API`
2. CRUD 入口选 `Y`

不想生成测试文件可加：

```bash
nest g resource order --no-spec
```

## 4. 初始化后 ESLint/Prettier 报红处理

新项目里常见“爆红”并非语法错误，通常是格式规则冲突或换行符（CRLF/LF）问题。可以在 `.eslintrc.js` 里加上：

```js
module.exports = {
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto'
      }
    ]
  }
}
```

## 5. 构建与 `nest-cli.json` 常用配置

构建：

```bash
nest build
nest build -b webpack
```

示例 `nest-cli.json`：

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "generateOptions": {
    "spec": false,
    "flat": false
  },
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": true
  }
}
```

## 6. 快速写一个可测试接口

`src/main.ts` 改端口：

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(8088)
}

bootstrap()
```

新增 `src/admin.entity.ts`：

```ts
export class Admin {
  constructor(
    private id: string,
    private name: string,
    private password: string
  ) {
    this.id = id
    this.name = name
    this.password = password
  }
}
```

修改 `src/app.service.ts`：

```ts
import { Injectable } from '@nestjs/common'
import { Admin } from './admin.entity'

@Injectable()
export class AppService {
  getAll(): Admin[] {
    return [
      new Admin('1', 'John Doe', 'password'),
      new Admin('2', 'Jane Doe', 'password'),
      new Admin('3', 'Jim Doe', 'password')
    ]
  }

  getOne(id: string): Admin {
    return new Admin(id, 'John Doe', 'password')
  }
}
```

修改 `src/app.controller.ts`：

```ts
import { Controller, Get, Param } from '@nestjs/common'
import { AppService } from './app.service'
import { Admin } from './admin.entity'

@Controller('admin')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAll(): Admin[] {
    return this.appService.getAll()
  }

  @Get(':id')
  getOne(@Param('id') id: string): Admin {
    return this.appService.getOne(id)
  }
}
```

启动并测试：

```bash
nest start -w
```

- `GET http://localhost:8088/admin`
- `GET http://localhost:8088/admin/1`

## 小结

这一篇完成了 NestJS 的最小闭环：创建项目、生成骨架、构建配置、跑通第一个接口。

下一篇：`NestJS 教程 02` 会讲清楚三层架构、MVC 以及它们在 NestJS 中怎么配合。
