import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/my-blog/assets/81.Dpwplfhe.png";
const _imports_1 = "/my-blog/assets/82.Dmw_wr9w.png";
const __pageData = JSON.parse('{"title":"NestJS 教程 16：状态保存方式","description":"讲清 Cookie、LocalStorage/SessionStorage、Session、JWT 四种状态保存方式及其核心差异。","frontmatter":{"title":"NestJS 教程 16：状态保存方式","date":"2026-03-05T00:00:00.000Z","description":"讲清 Cookie、LocalStorage/SessionStorage、Session、JWT 四种状态保存方式及其核心差异。"},"headers":[],"relativePath":"tutorials/nestjs/nestjs-tutorial-16-state-persistence.md","filePath":"tutorials/nestjs/nestjs-tutorial-16-state-persistence.md"}');
const _sfc_main = { name: "tutorials/nestjs/nestjs-tutorial-16-state-persistence.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="状态保存的方式" tabindex="-1">状态保存的方式 <a class="header-anchor" href="#状态保存的方式" aria-label="Permalink to &quot;状态保存的方式&quot;">​</a></h2><p>HTTP 协议是无状态的，也就是说上一次请求和下一次请求之间是没有关联的，但是很多时候我们需要状态的保持，特别是登录状态的保持。</p><p>一般来说，在不考虑第三方平台的情况下，常见状态保持方式有下面几种：</p><ul><li>Cookie</li><li>LocalStorage/SessionStorage</li><li>Session</li><li>JWT Token</li></ul><p>至于什么是 Cookie、Session、LocalStorage/SessionStorage、JWT，这里不再重复基础定义。下面主要总结它们在工程实践中的特点。</p><h3 id="_1-cookie" tabindex="-1">1. Cookie <a class="header-anchor" href="#_1-cookie" aria-label="Permalink to &quot;1. Cookie&quot;">​</a></h3><ul><li>原理：将信息存储在浏览器 Cookie 中，客户端每次发请求时会自动携带 Cookie 信息，服务端可据此识别状态。</li><li>特点： <ul><li>自动发送：浏览器会自动把 Cookie 附加到请求头。</li><li>安全控制：可通过 <code>HttpOnly</code>（防 XSS）、<code>Secure</code>（仅 HTTPS）、<code>SameSite</code>（防 CSRF）增强安全性。</li><li>大小限制：单个 Cookie 通常不超过 4KB。</li></ul></li></ul><h3 id="_2-localstorage-sessionstorage" tabindex="-1">2. LocalStorage/SessionStorage <a class="header-anchor" href="#_2-localstorage-sessionstorage" aria-label="Permalink to &quot;2. LocalStorage/SessionStorage&quot;">​</a></h3><ul><li>原理：登录后将 Token 或其他凭证存储在浏览器 <code>localStorage</code> 或 <code>sessionStorage</code> 中，前端请求时手动添加到 HTTP 头。</li><li>特点： <ul><li>存储容量较大，数据不会随请求自动发送。</li><li>易受 XSS 影响，需要额外的前端安全防护。</li></ul></li></ul><h3 id="_3-服务器端-session" tabindex="-1">3. 服务器端 Session <a class="header-anchor" href="#_3-服务器端-session" aria-label="Permalink to &quot;3. 服务器端 Session&quot;">​</a></h3><ul><li>原理：登录后服务端生成唯一 Session ID 并保存到服务端存储；浏览器通过 Cookie 保存 Session ID。后续请求由服务端根据 Session ID 识别用户状态。</li><li>特点： <ul><li>服务端存储用户状态，安全性相对更高。</li><li>在分布式系统里需要共享 Session 存储（例如 Redis 集群），否则会有状态不一致问题。</li></ul></li></ul><h3 id="_4-jwt-json-web-token" tabindex="-1">4. JWT（JSON Web Token） <a class="header-anchor" href="#_4-jwt-json-web-token" aria-label="Permalink to &quot;4. JWT（JSON Web Token）&quot;">​</a></h3><ul><li>原理：把用户信息编码为 Token，通常通过 Bearer Token 方式传给客户端。客户端保存后，后续请求通过 <code>Authorization</code> 头携带。</li><li>特点： <ul><li>无状态：服务端不必保存会话状态，更适合分布式系统。</li><li>自包含：Token 可携带必要用户信息，减少部分数据库查询。</li><li>安全边界明确：若缺乏签名与过期等策略，Token 可能被伪造或泄露。</li></ul></li></ul><p><img${ssrRenderAttr("src", _imports_0)} alt="状态保持方式对比图1"></p><p><img${ssrRenderAttr("src", _imports_1)} alt="状态保持方式对比图2"></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tutorials/nestjs/nestjs-tutorial-16-state-persistence.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const nestjsTutorial16StatePersistence = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  nestjsTutorial16StatePersistence as default
};
