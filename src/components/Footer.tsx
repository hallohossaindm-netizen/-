import React from 'react';
import { BookOpen, Phone, Mail, MapPin, Heart, Clock, ExternalLink } from 'lucide-react';
import { MADRASAH_INFO, PRAYER_TIMES } from '../data/madrasahData';

interface FooterProps {
  onOpenDonation: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDonation, onOpenAdmin }) => {
  return (
    <footer className="bg-[#04281f] text-emerald-100 font-bangla border-t border-emerald-950">
      {/* Prayer Times Operational Ribbon */}
      <div className="bg-[#031d16] border-b border-emerald-900/50 py-3 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-semibold shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>আজকের নামাজের সময়সূচী (চট্টগ্রাম ও পার্শ্ববর্তী এলাকা):</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center text-[11px] sm:text-xs">
            {PRAYER_TIMES.map((prayer, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-emerald-300">{prayer.name}:</span>
                <span className="font-mono text-white font-medium">{prayer.jamat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#064E3B] text-amber-400 flex items-center justify-center font-bold border border-emerald-700">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {MADRASAH_INFO.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed max-w-md">
              পবিত্র কুরআনের হিফজ, হাদিস শাস্ত্র ও ইসলামী আদর্শের আলোকে নারীদের নৈতিক ও চরিত্র গঠনের অগ্রণী দ্বীনি শিক্ষা প্রতিষ্ঠান। বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ অনুমোদিত।
            </p>

            <div className="pt-2 text-xs text-amber-300/90 space-y-1">
              <div>ইআইআইএন: {MADRASAH_INFO.eiin}</div>
              <div>স্থাপনাকাল: {MADRASAH_INFO.established}</div>
            </div>
          </div>

          {/* Quick Academic Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-amber-400 font-bold border-b border-emerald-800/60 pb-2">
              শিক্ষা বিভাগসমূহ
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-200/90">
              <li>
                <a href="#academics" className="hover:text-amber-300 transition-colors">নাজেরা বিভাগ (সহীহ তিলাওয়াত)</a>
              </li>
              <li>
                <a href="#academics" className="hover:text-amber-300 transition-colors">হিফজুল কুরআন বিভাগ</a>
              </li>
              <li>
                <a href="#academics" className="hover:text-amber-300 transition-colors">কিতাব বিভাগ (দাওরায়ে হাদীস)</a>
              </li>
              <li>
                <a href="#academics" className="hover:text-amber-300 transition-colors">মক্তব ও নূরানী বিভাগ</a>
              </li>
              <li>
                <a href="#academics" className="hover:text-amber-300 transition-colors">দৈনিক ক্লাস ও প্রাতিষ্ঠানিক রুটিন</a>
              </li>
            </ul>
          </div>

          {/* Important Links & Portals */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-amber-400 font-bold border-b border-emerald-800/60 pb-2">
              গুরুত্বপূর্ণ লিংক ও যোগাযোগ
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-200/90">
              <li>
                <a href="#admission" className="hover:text-amber-300 transition-colors">অনলাইন ভর্তি ফরম পূরণ</a>
              </li>
              <li>
                <a href="#notices-results" className="hover:text-amber-300 transition-colors">পরীক্ষার ফলাফল পোর্টাল</a>
              </li>
              <li>
                <a href="#notices-results" className="hover:text-amber-300 transition-colors">সর্বশেষ নোটিশ বোর্ড</a>
              </li>
              <li>
                <button
                  onClick={onOpenDonation}
                  className="hover:text-amber-300 text-left transition-colors text-amber-400 font-medium"
                >
                  লিল্লাহ বোর্ডিং ও যাকাত তহবিল ↗
                </button>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-300 transition-colors">ঠিকানা ও সরাসরি যোগাযোগ</a>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-amber-300 text-left transition-colors text-emerald-300/80 font-medium cursor-pointer"
                  >
                    🔒 প্রশাসনিক প্যানেল (Admin Portal)
                  </button>
                </li>
              )}
            </ul>

            <div className="pt-2 text-xs text-emerald-200/90 space-y-1">
              <div className="text-amber-300 font-semibold font-mono">
                যোগাযোগ: {MADRASAH_INFO.contactNumber}
              </div>
              <div className="text-emerald-300/80 leading-relaxed text-[11px]">
                {MADRASAH_INFO.address}
              </div>
              <div className="text-[10px] text-emerald-400/80 pt-0.5">
                শিক্ষা পরিচালক: {MADRASAH_INFO.educationDirector.name}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Copyright */}
        <div className="mt-12 pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <p>© {new Date().getFullYear()} {MADRASAH_INFO.name}। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <a href="#home" className="hover:text-amber-300 transition-colors">শীর্ষে ফিরে যান ↑</a>
            <span aria-hidden="true">·</span>
            <span>শিক্ষাই আলো, কুরআনই মুক্তি</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
