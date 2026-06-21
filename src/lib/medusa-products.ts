// 📁 路徑：src/lib/medusa-products.ts
import { medusa } from "./medusa-client"

/**
 * 🍵 核心函數 1：根據我們定好的扁平 Category Handle 撈取旗下的所有商品
 * 完美支持前台「茶器 ➔ 茶壺」或「大師 ➔ 歐陽濤」的雙軌扁平暗號分流
 */
export async function getProductsByCategoryHandle(categoryHandle: string) {
  try {
    // 1. 先透過扁平 handle 找到該分類的具體內部 ID
    const categoryResponse = await medusa.store.productCategory.list({
      fields: "id,handle,name",
      handle: categoryHandle,
    })

    const category = categoryResponse.product_categories?.[0]
    if (!category) {
      console.warn(`⚠️ 廬陵昱西前端提示：找不到對應的分類暗號 [Handle: ${categoryHandle}]`)
      return []
    }

    // 2. 拿著 ID 去撈取屬於該分類的商品
    const productsResponse = await medusa.store.product.list({
      fields: "*variants,*categories", // 撈取規格、價格與分類標籤
      category_id: [category.id],
    })

    return productsResponse.products || []
  } catch (error) {
    console.error(`❌ 讀取 Medusa v2 分類商品失敗 [Handle: ${categoryHandle}]:`, error)
    return []
  }
}

/**
 * 👨‍🎨 核心函數 2：精準抓取單一商品的詳情
 * 網址不管是 art- 開頭的大師孤品，還是 gen- 開頭的普通周邊，通殺！
 */
export async function getProductByHandle(productHandle: string) {
  try {
    const response = await medusa.store.product.list({
      fields: "*variants,*categories",
      handle: productHandle,
    })
    
    return response.products?.[0] || null
  } catch (error) {
    console.error(`❌ 讀取 Medusa v2 商品詳情失敗 [Handle: ${productHandle}]:`, error)
    return null
  }
}