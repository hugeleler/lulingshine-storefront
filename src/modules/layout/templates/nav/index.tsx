import React from "react"
import Link from "next/link"
import { cookies } from "next/headers"
import CartButton from "@modules/layout/components/cart-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { translateUi } from "@lib/ui-dictionary"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Nav() {
  const currentCountry = "hk"
  let displayLangLabel = "繁"
  let activeLocale = "zh-TW"

  try {
    const cookieStore = await cookies()
    const medusaLocaleCookie = cookieStore.get("medusa_locale")?.value
    
    if (medusaLocaleCookie) {
      activeLocale = medusaLocaleCookie
      
      if (medusaLocaleCookie === "zh-TW") displayLangLabel = "繁"
      else if (medusaLocaleCookie === "zh-CN") displayLangLabel = "简"
      else if (medusaLocaleCookie === "ja") displayLangLabel = "JA"
      else if (medusaLocaleCookie === "ko") displayLangLabel = "KO"
      else if (medusaLocaleCookie === "en") displayLangLabel = "EN"
    }
  } catch (error) {
    console.error("Server-side nav cookie tracker bypassed.")
  }

  // 🧭 【天工首欄】Active Gateway 標籤與內文
  let activeGatewayLabel = "小暑 • 霽藍"
  if (activeLocale === "en") {
    activeGatewayLabel = "Slight Heat • Sacrificial Blue"
  } else if (activeLocale === "ja") {
    activeGatewayLabel = "小暑 • 霽藍"
  } else if (activeLocale === "ko") {
    activeGatewayLabel = "소서 • 지람"
  }

  // 🧠 右側「帳戶」分流：精準捕獲 zh-CN 並輸出簡體字「账户」
  const accountLabel = 
    activeLocale === "en" ? "ACCOUNT" : 
    activeLocale === "ja" ? "マイアカウント" : 
    activeLocale === "ko" ? "마이페이지" : 
    activeLocale === "zh-CN" ? "账户" : "帳戶" // 👈 這裡完美分流

  return (
    <header className="w-full bg-[#faf9f6]/95 backdrop-blur-md sticky top-0 z-50 border-b border-black/[0.02]">
      <div className="max-w-[1536px] mx-auto px-6 md:px-10 h-24 flex items-center justify-between gap-x-4">
        
        {/* 🏛️ 左側：LULINGSHINE 品牌標識 */}
        <div className="flex flex-col select-none flex-shrink-0">
          <Link 
            href={`/${currentCountry}`} 
            className="text-xl md:text-2xl font-medium tracking-[0.25em] text-[#111] hover:opacity-60 transition-opacity uppercase font-sans whitespace-nowrap"
          >
            LULINGSHINE
          </Link>
          <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-sans mt-1 origin-left scale-90 whitespace-nowrap">
            Jingdezhen Contemporary
          </span>
        </div>

        {/* 🧭 中間：完美靠左主導航欄 */}
        <nav className="hidden lg:flex flex-1 justify-start items-center pl-12 xl:pl-20 gap-x-6 xl:gap-x-12 text-[12px] tracking-wide font-normal text-gray-500 font-serif">
          
          {/* 01. 首頁 (Home) */}
          <Link
            href={`/${currentCountry}`}
            className="hover:text-black transition-colors py-4 relative border-b border-transparent hover:border-black/10 whitespace-nowrap flex-shrink-0"
          >
            {translateUi("navHome", activeLocale)}
          </Link>

          {/* 02. 【天工隨時動態首欄】朱砂印落款門戶 */}
          <div className="relative flex items-center group/gateway cursor-pointer py-4 whitespace-nowrap flex-shrink-0">
            <span className="h-1.5 w-1.5 bg-[#B33C3C] rotate-12 transform opacity-90 group-hover/gateway:rotate-0 transition-transform duration-500 mr-2.5 rounded-[1px] shadow-sm flex-shrink-0"></span>
            <Link
              href={`/${currentCountry}/collections/active-gateway`}
              className="text-[#B33C3C] hover:text-black transition-colors"
            >
              {activeGatewayLabel}
            </Link>
          </div>

          {/* 03. 昱西器物 (Lulingshine Objects) */}
          <Link
            href={`/${currentCountry}/store`}
            className="hover:text-black transition-colors py-4 relative border-b border-transparent hover:border-black/10 whitespace-nowrap flex-shrink-0"
          >
            {translateUi("navStore", activeLocale)}
          </Link>

          {/* 04. 大師傑作 (Masterworks) */}
          <Link
            href={`/${currentCountry}/artists`}
            className="hover:text-black transition-colors py-4 relative border-b border-transparent hover:border-black/10 whitespace-nowrap flex-shrink-0"
          >
            {translateUi("navArtists", activeLocale)}
          </Link>

          {/* 05. 博客文誌 (Blog & Review) */}
          <Link
            href={`/${currentCountry}/blog`}
            className="hover:text-black transition-colors py-4 relative border-b border-transparent hover:border-black/10 whitespace-nowrap flex-shrink-0"
          >
            {translateUi("navBlog", activeLocale)}
          </Link>

          {/* 06. 藏家洽詢 (Acquisition & Inquiry) */}
          <Link
            href={`/${currentCountry}/inquiry`}
            className="hover:text-black transition-colors py-4 relative border-b border-transparent hover:border-black/10 whitespace-nowrap flex-shrink-0"
          >
            {translateUi("navInquiry", activeLocale)}
          </Link>
        </nav>

        {/* 🛒 右側：高奢專屬工具組 */}
        <div className="flex items-center gap-x-4 xl:gap-x-6 text-[12px] tracking-[0.15em] text-gray-500 font-light flex-shrink-0 font-sans">
          
          {/* 🌐 語言切換標籤 */}
          <div className="flex items-center space-x-2 select-none">
            <span className="font-normal tracking-widest">{displayLangLabel}</span>
            <span className="text-gray-200">|</span>
          </div>

          {/* 👤 專屬帳戶門戶 */}
          <LocalizedClientLink 
            href="/account" 
            className="hover:text-black transition-colors uppercase font-normal tracking-[0.15em]"
          >
            {accountLabel}
          </LocalizedClientLink>

          {/* 🛒 核心購物車門戶 */}
          <CartButton />
        </div>

      </div>
    </header>
  )
}