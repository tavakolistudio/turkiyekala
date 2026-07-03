-- =====================================================================
-- TurkiyeKala — Grants
-- وقتی جدول‌ها از طریق API/مایگریشن ساخته می‌شوند، لازم است دسترسی نقش‌های
-- Supabase (service_role / authenticated / anon) روی همان جدول‌ها اعطا شود.
-- کنترل ردیف‌ها همچنان با RLS است؛ این فقط دسترسی سطح‌جدول را می‌دهد.
-- =====================================================================

grant all on table
  products, shopping_products, orders, order_status_logs, settings, admin_users
  to service_role;

grant select, insert, update, delete on table
  products, shopping_products, orders, order_status_logs, settings, admin_users
  to authenticated, anon;

grant all on sequence tk_order_seq to service_role, authenticated, anon;
