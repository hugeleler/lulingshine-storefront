// 📁 完整路徑：src/modules/store/templates/paginated-products.tsx
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { cookies } from "next/headers"

// 🎯 治本修正：改用 100% 安全的相對路徑引入中央字典，徹底消除 Module not found 報錯
import { translateUi } from "../../../lib/ui-dictionary"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  limit = PRODUCT_LIMIT,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  limit?: number
}) {
  const queryParams: PaginatedProductsParams = {
    limit: limit,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / limit)

  // 🌍 讀取與 Footer 完美同步的 Cookie 語系
  const cookieStore = await cookies()
  const medusaLocale = cookieStore.get("medusa_locale")?.value

  // 國別反查初始語系安全兜底
  let currentLang = medusaLocale
  if (!currentLang) {
    const cc = countryCode.toLowerCase()
    if (cc === "hk" || cc === "tw") currentLang = "zh-TW"
    else if (cc === "cn") currentLang = "zh-CN"
    else if (cc === "jp") currentLang = "ja"
    else if (cc === "kr") currentLang = "ko"
    else currentLang = "en"
  }

  // 🎯 模組化核心：透過中央字典撈取對應語言的文本，並將 {count} 替換為真實的後台數量
  const rawCountLabel = translateUi("productCount", currentLang)
  
  // 處理英文單複數的高奢微調細節
  let finalCountLabel = rawCountLabel.replace("{count}", String(count))
  if (currentLang === "en" && count <= 1) {
    finalCountLabel = finalCountLabel.replace("Products", "Product")
  }

  return (
    <div className="relative w-full">
      {/* 🌐 頂級對齊：此處程式碼極其乾淨，與標題同一行右對齊 */}
      <div className="absolute -top-[68px] right-0 text-xs tracking-[0.2em] text-gray-400 font-sans uppercase">
        {finalCountLabel}
      </div>

      {/* 🛍️ 3 列高奢網格佈局（每行3個，完美整除） */}
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 gap-x-6 gap-y-10"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>

      {/* 🔢 數字分頁器 */}
      {totalPages > 1 && (
        <div className="mt-16">
          <Pagination
            data-testid="product-pagination"
            page={page}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  )
}