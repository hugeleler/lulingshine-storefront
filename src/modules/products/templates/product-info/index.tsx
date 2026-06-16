import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="w-full bg-white">
      {/* 💡 移除限制高度與多餘居中，改為靠左對齊，完美契合右側懸浮面板的呼吸感 */}
      <div className="flex flex-col gap-y-6 w-full">
        
        {/* 1. 所屬合集/系列 (Collection)
            甘木道特有的超輕字體、寬字距
        */}
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-[11px] tracking-[0.3em] text-gray-400 hover:text-black uppercase transition-colors duration-300 font-light"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}

        {/* 2. 商品品名 (Title)
            💡 物理超度粗體和 3xl 巨字！
            換上我們配好的東方明朝體 (font-serif-art)，改為輕量型 (font-light)，字距拉開
        */}
        <Heading
          level="h2"
          className="font-serif-art text-xl md:text-2xl font-light tracking-[0.15em] text-gray-800 leading-relaxed"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        {/* 💡 裝飾短細線：對齊甘木道詳情頁文字下方的呼吸留白 */}
        <div className="w-8 h-[1px] bg-gray-100 my-1"></div>

        {/* 3. 商品藝術簡介 (Description)
            文字縮小到 text-[12px]，行高拉開，顏色改為柔和的炭灰，不與瓷器本體搶戲
        */}
        {product.description && (
          <Text
            className="text-[12px] leading-7 tracking-[0.15em] text-gray-500 font-light whitespace-pre-line"
            data-testid="product-description"
          >
            {product.description}
          </Text>
        )}
        
      </div>
    </div>
  )
}

export default ProductInfo