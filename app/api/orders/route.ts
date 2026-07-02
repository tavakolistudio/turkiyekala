import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSettings } from "@/lib/data";
import {
  calculateProductPrice,
  calculateShoppingEstimatedPrice,
  getDefaultWeight,
} from "@/lib/pricing";
import { toNumber } from "@/lib/utils";
import type { OrderType, Product, ShoppingProduct } from "@/lib/types";

const VALID_TYPES: OrderType[] = [
  "product_order",
  "shopping_product_order",
  "link_order",
];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const type = body.type as OrderType;
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "نوع سفارش نامعتبر است." }, { status: 400 });
  }

  const customerName = str(body.customer_name);
  const customerPhone = str(body.customer_phone);
  if (!customerName || !customerPhone) {
    return NextResponse.json(
      { error: "نام و شماره موبایل الزامی است." },
      { status: 400 }
    );
  }

  if (type === "link_order" && !str(body.product_url)) {
    return NextResponse.json(
      { error: "لینک محصول الزامی است." },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabase();
  const settings = await getSettings();

  // مقادیر پایه سفارش
  const insert: Record<string, unknown> = {
    type,
    color: str(body.color),
    size: str(body.size),
    quantity: toNumber(body.quantity) ?? 1,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_city: str(body.customer_city),
    customer_address: str(body.customer_address),
    postal_code: str(body.postal_code),
    notes: str(body.notes),
    status: "pending_review",
    product_name: str(body.product_name),
    product_url: str(body.product_url),
    source_site_name: str(body.source_site_name),
  };

  // برای محصول آماده: بارگذاری اطلاعات و قیمت
  if (type === "product_order") {
    const productId = str(body.product_id);
    if (!productId) {
      return NextResponse.json({ error: "شناسه محصول الزامی است." }, { status: 400 });
    }
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .maybeSingle();
    const product = data as Product | null;
    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
    }
    insert.product_id = product.id;
    insert.product_name = product.title;
    insert.product_price_try = product.price_try;
    insert.estimated_weight = product.estimated_weight;

    if (settings) {
      const price = calculateProductPrice(product, settings);
      if (product.price_type === "fixed") {
        insert.final_price_toman = price;
      } else {
        insert.estimated_price_toman = price;
      }
    }
  }

  // برای محصول Shopping: قیمت حدودی
  if (type === "shopping_product_order") {
    const shoppingId = str(body.shopping_product_id);
    if (!shoppingId) {
      return NextResponse.json(
        { error: "شناسه محصول Shopping الزامی است." },
        { status: 400 }
      );
    }
    const { data } = await supabase
      .from("shopping_products")
      .select("*")
      .eq("id", shoppingId)
      .maybeSingle();
    const sp = data as ShoppingProduct | null;
    if (!sp) {
      return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
    }
    insert.shopping_product_id = sp.id;
    insert.product_name = sp.title;
    insert.source_site_name = sp.source_site_name;
    insert.product_url = sp.source_url;
    insert.product_price_try = sp.discounted_price_try ?? sp.original_price_try;
    insert.estimated_weight = sp.estimated_weight ?? getDefaultWeight(sp.category);
    if (settings) {
      insert.estimated_price_toman = calculateShoppingEstimatedPrice(sp, settings);
    }
  }

  const { data: created, error } = await supabase
    .from("orders")
    .insert(insert)
    .select("order_number, status, estimated_price_toman, final_price_toman")
    .single();

  if (error || !created) {
    return NextResponse.json(
      { error: "ثبت سفارش ناموفق بود. دوباره تلاش کنید." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    order_number: created.order_number,
    status: created.status,
  });
}

function str(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}
