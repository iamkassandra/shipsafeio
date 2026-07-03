import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const socials = [
    { name: "Facebook", href: "https://facebook.com" },
    { name: "Instagram", href: "https://instagram.com" },
    { name: "X", href: "https://x.com" },
    { name: "Reddit", href: "https://reddit.com" },
    { name: "Discord", href: "https://discord.gg" },
    { name: "LinkedIn", href: "https://linkedin.com" },
  ];

  return (
    <footer className="border-t border-brand-gray bg-white pt-16 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Upper Column Block: Newsletter & Description */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h4 className="text-xl font-shipsafe text-brand-dark tracking-wide">
              JOIN THE <span className="text-brand-blue">DEVELOPER INTAKE</span>
            </h4>
            <p className="text-xs text-brand-dark/60 leading-relaxed max-w-md">
              Receive updates on pre-deployment security scan releases, local guardrail updates, and circular reference solving tools built by the ShipSafe Labs team.
            </p>
          </div>

          <div className="bg-brand-light p-6 rounded-3xl border border-brand-gray">
            {subscribed ? (
              <div className="flex items-center gap-3 text-brand-blue text-xs font-mono font-bold uppercase">
                <CheckCircle2 className="w-5 h-5 text-brand-blue" />
                <span>Subscription Confirmed! Welcome to ShipSafe Labs.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-brand-dark/50 block">
                  Subscribe to Mailing List
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your developer email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 text-xs border border-brand-gray rounded-xl px-3.5 py-2 bg-white focus:outline-none focus:border-brand-blue font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-brand-blue hover:bg-[#0582aa] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors shrink-0 font-mono uppercase cursor-pointer"
                  >
                    SUBSCRIBE
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Floating Social Pill (Matching Image Spec) */}
        <div className="flex flex-col items-center gap-4 py-6">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-brand-dark/40">
            CONNECT WITH THE FOUNDATION
          </span>
          <div className="bg-brand-blue rounded-full px-5 py-3 shadow-xl shadow-brand-blue/15 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 max-w-full">
            {socials.map((s, idx) => (
              <a
                key={idx}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                referrerPolicy="no-referrer"
                className="text-xs font-mono font-semibold text-white/90 hover:text-white hover:underline transition-all"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* T&Cs and Legal Policies */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] font-mono font-bold text-brand-dark/40 uppercase pt-6 border-t border-brand-gray pb-8">
          <a href="#" className="hover:text-brand-blue">Terms & Conditions</a>
          <span>•</span>
          <a href="#" className="hover:text-brand-blue">0% Liability Waiver Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-brand-blue">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-brand-blue">Developer Terms of Use</a>
          <span>•</span>
          <span>© 2026 ShipSafe AI Labs • Apostello Kairos Foundation</span>
        </div>
      </div>

      {/* Giant VERIFICATION Display typography peaking from the bottom (Matching Screenshot) */}
      <div className="relative mt-12 bg-brand-light pt-8 pb-10 border-t border-brand-gray/50 flex flex-col items-center justify-center select-none overflow-hidden">
        <h2 className="text-[14vw] font-serif font-black text-brand-blue/15 leading-none tracking-tight transform scale-x-[1.1] select-none translate-y-3 text-center uppercase font-bodoni">
          VERIFICATION
        </h2>
        <div className="absolute bottom-6 text-center">
          <p className="text-[11px] sm:text-xs font-serif italic tracking-wider text-brand-dark/65 font-bodoni">
            THE MISSING LINK BETWEEN ARTIFICIAL AND INTELLIGENCE.
          </p>
        </div>
      </div>
    </footer>
  );
}
