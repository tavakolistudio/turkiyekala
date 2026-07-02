"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export interface ProductItem {
  product: Product;
  priceToman: number | null;
}

export default function ProductSearch({ items }: { items: ProductItem[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.product.category && set.add(i.product.category));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        if (category !== "all" && i.product.category !== category) return false;
        if (
          search &&
          !`${i.product.title} ${i.product.category ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [items, search, category]
  );

  return (
    <div>
      <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-3">
        <input
          className="input sm:col-span-2"
          placeholder="جستجوی محصول…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">همه دسته‌ها</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-slate-400">محصولی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((i) => (
            <ProductCard key={i.product.id} product={i.product} priceToman={i.priceToman} />
          ))}
        </div>
      )}
    </div>
  );
}
