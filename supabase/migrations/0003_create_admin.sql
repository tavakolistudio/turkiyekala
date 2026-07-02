-- =====================================================================
-- ساخت اولین ادمین
-- =====================================================================
-- مرحله ۱: در داشبورد Supabase → Authentication → Users یک کاربر بسازید
--          (Add user) با ایمیل و رمز عبور دلخواه؛ گزینه Auto Confirm را بزنید.
--
-- مرحله ۲: ایمیل همان کاربر را در دستور زیر بگذارید و اجرا کنید:

insert into admin_users (user_id, role)
select id, 'admin'
from auth.users
where email = 'ADMIN-EMAIL-HERE@example.com'
on conflict (user_id) do nothing;

-- برای بررسی:
-- select u.email, a.role from admin_users a join auth.users u on u.id = a.user_id;
