// 📁 完整路徑：src/modules/home/components/featured-products/product-rail/index.tsx
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import { cookies } from "next/headers"

import ProductPreview from "@modules/products/components/product-preview"

// 🎯 模組化校準：引入中央字典與安全工具函數（使用專案標準的 @lib 別名）
import { translateUi } from "@lib/ui-dictionary"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  // 🌍 🛡️ 讀取與 Footer/Nav 完美同步的 Cookie 語系
  const cookieStore = await cookies()
  const medusaLocale = cookieStore.get("medusa_locale")?.value

  // 國別反查初始語系安全兜底
  const countryCode = region.countries?.[0]?.iso_2?.toLowerCase() || "hk"
  let currentLang = medusaLocale
  if (!currentLang) {
    if (countryCode === "hk" || countryCode === "tw") currentLang = "zh-TW"
    else if (countryCode === "cn") currentLang = "zh-CN"
    else if (countryCode === "jp") currentLang = "ja"
    else if (countryCode === "kr") currentLang = "ko"
    else currentLang = "en"
  }

  // 🎯 透過中央字典動態獲取「查看全部」的多語言文案
  const translatedViewAll = translateUi("viewAll", currentLang)

  return (
    <div className="content-container py-16 md:py-24 bg-transparent">
      {/* 🏛️ LULINGSHINE 雙端藝廊級校準標題列：降低下邊框存在感，與畫廊上方空間呼放 */}
      <div className="flex justify-between items-baseline mb-12 border-b border-black/[0.04] pb-6">
        
        {/* 🎯 左側系列大標題優化：
            中英文「柴窯孤品 / Jingdezhen Kiln Fire」全部包含在內！
            一體化切換為極致優雅的 font-light、字距強行舒展 tracking-[0.25em]、
            色調全面鎖死為內斂高灰度的 text-gray-700，徹底消滅全黑的沈重感 */}
        <h2 className="text-base md:text-lg font-serif font-light tracking-[0.25em] text-gray-700 uppercase">
          {collection.title}
        </h2>
        
        {/* 🎯 右側 View all 入口：改用原生 Link 徹底消除刺眼藍色與斜箭頭，與左側標題達成完美的兩端灰度平衡 */}
        <Link 
          href={`/${countryCode}/collections/${collection.handle}`}
          className="text-[10px] md:text-xs tracking-[0.25em] text-gray-400 hover:text-gray-800 transition-all duration-300 uppercase font-sans font-light border-b border-transparent hover:border-black/20 pb-1 no-underline"
        >
          {translatedViewAll} →
        </Link>
      </div>

      {/* 🛍️ 跨端黃金矩陣：手機固定 2 列 (grid-cols-2)，電腦固定 3 列 (small:grid-cols-3) */}
      <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-12">
        {pricedProducts &&
          // 🎯 核心防線：強行在首頁最多只抓取前 3 個商品進入循環，拒絕列出長表
          pricedProducts.slice(0, 3).map((product, index) => (
            <li 
              key={product.id}
              className={`w-full ${
                // 🛡️ 究極對稱防線：如果是第 3 個產品（index === 2），手機端直接隱藏不落單，電腦端才亮出來完美填滿 1 行！
                index === 2 ? "hidden small:block" : "block"
              }`}
            >
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}