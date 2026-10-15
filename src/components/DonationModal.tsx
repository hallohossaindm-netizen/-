import React, { useState } from 'react';
import { X, HeartHandshake, Copy, Check, ShieldCheck, CreditCard, Smartphone } from 'lucide-react';
import { MADRASAH_INFO } from '../data/madrasahData';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-lg max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative my-8 font-bangla space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-stone-200 dark:border-stone-800 space-y-1">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-300 dark:border-amber-800">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            লিল্লাহ বোর্ডিং, যাকাত ও সদাকাহ তহবিল
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
            গরিব, অসহায় ও এতিম তালিবাতদের হিফজ ও দ্বীনি শিক্ষা নিশ্চিত করতে আপনার যাকাত ও সাধারণ অনুদান প্রেরণ করুন।
          </p>
        </div>

        {/* Bank Transfer Details */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 space-y-3">
            <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
              <CreditCard className="w-4 h-4 text-[#064E3B] dark:text-emerald-400" />
              <span>ব্যাংক হিসাব নম্বর (Bank Account):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-stone-500 dark:text-stone-400 block">ব্যাংকের নাম:</span>
                <strong className="text-stone-800 dark:text-stone-200">ইসলামী ব্যাংক বাংলাদেশ পিএলসি</strong>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block">হিসাবের নাম (Account Title):</span>
                <strong className="text-stone-800 dark:text-stone-200">TALIMUL QURAN MOHILA MADRASAH</strong>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between p-2 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">অ্যাকাউন্ট নং (Account No):</span>
                  <strong className="font-mono text-sm text-[#064E3B] dark:text-emerald-400">20501480201948301</strong>
                </div>
                <button
                  onClick={() => handleCopy('20501480201948301', 'bank')}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'bank' ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block">শাখা:</span>
                <strong className="text-stone-800 dark:text-stone-200">ফতেয়াবাদ শাখা, চট্টগ্রাম</strong>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block">রাউটিং নম্বর:</span>
                <strong className="font-mono text-stone-800 dark:text-stone-200">125273561</strong>
              </div>
            </div>
          </div>

          {/* Mobile Financial Services (bKash & Nagad) */}
          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/30 rounded-lg border border-amber-200/80 dark:border-amber-900/60 space-y-3">
            <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-200">
              <Smartphone className="w-4 h-4 text-amber-800 dark:text-amber-400" />
              <span>মোবাইল ব্যাংকিং (বিকাশ ও নগদ):</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-stone-800 border border-amber-200 dark:border-amber-900/60">
                <div>
                  <span className="font-semibold text-pink-700 dark:text-pink-400 block text-xs">বিকাশ (মার্চেন্ট / পেমেন্ট):</span>
                  <strong className="font-mono text-sm text-stone-900 dark:text-stone-100">{MADRASAH_INFO.contactNumber}</strong>
                </div>
                <button
                  onClick={() => handleCopy(MADRASAH_INFO.contactNumber, 'bkash')}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'bkash' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'bkash' ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-stone-800 border border-amber-200 dark:border-amber-900/60">
                <div>
                  <span className="font-semibold text-orange-700 dark:text-orange-400 block text-xs">নগদ (পার্সোনাল):</span>
                  <strong className="font-mono text-sm text-stone-900 dark:text-stone-100">{MADRASAH_INFO.contactNumber}</strong>
                </div>
                <button
                  onClick={() => handleCopy(MADRASAH_INFO.contactNumber, 'nagad')}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'nagad' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'nagad' ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="flex items-start gap-2 text-[11px] text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 p-3 rounded border border-stone-200 dark:border-stone-700">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>
            অনুদান পাঠানোর পর অনুগ্রহ করে মানি রিসিট ও নিশ্চয়তার জন্য অত্র নম্বরে এসএমএস অথবা হোয়াটসঅ্যাপে বার্তা প্রেরণ করুন: <strong className="font-mono">{MADRASAH_INFO.phonePrimary}</strong>
          </span>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043d2e] rounded transition-colors cursor-pointer"
          >
            ঠিক আছে, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
