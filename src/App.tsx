import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PlanCard from "./components/PlanCard";
import PlanDetailPage from "./components/PlanDetailPage";
import DocsPage from "./components/DocsPage";
import AboutPage from "./components/AboutPage";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import CheckoutModal from "./components/CheckoutModal";
import AuthModal from "./components/AuthModal";
import DeveloperDashboard from "./components/DeveloperDashboard";
import CrmDashboard from "./components/CrmDashboard";
import { PageView, Plan } from "./types";
import { Shield, Check, Lock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PLANS: Plan[] = [
  {
    id: "solo",
    name: "Solo Edition",
    price: 99,
    badge: "Indie License",
    tagline: "Individual pre-commit secret scanner",
    description: "Equip your personal workspaces with a robust pre-commit scan loop. Detect hardcoded variables, API keys, and configurations before committing.",
    features: [
      "Recursive hardcoded key scanner",
      "Unsecure environment detection",
      "Local sandboxed execution (100% offline)",
      "Automated key exposure prevention",
      "Instant direct archive download",
      "Standard developer email assistance"
    ]
  },
  {
    id: "commercial",
    name: "Commercial Edition",
    price: 299,
    badge: "Enterprise License",
    tagline: "CI/CD automated production pipelines",
    description: "Engineered for active production pipelines, software agencies, and software-as-a-service squads requiring advanced scan rulesets.",
    features: [
      "High-speed multi-file traversal (~350 files/sec)",
      "Deep workspace vulnerability report",
      "CI/CD pipeline hooks (GitHub, GitLab, CircleCI)",
      "Prioritized enterprise email assistance (SLA <12h)",
      "Corporate compliance report generator",
      "Unlimited scan seats across dev pipelines",
      "Enterprise security compliance coverage"
    ]
  }
];

export default function App() {
  const [view, setView] = useState<PageView>("home");
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem("shipsafe_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleExplorePlan = (planId: "solo" | "commercial") => {
    setView(planId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectPlan = (plan: Plan) => {
    setCheckoutPlan(plan);
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem("shipsafe_user", JSON.stringify(user));
    if (user.isAdmin) {
      setView("crm");
    } else {
      setView("dashboard");
    }
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("shipsafe_user");
    setView("home");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-light font-sans text-brand-dark antialiased selection:bg-brand-blue selection:text-white">
      {/* 1. Brand Header Navbar */}
      <Navbar 
        currentView={view} 
        setView={setView} 
        currentUser={currentUser} 
        onOpenAuth={() => setIsAuthOpen(true)} 
      />

      {/* 2. Primary Page Router Layout */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Image Hero Layout */}
              <Hero />

              {/* Grid Pricing Container */}
              <section id="plans-section-selector" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-brand-light">
                <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
                  <h3 className="text-3xl sm:text-4xl font-shipsafe text-brand-dark leading-tight tracking-tight uppercase">
                    Select your <span className="text-brand-blue">Edition</span>
                  </h3>
                  <p className="text-xs text-brand-dark/50 leading-relaxed uppercase font-mono">
                    PRE-COMMIT SCANNING SOLUTIONS FOR INDIVIDUAL DEVELOPERS AND TEAMS
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {PLANS.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onSelectPlan={handleSelectPlan}
                      onExplorePlan={handleExplorePlan}
                    />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === "solo" && (
            <motion.div
              key="solo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PlanDetailPage
                plan={PLANS[0]}
                onBack={() => setView("home")}
                onSelectPlan={handleSelectPlan}
              />
            </motion.div>
          )}

          {view === "commercial" && (
            <motion.div
              key="commercial"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PlanDetailPage
                plan={PLANS[1]}
                onBack={() => setView("home")}
                onSelectPlan={handleSelectPlan}
              />
            </motion.div>
          )}

          {view === "docs" && (
            <motion.div
              key="docs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DocsPage />
            </motion.div>
          )}

          {view === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AboutPage />
            </motion.div>
          )}

          {view === "dashboard" && currentUser && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <DeveloperDashboard 
                user={currentUser} 
                onLogout={handleLogout} 
                setView={setView} 
              />
            </motion.div>
          )}

          {view === "crm" && currentUser?.isAdmin && (
            <motion.div
              key="crm"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <CrmDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Socials/Footer block */}
      <Footer />

      {/* 4. Chatbot Panel Support Agent Overlay */}
      <Chatbot />

      {/* 5. Custom Stripe Checkout popup overlay */}
      <AnimatePresence>
        {checkoutPlan && (
          <CheckoutModal
            plan={checkoutPlan}
            onClose={() => setCheckoutPlan(null)}
            currentUser={currentUser}
            onPaymentSuccess={(updatedUser) => {
              setCurrentUser(updatedUser);
              localStorage.setItem("shipsafe_user", JSON.stringify(updatedUser));
            }}
          />
        )}
      </AnimatePresence>

      {/* 6. Secure Authentication modal popup */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal 
            onClose={() => setIsAuthOpen(false)} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
