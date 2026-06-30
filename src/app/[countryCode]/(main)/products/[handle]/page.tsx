// 📁 完整路徑：src/app/[countryCode]/(main)/products/[handle]/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"

// 💡 關鍵針腳：強行打穿 Next.js 靜態緩存！
// 設置為 0 表示每次訪問商品詳情頁時，Node.js 都必須重新實時渲染最新修改的前端代碼！
export const revalidate = 0

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string; r_page?: string }> // 👈 🎯 擴展型別，納入相關產品的動態分頁參數
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images!.filter((i) => imageIdsMap.has(i.id))
}

// 💡 100% 物理超度 " | Medusa Store" 標題後綴
// 讓瀏覽器標籤頁上的名字和甘木道一樣高冷乾淨
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title}【甘木道】`, // 👈 對齊原網頁的優雅後綴標籤
    description: `${product.description || product.title}`,
    openGraph: {
      title: `${product.title}`,
      description: `${product.description || product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id
  
  // 🎯 核心通電：精確解析 URL 上的推薦商品分頁碼（如 ?r_page=2），轉為整數，預設為第 1 頁
  const relatedPage = searchParams.r_page ? parseInt(searchParams.r_page, 10) : 1

  if (!region) {
    notFound()
  }

  // 1. 獲取主商品數據
  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const images = getImagesForVariant(pricedProduct, selectedVariantId)

  // -----------------------------------------------------------------
  // 🎯 核心通電：在 Server 端一次性將與當前商品關聯的所有同系列/標籤產品全部撈乾淨
  // -----------------------------------------------------------------
  const queryParams: any = { is_giftcard: false }
  if (region?.id) queryParams.region_id = region.id
  if (pricedProduct.collection_id) queryParams.collection_id = [pricedProduct.collection_id]
  if (pricedProduct.tags) queryParams.tag_id = pricedProduct.tags.map((t: any) => t.id).filter(Boolean)

  const allRelatedProducts = await listProducts({
    queryParams,
    countryCode: params.countryCode,
  }).then(({ response }) => {
    // 🧠 核心安全過濾：將 11 個推薦產品完整提取，但必須狠狠把當前正在看的這件瓷器本身踢出去
    return response.products.filter((p) => p.id !== pricedProduct.id)
  })

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
      images={images}
      relatedProducts={allRelatedProducts} // 👈 🎯 將 11 個產品全量送入中轉範本
      relatedPage={relatedPage}            // 👈 🎯 將目前的分頁碼同步遞送下去
    />
  )
}