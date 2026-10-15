#!/usr/bin/env bash
# ==============================================================================
# 选梯指南 (xuantizhinan.vip) - IndexNow 自动化 URL 提交脚本
# 每次部署或更新文章后执行此脚本，一键通知 Bing、Yandex 极速抓取
# ==============================================================================

set -e

HOST="xuantizhinan.vip"
KEY="xuantizhinan2026key"
KEY_LOCATION="https://xuantizhinan.vip/xuantizhinan-key.txt"

echo "--------------------------------------------------------"
echo "🚀 正在向 IndexNow 推送 ${HOST} 全站 URL 列表..."
echo "--------------------------------------------------------"

JSON_PAYLOAD=$(cat <<EOF
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "${KEY_LOCATION}",
  "urlList": [
    "https://xuantizhinan.vip/",
    "https://xuantizhinan.vip/airports/top-brands.html",
    "https://xuantizhinan.vip/airports/iepl-lines.html",
    "https://xuantizhinan.vip/airports/budget-ondemand.html",
    "https://xuantizhinan.vip/coupons/",
    "https://xuantizhinan.vip/posts/",
    "https://xuantizhinan.vip/posts/global-iplc-benchmark-2026.html",
    "https://xuantizhinan.vip/posts/iplc-iepl-bgp-difference-guide.html",
    "https://xuantizhinan.vip/posts/monthly-vs-annual-subscription-guide.html",
    "https://xuantizhinan.vip/posts/clash-singbox-hysteria2-config-guide.html",
    "https://xuantizhinan.vip/posts/reviews/yunjiexian.html",
    "https://xuantizhinan.vip/posts/reviews/dalaoyun.html",
    "https://xuantizhinan.vip/posts/reviews/huanqiuti.html",
    "https://xuantizhinan.vip/posts/reviews/shenxing.html",
    "https://xuantizhinan.vip/posts/reviews/liulianyun.html",
    "https://xuantizhinan.vip/posts/reviews/shandianshu.html",
    "https://xuantizhinan.vip/about/disclaimer.html",
    "https://xuantizhinan.vip/about/methodology.html",
    "https://xuantizhinan.vip/about/benchmarks.html"
  ]
}
EOF
)

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "${JSON_PAYLOAD}")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")

echo "HTTP 状态码: ${HTTP_STATUS}"

if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 202 ]; then
  echo "✅ 提交成功！已通知 Bing / Yandex 搜索引擎调度索引机器人进行收录。"
else
  echo "⚠️ 响应输出: ${BODY}"
fi
