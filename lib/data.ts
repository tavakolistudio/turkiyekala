import "server-only";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { Settings, Product, ShoppingProduct } from "@/lib/types";

// نرخ‌ها فقط سمت سرور خوانده می‌شوند تا نرخ واقعی به کلاینت درز نکند.
export async function getSettings(): Promise<Settings | null> {
  const supabase = createAdminSupabase();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
  return (data as Settings) ?? null;
}

export async function getPublishedShoppingProducts(): Promise<ShoppingProduct[]> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from("shopping_products")
    .select("*")
    .eq("publish_status", "published")
    .order("created_at", { ascending: false });
  return (data as ShoppingProduct[]) ?? [];
}

export async function getShoppingProductBySlug(
  slug: string
): Promise<ShoppingProduct | null> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from("shopping_products")
    .select("*")
    .eq("slug", slug)
    .eq("publish_status", "published")
    .maybeSingle();
  return (data as ShoppingProduct) ?? null;
}

export async function getVisibleProducts(): Promise<Product[]> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .neq("status", "inactive")
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .neq("status", "inactive")
    .maybeSingle();
  return (data as Product) ?? null;
}
