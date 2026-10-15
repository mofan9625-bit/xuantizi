const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

function scanHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file.startsWith('.') || file === 'review-template.html' || file === '2026-global-lines-benchmark.html') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = scanHtmlFiles(ROOT_DIR);
let deadLinks = [];
let totalLinksChecked = 0;

htmlFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileDir = path.dirname(filePath);
  const relFilePath = path.relative(ROOT_DIR, filePath);

  // Match href in <a>
  const hrefRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/gi;
  let match;

  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1].trim();

    // Skip external links, tel, mailto, javascript, empty
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || 
        href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || !href) {
      continue;
    }

    totalLinksChecked++;

    // Split anchor #
    const [pathPart, anchorPart] = href.split('#');

    if (!pathPart) {
      // Just an anchor like href="#faq", valid
      continue;
    }

    // Resolve target path
    let targetPath;
    if (pathPart.startsWith('/')) {
      targetPath = path.join(ROOT_DIR, pathPart);
    } else {
      targetPath = path.resolve(fileDir, pathPart);
    }

    // Check if target file exists
    let exists = fs.existsSync(targetPath);
    if (!exists && !pathPart.endsWith('.html')) {
      // Maybe it refers to directory index.html
      if (fs.existsSync(path.join(targetPath, 'index.html'))) {
        exists = true;
      } else if (fs.existsSync(targetPath + '.html')) {
        exists = true;
      }
    }

    if (!exists) {
      deadLinks.push({
        sourceFile: relFilePath,
        href: href,
        resolvedPath: targetPath
      });
    }
  }
});

console.log(`\n======================================================`);
console.log(`🔍 全站内部链接完整性深度扫描结果：`);
console.log(`======================================================`);
console.log(`共扫描 HTML 生产文件: ${htmlFiles.length} 个`);
console.log(`共校验内链跳转: ${totalLinksChecked} 个\n`);

if (deadLinks.length === 0) {
  console.log(`🎉 恭喜！未检测到任何死链，全站 100% 内部链接均真实有效！`);
} else {
  console.error(`⚠️ 发现 ${deadLinks.length} 个潜在死链：`);
  deadLinks.forEach((d) => {
    console.error(`  - 源文件: ${d.sourceFile} -> 链接: ${d.href} (无法定位: ${d.resolvedPath})`);
  });
}
