---
title: 本地 Docker 跑 Java Spring Boot 项目 — 全过程总结
date: 2025-10-24
description: Docker 多阶段构建、Compose 编排、MySQL 数据恢复的完整实践总结
---

### 一、前期侦察：搞清楚项目怎么部署的

项目里没有 Docker 文件，但 `.claude/skills/deploy/` 下有个部署脚本，它揭示了两件事：

1. **本地打包** → `mvn clean package` 生成 `kyl_server.jar`
2. **SCP 上传** → 传到服务器 `/data/kyl/temp/`
3. **远程执行** → SSH 调用服务器上的 `/data/kyl/deploy.sh`

然后 SSH 到服务器看了 `deploy.sh`，发现**服务器是用 Docker 跑的**：

- `docker build` 构建镜像
- `docker run` 启动容器
- 依赖 MySQL + Redis 容器通过 `kyl_app-network` 互通

> **关键发现**：Dockerfile 和 docker-compose.yml 在服务器 `/data/kyl/` 下，本地仓库里没有。所以第一条教训——**去服务器拿现成的部署配置，比自己从零写更靠谱**。

---

### 二、涉及的文件及各自职责

```
kyl-projects/
├── docker/                              # 独立部署目录
│   ├── Dockerfile                       # ① 镜像构建脚本（多阶段）
│   ├── docker-compose.local.yml         # ② 容器编排配置
│   └── kyl_backup.sql                   # ③ 数据库备份（从服务器导出）
│
└── kyl/                                 # 项目源码
    ├── .dockerignore                    # ④ 构建上下文排除文件
    ├── table.sql                        # ⑤ 数据库建表脚本（项目已有）
    └── src/main/resources/
        ├── application.yaml             # ⑥ 主配置（项目已有）
        ├── application-dev.yaml         # 开发环境配置（项目已有）
        ├── application-prod.yaml        # 生产环境配置（项目已有）
        └── application-docker.yaml      # ⑦ Docker 环境专属配置（新增）
```

---

#### ① Dockerfile — 镜像构建脚本

```dockerfile
# 阶段1: 编译（用完即弃，不会进最终镜像）
FROM maven:3.8-openjdk-8 AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B -q

# 阶段2: 运行（只有 JAR + JRE，体积小）
FROM eclipse-temurin:8-jre
WORKDIR /app/bin
COPY --from=builder /build/target/kyl_server.jar .
...
ENTRYPOINT ["java","-jar","kyl_server.jar"]
```

**核心概念：多阶段构建**

| 阶段            | 作用                     | 镜像大小         |
| ------------- | ---------------------- | ------------ |
| 阶段1 `builder` | 在容器内用 Maven 编译 Java 项目 | ~500MB（但不保留） |
| 阶段2 运行镜像      | 只拷贝编译好的 JAR，用轻量 JRE 运行 | ~200MB       |

**这样本地不需要装 Java 和 Maven**，构建全在 Docker 里完成。

> **踩坑记录**：
>
> - `openjdk:8` 已从 Docker Hub 下架 → 换成 `eclipse-temurin:8-jre`
> - `mvn dependency:go-offline` 某些依赖会报错 → 去掉，直接 `mvn package`

---

#### ② docker-compose.local.yml — 容器编排

定义了三个服务协同工作：

```
┌─────── docker-compose.local.yml ───────┐
│                                        │
│  kyl-mysql (MySQL 8.0)                 │
│    ├─ 端口: 3306                       │
│    ├─ 首次启动执行 kyl_backup.sql 建库  │
│    └─ 数据持久化到 docker volume        │
│                                        │
│  kyl-redis (Redis 7)                   │
│    └─ 端口: 6379, 密码: 123456         │
│                                        │
│  kyl (Spring Boot App)                 │
│    ├─ 端口: 8020                       │
│    ├─ 等 MySQL 健康后才启动             │
│    ├─ 上传文件挂载到 ./uploads/         │
│    └─ 通过环境变量注入 DB/Redis 连接信息 │
│                                        │
│  网络: app-network (三容器互通)         │
└────────────────────────────────────────┘
```

**和服务器版本的区别**：

