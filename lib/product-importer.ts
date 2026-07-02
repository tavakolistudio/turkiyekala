import "server-only";
import { calculateDiscountPercent } from "@/lib/pricing";

// =====================================================================
// وارد کردن اطلاعات محصول از لینک سایت‌های ترکیه‌ای
// روش: Open Graph → JSON-LD → HTML ساده. بدون browser automation.
// در صورت شکست، خطا نمی‌دهد و اطلاعات ناقص/خالی برمی‌گرداند.
// =====================================================================

export interface RawProductData {
  title?: string;
  description?: string;
  brand?: string;
  mainImage?: string;
  images?: string[];
  originalPriceTry?: number;
  discountedPriceTry?: number;
  availability?: string;
  canonicalUrl?: string;
}

export interface NormalizedProduct {
  title: string | null;
  description: string | null;
  brand: string | null;
  main_image: string | null;
  images: string[];
  original_price_try: number | null;
  discounted_price_try: number | null;
  discount_percent: number | null;
  availability_status: "available" | "needs_review" | "out_of_stock" | "unknown";
  source_url: string;
  source_domain: string | null;
  source_site_name: string | null;
  success: boolean;
}

const SITE_NAMES: Record<string, string> = {
  "trendyol.com": "Trendyol",
  "zara.com": "Zara",
  "lcwaikiki.com": "LC Waikiki",
  "lcw.com": "LC Waikiki",
  "hepsiburada.com": "Hepsiburada",
  "hm.com": "H&M",
  "mango.com": "Mango",
  "boyner.com.tr": "Boyner",
  "defacto.com": "DeFacto",
  "koton.com": "Koton",
  "n11.com": "n11",
  "amazon.com.tr": "Amazon TR",
};

export function detectSourceSite(url: string): {
  domain: string | null;
  siteName: string | null;
} {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    for (const key of Object.keys(SITE_NAMES)) {
      if (host === key || host.endsWith("." + key) || host.includes(key)) {
        return { domain: host, siteName: SITE_NAMES[key] };
      }
    }
    return { domain: host, siteName: null };
  } catch {
    return { domain: null, siteName: null };
  }
}

