// 📁 路徑：src/sanity/schemaTypes/worksByArtist.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'worksByArtist',
  title: '3. 藝術家作品 (Works by Artist)',
  type: 'document',
  fields: [
    defineField({
      name: 'artistName',
      title: '藝術家全名 (五國語言矩陣)',
      type: 'localizedString',
    }),
    defineField({
      name: 'slug',
      title: '網址唯一的 Handle (Slug)',
      type: 'slug',
      options: { source: 'artistName.zh_HK', maxLength: 96 }
    }),
    defineField({
      name: 'layoutStyle',
      title: '🎨 策展空間視覺美工模板 (Visual Style)',
      type: 'string',
      options: {
        list: [
          { title: '🍵 1.0 傳統日式侘寂風 (Wabi-Sabi Classic)', value: 'wabi_v1' },
          { title: '🏛️ 1.0 當代美術館風 (Modern Gallery)', value: 'modern_v1' },
          { title: '🔥 1.0 柴燒全景震撼風 (Panoramic Fire)', value: 'panoramic_v1' },
          { title: '🎄 2026 聖誕限時特展風 (Christmas Limited)', value: 'christmas_v2' },
        ],
        layout: 'radio',
      },
      initialValue: 'wabi_v1',
    }),
    defineField({
      name: 'biography',
      title: '大師生平履歷、窑口心法與工藝特色 (五國語言)',
      type: 'localizedText',
    })
  ],
  preview: {
    select: { title: 'artistName.zh_HK', subtitle: 'layoutStyle' },
    prepare(selection) {
      const { title, subtitle } = selection
      return { title: title || '未命名藝術家', subtitle: `當前套用模板: ${subtitle || '未指定'}` }
    }
  }
})