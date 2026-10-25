/**
 * IndexNow Bing / Search Engine Push Script
 * Specification: https://www.indexnow.org/documentation
 * Endpoint: https://api.indexnow.org/indexnow
 * 
 * Usage:
 *   node scripts/push-indexnow.js
 *   node scripts/push-indexnow.js --url https://xuantizhinan.vip/
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// 1. Configuration & Key detection
let configKey = '';
try {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
  configKey = config.INDEXNOW_KEY;
} catch (e) {
  // Ignore missing config
}

const SITE_DOMAIN = process.env.SITE_DOMAIN || 'xuantizhinan.vip';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || configKey || '0eb9a05c7328adaa6d7dc403aede8750';
const KEY_FILE_NAME = `${INDEXNOW_KEY}.txt`;
const KEY_LOCATION = `https://${SITE_DOMAIN}/${KEY_FILE_NAME}`;

// 2. Extract URLs from sitemap.xml
function getUrlsFromSitemap() {
  const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    try {
      const content = fs.readFileSync(sitemapPath, 'utf8');
      const matches = [...content.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)];
      if (matches.length > 0) {
        return matches.map(m => m[1].trim());
      }
    } catch (err) {
      console.warn('⚠️ 读取 sitemap.xml 异常，将使用内置默认 URL 清单。');
    }
  }
  return [
    `https://${SITE_DOMAIN}/`,
    `https://${SITE_DOMAIN}/coupons/`,
    `https://${SITE_DOMAIN}/posts/`
  ];
}

// 3. Determine URL list
let urlList = [];
const args = process.argv.slice(2);
const singleUrlIdx = args.indexOf('--url');

if (singleUrlIdx !== -1 && args[singleUrlIdx + 1]) {
  urlList = [args[singleUrlIdx + 1]];
} else {
  urlList = getUrlsFromSitemap();
}

const payload = JSON.stringify({
  host: SITE_DOMAIN,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList
});

console.log('====================================================');
console.log('🚀 IndexNow URL 实时推送工具 (Bing / Yandex / Naver / Seznam)');
console.log('====================================================');
console.log(`📡 目标站点: ${SITE_DOMAIN}`);
console.log(`🔑 验证密钥: ${INDEXNOW_KEY}`);
console.log(`📍 密钥地址: ${KEY_LOCATION}`);
console.log(`📄 提交 URL 数量: ${urlList.length} 条`);
urlList.forEach((url, i) => console.log(`   [${String(i + 1).padStart(2, '0')}] ${url}`));
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
      console.log('✅ 推送成功！IndexNow 搜索引擎已收录提交请求。');
      process.exit(0);
    } else if (res.statusCode === 202) {
      console.log('✅ 请求已接受 (202 Accepted)，IndexNow 正在等待密钥验证后生效。');
      process.exit(0);
    } else if (res.statusCode === 400) {
      console.error('❌ 400 Bad Request: 格式错误，请检查 URL 格式与域名是否匹配。');
      process.exit(1);
    } else if (res.statusCode === 403) {
      console.error(`❌ 403 Forbidden: 密钥无效，请确认 ${KEY_LOCATION} 是否可公开访问。`);
      process.exit(1);
    } else if (res.statusCode === 422) {
      console.error('❌ 422 Unprocessable Entity: URL 域名与 host 不一致。');
      process.exit(1);
    } else {
      console.log(`⚠️ 其他状态返回: ${responseData || '(空)'}`);
      process.exit(res.statusCode >= 400 ? 1 : 0);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ 请求失败: ${e.message}`);
  process.exit(1);
});

req.write(payload);
req.end();
