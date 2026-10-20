import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  CheckCircle,
  Printer,
  FileText,
  Calendar,
  Clock,
  MapPin,
  X,
  Award,
  User,
  Building,
  School,
  ExternalLink
} from 'lucide-react';
import { AdmitCardData } from '../types';
import { MADRASAH_INFO } from '../data/madrasahData';
import { printAdmitCard, getAdmitCardVerificationUrl } from '../utils/printAdmitCard';
import { AdmitCardView } from './AdmitCardView';

interface AdmitCardVerificationModalProps {
  card: AdmitCardData;
  onClose: () => void;
}

export const AdmitCardVerificationModal: React.FC<AdmitCardVerificationModalProps> = ({
  card,
  onClose,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [showFullAdmitSheet, setShowFullAdmitSheet] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const generateQR = async () => {
      try {
        const verifyUrl = getAdmitCardVerificationUrl(card);
        const url = await QRCode.toDataURL(verifyUrl, {
          width: 220,
          margin: 1,
          color: {
            dark: '#064E3B',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        if (isMounted) setQrCodeUrl(url);
      } catch (err) {
        console.error('Failed to generate verification QR', err);
      }
    };

    generateQR();
    return () => {
      isMounted = false;
    };
  }, [card]);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      await printAdmitCard(card, qrCodeUrl);
    } finally {
      setIsPrinting(false);
    }
  };

  if (showFullAdmitSheet) {
    return (
      <AdmitCardView
        card={card}
        isModal
        onClose={() => setShowFullAdmitSheet(false)}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200 font-bangla"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-emerald-300 dark:border-emerald-800/60 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Verification Success Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 via-[#064E3B] to-emerald-950 text-white p-5 sm:p-6 text-center relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-emerald-200 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 border-2 border-emerald-400 text-amber-300 mb-2 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-emerald-300" />
          </div>

          <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-1">
            ডিজিটাল পরীক্ষা নিয়ন্ত্রণ কর্তৃপক্ষ
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            প্রবেশপত্র যাচাইকরণ সফল ও বৈধ
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto mt-1">
            {MADRASAH_INFO.name} কেন্দ্রীয় ডাটাবেজ অনুযায়ী এই প্রবেশপত্রটি ১০০% আসল এবং অনুমোদিত।
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/60 border border-emerald-500/40 rounded-full text-xs text-emerald-200 font-mono">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>স্ট্যাটাস: OFFICIAL VALID ADMIT CARD</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-stone-900 dark:text-stone-100 flex-1">
          {/* Student Profile Card */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* QR code on the side */}
            <div className="shrink-0 bg-white p-2 rounded-lg border border-stone-200 dark:border-stone-700 shadow-xs text-center">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="কিউআর কোড"
                  className="w-24 h-24 object-contain mx-auto"
                />
              ) : (
                <div className="w-24 h-24 bg-stone-100 flex items-center justify-center text-[10px] text-stone-400">
                  QR প্রস্তুত হচ্ছে...
                </div>
              )}
              <div className="text-[10px] font-mono text-stone-500 mt-1">
                রোল: {card.roll}
              </div>
            </div>

            {/* Candidate Details */}
            <div className="flex-1 space-y-2 text-center sm:text-left w-full">
              <div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block">শিক্ষার্থীর নাম:</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#064E3B] dark:text-emerald-400">
                  {card.studentName}
                </h3>
                {card.studentNameEn && (
                  <span className="text-xs text-stone-600 dark:text-stone-400 font-sans">
                    {card.studentNameEn}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/60 dark:border-emerald-900/50">
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block text-[10px]">রোল নম্বর:</span>
                  <strong className="font-mono text-sm text-stone-900 dark:text-stone-100 font-bold">{card.roll}</strong>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block text-[10px]">রেজিস্ট্রেশন নম্বর:</span>
                  <strong className="font-mono text-xs text-stone-800 dark:text-stone-200">{card.registrationNo}</strong>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block text-[10px]">বিভাগ:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{card.department}</span>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block text-[10px]">পিতার নাম:</span>
                  <span className="text-stone-800 dark:text-stone-200">{card.fatherName}</span>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block text-[10px]">ব্যবস্থা:</span>
                  <span className="font-semibold text-[#064E3B] dark:text-emerald-400">
                    {card.residentType === 'residential' ? '🏡 আবাসিক' : '🎒 অনাবাসিক'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block text-[10px]">ইস্যুর তারিখ:</span>
                  <span className="text-stone-700 dark:text-stone-300 font-sans">{card.issueDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Center & Examination */}
          <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-stone-500 dark:text-stone-400">পরীক্ষার নাম: </span>
                <strong className="text-stone-900 dark:text-stone-100 text-sm font-semibold">{card.examName}</strong>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400">শিক্ষাবর্ষ: </span>
                <strong className="text-stone-900 dark:text-stone-100 font-sans">{card.session}</strong>
              </div>
            </div>
            <div className="flex items-start gap-1.5 text-stone-600 dark:text-stone-300 pt-1 border-t border-stone-200 dark:border-stone-700">
              <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>পরীক্ষা কেন্দ্র:</strong> {card.examCenter}</span>
            </div>
          </div>

          {/* Exam Schedule Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#064E3B] dark:text-emerald-400" />
                <span>পরীক্ষার সময়সূচী (Exam Schedule):</span>
              </h4>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">মোট বিষয়: {card.schedule.length} টি</span>
            </div>

            <div className="border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden overflow-x-auto text-xs">
              <table className="w-full text-left min-w-[300px]">
                <thead className="bg-[#064E3B] text-white font-semibold">
                  <tr>
                    <th className="py-2 px-3">তারিখ</th>
                    <th className="py-2 px-3">বিষয়</th>
                    <th className="py-2 px-3">সময়</th>
                    <th className="py-2 px-3 text-right">কক্ষ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-700 bg-white dark:bg-stone-900">
                  {card.schedule.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-stone-50/50 dark:bg-stone-800/40' : ''}>
                      <td className="py-2 px-3 font-medium whitespace-nowrap">{item.date}</td>
                      <td className="py-2 px-3 font-semibold text-stone-900 dark:text-stone-100">{item.subject}</td>
                      <td className="py-2 px-3 text-stone-600 dark:text-stone-400 font-sans whitespace-nowrap">{item.time}</td>
                      <td className="py-2 px-3 text-right text-stone-700 dark:text-stone-300 whitespace-nowrap">{item.roomNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="p-4 bg-stone-100 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>ইআইআইএন: {MADRASAH_INFO.eiin} • {MADRASAH_INFO.name}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowFullAdmitSheet(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>পূর্ণাঙ্গ প্রবেশপত্র</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex-1 sm:flex-none px-5 py-2 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>{isPrinting ? 'প্রিন্ট তৈরি হচ্ছে...' : 'প্রিন্ট / পিডিএফ ডাউনলোড'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
