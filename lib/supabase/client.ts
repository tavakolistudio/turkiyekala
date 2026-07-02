"use client";

import { createBrowserClient } from "@supabase/ssr";

// کلاینت سمت مرورگر (برای صفحات احراز هویت ادمین)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
