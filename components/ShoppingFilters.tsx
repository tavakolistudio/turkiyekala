"use client";

import { useMemo, useState } from "react";
import ShoppingProductCard from "@/components/ShoppingProductCard";
import type { ShoppingProduct } from "@/lib/types";

export interface ShoppingItem {
  product: ShoppingProduct;
  priceToman: number | null;
}

const STATUS_FILTERS = [
  { key: "all", label: "همه" },
  { key: "discount", label: "تخفیف‌دار" },
  { key: "special", label: "پیشنهاد ویژه" },
  { key: "available", label: "آماده سفارش" },
  { key: "needs_review", label: "نیازمند بررسی" },
  { key: "out_of_stock", label: "ناموجود" },
];

const SORTS = [
  { key: "newest", label: "جدیدترین" },
  { key: "discount", label: "بیشترین تخفیف" },
  { key: "cheapest", label: "ارزان‌ترین" },
  { key: "popular", label: "محبوب‌ترین" },
];

export default function ShoppingFilters({ items }: { items: ShoppingItem[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.product.category && set.add(i.product.category));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    let list = items.filter((i) => {
      const p = i.product;
      if (search && !`${p.title} ${p.brand ?? ""}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (category !== "all" && p.category !== category) return false;
      if (status === "discount" && p.discount_percent == null) return false;
      if (status === "special" && !p.tags.includes("پیشنهاد ویژه")) return false;
      if (status === "available" && p.availability_status !== "available") return false;
      if (status === "needs_review" && p.availability_status !== "needs_review") return false;
      if (status === "out_of_stock" && p.availability_status !== "out_of_stock") return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "discount":
          return (b.product.discount_percent ?? 0) - (a.product.discount_percent ?? 0);
        case "cheapest":
          return (a.priceToman ?? Infinity) - (b.priceToman ?? Infinity);
        case "popular":
          return b.product.tags.length - a.product.tags.length;
        default:
          return (
            new Date(b.product.created_at).getTime() -
            new Date(a.product.created_at).getTime()
          );
      }
    });
    return list;
  }, [items, search, category, status, sort]);

  return (
    <div>
      <div className="card mb-6 space-y-4 p-4">
        <input
          className="input"
          placeholder="جستجوی محصول…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">دسته‌بندی</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">همه دسته‌ها</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">مرتب‌سازی</label>
            <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                status === f.key
                  ? "bg-brand-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-slate-400">محصولی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((i) => (
            <ShoppingProductCard key={i.product.id} product={i.product} priceToman={i.priceToman} />
          ))}
        </div>
      )}
    </div>
  );
}
