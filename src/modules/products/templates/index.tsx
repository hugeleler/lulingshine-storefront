// 📁 完整路徑：src/modules/products/templates/index.tsx
import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
  relatedProducts: HttpTypes.StoreProduct[] // 👈 🎯 針腳接通：擴展型別接收來自 Server 端的 11 個產品數據
  relatedPage?: number // 👈 🎯 針腳接通：接收來自外層 Page 路由的 URL 動態頁碼
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
  relatedProducts = [], // 👈 🎯 針腳解構
  relatedPage = 1,      // 👈 🎯 針腳解構，預設為第 1 頁
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      {/* 💡 核心改造：最大寬度對齊首頁 1440px，去掉原本居中容器的硬邊框
          使用 grid-cols-1 lg:grid-cols-12 實現完美的美術館雙欄佈局
      */}
      <div
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-12 flex flex-col lg:grid lg:grid-cols-12 gap-y-12 lg:gap-x-20 relative bg-white"
        data-testid="product-container"
      >
        
        {/* ================= 左側欄：巨幅藝術大圖展廳 (7/12 寬度) ================= */}
        <div className="w-full lg:col-span-7 relative">
          <ImageGallery images={images} />
        </div>

        {/* ================= 右側欄：極簡文字購買控制台 (5/12 寬度) ================= */}
        {/* 💡 開啟 sticky，當左邊滑動放大欣賞瓷器時，右邊的購買面板優雅固定在頂部 */}
        <div className="w-full lg:col-span-5 flex flex-col lg:sticky lg:top-32 h-fit gap-y-10">
          
          {/* 1. 商品品名與價格區塊 */}
          <ProductInfo product={product} />
          
          {/* 2. 購買按鈕與變體選擇區塊 */}
          <div className="w-full">
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>

          {/* 3. 工藝引言與詳細參數下拉（比如尺寸、重量、材質說明） */}
          <div className="w-full border-t border-gray-100 pt-6">
            <ProductTabs product={product} />
          </div>

        </div>

      </div>

      {/* ================= 底部：相關推薦區塊 ================= */}
      {/* 💡 增加大留白過渡，讓推薦看起來像畫廊的下一展廳 */}
      <div
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 mt-32 mb-16 border-t border-black/[0.04] pt-16"
        data-testid="related-products-container"
      >
        {/* 🧠 移除外部包裹的 Suspense 延遲，改為直通電路：
            因為數據在 Page 伺服器端已經 await 完成，這樣能免去前端閃爍骨架屏，達到高奢大氣的秒開體驗！ */}
        <RelatedProducts 
          product={product} 
          region={region} 
          relatedProducts={relatedProducts} // 👈 🎯 全量數據無損灌入最底層組件
          currentPage={relatedPage}         // 👈 🎯 將分頁引腳精準透傳入網格調度中心！
        />
      </div>
    </>
  )
}

export default ProductTemplate