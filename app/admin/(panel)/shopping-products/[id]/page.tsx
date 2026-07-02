import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ShoppingProductForm from "@/components/admin/ShoppingProductForm";
import type { ShoppingProduct } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminShoppingEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  let product: ShoppingProduct | undefined;
  if (!isNew) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("shopping_products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!data) notFound();
    product = data as ShoppingProduct;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/shopping-products" className="text-sm text-slate-500 hover:underline">
        ← بازگشت به محصولات Shopping
      </Link>
      <h1 className="mb-6 mt-1 text-2xl font-bold text-slate-800">
        {isNew ? "افزودن محصول Shopping" : "ویرایش محصول Shopping"}
      </h1>
      <ShoppingProductForm product={product} />
    </div>
  );
}
