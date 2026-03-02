import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"观点","description":"原则、方法论与思考，解释我为什么这么做。","frontmatter":{"title":"观点","description":"原则、方法论与思考，解释我为什么这么做。"},"headers":[],"relativePath":"opinions/index.md","filePath":"opinions/index.md"}');
const _sfc_main = { name: "opinions/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="观点" tabindex="-1">观点 <a class="header-anchor" href="#观点" aria-label="Permalink to &quot;观点&quot;">​</a></h1><p>这里记录我的方法论与原则，尽量用可复用的框架表达。</p><h2 id="目录" tabindex="-1">目录 <a class="header-anchor" href="#目录" aria-label="Permalink to &quot;目录&quot;">​</a></h2><ul><li><a href="/my-blog/opinions/ai-era-dev-ai-collaboration.html">AI 时代程序员与 AI 协作的方法论</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("opinions/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
