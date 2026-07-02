import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  SHOPPING_AVAILABILITY_LABELS,
  SHOPPING_PUBLISH_LABELS,
  type ShoppingProduct,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminShoppingProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ publish?: string; availability?: string; q?: string }>;
}) {
  const { publish, availability, q } = await searchParams;
  const supabase = await createServerSupabase();

  let query = supabase
    .from("shopping_products")
    .select("*")
    .order("created_at", { ascending: false });
  if (publish) query = query.eq("publish_status", publish);
  if (availability) query = query.eq("availability_status", availability);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data } = await query.limit(200);
  const products = (data as ShoppingProduct[]) ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">محصولات Shopping</h1>
        <div className="flex gap-2">
          <Link href="/admin/import-product" className="btn-primary">افزودن از لینک</Link>
          <Link href="/admin/shopping-products/new" className="btn-outline">افزودن دستی</Link>
        </div>
      </div>

      <form className="card mb-4 grid gap-3 p-4 md:grid-cols-4">
        <input name="q" defaultValue={q ?? ""} className="input" placeholder="جستجوی عنوان" />
        <select name="publish" defaultValue={publish ?? ""} className="input">
          <option value="">همه وضعیت انتشار</option>
          {Object.entries(SHOPPING_PUBLISH_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select name="availability" defaultValue={availability ?? ""} className="input">
          <option value="">همه موجودی‌ها</option>
          {Object.entries(SHOPPING_AVAILABILITY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button type="submit" className="btn-brand">فیلتر</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3 text-right">عنوان</th>
              <th className="p-3 text-right">سایت</th>
              <th className="p-3 text-right">انتشار</th>
              <th className="p-3 text-right">موجودی</th>
              <th className="p-3 text-right">لینک</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-700">
                  <span className="line-clamp-1 max-w-[220px]">{p.title}</span>
                </td>
                <td className="p-3 text-slate-600">{p.source_site_name ?? "—"}</td>
                <td className="p-3">
                  <span className="badge bg-slate-100 text-slate-600">
                    {SHOPPING_PUBLISH_LABELS[p.publish_status]}
                  </span>
                </td>
                <td className="p-3">
                  <span className="badge bg-amber-100 text-amber-700">
                    {SHOPPING_AVAILABILITY_LABELS[p.availability_status]}
                  </span>
                </td>
                <td className="p-3">
                  {p.source_url ? (
                    <a href={p.source_url} target="_blank" rel="noreferrer" className="text-accent-700 hover:underline">
                      مشاهده
                    </a>
                  ) : "—"}
                </td>
                <td className="p-3">
                  <Link href={`/admin/shopping-products/${p.id}`} className="text-accent-700 hover:underline">
                    ویرایش
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  محصولی یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
