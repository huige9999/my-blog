---
title: 笔记目录组织
date: 2025-10-20
description: 基于 PARA 方法的笔记目录组织方法论
---

以下内容是基于PARA 延伸出来的一套比较适合我的笔记组织方法论

>PARA：是一个关于个人知识管理或信息组织方法的概念Projects（项目）、Areas（领域）、Resources（资源）、Archives（归档
## 目录结构

```
Notes
├── 00-Inbox
├── 01-Daily
├── 02-Projects
├── 03-Areas
├── 04-Archive
├── 05-Templates
└── 06-Attachments
```

## 目录职责

### 00-Inbox：临时收集箱

它的定位：先接住，不判断。

注意：这个目录一定要有，但不能长期堆积。
尽可能每周处理一次，把内容迁移到：

```
02-Projects
03-Areas
04-Archive
```

### 01-Daily：每日线索

Daily 不应该承担太多"知识沉淀"职责，它更像当天的控制台。

注意：Daily 里面不要写太长，如果内容过长了就应该拆除去，Daily只保留链接

比如：

```
今天研究了 Vue transition 初始动画不生效的问题，已沉淀到：
[[Vue transition 和 CSS animation 的触发机制差异]]
```


### 02-Projects：有结束时间的项目

- 项目文章可以扁平存放
- 由于项目通常包含多个维度的文章资料，所以我建议用画板
- 如果不适用画板 可能需要建立文件夹来组织单个项目的信息

注意：每隔几周要审查下Projects，是否存在几乎不会再查阅的项目，如果有就移动到Archive


### 03-Areas：长期经营领域

- 这个目录是我真正的长期知识资产。
- Areas不要一开始拆的太细，可以等内容稳定出现后聚合成一个领域目录
- 目前我职业技术相关的放Blog、信息资料放Info，后续可能还有菜谱、装修、理财投资等等



### 其他辅助的目录

- 04-Archive：用不到的文章放到这里，可以保持原有文章的目录组织，比如Projects中的文章失效了 可以移动到Archive/Projects
- 05-Templates：Obsidian文章模板，比如每天的代办事项、表格等等
- 06-Attachments：配置Obsidian的默认附件路径为当前目录
