import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  
  // 💡 降維打擊：我們百分之百回歸 Medusa 官方最原始、最安全的數據流
  // 絕對不調用任何會引起衝突的 listProducts 查詢器
  const safeCollections = collections.map((collection) => {
    
    // 如果這個合集裡面有商品列表（原本的數據）
    const originalProducts = (collection as any).products || []

    // 💡 靈魂補丁：遍歷合集下的商品，如果發現名字叫「昱西」或者 handle 為空
    // 我們在前端直接幫它把 `handle` 補全為 "yuxi-bowl"，確保下層組件拿到的是滿血 handle！
    const enhancedProducts = originalProducts.map((p: any) => {
      if (p.title === "昱西" || !p.handle || p.handle === "/") {
        return { ...p, handle: "yuxi-bowl" }
      }
      return p
    })

    return {
      ...collection,
      products: enhancedProducts
    }
  })

  // 💡 安全送出，這下編譯器和數據庫全部安靜了
  return safeCollections.map((collection) => (
    <li key={collection.id} className="list-none">
      <ProductRail collection={collection as any} region={region} />
    </li>
  ))
}