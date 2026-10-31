"use client";

import { useState } from "react";
import { Award, Sparkles, Save, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AdminLoyaltyRulesPage() {
  const [earnRatio, setEarnRatio] = useState("100");
  const [redeemValue, setRedeemValue] = useState("1.0");
  const [minRedeem, setMinRedeem] = useState("50");
  const [maxPercent, setMaxPercent] = useState("25");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Loyalty & Rewards Configuration</h1>
        <p className="text-sm text-slate-400">
          Configure real-time earning rates, redemption limits, and tier benefit multipliers
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5" />
          <span>Loyalty rules updated successfully across Online Store and POS!</span>
        </div>
      )}

      {/* Rules Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Core Point Calculation Rules</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Spend Ratio to Earn 1 Point (৳)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 text-sm">৳</span>
              <input
                type="number"
                required
                value={earnRatio}
                onChange={(e) => setEarnRatio(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-4 py-2 text-white text-sm"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Example: Every ৳100 spent earns 1 loyalty point.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Redemption Value per Point (৳)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 text-sm">৳</span>
              <input
                type="number"
                step="0.1"
                required
                value={redeemValue}
                onChange={(e) => setRedeemValue(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-4 py-2 text-white text-sm"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Example: 1 Point = ৳1.00 checkout discount.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Minimum Points Required to Redeem
            </label>
            <input
              type="number"
              required
              value={minRedeem}
              onChange={(e) => setMinRedeem(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm"
            />
            <p className="text-[11px] text-slate-500 mt-1">Customers must hold at least this many points to redeem.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Maximum Order Value Payable with Points (%)
            </label>
            <div className="relative">
              <span className="absolute right-3 top-2.5 text-slate-500 text-sm">%</span>
              <input
                type="number"
                required
                value={maxPercent}
                onChange={(e) => setMaxPercent(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Prevents 100% point drainage on high-margin sales.</p>
          </div>
        </div>

        {/* Tier Overview */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Membership Tiers Multipliers</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-200 text-xs">SILVER TIER</span>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">1.0x</span>
              </div>
              <p className="text-xs text-slate-400">Min Spend: ৳0</p>
              <p className="text-[11px] text-slate-500 mt-1">Default registration level for all new phone OTP members.</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-300 text-xs">GOLD VIP</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">1.25x</span>
              </div>
              <p className="text-xs text-slate-300">Min Spend: ৳10,000</p>
              <p className="text-[11px] text-amber-400/80 mt-1">Earns 25% bonus points on every purchase.</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-purple-300 text-xs">PLATINUM VIP</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">1.50x</span>
              </div>
              <p className="text-xs text-slate-300">Min Spend: ৳25,000</p>
              <p className="text-[11px] text-purple-300/80 mt-1">Earns 50% bonus points + priority cashier service.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs shadow-lg shadow-emerald-500/20 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Rules & Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
