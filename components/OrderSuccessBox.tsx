import Link from "next/link";

export default function OrderSuccessBox({
  orderNumber,
  message,
}: {
  orderNumber: string;
  message: string;
}) {
  return (
    <div className="card border-accent-600/30 bg-accent-600/5 p-6 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-accent-600/10 text-accent-700">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800">سفارش شما ثبت شد</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{message}</p>
      <div className="mt-4 inline-block rounded-lg bg-white px-5 py-3">
        <span className="text-xs text-slate-500">شماره سفارش شما</span>
        <div className="mt-1 text-2xl font-extrabold tracking-wider text-brand-700">
          {orderNumber}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={`/track?q=${orderNumber}`} className="btn-primary">
          پیگیری سفارش
        </Link>
        <Link href="/" className="btn-outline">
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
