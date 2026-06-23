// 📁 完整路徑：src/modules/layout/templates/nav/index.tsx
import React from "react"
import Link from "next/link"
import { sanityClient } from "@lib/sanity-client"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface CategoryItem {
  _id: string;
  categoryHandle: string;
  pageType: 'artist' | 'collection';
  title?: {
    zh_HK?: string;
    zh_CN?: string;
    en?: string;
  };
}

async function getSanityCategories(): Promise<CategoryItem[]> {
  try {
    const query = `*[_type == "pageContent"] {
      _id,
      categoryHandle,
      pageType,
      title {
        zh_HK,
        zh_CN,
        en
      }
    }`
    return await sanityClient.fetch(query)
  } catch (error) {
    console.error("❌ Nav 讀取 Sanity 分類失敗:", error)
    return []
  }
}

export default async function Nav() {
  const categories = await getSanityCategories()

  const artists = categories.filter(item => item.pageType === 'artist' || item.categoryHandle?.startsWith('art-'))
  const collections = categories.filter(item => item.pageType === 'collection' || !item.categoryHandle?.startsWith('art-'))

  return (
    <header className="w-full bg-[#faf9f6]/95 backdrop-blur-md sticky top-0 z-50 border-b border-black/[0.02]">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 h-24 flex items-center justify-between">
        
        {/* 🏛️ 左側：LULINGSHINE 品牌正名 Logo（對齊 amakido 左側品牌位，極具張力） */}
        <div className="flex items-center space-x-12">
          <div className="flex flex-col">
            <Link href="/" className="text-xl md:text-2xl font-medium tracking-[0.25em] text-[#111] hover:opacity-60 transition-opacity uppercase font-sans">
              LULINGSHINE
            </Link>
            <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-sans mt-1 origin-left">
              Jingdezhen Contemporary
            </span>
          </div>

          {/* 🔮 核心導航選單：放大至 14px，字距拉寬，完美還原高端器物畫廊氣場 */}
          <nav className="hidden lg:flex items-center space-x-10 text-[14px] tracking-[0.2em] font-normal text-gray-700">
            
            {/* 下拉選單：大師名家 */}
            <div className="relative group py-4">
              <span className="cursor-pointer hover:text-black transition-colors border-b border-transparent group-hover:border-black/30 pb-1 font-serif">
                大師名家
              </span>
              <div className="absolute left-0 top-full mt-1 w-60 bg-[#faf9f6] border border-black/[0.06] p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <ul className="space-y-3 text-gray-500 text-[13px] tracking-widest font-serif">
                  {artists.length === 0 ? (
                    <li className="text-gray-400 font-sans text-xs">loading masterpieces...</li>
                  ) : (
                    artists.map(art => (
                      <li key={art._id}>
                        <Link href={`/artists/${art.categoryHandle}`} className="hover:text-black block transition-colors py-0.5">
                          {art.title?.zh_HK || art.title?.zh_CN || "當代名家"}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* 下拉選單：當代系列 */}
            <div className="relative group py-4">
              <span className="cursor-pointer hover:text-black transition-colors border-b border-transparent group-hover:border-black/30 pb-1 font-serif">
                當代系列
              </span>
              <div className="absolute left-0 top-full mt-1 w-60 bg-[#faf9f6] border border-black/[0.06] p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <ul className="space-y-3 text-gray-500 text-[13px] tracking-widest font-serif">
                  {collections.length === 0 ? (
                    <li className="text-gray-400 font-sans text-xs">loading collections...</li>
                  ) : (
                    collections.map(col => (
                      <li key={col._id}>
                        <Link href={`/collections/${col.categoryHandle}`} className="hover:text-black block transition-colors py-0.5">
                          {col.title?.zh_HK || col.title?.zh_CN || "經典系列"}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <Link href="/exhibitions" className="hover:text-black transition-colors py-4 font-serif">
              特展活動
            </Link>
          </nav>
        </div>

        {/* 🛒 右側：原生高級工具組（側邊欄、多地區語系與購物車） */}
        <div className="flex items-center space-x-8 text-[12px] tracking-[0.15em] text-gray-500 font-light">
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-gray-800 font-medium">繁 / EN</span>
            <span className="text-gray-200">|</span>
          </div>
          <div className="flex items-center space-x-4">
            <SideMenu />
            <CartButton />
          </div>
        </div>

      </div>
    </header>
  )
}