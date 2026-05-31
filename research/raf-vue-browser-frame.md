---
title: 理解 requestAnimationFrame、Vue 更新与浏览器一帧
date: 2025-11-11
description: requestAnimationFrame、Vue 更新机制与浏览器一帧渲染的关系
---

## 前言

在做前端动画或复杂 DOM 操作时，你是否遇到过这些玄学问题：修改了 CSS 但动画没触发？刚改了数据去拿 DOM 尺寸却是旧的？加了个 `setTimeout` 莫名其妙就修好了 Bug？

很多时候，这些卡点源于我们在脑海中把**"JS 事件循环"**、**"Vue 的响应式更新"**和**"浏览器的一帧渲染"**混为一谈了。

今天，我们就来彻底拆解这三者的关系，重塑你的前端运行心智模型。

---

## 误区诊断：你是否也踩过这 3 个坑？

在深入探讨前，先自测一下你对前端执行时机的理解是否有以下偏差：
1. **概念混淆**：把"下一轮微任务清空"等同于"浏览器开始画下一帧"。
2. **对 rAF 的误解**：以为 `requestAnimationFrame`（简称 rAF）是在"下一轮虚拟 DOM 更新前执行"，其实它是**"浏览器下一次真实绘制前执行"**。
3. **框架幻觉**：以为在 Vue 里写下 `this.translateX = 100`，DOM 的 style 就立刻变了。

如果全中，别慌，因为这三条线的确极易混淆。我们先把它们剥离开来。

---

## 第一层剖析：解开两条并行的"时间线"

在浏览器的主线程里，其实有两条不同职责的流水线：**事件循环（Event Loop）**与**渲染帧（Render Frame）**。

### 1. 事件循环：决定 JS "按什么顺序执行"
这里包含了所有的代码逻辑安排：同步代码、`setTimeout`（宏任务）、`Promise.then`（微任务）、Vue 的 `$nextTick` 等。
它关心的仅仅是：**这段代码什么时候轮到它跑。**

### 2. 渲染帧：决定浏览器 "什么时候画新画面"
这里包含了：样式计算（Style）、布局（Layout）、绘制（Paint）、合成（Composite）。
它关心的是：**什么时候把计算好的结果呈现到屏幕上。**

**核心铁律：主线程一次只能做一件事。**
跑 JS 时，浏览器绝对不能绘制；浏览器想绘制，也必须等当前这块 JS 跑完。如果一段 JS 跑了 100ms，浏览器就会干等，这就是"掉帧卡顿"的元凶。

---

## 第二层剖析：重构一帧的心智模型

在 60Hz 的屏幕下，浏览器大约每 **16.67ms** 有一次更新画面的机会。那么在这 16.67ms 内，到底发生了什么？

以前你的心智模型可能是：*一帧开始 -> 清空微任务 -> 跑 JS -> 绘制。*

**现在，请把它替换成这个更精确的模型：**

```text
【一个 JS 任务执行（如 click 回调）】
      ↓
【清空当前所有的微任务 (Promise.then / nextTick)】
      ↓
浏览器判断：到时间该渲染新画面了吗？
      ↓
如果到了，准备渲染：
   1. 执行 requestAnimationFrame (rAF) 回调
      ↓
   2. 清空 rAF 里产生的微任务
      ↓
   3. 计算样式 (Style) -> 布局 (Layout) -> 绘制 (Paint)
```

**划重点：**
* **微任务不是每一帧开头清空的**，而是每一个 JS 任务结束后立刻清空。
* **rAF 的真实身份**：它不是普通的定时器，它是**"渲染前的最后通牒"**。它的潜台词是："浏览器你要开始画图了是吧？画之前先把我执行了！"

---

## 第三层剖析：打破 Vue 的"同步幻觉"

在引入业务场景前，我们还要再加一条线：Vue 的更新机制。

当你在 Vue 中写下：`this.translateX = 100;`
真实发生的并不是 DOM 立刻改变，而是一个异步接力赛：

