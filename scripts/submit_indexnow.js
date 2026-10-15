/**
 * 选梯指南 (xuantizhinan.vip) - IndexNow 自动化 URL 提交脚本
 * 
 * 功能：向 IndexNow API (Bing / Yandex 等搜索引擎联合抓取端点) 一键推送全站已发布 URL
 * 使用方法：node scripts/submit_indexnow.js
 */

const https = require('https');

const HOST = 'xuantizhinan.vip';
const KEY = 'xuantizhinan2026key';
const KEY_LOCATION = 'https://xuantizhinan.vip/xuantizhinan-key.txt';

// 全站核心已发布 URL 矩阵
const URL_LIST = [
  // 1. 首页
  'https://xuantizhinan.vip/',

  // 2. 核心榜单与聚合索引页
  'https://xuantizhinan.vip/airports/top-brands.html',
  'https://xuantizhinan.vip/airports/iepl-lines.html',
  'https://xuantizhinan.vip/airports/budget-ondemand.html',
  'https://xuantizhinan.vip/coupons/',
  'https://xuantizhinan.vip/posts/',

  // 3. 4 篇技术长文与科普指南
  'https://xuantizhinan.vip/posts/global-iplc-benchmark-2026.html',
  'https://xuantizhinan.vip/posts/iplc-iepl-bgp-difference-guide.html',
  'https://xuantizhinan.vip/posts/monthly-vs-annual-subscription-guide.html',
  'https://xuantizhinan.vip/posts/clash-singbox-hysteria2-config-guide.html',

  // 4. 6 篇品牌独立深度审计评测
  'https://xuantizhinan.vip/posts/reviews/yunjiexian.html',
  'https://xuantizhinan.vip/posts/reviews/dalaoyun.html',
  'https://xuantizhinan.vip/posts/reviews/huanqiuti.html',
  'https://xuantizhinan.vip/posts/reviews/shenxing.html',
  'https://xuantizhinan.vip/posts/reviews/liulianyun.html',
  'https://xuantizhinan.vip/posts/reviews/shandianshu.html',

  // 5. 3 篇 E-E-A-T 信任基石合规说明页
  'https://xuantizhinan.vip/about/disclaimer.html',
  'https://xuantizhinan.vip/about/methodology.html',
  'https://xuantizhinan.vip/about/benchmarks.html'
];

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URL_LIST
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log(`\n======================================================`);
console.log(`🚀 开始向 IndexNow 推送 [${HOST}] 全站 URL 列表 (共 ${URL_LIST.length} 条)...`);
console.log(`======================================================\n`);

URL_LIST.forEach((url, idx) => {
  console.log(`  [${String(idx + 1).padStart(2, '0')}] ${url}`);
});

console.log(`\n正在请求 https://api.indexnow.org/indexnow ...`);

const req = https.request(options, (res) => {
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log(`\nHTTP 响应状态码: ${res.statusCode} ${res.statusMessage}`);
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('✅ 成功提交！IndexNow 已接收 URL 矩阵并同步通知 Bing / Yandex 搜索引擎。');
      console.log('   (状态码 200/202 表示推送成功并已入列等待抓取)');
    } else if (res.statusCode === 400) {
      console.error('❌ 请求格式错误 (Invalid format)');
    } else if (res.statusCode === 403) {
      console.error('❌ 密钥验证失败 (Key not valid or key not found)');
    } else if (res.statusCode === 422) {
      console.error('❌ URL 所属域名与 host 不匹配 (URLs don\'t belong to host)');
    } else {
      console.log(`ℹ️ 响应内容: ${responseBody || '无额外输出'}`);
    }
  });
});

req.on('error', (err) => {
  console.error(`❌ 请求失败: ${err.message}`);
});

req.write(payload);
req.end();