// --- استخراج Open Graph ---
export function extractOpenGraphData(html: string): RawProductData {
  const data: RawProductData = {};
  const metaTag = (property: string): string | undefined => {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]*>`,
      "i"
    );
    const tag = html.match(re)?.[0];
    if (!tag) return undefined;
    return tag.match(/content=["']([^"']*)["']/i)?.[1];
  };

  data.title = metaTag("og:title");
  data.description = metaTag("og:description");
  data.mainImage = metaTag("og:image");
  data.brand = metaTag("product:brand") ?? metaTag("og:brand");
  data.canonicalUrl = metaTag("og:url");

  const amount =
    metaTag("product:price:amount") ??
    metaTag("og:price:amount") ??
    metaTag("product:sale_price:amount");
  if (amount) {
    const n = parseFloat(amount.replace(/[^\d.,]/g, "").replace(",", "."));
    if (!Number.isNaN(n)) data.discountedPriceTry = n;
  }

  const availability = metaTag("product:availability") ?? metaTag("og:availability");
  if (availability) data.availability = availability;

  return data;
}

// --- استخراج JSON-LD Schema.org Product ---
export function extractJsonLdProductData(html: string): RawProductData {
  const data: RawProductData = {};
  const scripts = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];

  for (const match of scripts) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(match[1].trim());
    } catch {
      continue;
    }
    const nodes = Array.isArray(parsed) ? parsed : [parsed];
    for (const node of nodes) {
      const item = findProductNode(node);
      if (!item) continue;

      if (typeof item.name === "string") data.title = item.name;
      if (typeof item.description === "string") data.description = item.description;
      if (typeof item.brand === "string") data.brand = item.brand;
      else if (item.brand && typeof item.brand.name === "string")
        data.brand = item.brand.name;

      if (typeof item.image === "string") data.images = [item.image];
      else if (Array.isArray(item.image))
        data.images = item.image.filter(
          (i: unknown): i is string => typeof i === "string"
        );
      if (data.images?.length) data.mainImage = data.images[0];

      const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
      if (offers) {
        const price = offers.price ?? offers.lowPrice;
        if (price != null) {
          const n = parseFloat(String(price).replace(",", "."));
          if (!Number.isNaN(n)) data.discountedPriceTry = n;
        }
        if (offers.availability) data.availability = String(offers.availability);
      }
      return data;
    }
  }
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findProductNode(node: any): any | null {
  if (!node || typeof node !== "object") return null;
  const type = node["@type"];
  const isProduct = Array.isArray(type)
    ? type.includes("Product")
    : type === "Product";
  if (isProduct) return node;
  if (Array.isArray(node["@graph"])) {
    for (const g of node["@graph"]) {
      const found = findProductNode(g);
      if (found) return found;
    }
  }
  return null;
}

// --- fallback ساده HTML ---
export function extractBasicHtmlData(html: string): RawProductData {
  const data: RawProductData = {};
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (titleTag) data.title = decodeEntities(titleTag.trim());
  const canonical = html
    .match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]
    ?.match(/href=["']([^"']*)["']/i)?.[1];
  if (canonical) data.canonicalUrl = canonical;
  return data;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function mapAvailability(
  raw?: string
): NormalizedProduct["availability_status"] {
  if (!raw) return "needs_review";
  const v = raw.toLowerCase();
  if (v.includes("instock") || v.includes("in_stock") || v.includes("available"))
    return "available";
  if (v.includes("outofstock") || v.includes("out_of_stock") || v.includes("soldout"))
    return "out_of_stock";
  return "needs_review";
}

// --- ترکیب و نرمال‌سازی ---
export function normalizeProductData(
  raw: RawProductData,
  url: string
): NormalizedProduct {
  const { domain, siteName } = detectSourceSite(url);
  const original = raw.originalPriceTry ?? null;
  const discounted = raw.discountedPriceTry ?? null;
  const success = Boolean(raw.title || raw.mainImage || discounted);

  return {
    title: raw.title ?? null,
    description: raw.description ?? null,
    brand: raw.brand ?? null,
    main_image: raw.mainImage ?? (raw.images?.[0] ?? null),
    images: raw.images ?? (raw.mainImage ? [raw.mainImage] : []),
    original_price_try: original,
    discounted_price_try: discounted,
    discount_percent: calculateDiscountPercent(original, discounted),
    availability_status: mapAvailability(raw.availability),
    source_url: raw.canonicalUrl ?? url,
    source_domain: domain,
    source_site_name: siteName,
    success,
  };
}

// --- ورودی اصلی ---
export async function importProductFromUrl(
  url: string
): Promise<NormalizedProduct> {
  let html = "";
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "tr,en;q=0.8",
      },
      redirect: "follow",
      // جلوگیری از تعلیق طولانی
      signal: AbortSignal.timeout(12000),
    });
    if (res.ok) {
      html = await res.text();
    }
  } catch {
    // شکست دریافت → داده خالی برمی‌گردانیم، خطا نمی‌دهیم
  }

  if (!html) {
    return normalizeProductData({}, url);
  }

  // ترکیب سه روش با اولویت: JSON-LD > Open Graph > HTML ساده
  const og = extractOpenGraphData(html);
  const jsonld = extractJsonLdProductData(html);
  const basic = extractBasicHtmlData(html);

  const merged: RawProductData = {
    title: jsonld.title ?? og.title ?? basic.title,
    description: jsonld.description ?? og.description,
    brand: jsonld.brand ?? og.brand,
    mainImage: jsonld.mainImage ?? og.mainImage,
    images: jsonld.images ?? (og.mainImage ? [og.mainImage] : undefined),
    discountedPriceTry: jsonld.discountedPriceTry ?? og.discountedPriceTry,
    availability: jsonld.availability ?? og.availability,
    canonicalUrl: og.canonicalUrl ?? basic.canonicalUrl ?? jsonld.canonicalUrl,
  };

  return normalizeProductData(merged, url);
}

export { calculateDiscountPercent };
