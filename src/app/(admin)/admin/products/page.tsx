"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Search, Tag, Box, Barcode, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80");
  const [variants, setVariants] = useState<any[]>([
    { sku: "DEMO-BLU-M", barcode: "890123456710", size: "M", color: "Blue", price: 1650, initialStock: 30 },
  ]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/catalog/products?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const addVariantRow = () => {
    setVariants([
      ...variants,
      {
        sku: `SKU-${Date.now().toString().slice(-4)}`,
        barcode: `890${Date.now().toString().slice(-9)}`,
        size: "L",
        color: "Black",
        price: parseFloat(basePrice) || 1500,
        initialStock: 20,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Product & Variant Catalog</h1>
          <p className="text-sm text-slate-400">
            Create and manage multi-variant merchandise with automated SKU & barcode tracking
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold shadow-lg shadow-emerald-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU or barcode..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Variants / SKUs</th>
                <th className="py-3 px-4">Total Stock</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No products found. Add your first product or seed the database.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const totalStock = prod.variants.reduce(
                    (acc: number, v: any) => acc + (v.inventory?.quantity || 0),
                    0
                  );
                  return (
                    <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {prod.images?.[0] ? (
                            <Image
                              src={prod.images[0]}
                              alt={prod.title}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                              <Box className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white text-sm">{prod.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono">/{prod.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                          {prod.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-bold text-white">৳{prod.discountPrice || prod.basePrice}</p>
                          {prod.discountPrice && (
                            <p className="line-through text-slate-500 text-[10px]">৳{prod.basePrice}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {prod.variants.slice(0, 2).map((v: any) => (
                            <div key={v.id} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                              <span className="font-mono text-emerald-400 font-semibold">{v.sku}</span>
                              <span>({v.size}/{v.color})</span>
                              <span className="text-slate-500">• {v.barcode}</span>
                            </div>
                          ))}
                          {prod.variants.length > 2 && (
                            <p className="text-[10px] text-slate-500">+{prod.variants.length - 2} more variants</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            totalStock > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
