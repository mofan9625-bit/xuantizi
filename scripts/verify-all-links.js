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
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = scanHtmlFiles(ROOT_DIR);
let deadLinks = [];
let relativeLinks = [];
let assetIssues = [];
let protocolIssues = [];
let totalLinksChecked = 0;

htmlFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileDir = path.dirname(filePath);
  const relFilePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');

  // 1. Asset check in head
  const headEnd = content.indexOf('</head>');
  const headContent = headEnd !== -1 ? content.slice(0, headEnd) : content;

  if (!headContent.includes('<link rel="stylesheet" href="/assets/css/style.css">')) {
    assetIssues.push({ sourceFile: relFilePath, issue: 'Missing or non-root CSS link in head' });
  }
  if (!headContent.includes('<script src="/assets/js/main.js" defer></script>')) {
    assetIssues.push({ sourceFile: relFilePath, issue: 'Missing or non-root main.js in head' });
  }

  // 2. Match href in <a>
  const hrefRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/gi;
  let match;

  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1].trim();

    // Protocol check
    if (href.includes('xuantizhinan.vip') && !href.startsWith('https://') && !href.startsWith('http://') && !href.startsWith('//')) {
      protocolIssues.push({ sourceFile: relFilePath, href: href, issue: 'Missing https:// protocol head' });
    }

    // Skip external links, tel, mailto, javascript, empty
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || 
        href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || !href) {
      continue;
    }

    totalLinksChecked++;

    // Check if internal link uses relative path instead of root-relative
    if (!href.startsWith('/') && !href.startsWith('#')) {
      relativeLinks.push({ sourceFile: relFilePath, href: href });
    }

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
console.log(`🔍 全站内部链接与静态资源完整性深度扫描结果：`);
console.log(`======================================================`);
console.log(`共扫描 HTML 页面文件: ${htmlFiles.length} 个`);
console.log(`共校验内链跳转: ${totalLinksChecked} 个\n`);

let passed = true;

if (deadLinks.length === 0) {
  console.log(`✅ 死链检测: 0 个死链，所有内链目标均真实存在！`);
} else {
  passed = false;
  console.error(`❌ 发现 ${deadLinks.length} 个潜在死链：`);
  deadLinks.forEach((d) => console.error(`  - 源文件: ${d.sourceFile} -> 链接: ${d.href}`));
}

if (relativeLinks.length === 0) {
  console.log(`✅ 路径规范: 100% 站内链接已采用标准绝对根路径 (/...)！杜绝域名拼接！`);
} else {
  passed = false;
  console.error(`❌ 发现 ${relativeLinks.length} 个相对路径链接（需改为绝对根路径）：`);
  relativeLinks.forEach((r) => console.error(`  - 源文件: ${r.sourceFile} -> 链接: ${r.href}`));
}

if (assetIssues.length === 0) {
  console.log(`✅ 静态资源: 100% 页面的 CSS 与 JS 均在 <head> 中正确使用绝对根路径！杜绝样式丢失！`);
} else {
  passed = false;
  console.error(`❌ 静态资源引用异常：`);
  assetIssues.forEach((a) => console.error(`  - 源文件: ${a.sourceFile} -> ${a.issue}`));
}

if (protocolIssues.length === 0) {
  console.log(`✅ 协议头检测: 所有外部与域名引用均具备完整 https:// 协议头！`);
} else {
  passed = false;
  console.error(`❌ 发现 ${protocolIssues.length} 个缺失协议头的链接：`);
  protocolIssues.forEach((p) => console.error(`  - 源文件: ${p.sourceFile} -> ${p.href}`));
}

console.log(`======================================================`);
if (passed) {
  console.log(`🎉 完美通过所有 Cloudflare Pages 部署前合规性校验！\n`);
} else {
  console.error(`⚠️ 请修复上述问题后再部署。\n`);
  process.exit(1);
}
