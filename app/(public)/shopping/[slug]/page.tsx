import { notFound } from "next/navigation";
import ShoppingProductDetails from "@/components/ShoppingProductDetails";
import { getShoppingProductBySlug, getSettings } from "@/lib/data";
import { calculateShoppingEstimatedPrice } from "@/lib/pricing";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getShoppingProductBySlug(slug);
  if (!product) return { title: "محصول یافت نشد" };

  const description =
    product.description?.slice(0, 160) ||
    `${product.title}${product.brand ? ` از ${product.brand}` : ""} — سفارش از ترکیه با تحویل در تهران.`;
  const image = product.main_image || product.images?.[0];

  return {
    title: product.title,
    description,
    alternates: { canonical: `/shopping/${slug}` },
    openGraph: {
      title: product.title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || undefined,
    image: product.main_image
      ? [product.main_image, ...product.images]
      : product.images.length
        ? product.images
        : undefined,
    brand: product.brand || undefined,
    category: product.category || undefined,
    url: `${SITE_URL}/shopping/${slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "IRR",
      price: priceToman != null ? priceToman * 10 : undefined,
      availability:
        product.availability_status === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  return (
    <div className="container-tk py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ShoppingProductDetails product={product} priceToman={priceToman} />
    </div>
  );
}
