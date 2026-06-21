// 📁 路徑：src/sanity/schemaTypes/common/localizedText.ts
import { defineType, defineField } from 'sanity'

export const localizedText = defineType({
  title: '五國語言策展富文本',
  name: 'localizedText',
  type: 'object',
  fieldsets: [
    { name: 'languages', title: '全球深度敘事語系', options: { collapsible: true, collapsed: false } }
  ],
  fields: [
    defineField({ title: '繁體中文正文', name: 'zh_HK', type: 'array', of: [{ type: 'block' }, { type: 'image' }], fieldset: 'languages' }),
    defineField({ title: '簡體中文正文', name: 'zh_CN', type: 'array', of: [{ type: 'block' }, { type: 'image' }], fieldset: 'languages' }),
    defineField({ title: '日文正文', name: 'ja', type: 'array', of: [{ type: 'block' }, { type: 'image' }], fieldset: 'languages' }),
    defineField({ title: '韓文正文', name: 'ko', type: 'array', of: [{ type: 'block' }, { type: 'image' }], fieldset: 'languages' }),
    defineField({ title: '英文正文', name: 'en', type: 'array', of: [{ type: 'block' }, { type: 'image' }], fieldset: 'languages' }),
  ]
})