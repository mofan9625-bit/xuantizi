/**
 * IndexNow Bing / Search Engine Push Script
 * Specification: https://www.indexnow.org/documentation
 * Endpoint: https://api.indexnow.org/indexnow
 * 
 * Usage:
 *   node scripts/push-indexnow.js
 * Or with custom domain/key:
 *   SITE_DOMAIN=xuantizhinan.vip INDEXNOW_KEY=xuantizhinan2026indexnowkey node scripts/push-indexnow.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. Configuration
const SITE_DOMAIN = process.env.SITE_DOMAIN || 'xuantizhinan.vip';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'xuantizhinan2026indexnowkey';
const KEY_LOCATION = `https://${SITE_DOMAIN}/xuantizhinan-indexnow-key.txt`;

// 2. Default URLs fallback
const DEFAULT_URLS = [
  `https://${SITE_DOMAIN}/`,
  `https://${SITE_DOMAIN}/airports/top-brands.html`,
  `https://${SITE_DOMAIN}/airports/iepl-lines.html`,
  `https://${SITE_DOMAIN}/airports/budget-ondemand.html`,
  `https://${SITE_DOMAIN}/coupons/`,
  `https://${SITE_DOMAIN}/posts/`,
  `https://${SITE_DOMAIN}/posts/global-iplc-benchmark-2026.html`,
  `https://${SITE_DOMAIN}/posts/iplc-iepl-bgp-difference-guide.html`,
  `https://${SITE_DOMAIN}/posts/monthly-vs-annual-subscription-guide.html`,
  `https://${SITE_DOMAIN}/posts/clash-singbox-hysteria2-config-guide.html`
];

// Helper: Attempt to parse sitemap.xml if available
function getUrlsFromSitemap() {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    try {
      const content = fs.readFileSync(sitemapPath, 'utf8');
      const matches = [...content.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)];
      if (matches.length > 0) {
        return matches.map(m => m[1]);
      }
    } catch (err) {
      console.warn('⚠️ 读取 sitemap.xml 异常，将使用内置默认 URL 清单。');
    }
  }
  return DEFAULT_URLS;
}

const urlList = getUrlsFromSitemap();

const payload = JSON.stringify({
  host: SITE_DOMAIN,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList
});

console.log('====================================================');
console.log('🚀 IndexNow URL 实时推送工具 (Bing / Yandex / Naver)');
console.log('====================================================');
console.log(`📡 目标域名: ${SITE_DOMAIN}`);
console.log(`🔑 验证密钥: ${INDEXNOW_KEY}`);
console.log(`📍 密钥地址: ${KEY_LOCATION}`);
console.log(`📄 提交 URL 数量: ${urlList.length} 条`);
urlList.forEach((url, i) => console.log(`   [${i + 1}] ${url}`));
console.log('----------------------------------------------------');

const reqOptions = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(reqOptions, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log(`\n📬 接口响应状态码: ${res.statusCode} ${res.statusMessage}`);
    if (res.statusCode === 200) {
      console.log('✅ 推送成功！Bing/IndexNow 搜索引擎已收录提交请求。');
    } else if (res.statusCode === 202) {
      console.log('✅ 请求已接受 (202 Accepted)，IndexNow 正在等待密钥验证后生效。');
    } else if (res.statusCode === 400) {
      console.log('❌ 400 Bad Request: 格式错误，请检查 URL 格式与域名是否匹配。');
    } else if (res.statusCode === 403) {
      console.log(`❌ 403 Forbidden: 密钥无效，请确认 ${KEY_LOCATION} 是否可公开访问。`);
    } else if (res.statusCode === 422) {
      console.log('❌ 422 Unprocessable Entity: URL 域名与 host 不一致。');
    } else {
      console.log(`⚠️ 其他状态返回: ${responseData || '(空)'}`);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ 请求失败: ${e.message}`);
});

req.write(payload);
req.end();
