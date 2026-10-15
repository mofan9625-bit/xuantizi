const fs = require('fs');

const files = [
  'index.html',
  'airports/top-brands.html',
  'airports/iepl-lines.html',
  'airports/budget-ondemand.html',
  'coupons/index.html',
  'posts/index.html',
  'posts/global-iplc-benchmark-2026.html',
  'posts/iplc-iepl-bgp-difference-guide.html',
  'posts/monthly-vs-annual-subscription-guide.html',
  'posts/clash-singbox-hysteria2-config-guide.html',
  'posts/reviews/yunjiexian.html',
  'posts/reviews/dalaoyun.html',
  'posts/reviews/huanqiuti.html',
  'posts/reviews/shenxing.html',
  'posts/reviews/liulianyun.html',
  'posts/reviews/shandianshu.html',
  'about/disclaimer.html',
  'about/methodology.html',
  'about/benchmarks.html'
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
