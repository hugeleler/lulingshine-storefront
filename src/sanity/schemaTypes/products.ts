// 📁 路徑：src/sanity/schemaTypes/products.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pageContent', 
  title: '2. 產品 (Products)', 
  type: 'document',
  fields: [
    defineField({
      name: 'categoryHandle',
      title: '精準對齊 Medusa 的分類 Handle',
      type: 'string',
      description: '【暗號鎖定】由 Next.js 自動化腳本唯讀同步，確保對賬。',
      readOnly: true, 
    }),
    defineField({
      name: 'pageType',
      title: '頁面屬性',
      type: 'string',
      options: {
        list: [
          { title: '🍵 商品類別頁 (如：茶碗、花器)', value: 'collection' },
          { title: '👨‍🎨 大師藝術頁 (如：多賀井正夫、歐陽濤)', value: 'artist' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'layoutStyle',
      title: '🎨 產品展廳視覺美工模板',
      type: 'string',
      options: {
        list: [
          { title: '🍵 1.0 禪意黑瓷風 (Zen Dark Ceramic)', value: 'product_zen' },
          { title: '🏛️ 1.0 明亮極簡風 (Minimalist White)', value: 'product_clean' },
          { title: '🎄 2026 節日策展風 (Holiday Curated)', value: 'product_holiday' }
        ]
      },
      initialValue: 'product_zen'
    }),
    defineField({
      name: 'title',
      title: '網頁主標題 (五國語言)',
      type: 'localizedString',
    }),
    defineField({
      name: 'subtitle',
      title: '網頁副標題 / 宣傳導語 (五國語言)',
      type: 'localizedString',
    }),
    defineField({
      name: 'description',
      title: '品牌核心故事 / 大師生平長文 (五國語言)',
      type: 'localizedString',
    }),
    defineField({
      name: 'dialogue',
      title: '廬陵昱西 · 店主與大師禪意對談紀錄',
      type: 'array',
      hidden: ({ document }) => document?.pageType !== 'artist',
      of: [
        {
          type: 'object',
          name: 'dialogueLine',
          fields: [
            {
              name: 'speaker',
              title: '發言人',
              type: 'string',
              options: {
                list: [
                  { title: '廬陵昱西 店主', value: 'shopkeeper' },
                  { title: '大師本人', value: 'artist' },
                ],
                layout: 'radio',
              },
            },
            {
              name: 'content',
              title: '對話文本 (五國語言)',
              type: 'localizedString',
            },
          ],
          preview: {
            select: { speaker: 'speaker', zh: 'content.zh_HK', ja: 'content.ja' },
            prepare(selection) {
              const { speaker, zh, ja } = selection
              const role = speaker === 'shopkeeper' ? '【店主】' : '【大師】'
              return { title: `${role} ${zh || ja || '未填寫文本'}` }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'features',
      title: '核心優勢特點列表',
      type: 'array',
      hidden: ({ document }) => document?.pageType !== 'collection',
      of: [
        {
          type: 'object',
          name: 'featureItem',
          fields: [
            { name: 'featureTitle', title: '特點小標題 (五國語言)', type: 'localizedString' },
            { name: 'featureDesc', title: '特點細節描述 (五國語言)', type: 'localizedString' },
          ],
          preview: {
            select: { title: 'featureTitle.zh_HK' },
            prepare({ title }) { return { title: title || '未命名優勢特點' } },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { handle: 'categoryHandle', type: 'pageType', titleZh: 'title.zh_HK' },
    prepare(selection) {
      const { handle, type, titleZh } = selection || {}
      const emoji = type === 'artist' ? '👨‍🎨' : type === 'collection' ? '🍵' : '⏳'
      return {
        title: `${emoji} 暗號: ${handle || '新條目建立中...'}`,
        subtitle: titleZh ? `已填繁中名: ${titleZh}` : '⏳ 故事待注入...',
      }
    },
  },
})