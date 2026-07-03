import SettingsForm from "@/components/admin/SettingsForm";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">تنظیمات و نرخ‌ها</h1>
      {settings ? (
        <SettingsForm settings={settings} />
      ) : (
        <p className="text-slate-400">
          ردیف تنظیمات یافت نشد. لطفاً فایل seed را در دیتابیس اجرا کنید.
        </p>
      )}

      <div className="mt-10">
        <h2 className="mb-2 text-lg font-bold text-slate-800">تغییر رمز عبور پنل مدیریت</h2>
        <p className="mb-4 text-sm text-slate-500">
          رمز عبور ورود به پنل مدیریت را از این بخش تغییر دهید.
        </p>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
