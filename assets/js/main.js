/**
 * 选梯指南 (xuantizhinan.vip) - 高转化交互与 SEO 闭环核心脚本
 * - 极轻量原生 JavaScript，零第三方库依赖
 * - 优惠码一键点击复制与浮动 Toast 状态反馈
 * - 移动端抽屉导航交互
 * - FAQ 手风琴收折交互
 * - 外部商业推广链接 rel="noopener noreferrer nofollow sponsored" 合规校验
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const isExpanded = navLinks.classList.contains('mobile-open');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });
  }

  // 2. Toast Notification Helper
  let toastElement = document.getElementById('global-toast');
  if (!toastElement) {
    toastElement = document.createElement('div');
    toastElement.id = 'global-toast';
    toastElement.className = 'toast';
    toastElement.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span id="toast-message">已复制优惠码，前往官网结账可直接粘贴使用</span>
    `;
    document.body.appendChild(toastElement);
  }

  let toastTimer = null;
  function showToast(message) {
    const msgSpan = document.getElementById('toast-message');
    if (msgSpan && message) {
      msgSpan.textContent = message;
    }
    toastElement.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastElement.classList.remove('show');
    }, 2000);
  }

  // 复制文本至剪贴板通用函数
  async function copyToClipboard(text, successMsg) {
    const cleanText = text.trim();
    if (!cleanText) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cleanText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = cleanText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showToast(successMsg || `✅ 优惠码 [${cleanText}] 已复制，前往官网结账可直接粘贴！`);
    } catch (err) {
      showToast(`已选定优惠码 [${cleanText}]，请长按手动复制`);
    }
  }

  // 3. 优惠码一键点击复制微交互
  // A. 具有 data-copy-code 属性的专用按钮
  document.querySelectorAll('[data-copy-code]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const code = btn.getAttribute('data-copy-code');
      if (!code) return;

      const originalText = btn.textContent;
      await copyToClipboard(code, `✅ 优惠码 [${code}] 已复制，前往官网结账可直接粘贴！`);
      btn.classList.add('copied');
      btn.textContent = '已复制!';

      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = originalText;
      }, 2000);
    });
  });

  // B. 为页面中所有包含优惠码的 <code> 元素增加点击事件与悬停手型
  const KNOWN_COUPONS = ['yjx888', 'dly88', 'hq66', 'sxjs0077', 'll88', 'sds88'];

  document.querySelectorAll('code').forEach((codeEl) => {
    const rawText = codeEl.textContent.trim();
    const matchedCoupon = KNOWN_COUPONS.find(c => rawText.toLowerCase().includes(c.toLowerCase()));
    
    // 判定条件：匹配核心优惠码，或处于评测表格优惠列/FAQ/卡片/优惠券行中且文本精简
    const isInTable = codeEl.closest('.benchmark-table') !== null;
    const isInFaq = codeEl.closest('.faq-item') !== null;
    const isInCard = codeEl.closest('.brand-card') !== null || codeEl.closest('.coupon-card') !== null;

    if (matchedCoupon || ((isInTable || isInFaq || isInCard) && rawText.length <= 15 && !rawText.includes('{') && !rawText.includes('/'))) {
      const codeToCopy = matchedCoupon || rawText;
      codeEl.classList.add('copyable-coupon-code');
      codeEl.style.cursor = 'pointer';
      codeEl.setAttribute('title', '点击复制优惠码');
      codeEl.setAttribute('role', 'button');
      codeEl.setAttribute('tabindex', '0');

      codeEl.addEventListener('click', (e) => {
        e.stopPropagation();
        copyToClipboard(codeToCopy, `✅ 优惠码 [${codeToCopy}] 已复制，前往官网结账可直接粘贴！`);
        codeEl.classList.add('code-copied-pulse');
        setTimeout(() => {
          codeEl.classList.remove('code-copied-pulse');
        }, 1200);
      });

      // 支持键盘无障碍操作 (Enter / Space)
      codeEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          codeEl.click();
        }
      });
    }
  });

  // 4. FAQ Accordion Interaction
  document.querySelectorAll('.faq-question').forEach((questionBtn) => {
    questionBtn.addEventListener('click', () => {
      const item = questionBtn.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach((other) => {
        if (other !== item) other.classList.remove('active');
      });

      if (isOpen) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });

  // 5. External Link Security & Affiliate Sponsored Compliance (Google / Bing)
  document.querySelectorAll('a[target="_blank"]').forEach((extLink) => {
    const rel = extLink.getAttribute('rel') || '';
    if (!rel.includes('sponsored') || !rel.includes('nofollow')) {
      extLink.setAttribute('rel', 'noopener noreferrer nofollow sponsored');
    }
  });
});
