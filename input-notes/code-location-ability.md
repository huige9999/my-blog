---
title: 代码定位能力
date: 2025-10-15
description: 从线索页面向外扩散的代码地图分析法，七问法精准定位相关文件
---

可以。你现在要练的其实不是"搜文件"，而是建立一套**从一个线索页面向外扩散的代码地图分析法**。

我建议你按这个宏观顺序看：

```
线索页面
↓
它是谁打开的
↓
它自己依赖谁
↓
它修改了哪些状态
↓
它调用了哪些接口
↓
接口结果影响谁
↓
它触发了哪些全局副作用
↓
哪些文件是相关，哪些只是误命中
```

## 1. 先判断这个线索页面在链路里的角色

拿到一个页面或组件后，先不要急着 grep 全仓库。
先问自己：它在业务链路里是哪个角色？

常见角色有：

```
页面入口
弹窗/抽屉
页面局部组件
按钮入口
表单组件
列表组件
详情组件
业务 hook/composable
store 模块
API 封装
工具函数
```

比如你之前的 `fireworkShow.vue`，它更像是：

```
弹窗业务组件
```

那它的相关文件通常不是全站页面，而是：

```
谁打开这个弹窗
弹窗常量定义
弹窗承载容器
弹窗内部调用的 store/API/utils
弹窗入口按钮
```

这个角色判断很重要，因为它决定你向外扩散的方向。

## 2. 第一圈：组件自身依赖

先看这个文件的：

```
import
props
emit
store mapState/mapGetters/mapActions
API 调用
utils 调用
常量引用
组件引用
样式引用
```

这一圈通常能得到最稳定的相关文件。

你可以手动扫这些关键词：

```
import
components
props
emits
computed
watch
methods
setup
mapState
mapGetters
mapMutations
mapActions
this.$store
dispatch
commit
api
request
```

这一圈回答的是：

```
这个文件为了运行，依赖哪些文件？
```

这些文件多数应该进入相关文件列表。

## 3. 第二圈：上游入口，也就是"谁使用了它"

这一步非常关键。很多人只看当前组件依赖谁，却忘了看谁挂载它。

搜索当前文件名、组件名、注册名：

```
fireworkShow.vue
fireworkShowModule
<firework-show
<fireworkShow
```

你要找的是：

```
这个组件在哪里被 import？
在哪里被渲染？
由哪个 key 控制显示？
由哪个按钮或事件打开？
```

对弹窗来说，通常要找到：

```
popupArea.vue          弹窗承载容器
bottomRightCorner.vue  功能入口区域
某个 module button     触发入口按钮
POPUP_MODULE 常量       弹窗 key 定义
app store              当前弹窗 key 状态
```

这一圈回答的是：

```
用户怎么走到这个功能？
```

如果需求是"链路分析"，上游入口基本必须包含。

## 4. 第三圈：状态链路

前端需求大多数绕不开状态。

你要把组件里读写的状态分成三类：

```
展示状态：控制 UI 显示，比如 visible、loading、selectedType
业务状态：业务数据，比如 fireworkTypeList、sceneType、userInfo
流程状态：影响下一步行为，比如 currentPopup、currentFireworkType
```

然后追踪这些状态在哪里定义、在哪里修改、在哪里消费。

看这些东西：

```
state.xxx
getters.xxx
commit('xxx')
dispatch('xxx')
mutation 名
action 名
```

你要判断：

```
这个状态只是被当前组件读取？
还是被多个模块共享？
是否决定接口参数？
是否决定按钮状态？
是否决定弹窗展示？
```

如果一个 store 字段：

```
当前组件读取 + 其他入口修改 + 影响接口/展示
```

那相关 store 文件要加入。

如果只是全局 userInfo、theme、device 之类，除非需求相关，否则别加。

## 5. 第四圈：接口链路

看组件调用了哪些 API：

```
sendFireworkShowGift
securityMsgCheck
sendGiftMessage
getFireworkList
```

然后去 API 文件看：

```
接口函数定义
请求路径
请求参数
响应结构
用的是哪个 request 封装
```

一般要加入：

```
具体 API 定义文件
```

至于 `request.js` 要不要加入，看需求。

如果需求只是业务链路分析，`request.js` 通常可选；如果需求涉及请求拦截、token、错误码、环境、小程序/H5 差异，那才加入。

