"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@store.com");
  const [password, setPassword] = useState("Admin@123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      if (data.data.user.role === "POS_CASHIER") {
        router.push("/pos");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-xl shadow-amber-500/20 relative bg-black">
          <Image src="/logo.jpg" alt="AF Logo" fill className="object-cover" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white font-serif">আধুনিক ফ্যাশন</h2>
        <p className="text-xs text-amber-400 uppercase tracking-widest font-semibold">
          স্টাফ ও ক্যাশিয়ার পোর্টাল
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/90 py-8 px-6 shadow-2xl border border-slate-800 sm:rounded-3xl sm:px-10 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300">স্টাফ ইমেইল (Email)</label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                  placeholder="admin@store.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">পাসওয়ার্ড (Password)</label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>লগইন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>লগইন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Quick Fill Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
              এক ক্লিকে অটো-ফিল করুন (Quick Fill):
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoAccount("admin@store.com", "Admin@123456")}
                className="py-1.5 px-2 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg border border-slate-700 font-semibold transition text-center"
              >
                👑 সুপার অ্যাডমিন
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount("cashier@store.com", "Cashier@123456")}
                className="py-1.5 px-2 text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg border border-slate-700 font-semibold transition text-center"
              >
                💻 শাখা ক্যাশিয়ার
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount("inventory@store.com", "Inventory@123456")}
                className="py-1.5 px-2 text-[11px] bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg border border-slate-700 font-semibold transition text-center"
              >
                📦 ইনভেন্টরি
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
