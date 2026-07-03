import React from "react";
import { Sparkles, ArrowDown } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <div className="relative bg-brand-light min-h-screen flex flex-col justify-between overflow-hidden pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background massive title "SHIPSAFE" overlayed by graphics */}
      <div className="absolute inset-x-0 top-10 flex justify-center pointer-events-none select-none z-0">
        <h1 className="text-[20vw] font-shipsafe text-brand-dark/10 tracking-tighter leading-none text-center select-none w-full uppercase">
          SHIPSAFE
        </h1>
      </div>

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-8 items-center relative z-10 my-auto pt-10">
        
        {/* Left column info (Matches left panel of the image) */}
        <div className="md:col-span-4 space-y-8 flex flex-col justify-center text-left">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-blue font-sans uppercase">
              THE
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold font-sans text-brand-dark leading-none tracking-tight">
              AI-DRIVEN
            </h3>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-blue font-sans uppercase">
              DEVELOPMENT
            </h3>
            <h3 className="text-4xl sm:text-5xl font-bold font-sans text-brand-dark tracking-tight leading-none">
              GUARDRAIL.
            </h3>
          </div>

          {/* Handdrawn styled bullets with blue 4 (as seen in image) */}
          <div className="relative pl-2">
            <ul className="space-y-4 text-brand-dark font-semibold text-xl sm:text-2xl font-dokdo tracking-wide">
              <li className="flex items-center gap-3 relative">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-blue"></span>
                <span>VIBE CODERS</span>
                {/* Large custom blue 4 next to it as seen in mockup */}
                <span className="text-6xl font-sans text-brand-blue font-black absolute left-48 -top-4 select-none transform rotate-[8deg]">
                  4
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-blue"></span>
                <span>AI-ASSISTED DEVELOPERS</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-blue"></span>
                <span>AI CODED DEPLOYMENTS</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Center column artwork (The Chrome Robot Hand & Pedestal) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative max-w-[320px] sm:max-w-[360px] aspect-[3/4] rounded-3xl overflow-hidden border border-brand-gray/50 bg-brand-gray shadow-2xl flex flex-col justify-end p-4 text-center group"
          >
            {/* Real generated chrome peace hand asset */}
            <img
              src="/src/assets/images/shipsafe_peace_hand_1783069917795.jpg"
              alt="ShipSafe Chrome Peace Hand"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Shadow overlay to make text pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>

            {/* Pedestal branding text: APOSTELLO KAIROS 226/226 */}
            <div className="relative z-20 text-white select-none pointer-events-none pb-2">
              <p className="text-2xl font-dokdo font-bold text-brand-blue tracking-wider leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                APOSTELLO KAIROS
              </p>
              <p className="text-sm font-sans font-mono font-bold text-brand-light tracking-widest leading-none mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                226/226
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right column text blocks (Matches right panel of the image) */}
        <div className="md:col-span-4 flex flex-col justify-center space-y-8 text-left md:text-right pl-4">
          <div className="space-y-4">
            {/* Bodoni styled text containing handwritten blue Ai */}
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-dark leading-tight tracking-tight font-bodoni uppercase">
              BRIDGING THE GAP
            </h2>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-dark leading-tight tracking-tight font-bodoni uppercase">
              BETWEEN
            </h2>
            <div className="flex items-baseline md:justify-end gap-2">
              <span className="font-dokdo text-brand-blue text-5xl font-black transform rotate-[-6deg] inline-block select-none mr-1.5 leading-none">
                Ai
              </span>
              <span className="text-3xl sm:text-4xl font-serif text-brand-dark font-bodoni uppercase leading-none">
                CODING
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-dark leading-tight tracking-tight font-bodoni uppercase">
              AGENTS AND
            </h2>
            <h2 className="text-4xl sm:text-5xl font-serif text-brand-blue font-bold font-bodoni uppercase leading-tight tracking-tight italic">
              REALITY.
            </h2>
          </div>

          <div className="flex justify-start md:justify-end">
            <button
              onClick={() => {
                const plansSection = document.getElementById("plans-section-selector");
                if (plansSection) {
                  plansSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-brand-blue hover:bg-[#0582aa] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95 group"
            >
              <span className="text-xs font-mono font-bold tracking-wider uppercase pl-2">Select Guardrail Plan</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>

      {/* Trust Line text label */}
      <div className="w-full text-center border-t border-brand-gray/60 pt-6 mt-12 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <span className="text-[10px] font-mono uppercase font-semibold text-brand-dark/40 tracking-widest">
          ESTABLISHED LAB PLATFORM • CODENAME 226/226
        </span>
        <span className="text-xs font-serif italic text-brand-dark/80 font-bodoni">
          "The missing link between artificial and intelligence."
        </span>
      </div>

    </div>
  );
}
