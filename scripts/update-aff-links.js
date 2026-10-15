const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

const URL_MAP = {
  // 云界线
  'https://yunjiexian.com/aff?code=xuantizhinan': 'https://9625mofan01.yunjiexianaff.com/#/?code=OOYhSj0L',
  'https://9625mofan01.yunjiexianaff.com/#/?code=OOYhSj0L': 'https://9625mofan01.yunjiexianaff.com/#/?code=OOYhSj0L',

  // 大佬云
  'https://dalaoyun.com/aff?code=xuantizhinan': 'https://mofanvip01.dalaoyunaff.com/#/?code=QT2rqp5V',
  'https://mofanvip01.dalaoyunaff.com/#/?code=QT2rqp5V': 'https://mofanvip01.dalaoyunaff.com/#/?code=QT2rqp5V',

  // 环球梯
  'https://huanqiuti.com/aff?code=xuantizhinan': 'https://mofanvip01.huanqiutiaff.com/#/?code=l7oLmjVU',
  'https://mofanvip01.huanqiutiaff.com/#/?code=l7oLmjVU': 'https://mofanvip01.huanqiutiaff.com/#/?code=l7oLmjVU',

  // 神行加速
  'https://shenxingjiasu.com/aff?code=xuantizhinan': 'https://vipmofan01.shenxingaff.com/#/?code=nn4ohwnK',
  'https://vipmofan01.shenxingaff.com/#/?code=nn4ohwnK': 'https://vipmofan01.shenxingaff.com/#/?code=nn4ohwnK',

  // 榴莲云
  'https://liulianyun.com/aff?code=xuantizhinan': 'https://mofan88.liulianyunaff.com/#/?code=ETsQBSuR',
  'https://mofan88.liulianyunaff.com/#/?code=ETsQBSuR': 'https://mofan88.liulianyunaff.com/#/?code=ETsQBSuR',

  // 闪电鼠
  'https://shandianshu.com/aff?code=xuantizhinan': 'https://mofanvip01.shandianshuaff.com/#/?code=a3GAQAXg',
  'https://mofanvip01.shandianshuaff.com/#/?code=a3GAQAXg': 'https://mofanvip01.shandianshuaff.com/#/?code=a3GAQAXg',

  // 模板中的测试链接
  'https://example.com/aff?code=xuantizhinan': 'https://9625mofan01.yunjiexianaff.com/#/?code=OOYhSj0L'
};

function scanAndReplace(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === 'node_modules' || item.startsWith('.')) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanAndReplace(fullPath);
    } else if (item.endsWith('.html') || item.endsWith('.json') || item.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      for (const [oldUrl, newUrl] of Object.entries(URL_MAP)) {
        if (content.includes(oldUrl)) {
          content = content.split(oldUrl).join(newUrl);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ 成功更新推广链接: ${path.relative(ROOT_DIR, fullPath)}`);
      }
    }
  }
}

scanAndReplace(ROOT_DIR);
console.log('🎉 所有推广链接全局替换完毕！');
