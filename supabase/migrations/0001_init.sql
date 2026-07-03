-- =====================================================================
-- TurkiyeKala — Initial schema
-- خرید از ترکیه، تحویل در ایران
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- ENUMs
-- ---------------------------------------------------------------------
do $$ begin
  create type product_status as enum ('active', 'inactive', 'out_of_stock', 'needs_inquiry');
exception when duplicate_object then null; end $$;

do $$ begin
  create type price_type as enum ('fixed', 'estimate');
exception when duplicate_object then null; end $$;

do $$ begin
  create type shopping_availability as enum ('available', 'needs_review', 'out_of_stock', 'unknown');
exception when duplicate_object then null; end $$;

do $$ begin
  create type shopping_publish as enum ('draft', 'published', 'hidden');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_type as enum ('product_order', 'shopping_product_order', 'link_order');
exception when duplicate_object then null; end $$;

-- وضعیت‌های سفارش (۱۷ حالت طبق مشخصات)
do $$ begin
  create type order_status as enum (
    'pending_review',            -- 1. در انتظار بررسی
    'awaiting_payment',          -- 2. در انتظار پرداخت
    'receipt_submitted',         -- 3. رسید پرداخت ثبت شد
    'payment_confirmed',         -- 4. پرداخت تأیید شد
    'payment_rejected',          -- 5. پرداخت رد شد
    'buying_from_turkey',        -- 6. در حال خرید از ترکیه
    'purchased',                 -- 7. خریداری شد
    'awaiting_carrier',          -- 8. در انتظار تحویل به باربری
    'handed_to_carrier_tr',      -- 9. تحویل باربری ترکیه شد
    'in_transit_to_tehran',      -- 10. در مسیر تهران
    'arrived_tehran',            -- 11. رسیده به تهران
    'ready_domestic_shipping',   -- 12. آماده ارسال داخلی ایران
    'handed_to_domestic',        -- 13. تحویل پست / تیپاکس / پیک شد
    'delivered',                 -- 14. تحویل مشتری شد
    'cancelled',                 -- 15. لغو شد
    'out_of_stock',              -- 16. ناموجود شد
    'refunded'                   -- 17. مبلغ بازگشت داده شد
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Helper: is_admin()
-- ---------------------------------------------------------------------
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from admin_users where user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- products — محصولات آماده سایت
-- ---------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  price_try numeric,                       -- قیمت کالا به لیر
  manual_final_price_toman numeric,        -- قیمت نهایی تومان اگر دستی وارد شود
  estimated_weight numeric,                -- وزن تقریبی (kg)
  category text,
  images jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  status product_status not null default 'active',
  price_type price_type not null default 'estimate',
  delivery_time text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_status_idx on products(status);
create index if not exists products_category_idx on products(category);
drop trigger if exists products_updated_at on products;
create trigger products_updated_at before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- shopping_products — پیشنهادهای وارد شده از لینک
-- ---------------------------------------------------------------------
create table if not exists shopping_products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  source_url text,
  source_domain text,
  source_site_name text,
  brand text,
  description text,
  main_image text,
  images jsonb not null default '[]'::jsonb,
  original_price_try numeric,
  discounted_price_try numeric,
  discount_percent numeric,
  estimated_weight numeric,
  category text,
  colors jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  availability_status shopping_availability not null default 'needs_review',
  publish_status shopping_publish not null default 'draft',
  tags jsonb not null default '[]'::jsonb,
  estimated_delivery_time text,
  final_estimated_price_toman numeric,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists shopping_publish_idx on shopping_products(publish_status);
create index if not exists shopping_category_idx on shopping_products(category);
drop trigger if exists shopping_updated_at on shopping_products;
create trigger shopping_updated_at before update on shopping_products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- orders — سفارش‌ها
-- ---------------------------------------------------------------------
create sequence if not exists tk_order_seq start 10001;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  type order_type not null,
  product_id uuid references products(id) on delete set null,
  shopping_product_id uuid references shopping_products(id) on delete set null,
  product_url text,
  source_site_name text,
  product_name text,
  color text,
  size text,
  quantity integer not null default 1,
  -- اطلاعات مشتری (حساس)
  customer_name text not null,
  customer_phone text not null,
  customer_city text,
  customer_address text,
  postal_code text,
  notes text,
  status order_status not null default 'pending_review',
  -- قیمت نمایشی به مشتری
  estimated_price_toman numeric,
  final_price_toman numeric,
  product_price_try numeric,
  estimated_weight numeric,
  -- مقادیر واقعی / داخلی (فقط ادمین)
  real_weight numeric,
  real_product_cost_try numeric,
  real_shipping_cost_try numeric,
  service_fee_toman numeric,
  received_amount_toman numeric,
  side_costs_toman numeric,
  internal_tracking_code text,
  carrier_name text,
  admin_note text,
  payment_receipt_url text,
  payment_note text,
  -- تاریخ‌های عملیاتی
  purchase_date timestamptz,
  handed_carrier_date timestamptz,
  arrived_tehran_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_type_idx on orders(type);
create index if not exists orders_phone_idx on orders(customer_phone);
create index if not exists orders_number_idx on orders(order_number);

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at before update on orders
  for each row execute function set_updated_at();

-- شماره سفارش خوانا مثل TK-10025
create or replace function set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null then
    new.order_number = 'TK-' || nextval('tk_order_seq')::text;
  end if;
  return new;
end;
$$;
drop trigger if exists orders_set_number on orders;
create trigger orders_set_number before insert on orders
  for each row execute function set_order_number();

-- ---------------------------------------------------------------------
-- order_status_logs — تاریخچه وضعیت
-- ---------------------------------------------------------------------
create table if not exists order_status_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  old_status order_status,
  new_status order_status not null,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists status_logs_order_idx on order_status_logs(order_id);

-- ثبت خودکار تغییر وضعیت در order_status_logs
create or replace function log_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    insert into order_status_logs (order_id, old_status, new_status, note)
    values (new.id, null, new.status, 'ثبت سفارش');
    return new;
  elsif (tg_op = 'UPDATE' and new.status is distinct from old.status) then
    insert into order_status_logs (order_id, old_status, new_status, note)
    values (new.id, old.status, new.status, new.admin_note);
    return new;
  end if;
  return new;
end;
$$;
drop trigger if exists orders_log_status on orders;
create trigger orders_log_status after insert or update on orders
  for each row execute function log_order_status_change();

-- ---------------------------------------------------------------------
-- settings — تنظیمات نرخ (تک‌سطری)
-- ---------------------------------------------------------------------
create table if not exists settings (
  id integer primary key default 1,
  exchange_rate_try_to_toman numeric not null default 4000,        -- نرخ مشتری
  real_exchange_rate_try_to_toman numeric not null default 3700,   -- نرخ مرجع داخلی
  shipping_rate_per_kg_try numeric not null default 400,           -- باربری هر کیلو (لیر)
  service_fee_percent numeric not null default 5,                  -- درصد کارمزد
  minimum_service_fee_toman numeric not null default 250000,       -- حداقل کارمزد
  default_delivery_time text not null default '۷ تا ۱۴ روز کاری',
  shipping_rules_text text,
  return_rules_text text,
  preorder_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);
drop trigger if exists settings_updated_at on settings;
create trigger settings_updated_at before update on settings
  for each row execute function set_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table products enable row level security;
alter table shopping_products enable row level security;
alter table orders enable row level security;
alter table order_status_logs enable row level security;
alter table settings enable row level security;
alter table admin_users enable row level security;

-- products: عموم فقط محصولات فعال را می‌بینند؛ ادمین همه‌کاره
drop policy if exists products_public_read on products;
create policy products_public_read on products
  for select using (status <> 'inactive');
drop policy if exists products_admin_all on products;
create policy products_admin_all on products
  for all using (is_admin()) with check (is_admin());

-- shopping_products: عموم فقط published
drop policy if exists shopping_public_read on shopping_products;
create policy shopping_public_read on shopping_products
  for select using (publish_status = 'published');
drop policy if exists shopping_admin_all on shopping_products;
create policy shopping_admin_all on shopping_products
  for all using (is_admin()) with check (is_admin());

-- orders: عموم فقط می‌توانند ثبت کنند؛ خواندن/ویرایش فقط ادمین
-- (پیگیری عمومی از طریق API سمت‌سرور با service role انجام می‌شود)
drop policy if exists orders_public_insert on orders;
create policy orders_public_insert on orders
  for insert with check (true);
drop policy if exists orders_admin_read on orders;
create policy orders_admin_read on orders
  for select using (is_admin());
drop policy if exists orders_admin_update on orders;
create policy orders_admin_update on orders
  for update using (is_admin()) with check (is_admin());
drop policy if exists orders_admin_delete on orders;
create policy orders_admin_delete on orders
  for delete using (is_admin());

-- order_status_logs: فقط ادمین
drop policy if exists logs_admin_read on order_status_logs;
create policy logs_admin_read on order_status_logs
  for select using (is_admin());

-- settings: فقط ادمین (نرخ‌های داخلی نباید public باشند)
drop policy if exists settings_admin_all on settings;
create policy settings_admin_all on settings
  for all using (is_admin()) with check (is_admin());

-- admin_users: هر ادمین بتواند لیست ادمین‌ها را بخواند
drop policy if exists admin_users_read on admin_users;
create policy admin_users_read on admin_users
  for select using (is_admin());
