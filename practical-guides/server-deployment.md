---
title: 服务器部署实战路线
date: 2025-10-21
description: 从前端到全栈：我用自家 Ubuntu 服务器搭建的一套部署学习路线
---

我有一台用旧 Win10 改造的 Ubuntu 服务器，最近在摸索怎么把它用起来。我想做的一件事很明确：**把自己的前端 / Node / 全栈项目稳定部署上去，能远程访问、更新、排错、备份。**

没打算一上来就折腾云原生、K8s、复杂 CI/CD，先围绕一个核心闭环——能部署、能维护、能排障。

这篇文章是我给自己整理的实战路线，也记录一下各阶段踩过的坑。

---

## 总体路线

分 5 个阶段：

1. 服务器基础与远程管理
2. Linux 运维基础与安全加固
3. Web 服务部署：Nginx + 前端静态站点
4. Node / Nest / MySQL 项目部署
5. 自动化部署、监控、备份与容器化

我的原则是：前期不要变成"学 Linux 运维大全"，而是围绕部署闭环来学，每一步都有东西跑起来。

---

## 阶段 1：把服务器接管起来

### 目标

从自己的电脑稳定 SSH 连接服务器，知道它的 IP、用户、目录、端口、防火墙、服务状态。

### 基础信息查看

```bash
uname -a
lsb_release -a
ip addr
df -h
free -h
top
```

这几个命令跑一遍，基本就能摸清：系统版本、内网/外网 IP、磁盘空间、内存占用、CPU 占用。

### SSH 登录

```bash
ssh 用户名@服务器IP
```

局域网服务器比如：

```bash
ssh vichel@192.168.1.100
```

后面配了 SSH key 就不用每次输密码了：

```bash
ssh-keygen
ssh-copy-id vichel@服务器IP
```

Windows 上我用的 Windows Terminal，MobaXterm 和 Termius 也都可以。

### 基础目录结构

重点理解这几个：

```bash
/home/用户名      # 用户目录
/etc             # 配置文件
/var/log         # 日志
/var/www         # 常见网站目录
/usr/local       # 自己安装的软件
/opt             # 第三方应用目录
```

### 第一个闭环

1. 在服务器创建一个用户
2. 配好 SSH 登录
3. 创建 `/var/www/demo`
4. 用 scp 上传一个 index.html
5. 在服务器上能看到这个文件

```bash
scp index.html vichel@服务器IP:/var/www/demo/
```

跑完这一步，就从"有一台服务器"变成"能控制一台服务器"了。

---

## 阶段 2：Linux 基础运维与安全

### 目标

服务器不是裸奔的——端口、用户、权限、服务状态都能看懂，也能做基础安全处理。

### 用户和权限

```bash
whoami
id
sudo
chmod
chown
ls -l
```

重点搞懂权限表示：

```
-rw-r--r--
drwxr-xr-x
```

以及常用操作：

```bash
chmod 755 xxx
chmod 644 xxx
chown -R 用户名:用户组 目录
```

### systemd 服务管理

部署服务器一定绕不开：

```bash
systemctl status nginx
systemctl start nginx
systemctl stop nginx
systemctl restart nginx
systemctl enable nginx
```

`start` 启动、`stop` 停止、`restart` 重启、`enable` 开机自启、`status` 查看状态。

### 防火墙

Ubuntu 用 `ufw`：

```bash
sudo ufw status
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

常见端口含义：

| 端口 | 用途 |
|------|------|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 3000 | Node 开发服务常见端口 |
| 3306 | MySQL |

### 日志查看

```bash
journalctl -u nginx
journalctl -u nginx -f
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

后面排查部署问题全靠这些。

### 这个阶段的实战

1. 开启防火墙，只放行 22、80、443
2. 安装 Nginx
3. 查看 Nginx 服务状态
4. 查看 Nginx 日志
5. 重启服务器，确认 Nginx 能自动启动

---

## 阶段 3：部署前端静态项目

### 目标

