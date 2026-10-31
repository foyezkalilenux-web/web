"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Barcode,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  UserCheck,
  CreditCard,
  Banknote,
  Printer,
  ArrowLeft,
  CheckCircle2,
  X,
  Phone,
  MapPin,
} from "lucide-react";

export default function PosTerminalPage() {
  const branches = [
    {
      id: "BRANCH-1",
      name: "১/ শাখা ওসমানী রোড নবীগঞ্জ",
      address: "ওসমানী রোড, নবীগঞ্জ, হবিগঞ্জ",
      phone: "01719521576",
    },
    {
      id: "BRANCH-2",
      name: "২/ শাখা ইমামবাড়ী বাজার আল-মদিনা মার্কেট",
      address: "ইমামবাড়ী বাজার, আল-মদিনা মার্কেট",
      phone: "01767833332",
    },
    {
      id: "BRANCH-3",
      name: "৩/ শাখা চট্টগ্রাম জলসা মার্কেট",
      address: "জলসা মার্কেট, চট্টগ্রাম",
      phone: "01719521576",
    },
  ];

  const [selectedBranch, setSelectedBranch] = useState(branches[0]);

  // Catalog items for Adhunik Fashion
  const [products] = useState<any[]>([
    {
      id: "v1",
      title: "সেমি-লং পাঞ্জাবি (কাতান)",
      variantName: "মেরুন / ৪০",
      sku: "AF-PAN-MRN-40",
      barcode: "890123456701",
      price: 2450,
      stock: 35,
    },
    {
      id: "v2",
      title: "সেমি-লং পাঞ্জাবি (কাতান)",
      variantName: "সাদা / ৪২",
      sku: "AF-PAN-WHT-42",
      barcode: "890123456702",
      price: 2450,
      stock: 28,
    },
    {
      id: "v3",
      title: "কম্বড কটন কাবলি সেট",
      variantName: "জেট ব্ল্যাক / ৪০",
      sku: "AF-KAB-BLK-40",
      barcode: "890123456703",
      price: 3350,
      stock: 22,
    },
    {
      id: "v4",
      title: "কম্বড কটন কাবলি সেট",
      variantName: "অলিভ / ৪২",
      sku: "AF-KAB-OLV-42",
      barcode: "890123456704",
      price: 3350,
      stock: 18,
    },
    {
      id: "v5",
      title: "অক্সফোর্ড কটন শার্ট",
      variantName: "স্কাই ব্লু / M",
      sku: "AF-SHT-SKY-M",
      barcode: "890123456705",
      price: 1650,
      stock: 40,
    },
    {
      id: "v6",
      title: "ডেনিম জিন্স ও চিনো প্যান্ট",
      variantName: "ক্লাসিক ব্লু / ৩২",
      sku: "AF-PNT-BLU-32",
      barcode: "890123456706",
      price: 1850,
      stock: 25,
    },
    {
      id: "v7",
      title: "ঐতিহ্যবাহী জামদানি শাড়ি",
      variantName: "লাল-সোনালি / Free",
      sku: "AF-SAR-RED-FS",
      barcode: "890123456707",
      price: 5800,
      stock: 12,
    },
  ]);

  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Customer & Loyalty state
  const [customerPhone, setCustomerPhone] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "BKASH" | "NAGAD" | "CARD">("CASH");
  const [cashTendered, setCashTendered] = useState("");
  const [trxId, setTrxId] = useState("");

  // Receipt Modal
  const [completedReceipt, setCompletedReceipt] = useState<any>(null);

  // Hardware Barcode Scanner listener
  useEffect(() => {
    let buffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 150) {
        buffer = "";
      }
      lastKeyTime = currentTime;

      if (e.key === "Enter" && buffer.length >= 4) {
        e.preventDefault();
        const scannedCode = buffer.trim();
        buffer = "";

        if (scannedCode.startsWith("880") && scannedCode.length >= 11) {
          lookupCustomerByPhone(scannedCode);
        } else {
          const item = products.find(
            (p) => p.barcode === scannedCode || p.sku.toLowerCase() === scannedCode.toLowerCase()
          );
          if (item) {
            addItemToCart(item);
          }
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [products, cart]);

  const addItemToCart = (item: any) => {
    const existingIndex = cart.findIndex((c) => c.sku === item.sku);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (sku: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.sku === sku) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const lookupCustomerByPhone = (phoneInput: string) => {
    const cleaned = phoneInput.replace(/\D/g, "");
    if (cleaned.includes("1811223344") || phoneInput.includes("MEM-000001")) {
      setCustomer({
        name: "Tanvir Ahmed",
        phone: "+8801811223344",
        membershipCode: "MEM-000001",
        tier: "SILVER",
        pointsBalance: 120,
      });
      setCustomerPhone("+8801811223344");
    } else {
      alert("মেম্বার পাওয়া যায়নি! কাস্টমার হিসেবে যুক্ত করুন।");
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const pointsDiscount = Math.min(pointsToRedeem, subtotal * 0.25);
  const grandTotal = Math.max(0, subtotal - pointsDiscount);
  const tenderedAmount = parseFloat(cashTendered) || grandTotal;
  const changeDue = Math.max(0, tenderedAmount - grandTotal);

  const handleFinalizeSale = () => {
    const receipt = {
      orderNumber: `ORD-AF-${Date.now().toString().slice(-6)}`,
      branch: selectedBranch,
      date: new Date().toLocaleString(),
      cashier: "বিক্রয় প্রতিনিধি",
      customerName: customer?.name || "সাধারণ ক্রেতা (Walk-in)",
      customerPhone: customer?.phone || "N/A",
      items: cart,
      subtotal,
      pointsDiscount,
      totalAmount: grandTotal,
      paymentMethod,
      cashTendered: tenderedAmount,
      changeDue,
      pointsEarned: Math.floor(grandTotal / 100),
    };

    setCompletedReceipt(receipt);
    setIsPaymentModalOpen(false);
    setCart([]);
    setCustomer(null);
    setCustomerPhone("");
    setPointsToRedeem(0);
    setCashTendered("");
  };

  return (
    <div className="h-screen bg-[#07090e] text-slate-100 flex flex-col overflow-hidden">
      {/* Top POS Navbar */}
      <header className="h-16 bg-slate-900 border-b border-amber-500/20 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>অ্যাডমিন ড্যাশবোর্ড</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-400/40 relative bg-black">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <span className="font-bold text-sm text-white font-serif">আধুনিক ফ্যাশন</span>
              <span className="text-[10px] text-amber-400 font-mono ml-2 font-semibold">
                লাইভ পিওএস টার্মিনাল
              </span>
            </div>
          </div>
        </div>

        {/* Branch Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={selectedBranch.id}
              onChange={(e) => {
                const found = branches.find((b) => b.id === e.target.value);
                if (found) setSelectedBranch(found);
              }}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
            <Barcode className="w-3.5 h-3.5" />
            <span>স্ক্যানার রেডি</span>
          </div>
        </div>
      </header>

      {/* Main Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Product Search & Quick Grid */}
        <div className="flex-1 p-6 flex flex-col space-y-4 overflow-hidden">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="বারকোড স্ক্যান করুন অথবা পাঞ্জাবি, শার্ট, কোড লিখে খুঁজুন..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pr-1">
            {products
              .filter(
                (p) =>
                  p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.barcode.includes(searchTerm)
              )
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => addItemToCart(item)}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-400/60 p-4 rounded-2xl text-left flex flex-col justify-between transition group shadow-sm hover:shadow-amber-500/10 active:scale-95"
                >
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-semibold">
                      {item.sku}
                    </span>
                    <h3 className="font-bold text-white text-xs mt-2 line-clamp-1 group-hover:text-amber-300 transition">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.variantName}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="font-extrabold text-white text-sm font-mono">৳{item.price}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.stock} স্টক</span>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Right: Cart & Member Checkout */}
        <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col justify-between shrink-0">
          <div className="p-4 flex-1 flex flex-col overflow-hidden">
            {/* Customer Member Box */}
            <div className="p-3 bg-slate-800/60 border border-amber-500/30 rounded-2xl space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>কাস্টমার মেম্বারশিপ</span>
                </span>
                {customer && (
                  <button
                    onClick={() => {
                      setCustomer(null);
                      setPointsToRedeem(0);
                    }}
                    className="text-[10px] text-red-400 hover:underline"
                  >
                    রিমুভ
                  </button>
                )}
              </div>

              {customer ? (
                <div className="text-xs bg-slate-900/80 p-2.5 rounded-xl border border-amber-500/30">
                  <div className="flex justify-between items-center font-bold text-white">
                    <span>{customer.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase font-black">
                      {customer.tier}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">{customer.membershipCode}</p>
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">জমা পয়েন্ট:</span>
                    <span className="font-mono font-bold text-amber-400">{customer.pointsBalance} pts</span>
                  </div>
                  {customer.pointsBalance >= 50 && (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={customer.pointsBalance}
                        value={pointsToRedeem}
                        onChange={(e) => setPointsToRedeem(parseInt(e.target.value, 10) || 0)}
                        placeholder="পয়েন্ট ছাড়"
                        className="w-24 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        -৳{Math.min(pointsToRedeem, subtotal * 0.25).toFixed(0)} ছাড়
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="মেম্বার কার্ড বা মোবাইল (017...)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono"
                  />
                  <button
                    onClick={() => lookupCustomerByPhone(customerPhone)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition"
                  >
                    খুঁজুন
                  </button>
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 pr-1">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center space-y-2">
                  <ShoppingCart className="w-8 h-8 opacity-40 text-amber-400" />
                  <p>ব্যাগ খালি। বারকোড স্ক্যান করুন বা আইটেমে ক্লিক করুন।</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.sku} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white text-xs truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {item.variantName} • ৳{item.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.sku, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-bold text-white w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.sku, 1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="font-bold text-white text-xs font-mono w-14 text-right">
                      ৳{item.price * item.quantity}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Totals & Charge */}
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>মোট মূল্য ({cart.reduce((a, b) => a + b.quantity, 0)} পিস)</span>
                <span className="font-mono text-white font-semibold">৳{subtotal}</span>
              </div>
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>পয়েন্ট ডিসকাউন্ট ({pointsToRedeem} pts)</span>
                  <span className="font-mono">-৳{pointsDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>পরিশোধযোগ্য সর্বমোট</span>
                <span className="text-xl text-amber-400 font-mono">৳{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={cart.length === 0}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-98"
            >
              <CreditCard className="w-4 h-4" />
              <span>পেমেন্ট ও বিল করুন (৳{grandTotal})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tender Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">পেমেন্ট মাধ্যম সিলেক্ট করুন</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2 bg-slate-800/40 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400">পরিশোধযোগ্য টাকা</span>
              <p className="text-3xl font-black text-amber-400 font-mono mt-0.5">৳{grandTotal}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "CASH", label: "ক্যাশ (নগদ)", icon: Banknote },
                { id: "BKASH", label: "বিকাশ (bKash)", icon: Phone },
                { id: "NAGAD", label: "নগদ (Nagad)", icon: Phone },
                { id: "CARD", label: "কার্ড (Card)", icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                      paymentMethod === m.id
                        ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === "CASH" ? (
              <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                <label className="block text-xs font-semibold text-slate-300">কাস্টমারের দেওয়া টাকা (৳)</label>
                <input
                  type="number"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  placeholder={`যেমন: ${grandTotal}`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-lg font-bold"
                />
                <div className="flex justify-between items-center text-xs font-semibold pt-1">
                  <span className="text-slate-400">ফেরত টাকা (Change):</span>
                  <span className="font-mono text-base font-bold text-amber-400">৳{changeDue}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">ট্রানজেকশন TrxID</label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="যেমন: 9J47AB890"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            )}

            <button
              onClick={handleFinalizeSale}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>বিক্রয় সম্পন্ন ও রসিদ প্রিন্ট করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* 80mm ESC/POS Printable Thermal Receipt Preview */}
      {completedReceipt && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white text-slate-950 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div id="printable-receipt" className="space-y-3">
              <div className="text-center pb-2 border-b border-dashed border-slate-400 space-y-0.5">
                <h2 className="font-black text-base uppercase">আধুনিক ফ্যাশন</h2>
                <p className="text-[10px] font-bold text-slate-700">{completedReceipt.branch.name}</p>
                <p className="text-[9px] text-slate-600">{completedReceipt.branch.address}</p>
                <p className="text-[9px] text-slate-700 font-bold">
                  হটলাইন: 01719-521576, 01767-833332
                </p>
                <p className="text-[10px] font-bold mt-1 text-slate-900 border-t border-slate-200 pt-1">
                  বিক্রয় রসিদ (CASH MEMO)
                </p>
              </div>

              <div className="text-[10px] space-y-0.5 pb-2 border-b border-dashed border-slate-400">
                <div className="flex justify-between">
                  <span>মেমো নং:</span> <span className="font-bold">{completedReceipt.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>তারিখ:</span> <span>{completedReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>ক্রেতা:</span> <span>{completedReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>মোবাইল:</span> <span>{completedReceipt.customerPhone}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-1 pb-2 border-b border-dashed border-slate-400">
                {completedReceipt.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[170px]">
                      {it.quantity}x {it.title}
                    </span>
                    <span className="font-bold">৳{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-slate-400">
                <div className="flex justify-between">
                  <span>মোট বিল:</span> <span>৳{completedReceipt.subtotal}</span>
                </div>
                {completedReceipt.pointsDiscount > 0 && (
                  <div className="flex justify-between font-bold text-emerald-800">
                    <span>লয়ালটি ছাড়:</span> <span>-৳{completedReceipt.pointsDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-1">
                  <span>সর্বমোট প্রদেয়:</span> <span>৳{completedReceipt.totalAmount}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>পরিশোধ ({completedReceipt.paymentMethod}):</span> <span>৳{completedReceipt.cashTendered}</span>
                </div>
                {completedReceipt.changeDue > 0 && (
                  <div className="flex justify-between text-[10px] font-bold text-slate-800">
                    <span>ফেরত দেওয়া:</span> <span>৳{completedReceipt.changeDue}</span>
                  </div>
                )}
              </div>

              <div className="text-center pt-1 text-[10px] space-y-1">
                <p className="font-bold text-slate-800">
                  ⭐ এই ক্রয়ে অর্জিত লয়ালটি পয়েন্ট: +{completedReceipt.pointsEarned} pts
                </p>
                <p className="text-[9px] text-slate-500">আধুনিক ফ্যাশনে কেনাকাটা করার জন্য ধন্যবাদ!</p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition"
              >
                <Printer className="w-4 h-4" />
                <span>থার্মাল রসিদ প্রিন্ট করুন</span>
              </button>
              <button
                onClick={() => setCompletedReceipt(null)}
                className="px-4 py-2.5 rounded-lg bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 transition"
              >
                নতুন বিক্রয়
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
