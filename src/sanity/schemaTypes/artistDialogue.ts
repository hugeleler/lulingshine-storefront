// 📁 路徑：src/sanity/schemas/artistDialogue.ts
export default {
  name: 'artistDialogue',
  title: '4. 對話藝術家 (Artist Dialogue)',
  type: 'document',
  fields: [
    {
      name: 'interviewee',
      title: '受訪大師姓名 (如: Tadashi Nishibata / Rakusai Onishi)',
      type: 'string'
    },
    {
      name: 'slug',
      title: '訪談網址路徑 (Slug)',
      type: 'slug',
      options: { source: 'interviewee', maxLength: 96 }
    },
    {
      name: 'dialogueContent',
      title: '對談深度正文 (支援文字與工作室側拍圖片混排)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文訪談錄', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
        { name: 'en', title: '英文訪談錄', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }
      ]
    }
  ]
}