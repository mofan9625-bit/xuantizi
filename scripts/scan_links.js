const fs = require('fs');
const path = require('path');

function getAllFiles(dir, exts) {
  let res = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (item === '.git' || item === 'node_modules') continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      res = res.concat(getAllFiles(fullPath, exts));
    } else {
      if (exts.some(ext => item.endsWith(ext))) {
        res.push(fullPath);
      }
    }
  }
  return res;
}

const files = getAllFiles(path.resolve('.'), ['.html', '.md', '.json', '.js']);
console.log('Total files checked:', files.length);

const urlRegex = /(https?:\/\/[^\s"'<>)]+)/gi;
const allUrls = new Map();

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    let url = match[1];
    // clean trailing punct
    url = url.replace(/[.,;]+$/, '');
    if (!allUrls.has(url)) allUrls.set(url, new Set());
    allUrls.get(url).add(path.relative(path.resolve('.'), file));
  }
}

console.log('--- ALL UNIQUE EXTERNAL URLS ---');
for (const [url, fileSet] of allUrls.entries()) {
  console.log(`[Count: ${fileSet.size}] ${url}`);
}

