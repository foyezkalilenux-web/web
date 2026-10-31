"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Phone, ShieldCheck, ArrowRight, Loader2, KeyRound } from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("01811223344");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      if (data.data?.debugCode) {
        setDebugOtp(data.data.debugCode);
        setOtp(data.data.debugCode);
      }

      setStep("OTP");
    } catch (err: any) {
      setError(err.message || "Could not dispatch verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp, name: name || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      localStorage.setItem("customerToken", data.data.token);
      localStorage.setItem("customer", JSON.stringify(data.data.customer));

      router.push("/member");
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-xl shadow-amber-500/20 relative bg-black">
          <Image src="/logo.jpg" alt="AF Logo" fill className="object-cover" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white font-serif">আধুনিক ফ্যাশন</h2>
        <p className="text-xs text-amber-400 uppercase tracking-widest font-semibold">
          কাস্টমার মেম্বার ক্লাব ও ডিজিটাল কার্ড
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/90 py-8 px-6 shadow-2xl border border-slate-800 sm:rounded-3xl sm:px-10 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          {debugOtp && step === "OTP" && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              ⚡ <strong>আপনার ওটিপি কোড:</strong> {debugOtp} (অটো-ফিল করা হয়েছে)
            </div>
          )}

          {step === "PHONE" ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300">আপনার মোবাইল নাম্বার</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                    placeholder="017XXXXXXXX"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">৩ শাখায় এবং অনলাইনে এই নাম্বারে পয়েন্ট জমা হবে।</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">আপনার নাম (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="যেমন: তানভীর আহমেদ"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>OTP পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>OTP কোড পাঠান</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-300">৬-ডিজিটের OTP কোড</label>
                  <button
                    type="button"
                    onClick={() => setStep("PHONE")}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    নাম্বার পরিবর্তন
                  </button>
                </div>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg font-mono tracking-widest text-center"
                    placeholder="123456"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>যাচাই হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>মেম্বার কার্ড ওপেন করুন</span>
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
