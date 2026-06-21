// 📁 路徑：src/lib/medusa-client.ts
import Medusa from "@medusajs/js-sdk"

// 🔒 完美對接本地 Medusa v2.15.3 伺服器
export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
})