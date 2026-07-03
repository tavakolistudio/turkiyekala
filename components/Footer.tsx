import Link from "next/link";
import Image from "next/image";
import { CONTACT, POWERED_BY } from "@/lib/contact";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-tk grid gap-8 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="mb-3 flex items-center gap-2 font-bold text-brand-700">
            <Image
              src="/logo.png"
              alt="TurkiyeKala"
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg object-contain"
            />
            TurkiyeKala
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            خرید از ترکیه، تحویل در ایران. لینک محصول را بفرستید یا از پیشنهادهای
            تخفیف‌دار انتخاب کنید؛ ما خرید، ارسال تا تهران و پیگیری سفارش را انجام
            می‌دهیم.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a
              href={CONTACT.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-600 px-3 py-1.5 font-medium text-white hover:bg-green-700"
            >
              واتساپ
            </a>
            <a
              href={CONTACT.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:text-brand-700"
            >
              اینستاگرام
            </a>
            <a
              href={CONTACT.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:text-brand-700"
            >
              تلگرام
            </a>
          </div>
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
        <p className="container-tk flex flex-col items-center justify-center gap-1 text-center text-xs text-slate-400 sm:flex-row sm:gap-2">
          <span>© {new Date().getFullYear()} TurkiyeKala — تمام حقوق محفوظ است.</span>
          <span className="hidden sm:inline">·</span>
          <span dir="ltr">
            Powered by{" "}
            <a
              href={POWERED_BY.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              {POWERED_BY.label}
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
