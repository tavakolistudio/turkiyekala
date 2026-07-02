import { updateSettingsAction } from "@/app/admin/actions";
import type { Settings } from "@/lib/types";

export default function SettingsForm({ settings }: { settings: Settings }) {
  return (
    <form action={updateSettingsAction} className="card space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="نرخ تبدیل لیر به تومان (برای مشتری)">
          <input name="exchange_rate_try_to_toman" defaultValue={settings.exchange_rate_try_to_toman} className="input" inputMode="numeric" />
        </Field>
        <Field label="نرخ واقعی / مرجع لیر (داخلی)">
          <input name="real_exchange_rate_try_to_toman" defaultValue={settings.real_exchange_rate_try_to_toman} className="input" inputMode="numeric" />
        </Field>
        <Field label="نرخ باربری هر کیلو از ترکیه تا تهران (لیر)">
          <input name="shipping_rate_per_kg_try" defaultValue={settings.shipping_rate_per_kg_try} className="input" inputMode="numeric" />
        </Field>
        <Field label="درصد کارمزد خدمات">
          <input name="service_fee_percent" defaultValue={settings.service_fee_percent} className="input" inputMode="decimal" />
        </Field>
        <Field label="حداقل کارمزد خدمات (تومان)">
          <input name="minimum_service_fee_toman" defaultValue={settings.minimum_service_fee_toman} className="input" inputMode="numeric" />
        </Field>
        <Field label="زمان تقریبی تحویل پیش‌فرض">
          <input name="default_delivery_time" defaultValue={settings.default_delivery_time} className="input" />
        </Field>
      </div>

      <Field label="متن قوانین ارسال">
        <textarea name="shipping_rules_text" defaultValue={settings.shipping_rules_text ?? ""} className="input" rows={3} />
      </Field>
      <Field label="متن قوانین مرجوعی">
        <textarea name="return_rules_text" defaultValue={settings.return_rules_text ?? ""} className="input" rows={3} />
      </Field>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="preorder_enabled" defaultChecked={settings.preorder_enabled} className="h-4 w-4" />
        پیش‌سفارش فعال باشد
      </label>

      <div className="rounded-lg bg-amber-50 p-3 text-xs leading-6 text-amber-800">
        توجه: نرخ واقعی/مرجع فقط برای محاسبه سود داخلی استفاده می‌شود و هرگز به مشتری
        نمایش داده نمی‌شود.
      </div>

      <button type="submit" className="btn-primary">ذخیره تنظیمات</button>
    </form>
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
