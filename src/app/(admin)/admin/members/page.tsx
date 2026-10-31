"use client";

import { useEffect, useState } from "react";
import { Users, Search, Award, CreditCard, Sparkles, Phone, ArrowUpRight } from "lucide-react";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<any[]>([
    {
      id: "1",
      name: "Tanvir Ahmed",
      phone: "+8801811223344",
      membershipCode: "MEM-000001",
      barcodeNumber: "8801811223344",
      tier: "SILVER",
      pointsBalance: 120,
      totalPointsEarned: 150,
      totalSpend: 15000,
      joinedAt: "2026-09-15",
    },
    {
      id: "2",
      name: "Nafis Fuad",
      phone: "+8801722334455",
      membershipCode: "MEM-000002",
      barcodeNumber: "8801722334455",
      tier: "GOLD",
      pointsBalance: 380,
      totalPointsEarned: 500,
      totalSpend: 38500,
      joinedAt: "2026-08-01",
    },
  ]);
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.membershipCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Members & Loyalty</h1>
          <p className="text-sm text-slate-400">
            View registered phone OTP members, tier progression, and digital reward balances
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member by name, phone number, or Membership ID (e.g. MEM-000001)..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Members Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Member Info</th>
                <th className="py-3 px-4">Membership ID & Barcode</th>
                <th className="py-3 px-4">Loyalty Tier</th>
                <th className="py-3 px-4">Points Balance</th>
                <th className="py-3 px-4">Total Lifetime Spend</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-white text-sm">{m.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{m.phone}</span>
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-mono font-bold text-emerald-400">{m.membershipCode}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{m.barcodeNumber}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                        m.tier === "PLATINUM"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          : m.tier === "GOLD"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-slate-700/60 text-slate-300 border-slate-600"
                      }`}
                    >
                      {m.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-amber-400 text-sm">{m.pointsBalance} pts</p>
                    <p className="text-[10px] text-slate-500">Lifetime: {m.totalPointsEarned} pts</p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">৳{m.totalSpend.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-400">{m.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
