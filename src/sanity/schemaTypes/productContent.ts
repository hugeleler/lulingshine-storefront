// 📁 路徑：src/sanity/schemaTypes/productContent.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'productContent',
  title: '甘木道 · 作品藝術敘事擴充',
  type: 'document',
  fields: [
    defineField({
      name: 'productHandle',
      title: '精準對齊 Medusa 商品 Handle',
      type: 'string',
      description: '【關鍵對賬暗號】必須與 Medusa 後台該件作品的 handle 100% 一致（如 oohira-black-chawan）。',
      validation: (Rule) => Rule.required().error('Medusa 商品 Handle 是必填對賬項'),
    }),
    // 🔗 數據庫底層指針：物理綁定大師
    defineField({
      name: 'artistRef',
      title: '綁定所屬陶藝大師',
      type: 'reference',
      to: [{ type: 'artist' }],
      description: '點擊直接選擇這件作品是哪位大師燒製的，數據庫會自動將兩者焊接在一起。',
      validation: (Rule) => Rule.required().error('必須綁定一位大師'),
    }),
    // 🍵 復刻《茶碗.html》的高端藝術鑑賞三維度
    defineField({
      name: 'artAppreciation',
      title: '作品最高藝術鑑賞維度 (多語言)',
      type: 'object',
      fields: [
        {
          name: 'formBeauty',
          title: '造形美 (外形、線條與空間體感)',
          type: 'object',
          fields: [
            { name: 'zh', title: '繁體中文', type: 'text' },
            { name: 'ja', title: '日文', type: 'text' },
          ],
        },
        {
          name: 'glazeTexture',
          title: '釉調 (釉色、肌理變化與窯變特徵)',
          type: 'object',
          fields: [
            { name: 'zh', title: '繁體中文', type: 'text' },
            { name: 'ja', title: '日文', type: 'text' },
          ],
        },
        {
          name: 'tactileFeel',
          title: '手取り (上手持握的重量感與上手觸感)',
          type: 'object',
          fields: [
            { name: 'zh', title: '繁體中文', type: 'text' },
            { name: 'ja', title: '日文', type: 'text' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      handle: 'productHandle',
      artistName: 'artistRef.name',
    },
    prepare(selection) {
      const { handle, artistName } = selection
      return {
        title: `作品暗號: ${handle || '未命名'}`,
        subtitle: artistName ? `所属大師: ${artistName}` : '未綁定大師',
      }
    },
  },
})