"use client";

import { useEffect, useState } from "react";
import {
  Layers,
  Search,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  FileText,
  RotateCcw,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<"STOCK" | "AUDIT">("STOCK");
  const [items, setItems] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [modalMode, setModalMode] = useState<"RESTOCK" | "ADJUST">("RESTOCK");
  const [quantityInput, setQuantityInput] = useState("");
  const [referenceInput, setReferenceInput] = useState("PO-202610-");
  const [reasonInput, setReasonInput] = useState("Supplier delivery");

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/inventory?search=${encodeURIComponent(search)}&lowStock=${lowStockFilter}`
      );
      const data = await res.json();
      if (data.success) {
        setItems(data.data.items);
      }
    } catch (err) {
      console.error("Failed to load inventory", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const res = await fetch("/api/inventory/audit?limit=40");
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.data);
      }
    } catch (err) {
      console.error("Failed to load audit logs", err);
    }
  };

  useEffect(() => {
    if (activeTab === "STOCK") {
      loadInventory();
    } else {
      loadAuditLogs();
    }
  }, [search, lowStockFilter, activeTab]);

  const handleInventoryAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        action: modalMode,
        variantId: selectedVariantId,
      };

      if (modalMode === "RESTOCK") {
        payload.quantity = parseInt(quantityInput, 10);
        payload.reference = referenceInput;
        payload.reason = reasonInput;
      } else {
        payload.newQuantity = parseInt(quantityInput, 10);
        payload.reason = reasonInput;
        payload.movementType = "MANUAL_ADJUSTMENT";
      }

      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadInventory();
      } else {
        alert(data.message || "Failed to update inventory");
      }
    } catch (err: any) {
      alert(err.message || "Operation failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Centralized Inventory Ledger</h1>
          <p className="text-sm text-slate-400">
            Real-time multi-channel stock level synchronization and immutable audit tracking
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("STOCK")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "STOCK" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Real-Time Stock
          </button>
          <button
            onClick={() => setActiveTab("AUDIT")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "AUDIT" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Audit Trail Ledger
          </button>
        </div>
      </div>

      {activeTab === "STOCK" ? (
        <>
          {/* Search & Low-stock toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inventory by product, SKU or barcode..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={() => setLowStockFilter(!lowStockFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                lowStockFilter
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Low Stock Alerts Only</span>
            </button>
          </div>

          {/* Stock Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 uppercase bg-slate-800/50 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Item & Variant</th>
                    <th className="py-3 px-4">SKU / Barcode</th>
                    <th className="py-3 px-4">Shelf Location</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Alert Level</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No inventory records match your query.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-white text-sm">{item.productTitle}</p>
                            <p className="text-[11px] text-slate-400">
                              {item.size || "Standard"} • {item.color || "Default"}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-mono text-emerald-400 font-medium">{item.sku}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{item.barcode}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{item.shelfLocation || "Unassigned"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              item.quantity === 0
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : item.isLowStock
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            }`}
                          >
                            {item.quantity} in stock
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">&le; {item.lowStockAlert} units</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedVariantId(item.variantId);
                                setModalMode("RESTOCK");
                                setQuantityInput("20");
                                setIsModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium text-[11px] border border-slate-700 transition"
                            >
                              Restock
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVariantId(item.variantId);
                                setModalMode("ADJUST");
                                setQuantityInput(String(item.quantity));
                                setIsModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] border border-slate-700 transition"
                            >
                              Adjust
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Audit Trail Table */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase bg-slate-800/50 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Product & SKU</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4">Delta</th>
                  <th className="py-3 px-4">Balance After</th>
                  <th className="py-3 px-4">Reference & Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No stock movement audit records yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{log.productTitle}</p>
                        <p className="font-mono text-[10px] text-slate-500">{log.sku}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {log.movementType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-bold text-sm ${
                            log.quantityDelta > 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {log.quantityDelta > 0 ? `+${log.quantityDelta}` : log.quantityDelta}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-white">{log.balanceAfter}</td>
                      <td className="py-3 px-4">
                        <p className="text-slate-300">{log.reason || "N/A"}</p>
                        {log.reference && (
                          <p className="text-[10px] text-slate-500 font-mono">Ref: {log.reference}</p>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock / Adjust Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {modalMode === "RESTOCK" ? "Restock Variant Inventory" : "Adjust Inventory Balance"}
            </h3>

            <form onSubmit={handleInventoryAction} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {modalMode === "RESTOCK" ? "Quantity to Add" : "New Exact Stock Balance"}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>

              {modalMode === "RESTOCK" && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">PO / Invoice Reference</label>
                  <input
                    type="text"
                    required
                    value={referenceInput}
                    onChange={(e) => setReferenceInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  required
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition"
                >
                  Save Stock Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
