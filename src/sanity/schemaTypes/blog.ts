// 📁 路徑：src/sanity/schemaTypes/blog.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blog',
  title: '5. 博客文章 (Blog)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '文章標題 (五國語言)',
      type: 'localizedString',
    }),
    defineField({
      name: 'slug',
      title: '文章別名 (Slug)',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 }
    }),
    defineField({
      name: 'blogType',
      title: '博客分類標籤',
      type: 'string',
      options: {
        list: [
          { title: '一般藝術博客 (Blog)', value: 'blog' },
          { title: '安全包裝與物流美學 (Packing)', value: 'packing' }
        ]
      }
    }),
    defineField({
      name: 'content',
      title: '文章正文 (五國語言圖文混排)',
      type: 'localizedText',
    })
  ],
  preview: {
    select: { title: 'title.zh_HK', subtitle: 'blogType' },
    prepare({ title, subtitle }) {
      return { title: title || '未命名文章', subtitle: `分類: ${subtitle}` }
    }
  }
})