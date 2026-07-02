import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { toEnglishDigits } from "@/lib/utils";
import type { Order, OrderStatusLog } from "@/lib/types";

export async function POST(req: Request) {
  let query = "";
  try {
    const body = await req.json();
    query = toEnglishDigits(String(body.query ?? "")).trim();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json(
      { error: "شماره سفارش یا موبایل را وارد کنید." },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabase();
  const isOrderNumber = /^tk-?\d+$/i.test(query) || /^\d{4,6}$/.test(query);

  let orders: Order[] = [];
  if (isOrderNumber) {
    const normalized = query.toUpperCase().startsWith("TK")
      ? query.toUpperCase().replace(/^TK-?/, "TK-")
      : "TK-" + query;
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", normalized)
      .limit(1);
    orders = (data as Order[]) ?? [];
  } else {
    // جستجو با موبایل
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_phone", query)
      .order("created_at", { ascending: false })
      .limit(20);
    orders = (data as Order[]) ?? [];
  }

  if (!orders.length) {
    return NextResponse.json({ error: "سفارشی یافت نشد." }, { status: 404 });
  }

  // فقط اطلاعات غیرحساس برگردانده می‌شود
  const results = await Promise.all(
    orders.map(async (o) => {
      const { data: logs } = await supabase
        .from("order_status_logs")
        .select("old_status, new_status, note, created_at")
        .eq("order_id", o.id)
        .order("created_at", { ascending: true });

      return {
        order_number: o.order_number,
        type: o.type,
        product_name: o.product_name,
        status: o.status,
        estimated_price_toman: o.estimated_price_toman,
        final_price_toman: o.final_price_toman,
        internal_tracking_code: o.internal_tracking_code,
        carrier_name: o.carrier_name,
        // نام مشتری فقط با حرف اول (حریم خصوصی)
        customer_hint: maskName(o.customer_name),
        created_at: o.created_at,
        timeline: (logs as Partial<OrderStatusLog>[]) ?? [],
      };
    })
  );

  return NextResponse.json({ ok: true, orders: results });
}

function maskName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .map((p) => (p.length > 1 ? p[0] + "…" : p))
    .join(" ");
}
