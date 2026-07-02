import { PRICE_INCLUDES_TEXT } from "@/lib/constants";

export default function TrustBox() {
  return (
    <section className="container-tk my-12">
      <div className="rounded-xl border border-accent-600/20 bg-accent-600/5 p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-600/10 text-accent-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
            </svg>
          </span>
          <p className="text-sm leading-7 text-slate-700">{PRICE_INCLUDES_TEXT}</p>
        </div>
      </div>
    </section>
  );
}

// نمایش کوتاه زیر قیمت‌ها
export function PriceIncludesNote() {
  return (
    <p className="mt-2 text-xs leading-6 text-slate-500">{PRICE_INCLUDES_TEXT}</p>
  );
}
