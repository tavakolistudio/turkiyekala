import Link from "next/link";
import OrderForm from "@/components/forms/OrderForm";
import { formatToman, formatTry } from "@/lib/pricing";
import { SHOPPING_CONFIRM_TEXT, SHOPPING_PRODUCT_WARNING } from "@/lib/constants";
import { SHOPPING_AVAILABILITY_LABELS, type ShoppingProduct } from "@/lib/types";

export default function ShoppingProductDetails({
  product,
  priceToman,
}: {
  product: ShoppingProduct;
  priceToman: number | null;
}) {
  const images = product.main_image
    ? [product.main_image, ...product.images.filter((i) => i !== product.main_image)]
    : product.images;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* گالری */}
      <div>
        <div className="card aspect-square overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0] ?? "/placeholder.svg"}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={img}
                alt=""
                className="aspect-square w-full rounded-lg border border-slate-200 object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* اطلاعات */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="badge bg-amber-100 text-amber-700">
            {SHOPPING_AVAILABILITY_LABELS[product.availability_status]}
          </span>
          {product.source_site_name && (
            <span className="badge bg-slate-100 text-slate-600">
              {product.source_site_name}
            </span>
          )}
          {product.discount_percent != null && (
            <span className="badge bg-red-100 text-red-700">
              {product.discount_percent}٪ تخفیف
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-800">{product.title}</h1>
        {product.brand && (
          <p className="mt-1 text-sm text-slate-500">برند: {product.brand}</p>
        )}
        {product.description && (
          <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>
        )}

        <dl className="mt-4 grid gap-2 text-sm">
          {product.original_price_try != null && (
            <Info label="قیمت اصلی" value={formatTry(product.original_price_try)} />
          )}
          {product.discounted_price_try != null && (
            <Info label="قیمت تخفیفی" value={formatTry(product.discounted_price_try)} />
          )}
          {product.estimated_weight != null && (
            <Info label="وزن تقریبی" value={`${product.estimated_weight} کیلوگرم`} />
          )}
          {product.estimated_delivery_time && (
            <Info label="زمان تقریبی تحویل" value={product.estimated_delivery_time} />
          )}
          {product.colors.length > 0 && (
            <Info label="رنگ‌ها" value={product.colors.join("، ")} />
          )}
          {product.sizes.length > 0 && (
            <Info label="سایزها" value={product.sizes.join("، ")} />
          )}
        </dl>

        <div className="mt-5 rounded-xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">قیمت حدودی تحویل تهران</p>
          <p className="text-2xl font-extrabold text-brand-700">
            {priceToman != null ? formatToman(priceToman) : "نیازمند بررسی"}
          </p>
          <p className="mt-2 text-xs leading-6 text-slate-500">{SHOPPING_CONFIRM_TEXT}</p>
        </div>

        {product.source_url && (
          <a
            href={product.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-accent-700 hover:underline"
          >
            مشاهده محصول در سایت اصلی ↗
          </a>
        )}

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-800">
          {SHOPPING_PRODUCT_WARNING}
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-slate-800">ثبت درخواست خرید</h2>
          {product.availability_status === "out_of_stock" ? (
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
              type="shopping_product_order"
              shoppingProductId={product.id}
              submitLabel="ثبت درخواست خرید"
              successMessage="درخواست شما ثبت شد. موجودی و قیمت محصول در سایت فروشنده بررسی می‌شود و قیمت نهایی برای شما ارسال خواهد شد."
              colorOptions={product.colors}
              sizeOptions={product.sizes}
            />
          )}
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
