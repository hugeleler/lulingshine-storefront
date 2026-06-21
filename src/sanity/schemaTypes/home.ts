// 📁 路徑：src/sanity/schemaTypes/home.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'home',
  title: '1. 家 (Home Page)',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: '首頁主標題 (五國語言)',
      type: 'localizedString',
    }),
    defineField({
      name: 'introduction',
      title: '廬陵昱西引言 (五國語言)',
      type: 'localizedString',
    }),
    defineField({
      name: 'ownerSection',
      title: '店主介紹與心路歷程 (Introducing the Owner)',
      type: 'object',
      fields: [
        { name: 'ownerName', title: '店主姓名', type: 'string' },
        { name: 'story', title: '故事與 Zen/Wabi-Sabi 精神 (五國語言)', type: 'localizedText' }
      ]
    }) // 👈 這裡補上了正確的右括號 )，大功告成！
  ]
})