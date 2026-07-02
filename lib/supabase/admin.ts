import { createClient } from "@supabase/supabase-js";

// کلاینت service role — فقط سمت سرور.
// RLS را دور می‌زند؛ برای ثبت سفارش عمومی، پیگیری و خواندن نرخ‌ها استفاده می‌شود.
// هرگز نباید در کد کلاینت import شود.
export function createAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
