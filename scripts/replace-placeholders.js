/**
 * Batch Placeholder Replacement Script
 * 
 * Safely replaces standard placeholders across all project files:
 * - SITE_NAME
 * - SITE_DOMAIN
 * - BRAND_NAME_1 ~ BRAND_NAME_6
 * - AFF_LINK_1 ~ AFF_LINK_6
 * - COUPON_CODE_1 ~ COUPON_CODE_6
 * - INDEXNOW_KEY
 * 
 * Usage:
 *   1. Create `scripts/config.json` (copy from `scripts/config.example.json` and fill in your details)
 *   2. Run: node scripts/replace-placeholders.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const CONFIG_PATH = path.join(__dirname, 'config.json');
const EXAMPLE_PATH = path.join(__dirname, 'config.example.json');

if (!fs.existsSync(CONFIG_PATH)) {
  console.log('⚠️ 未检测到 scripts/config.json，正在根据 config.example.json 创建...');
  fs.copyFileSync(EXAMPLE_PATH, CONFIG_PATH);
  console.log('✅ 已生成 scripts/config.json。请用编辑器打开它填入您的真实域名、品牌与推广链接，然后重新运行本脚本！\n');
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Target extensions to replace within
const VALID_EXTENSIONS = ['.html', '.xml', '.txt', '.js', '.css', '.json', '.md'];

function scanAndReplace(dir) {
  const items = fs.readdirSync(dir);
  let totalReplacedFiles = 0;

  for (const item of items) {
    if (item === 'node_modules' || item === '.git' || item === 'config.example.json' || item === 'config.json') {
      continue;
    }

    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      totalReplacedFiles += scanAndReplace(fullPath);
    } else {
      const ext = path.extname(item).toLowerCase();
      if (VALID_EXTENSIONS.includes(ext)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;

        for (const [placeholder, actualValue] of Object.entries(config)) {
          if (content.includes(placeholder)) {
            // Global replace
            const regex = new RegExp(placeholder, 'g');
            content = content.replace(regex, actualValue);
            modified = true;
          }
        }

        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`✨ 成功替换: ${path.relative(ROOT_DIR, fullPath)}`);
          totalReplacedFiles++;
        }
      }
    }
  }

  return totalReplacedFiles;
}

console.log('====================================================');
console.log('🔄 开始全站占位符批量安全替换...');
console.log('====================================================');

const count = scanAndReplace(ROOT_DIR);

// Handle [INDEXNOW_KEY].txt renaming if key is configured
if (config.INDEXNOW_KEY && config.INDEXNOW_KEY !== 'INDEXNOW_KEY') {
  const oldKeyFile = path.join(ROOT_DIR, '[INDEXNOW_KEY].txt');
  const newKeyFile = path.join(ROOT_DIR, `${config.INDEXNOW_KEY}.txt`);
  if (fs.existsSync(oldKeyFile)) {
    fs.renameSync(oldKeyFile, newKeyFile);
    fs.writeFileSync(newKeyFile, config.INDEXNOW_KEY, 'utf8');
    console.log(`🔑 已自动重命名密钥文件为: ${config.INDEXNOW_KEY}.txt 并写入密钥`);
  }
}

console.log(`\n🎉 批量替换完成！共修改了 ${count} 个文件。`);