|项目|服务器|本地|
|---|---|---|
|Nginx|反向代理 + SSL|去掉了，直接访问 8020|
|Redis|自定义 redis.conf|简化为一行命令启动|
|密码|生产密码|本地简化密码|
|数据初始化|空 table.sql|用 kyl_backup.sql 恢复真实数据|

**关键配置项解释**：

```yaml
build:
  context: ../kyl                    # 源码在 kyl 项目
  dockerfile: ../docker/Dockerfile   # Dockerfile 在 docker 目录

# MySQL 健康检查 — app 等它就绪后才启动
depends_on:
  mysql:
    condition: service_healthy

# MySQL 初始化脚本（只在首次创建 volume 时执行）
volumes:
  - ./kyl_backup.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
```

---

#### ③ kyl_backup.sql — 数据库备份

从服务器导出真实数据：

```bash
# 在服务器上：让 MySQL 容器自己导出
ssh root@112.124.9.205
docker exec mysql mysqldump -uroot -pKyl3SeRV9e1R kyl > /data/kyl/kyl_backup.sql

# 回到本地：直接拉下来
scp root@112.124.9.205:/data/kyl/kyl_backup.sql ./docker/
```

> **要点**：不需要本地装 MySQL 客户端，`mysqldump` 是 MySQL 容器自带的。通过 SSH 管道可以直接把导出结果流回本地。

---

#### ④ .dockerignore — 构建优化

```
target/
.git/
.claude/
.idea/
*.md
docs/
```

告诉 Docker `COPY` 时忽略这些目录，**加速构建、减小构建上下文体积**。

> 必须放在构建上下文根目录（kyl 项目根），不是 docker 目录。

---

#### ⑤ table.sql — 数据库 Schema（项目已有）

MySQL 容器的 `docker-entrypoint-initdb.d/` 机制：首次启动时自动执行该目录下的 `.sql` 文件。

当前本地用的是 `kyl_backup.sql`（包含建表 + 数据），比 `table.sql`（只有建表）更完整。

---

#### ⑥⑦ application.yaml / application-docker.yaml — Spring Boot 配置

Spring Boot 支持**多 Profile**，通过 `SPRING_PROFILES_ACTIVE` 切换：

```
application.yaml            ← 基础配置（端口、JWT、通用设置）
  ├── application-dev.yaml   ← 开发环境（localhost DB/Redis）
  ├── application-prod.yaml  ← 生产环境（服务器 DB/Redis）
  └── application-docker.yaml ← Docker 环境（容器内 DB/Redis）
```

`application-docker.yaml` 的核心区别：

```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/kyl...   # ← "mysql" 是容器名，不是 localhost
  redis:
    host: redis                           # ← "redis" 是容器名
    password: 123456                      # ← 本地简化密码
```

> **为什么不能用 localhost？** 因为 app 容器里的 localhost 是容器自己，不是宿主机。MySQL 和 Redis 是独立的容器，通过 Docker 网络的容器名互访。

这个文件放在 kyl 项目的 `src/main/resources/` 下（而不是 docker 目录），因为**它要参与 JAR 打包**。加入 `.gitignore` 不提交到仓库。

---

### 三、完整操作流程

```bash
# 首次启动（构建 + 数据恢复）
cd ~/projects/person/kyl-projects/docker
docker compose -f docker-compose.local.yml up --build

# 日常启停（不重新构建）
docker compose -f docker-compose.local.yml up -d      # 启动
docker compose -f docker-compose.local.yml down        # 停止

# 代码变更后（重新构建）
docker compose -f docker-compose.local.yml up --build -d

# 清空数据库重来（删除 volume）
docker compose -f docker-compose.local.yml down -v
```

---

### 四、核心认知总结

|概念|要点|
|---|---|
|**多阶段构建**|编译环境和运行环境分离，最终镜像更小|
|**docker-entrypoint-initdb.d**|MySQL 首次启动自动执行 SQL，实现数据恢复|
|**Spring Profile**|一套代码，多个环境配置，通过环境变量切换|
|**Docker 网络**|容器之间用容器名互访，不是 localhost|
|**Volume 持久化**|数据库数据和上传文件不会因容器销毁而丢失|
|**构建上下文**|`.dockerignore` 必须在 context 根目录，控制 COPY 范围|
