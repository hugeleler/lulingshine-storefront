// 📁 路徑：src/app/api/sync-medusa-to-sanity/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-06-17',
  token: process.env.SANITY_WRITE_TOKEN?.replace(/['"]/g, ''), // 🔒 安全清洗引號
  useCdn: false,
})

export async function GET() {
  try {
    const targetUrl = `${process.env.MEDUSA_BACKEND_URL}/store/product-categories`
    
    const rawKey = process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
    const cleanPublishableKey = rawKey.replace(/['"]/g, '').trim();

    if (!cleanPublishableKey) {
      throw new Error("環境變數完全未通電，請確保 .env.local 配置正確並已重啟服務。")
    }

    const medusaResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': cleanPublishableKey
      },
      cache: 'no-store'
    })
    
    if (!medusaResponse.ok) {
      const errorText = await medusaResponse.text()
      throw new Error(`Medusa 收銀台連線失敗: ${medusaResponse.statusText} (詳情: ${errorText})`)
    }

    const { product_categories } = await medusaResponse.json()
    let createdCount = 0
    let skippedCount = 0

    for (const category of product_categories) {
      const handle = category.handle // 例如 "matcha-bowls" 或 中文的 "杯子"
      const name = category.name

      // 🛡️ 【關鍵防禦線】：Sanity _id 不支援中文。
      // 我們使用 JavaScript 原生的 encodeURIComponent 將中文安全轉譯為純英文與數字組成的代碼（例如 "杯子" 變成 "%E6%9D%AF%E5%AD%90"）
      // 並且把百分比符號 % 替換成底線 _，確保符合 Sanity 最嚴格的 ID 規範！
      const safeIdSuffix = encodeURIComponent(handle).replace(/%/g, '_')
      const targetId = `page-content-${safeIdSuffix}`

      const existCheck = await sanityWriteClient.fetch(
        `*[_type == "pageContent" && _id == $targetId][0]`,
        { targetId }
      )

      if (!existCheck) {
        // 🧠 智慧型判斷大師屬性
        const isArtist = handle.includes('tom') || handle.includes('tagai') || handle.includes('artist') || handle.includes('ouyang')
        
        await sanityWriteClient.create({
          _type: 'pageContent',
          _id: targetId, // 🔒 物理主鍵鎖定
          categoryHandle: handle, // 這裡依然保留原本純淨的原始 Handle（如 "杯子" 或 "tom-ohyoung"），確保前台對賬無誤
          pageType: isArtist ? 'artist' : 'collection',
          title: {
            zh: name, // 中文名稱完美注入
            en: handle.replace('-', ' ').toUpperCase(),
          }
        })
        createdCount++
      } else {
        skippedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `甘木道自動對賬圓滿成功！`,
      details: {
        new_pages_created: createdCount,
        existing_pages_protected: skippedCount,
        total_medusa_categories_processed: product_categories.length
      }
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: `同步時不幸內爆: ${error.message}` 
    }, { status: 500 })
  }
}