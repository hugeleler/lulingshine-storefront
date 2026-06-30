// 📁 完整路徑：src/modules/collections/templates/index.tsx
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

// 🎯 治本修正：移除引發 Build Error 的跨動態路由引用，直接在本地鎖定 12 個的黃金經驗值
const PRODUCT_LIMIT = 12

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    // 🏛️ 高奢藝術展廳的底色與精緻邊距
    <div className="flex flex-col small:flex-row small:items-start py-12 content-container gap-8 bg-[#faf9f6] min-h-screen">
      
      {/* 左側：大師篩選側邊欄 */}
      <RefinementList sortBy={sort} />
      
      <div className="w-full">
        {/* 🏷️ 高級感留白標題列 */}
        <div className="mb-12 border-b border-black/[0.05] pb-6">
          <h1 className="text-2xl md:text-3xl font-serif tracking-[0.2em] text-gray-900 uppercase">
            {collection.title}
          </h1>
        </div>
        
        {/* 🌀 異步流加載骨架屏 */}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={PRODUCT_LIMIT} // 同步為 12 宮格骨架
            />
          }
        >
          {/* 📦 核心產品矩陣與數字分頁 */}
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
            limit={PRODUCT_LIMIT} // 👈 正確傳導 12 的斷流限制
          />
        </Suspense>
      </div>
    </div>
  )
}