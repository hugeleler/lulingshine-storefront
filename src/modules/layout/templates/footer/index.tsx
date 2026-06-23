// 📁 完整路徑：src/modules/layout/templates/footer/index.tsx
import React from "react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

// 輔助組件：對齊本地 public/payments/ 目錄下的 8 個 SVG 檔案（徹底去邊、不留白、完美適配透明圖標）
const LocalPaymentIcon = ({ src, alt }: { src: string, alt: string }) => (
  <li className="w-[46px] h-[30px] shrink-0 flex items-center justify-center overflow-hidden rounded-sm">
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-contain block" 
    />
  </li>
)

export default function Footer() {
  return (
    <footer className="w-full bg-[#faf9f6] text-gray-600 border-t border-black/[0.03] pt-20 pb-12 font-sans">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        
        {/* SECTION 1: 四列畫廊導航 - 完整功能保留 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="flex flex-col space-y-4">
            <span className="text-gray-900 text-xs tracking-[0.3em] uppercase font-medium">LULINGSHINE</span>
            <p className="text-xs tracking-widest text-gray-400 leading-loose font-serif max-w-xs">
              廬陵昱西珍藏平台，專營景德鎮當代名家柴窯孤品重器，致力於將東方器物之美與博物館級收藏體驗連接全球。
            </p>
          </div>
          <div className="flex flex-col space-y-3 text-xs tracking-[0.2em]">
            <span className="text-gray-900 tracking-[0.3em] uppercase font-medium mb-1">藏品分類</span>
            <Link href="/collections" className="hover:text-black transition-colors">所有名家作品</Link>
            <Link href="/exhibitions" className="hover:text-black transition-colors">當代柴窯常設展</Link>
            <Link href="/about" className="hover:text-black transition-colors">關於廬陵昱西</Link>
          </div>
          <div className="flex flex-col space-y-3 text-xs tracking-[0.2em]">
            <span className="text-gray-900 tracking-[0.3em] uppercase font-medium mb-1">服務與條款</span>
            <Link href="/privacy-policy" className="hover:text-black transition-colors">隱私政策 / Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-black transition-colors">服務條款 / Terms</Link>
            <Link href="/shipping-policy" className="hover:text-black transition-colors">配送與保險政策</Link>
          </div>
          <div className="flex flex-col space-y-3 text-xs tracking-[0.2em]">
            <span className="text-gray-900 tracking-[0.3em] uppercase font-medium mb-1">聯絡我們</span>
            <span className="text-gray-400">EMAIL: info@lulingshine.com</span>
            <span className="text-gray-400">LOCATION: Jingdezhen / Hong Kong</span>
          </div>
        </div>

        {/* SECTION 2: 國家語系 與 100% 本地彩色支付列 */}
        <div className="w-full pt-12 pb-8 border-t border-black/[0.04] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* 左側：完整功能下拉選單 */}
          <div className="flex items-center space-x-6 text-xs text-gray-800 tracking-wider font-medium">
            <div className="flex flex-col space-y-1.5">
              <span className="text-gray-400 text-[10px] tracking-[0.2em]">國家/地區</span>
              <div className="relative">
                <select 
                  defaultValue="hk"
                  className="appearance-none bg-transparent border border-black/20 px-4 py-2 pr-10 text-xs tracking-widest focus:outline-none cursor-pointer hover:border-black transition-colors font-serif bg-[#faf9f6]"
                >
                  <option value="hk">香港特別行政區 | HKD $</option>
                  <option value="tw">台灣地區 | TWD $</option>
                  <option value="us">美國 / 全球海外 | USD $</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <span className="text-gray-400 text-[10px] tracking-[0.2em]">語言</span>
              <div className="relative">
                <select className="appearance-none bg-transparent border border-black/20 px-4 py-2 pr-10 text-xs tracking-widest focus:outline-none cursor-pointer hover:border-black transition-colors font-serif bg-[#faf9f6]">
                  <option>繁體中文</option>
                  <option>English</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：✨ 8 個無邊框、無背景支付圖標，直接並排 */}
          <ul className="flex items-center gap-3" role="list">
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
          <div className="mb-4 sm:mb-0">
            © {new Date().getFullYear()} LULINGSHINE CERAMICS (JINGDEZHEN) CO., LIMITED. ALL RIGHTS RESERVED.
          </div>
          <div className="font-sans text-[9px] text-gray-300">
            JINGDEZHEN CONTEMPORARY CERAMIC ART
          </div>
        </div>

      </div>
    </footer>
  )
}