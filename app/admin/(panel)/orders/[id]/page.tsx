import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSettings } from "@/lib/data";
import { updateOrderAction } from "@/app/admin/actions";
import FinancialSummaryBox from "@/components/admin/FinancialSummaryBox";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { formatDate } from "@/lib/utils";
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
  type Order,
  type OrderStatusLog,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: orderData } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const order = orderData as Order | null;
  if (!order) notFound();

  const [{ data: logsData }, settings] = await Promise.all([
    supabase
      .from("order_status_logs")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
    getSettings(),
  ]);
  const logs = (logsData as OrderStatusLog[]) ?? [];

  const dateVal = (d: string | null) => (d ? d.slice(0, 10) : "");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="text-sm text-slate-500 hover:underline">
            ← بازگشت به سفارش‌ها
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-brand-700">{order.order_number}</h1>
          <p className="text-sm text-slate-500">{ORDER_TYPE_LABELS[order.type]}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* اطلاعات مشتری و سفارش */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-5">
            <h3 className="mb-4 font-bold text-slate-800">اطلاعات مشتری و سفارش</h3>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <Info label="نام مشتری" value={order.customer_name} />
              <Info label="موبایل" value={order.customer_phone} ltr />
              <Info label="شهر" value={order.customer_city ?? "—"} />
              <Info label="کد پستی" value={order.postal_code ?? "—"} ltr />
              <Info label="محصول" value={order.product_name ?? "—"} />
              <Info label="رنگ / سایز" value={`${order.color ?? "—"} / ${order.size ?? "—"}`} />
              <Info label="تعداد" value={String(order.quantity)} />
              <Info label="قیمت کالا (لیر)" value={order.product_price_try?.toString() ?? "—"} />
              <div className="sm:col-span-2">
                <Info label="آدرس" value={order.customer_address ?? "—"} />
              </div>
              {order.product_url && (
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">لینک محصول</dt>
                  <a href={order.product_url} target="_blank" rel="noreferrer" dir="ltr" className="break-all text-accent-700 hover:underline">
                    {order.product_url}
                  </a>
                </div>
              )}
              {order.notes && (
                <div className="sm:col-span-2">
                  <Info label="توضیحات مشتری" value={order.notes} />
                </div>
              )}
            </dl>
          </div>

          {/* فرم ویرایش */}
          <form action={updateOrderAction} className="card space-y-5 p-5">
            <input type="hidden" name="id" value={order.id} />
            <h3 className="font-bold text-slate-800">ویرایش و مدیریت</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="وضعیت سفارش">
                <select name="status" defaultValue={order.status} className="input">
                  {ORDER_STATUS_FLOW.map((st) => (
                    <option key={st} value={st}>{ORDER_STATUS_LABELS[st]}</option>
                  ))}
                </select>
              </Field>
              <Field label="یادداشت این تغییر (در تاریخچه ثبت می‌شود)">
                <input name="admin_note" className="input" placeholder="اختیاری" />
              </Field>

              <Field label="قیمت نهایی اعلام‌شده (تومان)">
                <input name="final_price_toman" defaultValue={numv(order.final_price_toman)} className="input" inputMode="numeric" />
              </Field>
              <Field label="قیمت حدودی (تومان)">
                <input name="estimated_price_toman" defaultValue={numv(order.estimated_price_toman)} className="input" inputMode="numeric" />
              </Field>

              <Field label="مبلغ دریافتی از مشتری (تومان)">
                <input name="received_amount_toman" defaultValue={numv(order.received_amount_toman)} className="input" inputMode="numeric" />
              </Field>
              <Field label="کارمزد خدمات (تومان)">
                <input name="service_fee_toman" defaultValue={numv(order.service_fee_toman)} className="input" inputMode="numeric" />
              </Field>

              <Field label="وزن واقعی (کیلو)">
                <input name="real_weight" defaultValue={numv(order.real_weight)} className="input" inputMode="decimal" />
              </Field>
              <Field label="هزینه واقعی کالا (لیر)">
                <input name="real_product_cost_try" defaultValue={numv(order.real_product_cost_try)} className="input" inputMode="decimal" />
              </Field>
              <Field label="هزینه واقعی باربری (لیر)">
                <input name="real_shipping_cost_try" defaultValue={numv(order.real_shipping_cost_try)} className="input" inputMode="decimal" />
              </Field>
              <Field label="هزینه‌های جانبی (تومان)">
                <input name="side_costs_toman" defaultValue={numv(order.side_costs_toman)} className="input" inputMode="numeric" />
              </Field>

              <Field label="کد رهگیری داخلی ایران">
                <input name="internal_tracking_code" defaultValue={order.internal_tracking_code ?? ""} className="input" dir="ltr" />
              </Field>
              <Field label="نام باربری / مسافر">
                <input name="carrier_name" defaultValue={order.carrier_name ?? ""} className="input" />
              </Field>

              <Field label="لینک رسید پرداخت">
                <input name="payment_receipt_url" defaultValue={order.payment_receipt_url ?? ""} className="input" dir="ltr" />
              </Field>
              <Field label="یادداشت پرداخت">
                <input name="payment_note" defaultValue={order.payment_note ?? ""} className="input" />
              </Field>

              <Field label="تاریخ خرید">
                <input type="date" name="purchase_date" defaultValue={dateVal(order.purchase_date)} className="input" />
              </Field>
              <Field label="تاریخ تحویل به باربری">
                <input type="date" name="handed_carrier_date" defaultValue={dateVal(order.handed_carrier_date)} className="input" />
              </Field>
              <Field label="تاریخ رسیدن به تهران">
                <input type="date" name="arrived_tehran_date" defaultValue={dateVal(order.arrived_tehran_date)} className="input" />
              </Field>
            </div>

            <button type="submit" className="btn-primary">ذخیره تغییرات</button>
          </form>
        </div>

        {/* ستون کناری: مالی + تایم‌لاین */}
        <div className="space-y-6">
          {settings && <FinancialSummaryBox order={order} settings={settings} />}

          {order.payment_receipt_url && (
            <div className="card p-5">
              <h3 className="mb-3 font-bold text-slate-800">رسید پرداخت</h3>
              <a href={order.payment_receipt_url} target="_blank" rel="noreferrer" dir="ltr" className="break-all text-sm text-accent-700 hover:underline">
                {order.payment_receipt_url}
              </a>
            </div>
          )}

          <div className="card p-5">
            <h3 className="mb-4 font-bold text-slate-800">تاریخچه وضعیت</h3>
            {logs.length ? (
              <OrderStatusTimeline
                timeline={logs.map((l) => ({
                  new_status: l.new_status,
                  note: l.note,
                  created_at: l.created_at,
                }))}
              />
            ) : (
              <p className="text-sm text-slate-400">تاریخچه‌ای ثبت نشده است.</p>
            )}
            <p className="mt-4 text-xs text-slate-400">
              ثبت سفارش: {formatDate(order.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function numv(v: number | null): string {
  return v == null ? "" : String(v);
}

function Info({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-700" dir={ltr ? "ltr" : undefined}>{value}</dd>
    </div>
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
