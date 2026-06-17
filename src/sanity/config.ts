// 📁 路徑：src/sanity/config.ts
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemaTypes'
import { projectId, dataset } from './env'

// 💡 2026 高階架構師魔法：動態檢測目前瀏覽器網址列裡是不是帶有 /hk-zh 等多語言前綴
const isClient = typeof window !== 'undefined'
const currentPath = isClient ? window.location.pathname : ''
// 如果網址裡包含 /studio，我們就把包含多語言前綴在內的所有前方路徑（例如 /hk-zh/studio）完整抓下來當作基地
const dynamicBasePath = currentPath.includes('/studio') 
  ? currentPath.split('/studio')[0] + '/studio' 
  : '/studio'

export const sanityConfig = defineConfig({
  name: 'gamido-art-brain',
  title: '甘木道國際藝術數位畫廊後台',
  
  // 🎯 關鍵修正：讓後台基地自動適應 Medusa 的跨境多語言網址！
  basePath: dynamicBasePath, 

  projectId,
  dataset,

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
})