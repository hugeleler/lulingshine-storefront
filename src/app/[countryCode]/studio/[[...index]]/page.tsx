// 📁 路徑：src/app/[countryCode]/studio/[[...index]]/page.tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../../sanity.config'

// 💡 2026 核心破局關鍵：強迫 Next.js 15+ 放棄靜態預編譯，將此路由永久標記為即時動態渲染！
// 這樣 Sanity 內部的 useResetHistoryParams 才能在瀏覽器裡精準掌控路徑，絕不崩潰！
export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white" data-theme="dark">
      <NextStudio config={config} />
    </div>
  )
}