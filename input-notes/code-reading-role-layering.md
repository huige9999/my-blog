---
title: 读代码技巧：角色分层
date: 2025-10-17
description: 分层思想与角色识别：从代码里抽出对象图的七个固定抓手
---

对，这就是**分层思想 + 角色识别**。

以后你读代码时，不要一上来追每一行怎么跑。你可以先粗暴地问一句：

这坨代码里，到底有哪些"角色"在协作？

然后从代码角度，用一套固定抓手去提取。

---

# 一、先找"对外 API"：谁是调用主环境？

看代码时，先找这些东西：

```
scheduler.add(...)
scheduler.cancel(...)
scheduler.pause(...)
scheduler.resume(...)
```

或者：

```
new TaskScheduler(...)
```

凡是被外部业务代码调用的，就是这个模块暴露出来的**入口层**。

你可以问：

```
外部能调用哪些方法？
外部传进来了什么？
外部能拿到什么返回值？
外部不能碰什么？
```

比如：

```
const scheduler = new TaskScheduler({ concurrency: 3 })

const taskId = scheduler.add(taskFn)

scheduler.cancel(taskId)
```

这里立刻能分出：

```
调用主环境：使用 scheduler 的业务代码
调度器角色：TaskScheduler 实例
```

读代码第一步不是看内部，而是先看**这个模块想给别人怎么用**。

---

# 二、再找"class / 对象"：谁是中控对象？

看到这种：

```
class TaskScheduler {
  constructor(options) {}
  add(task) {}
  cancel(id) {}
  runNext() {}
}
```

基本可以先粗暴判断：

```
TaskScheduler = 中控对象 / 管理者 / 调度者
```

因为它有状态、有方法、还负责协调别人。

你重点看它身上的字段：

```
this.queue = []
this.running = new Map()
this.maxConcurrency = 3
this.paused = false
```

这些字段暴露了它的职责：

```
queue           -> 管等待任务
running         -> 管执行中任务
maxConcurrency  -> 管并发限制
paused          -> 管暂停状态
```

所以你可以倒推出：

```
这个对象不是干活的，它是管活的。
```

这是读代码时非常重要的判断。

---

# 三、找"被放进数组 / Map 的对象"：谁是最小管理单元？

这是你读复杂代码时最重要的技巧。

只要你看到：

```
this.queue.push(x)
this.running.set(id, x)
this.tasks.set(id, x)
```

你就要立刻盯住这个 `x`。

因为它大概率就是系统里的**核心角色对象**。

例如：

```
const taskRecord = {
  id,
  taskFn,
  status: 'pending',
  priority,
  retryCount: 0,
  controller,
  resolve,
  reject,
}

this.queue.push(taskRecord)
```

这说明真正被调度器管理的不是 `taskFn`，而是：

```
taskRecord
```

你应该立刻给它贴标签：

```
taskRecord = 单个任务的档案 / 工单 / 最小调度单位
```

以后你读任何代码都可以这么抓：

```
被数组保存的对象 = 批量管理对象
被 Map 保存的对象 = 可按 id 查找的管理对象
被 Set 保存的对象 = 状态集合 / 去重集合
```

在调度器里：

```
queue.push(taskRecord)
running.set(taskRecord.id, taskRecord)
```

这就说明：

```
taskRecord 是核心对象。
```

---

# 四、找"谁创建谁"：判断对象所有权

比如：

```
add(taskFn) {
  const controller = new AbortController()

  const record = {
    taskFn,
    controller,
  }

  this.queue.push(record)
}
```

你应该立刻得出：

```
controller 是调度器创建的
controller 被 record 持有
record 被 queue / running 管理
```

这就是所有权链：

```
TaskScheduler
  -> taskRecord
      -> controller
          -> signal
```

粗暴规则是：

```
谁 new 出来，通常谁拥有控制权。
谁只通过参数拿到，通常只是使用权。
```

所以：

```
taskFn({ signal: controller.signal })
```

可以读成：

```
调度器把 signal 的使用权交给任务函数；
但 controller 的控制权仍然留在调度器内部。
```

这一下就清楚了。

---

# 五、找"参数边界"：谁进入了另一个环境？

比如：

```
taskFn({
  signal,
  retryCount,
  taskId,
})
```

这说明调度器正在把一部分信息传给任务环境。

你可以把参数对象看成一份"通行证"：

```
{
  signal,
  retryCount,
  taskId,
}
```

它代表调度器允许任务知道什么。

这里最重要的是：

```
传进去的东西 = 任务环境能接触到的东西
没传进去的东西 = 任务环境不应该知道的东西
```

比如任务函数能拿到：

```
signal
taskId
```

但拿不到：

```
queue
running
controller
resolve
reject
```

这说明边界设计是：

```
任务只负责执行，不参与调度器内部管理。
```

---

# 六、找"事件 / 回调 / signal"：谁在做桥梁通信？

看到这种代码：

```
signal.addEventListener('abort', handler)
```

或者：

```
emitter.on('done', handler)
emitter.emit('done')
```

或者：

```
store.subscribe(listener)
```

你就可以粗暴判断：

```
这里有非直接调用关系。
```

因为一边只是注册：

```
signal.addEventListener('abort', ...)
```

另一边在别处触发：

```
controller.abort()
```

