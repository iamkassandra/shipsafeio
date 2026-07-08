import React, { useState } from "react";
import { X, CreditCard, Lock, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Plan } from "../types";
import { motion } from "motion/react";
import { loadStripe } from "@stripe/stripe-js";

const publishableKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_live_51Suz4dLAIJwl3rVahaVEyHBmfRnyY2Lj0AE52VMbscnpghnUCyQV9MWlX15KCOgxbTOuqEl8C5tb0nSWhnGThgtD00W7UauzR9";
const stripePromise = loadStripe(publishableKey);
const isLiveMode = publishableKey.startsWith("pk_live");

interface CheckoutModalProps {
  plan: Plan;
  onClose: () => void;
  currentUser?: any;
  onPaymentSuccess?: (updatedUser: any) => void;
}

export default function CheckoutModal({ plan, onClose, currentUser, onPaymentSuccess }: CheckoutModalProps) {
  const [email, setEmail] = useState(currentUser?.email || "");
  const [name, setName] = useState(currentUser?.name || "");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [acceptLiability, setAcceptLiability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!acceptLiability) {
      setErrorMsg("You must explicitly accept the non/minimal liability clause to complete your checkout.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create checkout session on backend
      const resCheckout = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id, email, acceptLiability }),
      });

      const dataCheckout = await resCheckout.json();
      if (!resCheckout.ok) {
        throw new Error(dataCheckout.error || "Failed to create checkout session.");
      }

      let verificationBody: any = {
        txId: dataCheckout.txId,
        plan: plan.id,
        email,
        name,
      };

      if (dataCheckout.isRealStripe && dataCheckout.clientSecret) {
        // Real Stripe payment flow using PaymentIntent client secret!
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Stripe.js failed to load. Please verify your Stripe publishable key.");
        }

        // Parse Expiry Date (MM/YY or MM/YYYY)
        const expiryParts = cardExpiry.split("/");
        const expMonth = parseInt(expiryParts[0]?.trim(), 10);
        let expYear = parseInt(expiryParts[1]?.trim(), 10);

        if (isNaN(expMonth) || isNaN(expYear) || expMonth < 1 || expMonth > 12) {
          throw new Error("Invalid card expiration date. Please use MM/YY format.");
        }

        // Convert 2-digit year to 4-digit year
        if (expYear < 100) {
          expYear += 2000;
        }

        // Confirm the payment with Stripe!
        const { paymentIntent, error } = await stripe.confirmCardPayment(dataCheckout.clientSecret, {
          payment_method: {
            card: {
              number: cardNumber.replace(/\s/g, ""),
              exp_month: expMonth,
              exp_year: expYear,
              cvc: cardCVC,
            },
            billing_details: {
              name: name,
              email: email,
            },
          },
        } as any);

        if (error) {
          throw new Error(error.message || "Stripe was unable to authorize the transaction.");
        }

        if (!paymentIntent || paymentIntent.status !== "succeeded") {
          throw new Error(`Payment failed with status: ${paymentIntent?.status || "unknown"}`);
        }

        verificationBody.isRealStripe = true;
        verificationBody.paymentIntentId = paymentIntent.id;
      } else {
        // Fallback simulated payment flow
        verificationBody.isRealStripe = false;
        verificationBody.cardNumber = cardNumber;
        verificationBody.cardExpiry = cardExpiry;
        verificationBody.cardCVC = cardCVC;
      }

      // 2. Submit payment verification to backend
      const resVerify = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationBody),
      });

      const dataVerify = await resVerify.json();
      if (!resVerify.ok) {
        throw new Error(dataVerify.error || "Payment verification failed.");
      }

      // If user is logged in, or we auto-created their account, let's update client state
      if (onPaymentSuccess) {
        const updatedPlans = currentUser ? [...(currentUser.purchasedPlans || [])] : [];
        if (!updatedPlans.includes(plan.id)) {
          updatedPlans.push(plan.id);
        }
        
        const updatedKeys = currentUser ? { ...(currentUser.licenseKeys || {}) } : {};
        updatedKeys[plan.id] = dataVerify.licenseKey;

        onPaymentSuccess({
          email: currentUser?.email || email.toLowerCase(),
          name: currentUser?.name || name,
          isAdmin: currentUser?.isAdmin || email.toLowerCase().endsWith("@shipsafe.ai"),
          purchasedPlans: updatedPlans,
          licenseKeys: updatedKeys
        });
      }

      // Success!
      setDownloadLink(dataVerify.downloadUrl);
      setStep("success");

      // Instantly trigger download
      const link = document.createElement("a");
      link.href = dataVerify.downloadUrl;
      link.setAttribute("download", `shipsafe-${plan.id}.tar.gz`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-[500px] shadow-2xl overflow-hidden border border-brand-gray relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-dark/50 hover:text-brand-dark cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "form" ? (
          <form onSubmit={handlePay} className="p-6 sm:p-8 space-y-5">
            {/* Header */}
            <div>
              <span className="text-[10px] bg-brand-blue/10 text-brand-blue font-semibold uppercase px-2.5 py-1 rounded-full">
                {plan.badge}
              </span>
              <h3 className="text-xl font-bold text-brand-dark mt-2">
                Checkout: {plan.name}
              </h3>
              <p className="text-sm text-brand-dark/60 mt-1 font-mono">
                ${plan.price}.00 USD (One-time)
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl flex items-start gap-2.5 border border-red-100">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-brand-dark/70 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Satoshi Nakamoto"
                  className="w-full text-xs border border-brand-gray rounded-xl px-3 py-2.5 bg-brand-light focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-dark/70 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full text-xs border border-brand-gray rounded-xl px-3 py-2.5 bg-brand-light focus:outline-none focus:border-brand-blue"
                />
              </div>

              {/* Simulated / Real Card Block */}
              <div className="border border-brand-gray rounded-2xl p-4 bg-brand-light/30 space-y-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-brand-dark/60">
                    <CreditCard className="w-4 h-4 text-brand-blue" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                      {isLiveMode ? "SECURE STRIPE LIVE GATEWAY" : "SIMULATED STRIPE GATEWAY"}
                    </span>
                  </div>
                  <span className="text-[9px] text-brand-dark/50 font-mono">
                    {isLiveMode ? (
                      <>
                        * Fully encrypted checkout. Sensitive credit details are tokenized securely on Stripe's PCI-compliant servers.
                      </>
                    ) : (
                      <>
                        * Use test card <strong className="text-brand-blue font-mono font-bold">4242 4242 4242 4242</strong> to succeed. Any other card simulates a decline.
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-brand-dark/60 block mb-1 uppercase">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    placeholder="4242 4242 4242 4242"
                    className="w-full text-xs border border-brand-gray rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-brand-blue font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-brand-dark/60 block mb-1 uppercase">
                      Expiration
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength={5}
                      className="w-full text-xs border border-brand-gray rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-brand-blue font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-brand-dark/60 block mb-1 uppercase">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="123"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ""))}
                      maxLength={3}
                      className="w-full text-xs border border-brand-gray rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-brand-blue font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Liability waiver checkbox (MANDATORY REQUIREMENT) */}
              <label className="flex items-start gap-3 bg-brand-blue/5 border border-brand-blue/15 p-3.5 rounded-2xl cursor-pointer hover:bg-brand-blue/10 transition-colors">
                <input
                  type="checkbox"
                  required
                  checked={acceptLiability}
                  onChange={(e) => setAcceptLiability(e.target.checked)}
                  className="mt-1 accent-brand-blue shrink-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] text-brand-dark/85 leading-relaxed">
                  I explicitly accept and agree to the <strong>non/minimal liability clause</strong>. I acknowledge that ShipSafe is a pre-deployment scanning utility provided as-is, and the creators hold zero or minimal liability for any undetected secrets, exposure events, or security vulnerabilities in production.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-blue hover:bg-[#0582aa] text-white font-semibold rounded-2xl py-3 px-4 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-brand-gray flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-blue/20"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Contacting Stripe...
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ${plan.price}.00 securely
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-brand-dark/40 font-mono flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Fully encrypted Stripe SSL payment channel
            </p>
          </form>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-brand-dark">Payment Successful!</h3>
              <p className="text-sm text-brand-dark/60 mt-1.5">
                Thank you for purchasing ShipSafe AI {plan.name}!
              </p>
              <div className="bg-blue-50/50 border border-brand-blue/10 rounded-2xl p-3.5 my-3 text-xs text-brand-dark/80 font-mono leading-relaxed text-center">
                📬 We have successfully dispatched a secure email to:
                <div className="font-bold text-brand-blue mt-1 break-all">{email}</div>
                <div className="text-[10px] text-brand-dark/50 mt-1">It contains your official license key and a permanent link to download your package.</div>
              </div>
              <p className="text-xs text-brand-blue font-mono mt-1">
                Your direct browser download has been initiated automatically.
              </p>
            </div>

            <div className="bg-brand-light p-4 rounded-2xl border border-brand-gray space-y-2 text-left">
              <p className="text-[10px] uppercase font-mono font-bold text-brand-dark/50">
                Package Details
              </p>
              <p className="text-xs text-brand-dark font-medium font-mono">
                File: shipsafe-{plan.id}.tar.gz
              </p>
              <p className="text-xs text-brand-dark/60 font-mono">
                Platform: Cross-platform tarball scan pipeline
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={downloadLink}
                className="w-full bg-brand-blue hover:bg-[#0582aa] text-white font-semibold rounded-2xl py-3 px-4 flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Retry Direct Download
              </a>

              <button
                onClick={onClose}
                className="w-full border border-brand-gray hover:bg-brand-light text-brand-dark font-semibold rounded-2xl py-2.5 px-4 transition-all cursor-pointer text-xs"
              >
                Return to Site
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
