// 📁 路徑：src/sanity/schemas/blog.ts
export default {
  name: 'blog',
  title: '5. 博客文章 (Blog)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '文章標題',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文標題', type: 'string' },
        { name: 'en', title: '英文標題', type: 'string' }
      ]
    },
    {
      name: 'slug',
      title: '文章別名 (Slug)',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 }
    },
    {
      name: 'blogType',
      title: '博客分類標籤',
      type: 'string',
      options: {
        list: [
          { title: '一般藝術博客 (Blog)', value: 'blog' },
          { title: '安全包裝與物流美學 (Packing)', value: 'packing' }
        ]
      }
    },
    {
      name: 'content',
      title: '文章正文',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文內容', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
        { name: 'en', title: '英文內容', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }
      ]
    }
  ]
}