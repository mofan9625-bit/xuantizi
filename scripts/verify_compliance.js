const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const AFF_URLS = [
  'https://9625mofan01.yunjiexianaff.com/#/?code=OOYhSj0L',
  'https://mofanvip01.dalaoyunaff.com/#/?code=QT2rqp5V',
  'https://mofanvip01.huanqiutiaff.com/#/?code=l7oLmjVU',
  'https://vipmofan01.shenxingaff.com/#/?code=nn4ohwnK',
  'https://mofan88.liulianyunaff.com/#/?code=ETsQBSuR',
  'https://mofanvip01.shandianshuaff.com/#/?code=a3GAQAXg'
];

function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (['.git', 'node_modules', 'scripts'].includes(item)) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else {
      const ext = path.extname(item).toLowerCase();
      if (['.html', '.md'].includes(ext) && !fullPath.includes('go.html') && !fullPath.includes(path.join('go', 'index.html'))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const files = getAllFiles(ROOT_DIR);
let remainingDirectAffCount = 0;
let totalGoLinks = 0;
let invalidRelCount = 0;

console.log('--- 1. 扫描是否仍有正文遗留直连 AFF ---');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const url of AFF_URLS) {
    if (content.includes(url)) {
      console.error(`❌ 发现未替换直连 AFF: ${path.relative(ROOT_DIR, file)} -> ${url}`);
      remainingDirectAffCount++;
    }
  }
}

console.log('--- 2. 扫描新内链 /go/ 与 rel 属性合规性 ---');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const aTagRegex = /<a\b[^>]*>/gi;
  let match;
  while ((match = aTagRegex.exec(content)) !== null) {
    const tag = match[0];
    if (tag.includes('href="/go/') || tag.includes('href="/go.html')) {
      totalGoLinks++;
      if (!tag.includes('rel="nofollow sponsored noopener noreferrer"')) {
        console.error(`⚠️ rel 属性不标准: ${path.relative(ROOT_DIR, file)}: ${tag}`);
        invalidRelCount++;
      }
    }
  }
}

console.log(`\n================ 验证总结报告 ================`);
console.log(`未替换遗留直连 AFF 数量: ${remainingDirectAffCount} (期望: 0)`);
console.log(`合规内链 /go/xxx 数量: ${totalGoLinks} (期望: 47)`);
console.log(`非标准 rel 数量: ${invalidRelCount} (期望: 0)`);

if (remainingDirectAffCount === 0 && totalGoLinks === 47 && invalidRelCount === 0) {
  console.log('✅ 所有链接 100% 完美合规！');
} else {
  console.error('❌ 存在异常项，请检查上述日志！');
  process.exit(1);
}
