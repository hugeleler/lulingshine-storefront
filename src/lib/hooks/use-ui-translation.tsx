// 📁 完整路徑：src/lib/hooks/use-ui-translation.tsx
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { translateUi, uiDictionary } from "@lib/ui-dictionary"

export function useUiTranslation() {
  const { countryCode } = useParams()
  const currentCountry = (Array.isArray(countryCode) ? countryCode[0] : countryCode) || "hk"
  const [locale, setLocale] = useState("en")

  // 🛰️ 實時追蹤監聽瀏覽器中 Medusa 的最新語系狀態
  useEffect(() => {
    const getActiveLocale = () => {
      const cc = currentCountry.toLowerCase()
      let derived = "en"
      if (cc === "hk" || cc === "tw") derived = "zh-TW"
      else if (cc === "cn") derived = "zh-CN"
      else if (cc === "jp") derived = "ja"
      else if (cc === "kr") derived = "ko"

      const match = document.cookie.match(new RegExp('(^| )medusa_locale=([^;]+)'))
      return match ? match[2] : derived
    }

    setLocale(getActiveLocale())
  }, [currentCountry])

  /**
   * 👑 神級語法糖 `__('key')`：組件裡只要寫一句 `__('cart')`，直接搞定多語言！
   */
  const __ = (key: keyof typeof uiDictionary): string => {
    return translateUi(key, locale)
  }

  return { __, locale }
}