```text
1. 你的代码：this.translateX = 100 (改 Vue 响应式数据)
      ↓
2. Vue 收集依赖，把更新推入异步队列 (微任务)
      ↓
3. Vue 执行异步 Patch，将变更更新到真实 DOM
      ↓
4. (这时候 DOM 才变)
      ↓
5. 浏览器计算样式并绘制 (屏幕才变)
```

---

## 实战演练：用两个复杂动画场景验证理论

现在理论武装完毕，我们来看两段真实世界中的 Vue 滚动动画组件代码，看看这三条线是如何精妙配合的。

### 场景一：优雅地启动一个 CSS 过渡动画

```javascript
startScroll() {
  // 1. 先设置过渡时间
  this.transitionDuration = distance / moveSpeed;

  // 2. 利用 rAF 延迟设置位移
  this.frameTimer = requestAnimationFrame(() => {
    this.translateX = -distance;
  });
}
```

**为什么要用 rAF 隔开？不能直接连着写吗？**
如果不隔开，`transitionDuration` 和 `translateX` 同步设置，Vue 会在同一个 Tick 里把它们 patch 到 DOM 上。浏览器看到的是："哦，状态直接变成终点了"，**这会直接跳到最后的状态，没有动画过程。**

加上 rAF 后，时间线变成了这样：
1. JS 执行，Vue 记录 `transitionDuration = Ns`。
2. 当前 JS 结束，Vue 触发 DOM patch，此时 DOM 具备了过渡时间，但位移还是 0。
3. **浏览器准备绘制下一帧，触发 rAF！**
4. rAF 回调执行：修改 `translateX = -distance`。
5. Vue 再次收集更新并 patch DOM。
6. 浏览器进行样式计算：发现 `transform` 从 0 变到了 -distance，且 `transition-duration > 0`。
7. **完美！触发 CSS Transition 动画。**

*总结：startScroll 里的 rAF，是为了让 transitionDuration 先落到 DOM 上，下一帧再改 transform，从而稳稳地触发 CSS 动画。*

### 场景二：重置状态并重新计算尺寸

```javascript
refresh() {
  // 1. 重置所有状态
  this.translateX = 0;
  this.transitionDuration = 0;

  // 2. 这里的嵌套是为了什么？
  this.$nextTick(() => {
    this.frameTimer = requestAnimationFrame(() => {
      this.tryStartScroll(); // 里面会读取 DOM 的 clientWidth 和 scrollWidth
    });
  });
}
```

这段代码叠加了 `$nextTick` 和 `rAF`，看似多此一举，其实暗藏玄机。

**完整执行顺序如下：**
1. 设置 `translateX = 0` 等，重置数据。
2. Vue 异步更新 DOM（此时真实 DOM 回到了 0 的状态）。
3. **`$nextTick` 触发**：保证了此时 Vue 已经把 DOM patch 完毕。
4. **为什么要再套一层 rAF？** 因为 `$nextTick` 只保证 DOM 节点本身更新了，但**浏览器可能还没来得及做布局（Layout）和重绘（Paint）**。
5. **`rAF` 触发**：此时浏览器即将绘制新的一帧。此时去调用 `tryStartScroll()` 获取 `clientWidth` 等尺寸，不仅能拿到绝对准确的最新值，还能避免在 JS 执行中途强行读取布局导致的**强制同步布局（Layout Thrashing）**，保证性能。

*总结：refresh 里的 rAF，是为了等 Vue 重置完 DOM 后，在浏览器下一帧绘制前读取最准确的最新尺寸，以判断是否需要开启新的滚动。*

---

## 终极心智模型：一句话串起全链路

经过上面的拆解，以后在前端写复杂交互时，请把下面这四句话刻在脑子里：

1. **事件循环（Event Loop）** 决定了你的 JS 代码什么时候被拎出来执行。
2. **Vue 的 `$nextTick`** 决定了 Vue 把虚拟 DOM 拍到真实 DOM 上之后，什么时候通知你。
3. **`requestAnimationFrame`** 决定了浏览器在"下一次画图前"的最后一刻，给你一次插入 JS 的机会。
4. **浏览器的一帧** 决定了最终什么时候把所有计算好的 DOM/CSS 结果变成屏幕上的像素点。

把各司其职的机制放在对应的位置，你的前端动画与 DOM 交互，将不再有玄学。
