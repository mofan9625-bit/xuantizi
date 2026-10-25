# 2026 高转化与 SEO 深度优化机场评测静态博客系统

专为 **Bing / Google** 搜索引擎高抓取权重、高转化闭环量身定制的极客风格静态博客系统。

---

## 🌟 核心特性与架构优势

1. **极客黑白极简美学 (Core Web Vitals 全绿)**：
   - 纯原生 HTML5 / CSS3 / Vanilla JS 架构，单页总渲染体积 < 35KB，首屏 FCP < 0.2s，CLS 为 0。
   - 沉浸式暗黑科技风格、等宽字体数据流展示、动态脉冲探针状态灯、平滑毛玻璃微质感。
2. **Bing / Google 深度搜索引擎优化**：
   - 每个页面配备精准的 2026 年份长尾关键词、规范 `<link rel="canonical">`、完整的 Open Graph / Twitter Card 社交标签。
   - **Schema.org 结构化数据全覆盖**：长文页面使用 `Article`，问答模块使用 `FAQPage`，推荐榜单使用 `ItemList`，面包屑使用 `BreadcrumbList`，大幅提升搜索引擎 Rich Snippet（富媒体搜索结果）展现率。
   - 所有外部推广链接严格添加 `target="_blank" rel="noopener noreferrer nofollow sponsored"`，避免被算法降权。
3. **IndexNow 与 Sitemap 全自动化**：
   - 包含标准的 `sitemap.xml`，以及动态自动扫描生成脚本 `scripts/generate-sitemap.js`。
   - 预置 `[INDEXNOW_KEY].txt` 密钥文件与全自动向 Bing / Yandex 推送 URL 的脚本 `scripts/push-indexnow.js`，实现内容秒级收录。
4. **4 大核心维度金字塔矩阵设计（杜绝空壳死胡同）**：
   - **首页 (Index)**：Hero 首屏、数据统计栏、置顶精选长文卡片、榜单矩阵、FAQ 问答。
   - **【年度品牌总榜 (Top 6)】**：6 大主力品牌、网络拓扑参数、审计报告与官网直达双闭环按钮。
   - **【IEPL / IPLC 顶级专线精选】**：200 字专线科普硬核长文，4 家晚高峰零丢包物理专线。
   - **【平价月付与不限时按量合集】**：按量计费 vs 平价月付真实特性对比，学生党与备用防失联优选。
   - **【2026 独家优惠码与省钱清单】**：6 大品牌优惠码网格，一键点击复制到剪贴板并弹出 Toast 提示。
   - **深度横评长文模板**：168 小时实测方法论、P95 延迟与丢包指标权重表、分流配置代码块、正文末尾双 CTA 落地闭环。
5. **防死链与无缝路由兼容**：
   - 站内所有内链均经过规范化相对路径处理，绝无本地 `file:///` 残留。
   - 配备 `_redirects`（Cloudflare/Netlify）、`vercel.json`（Vercel）与 `nginx.conf.example`，静默支持 `/page` 与 `/page.html` 访问，禁止前端无意义的死循环重定向。

---

## 📁 完整目录结构清单

```text
.
├── index.html                           # 网站首页 (Hero, 置顶评测, 核心指标, 榜单入口, FAQ)
├── airports/
│   ├── top-brands.html                  # 【年度品牌总榜 (Top 6)】- 6大主力品牌，多维筛选，审计报告+直达
│   ├── iepl-lines.html                  # 【IEPL / IPLC 顶级专线精选】- 200字专线原理科普+晚高峰抗抖动旗舰
│   └── budget-ondemand.html             # 【平价月付与不限时按量合集】- 备用/学生党/不限时按量全面横评
├── coupons/
│   └── index.html                       # 【2026 独家优惠码与省钱清单】- 一键复制优惠码, 直达通道, 优惠贴士
├── posts/
│   ├── 2026-global-lines-benchmark.html # 核心长文：《2026 全球专线深度横评：稳定，比峰值更重要》
│   └── review-template.html             # 通用深度评测长文模板 (预置 Schema.org Article、方法论、CTA闭环)
├── assets/
│   ├── css/
│   │   └── style.css                    # 统一全局极客黑白极简样式库 (CSS Variables, 响应式, 状态指示灯)
│   ├── js/
│   │   └── main.js                      # 导航交互、一键复制、Toast提示、平滑滚动、安全链接审计
│   └── images/
│       └── logo.svg                     # 极客风格 SVG 矢量 Logo
├── scripts/
│   ├── generate-sitemap.js              # 自动扫描生成 sitemap.xml 脚本
│   ├── push-indexnow.js                 # 自动化向 Bing / IndexNow 推送新 URL 脚本
│   ├── replace-placeholders.js          # 一键替换所有站点占位符的批处理脚本
│   └── config.example.json              # 替换配置文件模板
├── sitemap.xml                          # 预构建的标准 sitemap.xml 文件 (优先级、更新频次、规范路径)
├── robots.txt                           # 预构建的搜索引擎爬虫配置 robots.txt (包含 Sitemap 声明)
├── [INDEXNOW_KEY].txt                   # IndexNow 验证密钥文件模板
├── package.json                         # npm 工具链脚本
├── _redirects                           # Cloudflare Pages / Netlify 静默路由配置
├── vercel.json                          # Vercel 静态托管配置 (cleanUrls: true)
├── nginx.conf.example                   # Nginx 服务器配置示例 (静默 .html 兼容与 Gzip 缓存优化)
└── README.md                            # 项目说明文档
```

---

## 🛠️ 站长统一替换操作指引（10 秒搞定）

本项目所有品牌名、网址、链接、优惠码均采用标准化占位符。替换非常简单：

### 1. 复制并编辑配置文件
在 `scripts/` 目录下复制 `config.example.json` 为 `config.json`：
```json
{
  "SITE_NAME": "你的博客名称",
  "SITE_DOMAIN": "yourdomain.com",
  "INDEXNOW_KEY": "你的IndexNow密钥字符串",
  "BRAND_NAME_1": "品牌1名字",
  "AFF_LINK_1": "https://brand1.com/aff?code=xxx",
  "COUPON_CODE_1": "DISCOUNT15",
  "BRAND_NAME_2": "品牌2名字",
  "AFF_LINK_2": "https://brand2.com/aff?code=xxx",
  "COUPON_CODE_2": "DISCOUNT20",
  ...
}
```

### 2. 执行自动批量替换
在终端中执行：
```bash
node scripts/replace-placeholders.js
```
该脚本会自动遍历全站所有 HTML、XML、JS、TXT 文件，将占位符统一替换为您的实际内容，并自动将 `[INDEXNOW_KEY].txt` 更名为对应的密钥文件！

---

## 🚀 常用运维与 SEO 命令

在项目根目录运行以下 Node.js 脚本：

```bash
# 1. 完整构建、同步静态资源并自动向 IndexNow 推送全站最新 URL
npm run build

# 2. 重新扫描全站并生成最新的 sitemap.xml
npm run sitemap

# 3. 向 Bing / IndexNow API 实时批量推送所有最新页面
npm run push-indexnow

# 4. 本地启动轻量预览服务器
npm run serve
```

---

## 🌐 推荐部署平台

- **Cloudflare Pages**：直接拖拽或连接 Git 仓库即可免费托管，支持全球极速 Anycast CDN，自带 `_redirects` 路由生效。
- **Vercel**：预置 `vercel.json`，支持原生 cleanUrls 与 HTTP 强缓存。
- **自建 Nginx / 宝塔**：参考 `nginx.conf.example` 配置，实现 `/page` 与 `/page.html` 的静默访问与 Gzip 极速压缩。
