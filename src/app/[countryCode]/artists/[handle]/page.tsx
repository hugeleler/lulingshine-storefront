// 📁 這是全獨立新文件：src/app/[countryCode]/artists/[handle]/page.tsx
import { createClient } from '@sanity/client'

// 💡 拿你剛才生成的 qdbzil11 正宗雲端保險箱密碼
const client = createClient({
  projectId: 'qdbzil11',
  dataset: 'production',
  useCdn: false, // 設為 false，確保你在 Sanity 後台一改大師資料，這裡刷新一秒就能看到
  apiVersion: '2026-06-17',
})

// ⚡ 核心安全鎖：強制動態渲染，不搞任何死板的靜態緩存
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    countryCode: string
    handle: string
  }>
}

export default async function ArtistDetailPage({ params }: Props) {
  const { countryCode, handle } = await params

  // 🎯 GROQ 查詢：拿著目前的網址暗號（如 yuxi-bowl），去 Sanity 雲端把「歐陽濤」大師抓下來
  const query = `*[_type == "artist" && handle.current == $handle][0]{
    name,
    "handle": handle.current,
    biography
  }`

  const artist = await client.fetch(query, { handle })

  // 🚫 防呆提示：如果網址敲錯了，管道沒問題但對不上暗號時的警報
  if (!artist) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-red-500 font-mono" style={{ padding: '2rem', maxWidth: '42rem', margin: '0 auto', color: '#ef4444', fontFamily: 'monospace' }}>
        ❌ 數據管道已接通！但在 Sanity 後台沒找到 Handle 為 「{handle}」 的大師檔案。
      </div>
    )
  }

  // 🌍 多語言自動對賬
  const isZh = countryCode.includes('zh') || countryCode === 'hk'
  const currentBio = isZh 
    ? (artist.biography?.zh || artist.biography?.en || '暫無中文簡介')
    : (artist.biography?.en || artist.biography?.zh || 'No biography available')

  return (
    <div style={{ padding: '3rem', maxWidth: '48rem', margin: '0 auto', color: '#292524', backgroundColor: '#f9f8f6', fontFamily: 'serif', minHeight: '100vh' }}>
      
      {/* 🟢 管道狀態指示燈 */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.875rem' }}>
        ⚙️ [Node.js + Medusa + Sanity] 數據通信管道測試：【100% 成功通電】
      </div>

      {/* 🎨 大師名字 */}
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem', borderBottom: '1px solid #e7e5e4', paddingBottom: '1rem' }}>
        {artist.name}
      </h1>
      
      <p style={{ fontFamily: 'monospace', color: '#78716c', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        跨境商務對齊識別碼 (Handle): <span style={{ textDecoration: 'underline' }}>{artist.handle}</span>
      </p>

      {/* 📖 故事內容 */}
      <div style={{ lineHeight: '1.75', fontSize: '1.125rem', whiteSpace: 'pre-line' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#44403c' }}>🎨 內容引擎搬運成功：</h3>
        <p style={{ padding: '1rem', backgroundColor: '#f5f5f4', borderLeft: '4px solid #a8a29e', fontStyle: 'italic', color: '#44403c' }}>
          {currentBio}
        </p>
      </div>

    </div>
  )
}