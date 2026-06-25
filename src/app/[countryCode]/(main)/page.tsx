// 📁 完整路徑：src/app/[countryCode]/(main)/page.tsx
import { Metadata } from "next"
import { cookies } from "next/headers" // 👈 核心神符：引入 Cookie 嗅探大腦
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getHomePageData, getSanityLocale } from "@lib/sanity-client"

// 強制 Next.js 每次都實時動態渲染首頁，徹底衝掉舊緩存殘影！
export const dynamic = "force-dynamic"
export const revalidate = 0

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { countryCode } = params

  return {
    title: `LULINGSHINE · 廬陵昱西 | Jingdezhen Contemporary Ceramic Art`,
    description: `景德鎮當代名家柴窯孤品特展與收藏平台。`,
  }
}

export default async function Home(props: Props) {
  const params = await props.params
  const { countryCode } = params

  // 🧠 1. 實時從 Cookie 讀取 Medusa 切換語言時寫入的最新語系 (如 "en", "ja", "zh-TW")
  const cookieStore = await cookies()
  const medusaLocaleCookie = cookieStore.get("medusa_locale")?.value // Medusa 官方模板默認寫入的 cookie 鍵名

  // 🌍 2. 決策最終語言代碼：如果 Cookie 存在就聽 Cookie 的；如果沒有，才根據國家碼盲推 fallback
  let locale = "en"
  if (medusaLocaleCookie) {
    // 將 medusa 格式 (zh-TW / ja) 轉化為 Sanity 欄位名格式 (zh_TW / ja)
    locale = medusaLocaleCookie.replace("-", "_")
  } else {
    locale = getSanityLocale(countryCode)
  }

  // 🛰️ 3. 並行加載 Medusa 與 Sanity 數據庫（此時數據庫查詢已完美鎖定真實語言！）
  const region = await getRegion(countryCode)
  const homeData = await getHomePageData(locale)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return (
      <div className="w-full h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="animate-pulse text-gray-300 tracking-[0.3em] text-xs font-sans uppercase">
          LULINGSHINE...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* 🏛️ SECTION 1: 頂部海報（已綁定動態 Cookie 語系） */}
      <Hero 
        title={homeData?.heroTitle} 
        subtitle={homeData?.heroSubtitle} 
        imageUrl={homeData?.heroImageUrl} 
      />

      {/* 🏛️ SECTION 2: 策展致意 (Greeting) —— 完美跟隨切換語言實時變形 */}
      <div className="max-w-[850px] mx-auto px-6 py-24 md:py-32 text-center flex flex-col items-center justify-center">
        <div className="text-gray-400 text-[10px] tracking-[0.4em] uppercase mb-8 select-none font-light">
          — GREETING / 問候 —
        </div>
        
        {homeData?.greeting ? (
          <div className="text-sm md:text-base tracking-[0.18em] leading-[2.2] text-gray-700 font-light whitespace-pre-line">
            {homeData.greeting}
          </div>
        ) : (
          // 🔒 本地預設Fallback，根據當前語系聰明切換
          <p className="text-sm md:text-base tracking-[0.18em] leading-[2.2] text-gray-700 font-light">
            {locale.startsWith("zh") ? (
              <>
                廬陵昱西，側耳傾聽當代柴窯開窯時的清脆驚雷。<br />
                我們將景德鎮大師的手作孤品與不完美之美，呈獻給每一位寄情茶湯的知音。
              </>
            ) : locale === "ja" ? (
              <>日々の暮らしと茶の湯に寄り添う、現代陶芸作家の一点物。</>
            ) : (
              <>Jingdezhen contemporary master ceramic art, curated for tea connoisseurs worldwide.</>
            )}
          </p>
        )}
      </div>
      
      {/* 🏛️ SECTION 3 & 4: 商品與合集 */}
      <div className="w-full bg-[#faf9f6] pb-20 md:pb-28 border-t border-black/[0.01]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FeaturedProducts collections={collections} region={region} />
        </div>
      </div>
    </div>
  )
}