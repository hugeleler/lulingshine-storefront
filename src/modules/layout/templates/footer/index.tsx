import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  // 保持 Medusa 原有的數據請求，不破壞後端解耦，但前端視覺上我們選擇性不渲染它們
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-20">
      <div className="max-w-[1440px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-y-4">
        
        {/* 左側：極簡藝術版權聲明 */}
        <div className="flex items-center space-x-4 text-xs tracking-widest text-gray-400 font-light">
          <Text className="text-[11px]">
            © {new Date().getFullYear()} 甘木道 AMAKIDO. All rights reserved.
          </Text>
        </div>

        {/* 右側：幽靈鏈接與安全圖標（100% 還原甘木道底部的極簡乾淨度） */}
        <div className="flex items-center space-x-6 text-[11px] tracking-widest text-gray-400 font-light">
          <LocalizedClientLink href="/privacy" className="hover:text-black transition-colors duration-300">
            プライバシーポリシー (隱私政策)
          </LocalizedClientLink>
          <LocalizedClientLink href="/terms" className="hover:text-black transition-colors duration-300">
            特定商取引法に基づく表記 (法律聲明)
          </LocalizedClientLink>
        </div>

      </div>
    </footer>
  )
}