import type { NormalizedProduct } from "@/lib/product-importer";

export default function ImportedProductPreview({
  data,
}: {
  data: NormalizedProduct;
}) {
  return (
    <div className="card p-4">
      <div className="flex gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          {data.main_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.main_image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-xs text-slate-400">بدون تصویر</div>
          )}
        </div>
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-bold text-slate-800">{data.title ?? "بدون عنوان"}</p>
          {data.source_site_name && (
            <p className="mt-1 text-slate-500">{data.source_site_name}</p>
          )}
          {data.discounted_price_try != null && (
            <p className="mt-1 text-slate-600">قیمت: {data.discounted_price_try} لیر</p>
          )}
        </div>
      </div>
      {!data.success && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-6 text-amber-800">
          اطلاعات محصول به‌صورت خودکار دریافت نشد. لطفاً اطلاعات محصول را دستی وارد
          کنید.
        </div>
      )}
    </div>
  );
}
