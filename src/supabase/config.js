import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 防呆檢查：如果環境變數缺失，先在 console 警告
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("錯誤：找不到 Supabase 環境變數！請檢查 Vercel 設定中的 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY。");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "")