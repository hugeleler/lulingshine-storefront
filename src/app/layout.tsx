// 📁 完整路徑：src/app/layout.tsx
import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css" // 💡 確保我們在 src/styles/globals.css 下的高奢暖白與字體全線通電

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: 'LULINGSHINE · 廬陵昱西 | Jingdezhen Contemporary Ceramic Art',
  description: '景德鎮當代名家柴窯孤品特展與收藏平台',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK" data-mode="light">
      <body>
        {/* 🏛️ 這裡不再寫任何手動 import 的 Navbar，將控制權完美還給 Medusa starter 的本地化路由 */}
        <main className="relative">
          {props.children}
        </main>
      </body>
    </html>
  )
}