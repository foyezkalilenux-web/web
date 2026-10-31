"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Sparkles,
  ShoppingBag,
  Clock,
  MapPin,
  MessageCircle,
} from "lucide-react";

export default function MemberPortalPage() {
  const [customer, setCustomer] = useState<any>({
    name: "তানভীর আহমেদ (Tanvir Ahmed)",
    phone: "+8801811223344",
    membership: {
      code: "MEM-000001",
      barcode: "8801811223344",
      tier: "SILVER",
      pointsBalance: 120,
      totalPointsEarned: 150,
      joinedAt: "2026-09-15",
    },
  });

  const [transactions] = useState([
    { id: "1", type: "EARNED_POS", points: 35, date: "2026-10-31", note: "ওসমানী রোড শাখা বিক্রয় #ORD-AF-0012" },
    { id: "2", type: "REDEEMED_POS", points: -50, date: "2026-10-24", note: "ইমামবাড়ী বাজার শাখা পয়েন্ট ছাড় #ORD-AF-0008" },
    { id: "3", type: "EARNED_ONLINE", points: 40, date: "2026-10-18", note: "অনলাইন স্টোর অর্ডার #ORD-AF-0003" },
  ]);

  useEffect(() => {
    const stored = localStorage.getItem("customer");
    if (stored) {
      try {
        setCustomer(JSON.parse(stored));
      } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-black">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-500/40 relative bg-black shrink-0">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white font-serif">আধুনিক ফ্যাশন মেম্বার ক্লাব</h1>
              <p className="text-amber-400 text-xs font-semibold mt-0.5">
                স্বাগতম, {customer.name} ({customer.phone})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>অনলাইন শপিং</span>
            </Link>
          </div>
        </div>

        {/* Digital VIP Membership Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-black via-slate-950 to-amber-950/60 p-8 border-2 border-amber-400/50 shadow-2xl shadow-amber-500/20">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
            {/* Card Left Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-400 relative bg-black shrink-0">
                  <Image src="/logo.jpg" alt="AF Logo" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-amber-400">
                    ডিজিটাল ভিআইপি মেম্বারশিপ কার্ড
                  </p>
                  <p className="text-xl font-black text-white tracking-wide font-serif">
                    আধুনিক ফ্যাশন
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-400 tracking-wider">মেম্বার নাম</p>
                <p className="text-2xl font-black text-amber-300 mt-0.5">{customer.name || "সম্মানিত গ্রাহক"}</p>
              </div>

              <div className="flex gap-8">
                <div>
                  <p className="text-xs uppercase text-slate-400 tracking-wider">মেম্বার আইডি</p>
                  <p className="text-base font-mono font-bold text-white mt-0.5">
                    {customer.membership?.code || "MEM-000001"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400 tracking-wider">লয়ালটি টিয়ার</p>
                  <span className="inline-block mt-0.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                    {customer.membership?.tier || "SILVER"}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400 tracking-wider">যোগদানের তারিখ</p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">
                    {customer.membership?.joinedAt ? new Date(customer.membership.joinedAt).toLocaleDateString() : "সক্রিয়"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Right: Points Balance & Scannable Barcode */}
            <div className="flex flex-col justify-between items-start md:items-end bg-slate-950/80 p-6 rounded-2xl border border-amber-500/30 backdrop-blur-sm">
              <div className="text-left md:text-right">
                <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">বর্তমান রিওয়ার্ড ব্যালেন্স</p>
                <p className="text-4xl font-black text-amber-400 font-mono">
                  {customer.membership?.pointsBalance || 0} <span className="text-sm font-semibold text-slate-300">পয়েন্ট</span>
                </p>
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  &asymp; ৳{(customer.membership?.pointsBalance || 0).toFixed(2)} টাকা ছাড়ের সমতুল্য
                </p>
              </div>

              {/* Scannable Barcode for POS Cashier */}
              <div className="mt-4 pt-4 border-t border-slate-800 w-full text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">
                  দোকানে ক্যাশিয়ার কাউন্টারে এই বারকোডটি স্ক্যান করান
                </p>
                <div className="bg-white p-3 rounded-xl inline-block shadow-inner">
                  <div className="h-10 w-44 flex items-center justify-between px-1">
                    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2].map((w, idx) => (
                      <div key={idx} className="bg-black h-full" style={{ width: `${w * 1.8}px` }}></div>
                    ))}
                  </div>
                  <p className="text-slate-900 font-mono text-xs font-bold tracking-widest mt-1">
                    {customer.membership?.barcode || "8801811223344"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Physical Branches List */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>যে শাখাসমূহে মেম্বার কার্ড ও ডিসকাউন্ট প্রযোজ্য:</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
              <p className="font-bold text-white">🛍️ আধুনিক ফ্যাশন — শাখা ১</p>
              <p className="text-[11px] text-slate-400 mt-0.5">ওসমানী রোড, নবীগঞ্জ</p>
            </div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
              <p className="font-bold text-white">🛍️ আধুনিক ফ্যাশন — শাখা ২</p>
              <p className="text-[11px] text-slate-400 mt-0.5">ইমামবাড়ী বাজার, আল-মদিনা মার্কেট</p>
            </div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
              <p className="font-bold text-white">🛍️ আধুনিক ফ্যাশন — শাখা ৩</p>
              <p className="text-[11px] text-slate-400 mt-0.5">জলসা মার্কেট, চট্টগ্রাম</p>
            </div>
          </div>
        </div>

        {/* Points History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>পয়েন্ট লেনদেন ইতিহাস (Transaction Ledger)</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">৩ শাখায় সংরক্ষিত</span>
          </div>

          <div className="divide-y divide-slate-800">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{tx.note}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tx.date}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-sm ${
                      tx.points > 0 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
