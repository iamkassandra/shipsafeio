import React from "react";
import { Download, ShieldCheck, Key, RefreshCw, LogOut, Terminal, BookOpen, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface DeveloperDashboardProps {
  user: any;
  onLogout: () => void;
  setView: (view: any) => void;
}

export default function DeveloperDashboard({ user, onLogout, setView }: DeveloperDashboardProps) {
  const hasPurchases = user.purchasedPlans && user.purchasedPlans.length > 0;

  const triggerDownload = (plan: string) => {
    // Generate simulated single-session secure token
    const token = `DL_${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
    const downloadUrl = `/api/download?plan=${plan}&token=${token}`;
    
    // Trigger download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `shipsafe-${plan}.tar.gz`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      {/* Welcome Hero Panel */}
      <div className="bg-white border border-brand-gray rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-brand-blue font-bold text-[9px] uppercase font-mono tracking-widest bg-brand-blue/10 px-2.5 py-1 rounded-full">
            <Terminal className="w-3.5 h-3.5" /> DEVELOPER ACCOUNT PORTAL
          </div>
          <h2 className="text-3xl font-shipsafe text-brand-dark tracking-tight leading-none">
            WELCOME BACK, <span className="text-brand-blue">{user.name.toUpperCase()}</span>
          </h2>
          <p className="text-xs text-brand-dark/50 font-mono">
            Secure offline registry connected • Email: <span className="text-brand-dark/80 font-bold">{user.email}</span>
          </p>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 border border-red-200 hover:bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <LogOut className="w-4 h-4" /> LOG OUT SESSION
        </button>
      </div>

      {/* Main content split */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: License & Download Hub */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-brand-gray rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <h3 className="text-lg font-bold text-brand-dark">ACTIVE SECURITY LICENSES</h3>
              <p className="text-xs text-brand-dark/50 font-mono uppercase mt-0.5">
                ON-PREMISE GUARDRAIL PACKAGES
              </p>
            </div>

            {!hasPurchases ? (
              <div className="text-center py-12 space-y-4 border-2 border-dashed border-brand-gray rounded-2xl bg-brand-light/20 p-6">
                <ShieldCheck className="w-12 h-12 text-brand-dark/30 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-brand-dark uppercase font-mono">No Active Guardrails Found</h4>
                  <p className="text-xs text-brand-dark/60 max-w-sm mx-auto mt-1 leading-relaxed">
                    You haven't acquired a pre-deployment scanner license yet. Secure your pipeline by selecting a plan below.
                  </p>
                </div>
                <button
                  onClick={() => setView("home")}
                  className="bg-brand-blue hover:bg-[#0582aa] text-white px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-md shadow-brand-blue/15 inline-block"
                >
                  Browse Scanner Licenses
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {user.purchasedPlans.map((plan: string, idx: number) => (
                  <div key={idx} className="border border-brand-gray bg-brand-light/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] bg-brand-blue/15 text-brand-blue font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">
                        {plan === "commercial" ? "Commercial Edition License" : "Solo Edition License"}
                      </span>
                      <h4 className="text-md font-bold text-brand-dark">
                        {plan === "commercial" ? "Active Enterprise Guardrail" : "Active Solo Dev Shield"}
                      </h4>
                      <div className="flex items-center gap-1.5 pt-1">
                        <Key className="w-3.5 h-3.5 text-brand-dark/40" />
                        <code className="text-xs text-green-600 font-mono font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">
                          {user.licenseKeys?.[plan] || "SS-LICENSE-PENDING-KEY"}
                        </code>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerDownload(plan)}
                      className="flex items-center gap-2 bg-brand-blue hover:bg-[#0582aa] text-white font-semibold text-xs rounded-xl px-4 py-2.5 shadow-md shadow-brand-blue/15 transition-all cursor-pointer active:scale-95 font-mono uppercase"
                    >
                      <Download className="w-4 h-4" /> Download Archive
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quickstart integration terminal */}
          <div className="bg-brand-dark text-brand-light rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 border border-brand-dark">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-xs text-white/50 font-mono pl-2">shipsafe-scanner --install</span>
              </div>
              <span className="text-[9px] bg-white/10 text-white/70 font-mono uppercase px-2 py-0.5 rounded">v1.4.2</span>
            </div>

            <div className="space-y-3 font-mono text-[11px] leading-relaxed text-white/90">
              <p className="text-white/40"># 1. Unpack the ShipSafe scanner bundle</p>
              <p><span className="text-brand-blue">tar</span> -xzvf shipsafe-solo.tar.gz</p>
              
              <p className="text-white/40"># 2. Initialize pre-commit pipeline configuration</p>
              <p><span className="text-brand-blue">./shipsafe-scan</span> --init --key=<span className="text-green-400">{user.licenseKeys?.solo || user.licenseKeys?.commercial || "SS-YOUR-LICENSE-KEY"}</span></p>
              
              <p className="text-white/40"># 3. Securely run manual directory diagnostic scans</p>
              <p><span className="text-brand-blue">./shipsafe-scan</span> --dir ./src --verbose</p>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Resources */}
        <div className="space-y-6">
          <div className="bg-white border border-brand-gray rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-brand-dark uppercase font-mono">Developer Resources</h4>
            <div className="divide-y divide-brand-gray text-xs space-y-3 pt-2">
              <button
                onClick={() => setView("docs")}
                className="flex items-center justify-between w-full text-left py-2 hover:text-brand-blue transition-colors cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-blue" />
                  Scanner Documentation
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-dark/40 group-hover:text-brand-blue" />
              </button>

              <button
                onClick={() => {
                  const chatbotBtn = document.getElementById("chatbot-toggle-btn");
                  if (chatbotBtn) chatbotBtn.click();
                }}
                className="flex items-center justify-between w-full text-left py-2 hover:text-brand-blue transition-colors cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-brand-blue" />
                  Consult SSAi Assistant
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-dark/40 group-hover:text-brand-blue" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-brand-gray rounded-3xl p-6 shadow-sm space-y-3 text-xs leading-relaxed text-brand-dark/70">
            <h4 className="text-sm font-bold text-brand-dark uppercase font-mono">Secure Sandboxed Engine</h4>
            <p>
              Your local scanning engine is designed for secure, offline analysis. ShipSafe operates locally, ensuring no proprietary source code ever leaves your developer environment.
            </p>
            <p>
              All analyses are completed inside a sandboxed local container to guarantee regulatory compliance and absolute data confidentiality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
