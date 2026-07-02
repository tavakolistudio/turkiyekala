import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// کلاینت سمت سرور با اعمال RLS بر اساس نشست کاربر
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // در Server Component قابل نوشتن نیست؛ نادیده گرفته می‌شود
          }
        },
      },
    }
  );
}
