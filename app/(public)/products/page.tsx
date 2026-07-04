import ProductSearch from "@/components/ProductSearch";
import { getVisibleProducts, getSettings } from "@/lib/data";
import { calculateProductPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "محصولات آماده",
  description:
    "فهرست محصولات آماده سفارش از ترکیه با قیمت تخمینی شامل خرید و ارسال تا تهران. جست‌وجو و انتخاب آسان.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const [products, settings] = await Promise.all([
    getVisibleProducts(),
    getSettings(),
  ]);

  const items = products.map((product) => ({
    product,
    priceToman: settings ? calculateProductPrice(product, settings) : null,
  }));

  return (
    <div className="container-tk py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-700">محصولات آماده</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          محصولات منتخب که برای شما آماده سفارش کرده‌ایم. قیمت‌ها تحویل تهران است.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="py-16 text-center text-slate-400">فعلاً محصولی موجود نیست.</p>
      ) : (
        <ProductSearch items={items} />
      )}
    </div>
  );
}
