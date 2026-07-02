import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSettings } from "@/lib/data";
import { calculateOrderFinancials, formatToman } from "@/lib/pricing";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createServerSupabase();
  const settings = await getSettings();

  const statuses = [
    { key: "pending_review", label: "سفارش‌های جدید / در انتظار بررسی", href: "?status=pending_review" },
    { key: "awaiting_payment", label: "در انتظار پرداخت" },
    { key: "receipt_submitted", label: "رسید ثبت‌شده در انتظار تأیید" },
    { key: "in_transit_to_tehran", label: "در مسیر تهران" },
    { key: "delivered", label: "تحویل‌شده" },
  ];

  const counts = await Promise.all(
    statuses.map(async (st) => {
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", st.key);
      return { ...st, count: count ?? 0 };
    })
  );

  const { count: shoppingReview } = await supabase
    .from("shopping_products")
    .select("*", { count: "exact", head: true })
    .eq("availability_status", "needs_review");

  // فروش کل و سود تقریبی از سفارش‌های تحویل‌شده/پرداخت‌شده
  const { data: financialOrders } = await supabase
    .from("orders")
    .select(
      "received_amount_toman, real_product_cost_try, real_shipping_cost_try, service_fee_toman, side_costs_toman"
    )
    .not("received_amount_toman", "is", null);

  let totalSales = 0;
  let totalProfit = 0;
  if (settings && financialOrders) {
    for (const o of financialOrders as Partial<Order>[]) {
      totalSales += o.received_amount_toman ?? 0;
      totalProfit += calculateOrderFinancials(o, settings).finalProfitToman;
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">داشبورد</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map((c) => (
          <Link
            key={c.key}
            href={`/admin/orders?status=${c.key}`}
            className="card p-5 transition-colors hover:border-brand-700/30"
          >
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-brand-700">{c.count}</p>
          </Link>
        ))}

        <Link
          href="/admin/shopping-products?availability=needs_review"
          className="card p-5 transition-colors hover:border-amber-400"
        >
          <p className="text-sm text-slate-500">محصولات Shopping نیازمند بررسی</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-600">
            {shoppingReview ?? 0}
          </p>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="text-sm text-slate-500">فروش کل (دریافتی از مشتریان)</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-800">
            {formatToman(totalSales)}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">سود تقریبی</p>
          <p className="mt-2 text-2xl font-extrabold text-accent-700">
            {formatToman(totalProfit)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/orders" className="btn-brand">مدیریت سفارش‌ها</Link>
        <Link href="/admin/import-product" className="btn-outline">افزودن محصول از لینک</Link>
        <Link href="/admin/settings" className="btn-outline">تنظیمات نرخ‌ها</Link>
      </div>
    </div>
  );
}