它们不是函数直接互调，而是通过第三方对象通信。

对应关系是：

```
controller.abort()                -> 发消息
signal.addEventListener('abort')  -> 收消息
signal                             -> 中介桥梁
```

读代码时你要专门找这种"成对出现"的东西：

```
on / emit
addEventListener / dispatchEvent
subscribe / notify
then / resolve
signal / abort
watch / trigger
```

这些都是通信机制。

---

# 七、找"状态字段"：谁负责生命周期？

比如：

```
record.status = 'pending'
record.status = 'running'
record.status = 'success'
record.status = 'failed'
record.status = 'cancelled'
```

看到状态字段，你就要问：

```
谁在改 status？
谁根据 status 做判断？
status 变化代表什么生命周期？
```

如果 `status` 只在调度器内部改：

```
record.status = 'running'
record.status = 'cancelled'
```

那说明：

```
任务生命周期由调度器控制。
```

任务函数自己不应该乱改：

```
record.status = 'success'
```

否则职责就乱了。

所以状态字段是识别角色的重要线索。

---

# 八、粗暴提取角色的 7 个问题

你以后读代码，可以直接照这个问：

```
1. 外部怎么使用它？
   -> 找调用主环境 / 对外 API

2. 谁是 class / 主对象？
   -> 找中控角色

3. 谁被 push 到数组、set 到 Map？
   -> 找最小管理单元

4. 谁 new 出了谁？
   -> 找所有权和控制权

5. 谁通过参数传给谁？
   -> 找直接调用关系和权限边界

6. 谁监听事件，谁触发事件？
   -> 找非直接通信桥梁

7. 谁维护 status / state？
   -> 找生命周期控制者
```

这 7 个问题够你读大多数前端代码了。

---

# 拿并发调度器举例

假设你看到：

```
class TaskScheduler {
  constructor({ concurrency }) {
    this.concurrency = concurrency
    this.queue = []
    this.running = new Map()
  }

  add(taskFn) {
    const controller = new AbortController()

    const record = {
      id: crypto.randomUUID(),
      taskFn,
      controller,
      status: 'pending',
    }

    this.queue.push(record)

    this.runNext()

    return record.id
  }

  cancel(id) {
    const record = this.running.get(id)

    if (record) {
      record.controller.abort()
      record.status = 'cancelled'
    }
  }

  runNext() {
    if (this.running.size >= this.concurrency) return

    const record = this.queue.shift()
    if (!record) return

    this.running.set(record.id, record)
    record.status = 'running'

    record.taskFn({
      signal: record.controller.signal,
    })
  }
}
```

你就可以提取出：

```
TaskScheduler
= 调度器，中控对象

queue / running
= 调度器内部的任务容器

record
= 单个任务的管理档案

taskFn
= 用户提供的真实任务逻辑

controller
= 调度器持有的取消控制器

signal
= 传给任务函数的取消通知器

cancel(id)
= 外部调用取消意图的入口
```

---

# 你可以用一个固定表格读代码

以后每读一个复杂模块，你就填这个表：

|   |   |   |
|---|---|---|
|角色|代码线索|职责|
|调用者|谁调用 public API|发起意图|
|中控对象|class / createX / manager|管理流程|
|记录对象|被 queue / map 保存|保存单个实体状态|
|执行对象|真正执行异步逻辑|干活|
|通信桥梁|signal / event / emitter / store|跨边界通知|
|状态字段|status / state / phase|生命周期|
|清理逻辑|finally / cleanup / remove|收尾|

你不需要一开始就完全懂代码，只要先把这张表填出来，代码结构就会清晰很多。

---

# 更粗暴一点：看变量名也能猜角色

很多源码变量名其实已经暴露角色了。

看到这些，大概率是中控：

```
manager
scheduler
controller
coordinator
runner
pool
queue
dispatcher
```

看到这些，大概率是单个记录：

```
task
job
record
entry
item
node
request
operation
```

看到这些，大概率是通信桥梁：

```
signal
emitter
eventBus
subject
store
channel
listener
observer
token
```

看到这些，大概率是生命周期：

```
status
state
phase
pending
running
settled
cancelled
disposed
```

看到这些，大概率是清理：

```
cleanup
dispose
destroy
teardown
unsubscribe
remove
finally
```

---

# 你现在最应该练的不是"逐行读懂"

而是先练这个能力：

```
从代码里抽出对象图。
```

比如你读一段代码，先不要急着解释每一行，而是画成这样：

```
User Code
  |
  | add(taskFn)
  v
Scheduler
  |
  | creates
  v
TaskRecord
  |
  | owns
  v
AbortController
  |
  | exposes
  v
AbortSignal
  |
  | passed to
  v
taskFn({ signal })
```

然后再画取消链路：

```
User Code
  |
  | cancel(id)
  v
Scheduler
  |
  | record.controller.abort()
  v
AbortSignal
  |
  | notify
  v
taskFn cleanup
```

只要这两张图出来了，你再读代码会轻松很多。

---

# 给你一个读代码口诀

可以记这个：

```
先看入口，再看容器；
先找记录，再找状态；
谁 new 谁拥有，谁传谁使用；
谁监听谁接收，谁触发谁通知；
最后再看清理。
```

这套方法对你之后读 React 源码、Vue 源码、插件系统、请求库、状态管理、任务队列都通用。
