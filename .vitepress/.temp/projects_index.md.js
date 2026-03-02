import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"项目","description":"真实业务的方案、架构决策与复盘记录。","frontmatter":{"title":"项目","description":"真实业务的方案、架构决策与复盘记录。"},"headers":[],"relativePath":"projects/index.md","filePath":"projects/index.md"}');
const _sfc_main = { name: "projects/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="项目" tabindex="-1">项目 <a class="header-anchor" href="#项目" aria-label="Permalink to &quot;项目&quot;">​</a></h1><p>这里记录真实项目的方案、架构决策与复盘，重点放在背景、权衡与结果。</p><h2 id="代表作" tabindex="-1">代表作 <a class="header-anchor" href="#代表作" aria-label="Permalink to &quot;代表作&quot;">​</a></h2><ul><li><a href="/my-blog/projects/wechat-h5-pay-jssdk-signature-url-not-registered.html">微信 H5 支付踩坑复盘：JSSDK 签名偶发失败与「URL 未注册」拦截</a></li><li><a href="/my-blog/projects/vue-duplicate-key-ui-freeze.html">重复 key 触发 Vue patch 崩溃：一次前端“假死”排查</a></li><li><a href="/my-blog/projects/repomix-helper-vscode-workflow.html">repomix-helper：把 repomix 变成 VS Code 一键工作流</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("projects/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
