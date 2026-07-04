import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 md:flex-row">
      <AdminSidebar email={user.email ?? ""} />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
