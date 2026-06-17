// 📁 路徑：src/sanity/env.ts

export const apiVersion = '2026-06-17' // 記錄今天通電的日期作為 API 版本

// 📡 自動從保險箱提取數據，如果找不到就用 'production' 墊底
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// 📡 自動提取你的項目 ID
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

// 🛡️ 安全檢查：如果架構師忘記填 ID，運行時立刻在控制台拉響警報
if (!projectId) {
  console.warn('⚠️ 提示：Next.js 暫時沒有讀取到 NEXT_PUBLIC_SANITY_PROJECT_ID，請確保 .env.local 配置正確。')
}