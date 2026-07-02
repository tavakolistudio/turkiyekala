import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-brand-700 to-brand-900 text-white">
      <div className="container-tk py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
            خرید از ترکیه، تحویل در ایران
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
            لینک محصول را بفرستید یا از پیشنهادهای تخفیف‌دار انتخاب کنید؛ ما خرید،
            ارسال تا تهران و پیگیری سفارش را انجام می‌دهیم.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/shopping" className="btn-primary">
              مشاهده Shopping
            </Link>
            <Link
              href="/order-link"
              className="btn bg-white text-brand-700 hover:bg-slate-100"
            >
              ثبت سفارش با لینک
            </Link>
            <Link
              href="/track"
              className="btn border border-white/30 text-white hover:bg-white/10"
            >
              پیگیری سفارش
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
