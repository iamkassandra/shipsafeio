import React, { useState } from "react";
import { X, Lock, Mail, User, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({ onClose, onLoginSuccess, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login" 
        ? JSON.stringify({ email, password }) 
        : JSON.stringify({ email, password, name });

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please check credentials.");
      }

      if (mode === "register") {
        setSuccessMsg("Account created successfully! Logging you in...");
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 1200);
      } else {
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-[420px] shadow-2xl overflow-hidden border border-brand-gray relative p-6 sm:p-8 space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-dark/50 hover:text-brand-dark cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Branding & Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-brand-blue font-bold text-[9px] uppercase font-mono tracking-widest bg-brand-blue/10 px-2.5 py-1 rounded-full mb-2">
            <Shield className="w-3 h-3" /> ShipSafe Secure Gateway
          </div>
          <h3 className="text-2xl font-bold text-brand-dark">
            {mode === "login" ? "Welcome Back" : "Create Developer Account"}
          </h3>
          <p className="text-xs text-brand-dark/50 mt-1 font-mono">
            {mode === "login" ? "Log in to access your pre-deployment files" : "Access direct downloads and license details"}
          </p>
        </div>

        {/* Info alerts */}
        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2 border border-red-100">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl flex items-start gap-2 border border-green-100">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <p>{successMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-[10px] font-bold text-brand-dark/70 block mb-1 uppercase font-mono">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-brand-dark/40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Ada Lovelace"
                  className="w-full text-xs border border-brand-gray rounded-xl pl-9 pr-3 py-2.5 bg-brand-light focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-brand-dark/70 block mb-1 uppercase font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-brand-dark/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full text-xs border border-brand-gray rounded-xl pl-9 pr-3 py-2.5 bg-brand-light focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-dark/70 block mb-1 uppercase font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-brand-dark/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs border border-brand-gray rounded-xl pl-9 pr-3 py-2.5 bg-brand-light focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-blue hover:bg-[#0582aa] text-white font-semibold rounded-xl py-3 px-4 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase font-mono tracking-wider shadow-lg shadow-brand-blue/15"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              mode === "login" ? "Log In Now" : "Create Developer Account"
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        {mode === "login" && (
          <div className="bg-brand-light p-3 rounded-2xl border border-brand-gray text-[11px] text-brand-dark/60 leading-relaxed font-mono">
            <span className="font-bold text-brand-dark text-xs block mb-1">🔑 Demo accounts configured:</span>
            Admin: <code className="text-brand-blue">admin@shipsafe.ai</code> / <code className="text-brand-blue">admin</code><br />
            Developer: <code className="text-brand-blue">developer@demo.com</code> / <code className="text-brand-blue">password123</code>
          </div>
        )}

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-brand-gray text-xs">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setErrorMsg(null);
            }}
            className="text-brand-dark/60 hover:text-brand-blue transition-colors cursor-pointer"
          >
            {mode === "login" 
              ? "Don't have a developer account? Sign up" 
              : "Already have a developer account? Log in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
