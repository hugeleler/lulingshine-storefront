// 📁 完整路徑：src/modules/products/components/related-products/index.tsx
// 🎯 治本修正：徹底移除 "use client"，回歸純粹、安全的 Server Component
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import Product from "../product-preview"
import { cookies } from "next/headers" // 👈 🌍 頂級解法：引入伺服器端 Cookie 讀取器

// 🏛️ 模組化校準：引入中央字典與安全工具函數
import { translateUi } from "@lib/ui-dictionary"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  relatedProducts: HttpTypes.StoreProduct[]
  // 🧠 接收從頁面 URL 動態傳進來的分頁碼，預設為第一頁
  currentPage?: number
}

export default async function RelatedProducts({
  product,
  region,
  relatedProducts = [],
  currentPage = 1,
}: RelatedProductsProps) {
  
  if (!relatedProducts.length) {
    return null
  }

  // 🌍 100% 複製 Footer 語系反查哲學（伺服器安全無損版）：
  // 直接從請求頭的 Cookies 中精確榨取真正的 medusa_locale
  const cookieStore = await cookies()
  const medusaLocale = cookieStore.get("medusa_locale")?.value

  // 根據國家程式碼設定默認兜底語系
  const countryCode = region.countries?.[0]?.iso_2?.toLowerCase() || "hk"
  let activeLocale = "en"
  if (countryCode === "hk" || countryCode === "tw") activeLocale = "zh-TW"
  else if (countryCode === "cn") activeLocale = "zh-CN"
  else if (countryCode === "jp") activeLocale = "ja"
  else if (countryCode === "kr") activeLocale = "ko"

  // 如果 Cookie 中存有真實語系，以 Cookie 為最高真理
  if (medusaLocale) {
    activeLocale = medusaLocale
  }

  // 🎯 呼叫中央工具函數，直接提取廬陵昱西官方標準展簽翻譯
  const prevLabel = translateUi("prevPage", activeLocale)
  const nextLabel = translateUi("nextPage", activeLocale)

  // 📐 動態計算正統伺服器端分頁幾何
  // 💡 提示：測試完成後可將 6 改回 12
  const productsPerPage = 6
  const totalProducts = relatedProducts.length
  const totalPages = Math.ceil(totalProducts / productsPerPage)
  
  // 安全限制當前頁碼範疇
  const validatedPage = Math.min(Math.max(currentPage, 1), totalPages)
  
  const indexOfLastProduct = validatedPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = relatedProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  return (
    <div className="w-full mt-24 pb-24 border-t border-black/[0.04] pt-16">
      {/* 🏛️ 廬陵昱西展簽大標題 */}
      <div className="mb-12 pb-6 flex flex-col items-center">
        <h2 className="text-base md:text-lg font-serif font-light tracking-[0.25em] text-gray-700 uppercase text-center max-w-xl leading-relaxed">
          You might also want to check out these products
        </h2>
      </div>

      {/* 🛍️ 3 列高奢黃金矩陣：11 個產品會完美以 3*4 的格式鋪開，絕不擠壓、不走樣 */}
      <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-12">
        {currentProducts.map((p) => (
          <li key={p.id} className="w-full">
            {/* 🧠 因為回歸了 Server 環境，這裡的 Product 卡片組件現在可以 100% 安全通電！ */}
            <Product region={region} product={p} />
          </li>
        ))}
      </ul>

      {/* 🏛️ 畫廊極簡分頁器：透過 URL 參數 (?r_page) 觸發伺服器原地渲染 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-20 pt-8 border-t border-black/[0.02]">
          {/* 上一頁 */}
          {validatedPage > 1 ? (
            <Link
              href={`?r_page=${validatedPage - 1}`}
              scroll={false}
              className="text-[11px] tracking-[0.15em] uppercase font-sans text-gray-400 hover:text-black transition-colors duration-300 no-underline"
            >
              {prevLabel}
            </Link>
          ) : (
            <span className="text-[11px] tracking-[0.15em] uppercase font-sans text-gray-200 cursor-not-allowed select-none">
              {prevLabel}
            </span>
          )}

          {/* 數字頁碼：01, 02 奢華感編號 */}
          <div className="flex gap-4 font-sans text-xs font-light tracking-[0.1em]">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={`?r_page=${pageNumber}`}
                scroll={false}
                className={`pb-1 border-b transition-all duration-300 no-underline ${
                  validatedPage === pageNumber
                    ? "text-black border-black font-normal cursor-default"
                    : "text-gray-400 border-transparent hover:text-black"
                }`}
              >
                {String(pageNumber).padStart(2, '0')}
              </Link>
            ))}
          </div>

          {/* 下一頁 */}
          {validatedPage < totalPages ? (
            <Link
              href={`?r_page=${validatedPage + 1}`}
              scroll={false}
              className="text-[11px] tracking-[0.15em] uppercase font-sans text-gray-400 hover:text-black transition-colors duration-300 no-underline"
            >
              {nextLabel}
            </Link>
          ) : (
            <span className="text-[11px] tracking-[0.15em] uppercase font-sans text-gray-200 cursor-not-allowed select-none">
              {nextLabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}