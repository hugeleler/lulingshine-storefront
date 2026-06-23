// 📁 路徑：src/app/api/sync-medusa-to-sanity/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "qdbzil11",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: '2026-06-20',
  token: (process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN)?.replace(/['"]/g, ''),
  useCdn: false,
})

export async function GET() {
  const encoder = new TextEncoder()
  const customStream = new TransformStream()
  const writer = customStream.writable.getWriter()

  const streamWrite = async (htmlText: string) => {
    await writer.write(encoder.encode(htmlText))
  }

  (async () => {
    try {
      // 1. 鋪設 HTML 基礎地基（數字全動態監聽）
      await streamWrite(`
        <!DOCTYPE html>
        <html lang="zh-HK">
        <head>
          <meta charset="UTF-8">
          <title>廬陵昱西資料庫 · 雙軌同步進度對賬終端</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f4f7f6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 1400px; margin: 0 auto; }
            header { background: #1a1a1a; color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
            .terminal { background: #0f172a; color: #38bdf8; font-family: monospace; padding: 15px; border-radius: 6px; margin-top: 15px; font-size: 13px; max-height: 180px; overflow-y: auto; border: 1px solid #334155; }
            .log-line { margin: 4px 0; border-bottom: 1px dashed #1e293b; padding-bottom: 4px; line-height: 1.4; }
            .log-error { color: #f43f5e; font-weight: bold; }
            .log-success { color: #34d399; font-weight: bold; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
            .panel { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e0e0e0; }
            .panel h2 { margin-top: 0; padding-bottom: 10px; font-size: 18px; border-bottom: 2px solid #ddd; display: flex; justify-content: space-between; align-items: center; }
            .medusa-h2 { color: #7c3aed; border-bottom-color: #ddd6fe!important; }
            .sanity-h2 { color: #f43f5e; border-bottom-color: #fecdd3!important; }
            .progress-badge { font-family: monospace; font-size: 14px; padding: 2px 8px; border-radius: 4px; color: #fff; font-weight: bold; }
            .medusa-p { background: #7c3aed; }
            .sanity-p { background: #f43f5e; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th, td { text-align: left; padding: 12px 10px; border-bottom: 1px solid #eee; vertical-align: top; }
            th { background: #f9f9f9; color: #555; font-weight: 600; }
            .badge { display: inline-block; padding: 2px 6px; background: #f3f4f6; color: #1f2937; border-radius: 4px; font-family: monospace; font-size: 12px; border: 1px solid #e5e7eb; }
            .type-artist { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
            .type-collection { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
            small { display: block; color: #888; margin-top: 4px; font-family: monospace; }
          </style>
          <script>
            function scrollLog() {
              const t = document.getElementById('term');
              if(t) t.scrollTop = t.scrollHeight;
            }
            // 🧠 完美修復：精確指哪打哪，只改括號裡面的數字，總數全自動化讀取
            function updateLiveProgress(current, total) {
              const displayHtml = "[" + current + "/" + total + "]";
              document.getElementById('medusa-count').innerText = displayHtml;
              document.getElementById('sanity-count').innerText = displayHtml;
            }
          </script>
        </head>
        <body>
          <div class="container">
            <header>
              <h1>廬陵昱西自動化對賬終端 v4.3 (全動態條目讀取版)</h1>
              <p style="margin: 5px 0 0 0; color: #999;">數據流暢通，等待讀取數據庫真實條目數...</p>
              <div id="term" class="terminal">
                <div style="color: #94a3b8; border-bottom: 1px solid #334155; padding-bottom: 5px; margin-bottom: 8px; font-weight: bold;">📊 實時連線進度診斷 (Stream Logs)</div>
                <div class="log-line">🚀 數據管道已全線通電，等待 Medusa 數據庫響應...</div>
              </div>
            </header>

            <div class="grid">
              <div class="panel">
                <h2 class="medusa-h2">左側線：Medusa 原始分類列表 <span id="medusa-count" class="progress-badge medusa-p">[0/...]</span></h2>
                <table id="medusa-table">
                  <thead><tr><th>分類名稱 (Name)</th><th>分類標籤 (Handle)</th></tr></thead>
                  <tbody></tbody>
                </table>
              </div>
              <div class="panel">
                <h2 class="sanity-h2">右側線：Sanity 智慧寫入狀態 <span id="sanity-count" class="progress-badge sanity-p">[0/...]</span></h2>
                <table id="sanity-table">
                  <thead><tr><th>Sanity 標題內容</th><th>類型 / 數據庫 ID (_id)</th></tr></thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
      `)

      // 2. 實時從數據庫讀取真實條目總數
      const targetUrl = `${process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/product-categories`
      const rawKey = process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
      const cleanPublishableKey = rawKey.replace(/['"]/g, '').trim();

      if (!cleanPublishableKey) {
        throw new Error("環境變數完全未通電，請確保 .env 配置正確並已重啟服務。")
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

      const data = await medusaResponse.json()
      const medusaCategories = data.product_categories || []
      
      // 🎯 這裡！實時讀取出來的總數，不論是 49、50 還是 100，交給變量自動接管！
      const totalCount = medusaCategories.length
      
      await streamWrite(`<script>
        document.getElementById('term').insertAdjacentHTML('beforeend', '<div class="log-line log-success">✅ Medusa 連線成功！數據庫實時讀取到共計 ${totalCount} 個產品分類。</div>');
        // 初始同步一下總數看板，讓遊客進來就能看到 [0/實際總數]
        updateLiveProgress(0, ${totalCount});
        scrollLog();
      </script>`)

      // 3. 實時聯動流水線
      let count = 0
      for (const category of medusaCategories) {
        count++
        const handle = category.handle 
        const name = category.name

        // A. 實時渲染左側
        const leftRowHtml = `<tr><td><strong>${name}</strong></td><td><span class="badge">${handle}</span></td></tr>`.replace(/'/g, "\\'")
        await streamWrite(`<script>
          updateLiveProgress(${count}, ${totalCount}); 
          document.getElementById('medusa-table').getElementsByTagName('tbody')[0].insertAdjacentHTML('beforeend', '${leftRowHtml}');
          document.getElementById('term').insertAdjacentHTML('beforeend', '<div class="log-line">⏳ [${count}/${totalCount}] 正在加載 ➔ <strong>${name}</strong>...</div>');
          scrollLog();
        </script>`)

        // B. 智慧同步到 Sanity
        const safeIdSuffix = encodeURIComponent(handle).replace(/%/g, '_')
        const targetId = `page-content-${safeIdSuffix}`
        const isArtist = handle.startsWith('art-')
        
        await sanityWriteClient.createOrReplace({
          _type: 'pageContent',
          _id: targetId, 
          categoryHandle: handle,
          pageType: isArtist ? 'artist' : 'collection',
          title: { zh_HK: name, zh_CN: name, en: handle.toUpperCase().replace(/-/g, ' '), ja: "", ko: "" }
        })

        // C. 實時渲染右側
        const rightRowHtml = `<tr><td><strong>${name}</strong><small>${handle.toUpperCase()}</small></td><td><span class="badge ${isArtist ? 'type-artist' : 'type-collection'}">${isArtist ? 'artist' : 'collection'}</span><small>${targetId}</small></td></tr>`.replace(/'/g, "\\'")
        await streamWrite(`<script>
          document.getElementById('sanity-table').getElementsByTagName('tbody')[0].insertAdjacentHTML('beforeend', '${rightRowHtml}');
          document.getElementById('term').insertAdjacentHTML('beforeend', '<div class="log-line log-success">   ➔ 🎉 Sanity 數據庫寫入成功！</div>');
          scrollLog();
        </script>`)

        await new Promise(resolve => setTimeout(resolve, 40))
      }

      await streamWrite(`<script>
        document.getElementById('term').insertAdjacentHTML('beforeend', '<div class="log-line log-success">🎉 報告馬克冰老大！全店 ${totalCount} 個大類已全線動態對齊、完美著陸！</div>');
        scrollLog();
      </script>`)

    } catch (error: any) {
      let rootCause = error.message;
      if (error.cause) rootCause += ` | 訂正誘因: ${error.cause.message || error.cause}`;
      if (error.code) rootCause += ` | 錯誤代碼: ${error.code}`;

      const safeErrorMsg = rootCause.replace(/'/g, "\\'").replace(/"/g, '\\"')
      await streamWrite(`<script>
        document.getElementById('term').insertAdjacentHTML('beforeend', '<div class="log-line log-error">❌ 逐條推進中止，致命內爆: ${safeErrorMsg}</div>');
        scrollLog();
      </script>`)
    } finally {
      await streamWrite(`</body></html>`)
      writer.close()
    }
  })()

  return new NextResponse(customStream.readable, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache, no-transform',
    },
  })
}