---
title: CSS transition 与 animation 本质区别
date: 2025-11-10
description: CSS transition 与 animation 的本质区别与使用场景
---

## 1. transition 的本质：需要 A -> B 的状态变化

`transition` 不是"元素一出现就自动播放动画"。

它的本质是：

> 当一个 CSS 属性从旧值 A 变成新值 B 时，浏览器帮你把这个变化过程平滑过渡。

例如：

```css
.box {
  transform: scale(0);
  opacity: 0;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.box.active {
  transform: scale(1);
  opacity: 1;
}
```

它要生效，浏览器必须经历这个过程：

```txt
第一帧：浏览器先确认并绘制 A 状态
transform: scale(0)
opacity: 0

↓

后续某一帧：class 变化，进入 B 状态
transform: scale(1)
opacity: 1

↓

浏览器执行 transition
```

也就是说，`transition` 依赖的是：

```txt
已存在的旧状态 A -> 新状态 B
```

如果浏览器第一次看到元素时，它已经是 B 状态，那么不会有过渡。

---

## 2. 为什么有时 transition 看不出来？

比如编程式创建组件：

```js
bapin.$mount();
container.appendChild(bapin.$el);
```

如果组件内部很快就把状态改成了：

```js
this.isMounted = true;
```

那么浏览器第一次真正绘制时，可能看到的已经是：

```css
transform: scale(1);
opacity: 1;
```

也就是最终状态 B。

这时即使你写：

```css
transition: transform 3s ease-out, opacity 3s ease-out;
```

也看不出来。

因为问题不是时间太短，而是浏览器没有经历：

```txt
A 状态 -> B 状态
```

它第一次绘制时就已经在 B 状态了。

---

## 3. transition 的正确触发方式

要让 transition 稳定生效，需要人为制造状态变化。

### 写法一：先插入初始态，再切 active

```html
<div class="box" :class="{ active: show }"></div>
```

```css
.box {
  transform: scale(0);
  opacity: 0;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.box.active {
  transform: scale(1);
  opacity: 1;
}
```

```js
// 先让元素进入 DOM
container.appendChild(el);

// 再切状态
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    show = true;
  });
});
```

### 写法二：强制浏览器先计算 A 状态

```js
container.appendChild(el);

// 强制浏览器读取当前布局，让它先认到 A 状态
void el.offsetWidth;

// 再切到 B 状态
show = true;
```

这里的 `void el.offsetWidth` 不是为了拿宽度，而是为了强制浏览器完成一次样式计算。

---

## 4. animation 的本质：自带 from -> to

`animation` 和 `transition` 不一样。

`animation` 自己有关键帧：

```css
.box {
  animation: scaleIn 0.3s ease-out forwards;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

它不依赖"旧状态 A 已经被绘制过"。

它的逻辑是：

> 当元素进入渲染树，并且元素身上有 animation，浏览器就可以按照 keyframes 播放动画。

所以对于"元素一出现就播放进场动画"的场景，`animation` 通常更省心。

---

## 5. transition 和 animation 的核心区别

```txt
transition：
依赖状态变化。
需要浏览器先认到 A，再切到 B。
适合 hover、展开收起、切换 active 等场景。

animation：
自带时间线和关键帧。
元素被绘制时，如果身上有 animation，就可以播放。
适合进场动画、循环动画、多阶段动画。
```

换句话说：

```txt
transition 是"两个状态之间的过渡"
animation 是"一个预设时间线的播放"
```

---

## 6. Vue 的 `<transition>` 本质是什么？

Vue 的 `<transition>` 本身不是动画引擎。

它本质上是：

> 在合适的时机，帮你动态添加和移除一组 CSS class。

比如：

```vue
<transition name="fade">
  <div v-show="show">hello</div>
</transition>
```

Vue 会在进入时自动添加类似这些 class：

```css
.fade-enter
.fade-enter-active
.fade-enter-to
```

你可以写：

```css
.fade-enter {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter-active {
  transition: opacity 0.3s;
}
```

这时它本质上还是在用 `transition`。

也就是：

```txt
Vue 负责加 class
CSS transition 负责执行 A -> B 的过渡
```

---

## 7. Vue transition 也可以配合 animation

Vue `<transition>` 不一定只能用 `transition`。

它也可以配合 `animation`。

比如：

```vue
<transition enter-active-class="scaleIn">
  <div v-show="show">hello</div>
</transition>
```

```css
.scaleIn {
  animation: scaleIn 0.3s ease-out forwards;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

这时 Vue 还是负责：

```txt
在进入时添加 scaleIn class
```

真正执行动画的是 CSS animation。

---

## 8. 针对进场动画的实践建议

如果只是简单的状态切换，比如展开、收起、hover、active：

```txt
优先用 transition
```

如果是组件刚出现时的进场动画，比如弹窗、霸屏、礼物特效：

```txt
优先用 animation
```

因为进场动画经常遇到：

```txt
组件刚创建
DOM 刚插入
浏览器还没来得及绘制初始态
状态已经变成最终态
```

这种情况下，`transition` 容易因为缺少 A -> B 的过程而看不出来。

而 `animation` 自带 `from -> to`，更适合"插入即播放"。

---

## 9. 一句话总结

`transition` 需要浏览器先确认 A 状态，再切到 B 状态，才会执行过渡；`animation` 自带关键帧，元素进入渲染树时就可以播放；Vue 的 `<transition>` 本质不是动画本身，而是在进入/离开时帮你动态添加 class，最终还是由 CSS transition 或 CSS animation 来完成动画。
