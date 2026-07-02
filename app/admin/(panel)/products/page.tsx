import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatTry } from "@/lib/pricing";
import { PRODUCT_STATUS_LABELS, type Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  const products = (data as Product[]) ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">محصولات آماده</h1>
        <Link href="/admin/products/new" className="btn-primary">افزودن محصول</Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3 text-right">نام</th>
              <th className="p-3 text-right">دسته</th>
              <th className="p-3 text-right">قیمت لیر</th>
              <th className="p-3 text-right">نوع قیمت</th>
              <th className="p-3 text-right">وضعیت</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-700">{p.title}</td>
                <td className="p-3 text-slate-600">{p.category ?? "—"}</td>
                <td className="p-3 text-slate-600">{formatTry(p.price_try)}</td>
                <td className="p-3 text-slate-600">
                  {p.price_type === "fixed" ? "قطعی" : "حدودی"}
                </td>
                <td className="p-3">
                  <span className="badge bg-slate-100 text-slate-600">
                    {PRODUCT_STATUS_LABELS[p.status]}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="text-accent-700 hover:underline">
                    ویرایش
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  محصولی ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
