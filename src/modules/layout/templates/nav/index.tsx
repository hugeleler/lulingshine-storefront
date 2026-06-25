// 📁 完整路徑：src/modules/layout/templates/nav/index.tsx
import React from "react"
import Link from "next/link"
import { cookies } from "next/headers"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { translateUi } from "@lib/ui-dictionary" // 👈 100% 呼叫老大的中央字典大腦

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

  // 🧭 徹底修正：全權交給 translateUi 處理翻譯，不管是中文、英文、日文還是韓文，全部實時變形！
  const navItems = [
    { label: translateUi("navHome", activeLocale), href: `/${currentCountry}` },
    { label: translateUi("navStore", activeLocale), href: `/${currentCountry}/store` },
    { label: translateUi("navAbout", activeLocale), href: `/${currentCountry}/about` },
    { label: translateUi("navArtists", activeLocale), href: `/${currentCountry}/artists` },
    { label: translateUi("navBlog", activeLocale), href: `/${currentCountry}/blog` },
    { label: translateUi("navPackaging", activeLocale), href: `/${currentCountry}/packaging` },
    { label: translateUi("navInquiry", activeLocale), href: `/${currentCountry}/inquiry` },
  ]

  return (
    <header className="w-full bg-[#faf9f6]/95 backdrop-blur-md sticky top-0 z-50 border-b border-black/[0.02]">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 h-24 flex items-center justify-between">
        
        {/* 🏛️ 左側：LULINGSHINE 品牌標識（原裝結構 100% 保留） */}
        <div className="flex items-center space-x-14">
          <div className="flex flex-col select-none">
            <Link 
              href={`/${currentCountry}`} 
              className="text-xl md:text-2xl font-medium tracking-[0.25em] text-[#111] hover:opacity-60 transition-opacity uppercase font-sans"
            >
              LULINGSHINE
            </Link>
            <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-sans mt-1 origin-left scale-90">
              Jingdezhen Contemporary
            </span>
          </div>

          {/* 導航主選單：完美實現多語言切換 */}
          <nav className="hidden lg:flex items-center space-x-8 text-[13px] tracking-[0.25em] font-normal text-gray-600">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="hover:text-black transition-colors py-4 font-serif relative border-b border-transparent hover:border-black/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 🛒 右側工具組（原裝結構 100% 保留） */}
        <div className="flex items-center space-x-6 text-[12px] tracking-[0.15em] text-gray-500 font-light">
          <div className="flex items-center space-x-2 select-none">
            <span className="text-gray-900 font-medium tracking-widest">{displayLangLabel}</span>
            <span className="text-gray-200">|</span>
          </div>
          <SideMenu />
          <CartButton />
        </div>

      </div>
    </header>
  )
}