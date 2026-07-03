import React from "react";
import { Plan } from "../types";
import { ArrowLeft, Terminal, Shield, Check, Lock, Info, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface PlanDetailPageProps {
  plan: Plan;
  onBack: () => void;
  onSelectPlan: (plan: Plan) => void;
}

export default function PlanDetailPage({ plan, onBack, onSelectPlan }: PlanDetailPageProps) {
  const isCommercial = plan.id === "commercial";

  const comparisons = [
    { name: "Local Credentials Scanning", solo: true, commercial: true },
    { name: "Pre-commit Hook Integrations", solo: true, commercial: true },
    { name: "Multi-file High-speed Traversal", solo: false, commercial: true },
    { name: "Workspace Vulnerability Scanning", solo: false, commercial: true },
    { name: "CI/CD Pipeline Integration Guides", solo: false, commercial: true },
    { name: "Priority Support Level", solo: "Standard Email", commercial: "24/7 Priority Support" },
    { name: "Commercial Distribution Rights", solo: false, commercial: true },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Breadcrumb Back link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home Console
      </button>

      {/* Hero Banner Grid */}
      <div className="grid md:grid-cols-12 gap-8 items-center bg-white border border-brand-gray rounded-3xl p-6 sm:p-10 shadow-sm">
        {/* Plan Header Description */}
        <div className="md:col-span-8 space-y-6">
          <span className="text-[10px] bg-brand-blue/10 text-brand-blue font-bold px-3 py-1.5 rounded-full uppercase font-mono tracking-widest">
            {plan.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-dark">
            ShipSafe AI: <span className="text-brand-blue">{plan.name}</span>
          </h2>
          <p className="text-sm font-semibold font-mono text-brand-dark/50 uppercase tracking-wider">
            {plan.tagline}
          </p>
          <p className="text-sm text-brand-dark/85 leading-relaxed">
            {plan.description} Our pre-deployment scanner parses your repository in seconds, locating hardcoded strings, API secrets, and unsecure configurations, helping you preserve absolute sandbox security before staging.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <span className="text-xs bg-brand-light text-brand-dark px-3 py-1.5 border border-brand-gray rounded-lg font-mono font-medium">
              ⚡ Traversal Speed: ~350 files/sec
            </span>
            <span className="text-xs bg-brand-light text-brand-dark px-3 py-1.5 border border-brand-gray rounded-lg font-mono font-medium">
              🔒 Local Execution: 100% Sandbox
            </span>
          </div>
        </div>

        {/* Purchase Card */}
        <div className="md:col-span-4 bg-brand-light border border-brand-gray rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[9px] text-brand-dark/40 font-bold uppercase tracking-wider font-mono">
              ONE-TIME ACQUISITION LICENSE
            </span>
            <p className="text-4xl font-extrabold text-brand-dark">${plan.price}.00</p>
            <p className="text-[10px] text-brand-dark/50 font-mono">USD • Lifetime scan updates</p>
          </div>

          <div className="space-y-2 text-xs text-brand-dark/75 leading-relaxed border-t border-brand-gray/65 pt-4">
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-blue" /> Instant direct archive download
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-blue" /> Full CLI scripts included
            </p>
          </div>

          <button
            onClick={() => onSelectPlan(plan)}
            className="w-full bg-brand-blue hover:bg-[#0582aa] text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-lg shadow-brand-blue/15 cursor-pointer"
          >
            Acquire {plan.name} License
          </button>
        </div>
      </div>

      {/* Feature deep dive Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Core scanned items check list */}
        <div className="bg-white border border-brand-gray rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-brand-dark uppercase tracking-tight">
            Comprehensive Scan Definitions
          </h3>
          <p className="text-xs text-brand-dark/60 leading-relaxed">
            Our modular rules traverse multiple layers of syntax to lock down vulnerabilities before compiling:
          </p>
          <ul className="space-y-3.5 pt-2 text-xs">
            {plan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="bg-brand-blue/10 text-brand-blue p-1 rounded-md shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="text-brand-dark/85 font-medium leading-normal">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive CLI Demonstration Box */}
        <div className="bg-brand-dark text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between border border-white/10 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-brand-blue tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> LOCAL DEPLOYMENT SCENARIO
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-white/75 leading-relaxed">
              Upon successful payment verification, you receive a direct `.tar.gz` package containing your active scan files. Extract and bootstrap instantly:
            </p>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[11px] text-emerald-400 space-y-1 overflow-x-auto">
              <p className="text-white/40"># Extract scanner files</p>
              <p>tar -xzf shipsafe-{plan.id}.tar.gz</p>
              <p className="text-white/40"># Run automated scan checks</p>
              <p>./shipsafe-scan.sh</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1 text-xs">
            <div className="flex items-center gap-1 text-brand-blue font-bold uppercase text-[9px] font-mono">
              <Info className="w-3.5 h-3.5" /> Secure Sandboxed Execution
            </div>
            <p className="text-[10px] text-white/70 leading-relaxed">
              We certify that 100% of the scanner operates within your offline sandbox workspace. No proprietary source code leaves your local environment.
            </p>
          </div>
        </div>
      </div>

      {/* In-depth matrix comparison */}
      <div className="bg-white border border-brand-gray rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-brand-dark uppercase">
            Feature Comparison Matrix
          </h3>
          <p className="text-xs text-brand-dark/50 font-mono mt-1 uppercase">
            COMPREHENSIVE SQUAD CHECKLIST
          </p>
        </div>

        <div className="overflow-x-auto border border-brand-gray rounded-2xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-brand-light border-b border-brand-gray text-brand-dark/65 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-4">CAPABILITY</th>
                <th className="p-4 text-center">SOLO EDITION</th>
                <th className="p-4 text-center">COMMERCIAL EDITION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray text-brand-dark/85">
              {comparisons.map((c, idx) => (
                <tr key={idx} className="hover:bg-brand-light/40 transition-colors">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4 text-center">
                    {typeof c.solo === "boolean" ? (
                      c.solo ? <Check className="w-4 h-4 text-brand-blue mx-auto" /> : <span className="text-brand-dark/30">—</span>
                    ) : (
                      <span className="font-mono text-[10px]">{c.solo}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {typeof c.commercial === "boolean" ? (
                      c.commercial ? <Check className="w-4 h-4 text-brand-blue mx-auto" /> : <span className="text-brand-dark/30">—</span>
                    ) : (
                      <span className="font-mono text-[10px] font-bold text-brand-blue">{c.commercial}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
