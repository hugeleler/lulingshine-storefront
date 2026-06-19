// 📁 路徑：src/sanity/schemas/worksByArtist.ts
export default {
  name: 'worksByArtist',
  title: '3. 藝術家作品 (Works by Artist)',
  type: 'document',
  fields: [
    {
      name: 'artistName',
      title: '藝術家名稱',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文名', type: 'string' },
        { name: 'ja', title: '日文名', type: 'string' },
        { name: 'en', title: '英文名', type: 'string' }
      ]
    },
    {
      name: 'slug',
      title: '網址唯一的 Handle (Slug)',
      type: 'slug',
      options: { source: 'artistName.en', maxLength: 96 }
    },
    {
      name: 'biography',
      title: '藝術家生平履歷、窯口與工藝特色',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文介紹', type: 'array', of: [{ type: 'block' }] },
        { name: 'en', title: '英文介紹', type: 'array', of: [{ type: 'block' }] }
      ]
    }
  ]
}