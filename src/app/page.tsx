import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  MonitorCheck,
  ShieldCheck,
  QrCode,
  MapPin,
  Phone,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Award,
  Layers,
} from "lucide-react";

export default function Home() {
  const branches = [
    {
      no: "১",
      title: "ওসমানী রোড শাখা",
      location: "ওসমানী রোড, নবীগঞ্জ",
      tag: "শাখা ১",
    },
    {
      no: "২",
      title: "ইমামবাড়ী বাজার শাখা",
      location: "ইমামবাড়ী বাজার, আল-মদিনা মার্কেট",
      tag: "শাখা ২",
    },
    {
      no: "৩",
      title: "চট্টগ্রাম শাখা",
      location: "জলসা মার্কেট, চট্টগ্রাম",
      tag: "শাখা ৩",
    },
  ];

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Top Banner / Announcement */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 px-4 py-2 text-xs font-bold text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 shrink-0" />
        <span>আধুনিক ফ্যাশন — ৩টি শাখায় এবং অনলাইনে একই রেটে লয়ালটি পয়েন্ট ও রিয়েল-টাইম স্টক সুবিধা!</span>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl w-full mx-auto px-4 py-12 space-y-12">
        {/* Brand Hero Header */}
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="inline-block relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl shadow-amber-500/20 bg-black relative group">
              <Image
                src="/logo.jpg"
                alt="আধুনিক ফ্যাশন AF Logo"
                fill
                priority
                className="object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-md">
              Official
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-serif">
              আধুনিক ফ্যাশন
            </h1>
            <p className="text-amber-400/90 font-medium text-sm sm:text-base tracking-widest uppercase">
              Adhunik Fashion • Luxury Retail, POS & Loyalty
            </p>
          </div>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            একটি কেন্দ্রীভূত সেন্ট্রাল ডাটাবেজে সংযুক্ত—নবীগঞ্জ, ইমামবাড়ী বাজার ও চট্টগ্রাম শাখার 
            সরাসরি ক্যাশিয়ার বিক্রয়, অনলাইন অর্ডার, ফোন ওটিপি মেম্বারশিপ ও লয়ালটি রিওয়ার্ডস।
          </p>

          {/* WhatsApp Direct Ordering & Support */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/8801719521576"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: 01719-521576</span>
            </a>
            <a
              href="https://wa.me/8801767833332"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: 01767-833332</span>
            </a>
          </div>
        </div>

        {/* 3 Physical Branches Showcase */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>আমাদের ফিজিক্যাল ৩টি শাখা</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {branches.map((b) => (
              <div
                key={b.no}
                className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-amber-500/20 shadow-lg hover:border-amber-400/50 transition duration-300 text-left relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition"></div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {b.tag}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">লাইভ পিওএস যুক্ত</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                  🛍️ আধুনিক ফ্যাশন
                </h3>
                <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{b.location}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Portals Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Customer Store */}
          <Link
            href="/shop"
            className="group block p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition duration-300 text-left shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                অনলাইন স্টোর
              </h2>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                পাঞ্জাবি, শার্ট, কাবলি সেট, ট্রাউজার্স ও শাড়ি ব্রাউজ করুন এবং অর্ডার করুন।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1 text-xs font-semibold text-amber-400">
              <span>কালেকশন দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 2. Store POS Terminal */}
          <Link
            href="/pos"
            className="group block p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition duration-300 text-left shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <MonitorCheck className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                শাখা POS ক্যাশিয়ার
              </h2>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                বারকোড স্ক্যানার দিয়ে দ্রুত বিক্রয়, কাস্টমার ফোন দিয়ে লয়ালটি ডিসকাউন্ট ও রসিদ প্রিন্ট।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1 text-xs font-semibold text-blue-400">
              <span>ক্যাশ কাউন্টার ওপেন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 3. Member Digital VIP Card */}
          <Link
            href="/member"
            className="group block p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-yellow-500/50 hover:bg-slate-900 transition duration-300 text-left shadow-lg hover:shadow-yellow-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <QrCode className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-yellow-400 transition">
                ডিজিটাল মেম্বার কার্ড
              </h2>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                ফোন নাম্বার দিয়ে লগইন করে আপনার ইউনিক মেম্বার বারকোড, পয়েন্ট ব্যালেন্স ও অফার দেখুন।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1 text-xs font-semibold text-yellow-400">
              <span>ভিআইপি কার্ড দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 4. Admin Management */}
          <Link
            href="/admin/dashboard"
            className="group block p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 transition duration-300 text-left shadow-lg hover:shadow-purple-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-purple-400 transition">
                অ্যাডমিন ড্যাশবোর্ড
              </h2>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                ৩ শাখার মোট বিক্রয়, স্টক ইনভেন্টরি, প্রোডাক্ট ম্যানেজমেন্ট ও লয়ালটি রেট কন্ট্রোল।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1 text-xs font-semibold text-purple-400">
              <span>ম্যানেজমেন্ট কনসোল</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-black/60 py-6 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="text-slate-400">
          © {new Date().getFullYear()} <strong>আধুনিক ফ্যাশন (Adhunik Fashion)</strong> — সর্বস্বত্ব সংরক্ষিত।
        </p>
        <p className="text-[11px] text-slate-600">
          নবীগঞ্জ • ইমামবাড়ী বাজার • চট্টগ্রাম | হটলাইন: 01719521576, 01767833332
        </p>
      </footer>
    </main>
  );
}
