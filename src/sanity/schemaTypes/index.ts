// 📁 路徑：src/sanity/schemaTypes/index.ts

// 1. 引入基礎通用零件 (物理隔離在 common 子目錄下)
import { localizedString } from './common/localizedString'
import { localizedText } from './common/localizedText'

// 2. 引入 1 ~ 7 號核心一級選單頁面
import home from './home'
import products from './products'
import worksByArtist from './worksByArtist'
import artistDialogue from './artistDialogue'
import blog from './blog'
import buyingGuide from './buyingGuide'
import inquiry from './inquiry'

// 🔒 完美註冊中心
export const schemaTypes = [
  localizedString,
  localizedText,
  home,
  products,
  worksByArtist,
  artistDialogue,
  blog,
  buyingGuide,
  inquiry
]