import Link from "next/link"

export default function Nav() {
  return (
    <header className="w-full bg-white sticky top-0 z-50">
      {/* 頂部主容器 */}
      <div className="max-w-[1440px] mx-auto px-8 h-24 flex items-center justify-between relative">
        
        {/* 左側：100% 還原的豐富選單矩陣（包含二級懸停菜單） */}
        <nav className="flex items-center space-x-10 text-[12px] tracking-[0.25em] text-gray-500 font-light z-20">
          
          {/* 1. 取扱の品 (懸停下拉結構) */}
          <div className="relative group py-4">
            <Link href="/collections/all" className="hover:text-black transition-colors duration-300 flex items-center cursor-pointer">
              取扱の品
              <svg className="w-3 h-3 ml-1 text-gray-400 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            {/* 下拉浮層：大留白極簡畫廊風 */}
            <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-gray-100 p-6 w-48 shadow-none transition-all duration-300">
              <ul className="space-y-3 text-gray-400 text-[11px] tracking-widest">
                <li><Link href="/collections/tea-bowl" className="hover:text-black block transition-colors">抹茶茶碗</Link></li>
                <li><Link href="/collections/sake-ware" className="hover:text-black block transition-colors">ぐい呑み・酒器</Link></li>
                <li><Link href="/collections/vases" className="hover:text-black block transition-colors">花入・花瓶</Link></li>
                <li><Link href="/collections/tea-tools" className="hover:text-black block transition-colors">茶道具</Link></li>
              </ul>
            </div>
          </div>

          {/* 2. 作家別作品 (二級下拉結構) */}
          <div className="relative group py-4">
            <Link href="/collections/artists" className="hover:text-black transition-colors duration-300 flex items-center cursor-pointer">
              作家別作品
              <svg className="w-3 h-3 ml-1 text-gray-400 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            {/* 100% 對齊原版 index.html 裡的頂級工藝作家矩陣 */}
            <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-gray-100 p-6 w-56 shadow-none transition-all duration-300">
              <ul className="space-y-3 text-gray-400 text-[11px] tracking-widest">
                <li><Link href="/collections/shimizu-ichiji" className="hover:text-black block transition-colors">清水一二</Link></li>
                <li><Link href="/collections/ichino-masahiko" className="hover:text-black block transition-colors">市野雅彦</Link></li>
                <li><Link href="/collections/ikai-yuichi" className="hover:text-black block transition-colors">猪飼祐一</Link></li>
                <li><Link href="/collections/fujihira-shin" className="hover:text-black block transition-colors">藤平寧</Link></li>
                <li><Link href="/collections/onishi-rakusai" className="hover:text-black block transition-colors">尾西楽斎</Link></li>
                <li><Link href="/collections/ikura-kotaro" className="hover:text-black block transition-colors">井倉幸太郎</Link></li>
              </ul>
            </div>
          </div>

          {/* 3. 作家対談 */}
          <div className="relative group py-4">
            <Link href="/pages/interviews" className="hover:text-black transition-colors duration-300 flex items-center cursor-pointer">
              作家対談
              <svg className="w-3 h-3 ml-1 text-gray-400 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-gray-100 p-6 w-64 shadow-none transition-all duration-300">
              <ul className="space-y-3 text-gray-400 text-[11px] tracking-widest">
                <li><Link href="/pages/interview-matsubayashi" className="hover:text-black block transition-colors">松林豊斎様との対談</Link></li>
                <li><Link href="/pages/interview-yagashita" className="hover:text-black block transition-colors">柳下季器様との対談</Link></li>
                <li><Link href="/pages/interview-ikai" className="hover:text-black block transition-colors">猪飼祐一様との対談</Link></li>
                <li><Link href="/pages/interview-ikura" className="hover:text-black block transition-colors">井倉幸太郎様との対談</Link></li>
              </ul>
            </div>
          </div>

          {/* 4. 甘木道について */}
          <Link href="/about" className="hover:text-black transition-colors duration-300 py-4">
            甘木道について
          </Link>

        </nav>

        {/* 中間：完美復刻的明朝體（宋體）Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
          <Link href="/" className="font-serif-art text-2xl font-light tracking-[0.5em] text-gray-900 mr-[-0.5em]">
            甘木道
          </Link>
        </div>

        {/* 右側：工具欄（貨幣切換與購物車） */}
        <div className="flex items-center space-x-8 text-[11px] tracking-[0.2em] text-gray-400 font-light z-20">
          <button className="hover:text-black transition-colors duration-300 border border-gray-100 px-2 py-0.5 text-[9px] tracking-normal text-gray-400">
            JA / JPY ¥
          </button>
          
          <Link href="/cart" className="relative hover:text-black transition-colors duration-300 flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="0.75" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.119-1.243l1.263-12c.07-.665.45-1.243 1.119-1.243h12.312c.669 0 1.189.578 1.119 1.243Z" />
            </svg>
            <span className="absolute -top-1 -right-1.5 bg-gray-900 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center scale-90 font-sans">
              0
            </span>
          </Link>
        </div>

      </div>
    </header>
  )
}