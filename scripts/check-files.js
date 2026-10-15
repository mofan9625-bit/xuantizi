const fs = require('fs');

const files = [
  'index.html',
  'airports/top-brands/index.html',
  'airports/iepl-lines/index.html',
  'airports/budget-ondemand/index.html',
  'coupons/index.html',
  'posts/index.html',
  'posts/global-iplc-benchmark-2026/index.html',
  'posts/iplc-iepl-bgp-difference-guide/index.html',
  'posts/monthly-vs-annual-subscription-guide/index.html',
  'posts/clash-singbox-hysteria2-config-guide/index.html',
  'posts/reviews/yunjiexian/index.html',
  'posts/reviews/dalaoyun/index.html',
  'posts/reviews/huanqiuti/index.html',
  'posts/reviews/shenxing/index.html',
  'posts/reviews/liulianyun/index.html',
  'posts/reviews/shandianshu/index.html',
  'about/disclaimer/index.html',
  'about/methodology/index.html',
  'about/benchmarks/index.html'
];

console.log('=== Checking 19 Core Files ===');
let allOk = true;
files.forEach((f, idx) => {
  if (!fs.existsSync(f)) {
    console.error('MISSING:', f);
    allOk = false;
  } else {
    const stat = fs.statSync(f);
    if (stat.size < 500) {
      console.warn('TOO SMALL (<500B):', f, stat.size);
      allOk = false;
    } else {
      console.log(`[${String(idx + 1).padStart(2, '0')}] OK: ${f} (${stat.size} bytes)`);
    }
  }
});
if (allOk) console.log('\nAll 19 core files EXIST and have healthy file sizes!');
