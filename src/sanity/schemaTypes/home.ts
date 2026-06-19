// 📁 路徑：src/sanity/schemas/home.ts
export default {
  name: 'home',
  title: '1. 家 (Home Page)',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: '首頁主標題 (Hero Title)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文標題', type: 'string' },
        { name: 'en', title: '英文標題', type: 'string' }
      ]
    },
    {
      name: 'introduction',
      title: '廬陵昱西引言 (Introduction to lulingshine.art)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文引言', type: 'text' },
        { name: 'en', title: '英文引言', type: 'text' }
      ]
    },
    {
      name: 'ownerSection',
      title: '店主介紹與心路歷程 (Introducing the Owner)',
      type: 'object',
      fields: [
        { name: 'ownerName', title: '店主姓名', type: 'string' },
        { name: 'storyZh', title: '故事與 Zen/Wabi-Sabi 精神 (中文)', type: 'array', of: [{ type: 'block' }] },
        { name: 'storyEn', title: '故事與 Zen/Wabi-Sabi 精神 (英文)', type: 'array', of: [{ type: 'block' }] }
      ]
    }
  ]
}