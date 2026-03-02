import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"汪元会的小窝","tagline":"把学到的、做过的、踩过的坑，沉淀成清晰的知识结构。"},"features":[{"title":"教程","details":"路线式整理，从 0 到能做，强调可复用。","link":"/tutorials/"},{"title":"项目","details":"真实业务的方案、架构决策与复盘（看我怎么做取舍）。","link":"/projects/"},{"title":"笔记","details":"术语 / 碎片 / 小结，快速查、快速补。","link":"/notes/"},{"title":"观点","details":"原则、方法论与思考（我为什么这么做）。","link":"/opinions/"}]},"headers":[],"relativePath":"index.md","filePath":"index.md"}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_RecentTimeline = resolveComponent("RecentTimeline");
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="自我定位" tabindex="-1">自我定位 <a class="header-anchor" href="#自我定位" aria-label="Permalink to &quot;自我定位&quot;">​</a></h2><p>我在走向前端架构师的路上。</p><h2 id="近期发布" tabindex="-1">近期发布 <a class="header-anchor" href="#近期发布" aria-label="Permalink to &quot;近期发布&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_RecentTimeline, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
