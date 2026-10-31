"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  ShoppingCart,
  Users,
  Coins,
  ArrowUpRight,
  MonitorCheck,
  RefreshCw,
  PlusCircle,
  Truck,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaySales: 34500,
    monthlySales: 489200,
    totalOrders: 284,
    pendingOrders: 12,
    pendingDeliveries: 7,
    lowStockCount: 3,
    totalInventoryValue: 1284500,
    totalMembers: 142,
  });

  const [lowStockItems, setLowStockItems] = useState([
    { id: "1", title: "Premium Oxford Cotton Shirt", sku: "SHT-OXF-WHT-M", stock: 2, threshold: 5 },
    { id: "2", title: "Casual Denim Jacket", sku: "JKT-DNM-BLU-L", stock: 1, threshold: 4 },
    { id: "3", title: "Slim Chino Trousers", sku: "PNT-CHN-KHK-32", stock: 0, threshold: 5 },
  ]);

  const [recentOrders, setRecentOrders] = useState([
    {
      id: "ORD-202610-0012",
      channel: "POS",
      customer: "Tanvir Ahmed",
      items: 2,
      total: 3300,
      payment: "PAID (bKash)",
      time: "10 mins ago",
    },
    {
      id: "ORD-202610-0011",
      channel: "ONLINE",
      customer: "Nafis Fuad",
      items: 1,
      total: 1650,
      payment: "PENDING (COD)",
      time: "25 mins ago",
    },
    {
      id: "ORD-202610-0010",
      channel: "POS",
      customer: "Walk-in Guest",
      items: 3,
      total: 4950,
      payment: "PAID (Cash)",
      time: "1 hour ago",
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operations & Analytics</h1>
          <p className="text-sm text-slate-400">
            Real-time synchronization across physical store and online channels
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pos"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition"
          >
            <MonitorCheck className="w-4 h-4" />
            <span>Launch POS Register</span>
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold shadow-lg shadow-emerald-500/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Today's Sales */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Today&apos;s Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">৳{stats.todaySales.toLocaleString()}</p>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <span>+14.2%</span> <span className="text-slate-500">vs yesterday</span>
            </p>
          </div>
        </div>

        {/* Monthly Sales */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monthly Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">৳{stats.monthlySales.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">284 total orders completed</p>
          </div>
        </div>

        {/* Stock Valuation */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Inventory Value</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">৳{stats.totalInventoryValue.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Current retail valuation</p>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Low Stock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-amber-400">{stats.lowStockCount} SKUs</p>
            <p className="text-xs text-slate-400 mt-1">Requires immediate reorder</p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Low Stock Alert List & Recent Live Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Monitor */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Low Stock Alerts</span>
            </h2>
            <Link href="/admin/inventory" className="text-xs text-emerald-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-white">{item.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.sku}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.stock === 0 ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {item.stock === 0 ? "Out of Stock" : `${item.stock} left`}
                  </span>
                  <p className="text-[9px] text-slate-500 mt-0.5">Threshold: {item.threshold}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Live Orders Feed */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Sales Feed (POS & Online)</span>
            </h2>
            <span className="text-xs text-slate-400">Synchronized Database</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase bg-slate-800/40 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-mono font-semibold text-white">{ord.id}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.channel === "POS" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {ord.channel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{ord.customer}</td>
                    <td className="py-3 px-3 text-slate-400">{ord.items}</td>
                    <td className="py-3 px-3 font-semibold text-white">৳{ord.total.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-400 font-medium">{ord.payment}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{ord.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
