---
title: Claude Code 的项目记忆组织思路
date: 2025-12-25
description: 把知识按"谁需要读(人/agent)+ 什么时候需要读(常驻/按需)+ 作用范围(全仓/模块/任务)"分层,让该常驻的常驻、该按需的按需。
---

# Claude Code 的项目记忆组织思路

最近用 Claude Code 管理项目时,我遇到了一个典型问题:到底该把各种"项目记忆"放在哪?

一开始我把所有东西都塞进根目录的 `CLAUDE.md` ——工具链命令、模块上下文、开发流程、注意事项……结果每次会话都加载一堆内容,不仅污染上下文,还让 agent 难以聚焦。

后来我发现子目录也可以放 `CLAUDE.md`,又有 Skills,还有传统的 `docs/`。这几种载体到底该怎么分工?同一件事(比如模块上下文)到底放哪?

经过一段时间的踩坑和摸索,我总结出一套分层思路。核心原则就一句话:

> **把知识按"谁需要读(人/agent)+ 什么时候需要读(常驻/按需)+ 作用范围(全仓/模块/任务)"分层,剩下的只是文件放哪的问题。**

## 三个维度:任何沉淀内容先做这 3 个分类

在决定"内容放哪"之前,先对内容做个三维分类:

### 维度 A:读者是谁?

- **Human-first**:给人看的(解释/背景/设计)
- **Agent-first**:给 agent 执行的(流程/检查/命令/验收)

### 维度 B:加载时机?

- **Always-on**:每次都需要(短规则/硬约束)
- **On-demand**:只有特定任务才要(写文章/发版/迁移)

### 维度 C:作用范围?

- **Repo-wide**:全仓通用
- **Module-scoped**:某个子目录/模块
- **Task-scoped**:一次性或少数任务

这三个维度可以帮你快速定位内容的"归属":

| 维度 | 选项 | 典型内容 |
| --- | --- | --- |
| 读者 | Human-first | 模块上下文、设计 rationale |
| 读者 | Agent-first | SOP、验收 checklist、命令 |
| 时机 | Always-on | 硬约束、不变量 |
| 时机 | On-demand | 写作/发布/迁移/回滚 |
| 范围 | Repo-wide | 通用规则、工具链 |
| 范围 | Module | 模块边界、入口、坑 |
| 范围 | Task | 本次改动说明 |

## 四类载体:CLAUDE.md / Skills / docs 各自负责什么

基于上述分类,我给四种载体做了明确分工:

### 根 `CLAUDE.md`:仓库级硬规则(短而硬、常驻)

**定位**:Always-on + Agent-first + Repo-wide

**放什么**:
- 工具链(pnpm/poetry/make)
- 不变量(base 路径、约定、禁止项)
- 安全护栏(例如 destructive 操作必须先 `git status`)

**不放什么**:
- 长篇背景解释
- 详细流程 SOP(会污染每次会话)

> 根 CLAUDE.md 像"项目宪法",只写你愿意每次启动都背诵的内容。

**示例**:
```markdown
# 工具链
- 包管理器:pnpm
- 运行服务:`pnpm dev`
- 构建:`pnpm build`

# 硬约束
- 所有 URL 必须使用 `/my-blog/` 前缀
- destructive 操作前必须运行 `git status`
- 禁止直接修改生成的文件
```

### 子目录 `CLAUDE.md`:模块就地规则(局部覆盖、就近原则)

**定位**:Always-on + Agent-first + Module-scoped

**放什么**:
- 这个模块的约束、不变量、约定
- "改这里要同时改哪里"的联动点
- 这个模块专用命令/测试

> 子目录 CLAUDE.md 是"模块边境检查站":进入这个目录工作就必须遵守。

**示例**(在 `src/screens/` 下):
```markdown
# 模块约束
- 所有 screen 组件必须从 `@/screens/types` 导入类型
- 修改某个 screen 的 props 时,同步更新对应 Storybook
- 运行测试:`pnpm test:screen`

# 联动点
- 新增 screen 需要在 `src/screens/index.ts` 中导出
- 修改 screen props 需要更新对应的故事文档
```

### Skills:按需加载的操作手册(任务开关)

**定位**:On-demand + Agent-first + Task-scoped(或特定领域 scoped)

**放什么**:
- 写文章/发布流程
- 发版流程、迁移流程、紧急回滚流程
- 任何你不希望每次加载、但希望一旦调用就严格执行的东西

> Skills 是"只在你喊它名字时才出现的专家"。

