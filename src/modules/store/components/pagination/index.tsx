// 📁 完整路徑：src/modules/store/components/pagination/index.tsx
"use client" // 🎯 保持用戶端高性能篩選互動

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation"
// 🏛️ 模組化校準：引入中央字典與安全工具函數
import { translateUi } from "@lib/ui-dictionary"

export function Pagination({
  page,
  totalPages,
  'data-testid': dataTestid
}: {
  page: number
  totalPages: number
  'data-testid'?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { countryCode } = useParams()

  const [activeLocale, setActiveLocale] = useState("en")

  // 🧠 核心安全控制：如果全站商品只有 1 頁，高奢 UI 自動隱藏，保持畫廊展廳純淨
  if (totalPages <= 1) {
    return null
  }

  // 🌍 完美對齊 Footer 的語系反查防線：直接從 Cookie 中安全榨取真正的 medusa_locale
  useEffect(() => {
    const currentCountry = (Array.isArray(countryCode) ? countryCode[0] : countryCode) || "hk"
    const cc = currentCountry.toLowerCase()
    
    // 1. 根據國家程式碼設定默認兜底語系
    let initialLocale = "en"
    if (cc === "hk" || cc === "tw") initialLocale = "zh-TW"
    else if (cc === "cn") initialLocale = "zh-CN"
    else if (cc === "jp") initialLocale = "ja"
    else if (cc === "kr") initialLocale = "ko"

    // 2. 100% 複製 Footer 算法：從 Cookie 中精確反查
    const match = document.cookie.match(new RegExp('(^| )medusa_locale=([^;]+)'))
    if (match) {
      initialLocale = match[2]
    }

    setActiveLocale(initialLocale)
  }, [countryCode])

  // 🎯 呼叫中央工具函數，直接提取廬陵昱西官方標準展簽翻譯
  const prevLabel = translateUi("prevPage", activeLocale)
  const nextLabel = translateUi("nextPage", activeLocale)

  // 數字範圍生成器保持不變
  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  // 智慧型 URL 參數整合翻頁，鎖死 scroll: false 避免劇烈跳動
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // 🏛️ 高奢畫廊風按鈕渲染器：將原生大黑字徹底淨化為高級炭灰、自帶底邊框、補零格式 (01, 02)
  const renderPageButton = (
    p: number,
    label: string | number,
    isCurrent: boolean
  ) => {
    const formattedLabel = typeof label === "number" ? String(label).padStart(2, "0") : label

    return (
      <button
        key={p}
        disabled={isCurrent}
        onClick={() => handlePageChange(p)}
        className={`pb-1 border-b transition-all duration-300 font-sans text-xs font-light tracking-[0.1em] ${
          isCurrent
            ? "text-black border-black font-normal cursor-default"
            : "text-gray-400 border-transparent hover:text-black"
        }`}
      >
        {formattedLabel}
      </button>
    )
  }

  // 🏛️ 畫廊極簡省略號
  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="text-gray-300 font-sans text-xs font-light tracking-[0.1em] select-none cursor-default pb-1"
    >
      ...
    </span>
  )

  // 智慧折疊核心演算法 100% 完美保留
  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else {
      if (page <= 4) {
        buttons.push(
          ...arrayRange(1, 5).map((p) => renderPageButton(p, p, p === page))
        )
        buttons.push(renderEllipsis("ellipsis1"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      } else if (page >= totalPages - 3) {
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis2"))
        buttons.push(
          ...arrayRange(totalPages - 4, totalPages).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
      } else {
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis3"))
        buttons.push(
          ...arrayRange(page - 1, page + 1).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
        buttons.push(renderEllipsis("ellipsis4"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      }
    }

    return buttons
  }

  return (
    // 🏛️ 全站中軸對齊，邊框灰度與推薦區無縫校準
    <div className="flex justify-center items-center gap-6 mt-20 pt-8 border-t border-black/[0.02] w-full">
      
      {/* 🎯 左側上一頁控制項（100% 同步自 Cookie 驅動的中央字典） */}
      {page > 1 ? (
        <button
          onClick={() => handlePageChange(page - 1)}
          className="text-[11px] tracking-[0.2em] uppercase font-sans text-gray-400 hover:text-black transition-colors duration-300"
        >
          {prevLabel}
        </button>
      ) : (
        <span className="text-[11px] tracking-[0.2em] uppercase font-sans text-gray-200 cursor-not-allowed select-none">
          {prevLabel}
        </span>
      )}

      {/* 🎯 智慧中央數字/省略號陣列 */}
      <div className="flex gap-4 items-end" data-testid={dataTestid}>
        {renderPageButtons()}
      </div>

      {/* 🎯 右側下一頁控制項（100% 同步自 Cookie 驅動的中央字典） */}
      {page < totalPages ? (
        <button
          onClick={() => handlePageChange(page + 1)}
          className="text-[11px] tracking-[0.2em] uppercase font-sans text-gray-400 hover:text-black transition-colors duration-300"
        >
          {nextLabel}
        </button>
      ) : (
        <span className="text-[11px] tracking-[0.2em] uppercase font-sans text-gray-200 cursor-not-allowed select-none">
          {nextLabel}
        </span>
      )}

    </div>
  )
}