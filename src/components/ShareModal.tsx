import React, { useState } from 'react';
import { X, Smartphone, Copy, Check, QrCode, Share2, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const liveUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://ais-pre-lyhl47vmtsbynzthruoizk-829183906101.asia-east1.run.app';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const text = `তালিমুল কুরআন মহিলা মাদ্রাসার অফিশিয়াল ওয়েবসাইট দেখুন: ${liveUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(liveUrl)}&margin=8`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 font-bangla animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative text-center space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-[#064E3B] dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-200 dark:border-emerald-800">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            মোবাইলে সরাসরি দেখুন ও শেয়ার করুন
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            কোনো জটিলতা ছাড়াই আপনার মোবাইল দিয়ে নিচের কিউআর (QR) কোডটি স্ক্যান করুন অথবা লিংকটি কপি করুন।
          </p>
        </div>

        {/* QR Code Card */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 inline-block shadow-inner">
          <img
            src={qrImageUrl}
            alt="Mobile Live QR Code"
            className="w-48 h-48 mx-auto rounded-lg shadow-sm bg-white p-2"
          />
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-2 flex items-center justify-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>মোবাইল ক্যামেরা দিয়ে স্ক্যান করলেই খুলবে</span>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="space-y-2 text-left">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
            ওয়েবসাইটের সরাসরি লাইভ লিঙ্ক:
          </label>
          <div className="flex items-center gap-2 p-2 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
            <input
              type="text"
              readOnly
              value={liveUrl}
              className="flex-1 bg-transparent text-xs font-mono text-stone-800 dark:text-stone-200 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleWhatsApp}
            className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#1ebd56] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপে শেয়ার</span>
          </button>

          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>নতুন ট্যাবে খুলুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
