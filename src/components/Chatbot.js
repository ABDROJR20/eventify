"use client";
import { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {/* Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-brand-blue'}`}
      >
        {isOpen ? (
          <X size={28} color="white" />
        ) : (
          <MessageSquare size={28} color="white" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      <div className={`absolute bottom-20 right-0 w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden transition-all duration-500 origin-bottom-right transform ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center">
            <Sparkles size={24} color="white" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Eventify AI Assistant</h3>
            <p className="text-xs text-slate-400">Ask me anything about events</p>
          </div>
        </div>

        {/* Chat Body */}
        <div className="h-[400px] p-6 overflow-y-auto bg-slate-50 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
            <p className="text-sm text-slate-700">Hi! I'm your Eventify AI. I can help you find events, manage your registrations, or answer any questions. How can I help you today?</p>
          </div>
          
          <div className="bg-brand-blue text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] self-end">
            <p className="text-sm">Find me some upcoming tech events in Karachi.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase">AI Recommendation</p>
            </div>
            <p className="text-sm text-slate-700 font-bold mb-2">Global Tech Summit 2026</p>
            <p className="text-xs text-slate-500 mb-4 italic">"Based on your interest in AI and Software Engineering."</p>
            <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-brand-blue rounded-xl text-xs font-bold transition-colors">
              View Event Details
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-medium"
            />
            <button className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white hover:bg-brand-blue/90 transition-all active:scale-95">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
