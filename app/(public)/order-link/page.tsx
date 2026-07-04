import OrderForm from "@/components/forms/OrderForm";
import { PRICE_INCLUDES_TEXT } from "@/lib/constants";

export const metadata = {
  title: "ثبت سفارش با لینک",
  description:
    "لینک محصول موردنظر از فروشگاه‌های ترکیه را بفرستید تا خرید، ارسال تا تهران و پیگیری سفارش را برایتان انجام دهیم.",
  alternates: { canonical: "/order-link" },
};

export default function OrderLinkPage() {
  return (
    <div className="container-tk py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-brand-700">ثبت سفارش با لینک</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          هر محصولی از سایت‌های ترکیه‌ای دیدید، لینک آن را ارسال کنید تا قیمت نهایی
          بررسی و برای شما اعلام شود.
        </p>

        <div className="mt-6">
          <OrderForm
            type="link_order"
            showLinkFields
            submitLabel="ثبت سفارش با لینک"
            successMessage="سفارش شما ثبت شد و در انتظار بررسی قیمت نهایی است. نتیجه بررسی از طریق پیام یا تماس به شما اعلام می‌شود."
          />
        </div>

        <p className="mt-6 text-xs leading-6 text-slate-400">{PRICE_INCLUDES_TEXT}</p>
      </div>
    </div>
  );
}
