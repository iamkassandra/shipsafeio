import React, { useState } from "react";
import { Mail, Globe, Users, Send, CheckCircle, Info } from "lucide-react";
import { motion } from "motion/react";

export default function AboutPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      {/* Visual Header Grid */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-brand-blue/10 text-brand-blue font-bold text-[10px] uppercase font-mono px-3 py-1 rounded-full">
            <Info className="w-3.5 h-3.5" /> APOSTELLO KAIROS • CODENAME 226/226
          </div>
          <h2 className="text-4xl sm:text-5xl font-shipsafe text-brand-dark tracking-tight leading-none">
            BRIDGING THE GAP BETWEEN <span className="text-brand-blue">AI AGENTS</span> AND REALITY
          </h2>
          <p className="text-sm text-brand-dark/75 leading-relaxed">
            In the modern landscape of high-speed development, AI coding agents are constructing full-stack software blocks at an unprecedented velocity. However, this hyper-acceleration introduces severe vulnerabilities: exposed secrets, unsafe package dependencies, and invalid environment configurations.
          </p>
          <p className="text-xs text-brand-dark/60 leading-relaxed">
            <strong>ShipSafe AI</strong> operates as the premier, local-first guardrail for this transition. Founded as an elite structural scanning sandbox (Codename <strong>Apostello Kairos 226/226</strong>), our scanning modules run securely on-premise inside developer sandboxes, validating integrity and ensuring code readiness before production deployment.
          </p>
        </div>

        {/* Brand Specs Showcase Panel */}
        <div className="bg-white border border-brand-gray rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-brand-dark border-b border-brand-gray pb-3">
            TECHNICAL BRAND SPECIFICATIONS
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-brand-light p-3.5 rounded-2xl border border-brand-gray">
              <span className="text-[10px] text-brand-dark/40 font-bold block mb-1">ACCENT COLOR</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-brand-blue block"></span>
                <span>#07A3D4</span>
              </div>
            </div>

            <div className="bg-brand-light p-3.5 rounded-2xl border border-brand-gray">
              <span className="text-[10px] text-brand-dark/40 font-bold block mb-1">LOGO BRANDING</span>
              <span className="text-brand-dark font-semibold">EXTENDA 20 / LEAGUE GOTHIC</span>
            </div>

            <div className="bg-brand-light p-3.5 rounded-2xl border border-brand-gray">
              <span className="text-[10px] text-brand-dark/40 font-bold block mb-1">MICRO VERIFICATION</span>
              <span className="text-brand-dark font-semibold">CYRILLIC BODONI MODA</span>
            </div>

            <div className="bg-brand-light p-3.5 rounded-2xl border border-brand-gray">
              <span className="text-[10px] text-brand-dark/40 font-bold block mb-1">AI ACCENT</span>
              <span className="text-brand-blue font-semibold font-dokdo text-lg leading-none">East Sea Dokdo</span>
            </div>
          </div>

          <div className="text-xs text-brand-dark/70 leading-relaxed pt-2">
            These structural design cues are selected to reflect the robust contrast of binary computation paired with modern human-centric engineering.
          </div>
        </div>
      </div>

      {/* Split Contact Form Section */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Contact info column */}
        <div className="md:col-span-4 bg-brand-dark text-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold font-shipsafe tracking-wide text-brand-blue">
              SHIPSAFE HEADQUARTERS
            </h3>
            <p className="text-[10px] text-white/50 font-mono uppercase mt-1">
              SANDBOX SECURITY LABS
            </p>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">
            Have custom pipeline security inquiries or need multi-seat commercial licenses? Reach our team directly or use the chatbot for 24/7 automated assistance.
          </p>

          <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-3 text-white/90">
              <Mail className="w-4 h-4 text-brand-blue shrink-0" />
              <span>sandbox@shipsafe.ai</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Globe className="w-4 h-4 text-brand-blue shrink-0" />
              <span>shipsafe.ai/developers</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Users className="w-4 h-4 text-brand-blue shrink-0" />
              <span>Apostello Kairos Foundation</span>
            </div>
          </div>
        </div>

        {/* Contact Form column */}
        <div className="md:col-span-8 bg-white border border-brand-gray rounded-3xl p-6 sm:p-8 shadow-sm">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-4"
            >
              <div className="flex justify-center">
                <div className="bg-green-100 p-3.5 rounded-full">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-brand-dark">Message Sent Successfully!</h4>
              <p className="text-xs text-brand-dark/60 max-w-sm mx-auto">
                Thank you for contacting ShipSafe support. Our engineers will respond to your security inquiry within 12-24 business hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-brand-dark">SUBMIT SECURE SUPPORT QUERY</h3>
                <p className="text-xs text-brand-dark/50 font-mono uppercase mt-0.5">
                  ENCRYPTED DEV INTAKE CHANNEL
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-brand-dark/70 block mb-1 uppercase font-mono">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g., Ada Lovelace"
                    className="w-full text-xs border border-brand-gray rounded-xl px-3 py-2 bg-brand-light focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-dark/70 block mb-1 uppercase font-mono">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="w-full text-xs border border-brand-gray rounded-xl px-3 py-2 bg-brand-light focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-brand-dark/70 block mb-1 uppercase font-mono">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="E.g., Commercial Pipeline Security Scan Hook"
                  className="w-full text-xs border border-brand-gray rounded-xl px-3 py-2 bg-brand-light focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-brand-dark/70 block mb-1 uppercase font-mono">
                  Detailed Inquiry Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your security challenge or team scanning requirements..."
                  className="w-full text-xs border border-brand-gray rounded-xl px-3 py-2 bg-brand-light focus:outline-none focus:border-brand-blue resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-brand-blue hover:bg-[#0582aa] text-white font-semibold text-xs rounded-xl px-5 py-3 transition-colors flex items-center gap-1.5 shadow-md shadow-brand-blue/15 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Submit Support Query
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
