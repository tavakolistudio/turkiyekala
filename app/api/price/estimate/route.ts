import { NextResponse } from "next/server";
import { getSettings } from "@/lib/data";
import { calculateFinalPrice, getDefaultWeight } from "@/lib/pricing";
import { toNumber } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const priceTry = toNumber(body.priceTry);
    const category = typeof body.category === "string" ? body.category : null;
    const weightInput = toNumber(body.weight);

    if (priceTry == null || priceTry <= 0) {
      return NextResponse.json({ error: "قیمت لیر معتبر وارد کنید." }, { status: 400 });
    }

    const settings = await getSettings();
    if (!settings) {
      return NextResponse.json({ error: "تنظیمات نرخ در دسترس نیست." }, { status: 500 });
    }

    const weight = weightInput ?? getDefaultWeight(category);
    const breakdown = calculateFinalPrice(
      priceTry,
      weight,
      settings.exchange_rate_try_to_toman,
      settings.shipping_rate_per_kg_try,
      settings.service_fee_percent,
      settings.minimum_service_fee_toman
    );

    // فقط قیمت نهایی به مشتری برمی‌گردد — هیچ جزئیات داخلی
    return NextResponse.json({ estimatedToman: breakdown.totalToman, weightUsed: weight });
  } catch {
    return NextResponse.json({ error: "خطا در پردازش درخواست." }, { status: 400 });
  }
}
