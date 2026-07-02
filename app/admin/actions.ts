"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth";
import { slugify, parseList, toNumber } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

async function assertAdmin() {
  const admin = await getAdminUser();
  if (!admin) throw new Error("دسترسی غیرمجاز");
}

function s(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

// ---------------------------------------------------------------------
// سفارش‌ها
// ---------------------------------------------------------------------
export async function updateOrderAction(formData: FormData) {
  await assertAdmin();
  const supabase = await createServerSupabase();
  const id = s(formData, "id");
  if (!id) throw new Error("شناسه سفارش نامعتبر است.");

  const update: Record<string, unknown> = {
    status: s(formData, "status") as OrderStatus | null,
    admin_note: s(formData, "admin_note"),
    final_price_toman: toNumber(formData.get("final_price_toman")),
    estimated_price_toman: toNumber(formData.get("estimated_price_toman")),
    real_weight: toNumber(formData.get("real_weight")),
    real_product_cost_try: toNumber(formData.get("real_product_cost_try")),
    real_shipping_cost_try: toNumber(formData.get("real_shipping_cost_try")),
    service_fee_toman: toNumber(formData.get("service_fee_toman")),
    received_amount_toman: toNumber(formData.get("received_amount_toman")),
    side_costs_toman: toNumber(formData.get("side_costs_toman")),
    internal_tracking_code: s(formData, "internal_tracking_code"),
    carrier_name: s(formData, "carrier_name"),
    payment_receipt_url: s(formData, "payment_receipt_url"),
    payment_note: s(formData, "payment_note"),
    purchase_date: s(formData, "purchase_date"),
    handed_carrier_date: s(formData, "handed_carrier_date"),
    arrived_tehran_date: s(formData, "arrived_tehran_date"),
  };

  const { error } = await supabase.from("orders").update(update).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

// ---------------------------------------------------------------------
// محصولات آماده
// ---------------------------------------------------------------------
export async function upsertProductAction(formData: FormData) {
  await assertAdmin();
  const supabase = await createServerSupabase();
  const id = s(formData, "id");
  const title = s(formData, "title");
  if (!title) throw new Error("نام محصول الزامی است.");

  const row: Record<string, unknown> = {
    title,
    slug: s(formData, "slug") || slugify(title),
    description: s(formData, "description"),
    price_try: toNumber(formData.get("price_try")),
    manual_final_price_toman: toNumber(formData.get("manual_final_price_toman")),
    estimated_weight: toNumber(formData.get("estimated_weight")),
    category: s(formData, "category"),
    images: parseList(s(formData, "images")),
    colors: parseList(s(formData, "colors")),
    sizes: parseList(s(formData, "sizes")),
    status: s(formData, "status") || "active",
    price_type: s(formData, "price_type") || "estimate",
    delivery_time: s(formData, "delivery_time"),
  };

  if (id) {
    const { error } = await supabase.from("products").update(row).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("products").insert(row);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await assertAdmin();
  const supabase = await createServerSupabase();
  const id = s(formData, "id");
  if (!id) return;
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// ---------------------------------------------------------------------
// محصولات Shopping
// ---------------------------------------------------------------------
export async function upsertShoppingProductAction(formData: FormData) {
  await assertAdmin();
  const supabase = await createServerSupabase();
  const id = s(formData, "id");
  const title = s(formData, "title");
  if (!title) throw new Error("نام محصول الزامی است.");

  const row: Record<string, unknown> = {
    title,
    slug: s(formData, "slug") || slugify(title),
    source_url: s(formData, "source_url"),
    source_domain: s(formData, "source_domain"),
    source_site_name: s(formData, "source_site_name"),
    brand: s(formData, "brand"),
    description: s(formData, "description"),
    main_image: s(formData, "main_image"),
    images: parseList(s(formData, "images")),
    original_price_try: toNumber(formData.get("original_price_try")),
    discounted_price_try: toNumber(formData.get("discounted_price_try")),
    discount_percent: toNumber(formData.get("discount_percent")),
    estimated_weight: toNumber(formData.get("estimated_weight")),
    category: s(formData, "category"),
    colors: parseList(s(formData, "colors")),
    sizes: parseList(s(formData, "sizes")),
    availability_status: s(formData, "availability_status") || "needs_review",
    publish_status: s(formData, "publish_status") || "draft",
    tags: parseList(s(formData, "tags")),
    estimated_delivery_time: s(formData, "estimated_delivery_time"),
    final_estimated_price_toman: toNumber(formData.get("final_estimated_price_toman")),
  };

  if (id) {
    const { error } = await supabase.from("shopping_products").update(row).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("shopping_products").insert(row);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/shopping-products");
  redirect("/admin/shopping-products");
}

export async function deleteShoppingProductAction(formData: FormData) {
  await assertAdmin();
  const supabase = await createServerSupabase();
  const id = s(formData, "id");
  if (!id) return;
  await supabase.from("shopping_products").delete().eq("id", id);
  revalidatePath("/admin/shopping-products");
  redirect("/admin/shopping-products");
}

// ---------------------------------------------------------------------
// تنظیمات
// ---------------------------------------------------------------------
export async function updateSettingsAction(formData: FormData) {
  await assertAdmin();
  const supabase = await createServerSupabase();

  const update: Record<string, unknown> = {
    exchange_rate_try_to_toman: toNumber(formData.get("exchange_rate_try_to_toman")),
    real_exchange_rate_try_to_toman: toNumber(
      formData.get("real_exchange_rate_try_to_toman")
    ),
    shipping_rate_per_kg_try: toNumber(formData.get("shipping_rate_per_kg_try")),
    service_fee_percent: toNumber(formData.get("service_fee_percent")),
    minimum_service_fee_toman: toNumber(formData.get("minimum_service_fee_toman")),
    default_delivery_time: s(formData, "default_delivery_time"),
    shipping_rules_text: s(formData, "shipping_rules_text"),
    return_rules_text: s(formData, "return_rules_text"),
    preorder_enabled: formData.get("preorder_enabled") === "on",
  };

  const { error } = await supabase.from("settings").update(update).eq("id", 1);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
}
