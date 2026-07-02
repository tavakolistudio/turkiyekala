import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatToman } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
  type Order,
  type OrderStatus,
  type OrderType,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; q?: string }>;
}) {
  const { status, type, q } = await searchParams;
  const supabase = await createServerSupabase();

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (type) query = query.eq("type", type);
  if (q) {
    query = query.or(
      `order_number.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%`
    );
  }
  const { data } = await query.limit(200);
  const orders = (data as Order[]) ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">مدیریت سفارش‌ها</h1>

      {/* فیلترها */}
      <form className="card mb-4 grid gap-3 p-4 md:grid-cols-4">
        <input
          name="q"
          defaultValue={q ?? ""}
          className="input"
          placeholder="شماره سفارش، نام یا موبایل"
        />
        <select name="status" defaultValue={status ?? ""} className="input">
          <option value="">همه وضعیت‌ها</option>
          {ORDER_STATUS_FLOW.map((st) => (
            <option key={st} value={st}>{ORDER_STATUS_LABELS[st]}</option>
          ))}
        </select>
        <select name="type" defaultValue={type ?? ""} className="input">
          <option value="">همه انواع</option>
          {(Object.keys(ORDER_TYPE_LABELS) as OrderType[]).map((t) => (
            <option key={t} value={t}>{ORDER_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <button type="submit" className="btn-brand">اعمال فیلتر</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3 text-right">شماره</th>
              <th className="p-3 text-right">نوع</th>
              <th className="p-3 text-right">مشتری</th>
              <th className="p-3 text-right">محصول</th>
              <th className="p-3 text-right">وضعیت</th>
              <th className="p-3 text-right">قیمت</th>
              <th className="p-3 text-right">تاریخ</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-medium text-brand-700">{o.order_number}</td>
                <td className="p-3 text-slate-600">{ORDER_TYPE_LABELS[o.type]}</td>
                <td className="p-3 text-slate-600">
                  {o.customer_name}
                  <span className="block text-xs text-slate-400" dir="ltr">{o.customer_phone}</span>
                </td>
                <td className="p-3 text-slate-600">
                  <span className="line-clamp-1 max-w-[160px]">{o.product_name ?? "—"}</span>
                </td>
                <td className="p-3">
                  <StatusChip status={o.status} />
                </td>
                <td className="p-3 text-slate-600">
                  {formatToman(o.final_price_toman ?? o.estimated_price_toman)}
                </td>
                <td className="p-3 text-xs text-slate-400">{formatDate(o.created_at)}</td>
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-accent-700 hover:underline">
                    جزئیات
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  سفارشی یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: OrderStatus }) {
  const danger: OrderStatus[] = ["payment_rejected", "cancelled", "out_of_stock"];
  const success: OrderStatus[] = ["delivered", "payment_confirmed", "purchased"];
  const cls = danger.includes(status)
    ? "bg-red-100 text-red-700"
    : success.includes(status)
    ? "bg-green-100 text-green-700"
    : "bg-amber-100 text-amber-700";
  return <span className={`badge ${cls}`}>{ORDER_STATUS_LABELS[status]}</span>;
}
