"use client";

import { useEffect, useState } from "react";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { formatToman } from "@/lib/pricing";
import {
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
  type OrderStatus,
  type OrderType,
} from "@/lib/types";

interface TrackedOrder {
  order_number: string;
  type: OrderType;
  product_name: string | null;
  status: OrderStatus;
  estimated_price_toman: number | null;
  final_price_toman: number | null;
  internal_tracking_code: string | null;
  carrier_name: string | null;
  customer_hint: string;
  timeline: { new_status: OrderStatus; note?: string | null; created_at?: string }[];
}

export default function TrackForm({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null);

  async function search(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setOrders(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "سفارشی یافت نشد.");
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در پیگیری.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery) search(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(query);
        }}
        className="card flex flex-col gap-3 p-5 sm:flex-row"
      >
        <input
          className="input"
          placeholder="شماره سفارش (مثلاً TK-10025) یا شماره موبایل"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary sm:w-40" disabled={loading}>
          {loading ? "در حال جستجو…" : "پیگیری"}
        </button>
      </form>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {orders?.map((o) => (
        <div key={o.order_number} className="card p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400">شماره سفارش</span>
              <div className="text-lg font-bold text-brand-700">{o.order_number}</div>
            </div>
            <span className="badge bg-brand-700 text-white">
              {ORDER_STATUS_LABELS[o.status]}
            </span>
          </div>

          <dl className="mb-5 grid gap-3 text-sm sm:grid-cols-2">
            <Row label="نوع سفارش" value={ORDER_TYPE_LABELS[o.type]} />
            <Row label="محصول" value={o.product_name ?? "—"} />
            <Row label="مشتری" value={o.customer_hint} />
            <Row
              label="قیمت"
              value={
                o.final_price_toman != null
                  ? formatToman(o.final_price_toman) + " (نهایی)"
                  : o.estimated_price_toman != null
                  ? formatToman(o.estimated_price_toman) + " (حدودی)"
                  : "در حال بررسی"
              }
            />
            {o.internal_tracking_code && (
              <Row label="کد رهگیری داخلی" value={o.internal_tracking_code} />
            )}
            {o.carrier_name && <Row label="باربری/مسافر" value={o.carrier_name} />}
          </dl>

          {o.status === "awaiting_payment" && (
            <div className="mb-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
              سفارش شما در انتظار پرداخت است. لطفاً برای دریافت اطلاعات پرداخت با
              پشتیبانی هماهنگ کنید.
            </div>
          )}

          <h4 className="mb-3 text-sm font-bold text-slate-700">روند سفارش</h4>
          <OrderStatusTimeline timeline={o.timeline} />
        </div>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
