---
title: NestJS 教程 10：适配器模式与平台抽象
date: 2026-02-27
description: 从 Adapter Pattern 到 Nest 平台适配，理解 Express 与 Fastify 可切换的底层机制。
---

# NestJS 教程 10：适配器模式与平台抽象

> 系列说明：本文是 NestJS 教程第 10 篇，目标是把“适配器模式”从概念映射到 NestJS 的平台层实现。

适配器模式（Adapter Pattern）解决的问题很朴素：当两个对象接口不兼容，但你又希望它们协作时，用一个“转接头”做接口翻译。

在 NestJS 里，这个模式非常关键：应用层代码尽量保持统一，而底层 HTTP 平台可以在 Express 和 Fastify 之间切换。

## 1. 适配器到底在适配什么

本质就是接口翻译：

- 业务代码只认统一接口（例如只调用 `quack()`）
- 真实对象接口不一致（鸭子有 `quack()`，鸡有 `cluck()`）
- 不改业务代码、不改对象源码，通过适配器做转发

## 2. 动物叫声例子

### 2.1 不兼容对象

```ts
class Duck {
  quack() {
    console.log('小鸭 嘎嘎嘎')
  }
}

class Chicken {
  cluck() {
    console.log('小鸡 咯咯咯')
  }
}
```

### 2.2 统一目标接口

```ts
interface Quackable {
  quack(): void
}
```

```ts
function makeItQuack(animal: Quackable) {
  animal.quack()
}
```

### 2.3 适配器实现

```ts
class AnimalAdapter implements Quackable {
  private animal: any
  private soundMethod: string

  constructor(animal: any, soundMethod: string) {
    this.animal = animal
    this.soundMethod = soundMethod
  }

  quack() {
    if (this.soundMethod in this.animal) {
      this.animal[this.soundMethod]()
    } else {
      console.log('动物没有这个叫声方法')
    }
  }
}
```

使用：

```ts
const duck = new Duck()
const chicken = new Chicken()

// const adapter = new AnimalAdapter(duck, 'quack')
const adapter = new AnimalAdapter(chicken, 'cluck')
makeItQuack(adapter)
```

这是典型的对象适配器（组合/委托），也是 JS/TS 最常见写法。

## 3. 映射到 NestJS：Express/Fastify 就像 Duck/Chicken

类比关系：

- `Quackable`：Nest 对平台能力的统一抽象
- Duck/Chicken：Express/Fastify（API 不同）
- `AnimalAdapter`：`ExpressAdapter`/`FastifyAdapter`
- `makeItQuack`：Nest 核心请求处理流程

## 4. 代码里的适配器证据

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
```

`new FastifyAdapter()` 就是在替换底层转接头。

## 5. 可插拔底座不等于绝对无感切换

如果你在 Controller 里直接绑定 Fastify 类型：

```ts
import { Controller, Get, Req, Res } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

@Controller()
export class AppController {
  @Get()
  getHello(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
    console.log(request.url)
    response.send('hello')
  }
}
```

这段代码就已经偏向 Fastify。好处是可用平台特性，代价是迁移回 Express 时需要改造。

## 6. 两张简图

动物例子：

```text
makeItQuack(Quackable)
        |
        v
 AnimalAdapter.quack()
        |
        v
 chicken["cluck"]()  或  duck["quack"]()
```

Nest 平台适配：

```text
Nest 核心请求处理流程（统一）
        |
        v
Platform Adapter（FastifyAdapter / ExpressAdapter）
        |
        v
Fastify API / Express API（具体实现）
```

## 小结

1. 适配器模式核心是隔离变化，稳定上层接口。
2. Nest 通过平台适配器实现 Express/Fastify 的可切换。
3. 你可以写平台无关代码，也可以主动绑定平台特性，但要接受迁移成本。

