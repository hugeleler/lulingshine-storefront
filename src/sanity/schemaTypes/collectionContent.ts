// 📁 路徑：src/sanity/schemaTypes/collectionContent.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'collectionContent',
  title: '甘木道 · 分類頁品牌文案',
  type: 'document',
  fields: [
    defineField({
      name: 'collectionHandle',
      title: '精準對齊 Medusa 分類 Handle',
      type: 'string',
      description: '【關鍵對賬暗號】必須與 Medusa 後台分類的 handle 100% 一致。例如茶碗填：matcha-bowls，酒器填：sake-ware。',
      validation: (Rule) => Rule.required().error('分類 Handle 是必填對賬項'),
    }),
    defineField({
      name: 'title',
      title: '分類頁大標題 (多語言)',
      description: '例如：Bowl Matcha 或 抹茶碗の新作',
      type: 'object',
      fields: [
        { name: 'en', title: '英文標題', type: 'string' },
        { name: 'zh', title: '繁體中文標題', type: 'string' },
        { name: 'ja', title: '日文標題', type: 'string' },
      ],
    }),
    defineField({
      name: 'subtitle',
      title: '宣傳副標題 (多語言)',
      description: '例如：Elevate Your Tea Ceremony...',
      type: 'object',
      fields: [
        { name: 'en', title: '英文副標題', type: 'string' },
        { name: 'zh', title: '繁體中文副標題', type: 'string' },
        { name: 'ja', title: '日文副標題', type: 'string' },
      ],
    }),
    defineField({
      name: 'description',
      title: '核心宣傳長文段落 (多語言)',
      description: '承載大段極具品牌調性與禪意的故事敘事。',
      type: 'object',
      fields: [
        { name: 'en', title: '英文描述長文', type: 'text' },
        { name: 'zh', title: '繁體中文描述長文', type: 'text' },
        { name: 'ja', title: '日文描述長文', type: 'text' },
      ],
    }),
    // 🌟 【Why Choose Our...】核心優勢特點動態陣列
    defineField({
      name: 'features',
      title: '核心優勢特點列表 (Why Choose Us)',
      description: '可以動態添加、調整順序的特點區塊。',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'featureItem',
          title: '特點欄目',
          fields: [
            {
              name: 'featureTitle',
              title: '特點小標題 (多語言)',
              type: 'object',
              fields: [
                { name: 'en', title: '英文小標題', type: 'string' },
                { name: 'zh', title: '繁體中文小標題', type: 'string' },
                { name: 'ja', title: '日文小標題', type: 'string' },
              ],
            },
            {
              name: 'featureDesc',
              title: '特點細節描述 (多語言)',
              type: 'object',
              fields: [
                { name: 'en', title: '英文描述', type: 'text' },
                { name: 'zh', title: '繁體中文描述', type: 'text' },
                { name: 'ja', title: '日文描述', type: 'text' },
              ],
            },
          ],
          preview: {
            select: {
              titleEn: 'featureTitle.en',
              titleZh: 'featureTitle.zh',
            },
            prepare(selection) {
              const { titleEn, titleZh } = selection
              return { title: titleZh || titleEn || '未命名優勢特點' }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      handle: 'collectionContent',
      titleZh: 'title.zh',
      titleEn: 'title.en',
    },
    prepare(selection) {
      const { handle, titleZh, titleEn } = selection
      return {
        title: `分類文案: ${titleZh || titleEn || '未命名'}`,
        subtitle: `對齊暗號: ${handle || '未分配'}`,
      }
    },
  },
})