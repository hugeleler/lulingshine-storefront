// 📁 完整路徑：src/modules/layout/templates/footer/index.tsx
"use client"

import React, { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { updateLocale } from "@lib/data/locale-actions"

const LANGUAGES = [
  { code: "zh-TW", label: "繁體中文" },
  { code: "zh-CN", label: "简体中文" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
]

const REGION_DICTIONARY: Record<string, Record<string, string>> = {
  hk: { "zh-TW": "香港特別行政區", "zh-CN": "香港特别行政区", en: "Hong Kong SAR", ja: "香港特別行政区", ko: "홍콩 特別행정구" },
  jp: { "zh-TW": "日本", "zh-CN": "日本", en: "Japan", ja: "日本", ko: "일본" },
  tw: { "zh-TW": "台灣地區", "zh-CN": "台湾地区", en: "Taiwan Region", ja: "台湾地域", ko: "대만 지역" },
  kr: { "zh-TW": "韓國", "zh-CN": "韩国", en: "South Korea", ja: "韓国", ko: "대한민국" },
  us: { "zh-TW": "美國", "zh-CN": "美国", en: "United States", ja: "米国", ko: "미국" },
  id: { "zh-TW": "國際市場", "zh-CN": "国际市场", en: "International Market", ja: "国際市場", ko: "국제 시장" },
  fr: { "zh-TW": "歐盟區域", "zh-CN": "欧盟区域", en: "Eurozone (EUR)", ja: "ユーロ圏", ko: "유로존" },
}

const LocalPaymentIcon = ({ src, alt }: { src: string, alt: string }) => (
  <li className="w-[46px] h-[30px] shrink-0 overflow-hidden flex items-center justify-center bg-transparent">
    <img src={src} alt={alt} className="w-full h-full object-contain" />
  </li>
)

export default function Footer() {
  const { countryCode } = useParams()
  const currentCountry = (Array.isArray(countryCode) ? countryCode[0] : countryCode) || "hk"
  const currentPath = usePathname().split(`/${currentCountry}`)[1] || ""

  const [mounted, setMounted] = useState(false)
  const [activeLocale, setActiveLocale] = useState("en")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const cc = currentCountry.toLowerCase()
    let initialLocale = "en"
    if (cc === "hk" || cc === "tw") initialLocale = "zh-TW"
    else if (cc === "cn") initialLocale = "zh-CN"
    else if (cc === "jp") initialLocale = "ja"
    else if (cc === "kr") initialLocale = "ko"

    const match = document.cookie.match(new RegExp('(^| )medusa_locale=([^;]+)'))
    if (match) {
      initialLocale = match[2]
    }

    setActiveLocale(initialLocale)
    setMounted(true)
  }, [currentCountry])

  const legalLinks = [
    { label: "問候", href: `/${currentCountry}/about` },
    { label: "詢問", href: `/${currentCountry}/inquiry` },
    { label: "搜尋", href: `/${currentCountry}/search` },
    { label: "根據《特定商業交易法》進行的符號表示", href: `/${currentCountry}/legal` },
    { label: "隱私政策", href: `/${currentCountry}/privacy-policy` },
    { label: "服務條款", href: `/${currentCountry}/terms-of-service` },
    { label: "退款政策", href: `/${currentCountry}/refund-policy` },
    { label: "配送政策", href: `/${currentCountry}/shipping-policy` },
    { label: "您的隱私選擇", href: `/${currentCountry}/privacy-choices` },
  ]

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetCountry = e.target.value
    startTransition(async () => {
      await updateRegion(targetCountry, currentPath)
    })
  }

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetLang = e.target.value
    setActiveLocale(targetLang)
    
    // 🚀 【終極防線】不管 Medusa 底層做不做，我們在前台用原生 JavaScript 把 Cookie 直接寫死寫滿！
    // 設置過期時間為 1 年，確保全站路由和服務端隨時隨地能抓到最真實的語言！
    if (typeof window !== "undefined") {
      document.cookie = `medusa_locale=${targetLang}; path=/; max-age=31536000; SameSite=Lax`
    }

    startTransition(async () => {
      await updateLocale(targetLang)
      // 📢 執行硬重新整理，強迫服務端的 Nav 重新撈取剛才寫入的最新 Cookie
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    })
  }

  const regionOptions = [
    { value: "hk", key: "hk", currency: "HKD ($)" },
    { value: "jp", key: "jp", currency: "JPY (¥)" },
    { value: "tw", key: "tw", currency: "TWD ($)" },
    { value: "kr", key: "kr", currency: "KRW (₩)" },
    { value: "us", key: "us", currency: "USD ($)" },
    { value: "id", key: "id", currency: "USD ($)" },
    { value: "fr", key: "fr", currency: "EUR (€)" },
  ]

  return (
    <footer className="w-full bg-[#faf9f6] text-gray-600 border-t border-black/[0.03] pt-20 pb-12 font-sans opacity-95">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        
        {/* SECTION 1: 品牌精神 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-16">
          <div className="flex flex-col space-y-4">
            <span className="text-gray-900 text-xs tracking-[0.3em] uppercase font-medium">LULINGSHINE</span>
            <p className="text-xs tracking-widest text-gray-400 leading-loose font-serif max-w-sm">
              廬陵昱西珍藏平台，專營景德鎮當代名家柴窯孤品重器，致力於將東方器物之美與博物館級收藏體驗連接全球。
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs tracking-[0.18em] font-serif text-gray-500">
            {legalLinks.map((link, index) => (
              <Link key={index} href={link.href} className="hover:text-black transition-colors py-0.5">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 2: 國家語系 與 支付列 */}
        <div className="w-full pt-12 pb-8 border-t border-black/[0.04] flex flex-col md:flex-row items-start md:items-end justify-between gap-8 h-auto">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-xs text-gray-800 tracking-wider font-medium">
            
            {/* 🪙 國家/地區 下拉框 */}
            <div className="flex flex-col space-y-1.5">
              <span className="text-gray-400 text-[10px] tracking-[0.2em]">國家/地區</span>
              <div className="relative">
                <select 
                  value={currentCountry.toLowerCase()}
                  onChange={handleRegionChange}
                  disabled={isPending || !mounted}
                  className="appearance-none bg-transparent border border-black/20 px-4 py-2 pr-10 text-xs tracking-widest focus:outline-none cursor-pointer hover:border-black transition-colors font-serif bg-[#faf9f6]"
                >
                  {regionOptions.map((opt) => {
                    const localizedLabel = mounted 
                      ? (REGION_DICTIONARY[opt.key]?.[activeLocale] || REGION_DICTIONARY[opt.key]?.["en"])
                      : REGION_DICTIONARY[opt.key]?.["en"]
                    return (
                      <option key={opt.value} value={opt.value}>
                        {localizedLabel} | {opt.currency}
                      </option>
                    )
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* 🌍 語言 下拉框 */}
            <div className="flex flex-col space-y-1.5">
              <span className="text-gray-400 text-[10px] tracking-[0.2em]">語言</span>
              <div className="relative">
                <select 
                  value={mounted ? activeLocale : "en"}
                  onChange={handleLocaleChange}
                  disabled={isPending || !mounted}
                  className="appearance-none bg-transparent border border-black/20 px-4 py-2 pr-10 text-xs tracking-widest focus:outline-none cursor-pointer hover:border-black transition-colors font-serif bg-[#faf9f6]"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* 右側支付列 */}
          <ul className="payment-icons-lock !mb-0 flex flex-wrap gap-2" role="list">
             <LocalPaymentIcon src="/payments/amex.svg" alt="Amex" />
             <LocalPaymentIcon src="/payments/mastercard.svg" alt="Mastercard" />
             <LocalPaymentIcon src="/payments/visa.svg" alt="Visa" />
             <LocalPaymentIcon src="/payments/jcb.svg" alt="JCB" />
             <LocalPaymentIcon src="/payments/apple-pay.svg" alt="Apple Pay" />
             <LocalPaymentIcon src="/payments/google-pay.svg" alt="Google Pay" />
             <LocalPaymentIcon src="/payments/paypal.svg" alt="PayPal" />
             <LocalPaymentIcon src="/payments/usdt.svg" alt="Crypto" />
          </ul>

        </div>

        {/* SECTION 3: 最底部版權 */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between text-[10px] tracking-[0.2em] text-gray-400 font-light pt-6 border-t border-black/[0.02]">
          <div>© {new Date().getFullYear()} LULINGSHINE CERAMICS (JINGDEZHEN) CO., LIMITED.</div>
          <div className="font-sans text-[9px] text-gray-300">JINGDEZHEN CONTEMPORARY CERAMIC ART</div>
        </div>

      </div>
    </footer>
  )
}