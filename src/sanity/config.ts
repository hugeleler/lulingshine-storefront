// 📁 路徑：src/sanity/config.ts
import { defineConfig } from 'sanity'
// 🚀 使用最新版相容結構插件，拋棄舊版 deskTool
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'
import { projectId, dataset } from './env'

// 💡 動態檢測目前瀏覽器網址列裡是不是帶有 /hk-zh 等多語言前綴
const isClient = typeof window !== 'undefined'
const currentPath = isClient ? window.location.pathname : ''
const dynamicBasePath = currentPath.includes('/studio') 
  ? currentPath.split('/studio')[0] + '/studio' 
  : '/studio'

export const sanityConfig = defineConfig({
  name: 'gamido-art-brain',
  title: '甘木道國際藝術數位畫廊後台',
  
  // 🎯 讓後台基地自動適應 Medusa 的跨境多語言網址！
  basePath: dynamicBasePath, 

  projectId,
  dataset,

  // 🚀 核心載入最新版結構插件
  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },

  // 🎯 針對讀寫資料庫與動作狀態初始化的強效防禦
  document: {
    actions: (prev, context) => {
      // 🔥 核心保護：如果 prev 動作陣列在剛點擊、資料庫連線中時為空或未定義，強制返回空陣列，阻止 useMemo 崩潰
      if (!prev || !Array.isArray(prev)) {
        return [];
      }
      return prev;
    }
  }
})