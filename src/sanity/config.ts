// 📁 路徑：src/sanity/config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'
import { projectId, dataset } from './env'
import { medusaStructure } from './schemaTypes/medusaStructure' // 🚀 引進 8 號獨立選單模組

const isClient = typeof window !== 'undefined'
const currentPath = isClient ? window.location.pathname : ''
const dynamicBasePath = currentPath.includes('/studio') 
  ? currentPath.split('/studio')[0] + '/studio' 
  : '/studio'

export const sanityConfig = defineConfig({
  name: 'gamido-art-brain',
  title: '廬陵昱西磁器場後台',
  basePath: dynamicBasePath, 

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            ...S.documentTypeListItems(), // 平鋪正常的 1 到 7 號數據選單
            medusaStructure(S)            // 🎯 接上獨立模組化的 8 號選單
          ])
    })
  ],

  schema: {
    types: schemaTypes, // 100% 乾淨的 1~7 號陣列
  },

  document: {
    actions: (prev, context) => {
      if (!prev || !Array.isArray(prev)) {
        return [];
      }
      return prev;
    }
  }
})