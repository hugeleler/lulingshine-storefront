// 📁 路徑：src/sanity/schemaTypes/pageContent.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pageContent',
  title: '甘木道 · 頁面文化敘事大腦',
  type: 'document',
  fields: [
    defineField({
      name: 'categoryHandle',
      title: '精準對齊 Medusa 的分類 Handle',
      type: 'string',
      description: '【暗號鎖定】由 Next.js 自動化腳本從 Medusa 唯讀同步過來，請勿隨意修改，確保對賬。',
      readOnly: true, // 🔒 鎖死它，人肉不得修改，防止對不上賬
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
      name: 'title',
      title: '網頁主標題 (國際化多語言)',
      type: 'object',
      fields: [
        { name: 'en', title: '英文標題 (如: Bowl Matcha)', type: 'string' },
        { name: 'zh', title: '繁體中文標題 (如: 抹茶茶碗)', type: 'string' },
        { name: 'ja', title: '日文標題 (如: 抹茶碗の新作)', type: 'string' },
      ],
    }),
    defineField({
      name: 'subtitle',
      title: '網頁副標題 / 宣傳導語 (多語言)',
      type: 'object',
      fields: [
        { name: 'en', title: '英文副標題', type: 'string' },
        { name: 'zh', title: '繁體中文副標題', type: 'string' },
        { name: 'ja', title: '日文副標題', type: 'string' },
      ],
    }),
    defineField({
      name: 'description',
      title: '品牌核心故事 / 大師生平長文 (多語言)',
      description: '承載極具奢華調性與禪意的小說級別品牌敘事。',
      type: 'object',
      fields: [
        { name: 'en', title: '英文描述長文', type: 'text' },
        { name: 'zh', title: '繁體中文描述長文', type: 'text' },
        { name: 'ja', title: '日文描述長文', type: 'text' },
      ],
    }),
    
    // 💬 條件加載：【大師禪意對談】（只有當 pageType == 'artist' 時才在後台解鎖解凍！）
    defineField({
      name: 'dialogue',
      title: '甘木道 · 店主與大師禪意對談紀錄',
      description: '像蓋樓一樣，一行一行無限添加店主與大師一問一答的深度對話。',
      type: 'array',
      hidden: ({ document }) => document?.pageType !== 'artist', // 💡 天才開關：不是大師頁自動隱藏，絕不眼亂！
      of: [
        {
          type: 'object',
          name: 'dialogueLine',
          title: '對話行',
          fields: [
            {
              name: 'speaker',
              title: '發言人',
              type: 'string',
              options: {
                list: [
                  { title: '甘木道 店主（西村一昧）', value: 'shopkeeper' },
                  { title: '大師本人', value: 'artist' },
                ],
                layout: 'radio',
              },
            },
            {
              name: 'content',
              title: '對話文本 (多語言)',
              type: 'object',
              fields: [
                { name: 'zh', title: '繁體中文', type: 'text' },
                { name: 'ja', title: '日文', type: 'text' },
              ],
            },
          ],
          preview: {
            select: { speaker: 'speaker', zh: 'content.zh', ja: 'content.ja' },
            prepare(selection) {
              const { speaker, zh, ja } = selection
              const role = speaker === 'shopkeeper' ? '【店主西村】' : '【大師】'
              return { title: `${role} ${zh || ja || '未填寫文本'}` }
            },
          },
        },
      ],
    }),

    // 🌟 條件加載：【Why Choose Us 四大優勢】（只有當 pageType == 'collection' 時才顯示！）
    defineField({
      name: 'features',
      title: '核心優勢特點列表 (Why Choose Our Handcrafted Bowls)',
      description: '完美對應網頁上半部分用來渲染四大宣傳板塊的陣列。',
      type: 'array',
      hidden: ({ document }) => document?.pageType !== 'collection', // 💡 天才開關：大師頁自動隱藏！
      of: [
        {
          type: 'object',
          name: 'featureItem',
          fields: [
            {
              name: 'featureTitle',
              title: '特點小標題 (多語言)',
              type: 'object',
              fields: [
                { name: 'en', title: '英文小標題', type: 'string' },
                { name: 'zh', title: '繁體中文小標題', type: 'string' },
              ],
            },
            {
              name: 'featureDesc',
              title: '特點細節描述 (多語言)',
              type: 'object',
              fields: [
                { name: 'en', title: '英文細節', type: 'text' },
                { name: 'zh', title: '繁體中文細節', type: 'text' },
              ],
            },
          ],
          preview: {
            select: { titleZh: 'featureTitle.zh', titleEn: 'featureTitle.en' },
            prepare(selection) {
              const { titleZh, titleEn } = selection
              return { title: titleZh || titleEn || '未命名優勢特點' }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { handle: 'categoryHandle', type: 'pageType', titleZh: 'title.zh' },
    prepare(selection) {
      const { handle, type, titleZh } = selection
      const emoji = type === 'artist' ? '👨‍🎨' : '🍵'
      return {
        title: `${emoji} 暗號: ${handle}`,
        subtitle: titleZh ? `已填中文名: ${titleZh}` : '⏳ 故事待注入...',
      }
    },
  },
})