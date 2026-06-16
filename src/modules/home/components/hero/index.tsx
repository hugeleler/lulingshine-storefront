import { Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="w-full relative bg-white">
      {/* 100% 滿版大圖容器
        在寬螢幕下使用 aspect-[21/9] 或 h-[70vh]，大氣且不會把圖片拉伸變形
      */}
      <div className="w-full aspect-[16/9] md:aspect-[21/9] max-h-[75vh] overflow-hidden bg-gray-50 flex items-center justify-center">
        <img
          src="https://amakido.art/cdn/shop/files/1.jpg" // 👈 這裡直接引用你抓下來的藝術品高清橫版大圖
          alt="AMAKIDO Featured Art"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 大圖下方的極簡藝術引言/標題
        甘木道常用的寬字距、低調排版，作為海報與下方商品網格的優雅視覺過渡
      */}
      <div className="max-w-[1440px] mx-auto px-6 pt-16 pb-8 text-center flex flex-col items-center justify-center gap-2">
        <Heading
          level="h1"
          className="text-lg md:text-xl font-light tracking-[0.4em] text-gray-800 uppercase"
        >
          COLLECTIONS
        </Heading>
        <div className="w-6 h-[1px] bg-gray-300 mt-2"></div> {/* 極細的日系裝飾分割線 */}
        <p className="text-xs tracking-[0.2em] text-gray-400 font-light mt-2">
          日々の暮らしと茶の湯に寄り添う、現代陶芸作家の一点物
        </p>
      </div>
    </div>
  )
}

export default Hero