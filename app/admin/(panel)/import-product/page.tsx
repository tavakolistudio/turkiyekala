import ProductImporterForm from "@/components/admin/ProductImporterForm";

export const dynamic = "force-dynamic";

export default function ImportProductPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-slate-800">افزودن محصول Shopping از لینک</h1>
      <p className="mb-6 text-sm leading-7 text-slate-500">
        لینک محصول از سایت‌های ترکیه‌ای را وارد کنید. سیستم تا حد امکان عنوان،
        تصویر، قیمت و اطلاعات محصول را از طریق Open Graph و JSON-LD دریافت می‌کند.
        اگر دریافت خودکار موفق نبود، اطلاعات را دستی وارد کنید.
      </p>
      <ProductImporterForm />
    </div>
  );
}