把 Vue / React 打包后的 dist 部署到 Ubuntu，通过浏览器访问。这阶段对前端来说最重要。

### 基础流程

本地打包：

```bash
npm run build
```

上传到服务器：

```bash
scp -r dist/* 用户名@服务器IP:/var/www/my-app/
```

Nginx 配置：

```nginx
server {
    listen 80;
    server_name 你的域名或服务器IP;

    root /var/www/my-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

启用配置：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 几个要搞清楚的问题

#### history 路由为什么需要 try_files？

```nginx
try_files $uri $uri/ /index.html;
```

因为用户直接访问 `/about`、`/user/list`、`/order/detail` 时，服务器上并没有真实的 `/about` 文件，所以要回退到 `index.html`，让前端路由接管。

#### 静态资源缓存

```nginx
location /assets/ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

#### gzip

```nginx
gzip on;
gzip_types text/plain text/css application/javascript application/json image/svg+xml;
```

### 这个阶段的实战

部署 3 个前端项目：

1. 一个最简单的 HTML 页面
2. 一个 Vue/Vite 项目
3. 一个 React/Vite 项目

分别配置不同路径或不同端口/子域名。

---

## 阶段 4：部署 Node / Nest / MySQL 项目

### 目标

部署一个真正的后端服务，用 Nginx 反向代理到 Node 服务。这一步就进入全栈部署能力了。

### 安装 Node 环境

用 `nvm` 管理 Node：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

```bash
nvm install 20
nvm use 20
node -v
npm -v
```

### 部署 Node 服务

```bash
npm install
npm run build
npm run start:prod
```

生产环境不能直接开着终端跑，用 `pm2` 管理进程：

```bash
npm install -g pm2
pm2 start dist/main.js --name my-api
pm2 list
pm2 logs my-api
pm2 restart my-api
pm2 stop my-api
pm2 save
pm2 startup
```

### Nginx 反向代理

Node 服务跑在 `localhost:3000`，Nginx 对外暴露 80：

```nginx
server {
    listen 80;
    server_name 你的域名或服务器IP;

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /var/www/my-app;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

这时候的结构是：

```
浏览器
  ↓
Nginx :80
  ├── /         → 前端 dist
  └── /api      → Node 服务 :3000
```

这是必须掌握的部署核心模型——前端 + 后端 + Nginx 统一入口。

### MySQL 部署

```bash
sudo apt install mysql-server
```

```bash
sudo mysql
```

```sql
CREATE DATABASE app_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'app_user'@'localhost' IDENTIFIED BY '你的密码';

GRANT ALL PRIVILEGES ON app_db.* TO 'app_user'@'localhost';

FLUSH PRIVILEGES;
```

Node 项目里配置：

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=app_user
DB_PASSWORD=你的密码
DB_DATABASE=app_db
```

### 这个阶段的实战

做一个最小全栈项目：Vue/React 页面 + NestJS/Express 提供 /api/hello + MySQL 存一张 user 表。

最终效果：浏览器访问页面 → 页面请求 /api/users → 后端查询 MySQL → 返回数据 → 前端展示。跑通这个链路，才算真正理解部署。

---

## 阶段 5：域名、HTTPS、自动化部署

### 目标

项目能通过域名 + HTTPS 正常访问，更新项目不再全靠手动复制。

### 域名与 DNS

| 记录类型 | 作用 |
|---------|------|
| A 记录 | 域名指向 IPv4 |
| CNAME | 域名指向另一个域名 |
| AAAA | 域名指向 IPv6 |

家用服务器大概率会遇到：没有公网 IP、家宽 80/443 端口被运营商封、动态 IP 变化、路由器端口映射问题。

可能需要了解：内网穿透、DDNS、Cloudflare Tunnel、frp、Tailscale / ZeroTier。

不过我的策略是**先完成局域网部署，不纠结公网访问**。

### HTTPS

