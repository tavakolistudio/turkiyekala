"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("ایمیل یا رمز عبور نادرست است.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-brand-900 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <Image
            src="/logo.png"
            alt="TurkiyeKala"
            width={56}
            height={56}
            className="mx-auto mb-3 h-14 w-14 rounded-xl object-contain"
            priority
          />
          <h1 className="text-lg font-bold text-slate-800">ورود به پنل مدیریت</h1>
          <p className="text-sm text-slate-500">TurkiyeKala</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">ایمیل</label>
            <input
              type="email"
              className="input"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">رمز عبور</label>
            <input
              type="password"
              className="input"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-brand w-full" disabled={loading}>
            {loading ? "در حال ورود…" : "ورود"}
          </button>
        </div>
      </form>
    </div>
  );
}
