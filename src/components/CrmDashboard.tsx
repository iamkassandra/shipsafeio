import React, { useState, useEffect } from "react";
import { 
  TrendingUp, Users, DollarSign, MessageSquare, HelpCircle, 
  Search, ShieldCheck, Download, RefreshCw, Key, AlertCircle, Database
} from "lucide-react";
import { motion } from "motion/react";

export default function CrmDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"metrics" | "users" | "transactions" | "inquiries">("metrics");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCrmData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/crm");
      if (!res.ok) throw new Error("Failed to retrieve CRM telemetry data.");
      const resData = await res.json();
      setData(resData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrmData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-brand-dark/50">RETRIEVING ENCRYPTED TELEMETRY MATRIX...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="inline-flex bg-red-50 p-3 rounded-full border border-red-100">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-brand-dark">Failed to load CRM Telemetry</h3>
        <p className="text-xs text-brand-dark/60 max-w-md mx-auto">{error}</p>
        <button
          onClick={fetchCrmData}
          className="bg-brand-blue text-white px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold hover:bg-[#0582aa] cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { metrics, users = [], transactions = [], inquiries = [] } = data || {};

  // Filter handlers
  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTransactions = transactions.filter((t: any) => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInquiries = inquiries.filter((inq: any) => 
    inq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inq.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Visual Telemetry Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-brand-gray">
        <div>
          <div className="inline-flex items-center gap-1.5 text-brand-blue font-bold text-[9px] uppercase font-mono tracking-widest bg-brand-blue/10 px-2.5 py-1 rounded-full mb-1">
            <Database className="w-3 h-3 animate-pulse" /> INTERNAL MANAGEMENT PORTAL
          </div>
          <h2 className="text-3xl font-shipsafe text-brand-dark tracking-tight leading-none">
            SHIPSAFE AI <span className="text-brand-blue">ADMIN CRM SYSTEM</span>
          </h2>
          <p className="text-xs text-brand-dark/50 mt-1 font-mono">
            Local database reporting node: active. Secure SSL simulated pipeline.
          </p>
        </div>

        <button
          onClick={fetchCrmData}
          className="flex items-center gap-1.5 bg-brand-light hover:bg-brand-gray text-brand-dark/80 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border border-brand-gray cursor-pointer transition-colors active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" /> RELOAD TELEMETRY
        </button>
      </div>

      {/* KPI Stats Board */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="bg-white border border-brand-gray rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-green-100 text-green-600 p-2.5 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-brand-dark/50 font-mono uppercase tracking-wider">Total Sales (USD)</p>
            <h4 className="text-xl font-bold font-mono text-brand-dark">${metrics.totalRevenue}.00</h4>
          </div>
        </div>

        {/* Total Sales Count */}
        <div className="bg-white border border-brand-gray rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-brand-blue/10 text-brand-blue p-2.5 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-brand-dark/50 font-mono uppercase tracking-wider">Transactions</p>
            <h4 className="text-xl font-bold font-mono text-brand-dark">{metrics.totalSalesCount} Completed</h4>
          </div>
        </div>

        {/* Registered Devs */}
        <div className="bg-white border border-brand-gray rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-indigo-50 text-indigo-500 p-2.5 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-brand-dark/50 font-mono uppercase tracking-wider">Registered Devs</p>
            <h4 className="text-xl font-bold font-mono text-brand-dark">{metrics.registeredUsersCount} Accounts</h4>
          </div>
        </div>

        {/* Support Inquiries */}
        <div className="bg-white border border-brand-gray rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-amber-50 text-amber-500 p-2.5 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-brand-dark/50 font-mono uppercase tracking-wider">Inquiries Logged</p>
            <h4 className="text-xl font-bold font-mono text-brand-dark">{metrics.totalInquiries} Open</h4>
          </div>
        </div>

        {/* SSAi Chat Interactions */}
        <div className="bg-white border border-brand-gray rounded-2xl p-4 shadow-sm flex items-center gap-3 col-span-2 lg:col-span-1">
          <div className="bg-rose-50 text-rose-500 p-2.5 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-brand-dark/50 font-mono uppercase tracking-wider">SSAi Interactions</p>
            <h4 className="text-xl font-bold font-mono text-brand-dark">{metrics.chatStats?.totalQueries || 0} Grounded</h4>
          </div>
        </div>
      </div>

      {/* CRM Navigation Menu */}
      <div className="border-b border-brand-gray flex gap-2">
        {(["metrics", "users", "transactions", "inquiries"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery("");
            }}
            className={`text-xs font-mono font-semibold uppercase px-4 py-2.5 border-b-2 transition-all cursor-pointer -mb-px ${
              activeTab === tab
                ? "text-brand-blue border-brand-blue font-bold bg-brand-blue/5"
                : "text-brand-dark/60 border-transparent hover:text-brand-dark"
            }`}
          >
            {tab === "metrics" && "📈 Telemetry Diagnostics"}
            {tab === "users" && `💻 Dev Accounts (${users.length})`}
            {tab === "transactions" && `💳 Sales Matrix (${transactions.length})`}
            {tab === "inquiries" && `📬 Support Inquiries (${inquiries.length})`}
          </button>
        ))}
      </div>

      {/* Interactive content based on active tab */}
      {activeTab === "metrics" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Distribution Stats */}
          <div className="bg-white border border-brand-gray rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold font-mono text-brand-dark/70 uppercase">License Plan Distribution</h3>
              <p className="text-[10px] text-brand-dark/40 font-mono">Completed license distribution stats.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="font-semibold text-brand-dark">Solo Edition ($99 USD)</span>
                  <span>{metrics.soloCount} sold</span>
                </div>
                <div className="w-full bg-brand-light h-3 rounded-full overflow-hidden border border-brand-gray">
                  <div 
                    className="bg-brand-blue h-full rounded-full transition-all duration-500" 
                    style={{ width: `${metrics.totalSalesCount > 0 ? (metrics.soloCount / metrics.totalSalesCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="font-semibold text-brand-dark">Commercial Edition ($299 USD)</span>
                  <span>{metrics.commercialCount} sold</span>
                </div>
                <div className="w-full bg-brand-light h-3 rounded-full overflow-hidden border border-brand-gray">
                  <div 
                    className="bg-brand-blue h-full rounded-full transition-all duration-500" 
                    style={{ width: `${metrics.totalSalesCount > 0 ? (metrics.commercialCount / metrics.totalSalesCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-gray font-mono text-center">
              <div className="bg-brand-light/50 border border-brand-gray p-3 rounded-xl">
                <span className="text-[10px] text-brand-dark/50 uppercase">Solo Value</span>
                <p className="text-md font-bold text-brand-dark">${metrics.soloCount * 99}.00</p>
              </div>
              <div className="bg-brand-light/50 border border-brand-gray p-3 rounded-xl">
                <span className="text-[10px] text-brand-dark/50 uppercase">Commercial Value</span>
                <p className="text-md font-bold text-brand-dark">${metrics.commercialCount * 299}.00</p>
              </div>
            </div>
          </div>

          {/* AI Grounding Telemetry */}
          <div className="bg-white border border-brand-gray rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold font-mono text-brand-dark/70 uppercase">Gemini AI Grounding Diagnostics</h3>
              <p className="text-[10px] text-brand-dark/40 font-mono">Chatbot performance and web-grounding parameters.</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-brand-gray pb-2">
                <span className="text-brand-dark/60">Active Model:</span>
                <span className="font-bold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded">gemini-3.5-flash</span>
              </div>
              <div className="flex justify-between border-b border-brand-gray pb-2">
                <span className="text-brand-dark/60">Search Grounding API tool:</span>
                <span className="font-bold text-green-600">Enabled (googleSearch)</span>
              </div>
              <div className="flex justify-between border-b border-brand-gray pb-2">
                <span className="text-brand-dark/60">Avg Response Latency:</span>
                <span className="text-brand-dark">1.25s</span>
              </div>
              <div className="flex justify-between border-b border-brand-gray pb-2">
                <span className="text-brand-dark/60">Active Sessions:</span>
                <span className="text-brand-dark">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-dark/60">Google Search Queries:</span>
                <span className="text-brand-dark">{metrics.chatStats?.searchQueries || 0} runs</span>
              </div>
            </div>

            <div className="bg-brand-light/30 border border-brand-gray p-3.5 rounded-2xl flex items-start gap-2.5 text-[11px] text-brand-dark/60 leading-relaxed font-mono">
              <ShieldCheck className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
              <p>
                <strong>Security Guardrail active:</strong> Customer queries regarding latest security flaws or packages trigger real-time Google Search grounding to verify and list fresh security advisories securely.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Accounts Table */}
      {activeTab === "users" && (
        <div className="bg-white border border-brand-gray rounded-3xl overflow-hidden shadow-sm space-y-4">
          <div className="p-4 sm:p-6 border-b border-brand-gray flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-brand-light/10">
            <div>
              <h3 className="text-sm font-bold font-mono text-brand-dark/80 uppercase">Registered Developer Directory</h3>
              <p className="text-[10px] text-brand-dark/40 font-mono">Browse and inspect developer credentials and license configurations.</p>
            </div>
            
            {/* Search inputs */}
            <div className="relative">
              <Search className="w-4 h-4 text-brand-dark/40 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search devs by name/email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs border border-brand-gray rounded-xl pl-9 pr-4 py-2 bg-brand-light focus:outline-none focus:border-brand-blue w-full sm:w-60"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-brand-light border-b border-brand-gray text-[10px] uppercase font-bold text-brand-dark/50">
                  <th className="p-4">Developer</th>
                  <th className="p-4">Account Type</th>
                  <th className="p-4">Purchased Plans</th>
                  <th className="p-4">Active License Keys</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-brand-dark/40">No developers matching filter found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u: any, idx: number) => (
                    <tr key={idx} className="hover:bg-brand-light/30">
                      <td className="p-4">
                        <span className="font-semibold text-brand-dark block">{u.name}</span>
                        <span className="text-[10px] text-brand-dark/50 block mt-0.5">{u.email}</span>
                      </td>
                      <td className="p-4">
                        {u.isAdmin ? (
                          <span className="bg-red-50 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-red-100">ADMIN</span>
                        ) : (
                          <span className="bg-blue-50 text-brand-blue text-[9px] font-bold px-2 py-0.5 rounded-full border border-brand-blue/15">DEVELOPER</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {u.purchasedPlans && u.purchasedPlans.length > 0 ? (
                            u.purchasedPlans.map((plan: string, pIdx: number) => (
                              <span key={pIdx} className="bg-brand-blue/10 text-brand-blue text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                                {plan}
                              </span>
                            ))
                          ) : (
                            <span className="text-brand-dark/30">-</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 space-y-1">
                        {u.licenseKeys && Object.keys(u.licenseKeys).length > 0 ? (
                          Object.entries(u.licenseKeys).map(([plan, key]: any, kIdx: number) => (
                            <div key={kIdx} className="flex items-center gap-1">
                              <span className="text-[9px] uppercase text-brand-dark/50">{plan}:</span>
                              <code className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 font-bold">{key}</code>
                            </div>
                          ))
                        ) : (
                          <span className="text-brand-dark/30">No active licenses</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sales Matrix Table */}
      {activeTab === "transactions" && (
        <div className="bg-white border border-brand-gray rounded-3xl overflow-hidden shadow-sm space-y-4">
          <div className="p-4 sm:p-6 border-b border-brand-gray flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-brand-light/10">
            <div>
              <h3 className="text-sm font-bold font-mono text-brand-dark/80 uppercase">Sales Transaction Ledger</h3>
              <p className="text-[10px] text-brand-dark/40 font-mono">Live Stripe simulated payment captures and transaction history logs.</p>
            </div>
            
            {/* Search input */}
            <div className="relative">
              <Search className="w-4 h-4 text-brand-dark/40 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Tx ID, name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs border border-brand-gray rounded-xl pl-9 pr-4 py-2 bg-brand-light focus:outline-none focus:border-brand-blue w-full sm:w-60"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-brand-light border-b border-brand-gray text-[10px] uppercase font-bold text-brand-dark/50">
                  <th className="p-4">Tx ID</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date / Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned License Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-brand-dark/40">No sales transactions located.</td>
                  </tr>
                ) : (
                  filteredTransactions.map((t: any, idx: number) => (
                    <tr key={idx} className="hover:bg-brand-light/30">
                      <td className="p-4 font-bold text-brand-dark">{t.id}</td>
                      <td className="p-4">
                        <span className="font-semibold text-brand-dark block">{t.name || "Anonymous Buyer"}</span>
                        <span className="text-[10px] text-brand-dark/50 block mt-0.5">{t.email}</span>
                      </td>
                      <td className="p-4 uppercase font-bold text-brand-blue">{t.plan}</td>
                      <td className="p-4 font-semibold text-brand-dark">${t.price}.00</td>
                      <td className="p-4 text-brand-dark/60">{new Date(t.timestamp).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          t.status === "completed" 
                            ? "bg-green-50 text-green-600 border-green-100" 
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}>
                          {t.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        {t.licenseKey ? (
                          <code className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 font-bold">{t.licenseKey}</code>
                        ) : (
                          <span className="text-brand-dark/30">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Support Inquiries View */}
      {activeTab === "inquiries" && (
        <div className="bg-white border border-brand-gray rounded-3xl overflow-hidden shadow-sm space-y-4">
          <div className="p-4 sm:p-6 border-b border-brand-gray flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-brand-light/10">
            <div>
              <h3 className="text-sm font-bold font-mono text-brand-dark/80 uppercase">Dev Support Intake Ledger</h3>
              <p className="text-[10px] text-brand-dark/40 font-mono">Contact form support tickets submitted by developers.</p>
            </div>
            
            {/* Search input */}
            <div className="relative">
              <Search className="w-4 h-4 text-brand-dark/40 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search subject, content, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs border border-brand-gray rounded-xl pl-9 pr-4 py-2 bg-brand-light focus:outline-none focus:border-brand-blue w-full sm:w-60"
              />
            </div>
          </div>

          <div className="p-6 space-y-4">
            {filteredInquiries.length === 0 ? (
              <p className="text-center text-xs text-brand-dark/40 py-10 font-mono">No customer support queries found.</p>
            ) : (
              filteredInquiries.map((inq: any, idx: number) => (
                <div key={idx} className="bg-brand-light/35 border border-brand-gray rounded-2xl p-5 space-y-3 font-mono">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-brand-gray pb-2.5">
                    <div>
                      <span className="text-[10px] text-brand-blue font-bold uppercase block">SUBJECT</span>
                      <h4 className="text-sm font-bold text-brand-dark">{inq.subject}</h4>
                    </div>
                    <span className="text-[10px] text-brand-dark/40">{new Date(inq.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-brand-dark/40 block uppercase">SUBMITTED BY</span>
                      <span className="font-bold text-brand-dark">{inq.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-dark/40 block uppercase">CONTACT EMAIL</span>
                      <span className="font-bold text-brand-blue hover:underline">{inq.email}</span>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-brand-gray text-xs text-brand-dark/85 leading-relaxed whitespace-pre-wrap">
                    {inq.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
