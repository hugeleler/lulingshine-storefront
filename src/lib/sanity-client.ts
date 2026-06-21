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