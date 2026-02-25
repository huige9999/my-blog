---
title: NestJS 教程 06：AOP 与装饰器切面实践
date: 2026-02-24
description: 通过 Before/After/Around 理解 AOP 的本质，并用 TypeScript 装饰器实现可复用切面。
---

# NestJS 教程 06：AOP 与装饰器切面实践

> 系列说明：本文是 NestJS 教程第 6 篇，目标是把日志、鉴权、耗时统计等横切逻辑从业务代码中抽离出来。

## 1. 为什么需要 AOP

后端代码常见问题是：业务逻辑里混入日志、权限、参数校验、异常映射、耗时统计。  
这些逻辑不属于某个单独业务，而是横跨多个接口的“横切关注点”。

AOP（面向切面编程）要做的就是：

- 抽离公共逻辑
- 在方法执行前后或执行过程织入
- 让业务代码保持单一职责

## 2. 关键术语速记

- `Aspect`：切面（公共逻辑模块）
- `Join Point`：连接点（可插入的位置）
- `Advice`：通知（Before/After/Around）
- `Weaving`：织入（将切面应用到目标）
- `Target`：被增强的方法/对象

在 JS/TS 里，AOP 的直观实现通常是“包装函数”。

## 3. 不用装饰器，先看 AOP 本质

```js
function before(fn, beforeFn) {
  return function (...args) {
    beforeFn(...args)
    return fn(...args)
  }
}

function after(fn, afterFn) {
  return function (...args) {
    const result = fn(...args)
    afterFn(result, ...args)
    return result
  }
}

function around(fn, aroundFn) {
  return function (...args) {
    return aroundFn(fn, args)
  }
}
```

## 4. 用 TS 方法装饰器实现 Before/After/Around

> 需要开启 `experimentalDecorators`。

### 4.1 Before

```ts
export function Before(beforeFn: (...args: any[]) => void) {
  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value
    descriptor.value = function (...args: any[]) {
      beforeFn(...args)
      return original.apply(this, args)
    }
  }
}
```

### 4.2 After

```ts
export function After(afterFn: (result: any, ...args: any[]) => void) {
  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value
    descriptor.value = function (...args: any[]) {
      const result = original.apply(this, args)
      afterFn(result, ...args)
      return result
    }
  }
}
```

### 4.3 Around

```ts
export function Around(aroundFn: (fn: (...args: any[]) => any, args: any[]) => any) {
  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value
    descriptor.value = function (...args: any[]) {
      return aroundFn(original.bind(this), args)
    }
  }
}
```

重点：`Around` 不要在装饰器内部额外调用原函数，应把执行控制权交给 `aroundFn`。

## 5. 完整示例：日志 + 耗时统计

```ts
class UserService {
  @Around((fn, args) => {
    const start = Date.now()
    console.log('[LOG] call with args:', args)

    try {
      const result = fn(...args)
      console.log('[LOG] return:', result)
      console.log('[TIME]', Date.now() - start, 'ms')
      return result
    } catch (e) {
      console.log('[ERROR]', e)
      console.log('[TIME]', Date.now() - start, 'ms')
      throw e
    }
  })
  getUserName(id: number) {
    return id === 1 ? 'jack' : 'unknown'
  }
}
```

收益是公共逻辑外置，业务函数保持干净。

## 6. AOP 适用边界

适合：

- 统一日志
- 权限鉴权
- 参数校验与转换
- 耗时统计与监控
- 事务、缓存、统一异常处理

不适合：

- 把复杂业务流程塞进切面
- 在切面里做大量无约束副作用
- 用 AOP 掩盖模块边界设计问题

## 小结

1. AOP 解决的是横切关注点复用与解耦
2. Before/After/Around 分别对应前置、后置、环绕增强
3. 在 NestJS 中，拦截器、守卫、过滤器都可视为 AOP 思想的工程化落地

下一篇：`NestJS 教程 08` 可以继续进入拦截器与异常过滤器的完整请求生命周期实践。
