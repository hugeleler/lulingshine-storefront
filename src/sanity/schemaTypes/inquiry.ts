// 📁 路徑：src/sanity/schemaTypes/inquiry.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'inquiry',
  title: '7. 客戶問詢與商務政策 (Inquiry & Policies)',
  type: 'document',
  fields: [
    defineField({ 
      name: 'policyType', 
      title: '政策條款與問詢分類', 
      type: 'string',
      options: {
        list: [
          { title: '客戶問詢說明 (Inquiries Info)', value: 'inquiries' },
          { title: '隱私政策 (Privacy Policy)', value: 'privacy' },
          { title: '服務條款 (Terms of Service)', value: 'terms' },
          { title: '退換貨政策 (Refund Policy)', value: 'refund' },
          { title: '運輸政策 (Shipping Policy)', value: 'shipping' }
        ]
      }
    }),
    defineField({
      name: 'content',
      title: '條款具體細則正文 (五國語言)',
      type: 'localizedText',
    })
  ]
})