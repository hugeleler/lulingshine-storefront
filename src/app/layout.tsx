// 📁 完整路徑：src/app/layout.tsx
import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css" // 完美指向您 src/styles/ 目錄下的核心全域樣式
import { sanityClient } from "@lib/sanity-client" // 完美對齊您現有的 sanity-client.ts 文件
import Navbar from "../components/Navbar" // 👈 這裡改成精準的相對路徑，徹底破除別名報錯！

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: 'LULINGSHINE · 廬陵昱西 | Jingdezhen Contemporary Ceramic Art',
  description: '景德鎮當代名家柴窯孤品特展與收藏平台',
}

// 🧠 服務端直接秒速抓取數據庫裡的 49 大類
async function getSanityCategories() {
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
    console.error("Layout 讀取 Sanity 分類失敗:", error)
    return [] // 降級防禦，確保數據庫異常時網站不崩潰
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  // 實時拿到 49 大類數據
  const categories = await getSanityCategories()

  return (
    <html lang="zh-HK" data-mode="light">
      <body>
        {/* 🏛️ 注入天木堂靈魂動航欄，把數據往下傳遞 */}
        <Navbar categories={categories} />
        
        {/* 核心策展畫面區 */}
        <main className="relative">
          {props.children}
        </main>
      </body>
    </html>
  )
}