import React from "react";
import { Plan } from "../types";
import { Shield, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface PlanCardProps {
  key?: string;
  plan: Plan;
  onSelectPlan: (plan: Plan) => void;
  onExplorePlan: (planId: "solo" | "commercial") => void;
}

export default function PlanCard({ plan, onSelectPlan, onExplorePlan }: PlanCardProps) {
  const isCommercial = plan.id === "commercial";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`border rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-sm relative overflow-hidden transition-all duration-300 ${
        isCommercial
          ? "bg-brand-dark text-white border-white/10 shadow-xl"
          : "bg-white text-brand-dark border-brand-gray"
      }`}
    >
      {/* Visual Accent badge */}
      {isCommercial && (
        <div className="absolute top-0 right-0 bg-brand-blue text-white text-[9px] font-mono font-bold tracking-widest uppercase px-4 py-1.5 rounded-bl-2xl">
          PRODUCTION GRADE
        </div>
      )}

      <div className="space-y-6">
        {/* Name Block */}
        <div>
          <span
            className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
              isCommercial
                ? "bg-brand-blue/25 text-brand-blue border border-brand-blue/30"
                : "bg-brand-blue/10 text-brand-blue"
            }`}
          >
            {plan.badge}
          </span>
          <h4 className="text-2xl font-bold font-sans tracking-tight mt-3">
            {plan.name}
          </h4>
          <p
            className={`text-xs mt-1.5 font-mono ${
              isCommercial ? "text-white/60" : "text-brand-dark/50"
            }`}
          >
            {plan.tagline}
          </p>
        </div>

        {/* Pricing block */}
        <div className="flex items-baseline gap-1.5 py-3 border-y border-brand-gray/10">
          <span className="text-4xl font-extrabold font-sans">${plan.price}</span>
          <span
            className={`text-xs font-mono font-semibold ${
              isCommercial ? "text-white/40" : "text-brand-dark/40"
            }`}
          >
            USD / ONE-TIME
          </span>
        </div>

        {/* Short Description */}
        <p
          className={`text-xs leading-relaxed ${
            isCommercial ? "text-white/70" : "text-brand-dark/70"
          }`}
        >
          {plan.description}
        </p>

        {/* Bullet List */}
        <div className="space-y-3 pt-2">
          <p
            className={`text-[10px] uppercase font-mono font-bold tracking-wider ${
              isCommercial ? "text-brand-blue" : "text-brand-dark/40"
            }`}
          >
            Core Capabilities Included:
          </p>
          <ul className="space-y-2.5 text-xs">
            {plan.features.slice(0, 4).map((f, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    isCommercial ? "text-brand-blue" : "text-brand-blue"
                  }`}
                />
                <span
                  className={isCommercial ? "text-white/80" : "text-brand-dark/80"}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Button Group */}
      <div className="space-y-3 mt-8">
        <button
          onClick={() => onSelectPlan(plan)}
          className={`w-full font-bold text-xs py-4 px-4 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] uppercase font-mono tracking-wider ${
            isCommercial
              ? "bg-brand-blue hover:bg-[#0582aa] text-white shadow-brand-blue/20"
              : "bg-brand-dark hover:bg-brand-dark/95 text-white"
          }`}
        >
          <Shield className="w-4 h-4" />
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}
