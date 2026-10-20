import React from 'react';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

interface FloatingAssistantButtonProps {
  onClick: () => void;
}

export const FloatingAssistantButton: React.FC<FloatingAssistantButtonProps> = ({ onClick }) => {
  return (
    <aside
      aria-label="তালিমুল কুরআন এআই সহকারী"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center group no-print"
    >
      <button
        onClick={onClick}
        className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:px-4 sm:py-3 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-full shadow-2xl border-2 border-amber-400 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-700/50 cursor-pointer"
        aria-label="তালিমুল কুরআন সহকারী খুলুন"
      >
        <div className="relative">
          <div className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-emerald-900 flex items-center justify-center text-amber-300">
            <Bot className="w-4 h-4 sm:w-4 sm:h-4 text-amber-300" />
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold font-bangla text-white flex items-center gap-1">
            <span className="hidden sm:inline">তালিমুল কুরআন সহকারী</span>
            <span className="sm:hidden">এআই সহকারী</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </span>
          <span className="text-[10px] text-emerald-200/90 font-bangla hidden sm:inline">
            কুরআন, হাদিস ও তথ্য জিজ্ঞাসা
          </span>
        </div>
      </button>
    </aside>
  );
};
