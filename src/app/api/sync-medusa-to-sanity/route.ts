// 📁 路徑：src/app/api/sync-medusa-to-sanity/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

// 1. 初始化 Sanity 寫入客戶端
const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "qdbzil11",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: '2026-06-17',
  token: (process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN)?.replace(/['"]/g, ''), // 🔒 安全清洗引號
  useCdn: false, // 寫入和最新對賬必須關閉 CDN
})

export async function GET() {
  let medusaCategories: any[] = []
  let sanityPageContents: any[] = []
  let syncStatusMessage = ""
  let isSuccess = true
  let processedCount = 0

  try {
    // ---- 準備連線 Medusa ----
    const targetUrl = `${process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/product-categories`
    const rawKey = process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
    const cleanPublishableKey = rawKey.replace(/['"]/g, '').trim();

    if (!cleanPublishableKey) {
      throw new Error("環境變數完全未通電，請確保 .env 配置正確並已重啟服務。")
    }

    // ---- 第一部分：讀取 Medusa 全部產品分類 ----
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

    const data = await medusaResponse.json()
    medusaCategories = data.product_categories || []

    // ---- 第二部分：讀取與智慧寫入/更新 Sanity 數據庫 ----
    for (const category of medusaCategories) {
      const handle = category.handle // 例如 "matcha-bowls" 或 中文的 "杯子"
      const name = category.name

      // 🛡️ 【關鍵防禦線】：Sanity _id 不支援中文。
      const safeIdSuffix = encodeURIComponent(handle).replace(/%/g, '_')
      const targetId = `page-content-${safeIdSuffix}`

      // 🧠 智慧型判斷大師屬性（判斷是否為藝術家）
      const isArtist = handle.includes('tom') || handle.includes('tagai') || handle.includes('artist') || handle.includes('ouyang')
      
      // 🚀 【核心進化】：使用 createOrReplace 進行主鍵鎖定更新
      // 若 ID 不存在則創建；若 ID 已存在，則將 Medusa 最新修改的名稱等參數強行覆蓋更新，杜絕髒數據！
      await sanityWriteClient.createOrReplace({
        _type: 'pageContent',
        _id: targetId, // 🔒 物理主鍵鎖定
        categoryHandle: handle, // 保留純淨的原始 Handle，確保前台對賬無誤
        pageType: isArtist ? 'artist' : 'collection',
        title: {
          zh: name, // Medusa 分類名稱若有變更，此處會自動更新覆蓋
          en: handle.replace('-', ' ').toUpperCase(),
        }
      })
      processedCount++
    }

    syncStatusMessage = `甘木道自動對賬圓滿成功！已動態對齊/覆蓋更新 ${processedCount} 個分類的最新數據參數。`

  } catch (error: any) {
    isSuccess = false;
    syncStatusMessage = `同步時不幸內爆: ${error.message}`
  }

  // 重新讀取最新的 Sanity 資料用於右側面板展示
  try {
    sanityPageContents = await sanityWriteClient.fetch(
      `*[_type == "pageContent"]{_id, _type, categoryHandle, pageType, title}`
    )
  } catch (err: any) {
    syncStatusMessage += ` (注意: 渲染面板讀取 Sanity 失敗: ${err.message})`
  }

  // ---- 建立對賬可視化頁面 HTML ----
  const html = `
    <!DOCTYPE html>
    <html lang="zh-HK">
    <head>
      <meta charset="UTF-8">
      <title>甘木道資料庫 · Medusa 分類 ➔ Sanity 頁面對賬面板</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f7f6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 1300px; margin: 0 auto; }
        header { background: #1a1a1a; color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
        .status-box { background: ${isSuccess ? "#e3f9e5" : "#ffebe9"}; color: ${isSuccess ? "#1e4620" : "#b71c1c"}; padding: 15px; border-radius: 6px; margin-top: 15px; font-weight: bold; border: 1px solid ${isSuccess ? "#a1e5ab" : "#ffc1bd"}; line-height: 1.5; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .panel { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e0e0e0; }
        .panel h2 { margin-top: 0; border-bottom: 2px solid #ddd; padding-bottom: 10px; font-size: 18px; }
        .medusa-h2 { color: #7c3aed; border-bottom-color: #ddd6fe !important; }
        .sanity-h2 { color: #f43f5e; border-bottom-color: #fecdd3 !important; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
        th, td { text-align: left; padding: 12px 10px; border-bottom: 1px solid #eee; vertical-align: top; }
        th { background: #f9f9f9; font-weight: 600; color: #555; }
        .badge { display: inline-block; padding: 2px 6px; background: #f3f4f6; color: #1f2937; border-radius: 4px; font-size: 12px; font-family: monospace; border: 1px solid #e5e7eb; }
        .type-artist { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        .type-collection { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        small { display: block; color: #888; margin-top: 4px; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>小雞雞自動化對賬終端 v1.5 (智慧覆蓋版)</h1>
          <p style="margin: 5px 0 0 0; color: #999;">Medusa 產品分類 (Product Categories) ➔ Sanity 頁面內容 (pageContent) 雙向動態覆蓋同步</p>
          <div class="status-box">最新同步回饋：${syncStatusMessage}</div>
        </header>

        <div class="grid">
          <div class="panel">
            <h2 class="medusa-h2">第一部分：Medusa 原始分類列表 (${medusaCategories.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>分類名稱 (Name)</th>
                  <th>分類標籤 (Handle)</th>
                  <th>Medusa 系統 ID</th>
                </tr>
              </thead>
              <tbody>
                ${medusaCategories.map(c => `
                  <tr>
                    <td><strong>${c.name}</strong></td>
                    <td><span class="badge">${c.handle}</span></td>
                    <td><small>${c.id}</small></td>
                  </tr>
                `).join('')}
                ${medusaCategories.length === 0 ? '<tr><td colspan="3" style="text-align:center;color:#999;">Medusa 暫無分類數據或連線中斷</td></tr>' : ''}
              </tbody>
            </table>
          </div>

          <div class="panel">
            <h2 class="sanity-h2">第二部分：Sanity 數據庫動態 (${sanityPageContents.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Sanity 標題 (zh/en)</th>
                  <th>原始 Handle / 類型</th>
                  <th>Sanity 文檔 ID (_id)</th>
                </tr>
              </thead>
              <tbody>
                ${sanityPageContents.map(p => {
                  const isArtist = p.pageType === 'artist';
                  return `
                    <tr>
                      <td>
                        <strong>${p.title?.zh || '無中文名'}</strong>
                        <span style="display:block; color:#666; font-size:12px;">${p.title?.en || 'NO EN TITLE'}</span>
                      </td>
                      <td>
                        <span class="badge" style="margin-bottom:4px;">${p.categoryHandle || '未綁定'}</span>
                        <span class="badge ${isArtist ? 'type-artist' : 'type-collection'}">${p.pageType || '未分類'}</span>
                      </td>
                      <td><small>${p._id}</small></td>
                    </tr>
                  `;
                }).join('')}
                ${sanityPageContents.length === 0 ? '<tr><td colspan="3" style="text-align:center;color:#999;">Sanity 數據庫目前無 pageContent 數據</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}