**示例**(blog-writing skill):
```markdown
# 博客编写流程
1. 确定文章分类(tutorials/projects/notes/opinions)
2. 创建文件并添加 frontmatter(title/date/description)
3. 更新对应目录的 index.md
4. 更新 .vitepress/config.mts 侧边栏配置
5. 检查 URL 生成逻辑(base 路径前缀)
```

### `docs/`:人类知识库(解释、背景、架构、长期沉淀)

**定位**:Human-first + On-demand(阅读)+ Repo/Module-wide

**放什么**:
- 模块上下文(入口、数据流、边界、坑)
- 架构决策(ADR)
- 设计说明、FAQ、Troubleshooting
- 开发记录(但建议结构化)

> docs 是给未来的人类(包括未来的你)看的;写得好能减少 80% 口头解释。

**示例**(`docs/modules/joymew-screen.md`):
```markdown
# Joymew Screen 模块

## What
屏幕管理模块,负责所有大屏组件的渲染与交互。

## Where
入口:`src/screens/index.ts`

## How
数据流:`API -> Store -> Screen Component -> Render`

## Contracts
- 所有 screen 必须实现 `BaseScreen` 接口
- 必须提供对应的 Storybook 故事

## Pitfalls
- 不要在 screen 组件中直接调用 API,必须从 store 获取
- 注意屏幕尺寸自适应逻辑
```

## 你的四种内容:到底分别放哪?

### A)模块上下文沉淀(反复解释的那种)

✅ **优先放 `docs/`**

建议:`docs/modules/<module>.md`

结构模板:
- What/Why/Where/How
- Contracts(不变量、输入输出)
- Pitfalls(常见坑)
- Links(相关 ADR/PR)

同时可以在模块目录下放一个简短 `CLAUDE.md` 指向 docs:
> "先阅读 `docs/modules/foo.md`,再动手"

### B)开发记录沉淀(你做过什么、为什么这么改)

看你"记录"的目的:
- 如果是"可追溯的决策/理由":放 `docs/decisions/`(ADR 风格)
- 如果是"每次改动的日志":直接靠 Git PR/commit message 更合适
- 如果是"个人成长/复盘":放博客或 `notes/`(但别塞进 CLAUDE)

> 开发记录要么进入"可被引用的决策文档(ADR)",要么进入"版本历史(Git)",不要混成一锅粥。

### C)某个固定流程沉淀(写文章/发布/回滚)

✅ **优先 Skills**

因为你明确说"只在做这类任务才加载"。

### D)规则约束沉淀(不变量/必须遵守)

- 全仓通用:根 `CLAUDE.md`
- 只对模块:子目录 `CLAUDE.md`
- 又长又细、但只在某任务:Skills(不要塞根 CLAUDE)

## 我最终的目录结构(可复制的推荐树)

```
CLAUDE.md                       # 仓库宪法:短规则、硬约束、常用命令

.claude/
  skills/
    blog-writing/
      SKILL.md                  # 写作/发布流程(按需加载)
    release/
      SKILL.md                  # 发版流程(按需加载)

docs/
  README.md                     # 文档索引入口
  modules/
    joymew-screen.md            # 模块上下文
  decisions/
    adr-0001-url-base.md        # 决策记录(结构化)
  troubleshooting/
    vitepress-base.md           # 常见坑排查

src/
  moduleA/
    CLAUDE.md                   # 模块局部规则(只写必须遵守的约束)
```

## 实操:我怎么在日常里使用它

### 场景 1:写文章

1. 我手动调用 blog-writing skill
2. 它按流程生成文章、更新索引、检查 base
3. 流程细节按需加载,不污染日常会话

### 场景 2:改某模块

1. agent 进入 `src/moduleA/` 先读子目录 CLAUDE.md(自动加载)
2. 需要理解背景时,去 `docs/modules/moduleA.md` 读上下文
3. 做决策时,写 ADR
4. 日常改动不会每次都加载完整的模块文档

## 结语

之前我的困惑在于把所有"需要记住的东西"混在一起 ——既有人类看的架构文档,又有 agent 要执行的命令;既有每次会话都要用的规则,又有特定任务才需要的流程。

这套分层系统的核心是:**我的目标不是让 agent "记住更多",而是让它"在正确的时候记住正确的东西"。**

- 根 CLAUDE.md:每次都背的"宪法"
- 子目录 CLAUDE.md:进入模块必须遵守的"边境检查站"
- Skills:按需召唤的"专家顾问"
- docs:给人看的"知识库"

现在每次沉淀内容时,我都会问自己三个问题:
1. 这是给人看还是给 agent 执行的?
2. 这是每次会话都要用,还是特定任务才需要?
3. 这是全仓通用、模块专属、还是一次性任务?

答案清晰了,文件放哪也就自然清晰了。
