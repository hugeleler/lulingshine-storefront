// 📁 完整路徑：src/modules/home/components/client-home-wrapper/index.tsx
"use client"

import React, { useEffect, useState } from "react"
import Hero from "@modules/home/components/hero"
import { sanityClient, getSanityLocale } from "@lib/sanity-client"

interface Props {
  countryCode: string
}

export default function ClientHomeWrapper({ countryCode }: Props) {
  const [homeData, setHomeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🧠 核心神技：直接讀取 Medusa 切換語言時寫入客戶端的緩存，或者從網址逆推
    const fetchDynamicData = async () => {
      setLoading(true)
      
      // 1. 嘗試抓取 Medusa 寫在 Cookie 裡的語系，如果拿不到，則完美自動對齊網址
      const match = document.cookie.match(new RegExp('(^| )medusa_locale=([^;]+)'))
      const medusaLocale = match ? match[2] : getSanityLocale(countryCode)
      const cleanLocale = medusaLocale.replace("-", "_")

      // 2. 直接在客戶端實時向 Sanity 發起精確查詢
      try {
        const query = `*[_type == "home"][0]{
          "heroTitle": heroTitle.${cleanLocale},
          "heroSubtitle": heroSubtitle.${cleanLocale},
          "heroImageUrl": heroImage.asset->url,
          "greeting": greetingContent.${cleanLocale}
        }`
        const data = await sanityClient.fetch(query)
        setHomeData(data)
      } catch (err) {
        console.error("Client fetch Sanity failed:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDynamicData()
    
    // 🔔 監聽全站點擊刷新事件，確保頂部 Nav 改了語言，這裡一秒鐘內同步變形！
    window.addEventListener("focus", fetchDynamicData)
    return () => window.removeEventListener("focus", fetchDynamicData)
  }, [countryCode])

  // 🔒 本地極佳的 Fallback 禪意防線
  const defaultGreeting = homeData?.greeting || (
    "廬陵昱西，側耳傾聽當代柴窯開窯時的清脆驚雷。\n我們將景德鎮大師的手作孤品與不完美之美，呈獻給每一位寄情茶湯的知音。"
  )

  return (
    <>
      {/* 欄目一：首頁海報（實時響應變色） */}
      <Hero 
        title={homeData?.heroTitle} 
        subtitle={homeData?.heroSubtitle} 
        imageUrl={homeData?.heroImageUrl} 
      />

      {/* 欄目二：策展致意（實時響應變色） */}
      <div className="max-w-[850px] mx-auto px-6 py-24 md:py-32 text-center flex flex-col items-center justify-center">
        <div className="text-gray-400 text-[10px] tracking-[0.4em] uppercase mb-8 select-none font-light">
          — GREETING / 問候 —
        </div>
        
        <div className={`text-sm md:text-base tracking-[0.18em] leading-[2.2] text-gray-700 font-light whitespace-pre-line transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
          {defaultGreeting}
        </div>
      </div>
    </>
  )
}