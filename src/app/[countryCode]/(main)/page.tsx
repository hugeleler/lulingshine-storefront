// 📁 完整路徑：src/app/[countryCode]/(main)/page.tsx
import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

// 🧠 核心神令：強制 Next.js 每次都實時動態渲染首頁，徹底衝掉舊緩存殘影！
export const dynamic = "force-dynamic"
export const revalidate = 0

type Props = {
  params: Promise<{ countryCode: string }>
}

// 👑 動態生成元數據：完美正名為 LULINGSHINE 品牌敘事
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { countryCode } = params

  return {
    title: `LULINGSHINE · 廬陵昱西 | Jingdezhen Contemporary Ceramic Art`,
    description: `景德鎮當代名家柴窯孤品特展與收藏平台。區域碼: ${countryCode.toUpperCase()}`,
    openGraph: {
      title: "LULINGSHINE · 廬陵昱西",
      description: "景德鎮當代名家柴窯孤品特展與收藏平台。",
    },
  }
}

export default async function Home(props: Props) {
  const params = await props.params
  const { countryCode } = params

  // 🛰️ 完美調用 Medusa 官方數據鏈：自動嗅探當前地區的貨幣和特展最優價
  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  // 🏛️ 天木堂暖白美學風格的優雅加載兜底
  if (!collections || !region) {
    return (
      <div className="w-full h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="animate-pulse text-gray-300 tracking-[0.3em] text-xs font-sans uppercase">
          LULINGSHINE...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* 🏛️ SECTION 1: 頂部藝術巨幅橫幅（已對接大師重器與動態數據） */}
      <Hero />
      
      {/* 🏛️ SECTION 2: 下方合集網格：融入 LULINGSHINE 博物館暖白空間感 */}
      <div className="w-full bg-[#faf9f6] py-20 md:py-28 border-t border-black/[0.01]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          {/* 傳遞 Medusa 原生合集與地區上下文 */}
          <FeaturedProducts collections={collections} region={region} />
        </div>
      </div>
    </div>
  )
}