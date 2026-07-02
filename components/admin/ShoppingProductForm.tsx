import {
  upsertShoppingProductAction,
  deleteShoppingProductAction,
} from "@/app/admin/actions";
import { CATEGORIES } from "@/lib/constants";
import type { ShoppingProduct } from "@/lib/types";

export interface ShoppingDefaults {
  title?: string | null;
  description?: string | null;
  brand?: string | null;
  main_image?: string | null;
  images?: string[];
  original_price_try?: number | null;
  discounted_price_try?: number | null;
  discount_percent?: number | null;
  availability_status?: string | null;
  source_url?: string | null;
  source_domain?: string | null;
  source_site_name?: string | null;
  category?: string | null;
  estimated_weight?: number | null;
  publish_status?: string | null;
}

// فرم افزودن/ویرایش محصول Shopping. defaults از import پر می‌شود.
export default function ShoppingProductForm({
  product,
  defaults,
}: {
  product?: ShoppingProduct;
  defaults?: ShoppingDefaults;
}) {
  const v = <K extends keyof ShoppingProduct & keyof ShoppingDefaults>(
    key: K
  ): string => {
    const raw = product?.[key] ?? defaults?.[key];
    return raw == null ? "" : String(raw);
  };
  const list = (key: "images" | "colors" | "sizes" | "tags"): string => {
    const arr = product?.[key] ?? (key === "images" ? defaults?.images : undefined) ?? [];
    return arr.join("، ");
  };

  return (
    <div className="space-y-4">
      <form action={upsertShoppingProductAction} className="card space-y-5 p-6">
        {product && <input type="hidden" name="id" value={product.id} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="نام محصول *">
            <input name="title" defaultValue={v("title")} className="input" required />
          </Field>
          <Field label="slug (اختیاری)">
            <input name="slug" defaultValue={product?.slug ?? ""} className="input" dir="ltr" />
          </Field>
          <Field label="برند">
            <input name="brand" defaultValue={v("brand")} className="input" />
          </Field>
          <Field label="سایت فروشنده">
            <input name="source_site_name" defaultValue={v("source_site_name")} className="input" />
          </Field>
        </div>

        <Field label="لینک محصول (source_url)">
          <input name="source_url" defaultValue={v("source_url")} className="input" dir="ltr" />
        </Field>
        <input type="hidden" name="source_domain" value={v("source_domain")} />

        <Field label="توضیحات">
          <textarea name="description" defaultValue={v("description")} className="input" rows={3} />
        </Field>

        <Field label="تصویر اصلی (لینک)">
          <input name="main_image" defaultValue={v("main_image")} className="input" dir="ltr" />
        </Field>
        <Field label="تصاویر بیشتر (لینک‌ها با کاما)">
          <textarea name="images" defaultValue={list("images")} className="input" dir="ltr" rows={2} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="قیمت اصلی (لیر)">
            <input name="original_price_try" defaultValue={v("original_price_try")} className="input" inputMode="decimal" />
          </Field>
          <Field label="قیمت تخفیفی (لیر)">
            <input name="discounted_price_try" defaultValue={v("discounted_price_try")} className="input" inputMode="decimal" />
          </Field>
          <Field label="درصد تخفیف">
            <input name="discount_percent" defaultValue={v("discount_percent")} className="input" inputMode="numeric" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="دسته‌بندی">
            <select name="category" defaultValue={v("category")} className="input">
              <option value="">—</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="وزن تقریبی (کیلو)">
            <input name="estimated_weight" defaultValue={v("estimated_weight")} className="input" inputMode="decimal" />
          </Field>
          <Field label="قیمت حدودی نهایی (تومان، اختیاری)">
            <input name="final_estimated_price_toman" defaultValue={product?.final_estimated_price_toman ?? ""} className="input" inputMode="numeric" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="رنگ‌ها (با کاما)">
            <input name="colors" defaultValue={list("colors")} className="input" />
          </Field>
          <Field label="سایزها (با کاما)">
            <input name="sizes" defaultValue={list("sizes")} className="input" />
          </Field>
        </div>

        <Field label="تگ‌ها (با کاما — مثلاً تخفیف‌دار، پیشنهاد ویژه)">
          <input name="tags" defaultValue={list("tags")} className="input" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="وضعیت موجودی">
            <select name="availability_status" defaultValue={v("availability_status") || "needs_review"} className="input">
              <option value="available">آماده سفارش</option>
              <option value="needs_review">نیازمند بررسی</option>
              <option value="out_of_stock">ناموجود</option>
              <option value="unknown">نامشخص</option>
            </select>
          </Field>
          <Field label="وضعیت انتشار">
            <select name="publish_status" defaultValue={v("publish_status") || "draft"} className="input">
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشرشده</option>
              <option value="hidden">مخفی</option>
            </select>
          </Field>
          <Field label="زمان تقریبی تحویل">
            <input name="estimated_delivery_time" defaultValue={product?.estimated_delivery_time ?? ""} className="input" />
          </Field>
        </div>

        <button type="submit" className="btn-primary">
          {product ? "ذخیره تغییرات" : "ذخیره محصول"}
        </button>
      </form>

      {product && (
        <form action={deleteShoppingProductAction} className="card p-4">
          <input type="hidden" name="id" value={product.id} />
          <button type="submit" className="text-sm text-red-600 hover:underline">
            حذف این محصول
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
