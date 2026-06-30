// 📁 完整路徑：src/modules/store/templates/index.tsx
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const PRODUCT_LIMIT = 12

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-12 content-container gap-8 bg-[#faf9f6] min-h-screen"
      data-testid="category-container"
    >
      {/* 左側：大師級篩選側邊欄 */}
      <RefinementList sortBy={sort} />
      
      <div className="w-full relative">
        {/* 🏷️ 高奢感留白標題列（與底層計數器完美 Flex 對齊空間） */}
        <div className="mb-12 border-b border-black/[0.05] pb-4 flex justify-between items-baseline">
          <h1 
            data-testid="store-page-title" 
            className="text-xl md:text-2xl font-serif tracking-[0.15em] text-gray-900 uppercase"
          >
            All products
          </h1>
          {/* 右側空間預留給底層異步加載出來的多語言計數器 */}
          <div className="w-24 h-4"></div>
        </div>

        {/* 🌀 骨架屏異步流 */}
        <Suspense fallback={<SkeletonProductGrid numberOfProducts={PRODUCT_LIMIT} />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            limit={PRODUCT_LIMIT} // 👈 注入 12 個的斷流限制
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate