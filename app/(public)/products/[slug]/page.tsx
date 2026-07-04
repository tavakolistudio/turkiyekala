import Link from "next/link";
import { notFound } from "next/navigation";
import OrderForm from "@/components/forms/OrderForm";
import { getProductBySlug, getSettings } from "@/lib/data";
import { calculateProductPrice, formatToman, formatTry } from "@/lib/pricing";
import { PRICE_INCLUDES_TEXT, ESTIMATE_NOTE_TEXT } from "@/lib/constants";
import { PRODUCT_STATUS_LABELS } from "@/lib/types";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "محصول یافت نشد" };

  const description =
    product.description?.slice(0, 160) ||
    `${product.title} — سفارش از ترکیه با تحویل در تهران. قیمت شامل خرید و ارسال تا تهران.`;

  return {
    title: product.title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: product.title,
      description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ]);

  if (!product) notFound();

  const isFixed = product.price_type === "fixed";
  const outOfStock = product.status === "out_of_stock";
  const priceToman = settings ? calculateProductPrice(product, settings) : null;
  const priceLabel = isFixed ? "قیمت نهایی تحویل تهران" : "قیمت حدودی تحویل تهران";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || undefined,
    image: product.images?.length ? product.images : undefined,
    url: `${SITE_URL}/products/${slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "IRR",
      price: priceToman != null ? priceToman * 10 : undefined,
      availability:
        product.status === "out_of_stock"
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
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="card aspect-square overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0] ?? "/placeholder.svg"}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt={`${product.title} — تصویر ${i + 1}`}
                  className="aspect-square w-full rounded-lg border border-slate-200 object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="badge bg-slate-100 text-slate-600">
            {PRODUCT_STATUS_LABELS[product.status]}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-slate-800">{product.title}</h1>

          {product.description && (
            <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>
          )}

          <dl className="mt-4 grid gap-2 text-sm">
            {product.price_try != null && (
              <Info label="قیمت کالا" value={formatTry(product.price_try)} />
            )}
            {product.estimated_weight != null && (
              <Info label="وزن تقریبی" value={`${product.estimated_weight} کیلوگرم`} />
            )}
            {product.delivery_time && (
              <Info label="زمان تقریبی تحویل" value={product.delivery_time} />
            )}
            {product.colors.length > 0 && (
              <Info label="رنگ‌ها" value={product.colors.join("، ")} />
            )}
            {product.sizes.length > 0 && (
              <Info label="سایزها" value={product.sizes.join("، ")} />
            )}
          </dl>

          <div className="mt-5 rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">{priceLabel}</p>
            <p className="text-2xl font-extrabold text-brand-700">
              {priceToman != null ? formatToman(priceToman) : "نیازمند استعلام"}
            </p>
            {!isFixed && (
              <p className="mt-2 text-xs text-slate-500">{ESTIMATE_NOTE_TEXT}</p>
            )}
            <p className="mt-2 text-xs leading-6 text-slate-500">{PRICE_INCLUDES_TEXT}</p>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-slate-800">
              {isFixed ? "ثبت سفارش" : "استعلام و ثبت درخواست"}
            </h2>
            {outOfStock ? (
              <div className="card p-6 text-center text-slate-500">
                این محصول در حال حاضر ناموجود است.
                <div className="mt-3">
                  <Link href="/order-link" className="btn-outline">
                    ثبت سفارش با لینک
                  </Link>
                </div>
              </div>
            ) : (
              <OrderForm
                type="product_order"
                productId={product.id}
                submitLabel={isFixed ? "ثبت سفارش" : "استعلام و ثبت درخواست"}
                successMessage={
                  isFixed
                    ? "سفارش شما ثبت شد. برای هماهنگی پرداخت با شما تماس گرفته می‌شود."
                    : "درخواست شما ثبت شد. قیمت نهایی پس از بررسی برای شما ارسال خواهد شد."
                }
                colorOptions={product.colors}
                sizeOptions={product.sizes}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-1.5">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-700">{value}</dd>
    </div>
  );
}
