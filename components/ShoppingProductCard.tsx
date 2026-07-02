import Link from "next/link";
import { formatToman, formatTry } from "@/lib/pricing";
import { SHOPPING_AVAILABILITY_LABELS, type ShoppingProduct } from "@/lib/types";

export default function ShoppingProductCard({
  product,
  priceToman,
}: {
  product: ShoppingProduct;
  priceToman: number | null;
}) {
  const outOfStock = product.availability_status === "out_of_stock";
  const hasDiscount =
    product.discounted_price_try != null &&
    product.original_price_try != null &&
    product.discounted_price_try < product.original_price_try;

  return (
    <div className="card flex flex-col overflow-hidden">
      <Link
        href={`/shopping/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-slate-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.main_image ?? product.images[0] ?? "/placeholder.svg"}
          alt={product.title}
          className="h-full w-full object-cover"
        />
        {product.discount_percent != null && (
          <span className="absolute right-2 top-2 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
            {product.discount_percent}٪ تخفیف
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <AvailabilityBadge status={product.availability_status} />
          {product.source_site_name && (
            <span className="badge bg-slate-100 text-slate-600">
              {product.source_site_name}
            </span>
          )}
        </div>

        <Link
          href={`/shopping/${product.slug}`}
          className="mb-1 line-clamp-2 font-bold text-slate-800 hover:text-brand-700"
        >
          {product.title}
        </Link>
        {product.brand && (
          <span className="mb-2 text-xs text-slate-400">{product.brand}</span>
        )}

        <div className="mb-2 flex items-center gap-2 text-sm">
          {hasDiscount && (
            <span className="text-slate-400 line-through">
              {formatTry(product.original_price_try)}
            </span>
          )}
          {product.discounted_price_try != null || product.original_price_try != null ? (
            <span className="font-medium text-slate-600">
              {formatTry(product.discounted_price_try ?? product.original_price_try)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto">
          <p className="text-xs text-slate-500">قیمت حدودی تا تهران</p>
          <p className="text-lg font-extrabold text-brand-700">
            {priceToman != null ? formatToman(priceToman) : "نیازمند بررسی"}
          </p>

          <div className="mt-3">
            {outOfStock ? (
              <span className="btn-disabled w-full">ناموجود</span>
            ) : (
              <Link href={`/shopping/${product.slug}`} className="btn-primary w-full">
                مشاهده و ثبت درخواست خرید
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AvailabilityBadge({ status }: { status: ShoppingProduct["availability_status"] }) {
  const map: Record<ShoppingProduct["availability_status"], string> = {
    available: "bg-green-100 text-green-700",
    needs_review: "bg-amber-100 text-amber-700",
    out_of_stock: "bg-red-100 text-red-700",
    unknown: "bg-slate-100 text-slate-500",
  };
  return (
    <span className={`badge ${map[status]}`}>
      {SHOPPING_AVAILABILITY_LABELS[status]}
    </span>
  );
}