有公网域名的话，用 certbot 很方便：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx
```

它会自动给 Nginx 配 HTTPS。

核心概念就三个：HTTP = 80、HTTPS = 443、证书 = 证明这个域名是你的。

### 自动化部署脚本

先不上 GitHub Actions，先写一个简单部署脚本：

```bash
#!/bin/bash

set -e

APP_DIR=/var/www/my-app

echo "清理旧文件"
rm -rf $APP_DIR/*

echo "复制新文件"
cp -r ./dist/* $APP_DIR/

echo "重载 nginx"
nginx -t
systemctl reload nginx

echo "部署完成"
```

写完就能理解部署本质：**构建 → 上传 → 替换文件 → 重启/重载服务**。

### Git 部署

服务器拉代码：

```bash
git clone 仓库地址
git pull
npm install
npm run build
pm2 restart my-api
```

后面可以封装成 `deploy.sh` 一键部署。

### CI/CD

等手动部署很熟之后再做 CI/CD：

```
push 代码 → 自动安装依赖 → 自动打包 → 自动上传服务器 → 自动重启服务
```

但不要一开始就上这个，否则只知道"怎么配 YAML"，不知道部署到底发生了什么。

---

## Docker 作为进阶

Docker 我放到后面再学，不抢主线：

```bash
docker
docker compose
Dockerfile
docker-compose.yml
volume
network
image
container
```

学习顺序：用 Docker 跑 Nginx → 跑 MySQL → 跑 Node 服务 → Docker Compose 编排前后端和数据库 → Nginx 做统一入口。

最终结构：

```
docker-compose
  ├── nginx
  ├── frontend
  ├── backend
  └── mysql
```

---

## 我的 4 周计划

### 第 1 周：服务器基础接管

实战：SSH 登录、配 SSH key、熟悉 Linux 常用命令、配防火墙、安装 Nginx、浏览器访问默认页面。

碎片时间：看 Linux 目录结构、端口/防火墙/SSH 基础概念、理解 systemctl。

### 第 2 周：部署前端项目

实战：本地打包 Vue/Vite 项目、上传 dist、配 Nginx、解决 history 路由刷新 404、配 gzip 和缓存、部署多个前端项目。

碎片时间：理解 Nginx server/location/root/alias、反向代理和静态资源服务的区别。

### 第 3 周：部署 Node + MySQL

实战：安装 Node、部署 Nest 服务、用 PM2 管理进程、安装 MySQL、前端请求后端接口、后端查询数据库。

碎片时间：理解进程/端口/localhost/127.0.0.1、Nginx 反向代理、环境变量 `.env`。

### 第 4 周：自动化与稳定性

实战：写 deploy.sh、用 Git 拉代码部署、做数据库备份脚本、配日志查看命令、尝试 HTTPS、有余力再尝试 Docker Compose。

碎片时间：看 CI/CD 基本流程、Docker 基础概念、HTTPS 证书原理。

---

## 能力沉淀

走完这 4 周，我要沉淀的能力图谱：

**连接服务器：** SSH、用户、权限、目录、上传文件

**运行服务：** systemctl、Nginx、Node、PM2、MySQL

**对外访问：** 端口、防火墙、反向代理、域名、HTTPS

**更新项目：** build、scp、git pull、deploy.sh、pm2 restart、nginx reload

**排查问题：** curl、netstat/ss、journalctl、nginx error.log、pm2 logs、mysql logs

**工程化：** Docker、Docker Compose、CI/CD、监控、备份

---

## 我的建议优先级

主线：Nginx 靝态部署 → Nginx 反向代理 Node → PM2 管理 Node → MySQL → 部署脚本 → HTTPS/域名 → Docker → CI/CD。

不要一开始就碰：K8s、Prometheus、Jenkins、复杂云原生、大型微服务部署——这些现在性价比不高。

这台 Ubuntu 服务器，我最想把它变成一个个人实验室：前端项目、Node 项目、AI 小服务、博客、内网工具，都可以逐步往上部署。一步一步来，先把最基础的跑通。
