// =====================================================================
// محاسبه قیمت — همه‌ی منطق قیمت‌گذاری اینجا متمرکز است.
// مشتری هرگز نرخ واقعی، سود چنج یا جزئیات داخلی را نمی‌بیند.
// =====================================================================

export interface PricingSettings {
  exchange_rate_try_to_toman: number;
  real_exchange_rate_try_to_toman: number;
  shipping_rate_per_kg_try: number;
  service_fee_percent: number;
  minimum_service_fee_toman: number;
}

// وزن پیش‌فرض بر اساس دسته‌بندی (کیلوگرم)
export const DEFAULT_WEIGHTS: Record<string, number> = {
  "لباس سبک": 0.5,
  "پوشاک": 0.5,
  "شلوار": 0.8,
  "هودی": 0.8,
  "کفش": 1.2,
  "کیف": 1.0,
  "کاپشن": 1.8,
  "لوازم خانه کوچک": 2.0,
  "اکسسوری": 0.3,
};

export function getDefaultWeight(category?: string | null): number {
  if (!category) return 0.5;
  return DEFAULT_WEIGHTS[category] ?? 0.5;
}

// هزینه باربری ترکیه تا تهران به لیر
export function calculateShippingCostTry(
  weight: number,
  shippingRatePerKg: number
): number {
  return round2(weight * shippingRatePerKg);
}

// کارمزد خدمات — بزرگ‌ترِ درصد و حداقل انتخاب می‌شود
export function calculateServiceFee(
  baseAmountToman: number,
  percent: number,
  minimumFee: number
): number {
  const byPercent = (baseAmountToman * percent) / 100;
  return Math.max(byPercent, minimumFee);
}

export interface FinalPriceBreakdown {
  productPriceTry: number;
  shippingCostTry: number;
  liraTotal: number;
  baseToman: number;
  serviceFeeToman: number;
  totalToman: number; // مبلغ پرداختی مشتری (گرد شده)
}

// فرمول اصلی قیمت تحویل تهران
// مبلغ مشتری = (قیمت کالا لیر + وزن×نرخ باربری) × نرخ تبدیل سایت + کارمزد خدمات
export function calculateFinalPrice(
  productPriceTry: number,
  weight: number,
  exchangeRate: number,
  shippingRatePerKg: number,
  serviceFeePercent: number,
  minimumServiceFee: number
): FinalPriceBreakdown {
  const shippingCostTry = calculateShippingCostTry(weight, shippingRatePerKg);
  const liraTotal = productPriceTry + shippingCostTry;
  const baseToman = liraTotal * exchangeRate;
  const serviceFeeToman = calculateServiceFee(
    baseToman,
    serviceFeePercent,
    minimumServiceFee
  );
  const rawTotal = baseToman + serviceFeeToman;
  return {
    productPriceTry,
    shippingCostTry,
    liraTotal,
    baseToman,
    serviceFeeToman,
    totalToman: roundToman(rawTotal),
  };
}

// قیمت حدودی یک محصول Shopping
export function calculateShoppingEstimatedPrice(
  shoppingProduct: {
    original_price_try?: number | null;
    discounted_price_try?: number | null;
    estimated_weight?: number | null;
    category?: string | null;
  },
  settings: PricingSettings
): number | null {
  const priceTry =
    shoppingProduct.discounted_price_try ??
    shoppingProduct.original_price_try ??
    null;
  if (priceTry == null) return null;
  const weight =
    shoppingProduct.estimated_weight ?? getDefaultWeight(shoppingProduct.category);
  return calculateFinalPrice(
    priceTry,
    weight,
    settings.exchange_rate_try_to_toman,
    settings.shipping_rate_per_kg_try,
    settings.service_fee_percent,
    settings.minimum_service_fee_toman
  ).totalToman;
}

// قیمت نمایشی یک محصول آماده (با احتساب قیمت دستی)
export function calculateProductPrice(
  product: {
    manual_final_price_toman?: number | null;
    price_try?: number | null;
    estimated_weight?: number | null;
    category?: string | null;
  },
  settings: PricingSettings
): number | null {
  if (product.manual_final_price_toman != null) {
    return product.manual_final_price_toman;
  }
  if (product.price_try == null) return null;
  const weight = product.estimated_weight ?? getDefaultWeight(product.category);
  return calculateFinalPrice(
    product.price_try,
    weight,
    settings.exchange_rate_try_to_toman,
    settings.shipping_rate_per_kg_try,
    settings.service_fee_percent,
    settings.minimum_service_fee_toman
  ).totalToman;
}

// درصد تخفیف
export function calculateDiscountPercent(
  originalPrice?: number | null,
  discountedPrice?: number | null
): number | null {
  if (!originalPrice || !discountedPrice) return null;
  if (discountedPrice >= originalPrice) return null;
  return Math.round((1 - discountedPrice / originalPrice) * 100);
}

// گزارش سود داخلی یک سفارش (فقط ادمین)
export interface OrderFinancials {
  receivedAmountToman: number;
  realProductCostToman: number;
  realShippingCostToman: number;
  serviceFeeToman: number;
  sideCostsToman: number;
  exchangeMarginToman: number; // سود ناشی از اختلاف نرخ تبدیل
  finalProfitToman: number;
}

export function calculateOrderFinancials(
  order: {
    received_amount_toman?: number | null;
    real_product_cost_try?: number | null;
    real_shipping_cost_try?: number | null;
    service_fee_toman?: number | null;
    side_costs_toman?: number | null;
  },
  settings: PricingSettings
): OrderFinancials {
  const received = order.received_amount_toman ?? 0;
  const realProductTry = order.real_product_cost_try ?? 0;
  const realShippingTry = order.real_shipping_cost_try ?? 0;
  const sideCosts = order.side_costs_toman ?? 0;
  const serviceFee = order.service_fee_toman ?? 0;

  const realRate = settings.real_exchange_rate_try_to_toman;
  const customerRate = settings.exchange_rate_try_to_toman;
  const totalRealTry = realProductTry + realShippingTry;

  // هزینه واقعی به تومان با نرخ مرجع
  const realProductCostToman = realProductTry * realRate;
  const realShippingCostToman = realShippingTry * realRate;

  // سود اختلاف نرخ = مجموع لیری × (نرخ مشتری − نرخ واقعی)
  const exchangeMarginToman = totalRealTry * (customerRate - realRate);

  const finalProfitToman =
    received -
    realProductCostToman -
    realShippingCostToman -
    sideCosts;

  return {
    receivedAmountToman: received,
    realProductCostToman: round0(realProductCostToman),
    realShippingCostToman: round0(realShippingCostToman),
    serviceFeeToman: serviceFee,
    sideCostsToman: sideCosts,
    exchangeMarginToman: round0(exchangeMarginToman),
    finalProfitToman: round0(finalProfitToman),
  };
}

// ---------------------------------------------------------------------
// فرمت‌گذاری
// ---------------------------------------------------------------------
const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toFaDigits(input: string): string {
  return input.replace(/\d/g, (d) => faDigits[Number(d)]);
}

export function formatToman(amount?: number | null): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  const grouped = Math.round(amount).toLocaleString("en-US");
  return toFaDigits(grouped) + " تومان";
}

export function formatTry(amount?: number | null): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  const grouped = Math.round(amount * 100) / 100;
  return toFaDigits(grouped.toLocaleString("en-US")) + " لیر";
}

// ---------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function round0(n: number): number {
  return Math.round(n);
}
// گرد کردن قیمت مشتری به نزدیک‌ترین ۱۰۰۰ تومان
function roundToman(n: number): number {
  return Math.round(n / 1000) * 1000;
}
