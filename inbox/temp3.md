# 微信 H5 支付踩坑复盘：JSSDK 签名偶发失败 &「URL 未注册」支付拦截
> 这篇记录一个真实线上排障：同一套代码，有时 `wx.config` 成功、有时 `config:invalid signature`；后来签名稳定了，支付又被微信弹窗拦截：「当前页面的URL未注册」。  
> 最终两个问题都解决了，本文把关键现象、定位路径、根因与修复动作整理成可复用的 checklist。

---

## 现象一：`wx.config` 偶发 `config:invalid signature`

### 表现

- 打开 `https://hmthm.joymew.com/#/` 有时弹 `config:ok`，有时弹 `config:invalid signature`
- 同一条 URL、同一个 `appId`，后端 `/qianMing` 返回的签名参数（timestamp/nonceStr/signature）每次都不一样（这本来正常），但微信端校验**时好时坏**
- 右上角“刷新”多刷几次，更容易复现失败

### 为什么“同 URL 也会不稳定”？

`wx.config` 的校验本质是：

```

signature == SHA1("jsapi_ticket=...&noncestr=...&timestamp=...&url=<当前页面URL(不含#)>")

```

URL 只要一个字符不一致都会失败——但这次更诡异：**URL 是一致的，仍然偶发失败**。

这时候就要把注意力从“前端拼 URL 是否正确”转向**后端生成签名的票据是否稳定**：

- `jsapi_ticket` 是否过期 / 刷新失败
- 是否存在多实例 / 负载均衡
- 各实例是否共享 ticket 缓存
- 缓存刷新是否有并发保护

### 最终根因

**负载均衡 + ticket 缓存不一致**导致：

- 有的请求落到 A 节点，ticket 新鲜 → 签名可用
- 有的请求落到 B 节点，ticket 过期或刷新失败 → 签名不可用
- 表现为同 URL 也会“偶发 invalid signature”

> 一句话总结：签名逻辑依赖 `jsapi_ticket`，ticket 在不同节点不一致，签名自然就不稳定。

### 修复动作（后端侧）

- ✅ ticket/access_token/jsapi_ticket **改为共享缓存**（如 Redis），所有节点读同一份
- ✅ 刷新 ticket 做**单飞**（singleflight/分布式锁），避免多个节点/线程同时刷新互相覆盖
- ✅ 刷新失败不要覆盖旧 ticket；记录日志并保底使用最后一次成功值
- ✅ 给签名服务增加观测：输出 “参与签名的 url / ticket 更新时间 / ticket hash / 所属实例” 便于回溯

> 修复后：`wx.config` 不再偶发失败，签名问题解决。

---

## 现象二：`chooseWXPay` 弹「当前页面的URL未注册」

签名稳定后继续走支付链路：

```

submitOrder -> requestWxPay -> invokeWxSdk(wx.chooseWXPay)

````

### 表现

- 点击支付后，先出现微信支付 loading
- 随后弹窗：

> 当前页面的URL未注册: https://hmthm.joymew.com/

这类弹窗很多人第一反应是“前端代码哪里 alert 了”，但搜代码找不到——因为它通常是微信支付侧的拦截提示（或 JSSDK fail errMsg 的可视化）。

### 根因

**商户号未配置支付目录**（或目录未命中）。

微信 H5 支付对“发起支付的页面”有强约束：页面 URL 必须落在商户平台配置的**支付目录**下，否则直接拦截，并提示 URL 未注册。

> 这和 JSSDK 签名不是一回事：签名 OK 只代表 JSAPI 鉴权通过；支付还要过“商户支付目录”的校验。

### 修复动作（商户平台）

在微信商户平台配置支付目录：

- ✅ 域名必须与实际发起支付页面一致（协议/域名/端口）
- ✅ 目录通常配置到站点根或业务目录，例如：
  - `https://hmthm.joymew.com/`
- ✅ 不要带 query 参数
- ✅ 若存在多个子域名（如 `m.` / `www.`）或多套环境，需要分别配置
- ✅ 配置后注意生效时间（有时有延迟），并清理缓存重新进入验证

> 配置支付目录后：`chooseWXPay` 不再被拦截，支付问题解决。

---

## 你可能会被误导的点（反直觉但很常见）

### 1）`realAuthUrl` 为什么是数组？为什么带 `#`？

`wx.error` 返回对象里可能出现类似：

```json
{
  "realAuthUrl": ["https://hmthm.joymew.com/#/", "https://hmthm.joymew.com/#/"],
  "errMsg": "config:invalid signature"
}
````

* `realAuthUrl` 是微信侧的诊断信息，可能收集了多个“URL 候选来源/多次采样”的值，所以是数组
* 带 `#` 多半是“展示用”的完整地址（例如 `location.href`），**不代表签名真的包含 hash**
* 签名规则仍以“不含 #”的 URL 为准

### 2）为什么“右上角刷新”更容易触发问题？

微信的刷新/重入可能导致：

* 页面被重新打开或重入
* URL 在内部被改写/附加参数（你肉眼未必看得见，`document.URL` 往往更能反映真实值）
* 如果签名依赖的 ticket 不稳定（多节点缓存不一致），刷新就会放大“随机落到哪个节点”的概率

---

## 一份可复用的排障 Checklist

### A. 排 `config:invalid signature`

1. 确认签名 URL：打印 `document.URL`、`location.href`、以及最终用于签名的 URL（去掉 `#`）
2. 对比“成功/失败两次”的：

   * `url`
   * `appId`
   * `timestamp/nonceStr/signature`
3. 如果 URL 完全一致仍偶发失败：

   * 强烈怀疑 ticket 缓存/刷新不稳定（多实例、无共享缓存、刷新失败覆盖）
4. 服务端观测：

   * 打印 ticket 更新时间、ticket hash、实例标识、参与签名 URL
5. 修复方向：

   * ticket 共享缓存 + 单飞刷新 + 失败不覆盖

### B. 排「URL 未注册」支付失败

1. 这是支付侧拦截，不要只盯前端代码
2. 检查商户平台：

   * 支付目录是否配置
   * 是否命中（协议/域名/路径）
3. 若你用 SPA/hash 路由：

   * 支付目录通常按域名/路径匹配，hash 不一定参与，但“根域名没配置”必挂
4. 配置后重新进入验证（避免被旧 webview 缓存影响）

---

## 收尾

这次排障的关键教训其实就两条：

1. **签名稳定性是后端系统工程问题**：负载均衡 + 缓存策略不当，会让“看起来随机”的 `invalid signature` 变成线上噩梦。
2. **支付失败不等于签名失败**：`chooseWXPay` 的「URL 未注册」通常是商户侧配置问题（支付目录），不要在前端里无意义地兜圈子。

如果你也遇到“同 URL 偶发 invalid signature”或“支付 URL 未注册”，建议直接按本文 checklist 跑一遍，基本都能快速收敛。
