"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, ShieldCheck, X, CheckCircle2, Loader2, Smartphone, Building2, Apple } from "lucide-react";
import { useState } from "react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UPI_GATEWAYS = [
  { id: "gpay", name: "Google Pay", color: "text-blue-500", icon: "G" },
  { id: "phonepe", name: "PhonePe", color: "text-purple-500", icon: "P" },
  { id: "paytm", name: "Paytm", color: "text-blue-400", icon: "Py" }
];

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("upi");
  const [selectedUpi, setSelectedUpi] = useState<string>("gpay");

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Success animation delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-8 shadow-2xl"
          >
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Payment Successful!</h2>
                <p className="mt-2 text-zinc-400">Welcome to PrepAI Pro. Unlocking your features now...</p>
              </motion.div>
            ) : (
              <>
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white">Upgrade to Pro</h2>
                  <p className="text-sm text-zinc-500 mt-1">Join 2,000+ candidates landing top roles.</p>
                </div>

                <div className="space-y-6">
                  {/* Pricing Info */}
                  <div className="flex items-center justify-between rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">Annual Plan</p>
                      <p className="text-sm text-white">Full Platform Access</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">₹3,999</p>
                      <p className="text-[10px] text-zinc-500">/year</p>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                        paymentMethod === "upi" ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      UPI / Scan
                    </button>
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                        paymentMethod === "card" ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      Card
                    </button>
                  </div>

                  {paymentMethod === "upi" ? (
                    <div className="grid grid-cols-3 gap-3">
                      {UPI_GATEWAYS.map((gateway) => (
                        <button
                          key={gateway.id}
                          onClick={() => setSelectedUpi(gateway.id)}
                          className={`relative flex flex-col items-center justify-center py-4 rounded-xl border transition-all ${
                            selectedUpi === gateway.id 
                              ? "bg-white/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                              : "bg-white/5 border-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className={`text-lg font-black mb-1 ${gateway.color}`}>{gateway.icon}</div>
                          <span className="text-[10px] text-zinc-400 font-medium">{gateway.name}</span>
                          {selectedUpi === gateway.id && (
                            <div className="absolute top-1 right-1">
                              <CheckCircle2 className="h-3 w-3 text-indigo-500" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Card Number</label>
                        <div className="mt-1 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                          <CreditCard className="h-4 w-4 text-zinc-600" />
                          <input 
                            type="text" 
                            placeholder="4242 4242 4242 4242" 
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-700 text-white" 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Expiry</label>
                          <input 
                            type="text" 
                            placeholder="MM / YY" 
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-zinc-700 text-white" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">CVC</label>
                          <input 
                            type="text" 
                            placeholder="•••" 
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-zinc-700 text-white" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {paymentMethod === "upi" ? "Opening UPI App..." : "Verifying Payment..."}
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5" />
                        {paymentMethod === "upi" ? `Pay via ${UPI_GATEWAYS.find(g => g.id === selectedUpi)?.name}` : "Pay ₹3,999"}
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-zinc-600">
                    Trusted by 10,000+ Indians. Powered by Razorpay & Cashfree API.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