一个快速判断：

```
API 函数本身相关
request 封装通常不相关
```

除非你要分析"为什么请求失败""环境差异""鉴权""错误处理"。

## 6. 第五圈：业务常量和枚举

看组件里有没有：

```
POPUP_MODULE
sceneType
giftType
activityType
status
source
eventName
```

常量文件是否加入取决于它是否解释了业务分支。

如果常量只是全局大字典，且只用一个 key，你可以加入，因为外部 LLM 需要知道这个 key 的意义。

但不要因为某个常量文件里包含很多关键词，就把所有引用它的页面都加进来。

这里有个原则：

```
常量定义文件可能相关；
其他同样引用这个常量的业务页面不一定相关。
```

这就是你之前 `wait.vue` 被误选的原因：它只是同样引用了 `POPUP_MODULE`，但不是烟花秀链路。

## 7. 第六圈：同模块相邻文件

再看当前文件所在目录。

例如：

```
src/views/index/components/bottomRightCorner/modules/fireworkShow.vue
```

你可以看：

```
同目录 index.vue
同目录 func.js
同目录其它 module
```

但同目录文件不能全收。

只收这几种：

```
当前模块的父容器
当前模块共享工具
当前模块共享类型/常量
当前模块共同注册入口
```

不要收"相似功能文件"，例如：

```
gift.vue
bapin.vue
song.vue
photoGift.vue
```

除非需求是"对比各功能模块如何实现"。

## 8. 第七圈：副作用链路

很多前端链路不只是 UI + API，还有副作用：

```
微信分享/支付
埋点
websocket
localStorage/sessionStorage
事件总线
全局 toast
音频/动画
路由跳转
外部 SDK
```

你要扫当前组件里是否出现：

```
wx
track
emit
bus
socket
localStorage
sessionStorage
setTimeout
animation
router
location
```

如果出现，就追对应文件。

但如果只是项目里有 websocket，不代表当前需求一定相关。
必须能证明当前功能**发送/接收/依赖** websocket 消息，才加入 websocket 文件。

## 9. 最后做一次"相关性裁剪"

这是最关键的一步。

每个候选文件都问一句：

```
如果不看这个文件，是否会影响理解或实现这个需求？
```

答案是"会"，保留。
答案是"不太会"，删除。

我建议你把文件分三类：

```
必选：不看就无法理解/实现
可选：有助于理解边界
排除：只是 grep 命中
```

举例：

```
必选：
- 当前组件
- 打开当前组件的入口
- 承载弹窗的父组件
- 相关 store
- 相关 API
- 相关常量

可选：
- request 封装
- wxApi
- store/index
- 通用 utils
- websocket handler

排除：
- 其他也用 POPUP_MODULE 的页面
- 相似弹窗
- 相似按钮模块
- 只命中 sceneType 但业务不同的页面
```

## 一个实用的"七问法"

拿到线索页面后，按顺序问：

```
1. 它是什么角色？页面、弹窗、组件、hook、store、API？
2. 它被谁打开或挂载？
3. 它自己 import 了谁？
4. 它读写了哪些 store/state？
5. 它调用了哪些 API？
6. 它用了哪些业务常量、权限、埋点、i18n、工具函数？
7. 哪些搜索命中只是同名/同常量/相似功能，应该排除？
```

只要你按这七问走，基本不会偏太多。

## 一个建议的文件选择模板

你手动筛选时可以这样组织：

```
入口/挂载：
- ...

核心组件：
- ...

状态：
- ...

接口：
- ...

常量/工具：
- ...

可选上下文：
- ...

排除项：
- ...
```

最后给 repomix 的时候，只拿前五类里的必要项。

## 我给你的最短操作流程

实际工作时不用想太复杂，直接这样做：

```
1. 打开线索页面，看 import、store、API、constants。
2. 搜索谁 import/渲染这个页面。
3. 搜索组件里出现的核心变量/API/store 字段。
4. 把候选文件按"入口、核心组件、状态、接口、常量工具"分组。
5. 删除只是关键词命中的文件。
6. 输出最终路径。
```

判断一个文件该不该进上下文，最简单标准就是：

```
它要么定义了链路的一环；
要么连接了链路的两环；
要么解释了链路里的关键业务分支。
```

否则就不要放。
