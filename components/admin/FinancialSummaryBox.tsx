import { calculateOrderFinancials, formatToman } from "@/lib/pricing";
import type { Order, Settings } from "@/lib/types";

export default function FinancialSummaryBox({
  order,
  settings,
}: {
  order: Order;
  settings: Settings;
}) {
  const f = calculateOrderFinancials(order, settings);
  const rows: [string, string][] = [
    ["مبلغ دریافتی از مشتری", formatToman(f.receivedAmountToman)],
    ["هزینه واقعی کالا", formatToman(f.realProductCostToman)],
    ["هزینه واقعی باربری", formatToman(f.realShippingCostToman)],
    ["سود اختلاف نرخ تبدیل", formatToman(f.exchangeMarginToman)],
    ["کارمزد خدمات", formatToman(f.serviceFeeToman)],
    ["هزینه‌های جانبی", formatToman(f.sideCostsToman)],
  ];

  return (
    <div className="card p-5">
      <h3 className="mb-4 font-bold text-slate-800">گزارش مالی سفارش</h3>
      <dl className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between border-b border-slate-100 pb-1.5">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-medium text-slate-700">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex justify-between rounded-lg bg-accent-600/10 p-3">
        <span className="font-bold text-slate-700">سود نهایی تقریبی</span>
        <span className="font-extrabold text-accent-700">
          {formatToman(f.finalProfitToman)}
        </span>
      </div>
    </div>
  );
}
