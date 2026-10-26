/**
 * Build & Deployment Pipeline Script for xuantizhinan.vip
 * 
 * Steps:
 * 1. Synchronize public static assets (such as [key].txt) to root deployment directory.
 * 2. Generate and update sitemap.xml.
 * 3. Automatically push sitemap URLs to IndexNow API (Bing, Yandex, etc.).
 * 
 * Usage:
 *   node scripts/build.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('====================================================');
console.log('🏗️  开始执行项目构建与部署流程...');
console.log('====================================================\n');

// Step 1: Copy/Sync public/ files to root output directory
console.log('📦 [1/3] 同步 public/ 静态资源至产物根目录...');
if (fs.existsSync(PUBLIC_DIR)) {
  const publicFiles = fs.readdirSync(PUBLIC_DIR);
  publicFiles.forEach(file => {
    const src = path.join(PUBLIC_DIR, file);
    const dest = path.join(ROOT_DIR, file);
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log(`   ✓ 同步: public/${file} -> ${file}`);
  });
} else {
  console.log('   ℹ️ 未找到 public 目录，跳过文件复制');
}

// Step 2: Generate sitemap.xml
console.log('\n🗺️  [2/3] 重新生成 sitemap.xml...');
try {
  execSync('node scripts/generate-sitemap.js', { cwd: ROOT_DIR, stdio: 'inherit' });
} catch (err) {
  console.error('❌ 生成 sitemap.xml 失败:', err.message);
  process.exit(1);
}

// Step 3: Push URLs to IndexNow
console.log('\n🚀 [3/3] 自动推送全站 URL 至 IndexNow API...');
try {
  execSync('node scripts/push-indexnow.js', { cwd: ROOT_DIR, stdio: 'inherit' });
} catch (err) {
  console.error('⚠️ IndexNow 推送未能正常完成 (如网络或接口临时限制)，请查看上方日志');
}

console.log('\n====================================================');
console.log('🎉 项目构建与 IndexNow 自动推送全部完成！');
console.log('====================================================');
