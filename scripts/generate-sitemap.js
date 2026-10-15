/**
 * Automated Sitemap.xml Generator
 * Scans all public HTML files and updates sitemap.xml with accurate lastmod and priorities
 * 
 * Usage:
 *   node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SITE_DOMAIN = process.env.SITE_DOMAIN || 'xuantizhinan.vip';

// Page priority & frequency lookup (Strictly aligned with SEO instructions)
const PRIORITY_MAP = {
  // 首页: priority 1.0, daily
  'index.html': { priority: '1.0', freq: 'daily', urlPath: '' },

  // 核心榜单与优惠券: priority 0.9, weekly
  'airports/top-brands.html': { priority: '0.9', freq: 'weekly', urlPath: 'airports/top-brands.html' },
  'airports/iepl-lines.html': { priority: '0.9', freq: 'weekly', urlPath: 'airports/iepl-lines.html' },
  'airports/budget-ondemand.html': { priority: '0.9', freq: 'weekly', urlPath: 'airports/budget-ondemand.html' },
  'coupons/index.html': { priority: '0.9', freq: 'weekly', urlPath: 'coupons/' },

  // 深度指南与 6 篇品牌单测: priority 0.8, weekly
  'posts/index.html': { priority: '0.8', freq: 'weekly', urlPath: 'posts/' },
  'posts/global-iplc-benchmark-2026.html': { priority: '0.8', freq: 'weekly', urlPath: 'posts/global-iplc-benchmark-2026.html' },
  'posts/iplc-iepl-bgp-difference-guide.html': { priority: '0.8', freq: 'weekly', urlPath: 'posts/iplc-iepl-bgp-difference-guide.html' },
  'posts/monthly-vs-annual-subscription-guide.html': { priority: '0.8', freq: 'weekly', urlPath: 'posts/monthly-vs-annual-subscription-guide.html' },
  'posts/clash-singbox-hysteria2-config-guide.html': { priority: '0.8', freq: 'weekly', urlPath: 'posts/clash-singbox-hysteria2-config-guide.html' },
  'posts/reviews/yunjiexian.html': { priority: '0.8', freq: 'weekly', urlPath: 'posts/reviews/yunjiexian.html' },
  'posts/reviews/dalaoyun.html': { priority: '0.8', freq: 'weekly', urlPath: 'posts/reviews/dalaoyun.html' },
  'posts/reviews/huanqiuti.html': { priority: '0.8', freq: 'weekly', urlPath: 'posts/reviews/huanqiuti.html' },
  'posts/reviews/shenxing.html': { priority: '0.8', freq: 'weekly', urlPath: 'posts/reviews/shenxing.html' },
  'posts/reviews/liulianyun.html': { priority: '0.8', freq: 'weekly', urlPath: 'posts/reviews/liulianyun.html' },
  'posts/reviews/shandianshu.html': { priority: '0.8', freq: 'weekly', urlPath: 'posts/reviews/shandianshu.html' },

  // 合规声明三部曲: priority 0.6, monthly
  'about/disclaimer.html': { priority: '0.6', freq: 'monthly', urlPath: 'about/disclaimer.html' },
  'about/methodology.html': { priority: '0.6', freq: 'monthly', urlPath: 'about/methodology.html' },
  'about/benchmarks.html': { priority: '0.6', freq: 'monthly', urlPath: 'about/benchmarks.html' }
};

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function scanHtmlFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file.startsWith('.') || file === 'review-template.html' || file === '2026-global-lines-benchmark.html') continue;
    const fullPath = path.join(dir, file);
    const relPath = path.join(base, file).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanHtmlFiles(fullPath, relPath));
    } else if (file.endsWith('.html')) {
      results.push({ relPath, stat });
    }
  }
  return results;
}

const files = scanHtmlFiles(ROOT_DIR);
const today = formatDate(new Date());

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

files.forEach(({ relPath, stat }) => {
  const config = PRIORITY_MAP[relPath] || {
    priority: '0.80',
    freq: 'weekly',
    urlPath: relPath
  };

  const fileDate = formatDate(stat.mtime || new Date());
  const loc = `https://${SITE_DOMAIN}/${config.urlPath}`;

  xml += `  <url>\n`;
  xml += `    <loc>${loc}</loc>\n`;
  xml += `    <lastmod>${fileDate || today}</lastmod>\n`;
  xml += `    <changefreq>${config.freq}</changefreq>\n`;
  xml += `    <priority>${config.priority}</priority>\n`;
  xml += `  </url>\n`;
});

xml += `</urlset>\n`;

const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`✅ sitemap.xml 重新生成成功！已收录 ${files.length} 个页面文件。`);
console.log(`   文件路径: ${sitemapPath}`);
