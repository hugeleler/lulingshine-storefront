export type LocaleType = "zh-TW" | "zh-CN" | "en" | "ja" | "ko"

// 🏛️ LULINGSHINE 全站 UI 靜態文案中央字典
export const uiDictionary: Record<string, Record<LocaleType, string>> = {
  // 頁頭與基本導航（原裝保留）
  menu: { "zh-TW": "選單", "zh-CN": "选单", en: "MENU", ja: "メニュー", ko: "메뉴" },
  cart: { "zh-TW": "購物車", "zh-CN": "购物车", en: "CART", ja: "カート", ko: "장바구니" },
  shippingTo: { "zh-TW": "配送至", "zh-CN": "配送至", en: "Shipping to", ja: "配送先", ko: "배송지" },
  language: { "zh-TW": "語言", "zh-CN": "语言", en: "Language", ja: "言語", ko: "언어" },
  search: { "zh-TW": "搜尋", "zh-CN": "搜寻", en: "Search", ja: "検索", ko: "검색" },
  loading: { "zh-TW": "加載中...", "zh-CN": "加载中...", en: "Loading...", ja: "読み込み中...", ko: "로딩 중..." },

  // 🧭 終極校準：全語系 5 大核心高奢美學導航欄
  navHome: { "zh-TW": "首頁", "zh-CN": "首页", en: "Home", ja: "ホーム", ko: "홈" },
  
  // 02. 昱西器物 / Lulingshine Objects
  navStore: { 
    "zh-TW": "昱西器物", 
    "zh-CN": "昱西器物", 
    en: "Lulingshine Objects", 
    ja: "昱西器物", 
    ko: "욱서기물" 
  },
  
  // 03. 大師傑作 / Masterworks
  navArtists: { 
    "zh-TW": "大師傑作", 
    "zh-CN": "大师杰作", 
    en: "Masterworks", 
    ja: "名家傑作", 
    ko: "명가걸작" 
  },
  
  // 04. 博客文誌 / Blog & Review
  navBlog: { 
    "zh-TW": "博客文誌", 
    "zh-CN": "博客文志", 
    en: "Blog & Review", 
    ja: "ブログ文誌", 
    ko: "블로그문지" 
  },
  
  // 05. 藏家洽詢 / Acquisition & Inquiry
  navInquiry: { 
    "zh-TW": "藏家洽詢", 
    "zh-CN": "藏家洽询", 
    en: "Acquisition & Inquiry", 
    ja: "コレクター相談", 
    ko: "소장가상담" 
  },

  navAbout: { "zh-TW": "問候", "zh-CN": "品牌问候", en: "Greetings", ja: "ご挨拶", ko: "인사말" },
  navPackaging: { "zh-TW": "包裝", "zh-CN": "柴窑包装", en: "Packaging", ja: "桐箱包装", ko: "포장안내" },

  // 商品與合集區塊（原裝保留）
  viewAll: { "zh-TW": "查看全部", "zh-CN": "查看全部", en: "View all", ja: "すべて見る", ko: "전체 보기" },
  sortBy: { "zh-TW": "排序依據", "zh-CN": "排序依据", en: "Sort by", ja: "並び替え", ko: "정렬 기준" },
  latestArrivals: { "zh-TW": "最新作品", "zh-CN": "最新作品", en: "Latest Arrivals", ja: "最新作", ko: "최신 입고" },
  priceHighLow: { "zh-TW": "價格：由高到低", "zh-CN": "价格：由高到低", en: "Price: High to Low", ja: "価格の割高順", ko: "가격: 높은 순" },
  priceLowHigh: { "zh-TW": "價格：由低到高", "zh-CN": "价格：由低到高", en: "Price: Low to High", ja: "価格の割安順", ko: "가격: 낮은 순" },

  // 首頁核心巨幕文案（原裝保留）
  heroTitle: { "zh-TW": "廬陵昱西", "zh-CN": "庐陵昱西", en: "LULINGSHINE", ja: "廬陵昱西", ko: "루링샤인" },
  heroSub: { 
    "zh-TW": "景德鎮當代名家柴窯孤品重器", 
    "zh-CN": "景德镇当代名家柴窑孤品重器", 
    en: "Jingdezhen Contemporary Ceramic Art", 
    ja: "景徳鎮現代名家柴窯一点物重器", 
    ko: "경덕진 당대 명가 채요 고품 중기" 
  },
  heroBtn: { "zh-TW": "探索珍藏", "zh-CN": "探索珍藏", en: "Explore Collections", ja: "コレクションを見る", ko: "컬렉션 탐색" }
}

/**
 * 🧠 核心安全工具：根據當前語言和鍵名，秒級返回正確的多語言文本
 */
export function translateUi(key: keyof typeof uiDictionary, localeCode: string): string {
  const cleanLocale = localeCode.replace("_", "-") as LocaleType
  const validLocales: LocaleType[] = ["zh-TW", "zh-CN", "en", "ja", "ko"]
  
  const finalLocale = validLocales.includes(cleanLocale) ? cleanLocale : "en"
  
  return uiDictionary[key]?.[finalLocale] || uiDictionary[key]?.["en"] || String(key)
}