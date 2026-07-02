import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-tk grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2 font-bold text-brand-700">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-white">
              TK
            </span>
            TurkiyeKala
          </div>
          <p className="text-sm leading-6 text-slate-500">
            خرید از ترکیه، تحویل در ایران. لینک محصول را بفرستید یا از پیشنهادهای
            تخفیف‌دار انتخاب کنید؛ ما خرید، ارسال تا تهران و پیگیری سفارش را انجام
            می‌دهیم.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-800">دسترسی سریع</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/shopping" className="hover:text-brand-700">Shopping</Link></li>
            <li><Link href="/products" className="hover:text-brand-700">محصولات آماده</Link></li>
            <li><Link href="/order-link" className="hover:text-brand-700">ثبت سفارش با لینک</Link></li>
            <li><Link href="/track" className="hover:text-brand-700">پیگیری سفارش</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-800">اطلاعات</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/rules" className="hover:text-brand-700">قوانین خرید و ارسال</Link></li>
            <li><Link href="/faq" className="hover:text-brand-700">سوالات پرتکرار</Link></li>
            <li><Link href="/contact" className="hover:text-brand-700">تماس با ما</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4">
        <p className="container-tk text-center text-xs text-slate-400">
          © {new Date().getFullYear()} TurkiyeKala — تمام حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
