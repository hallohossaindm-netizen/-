import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Printer,
  Download,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  X,
  Award,
  ExternalLink,
  Copy,
  Check,
  Smartphone
} from 'lucide-react';
import { AdmitCardData } from '../types';
import { MADRASAH_INFO } from '../data/madrasahData';
import { printAdmitCard, getAdmitCardVerificationUrl } from '../utils/printAdmitCard';
import { AdmitCardVerificationModal } from './AdmitCardVerificationModal';

interface AdmitCardViewProps {
  card: AdmitCardData;
  onClose?: () => void;
  isModal?: boolean;
}

export const AdmitCardView: React.FC<AdmitCardViewProps> = ({ card, onClose, isModal = false }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);

  const verifyUrl = getAdmitCardVerificationUrl(card);

  useEffect(() => {
    let isMounted = true;
    const generateQR = async () => {
      try {
        // Encode real HTTPS URL so any phone camera or QR scanner opens the live verification page
        const url = await QRCode.toDataURL(verifyUrl, {
          width: 240,
          margin: 1,
          color: {
            dark: '#064E3B',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        if (isMounted) {
          setQrCodeUrl(url);
        }
      } catch (err) {
        console.error('Failed to generate admit card QR code', err);
      }
    };

    generateQR();
    return () => {
      isMounted = false;
    };
  }, [card, verifyUrl]);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      await printAdmitCard(card, qrCodeUrl);
    } catch (err) {
      console.error('Admit card print error:', err);
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(verifyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const content = (
    <div className="bg-white text-stone-900 rounded-xl shadow-lg border border-stone-300 overflow-hidden font-bangla print:border-none print:shadow-none print:m-0 print:p-0">
      {/* Top Action Bar (hidden when printing) */}
      <div className="bg-stone-100 dark:bg-stone-800 p-3 sm:p-4 border-b border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 font-bangla">
            প্রবেশপত্র প্রস্তুত · কিউআর কোড ভেরিফাইড (A4 প্রিন্ট উপযোগী)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            type="button"
            onClick={() => setShowVerifyModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[#064E3B] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="মোবাইল দিয়ে স্ক্যান করলে যা দেখা যাবে, তা সরাসরি স্ক্রিনে টেস্ট করুন"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>স্ক্যান টেস্ট / অনলাইন যাচাই</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={isPrinting}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>{isPrinting ? 'প্রিন্ট তৈরি হচ্ছে...' : 'প্রবেশপত্র প্রিন্ট / পিডিএফ ডাউনলোড'}</span>
          </button>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Helpful Print / Save as PDF tip */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 px-4 py-2 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2 flex-wrap no-print">
        <div className="flex items-center gap-2">
          <span className="font-bold">💡 টিপস:</span>
          <span>
            প্রিন্ট বাটনে ক্লিক করার পর Destination-এ <strong className="font-semibold underline">"Save as PDF"</strong> নির্বাচন করলে প্রবেশপত্রটি সরাসরি আপনার ডিভাইসে পিডিএফ ফাইল হিসেবে সেভ হবে।
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-800 dark:text-amber-300 font-mono">
          <span>A4 সাইজ রেডি</span>
        </div>
      </div>

      {/* Official Admit Card Printable Sheet */}
      <div
        id="admit-card-printable-sheet"
        className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-6 print:p-2 print:max-w-full"
      >
        {/* Madrasah Header Banner */}
        <div className="border-b-2 border-[#064E3B] pb-4 text-center space-y-1 relative">
          <div className="text-xs font-arabic text-emerald-800 font-semibold tracking-wide">
            {MADRASAH_INFO.arabicVerse || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B] tracking-tight">
            {MADRASAH_INFO.name}
          </h2>
          <div className="text-xs sm:text-sm font-sans text-stone-600 font-medium">
            {MADRASAH_INFO.nameEn}
          </div>
          <p className="text-[11px] sm:text-xs text-stone-600">
            {MADRASAH_INFO.address} • যোগাযোগ: {MADRASAH_INFO.contactNumber}
          </p>
          <div className="text-[11px] text-emerald-900 font-semibold pt-0.5">
            ইআইআইএন: {MADRASAH_INFO.eiin}
          </div>

          <div className="pt-2">
            <span className="inline-block px-5 py-1.5 bg-[#064E3B] text-amber-300 font-bold text-sm sm:text-base rounded-md uppercase tracking-wider shadow-xs border border-emerald-900">
              পরীক্ষার প্রবেশপত্র (ADMIT CARD)
            </span>
          </div>
        </div>

        {/* Exam Title & Center Ribbon */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-stone-600">পরীক্ষার নাম: </span>
            <strong className="text-[#064E3B] text-sm sm:text-base">{card.examName}</strong>
          </div>
          <div className="flex items-center gap-4 text-stone-700 flex-wrap justify-center">
            <span>শিক্ষাবর্ষ: <strong className="font-sans">{card.session}</strong></span>
            <span aria-hidden="true">|</span>
            <span>ইস্যুর তারিখ: <strong>{card.issueDate}</strong></span>
          </div>
        </div>

        {/* Student Information & QR Code Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-stone-50/80 p-5 rounded-xl border border-stone-200">
          {/* Student Info Details */}
          <div className="md:col-span-8 space-y-2.5 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <span className="text-stone-500 block text-[11px]">শিক্ষার্থীর নাম (বাংলা):</span>
                <strong className="text-stone-900 text-sm sm:text-base">{card.studentName}</strong>
              </div>
              {card.studentNameEn && (
                <div>
                  <span className="text-stone-500 block text-[11px]">শিক্ষার্থীর নাম (ইংরেজি):</span>
                  <strong className="text-stone-800 font-sans">{card.studentNameEn}</strong>
                </div>
              )}
              <div>
                <span className="text-stone-500 block text-[11px]">পিতার নাম:</span>
                <strong className="text-stone-800">{card.fatherName}</strong>
              </div>
              {card.motherName && (
                <div>
                  <span className="text-stone-500 block text-[11px]">মাতার নাম:</span>
                  <strong className="text-stone-800">{card.motherName}</strong>
                </div>
              )}
              <div>
                <span className="text-stone-500 block text-[11px]">রোল নম্বর:</span>
                <strong className="text-[#064E3B] text-base font-mono font-bold">{card.roll}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">রেজিস্ট্রেশন নম্বর:</span>
                <strong className="text-stone-900 font-mono font-semibold">{card.registrationNo}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">শিক্ষা বিভাগ:</span>
                <strong className="text-stone-900 font-bold">{card.department}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">ব্যবস্থা (আবাসিক/অনাবাসিক):</span>
                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                  card.residentType === 'residential'
                    ? 'bg-emerald-100 text-[#064E3B] border border-emerald-300'
                    : 'bg-stone-200 text-stone-800 border border-stone-300'
                }`}>
                  {card.residentType === 'residential' ? '🏡 আবাসিক (হেফজ বিভাগ)' : '🎒 সম্পূর্ণ অনাবাসিক'}
                </span>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-stone-600 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span><strong>পরীক্ষা কেন্দ্র:</strong> {card.examCenter}</span>
            </div>
          </div>

          {/* Verification QR Code Section */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-stone-200 text-center shadow-xs">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt={`QR Code for Roll ${card.roll}`}
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
              />
            ) : (
              <div className="w-32 h-32 bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                কিউআর কোড প্রস্তুত হচ্ছে...
              </div>
            )}
            <div className="mt-2 text-[10px] text-stone-600 font-mono">
              রেজিস্ট্রেশন: {card.registrationNo}
            </div>
            <div className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>ডিজিটাল ভেরিফাইড কিউআর কোড</span>
            </div>
            <p className="text-[9px] text-stone-400 mt-1 leading-tight">
              স্মার্টফোনের ক্যামেরা দিয়ে স্ক্যান করলেই অনলাইন যাচাই দেখা যাবে
            </p>

            {/* Test button & Copy link */}
            <div className="pt-2 flex items-center gap-1.5 no-print">
              <button
                type="button"
                onClick={() => setShowVerifyModal(true)}
                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] border border-emerald-200 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                title="যাচাই ফলাফল টেস্ট করুন"
              >
                <Smartphone className="w-3 h-3" />
                <span>যাচাই টেস্ট</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded text-[10px] transition-colors cursor-pointer"
                title="যাচাইকরণ লিংক কপি করুন"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Examination Routine / Schedule Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#064E3B]" />
              <span>পরীক্ষার সময়সূচী ও বিষয় তালিকা (Exam Routine):</span>
            </h4>
            <span className="text-[11px] text-stone-500">মোট পরীক্ষা: {card.schedule.length} টি</span>
          </div>

          <div className="border border-stone-300 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[320px]">
              <thead>
                <tr className="bg-[#064E3B] text-white font-bold">
                  <th className="py-2.5 px-3">তারিখ ও বার</th>
                  <th className="py-2.5 px-3">বিষয়ের নাম</th>
                  <th className="py-2.5 px-3">পরীক্ষার সময়</th>
                  <th className="py-2.5 px-3 text-right">কক্ষ / হল</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {card.schedule.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                    <td className="py-2 px-3 font-medium whitespace-nowrap">
                      {item.date} ({item.day})
                    </td>
                    <td className="py-2 px-3 font-semibold text-stone-900">
                      {item.subject}
                    </td>
                    <td className="py-2 px-3 text-stone-600 font-sans whitespace-nowrap">
                      {item.time}
                    </td>
                    <td className="py-2 px-3 text-right text-stone-700 whitespace-nowrap">
                      {item.roomNo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidate Rules & Instructions */}
        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg text-xs space-y-1.5">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>পরীক্ষার্থীদের জন্য বিশেষ নির্দেশাবলী:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-stone-700">
            {card.instructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </div>

        {/* Signatures & Seal Section */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end text-center text-xs">
          <div className="space-y-1">
            <div className="w-28 sm:w-36 border-b border-stone-400 mx-auto" />
            <span className="text-stone-500 block text-[11px]">শিক্ষার্থীর স্বাক্ষর</span>
          </div>

          <div className="space-y-1">
            <div className="w-20 h-20 rounded-full border border-dashed border-emerald-600 mx-auto flex items-center justify-center text-[10px] text-emerald-800 font-bold p-1 leading-tight">
              মাদ্রাসার অফিসিয়াল সীল
            </div>
            <span className="text-stone-400 text-[10px] block">অফিস সীলমোহর</span>
          </div>

          <div className="space-y-1 sm:text-right">
            <div className="font-arabic text-emerald-900 font-bold text-sm">
              محمد أمين رسول
            </div>
            <div className="w-28 sm:w-36 border-b border-stone-400 mx-auto sm:ml-auto sm:mr-0" />
            <span className="text-stone-900 font-bold block text-[11px]">মাওলানা আমিন রাসূল সাহেব</span>
            <span className="text-stone-500 block text-[10px]">মুহতামিম ও পরীক্ষা নিয়ন্ত্রক</span>
          </div>
        </div>

        {/* Footer print note */}
        <div className="pt-4 border-t border-stone-200 text-center text-[10px] text-stone-400 font-mono">
          এটি একটি কম্পিউটার-জেনারেটেড স্বয়ংক্রিয় প্রবেশপত্র। এর সত্যতা কিউআর কোড স্ক্যান করে অনলাইনে যাচাইযোগ্য।
        </div>
      </div>

      {/* Embedded Live Verification Modal */}
      {showVerifyModal && (
        <AdmitCardVerificationModal
          card={card}
          onClose={() => setShowVerifyModal(false)}
        />
      )}
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto my-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
