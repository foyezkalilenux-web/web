"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  Award,
  ShoppingCart,
  MonitorCheck,
  LogOut,
  MapPin,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/staff-login");
  };

  const navItems = [
    { label: "ড্যাশবোর্ড (Dashboard)", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "প্রোডাক্ট ও ক্যাটালগ", href: "/admin/products", icon: Package },
    { label: "সেন্ট্রাল ইনভেন্টরি স্টক", href: "/admin/inventory", icon: Layers },
    { label: "কাস্টমার মেম্বারশিপ", href: "/admin/members", icon: Users },
    { label: "লয়ালটি ও রিওয়ার্ড রেট", href: "/admin/loyalty", icon: Award },
    { label: "শাখা POS টার্মিনাল", href: "/pos", icon: MonitorCheck, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header with Logo */}
          <div className="h-20 flex items-center px-5 border-b border-slate-800 gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400/40 relative bg-black shrink-0">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white font-serif">আধুনিক ফ্যাশন</h1>
              <p className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">৩ শাখা ম্যানেজমেন্ট</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                    item.highlight
                      ? "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 border border-amber-500/30 my-2"
                      : isActive
                      ? "bg-amber-400 text-slate-950 font-bold shadow"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                {user?.name?.[0] || "আ"}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-white truncate">{user?.name || "অ্যাডমিন স্টাফ"}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.role?.replace("_", " ") || "SUPER ADMIN"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="লগআউট"
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-slate-900/60 backdrop-blur border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>সেন্ট্রাল অ্যাডমিন</span>
            <span>/</span>
            <span className="text-white font-medium capitalize">
              {pathname.split("/").pop()?.replace("-", " ") || "ড্যাশবোর্ড"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              📍 নবীগঞ্জ • ইমামবাড়ী বাজার • চট্টগ্রাম
            </span>
            <Link
              href="/"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
            >
              মূল ওয়েবসাইট দেখুন
            </Link>
          </div>
        </header>

        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
