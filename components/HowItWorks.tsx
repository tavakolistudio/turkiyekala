import Link from "next/link";

const PATHS = [
  {
    title: "از پیشنهادهای تخفیف‌دار انتخاب کنید",
    desc: "محصولات منتخب از سایت‌های ترکیه‌ای با قیمت حدودی تحویل تهران",
    href: "/shopping",
    cta: "مشاهده Shopping",
  },
  {
    title: "لینک محصول را بفرستید",
    desc: "هر محصولی از سایت‌های ترکیه‌ای دیدید، لینک آن را ارسال کنید تا قیمت نهایی بررسی شود.",
    href: "/order-link",
    cta: "ثبت سفارش با لینک",
  },
  {
    title: "سفارش خود را پیگیری کنید",
    desc: "با شماره سفارش یا شماره موبایل، وضعیت سفارش را ببینید.",
    href: "/track",
    cta: "پیگیری سفارش",
  },
];

const STEPS = [
  "محصول یا لینک را ارسال کنید",
  "قیمت نهایی یا حدودی بررسی می‌شود",
  "پرداخت ریالی انجام می‌دهید",
  "ما کالا را از ترکیه خریداری می‌کنیم",
  "سفارش تا تهران ارسال می‌شود",
  "ارسال داخلی ایران با هماهنگی مشتری انجام می‌شود",
];

export default function HowItWorks() {
  return (
    <>
      <section className="container-tk py-14">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-700">
          سه مسیر برای خرید
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {PATHS.map((p, i) => (
            <div key={p.href} className="card flex flex-col p-6">
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mb-2 font-bold text-slate-800">{p.title}</h3>
              <p className="mb-5 flex-1 text-sm leading-7 text-slate-500">{p.desc}</p>
              <Link href={p.href} className="btn-outline w-full">
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-tk">
          <h2 className="mb-8 text-center text-2xl font-bold text-brand-700">
            روند خرید
          </h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 p-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm leading-7 text-slate-700">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
