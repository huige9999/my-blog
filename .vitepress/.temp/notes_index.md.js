import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"笔记","description":"学习碎片、术语解释、短总结，快速查、快速补。","frontmatter":{"title":"笔记","description":"学习碎片、术语解释、短总结，快速查、快速补。"},"headers":[],"relativePath":"notes/index.md","filePath":"notes/index.md"}');
const _sfc_main = { name: "notes/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="笔记" tabindex="-1">笔记 <a class="header-anchor" href="#笔记" aria-label="Permalink to &quot;笔记&quot;">​</a></h1><p>这里是零散但高频的知识点，尽量短、清、可检索。</p><ul><li><a href="/my-blog/notes/worktree-parallel-development.html">用 Worktree 把本地并行开发变简单</a></li><li><a href="/my-blog/notes/claude-code-memory-organization.html">Claude Code 的项目记忆组织思路</a></li><li><a href="/my-blog/notes/tailscale-rdp-remote-host-guide.html">Tailscale + RDP 远程公司主机：实战排坑笔记</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
