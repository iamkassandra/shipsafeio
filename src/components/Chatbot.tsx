import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm SSAi, your official Google ShipSafe Customer Support assistant. How can I help secure your deployments today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!textToSend) {
      setInput("");
    }
    setErrorMsg(null);

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages.map(m => ({ role: m.role, content: m.content })) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch response from support server.");
      }

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
          citations: data.citations,
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    "Solo vs Commercial plans?",
    "What are the licensing terms?",
    "How does local scanning work?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <button
        id="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-brand-blue hover:bg-[#0582aa] text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && <span className="font-medium pr-1 hidden sm:inline">SSAi Support</span>}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="absolute bottom-18 right-0 w-[92vw] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-3xl flex flex-col border border-brand-gray overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-blue p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">SSAi Customer Support</h3>
                  <p className="text-[10px] text-white/80 font-mono">POWERED BY GEMINI 3.5</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-light/50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-brand-blue text-white rounded-tr-none"
                        : "bg-white border border-brand-gray text-brand-dark rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>

                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-brand-gray space-y-1">
                        <span className="text-[9px] font-bold text-brand-dark/40 font-mono block uppercase">Sources & Citations:</span>
                        <div className="flex flex-wrap gap-1">
                          {m.citations.map((cit, citIdx) => (
                            <a
                              key={citIdx}
                              href={cit.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-brand-blue/5 hover:bg-brand-blue/10 border border-brand-blue/15 text-[9px] font-mono text-brand-blue px-1.5 py-0.5 rounded transition-all"
                            >
                              [{citIdx + 1}] {cit.title || "Reference"}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <span
                      className={`text-[9px] block mt-1 text-right font-mono ${
                        m.role === "user" ? "text-white/75" : "text-brand-dark/40"
                      }`}
                    >
                      {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-brand-gray text-brand-dark rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2 border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Support Offline</span>
                    <p className="mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions (if no conversation has really started or as helpers) */}
            <div className="p-2 border-t border-brand-gray bg-white flex flex-wrap gap-1.5">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(p)}
                  className="text-[11px] text-brand-blue bg-brand-blue/5 hover:bg-brand-blue/10 border border-brand-blue/20 rounded-full px-2.5 py-1 transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-brand-gray bg-white flex gap-2">
              <input
                type="text"
                placeholder="Ask SSAi a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 text-xs border border-brand-gray rounded-xl px-3 py-2 bg-brand-light focus:outline-none focus:border-brand-blue"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-brand-blue hover:bg-[#0582aa] disabled:bg-brand-gray text-white p-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
