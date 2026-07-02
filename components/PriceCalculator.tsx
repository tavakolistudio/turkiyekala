"use client";

import { useState } from "react";
import { CATEGORIES, ESTIMATE_NOTE_TEXT, PRICE_INCLUDES_TEXT } from "@/lib/constants";
import { formatToman } from "@/lib/pricing";

export default function PriceCalculator() {
  const [priceTry, setPriceTry] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function calculate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/price/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceTry, category, weight }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در محاسبه");
      setResult(data.estimatedToman);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در محاسبه");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-tk py-14" id="calculator">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-2 text-center text-2xl font-bold text-brand-700">
          ماشین حساب قیمت حدودی
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500">
          قیمت لیر، نوع کالا و وزن تقریبی را وارد کنید تا قیمت حدودی تحویل تهران را
          ببینید.
        </p>

        <form onSubmit={calculate} className="card space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">قیمت کالا به لیر</label>
              <input
                className="input"
                inputMode="decimal"
                placeholder="مثلاً ۱۰۰۰"
                value={priceTry}
                onChange={(e) => setPriceTry(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">نوع کالا</label>
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">وزن تقریبی (کیلو)</label>
              <input
                className="input"
                inputMode="decimal"
                placeholder="اختیاری"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "در حال محاسبه…" : "محاسبه قیمت حدودی"}
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {result != null && (
            <div className="rounded-lg bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">قیمت حدودی تحویل تهران</p>
              <p className="mt-1 text-2xl font-extrabold text-accent-700">
                {formatToman(result)}
              </p>
              <p className="mt-3 text-xs leading-6 text-slate-500">{ESTIMATE_NOTE_TEXT}</p>
            </div>
          )}

          <p className="text-[11px] leading-6 text-slate-400">{PRICE_INCLUDES_TEXT}</p>
        </form>
      </div>
    </section>
  );
}
