import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  let product: Product | undefined;
  if (!isNew) {
    const supabase = await createServerSupabase();
    const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    product = data as Product;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/products" className="text-sm text-slate-500 hover:underline">
        ← بازگشت به محصولات
      </Link>
      <h1 className="mb-6 mt-1 text-2xl font-bold text-slate-800">
        {isNew ? "افزودن محصول آماده" : "ویرایش محصول"}
      </h1>
      <ProductForm product={product} />
    </div>
  );
}
