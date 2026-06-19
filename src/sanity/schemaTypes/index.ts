// 📁 路徑：src/sanity/schemaTypes/index.ts
import home from './home'
import products from './products'
import worksByArtist from './worksByArtist'
import artistDialogue from './artistDialogue'
import blog from './blog'
import buyingGuide from './buyingGuide'
import inquiry from './inquiry'

// 🔒 這裡只老老實實保留 1 到 7 號的純數據結構
export const schemaTypes = [
  home,
  products,
  worksByArtist,
  artistDialogue,
  blog,
  buyingGuide,
  inquiry
]