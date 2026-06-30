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

// 🏛️ LULINGSHINE 國際高奢極簡前台對照字典（全面去除括號，極致視覺淨化）
const REGION_DICTIONARY: Record<string, Record<string, string>> = {
  hk: { 
    "zh-TW": "香港HongKong", 
    "zh-CN": "香港HongKong", 
    en: "Hong Kong", 
    ja: "香港HongKong", 
    ko: "홍콩HongKong" 
  },
  tw: { 
    "zh-TW": "臺灣Taiwan", 
    "zh-CN": "臺灣Taiwan", 
    en: "Taiwan", 
    ja: "臺灣Taiwan", 
    ko: "대만Taiwan" 
  },
  us: { 
    "zh-TW": "美國USA", 
    "zh-CN": "美国USA", 
    en: "United States", // 👈 2. 地區為 English 時，精準簡化為 United States
    ja: "米国USA", 
    ko: "미국USA" 
  },
  jp: { 
    "zh-TW": "日本Japan", 
    "zh-CN": "日本Japan", 
    en: "Japan", 
    ja: "日本Japan", 
    ko: "일본Japan" 
  },
  kr: { 
    "zh-TW": "韓國Korea", 
    "zh-CN": "韩国Korea", 
    en: "Korea", 
    ja: "韓国Korea", 
    ko: "한국Korea" 
  },
  fr: { 
    "zh-TW": "歐洲經濟區EEA", // 👈 4. 全語系去除（）括號內容
    "zh-CN": "欧洲经济区EEA", 
    en: "EEA", 
    ja: "欧州経済領域EEA", 
    ko: "유럽 경제 지역 EEA" 
  },
  gb: { 
    "zh-TW": "國際市場RoW", // 👈 4. 全語系去除（）括號內容
    "zh-CN": "国际市场RoW", 
    en: "Rest of World", // 👈 3. 地區為 English 時，精準簡化為 Rest of World
    ja: "国際市場RoW", 
    ko: "국제 시장 RoW" 
  },
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
  const [currentYear, setCurrentYear] = useState(2026) // 🛡️ 固化初始年份，防止手機端水合衝突
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    // 1. 在客戶端安全同步真實年份
    setCurrentYear(new Date().getFullYear())

    // 2. 處理初始語系與 Cookie 反查
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
    setMounted(true) // 🎯 標記客戶端掛載成功
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
    
    if (typeof window !== "undefined") {
      document.cookie = `medusa_locale=${targetLang}; path=/; max-age=31536000; SameSite=Lax`
    }

    startTransition(async () => {
      await updateLocale(targetLang)
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    })
  }

  // 🛠️ 1. 核心強控排序：將 gb (國際市場RoW) 穩穩死鎖在最後一欄
  const regionOptions = [
    { value: "hk", key: "hk", currency: "HKD ($)" },
    { value: "tw", key: "tw", currency: "TWD ($)" },
    { value: "us", key: "us", currency: "USD ($)" },
    { value: "jp", key: "jp", currency: "JPY (¥)" },
    { value: "kr", key: "kr", currency: "KRW (₩)" },
    { value: "fr", key: "fr", currency: "EUR (€)" },
    { value: "gb", key: "gb", currency: "USD ($)" }, // 👈 RoW 成功沉底至最後一欄
  ]

  // 🛡️ 終極水合防線：伺服器端編譯時先返回骨架結構，等手機端掛載成功後再渲染，徹底規避 Hydration 報錯
  if (!mounted) {
    return <footer className="w-full bg-[#faf9f6] min-h-[400px]"></footer>
  }

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
                  disabled={isPending}
                  className="appearance-none bg-transparent border border-black/20 px-4 py-2 pr-10 text-xs tracking-widest focus:outline-none cursor-pointer hover:border-black transition-colors font-serif bg-[#faf9f6]"
                >
                  {regionOptions.map((opt) => {
                    const localizedLabel = REGION_DICTIONARY[opt.key]?.[activeLocale] || REGION_DICTIONARY[opt.key]?.["en"]
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
                  value={activeLocale}
                  onChange={handleLocaleChange}
                  disabled={isPending}
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
          <div>© {currentYear} LULINGSHINE CERAMICS (JINGDEZHEN) CO., LIMITED.</div>
          <div className="font-sans text-[9px] text-gray-300">JINGDEZHEN CONTEMPORARY CERAMIC ART</div>
        </div>

      </div>
    </footer>
  )
}