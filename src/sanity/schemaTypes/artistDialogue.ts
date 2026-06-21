// 📁 路徑：src/sanity/schemaTypes/artistDialogue.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'artistDialogue',
  title: '4. 對話藝術家 (Artist Dialogue)',
  type: 'document',
  fields: [
    defineField({
      name: 'interviewee',
      title: '受訪大師姓名',
      type: 'string'
    }),
    defineField({
      name: 'slug',
      title: '訪談網址路徑 (Slug)',
      type: 'slug',
      options: { source: 'interviewee', maxLength: 96 }
    }),
    defineField({
      name: 'dialogueContent',
      title: '對談深度正文 (五國語言圖文混排)',
      type: 'localizedText',
    })
  ]
})