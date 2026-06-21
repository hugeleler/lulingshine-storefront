// 📁 路徑：src/sanity/schemaTypes/common/localizedString.ts
import { defineType, defineField } from 'sanity'

export const localizedString = defineType({
  title: '五國語言精準字串',
  name: 'localizedString',
  type: 'object',
  fieldsets: [
    { name: 'languages', title: '全球市場語系配置', options: { collapsible: true, collapsed: false } }
  ],
  fields: [
    defineField({ title: '繁體中文 (TC)', name: 'zh_HK', type: 'string', fieldset: 'languages' }),
    defineField({ title: '簡體中文 (SC)', name: 'zh_CN', type: 'string', fieldset: 'languages' }),
    defineField({ title: '日文 (JA)', name: 'ja', type: 'string', fieldset: 'languages' }),
    defineField({ title: '韓文 (KO)', name: 'ko', type: 'string', fieldset: 'languages' }),
    defineField({ title: '英文 (EN)', name: 'en', type: 'string', fieldset: 'languages' }),
  ]
})