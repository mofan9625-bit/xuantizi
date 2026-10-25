/**
 * Safe Batch Affiliate Links Replacement Script
 * 
 * Complies with:
 * - Google Search Central / FTC Sponsored Guidelines
 * - 301 In-site Redirect (/go.html?id=xxx)
 * - Mandatory rel="nofollow sponsored noopener noreferrer"
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 品牌与目标链接映射表
const AFF_MAPPING = [
  {
    id: 'yunjiexian',
    name: '云界线',
    url: 'https://9625mofan01.yunjiexianaff.com/#/?code=OOYhSj0L'
  },
  {
    id: 'dalaoyun',
    name: '大佬云',
    url: 'https://mofanvip01.dalaoyunaff.com/#/?code=QT2rqp5V'
  },
  {
    id: 'huanqiuti',
    name: '环球梯',
    url: 'https://mofanvip01.huanqiutiaff.com/#/?code=l7oLmjVU'
  },
  {
    id: 'shenxing',
    name: '神行加速',
    url: 'https://vipmofan01.shenxingaff.com/#/?code=nn4ohwnK'
  },
  {
    id: 'liulianyun',
    name: '榴莲云',
    url: 'https://mofan88.liulianyunaff.com/#/?code=ETsQBSuR'
  },
  {
    id: 'shandianshu',
    name: '闪电鼠',
    url: 'https://mofanvip01.shandianshuaff.com/#/?code=a3GAQAXg'
  }
];

function getAllTargetFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (['.git', 'node_modules', 'scripts'].includes(item)) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllTargetFiles(fullPath));
    } else {
      const ext = path.extname(item).toLowerCase();
      // Exclude go.html and config files from self-replacement
      if (['.html', '.md'].includes(ext) && item !== 'go.html') {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function processTag(tagHtml, targetId) {
  let newTag = tagHtml;

  // 1. 替换 href 属性
  newTag = newTag.replace(/href=["'][^"']+["']/i, `href="/go.html?id=${targetId}"`);

  // 2. 确保 target="_blank"
  if (/target=["'][^"']+["']/i.test(newTag)) {
    newTag = newTag.replace(/target=["'][^"']+["']/i, 'target="_blank"');
  } else {
    newTag = newTag.replace(/^<a\s+/i, '<a target="_blank" ');
  }

  // 3. 强制严格规范的 rel 属性
  const REQUIRED_REL = 'rel="nofollow sponsored noopener noreferrer"';
  if (/rel=["'][^"']+["']/i.test(newTag)) {
    newTag = newTag.replace(/rel=["'][^"']+["']/i, REQUIRED_REL);
  } else {
    newTag = newTag.replace(/^<a\s+/i, `<a ${REQUIRED_REL} `);
  }

  return newTag;
}

function runBatchReplacement() {
  const files = getAllTargetFiles(ROOT_DIR);
  let totalReplacedLinks = 0;
  const fileReports = [];

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let fileReplacedCount = 0;
    const relPath = path.relative(ROOT_DIR, file);

    for (const aff of AFF_MAPPING) {
      if (content.includes(aff.url)) {
        // 全匹配替换所有包含此 URL 的 <a> 标签
        // 查找所有 <a ... href="..." ...>
        const aTagRegex = /<a\b[^>]*>/gi;
        content = content.replace(aTagRegex, (match) => {
          if (match.includes(aff.url)) {
            fileReplacedCount++;
            return processTag(match, aff.id);
          }
          return match;
        });

        // 兼容检查 Markdown 链接语法 [text](url)
        const mdLinkRegex = new RegExp(`\\[([^\\]]+)\\]\\(${aff.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
        content = content.replace(mdLinkRegex, (match, text) => {
          fileReplacedCount++;
          return `[${text}](/go.html?id=${aff.id})`;
        });
      }
    }

    if (fileReplacedCount > 0) {
      fs.writeFileSync(file, content, 'utf8');
      totalReplacedLinks += fileReplacedCount;
      fileReports.push({
        file: relPath,
        count: fileReplacedCount
      });
    }
  }

  return { totalReplacedLinks, fileReports };
}

console.log('====================================================');
console.log('🔄 开始全站 AFF 推广链接 301 隔离与合规改造批量替换...');
console.log('====================================================');

const result = runBatchReplacement();

console.log('\n---------------- 替换明细清单 ----------------');
for (const report of result.fileReports) {
  console.log(`✓ [${report.count} 处] ${report.file}`);
}
console.log('----------------------------------------------');
console.log(`\n🎉 批量替换完成！共在 ${result.fileReports.length} 个文件中替换了 ${result.totalReplacedLinks} 处推广直连！`);
