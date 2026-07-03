import React, { useState } from "react";
import { BookOpen, Terminal, CheckCircle, ShieldAlert, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface DocArticle {
  id: string;
  category: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
}

export default function DocsPage() {
  const [activeArticle, setActiveArticle] = useState<string | null>(null);

  const articles: DocArticle[] = [
    {
      id: "get-started",
      category: "Guides",
      title: "Installing & Running the ShipSafe Guardrail locally",
      date: "July 2026",
      readTime: "3 min read",
      excerpt: "Learn how to configure our lightweight pre-deployment guardrail within your project repository root.",
      content: [
        "ShipSafe operates locally as an ultra-high-speed scanner wrapper. Because our scripts run securely within your sandbox environment, none of your sensitive company code or API secrets are ever streamed to secondary servers.",
        "To install, simply extract the downloaded package into your workspace, make the wrapper executable, and initiate the scan command:",
        "chmod +x shipsafe-scan.sh\n./shipsafe-scan.sh",
        "The scanner traverses directories recursively, filtering out build assets (node_modules, .next, dist) to detect raw hardcoded API keys, private credentials, and unsafe environment parameters."
      ]
    },
    {
      id: "cicd-pipeline",
      category: "Workflows",
      title: "CI/CD Integration for Production Deployments",
      date: "June 2026",
      readTime: "5 min read",
      excerpt: "Step-by-step documentation on embedding ShipSafe scan routines inside GitHub Actions and GitLab pipelines.",
      content: [
        "For teams leveraging the Commercial Edition, ShipSafe can be deployed as a blocking continuous integration gate. If any team member introduces hardcoded secrets in their commits, the build pipeline fails automatically, preventing accidental cloud disclosure.",
        "Example GitHub Actions job definition:",
        "name: ShipSafe Audit\non: [push, pull_request]\njobs:\n  audit:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Run ShipSafe Scan\n        run: | \n          chmod +x ./shipsafe-scan.sh\n          ./shipsafe-scan.sh",
        "By enforcing pre-merge checks, enterprise squads completely eliminate credential leakage across their cloud services."
      ]
    },
    {
      id: "circular-deps",
      category: "Architecture",
      title: "Resolving Circular Dependency Loops with Static Analysis",
      date: "May 2026",
      readTime: "4 min read",
      excerpt: "An architectural deep-dive on circular reference errors and how static code guardrails flag modular risks.",
      content: [
        "In modern full-stack development, circular dependencies occur when Module A references Module B, which simultaneously references Module A. This pattern leads to runtime silent initialization failures and slow packaging pipelines.",
        "ShipSafe Commercial Edition includes an advanced circular reference solver. It scans your import trees, mapping static reference nodes using directed graph analysis, and lists dependency loops clearly in your terminal console.",
        "Refactoring these relationships with structural interfaces or service providers increases codebase cohesion and eliminates packaging vulnerabilities."
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Title block */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h2 className="text-4xl sm:text-5xl font-shipsafe text-brand-dark tracking-tight">
          DEVELOPER <span className="text-brand-blue">DOCUMENTATION</span>
        </h2>
        <p className="text-sm text-brand-dark/60 mt-3 font-mono">
          KNOWLEDGE BASE • COMPLIANCE REQUISITES • LOCAL PIPELINES
        </p>
      </div>

      {activeArticle === null ? (
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              onClick={() => setActiveArticle(article.id)}
              whileHover={{ y: -4 }}
              className="bg-white border border-brand-gray rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] bg-brand-blue/10 text-brand-blue font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  {article.category}
                </span>
                <h3 className="text-xl font-bold text-brand-dark mt-4 font-sans leading-snug hover:text-brand-blue transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-brand-dark/60 mt-3 line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-gray flex items-center justify-between text-xs font-semibold text-brand-blue">
                <span className="font-mono text-brand-dark/40">{article.readTime}</span>
                <span className="flex items-center gap-1">
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-brand-gray rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto shadow-sm"
        >
          <button
            onClick={() => setActiveArticle(null)}
            className="text-xs font-semibold text-brand-blue hover:underline mb-8 flex items-center gap-1.5 cursor-pointer"
          >
            ← Back to Docs
          </button>

          {(() => {
            const art = articles.find((a) => a.id === activeArticle)!;
            return (
              <article className="space-y-6">
                <div>
                  <span className="text-[10px] bg-brand-blue/10 text-brand-blue font-bold px-3 py-1 rounded-full uppercase font-mono">
                    {art.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark mt-4">
                    {art.title}
                  </h1>
                  <div className="flex items-center gap-4 text-xs font-mono text-brand-dark/50 mt-3 border-b border-brand-gray pb-4">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <div className="text-sm text-brand-dark/85 leading-relaxed space-y-4">
                  {art.content.map((p, idx) => {
                    // Render terminal code blocks differently
                    if (p.includes("./shipsafe-scan.sh") || p.includes("uses: actions/checkout")) {
                      return (
                        <div key={idx} className="bg-brand-dark text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre border border-white/10 my-4 shadow-inner">
                          {p}
                        </div>
                      );
                    }
                    return <p key={idx}>{p}</p>;
                  })}
                </div>
              </article>
            );
          })()}
        </motion.div>
      )}

      {/* Trust Badge Banner */}
      <div className="mt-16 bg-brand-blue/5 border border-brand-blue/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="flex gap-4 items-start">
          <Terminal className="w-10 h-10 text-brand-blue shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-brand-dark">Need Custom Command Integrations?</h4>
            <p className="text-xs text-brand-dark/60 mt-1">
              Connect our security hooks with pre-commit setups like husky or git hooks. Ask SSAi in the chatbot panel for quick support scripts!
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const toggleBtn = document.getElementById("chatbot-toggle-btn");
            if (toggleBtn) toggleBtn.click();
          }}
          className="bg-brand-blue hover:bg-[#0582aa] text-white font-semibold text-xs rounded-xl px-5 py-3 transition-colors shrink-0 cursor-pointer"
        >
          Ask Support Agent
        </button>
      </div>
    </div>
  );
}
