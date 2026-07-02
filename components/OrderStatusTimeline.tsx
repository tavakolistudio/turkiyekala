import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface TimelineEntry {
  new_status: OrderStatus;
  note?: string | null;
  created_at?: string;
}

export default function OrderStatusTimeline({
  timeline,
}: {
  timeline: TimelineEntry[];
}) {
  if (!timeline.length) return null;
  return (
    <ol className="relative space-y-4 border-r border-slate-200 pr-5">
      {timeline.map((t, i) => {
        const isLast = i === timeline.length - 1;
        return (
          <li key={i} className="relative">
            <span
              className={`absolute -right-[26px] top-1 grid h-3 w-3 place-items-center rounded-full ${
                isLast ? "bg-accent-600 ring-4 ring-accent-600/20" : "bg-slate-300"
              }`}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`text-sm font-medium ${
                  isLast ? "text-brand-700" : "text-slate-600"
                }`}
              >
                {ORDER_STATUS_LABELS[t.new_status]}
              </span>
              {t.created_at && (
                <span className="text-xs text-slate-400">{formatDate(t.created_at)}</span>
              )}
            </div>
            {t.note && <p className="mt-1 text-xs text-slate-500">{t.note}</p>}
          </li>
        );
      })}
    </ol>
  );
}
