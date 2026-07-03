import React from "react";
import { PageView } from "../types";
import { Sparkles, BookOpen, User, HelpCircle, Shield, Database } from "lucide-react";

interface NavbarProps {
  currentView: PageView;
  setView: (view: PageView) => void;
  currentUser: any;
  onOpenAuth: () => void;
}

export default function Navbar({ currentView, setView, currentUser, onOpenAuth }: NavbarProps) {
  const navItems: { id: PageView; label: string; icon?: React.ReactNode }[] = [
    { id: "home", label: "SHIPSAFE" },
    { id: "docs", label: "DOCS", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: "about", label: "ABOUT", icon: <HelpCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav className="border-b border-brand-gray bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand Group */}
          <div 
            onClick={() => setView("home")}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <h1 className="text-2xl sm:text-3xl font-shipsafe tracking-tight text-brand-dark group-hover:text-brand-blue transition-colors leading-none flex items-baseline">
              SHIPSAFE 
              <span className="font-dokdo text-brand-blue text-3xl ml-1 leading-none inline-block transform rotate-[-4deg]">Ai</span>
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              if (item.id === "home") return null; // represented by logo

              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`text-xs font-mono tracking-wider font-semibold uppercase px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "text-brand-blue bg-brand-blue/5 border border-brand-blue/15"
                      : "text-brand-dark/70 hover:text-brand-blue hover:bg-brand-light border border-transparent"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}

            {/* Admin CRM Tab (Dynamic based on admin role) */}
            {currentUser?.isAdmin && (
              <button
                onClick={() => setView("crm")}
                className={`text-xs font-mono tracking-wider font-semibold uppercase px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentView === "crm"
                    ? "text-red-600 bg-red-50 border border-red-200"
                    : "text-red-500/80 hover:text-red-600 hover:bg-red-50/50 border border-transparent"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                ADMIN CRM
              </button>
            )}

            {/* User Dashboard / Portal access */}
            {currentUser ? (
              <button
                onClick={() => setView("dashboard")}
                className={`text-xs font-mono tracking-wider font-semibold uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentView === "dashboard"
                    ? "text-brand-blue bg-brand-blue/5 border border-brand-blue/15"
                    : "text-brand-dark hover:bg-brand-light border border-transparent"
                }`}
              >
                <User className="w-3.5 h-3.5 text-brand-blue" />
                {currentUser.name}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs font-mono tracking-wider font-semibold uppercase px-3 py-1.5 rounded-lg text-brand-dark/70 hover:text-brand-blue hover:bg-brand-light cursor-pointer border border-brand-gray flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Log In
              </button>
            )}

            {/* Support chat trigger */}
            <button
              onClick={() => {
                const chatToggle = document.getElementById("chatbot-toggle-btn");
                if (chatToggle) chatToggle.click();
              }}
              className="bg-brand-blue hover:bg-[#0582aa] text-white px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md shadow-brand-blue/15 flex items-center gap-1.5 cursor-pointer ml-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              SSAi CHAT
            </button>
          </div>

          {/* Mobile view selector trigger */}
          <div className="md:hidden flex items-center gap-2">
            <select
              value={currentView}
              onChange={(e) => setView(e.target.value as PageView)}
              className="text-xs font-mono font-semibold uppercase border border-brand-gray bg-brand-light text-brand-dark px-3 py-1.5 rounded-xl outline-none focus:border-brand-blue"
            >
              <option value="home">Home / Hero</option>
              <option value="docs">Docs & Guides</option>
              <option value="about">About & Contact</option>
              {currentUser && <option value="dashboard">Portal: {currentUser.name}</option>}
              {currentUser?.isAdmin && <option value="crm">Admin CRM</option>}
            </select>

            {!currentUser && (
              <button
                onClick={onOpenAuth}
                className="bg-brand-light border border-brand-gray text-brand-dark p-2 rounded-xl"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                const chatToggle = document.getElementById("chatbot-toggle-btn");
                if (chatToggle) chatToggle.click();
              }}
              className="bg-brand-blue text-white p-2 rounded-xl"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
