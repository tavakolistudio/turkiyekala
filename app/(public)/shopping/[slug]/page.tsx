import { notFound } from "next/navigation";
import ShoppingProductDetails from "@/components/ShoppingProductDetails";
import { getShoppingProductBySlug, getSettings } from "@/lib/data";
import { calculateShoppingEstimatedPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function ShoppingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getShoppingProductBySlug(slug),
    getSettings(),
  ]);

  if (!product) notFound();

  const priceToman =
    product.final_estimated_price_toman ??
    (settings ? calculateShoppingEstimatedPrice(product, settings) : null);

  return (
    <div className="container-tk py-10">
      <ShoppingProductDetails product={product} priceToman={priceToman} />
    </div>
  );
}
