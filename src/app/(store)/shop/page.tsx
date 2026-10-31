"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Sparkles,
  X,
  ChevronRight,
  Phone,
  MessageCircle,
  MapPin,
} from "lucide-react";

export default function ShopPage() {
  const [products] = useState<any[]>([
    {
      id: "prod-1",
      title: "এক্সক্লুসিভ সেমি-লং পাঞ্জাবি (কাতান ও এমব্রয়ডারি)",
      slug: "exclusive-semi-long-punjabi",
      basePrice: 2850,
      discountPrice: 2450,
      images: [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
      ],
      category: "পাঞ্জাবি ও কাবলি",
      variants: [
        { id: "v1", sku: "AF-PAN-MRN-40", size: "40", color: "মেরুন", price: 2450, stock: 35 },
        { id: "v2", sku: "AF-PAN-WHT-42", size: "42", color: "সাদা", price: 2450, stock: 28 },
        { id: "v3", sku: "AF-PAN-NVY-44", size: "44", color: "নেভি ব্লু", price: 2450, stock: 20 },
      ],
    },
    {
      id: "prod-2",
      title: "প্রিমিয়াম কম্বড কটন কাবলি সেট (Kabli Set)",
      slug: "premium-cotton-kabli-set",
      basePrice: 3800,
      discountPrice: 3350,
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
      ],
      category: "পাঞ্জাবি ও কাবলি",
      variants: [
        { id: "v4", sku: "AF-KAB-BLK-40", size: "40", color: "জেট ব্ল্যাক", price: 3350, stock: 22 },
        { id: "v5", sku: "AF-KAB-OLV-42", size: "42", color: "অলিভ গ্রিন", price: 3350, stock: 18 },
      ],
    },
    {
      id: "prod-3",
      title: "ফর্মাল অক্সফোর্ড কটন শার্ট (Formal Shirt)",
      slug: "formal-oxford-cotton-shirt",
      basePrice: 1950,
      discountPrice: 1650,
      images: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
      ],
      category: "শার্ট ও প্যান্ট",
      variants: [
        { id: "v6", sku: "AF-SHT-SKY-M", size: "M", color: "স্কাই ব্লু", price: 1650, stock: 40 },
        { id: "v7", sku: "AF-SHT-WHT-L", size: "L", color: "হোয়াইট", price: 1650, stock: 35 },
      ],
    },
    {
      id: "prod-4",
      title: "স্ট্রেচ ডেনিম জিন্স ও চিনো ট্রাউজার্স",
      slug: "stretch-denim-chinos",
      basePrice: 2250,
      discountPrice: 1850,
      images: [
        "https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80",
      ],
      category: "শার্ট ও প্যান্ট",
      variants: [
        { id: "v8", sku: "AF-PNT-BLU-32", size: "32", color: "ক্লাসিক ব্লু", price: 1850, stock: 25 },
        { id: "v9", sku: "AF-PNT-KHK-34", size: "34", color: "খাকি", price: 1850, stock: 20 },
      ],
    },
    {
      id: "prod-5",
      title: "ঐতিহ্যবাহী ঢাকাই জামদানি শাড়ি (Jamdani Saree)",
      slug: "traditional-dhakai-jamdani-saree",
      basePrice: 6500,
      discountPrice: 5800,
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
      ],
      category: "মহিলাদের কালেকশন",
      variants: [
        { id: "v10", sku: "AF-SAR-RED-FS", size: "Free Size", color: "লাল ও সোনালি", price: 5800, stock: 12 },
        { id: "v11", sku: "AF-SAR-BLK-FS", size: "Free Size", color: "কালো ও রুপালি", price: 5800, stock: 8 },
      ],
    },
    {
      id: "prod-6",
      title: "ডিজাইনার জর্জেট এমব্রয়ডারি থ্রি-পিস (Three Piece)",
      slug: "designer-georgette-three-piece",
      basePrice: 4200,
      discountPrice: 3600,
      images: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
      ],
      category: "মহিলাদের কালেকশন",
      variants: [
        { id: "v12", sku: "AF-3PC-PNK-M", size: "M", color: "রোজ পিংক", price: 3600, stock: 15 },
        { id: "v13", sku: "AF-3PC-SEA-L", size: "L", color: "সি গ্রিন", price: 3600, stock: 14 },
      ],
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: any, variant: any) => {
    const existingIndex = cart.findIndex((item) => item.variantId === variant.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          variantId: variant.id,
          title: product.title,
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          price: variant.price,
          image: product.images[0],
          quantity: 1,
        },
      ]);
    }
    setIsCartOpen(true);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.variants.some((v: any) => v.color.toLowerCase().includes(search.toLowerCase()) || v.size.includes(search));
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="h-20 bg-slate-900/90 backdrop-blur border-b border-amber-500/20 px-4 sm:px-10 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-500/40 relative shrink-0 bg-black">
            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-wide font-serif block">
              আধুনিক ফ্যাশন
            </span>
            <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold block">
              Adhunik Fashion
            </span>
          </div>
        </Link>

        {/* WhatsApp & Cart */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/8801719521576"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>01719-521576</span>
          </a>

          <Link
            href="/member"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 transition"
          >
            মেম্বার কার্ড
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Branch Announcement Sub-Bar */}
      <div className="bg-slate-900/50 border-b border-slate-800/80 px-4 py-2 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 text-[11px] text-slate-300 whitespace-nowrap">
          <span className="flex items-center gap-1 font-semibold text-amber-400">
            <MapPin className="w-3 h-3" />
            <span>আমাদের শাখাসমূহ:</span>
          </span>
          <span>📍 ১/ ওসমানী রোড নবীগঞ্জ</span>
          <span>•</span>
          <span>📍 ২/ ইমামবাড়ী বাজার আল-মদিনা মার্কেট</span>
          <span>•</span>
          <span>📍 ৩/ চট্টগ্রাম জলসা মার্কেট</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>ক্যাটাগরি ফিল্টার</span>
            </h2>

            <div className="space-y-1">
              {["ALL", "পাঞ্জাবি ও কাবলি", "শার্ট ও প্যান্ট", "মহিলাদের কালেকশন"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-amber-400 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {cat === "ALL" ? "সব প্রোডাক্ট (All Items)" : cat}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <p className="text-xs font-semibold text-slate-300">সরাসরি অর্ডার করতে:</p>
              <a
                href="https://wa.me/8801719521576"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 text-xs font-bold hover:bg-emerald-500/30 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>হটলাইন ১: 01719-521576</span>
              </a>
              <a
                href="https://wa.me/8801767833332"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 text-xs font-bold hover:bg-emerald-500/30 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>হটলাইন ২: 01767-833332</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Product Cards */}
        <main className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="পাঞ্জাবি, শার্ট, শাড়ি, সাইজ বা কালার দিয়ে খুঁজুন..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-slate-800">
                    <Image
                      src={prod.images[0]}
                      alt={prod.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    {prod.discountPrice && (
                      <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        স্পেশাল অফার
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                      {prod.category}
                    </p>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{prod.title}</h3>

                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-white">৳{prod.discountPrice || prod.basePrice}</span>
                      {prod.discountPrice && (
                        <span className="text-xs line-through text-slate-500">৳{prod.basePrice}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {prod.variants.map((v: any) => (
                        <span
                          key={v.id}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700"
                        >
                          {v.size} ({v.color})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => addToCart(prod, prod.variants[0])}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>কার্টে যোগ করুন (সাইজ: {prod.variants[0].size})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Mini Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <span>আপনার শপিং ব্যাগ</span>
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="divide-y divide-slate-800 my-4 max-h-[60vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-slate-500 text-xs py-8">আপনার ব্যাগটি খালি আছে।</p>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white text-xs">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          সাইজ: {item.size} • {item.color} (পরিমাণ: {item.quantity})
                        </p>
                      </div>
                      <p className="font-bold text-white text-xs font-mono">৳{item.price * item.quantity}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">মোট মূল্য (Subtotal):</span>
                <span className="font-extrabold text-amber-400 text-lg font-mono">৳{cartSubtotal}</span>
              </div>

              <Link
                href="/login"
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"
              >
                <span>অর্ডার সম্পন্ন করুন ও পয়েন্ট পান</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
