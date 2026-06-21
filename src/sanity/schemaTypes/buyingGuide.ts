// 📁 路徑：src/sanity/schemaTypes/buyingGuide.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'buyingGuide',
  title: '6. 購買指南 (Buying Guide)',
  type: 'document',
  fields: [
    defineField({ name: 'sectionName', title: '指南章節名稱 (如: 支付方式)', type: 'string' }),
    defineField({
      name: 'guideContent',
      title: '指南細則正文 (五國語言)',
      type: 'localizedText',
    })
  ]
})