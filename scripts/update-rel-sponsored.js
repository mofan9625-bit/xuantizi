const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

function scanHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file.startsWith('.')) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanHtmlFiles(fullPath));
    } else if (file.endsWith('.html') || file.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = scanHtmlFiles(ROOT_DIR);
let totalUpdated = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('rel="noopener noreferrer nofollow"') || content.includes('rel=\\"noopener noreferrer nofollow\\"')) {
    const updated = content
      .replace(/rel="noopener noreferrer nofollow sponsored"/g, 'rel="noopener noreferrer nofollow sponsored"') // prevent double
      .replace(/rel="noopener noreferrer nofollow"/g, 'rel="noopener noreferrer nofollow sponsored"')
      .replace(/rel=\\"noopener noreferrer nofollow\\"/g, 'rel=\\"noopener noreferrer nofollow sponsored\\"');
    
    if (updated !== content) {
      fs.writeFileSync(file, updated, 'utf8');
      console.log(`Updated: ${path.relative(ROOT_DIR, file)}`);
      totalUpdated++;
    }
  }
});

console.log(`\n✅ 全站完成更新！共处理 ${totalUpdated} 个文件，全部外部推广链接已注入 'sponsored' 属性。`);
