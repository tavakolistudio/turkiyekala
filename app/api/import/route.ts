import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { importProductFromUrl } from "@/lib/product-importer";

// فقط ادمین می‌تواند اطلاعات محصول را از لینک دریافت کند
export async function POST(req: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  let url = "";
  try {
    const body = await req.json();
    url = String(body.url ?? "").trim();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "لینک معتبر وارد کنید." }, { status: 400 });
  }

  const data = await importProductFromUrl(url);
  return NextResponse.json({ ok: true, data });
}
