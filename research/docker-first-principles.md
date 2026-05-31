---
title: 从第一性原理理解 Docker
date: 2025-11-13
description: 从第一性原理出发理解 Docker 的核心概念
---

> 不要先背"镜像、容器、仓库"这些名词。先问一个朴素的问题：**为什么我的程序在我电脑能跑，到服务器就跑不起来？** 答案是程序运行依赖的不只是代码，还有一整套运行环境。Docker 要做的就是——把环境也当成代码管理。

---

## 一、问题本质

传统部署的错觉：你以为部署的是"代码"，其实要复刻的是"代码 + 环境"。

一个 NestJS 项目运行所需：

```
你的代码 + Node.js + pnpm + 环境变量 + 系统依赖 + 端口 + MySQL/Redis + 启动命令 + OS 能力
```

本地 MySQL 8.0、服务器 MySQL 5.7；本地 Node 20、服务器 Node 18——玄学问题由此产生。

> Docker 的核心价值：**不再赌服务器环境是否和本地一样，而是直接把标准环境带过去。**

---

## 二、五个核心概念

### 1. Dockerfile — 环境的施工图纸

```dockerfile
FROM node:20
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install
COPY . .
EXPOSE 3000
CMD ["pnpm", "start"]
```

它描述的是：从一个干净的 Node 20 环境开始，一步步构造出可运行项目的标准环境。

### 2. Image 镜像 — 环境快照

根据 Dockerfile 构建出的**只读模板包**，包含完整的运行环境、代码和启动命令。像一台已装好系统和软件的硬盘镜像——但它还没开机。

```bash
docker build -t my-server .
```

### 3. Container 容器 — 运行实例

镜像是模板，容器是它运行后的实例。类比到编程：

```
Image ≈ class（模板）
Container ≈ instance（运行中的对象）
```

同一镜像可启动多个容器，彼此状态独立。

### 4. Volume — 持久化存储

容器是临时实例，删除即丢失数据。Volume 把数据存到容器外部：

```
容器 = 可随时重建的房子
Volume = 房子外面的保险柜
```

容器没了，保险柜还在。

### 5. Docker Compose — 多容器编排

真实项目不止一个服务。Compose 用一个 YAML 描述所有服务的启动方式、端口映射、数据存储和互联关系：

```yaml
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

```bash
docker compose up -d    # 启动
docker compose down     # 停止
```

---

## 三、Docker 不是虚拟机

Docker 本质上是在宿主机上启动一个**被隔离的进程**，不是跑一个完整操作系统。

```
虚拟机：宿主机 → 虚拟机系统 → 应用
Docker：宿主机内核 → 容器进程 A / B / C（共享内核）
```

隔离了文件系统、网络、进程空间、环境变量、用户权限和资源限制。更轻量，启动更快。

---

## 四、两个实操要点

### 端口映射

容器有自己的网络空间。MySQL 容器内部监听 3306，外部访问不到，需映射：

```yaml
ports:
  - "3307:3306"    # 宿主机 3307 → 容器 3306
```

类比小区门牌：外部找大门 3307，内部房间仍是 3306。

### 数据持久化

```yaml
volumes:
  - mysql-data:/var/lib/mysql    # 数据存到 Docker 管理的持久存储
```

---

## 五、概念关系速查

```
Dockerfile → build → Image（环境模板）
Image → run → Container（运行实例）
Container → 使用 → Volume（持久数据）/ Network（容器通信）
Registry = 存放/下载镜像的仓库
```

对应前端概念：

| Docker | 前端类比 |
|--------|---------|
| Dockerfile | package.json + 构建脚本 |
| Image | build 产物 |
| Container | 运行中的服务实例 |
| Registry | npm registry |
| Compose | 多服务启动配置 |

---

## 六、最小学习路径

1. **第一阶段**：用 Compose 跑基础服务（MySQL/Redis），后端直接连
2. **第二阶段**：写 Dockerfile 把后端服务容器化
3. **第三阶段**：前端构建 + Nginx 反向代理部署

> Docker = 用代码描述环境，用镜像固化环境，用容器运行环境，用 Compose 组织多个环境。
