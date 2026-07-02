import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

// بررسی اینکه کاربر فعلی ادمین است
export async function getAdminUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminSupabase();
  const { data } = await admin
    .from("admin_users")
    .select("id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return null;
  return { user, role: data.role as string };
}

// در صفحات ادمین استفاده می‌شود؛ در صورت نبودن دسترسی ریدایرکت می‌کند
export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  return admin;
}
