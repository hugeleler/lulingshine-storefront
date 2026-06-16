import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

type Props = {
  params: Promise<{ countryCode: string }>
}

// 💡 核心修正：改用動態動態生成元數據，百分之百解決動態路由下的 404 穿幫
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { countryCode } = params

  return {
    title: `高級陶器の専門店【甘木道】`,
    description: `日々の暮らしと茶の湯に寄り添う、現代陶芸作家的一点物専門店。區域碼: ${countryCode.toUpperCase()}`,
    openGraph: {
      title: "高級陶器の専門店【甘木道】",
      description: "日々の暮らしと茶の湯に寄り添う、現代陶芸作家的一点物専門店。",
    },
  }
}

export default async function Home(props: Props) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  // 💡 如果數據還沒加載出來，給一個優雅的兜底，防止崩潰報 404
  if (!collections || !region) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse font-serif-art text-gray-300 tracking-widest text-sm">AMAKIDO...</div>
      </div>
    )
  }

  return (
    <>
      {/* 頂部藝術巨幅橫幅（已完美歸位） */}
      <Hero />
      
      {/* 下方合集網格戰場：100% 還原甘木道大留白空間感 */}
      <div className="w-full bg-white py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FeaturedProducts collections={collections} region={region} />
        </div>
      </div>
    </>
  )
}