import ShoppingFilters, { type ShoppingItem } from "@/components/ShoppingFilters";
import { getPublishedShoppingProducts, getSettings } from "@/lib/data";
import { calculateShoppingEstimatedPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shopping — پیشنهادهای تخفیف‌دار",
  description:
    "محصولات منتخب و تخفیف‌دار از فروشگاه‌های ترکیه با قیمت تخمینی شامل خرید و ارسال تا تهران. سفارش سریع و آسان.",
  alternates: { canonical: "/shopping" },
};

export default async function ShoppingPage() {
  const [products, settings] = await Promise.all([
    getPublishedShoppingProducts(),
    getSettings(),
  ]);

  const items: ShoppingItem[] = products.map((product) => ({
    product,
    priceToman:
      product.final_estimated_price_toman ??
      (settings ? calculateShoppingEstimatedPrice(product, settings) : null),
  }));

  return (
    <div className="container-tk py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-700">Shopping</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          این محصولات «پیشنهاد خرید از ترکیه» هستند و از سایت فروشنده اصلی تهیه
          می‌شوند. قیمت‌ها حدودی تا تهران است و قبل از خرید نهایی تأیید می‌شود.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="py-16 text-center text-slate-400">فعلاً محصولی منتشر نشده است.</p>
      ) : (
        <ShoppingFilters items={items} />
      )}
    </div>
  );
}
