"use client";

import { useState } from "react";
import OrderSuccessBox from "@/components/OrderSuccessBox";
import type { OrderType } from "@/lib/types";

interface OrderFormProps {
  type: OrderType;
  productId?: string;
  shoppingProductId?: string;
  submitLabel: string;
  successMessage: string;
  // نمایش فیلدهای مربوط به لینک محصول
  showLinkFields?: boolean;
  // مقادیر پیش‌فرض رنگ/سایز از محصول
  colorOptions?: string[];
  sizeOptions?: string[];
}

export default function OrderForm({
  type,
  productId,
  shoppingProductId,
  submitLabel,
  successMessage,
  showLinkFields = false,
  colorOptions = [],
  sizeOptions = [],
}: OrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      type,
      product_id: productId,
      shopping_product_id: shoppingProductId,
      product_url: fd.get("product_url"),
      product_name: fd.get("product_name"),
      source_site_name: fd.get("source_site_name"),
      color: fd.get("color"),
      size: fd.get("size"),
      quantity: fd.get("quantity"),
      notes: fd.get("notes"),
      customer_name: fd.get("customer_name"),
      customer_phone: fd.get("customer_phone"),
      customer_city: fd.get("customer_city"),
      customer_address: fd.get("customer_address"),
      postal_code: fd.get("postal_code"),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ثبت سفارش ناموفق بود.");
      setOrderNumber(data.order_number);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت سفارش.");
    } finally {
      setLoading(false);
    }
  }

  if (orderNumber) {
    return <OrderSuccessBox orderNumber={orderNumber} message={successMessage} />;
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6">
      {showLinkFields && (
        <div className="space-y-4">
          <div>
            <label className="label">لینک محصول *</label>
            <input
              name="product_url"
              className="input"
              dir="ltr"
              placeholder="https://www.trendyol.com/..."
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">نام محصول</label>
              <input name="product_name" className="input" placeholder="اختیاری" />
            </div>
            <div>
              <label className="label">سایت فروشنده</label>
              <input
                name="source_site_name"
                className="input"
                placeholder="اختیاری، مثلاً Trendyol"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">رنگ</label>
          {colorOptions.length ? (
            <select name="color" className="input">
              <option value="">انتخاب کنید</option>
              {colorOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          ) : (
            <input name="color" className="input" placeholder="اختیاری" />
          )}
        </div>
        <div>
          <label className="label">سایز</label>
          {sizeOptions.length ? (
            <select name="size" className="input">
              <option value="">انتخاب کنید</option>
              {sizeOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          ) : (
            <input name="size" className="input" placeholder="اختیاری" />
          )}
        </div>
        <div>
          <label className="label">تعداد</label>
          <input
            name="quantity"
            className="input"
            inputMode="numeric"
            defaultValue="1"
            min={1}
          />
        </div>
      </div>

      <div>
        <label className="label">توضیحات اضافه</label>
        <textarea name="notes" className="input" rows={2} placeholder="اختیاری" />
      </div>

      <hr className="border-slate-100" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">نام و نام خانوادگی *</label>
          <input name="customer_name" className="input" required />
        </div>
        <div>
          <label className="label">شماره موبایل *</label>
          <input
            name="customer_phone"
            className="input"
            dir="ltr"
            inputMode="tel"
            placeholder="09..."
            required
          />
        </div>
        <div>
          <label className="label">شهر مقصد در ایران</label>
          <input name="customer_city" className="input" />
        </div>
        <div>
          <label className="label">کد پستی</label>
          <input name="postal_code" className="input" dir="ltr" placeholder="اختیاری" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">آدرس</label>
          <textarea name="customer_address" className="input" rows={2} placeholder="اختیاری" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "در حال ثبت…" : submitLabel}
      </button>
    </form>
  );
}
