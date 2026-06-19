// 📁 路徑：src/sanity/schemas/buyingGuide.ts
export default {
  name: 'buyingGuide',
  title: '6. 購買指南 (Buying Guide)',
  type: 'document',
  fields: [
    { name: 'sectionName', title: '指南章節名稱 (如: 支付方式 / 器皿保養細則)', type: 'string' },
    {
      name: 'guideContent',
      title: '指南細則正文',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文指南', type: 'array', of: [{ type: 'block' }] },
        { name: 'en', title: '英文指南', type: 'array', of: [{ type: 'block' }] }
      ]
    }
  ]
}