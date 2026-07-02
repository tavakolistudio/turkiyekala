"use client";

import { useState } from "react";
import ImportedProductPreview from "@/components/admin/ImportedProductPreview";
import ShoppingProductForm, {
  type ShoppingDefaults,
} from "@/components/admin/ShoppingProductForm";
import { CATEGORIES } from "@/lib/constants";
import type { NormalizedProduct } from "@/lib/product-importer";

export default function ProductImporterForm() {
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [publish, setPublish] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NormalizedProduct | null>(null);

  async function fetchInfo(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در دریافت اطلاعات");
      setResult(data.data as NormalizedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  }

  const defaults: ShoppingDefaults | undefined = result
    ? {
        ...result,
        category: category || null,
        estimated_weight: weight ? Number(weight) : null,
        publish_status: publish,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <form onSubmit={fetchInfo} className="card space-y-4 p-6">
        <div>
          <label className="label">لینک محصول *</label>
          <input
            className="input"
            dir="ltr"
            placeholder="https://www.trendyol.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">دسته‌بندی پیشنهادی</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">—</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">وزن تقریبی (کیلو)</label>
            <input className="input" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="اختیاری" />
          </div>
          <div>
            <label className="label">وضعیت انتشار</label>
            <select className="input" value={publish} onChange={(e) => setPublish(e.target.value)}>
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشر شود بعد از بررسی</option>
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-brand" disabled={loading}>
          {loading ? "در حال دریافت…" : "دریافت اطلاعات محصول"}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <ImportedProductPreview data={result} />
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            اطلاعات زیر را بررسی و در صورت نیاز ویرایش کنید، سپس ذخیره نمایید. محصول
            به‌صورت {publish === "published" ? "منتشرشده" : "پیش‌نویس"} ذخیره می‌شود.
          </div>
          <ShoppingProductForm defaults={defaults} />
        </div>
      )}
    </div>
  );
}
