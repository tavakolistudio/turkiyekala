// =====================================================================
// انواع مشترک پروژه
// =====================================================================

export type ProductStatus = "active" | "inactive" | "out_of_stock" | "needs_inquiry";
export type PriceType = "fixed" | "estimate";
export type ShoppingAvailability = "available" | "needs_review" | "out_of_stock" | "unknown";
export type ShoppingPublish = "draft" | "published" | "hidden";
export type OrderType = "product_order" | "shopping_product_order" | "link_order";

export type OrderStatus =
  | "pending_review"
  | "awaiting_payment"
  | "receipt_submitted"
  | "payment_confirmed"
  | "payment_rejected"
  | "buying_from_turkey"
  | "purchased"
  | "awaiting_carrier"
  | "handed_to_carrier_tr"
  | "in_transit_to_tehran"
  | "arrived_tehran"
  | "ready_domestic_shipping"
  | "handed_to_domestic"
  | "delivered"
  | "cancelled"
  | "out_of_stock"
  | "refunded";

// ترتیب و برچسب فارسی وضعیت‌های سفارش
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending_review",
  "awaiting_payment",
  "receipt_submitted",
  "payment_confirmed",
  "payment_rejected",
  "buying_from_turkey",
  "purchased",
  "awaiting_carrier",
  "handed_to_carrier_tr",
  "in_transit_to_tehran",
  "arrived_tehran",
  "ready_domestic_shipping",
  "handed_to_domestic",
  "delivered",
  "cancelled",
  "out_of_stock",
  "refunded",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_review: "در انتظار بررسی",
  awaiting_payment: "در انتظار پرداخت",
  receipt_submitted: "رسید پرداخت ثبت شد",
  payment_confirmed: "پرداخت تأیید شد",
  payment_rejected: "پرداخت رد شد",
  buying_from_turkey: "در حال خرید از ترکیه",
  purchased: "خریداری شد",
  awaiting_carrier: "در انتظار تحویل به باربری",
  handed_to_carrier_tr: "تحویل باربری ترکیه شد",
  in_transit_to_tehran: "در مسیر تهران",
  arrived_tehran: "رسیده به تهران",
  ready_domestic_shipping: "آماده ارسال داخلی ایران",
  handed_to_domestic: "تحویل پست / تیپاکس / پیک شد",
  delivered: "تحویل مشتری شد",
  cancelled: "لغو شد",
  out_of_stock: "ناموجود شد",
  refunded: "مبلغ بازگشت داده شد",
};

// مراحلی که در تایم‌لاین مثبت پیشرفت محسوب می‌شوند
export const TIMELINE_STEPS: OrderStatus[] = [
  "pending_review",
  "awaiting_payment",
  "payment_confirmed",
  "buying_from_turkey",
  "purchased",
  "handed_to_carrier_tr",
  "in_transit_to_tehran",
  "arrived_tehran",
  "ready_domestic_shipping",
  "handed_to_domestic",
  "delivered",
];

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  product_order: "محصول آماده",
  shopping_product_order: "محصول Shopping",
  link_order: "سفارش با لینک",
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  active: "موجود",
  inactive: "غیرفعال",
  out_of_stock: "ناموجود",
  needs_inquiry: "نیازمند استعلام",
};

export const SHOPPING_AVAILABILITY_LABELS: Record<ShoppingAvailability, string> = {
  available: "آماده سفارش",
  needs_review: "نیازمند بررسی",
  out_of_stock: "ناموجود",
  unknown: "نامشخص",
};

export const SHOPPING_PUBLISH_LABELS: Record<ShoppingPublish, string> = {
  draft: "پیش‌نویس",
  published: "منتشرشده",
  hidden: "مخفی",
};

// ---------------------------------------------------------------------
// شکل ردیف‌های دیتابیس
// ---------------------------------------------------------------------
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price_try: number | null;
  manual_final_price_toman: number | null;
  estimated_weight: number | null;
  category: string | null;
  images: string[];
  colors: string[];
  sizes: string[];
  status: ProductStatus;
  price_type: PriceType;
  delivery_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShoppingProduct {
  id: string;
  title: string;
  slug: string;
  source_url: string | null;
  source_domain: string | null;
  source_site_name: string | null;
  brand: string | null;
  description: string | null;
  main_image: string | null;
  images: string[];
  original_price_try: number | null;
  discounted_price_try: number | null;
  discount_percent: number | null;
  estimated_weight: number | null;
  category: string | null;
  colors: string[];
  sizes: string[];
  availability_status: ShoppingAvailability;
  publish_status: ShoppingPublish;
  tags: string[];
  estimated_delivery_time: string | null;
  final_estimated_price_toman: number | null;
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  type: OrderType;
  product_id: string | null;
  shopping_product_id: string | null;
  product_url: string | null;
  source_site_name: string | null;
  product_name: string | null;
  color: string | null;
  size: string | null;
  quantity: number;
  customer_name: string;
  customer_phone: string;
  customer_city: string | null;
  customer_address: string | null;
  postal_code: string | null;
  notes: string | null;
  status: OrderStatus;
  estimated_price_toman: number | null;
  final_price_toman: number | null;
  product_price_try: number | null;
  estimated_weight: number | null;
  real_weight: number | null;
  real_product_cost_try: number | null;
  real_shipping_cost_try: number | null;
  service_fee_toman: number | null;
  received_amount_toman: number | null;
  side_costs_toman: number | null;
  internal_tracking_code: string | null;
  carrier_name: string | null;
  admin_note: string | null;
  payment_receipt_url: string | null;
  payment_note: string | null;
  purchase_date: string | null;
  handed_carrier_date: string | null;
  arrived_tehran_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: number;
  exchange_rate_try_to_toman: number;
  real_exchange_rate_try_to_toman: number;
  shipping_rate_per_kg_try: number;
  service_fee_percent: number;
  minimum_service_fee_toman: number;
  default_delivery_time: string;
  shipping_rules_text: string | null;
  return_rules_text: string | null;
  preorder_enabled: boolean;
  updated_at: string;
}

export interface OrderStatusLog {
  id: string;
  order_id: string;
  old_status: OrderStatus | null;
  new_status: OrderStatus;
  note: string | null;
  created_at: string;
}
