import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, BookOpen, AlertCircle, RefreshCw, User, Shield } from 'lucide-react';
import { MADRASAH_INFO } from '../data/madrasahData';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
}

interface IslamicAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-1',
  role: 'model',
  text: `আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ।

আমি "তালিমুল কুরআন সহকারী"—তালিমুল কুরআন মহিলা মাদ্রাসার অফিশিয়াল দ্বীনি সহযোগী।

পবিত্র কুরআন, সহীহ হাদীস, দৈনন্দিন মাসআলা-মাসায়েল, দুআ-আমল কিংবা আমাদের মাদ্রাসার বিভাগ ও ভর্তি সংক্রান্ত যেকোনো বিষয়ে আপনাকে সাহায্য করতে পারি। আজ আপনাকে কীভাবে সহযোগিতা করতে পারি?`,
  time: 'এইমাত্র'
};

const SUGGESTED_PROMPTS = [
  'মাদ্রাসার বিভাগ ও ভর্তি প্রক্রিয়া কী?',
  'পবিত্র কুরআন হিফজের ফজিলত সম্পর্কে বলুন',
  'আবাসিক হোস্টেল ও মেয়েদের নিরাপত্তা ব্যবস্থা কেমন?',
  'তাহাজ্জুদ সালাতের নিয়ম ও ফযীলত কী?',
  'দৈনন্দিন জীবনের জরুরি কয়েকটি মাসনুন দুআ',
];

export const IslamicAssistantModal: React.FC<IslamicAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSentText, setLastSentText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    setError(null);
    setLastSentText(textToSend);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) {
      setInput('');
    }
    setIsLoading(true);

    try {
      // Build previous message history formatted for backend
      const historyPayload = messages
        .filter((m) => m.id !== 'init-1')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      // Access Gemini API Key from Vite environment
      const viteGeminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(viteGeminiApiKey ? { 'x-gemini-api-key': viteGeminiApiKey } : {}),
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          apiKey: viteGeminiApiKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'উত্তর পেতে সমস্যা হয়েছে।');
      }

      const botMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.reply,
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err?.message || 'উত্তর প্রদানে সাময়িক ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-bangla">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Assistant Header */}
        <div className="bg-[#064E3B] text-white p-4 sm:px-6 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-900/80 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  তালিমুল কুরআন সহকারী
                </h3>
                <span className="text-[10px] bg-amber-400 text-stone-900 font-bold px-1.5 py-0.5 rounded">
                  AI সহায়ক
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                কুরআন, হাদিস ও মাদ্রাসা নির্দেশিকা বিষয়ক বিশ্বস্ত পরামর্শক
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded transition-colors"
              title="নতুন করে শুরু করুন"
              aria-label="রিসেট করুন"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded transition-colors"
              title="বন্ধ করুন"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Suggested Queries Strip (when few messages) */}
        {messages.length <= 2 && (
          <div className="bg-amber-50/70 dark:bg-amber-950/40 border-b border-amber-200/60 dark:border-amber-900/60 p-2.5 px-4 overflow-x-auto text-xs flex items-center gap-2">
            <span className="text-amber-900 dark:text-amber-300 font-semibold shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>সচরাচর জিজ্ঞাসা:</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#064E3B] dark:hover:text-amber-300 border border-amber-200 dark:border-amber-900/60 rounded text-xs whitespace-nowrap transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF9F5] dark:bg-stone-950">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-amber-600 text-white'
                      : 'bg-[#064E3B] text-amber-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#064E3B] text-white rounded-tr-none shadow-xs'
                      : 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-2">
                    {msg.text}
                  </div>
                  <div
                    className={`text-[10px] mt-1.5 font-mono ${
                      isUser ? 'text-emerald-200 text-right' : 'text-stone-400 dark:text-stone-500 text-left'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#064E3B] text-amber-300 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl rounded-tl-none p-3.5 text-xs text-stone-700 dark:text-stone-300 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>তালিমুল কুরআন সহকারী উত্তর প্রস্তুত করছেন...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg text-xs text-red-700 dark:text-red-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span>{error}</span>
              </div>
              {lastSentText && (
                <button
                  type="button"
                  onClick={() => handleSend(lastSentText)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shrink-0 transition-colors inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>পুনরায় চেষ্টা করুন</span>
                </button>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Guidance Disclaimer */}
        <div className="p-3 sm:p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="কুরআন, হাদিস, মাসআলা বা মাদ্রাসা সম্পর্কে বাংলায় প্রশ্ন লিখুন..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#064E3B] font-bangla disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-lg transition-colors font-semibold disabled:opacity-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">পাঠান</span>
            </button>
          </form>

          {/* Authentic Guidance Disclaimer */}
          <div className="flex items-center gap-1.5 text-[10px] text-stone-500 leading-tight">
            <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              কুরআন, সহীহ হাদিস ও হানাফী ফিকহের ভিত্তিতে উত্তর দেওয়া হয়। সংবেদনশীল গভীর ফতোয়া বিষয়ক বিষয়ের জন্য মাদ্রাসার মুফতি সাহেবের পরামর্শ নিন।
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
