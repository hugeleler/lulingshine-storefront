// 📁 路徑：src/lib/sanity-client.ts
import { createClient } from "@sanity/client"

// 🔒 完美對接 Sanity v3 文化敘事大腦
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "您的Sanity項目ID", 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-06-20", // 鎖定當前時間版本，免疫API變更悲劇
  useCdn: process.env.NODE_ENV === "production", // 生產環境開啟高速快取，開發環境實時拉取
})

/**
 * 🌍 核心邏輯：將 Medusa 的 countryCode 映射到 Sanity 的多語言欄位鍵名
 * 確保前台切換國家/貨幣時，文案與語言完美對齊
 */
export function getSanityLocale(countryCode: string): string {
  const code = countryCode.toLowerCase()
  switch (code) {
    case "hk":
    case "tw":
      return "zh_TW" // 繁體中文
    case "cn":
      return "zh_CN" // 簡體中文
    case "jp":
      return "ja"    // 日本語
    case "kr":
      return "ko"    // 한국어
    default:
      return "en"    // 全球其餘地區預設走 English
  }
}

/**
 * 🍵 核心 GROQ 查詢：獲取首頁 5 大欄目的國際化策展內容
 * 根據當前語言自動過濾主副標題、大圖與致意詞
 */
export async function getHomePageData(locale: string) {
  const query = `*[_type == "home"][0]{
    "heroTitle": heroTitle.${locale},
    "heroSubtitle": heroSubtitle.${locale},
    "heroImageUrl": heroImage.asset->url,
    "greeting": greetingContent.${locale}
  }`
  
  try {
    return await sanityClient.fetch(query)
  } catch (error) {
    console.error("❌ 讀取 Sanity 首頁策展數據失敗:", error)
    return null
  }
}

/**
 * 👨‍🎨 核心 GROQ 查詢：根據 Medusa 的大師 Handle（如 art-ohyoung）
 * 一記並行把大師在 Sanity 裡的 5 國語言生平、藝術家簡介及勾選的 layoutStyle 撈齊！
 */
export async function getArtistStoryByHandle(artistHandle: string) {
  const query = `*[_type == "worksByArtist" && artistHandle == $handle][0]{
    artistHandle,
    layoutStyle,
    "biography": {
      "zh-TW": biography.zh_TW,
      "zh-CN": biography.zh_CN,
      "en": biography.en,
      "ja": biography.ja,
      "ko": biography.ko
    },
    "interviewTitle": {
      "zh-TW": interviewTitle.zh_TW,
      "zh-CN": interviewTitle.zh_CN,
      "en": interviewTitle.en,
      "ja": interviewTitle.ja,
      "ko": interviewTitle.ko
    }
  }`

  try {
    return await sanityClient.fetch(query, { handle: artistHandle })
  } catch (error) {
    console.error(`❌ 讀取 Sanity 大師敘事失敗 [Handle: ${artistHandle}]:`, error)
    return null
  }
}