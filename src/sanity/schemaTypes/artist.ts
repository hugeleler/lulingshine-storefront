// 📁 路徑：src/sanity/schemaTypes/artist.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'artist',
  title: '甘木道 · 陶藝大師檔案',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '大師姓名 (如：歐陽濤 / 多賀井正夫)',
      type: 'string',
      validation: (Rule) => Rule.required().error('大師姓名是必填項'),
    }),
    defineField({
      name: 'handle',
      title: '跨境商務識別碼 (Handle / Slug)',
      type: 'slug',
      description: '【關鍵暗號】網址的一部分（如 yuxi-bowl 或 tagai-masao），未來前台會拿著 Medusa 的商品標籤來跟它對賬。',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('識別碼是必填項'),
    }),
    defineField({
      name: 'avatar',
      title: '大師頭像 / 窯前工作特寫照',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'biography',
      title: '大師核心簡介 (國際化多語言)',
      type: 'object',
      fields: [
        { name: 'zh', title: '繁體中文 (ZH)', type: 'text' },
        { name: 'en', title: '英文 (EN)', type: 'text' },
        { name: 'ja', title: '日文 (JA)', type: 'text' },
      ],
    }),
    // 💬 復刻《多賀井正夫様との対談》的無限動態對談陣列
    defineField({
      name: 'dialogue',
      title: '甘木道 · 禪意對談紀錄欄目',
      description: '在這裡可以像蓋樓一樣，無限添加店主與大師的一問一答。',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'dialogueLine',
          title: '對話內容行',
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
              title: '對話文案 (多語言)',
              type: 'object',
              fields: [
                { name: 'zh', title: '繁體中文', type: 'text' },
                { name: 'en', title: '英文', type: 'text' },
                { name: 'ja', title: '日文', type: 'text' },
              ],
            },
          ],
          preview: {
            select: {
              speaker: 'speaker',
              zh: 'content.zh',
              ja: 'content.ja',
            },
            prepare(selection) {
              const { speaker, zh, ja } = selection
              const role = speaker === 'shopkeeper' ? '【店主西村】' : '【大師】'
              return {
                title: `${role} ${zh || ja || '未填寫文本'}`,
              }
            },
          },
        },
      ],
    }),
  ],
})