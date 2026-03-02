import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"NestJS 教程 02：三层架构与 MVC 的落地","description":"讲清三层架构与 MVC 的区别，以及在 NestJS 中如何结合。","frontmatter":{"title":"NestJS 教程 02：三层架构与 MVC 的落地","date":"2026-02-19T00:00:00.000Z","description":"讲清三层架构与 MVC 的区别，以及在 NestJS 中如何结合。"},"headers":[],"relativePath":"tutorials/nestjs/nestjs-tutorial-02-layered-architecture-and-mvc.md","filePath":"tutorials/nestjs/nestjs-tutorial-02-layered-architecture-and-mvc.md"}');
const _sfc_main = { name: "tutorials/nestjs/nestjs-tutorial-02-layered-architecture-and-mvc.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="nestjs-教程-02-三层架构与-mvc-的落地" tabindex="-1">NestJS 教程 02：三层架构与 MVC 的落地 <a class="header-anchor" href="#nestjs-教程-02-三层架构与-mvc-的落地" aria-label="Permalink to &quot;NestJS 教程 02：三层架构与 MVC 的落地&quot;">​</a></h1><blockquote><p>系列说明：本文是 NestJS 教程第 2 篇，重点是建立架构认知，避免后续模块设计混乱。</p></blockquote><h2 id="_1-三层架构是什么" tabindex="-1">1. 三层架构是什么 <a class="header-anchor" href="#_1-三层架构是什么" aria-label="Permalink to &quot;1. 三层架构是什么&quot;">​</a></h2><p>三层架构（Three-Tier Architecture）通常把后端系统拆成：</p><ul><li>表示层（UI 层）</li><li>业务逻辑层（BLL）</li><li>数据访问层（DAL）</li></ul><p>它的核心目标是高内聚、低耦合，让系统更容易维护和扩展。</p><h3 id="调用关系" tabindex="-1">调用关系 <a class="header-anchor" href="#调用关系" aria-label="Permalink to &quot;调用关系&quot;">​</a></h3><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[ 用户 / 客户端 ]</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>+-------------------------+</span></span>
<span class="line"><span>|   表示层 (UI / Web层)   |</span></span>
<span class="line"><span>+-------------------------+</span></span>
<span class="line"><span>      │    ▲</span></span>
<span class="line"><span>      ▼    │</span></span>
<span class="line"><span>+-------------------------+</span></span>
<span class="line"><span>|  业务逻辑层 (BLL)       |</span></span>
<span class="line"><span>+-------------------------+</span></span>
<span class="line"><span>      │    ▲</span></span>
<span class="line"><span>      ▼    │</span></span>
<span class="line"><span>+-------------------------+</span></span>
<span class="line"><span>| 数据访问层 (DAL)        |</span></span>
<span class="line"><span>+-------------------------+</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>[ 数据库 ]</span></span></code></pre></div><h3 id="entity-的位置" tabindex="-1">Entity 的位置 <a class="header-anchor" href="#entity-的位置" aria-label="Permalink to &quot;Entity 的位置&quot;">​</a></h3><p><code>Entity</code> 不属于三层中的某一层，但会作为各层之间的数据载体。实际项目里还会配合 DTO、VO 等对象处理不同场景。</p><h2 id="_2-mvc-是什么" tabindex="-1">2. MVC 是什么 <a class="header-anchor" href="#_2-mvc-是什么" aria-label="Permalink to &quot;2. MVC 是什么&quot;">​</a></h2><p>MVC 把应用组织为：</p><ul><li><code>Model</code>：数据与业务逻辑</li><li><code>View</code>：展示层</li><li><code>Controller</code>：接收请求、调度流程</li></ul><p>标准流转：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HTTP 请求 -&gt; Controller -&gt; Model -&gt; View -&gt; 响应</span></span></code></pre></div><p>在前后端分离项目中，View 常由前端框架（Vue/React）承担；后端主要负责 Controller + 业务模型。</p><h2 id="_3-三层架构与-mvc-的区别" tabindex="-1">3. 三层架构与 MVC 的区别 <a class="header-anchor" href="#_3-三层架构与-mvc-的区别" aria-label="Permalink to &quot;3. 三层架构与 MVC 的区别&quot;">​</a></h2><table tabindex="0"><thead><tr><th style="${ssrRenderStyle({ "text-align": "left" })}">维度</th><th style="${ssrRenderStyle({ "text-align": "left" })}">三层架构</th><th style="${ssrRenderStyle({ "text-align": "left" })}">MVC</th></tr></thead><tbody><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">关注点</td><td style="${ssrRenderStyle({ "text-align": "left" })}">系统级分层与职责边界</td><td style="${ssrRenderStyle({ "text-align": "left" })}">请求处理与展示分离</td></tr><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">常见位置</td><td style="${ssrRenderStyle({ "text-align": "left" })}">后端整体架构</td><td style="${ssrRenderStyle({ "text-align": "left" })}">Web 交互入口层</td></tr><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">目标</td><td style="${ssrRenderStyle({ "text-align": "left" })}">解耦业务与数据访问</td><td style="${ssrRenderStyle({ "text-align": "left" })}">解耦控制流程与展示</td></tr></tbody></table><h2 id="_4-在-nestjs-中如何结合" tabindex="-1">4. 在 NestJS 中如何结合 <a class="header-anchor" href="#_4-在-nestjs-中如何结合" aria-label="Permalink to &quot;4. 在 NestJS 中如何结合&quot;">​</a></h2><p>NestJS 常见落地可以理解为：</p><ul><li><code>Controller</code>：接收请求、参数校验，贴近 MVC 的 C，也承担三层里的表示层职责</li><li><code>Service</code>：承载核心业务规则，对应 BLL</li><li><code>Repository/DAO</code>：读写数据库，对应 DAL</li></ul><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>客户端 -&gt; Controller -&gt; Service -&gt; Repository -&gt; Database</span></span></code></pre></div><p>这种组织方式的价值：</p><ol><li>控制器精简，只做路由和编排</li><li>业务逻辑沉淀在 Service，便于复用与测试</li><li>数据访问集中在 Repository，替换存储方案时影响面更小</li></ol><h2 id="_5-实战建议" tabindex="-1">5. 实战建议 <a class="header-anchor" href="#_5-实战建议" aria-label="Permalink to &quot;5. 实战建议&quot;">​</a></h2><ul><li>先按三层职责拆目录，再用 MVC 的请求流转去约束代码边界</li><li>不要把业务规则写进 Controller</li><li>不要让 Repository 知道 HTTP 细节</li><li>优先用 DTO 做输入输出边界，避免 Entity 被直接暴露</li></ul><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>三层架构解决“系统如何分层”，MVC 解决“请求如何流转”，两者在 NestJS 中并不冲突，而是互补。</p><p>下一篇：<code>NestJS 教程 03</code> 继续讲 IoC/DI 以及 Providers 的几种注入策略。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tutorials/nestjs/nestjs-tutorial-02-layered-architecture-and-mvc.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const nestjsTutorial02LayeredArchitectureAndMvc = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  nestjsTutorial02LayeredArchitectureAndMvc as default
};
