// 📁 完整路徑：src/modules/home/components/hero/index.tsx
import { Heading } from "@medusajs/ui"
import React from "react"
import Link from "next/link"
import { cookies } from "next/headers"
import { translateUi } from "@lib/ui-dictionary" // 👈 導入老大您的中央大腦

export default async function Hero() {
  let activeLocale = "zh-TW" // 預設語系

  try {
    // 🧠 實時嗅探 Cookie，確保首頁內容跟著頁尾換語系時同步硬刷新換裝！
    const cookieStore = await cookies()
    const medusaLocaleCookie = cookieStore.get("medusa_locale")?.value
    if (medusaLocaleCookie) {
      activeLocale = medusaLocaleCookie
    }
  } catch (e) {
    console.error("Hero server-side language tracker bypass.")
  }

  // 從老大的 uiDictionary 大腦獲取翻譯文本
  const title = translateUi("heroTitle", activeLocale)
  const subtitle = translateUi("heroSub", activeLocale)
  const buttonText = translateUi("heroBtn", activeLocale)

  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle font-serif">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-32 gap-6 bg-[#faf9f6]">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal tracking-[0.18em]"
          >
            {title}
          </Heading>
          <Heading
            level="h2"
            className="text-base leading-10 text-ui-fg-subtle font-light tracking-[0.15em] mt-2"
          >
            {subtitle}
          </Heading>
        </span>
        
        <Link
          href="/hk/store"
          className="mt-4 text-xs tracking-[0.2em] font-light text-gray-500 border border-black/20 px-6 py-2.5 hover:bg-black hover:text-white hover:border-black transition-all duration-300 font-sans uppercase"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  )
}