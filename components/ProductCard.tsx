import Link from "next/link";
import { formatToman } from "@/lib/pricing";
import { PRODUCT_STATUS_LABELS, type Product } from "@/lib/types";

// قیمت از قبل سمت سرور محاسبه شده تا نرخ داخلی درز نکند
export default function ProductCard({
  product,
  priceToman,
}: {
  product: Product;
  priceToman: number | null;
}) {
  const isFixed = product.price_type === "fixed";
  const outOfStock = product.status === "out_of_stock";
  const needsInquiry = product.status === "needs_inquiry";

  const priceLabel = isFixed ? "قیمت نهایی تحویل تهران" : "قیمت حدودی تا تهران";

  return (
    <div className="card flex flex-col overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0] ?? "/placeholder.svg"}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <StatusBadge status={product.status} />
        </div>
        <Link href={`/products/${product.slug}`} className="mb-1 line-clamp-2 font-bold text-slate-800 hover:text-brand-700">
          {product.title}
        </Link>
        {product.category && (
          <span className="mb-2 text-xs text-slate-400">{product.category}</span>
        )}

        <div className="mt-auto">
          <p className="text-xs text-slate-500">{priceLabel}</p>
          <p className="text-lg font-extrabold text-brand-700">
            {priceToman != null ? formatToman(priceToman) : "نیازمند استعلام"}
          </p>
          {product.delivery_time && (
            <p className="mt-1 text-xs text-slate-400">تحویل: {product.delivery_time}</p>
          )}

          <div className="mt-3">
            {outOfStock ? (
              <span className="btn-disabled w-full">ناموجود</span>
            ) : needsInquiry || !isFixed ? (
              <Link href={`/products/${product.slug}`} className="btn-outline w-full">
                استعلام و ثبت درخواست
              </Link>
            ) : (
              <Link href={`/products/${product.slug}`} className="btn-primary w-full">
                ثبت سفارش
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Product["status"] }) {
  const map: Record<Product["status"], string> = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-slate-100 text-slate-500",
    out_of_stock: "bg-red-100 text-red-700",
    needs_inquiry: "bg-amber-100 text-amber-700",
  };
  return <span className={`badge ${map[status]}`}>{PRODUCT_STATUS_LABELS[status]}</span>;
}
