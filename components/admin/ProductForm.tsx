import { upsertProductAction, deleteProductAction } from "@/app/admin/actions";
import { CATEGORIES } from "@/lib/constants";
import type { Product } from "@/lib/types";

// فرم افزودن/ویرایش محصول آماده (Server Component + Server Action)
export default function ProductForm({ product }: { product?: Product }) {
  const p = product;
  return (
    <div className="space-y-4">
      <form action={upsertProductAction} className="card space-y-5 p-6">
        {p && <input type="hidden" name="id" value={p.id} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="نام محصول *">
            <input name="title" defaultValue={p?.title ?? ""} className="input" required />
          </Field>
          <Field label="slug (اختیاری، خودکار ساخته می‌شود)">
            <input name="slug" defaultValue={p?.slug ?? ""} className="input" dir="ltr" />
          </Field>
        </div>

        <Field label="توضیحات">
          <textarea name="description" defaultValue={p?.description ?? ""} className="input" rows={3} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="قیمت کالا (لیر)">
            <input name="price_try" defaultValue={numv(p?.price_try)} className="input" inputMode="decimal" />
          </Field>
          <Field label="قیمت نهایی دستی (تومان)">
            <input name="manual_final_price_toman" defaultValue={numv(p?.manual_final_price_toman)} className="input" inputMode="numeric" />
          </Field>
          <Field label="وزن تقریبی (کیلو)">
            <input name="estimated_weight" defaultValue={numv(p?.estimated_weight)} className="input" inputMode="decimal" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="دسته‌بندی">
            <select name="category" defaultValue={p?.category ?? ""} className="input">
              <option value="">—</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="نوع قیمت">
            <select name="price_type" defaultValue={p?.price_type ?? "estimate"} className="input">
              <option value="fixed">قطعی</option>
              <option value="estimate">حدودی</option>
            </select>
          </Field>
          <Field label="وضعیت">
            <select name="status" defaultValue={p?.status ?? "active"} className="input">
              <option value="active">فعال / موجود</option>
              <option value="inactive">غیرفعال</option>
              <option value="out_of_stock">ناموجود</option>
              <option value="needs_inquiry">نیازمند استعلام</option>
            </select>
          </Field>
        </div>

        <Field label="تصاویر (لینک‌ها با کاما جدا شوند)">
          <textarea name="images" defaultValue={(p?.images ?? []).join(", ")} className="input" dir="ltr" rows={2} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="رنگ‌ها (با کاما)">
            <input name="colors" defaultValue={(p?.colors ?? []).join("، ")} className="input" />
          </Field>
          <Field label="سایزها (با کاما)">
            <input name="sizes" defaultValue={(p?.sizes ?? []).join("، ")} className="input" />
          </Field>
        </div>

        <Field label="زمان تقریبی تحویل">
          <input name="delivery_time" defaultValue={p?.delivery_time ?? ""} className="input" />
        </Field>

        <button type="submit" className="btn-primary">
          {p ? "ذخیره تغییرات" : "افزودن محصول"}
        </button>
      </form>

      {p && (
        <form action={deleteProductAction} className="card p-4">
          <input type="hidden" name="id" value={p.id} />
          <button type="submit" className="text-sm text-red-600 hover:underline">
            حذف این محصول
          </button>
        </form>
      )}
    </div>
  );
}

function numv(v: number | null | undefined): string {
  return v == null ? "" : String(v);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
