"use client";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, User, ArrowRight, CornerDownLeft, RefreshCw } from "lucide-react";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "bot",
    text: "Hi! I'm your Eventify AI. I can help you find events, manage your registrations, or answer any questions. How can I help you today?",
    time: "Just now",
  },
  {
    id: 2,
    sender: "user",
    text: "Find me some upcoming tech events in Karachi.",
    time: "Just now",
  },
  {
    id: 3,
    sender: "bot",
    isRecommendation: true,
    title: "Global Tech Summit 2026",
    desc: "Based on your interest in AI and Software Engineering.",
    time: "Just now",
  },
];

const QUICK_PROMPTS = [
  "Find upcoming tech events",
  "How does QR check-in work?",
  "How to create an event?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = typeof textToSend === "string" ? textToSend : inputVal;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query.trim(),
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "I'm here to help with your events! You can create, manage, or explore tickets directly from the portal.";
      const lower = query.toLowerCase();

      if (lower.includes("tech") || lower.includes("karachi") || lower.includes("summit")) {
        replyText = "The Global Tech Summit 2026 is happening at Karachi Convention Center with 50+ keynote speakers and interactive AI workshops. Check the 3D Pass section for instant passes!";
      } else if (lower.includes("qr") || lower.includes("check-in") || lower.includes("scan")) {
        replyText = "Eventify includes instant paperless QR check-in. Attendees show their digital 3D pass at the venue entrance for under 2-second automated verification.";
      } else if (lower.includes("create") || lower.includes("organize") || lower.includes("start")) {
        replyText = "To create your first event, click the 'Create Your First Event' button or navigate to the Portal. You can configure registration tiers, tickets, and automated emails in minutes.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: replyText,
          time: "Just now",
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Chat Window Modal Container */}
      <div
        className={`fixed z-[100] transition-all duration-300 ease-out origin-bottom-right
          bottom-20 right-3 left-3 sm:left-auto sm:right-6 sm:bottom-24
          w-auto sm:w-[400px] max-w-[calc(100vw-1.5rem)] sm:max-w-[400px]
          h-[min(560px,calc(100dvh-6.5rem))] flex flex-col
          bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl
          rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]
          border border-slate-200/80 dark:border-slate-800/80 overflow-hidden
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
      >
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-5 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">Eventify AI Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">Ask me anything about events</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
            title="Close Assistant"
            aria-label="Close Chat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Chat Body (Scrollable Messages Area) */}
        <div className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto bg-slate-50/80 dark:bg-slate-950/60 flex flex-col gap-3.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          {messages.map((m) => {
            if (m.sender === "user") {
              return (
                <div
                  key={m.id}
                  className="bg-brand-blue text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-xs shadow-md shadow-blue-500/20 max-w-[85%] self-end text-xs sm:text-sm leading-relaxed"
                >
                  <p>{m.text}</p>
                </div>
              );
            }

            if (m.isRecommendation) {
              return (
                <div
                  key={m.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl rounded-tl-xs shadow-sm max-w-[88%] border border-emerald-500/30 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/30 dark:to-slate-900"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      AI Recommendation
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{m.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 italic">"{m.desc}"</p>
                  <a
                    href="#pass3d"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 px-3 bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white dark:bg-brand-blue/20 dark:hover:bg-brand-blue dark:text-blue-300 dark:hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 group"
                  >
                    View 3D Event Pass
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              );
            }

            return (
              <div
                key={m.id}
                className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-3.5 sm:p-4 rounded-2xl rounded-tl-xs shadow-sm max-w-[88%] border border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm leading-relaxed"
              >
                <p>{m.text}</p>
              </div>
            );
          })}

          {isTyping && (
            <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl rounded-tl-xs border border-slate-200 dark:border-slate-800 self-start flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="shrink-0 px-3 py-2 bg-slate-100/60 dark:bg-slate-950/40 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-blue dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-2.5 py-1 whitespace-nowrap transition-colors shrink-0 shadow-2xs hover:border-brand-blue/40"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="shrink-0 p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-300 dark:border-slate-800 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 font-medium py-1.5"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-blue hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-brand-blue text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shrink-0 shadow-md shadow-blue-500/25"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_10px_30px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isOpen ? "bg-slate-900 dark:bg-slate-800 rotate-90 text-white" : "bg-brand-blue text-white"
        }`}
        aria-label="Toggle Eventify AI Chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={26} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-950" />
          </span>
        )}
      </button>
    </>
  );
}
