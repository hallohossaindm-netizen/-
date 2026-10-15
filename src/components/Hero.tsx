import React, { useState } from 'react';
import { ArrowRight, Bell, Pause, Play, CheckCircle2, BookOpen } from 'lucide-react';
import { MADRASAH_INFO, STATS } from '../data/madrasahData';

export const Hero: React.FC = () => {
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  const urgentAnnouncements = [
    '১৪৪৭-৪৮ হিজরী শিক্ষাবর্ষে সকল বিভাগে (নূরানী, নাজেরা, হিফজ ও কিতাব) সীমিত আসনে নতুন শিক্ষার্থী ভর্তি কার্যক্রম শুরু হয়েছে।',
    'যোগাযোগ ও ভর্তি তথ্য হেল্পলাইন: ০১৮১৫০৭৪১১৮ (শিক্ষা পরিচালক: হযরত মাওলানা জাহিদ উল্লাহ সাহেব)',
    'হিফজুল কুরআন বিভাগে বিশেষ মেধাভিত্তিক ছাড় ও এতিম ছাত্রীদের জন্য পূর্ণাঙ্গ ফ্রি আবাসন সুবিধা।',
    'ক্যাম্পাস: সন্দীপ কলোনি, দক্ষিণ পাহাড়তলী, ১নং ওয়ার্ড, ফতেয়াবাদ ৪৩৩৫, চট্টগ্রাম।',
  ];

  return (
    <section id="home" className="relative bg-[#FAF9F5] dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      {/* Urgent Announcements Marquee Bar */}
      <div className="bg-amber-500/15 dark:bg-amber-950/40 border-b border-amber-600/20 dark:border-amber-900/60 text-stone-900 dark:text-stone-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-950 dark:text-amber-300 font-bold shrink-0">
            <Bell className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span className="font-bangla">জরুরি বিজ্ঞপ্তি:</span>
          </div>

          <div
            className="overflow-hidden flex-1 relative"
            onMouseEnter={() => setIsMarqueePaused(true)}
            onMouseLeave={() => setIsMarqueePaused(false)}
          >
            <div
              className={`whitespace-nowrap flex items-center gap-8 ${
                isMarqueePaused ? '' : 'animate-marquee'
              }`}
            >
              {urgentAnnouncements.map((announcement, index) => (
                <div key={index} className="inline-flex items-center gap-2">
                  <span className="text-stone-800 dark:text-stone-100 hover:text-emerald-900 dark:hover:text-amber-300 transition-colors font-bangla font-medium">
                    {announcement}
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold" aria-hidden="true">❖</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsMarqueePaused(!isMarqueePaused)}
            className="shrink-0 p-1 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-amber-200/60 dark:hover:bg-amber-900/60 rounded transition-colors"
            title={isMarqueePaused ? 'প্লে করুন' : 'বিরতি দিন'}
            aria-label={isMarqueePaused ? 'Resume marquee' : 'Pause marquee'}
          >
            {isMarqueePaused ? (
              <Play className="w-3.5 h-3.5" />
            ) : (
              <Pause className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Inspiring Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#064E3B] via-[#064E3B] to-[#043d2e] text-white">
        {/* Ambient Architectural Texture & Scrim */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Arabic Calligraphy Header */}
              <div className="space-y-2">
                <div className="text-amber-300 font-arabic text-xl lg:text-2xl tracking-wide select-none">
                  {MADRASAH_INFO.arabicVerse}
                </div>
                <div className="text-xs text-emerald-200/80 font-bangla">
                  {MADRASAH_INFO.arabicVerseTranslation}
                </div>
              </div>

              {/* Tagline & Institution Title */}
              <div className="space-y-3">
                <div className="text-xs tracking-widest uppercase text-amber-400 font-semibold">
                  দ্বীনি শিক্ষার সুবাসিত আদর্শ নারী বিদ্যাপীঠ · স্থাপিত {MADRASAH_INFO.established}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-bangla tracking-tight text-white leading-tight text-balance">
                  {MADRASAH_INFO.name}
                </h1>
                <p className="text-xl sm:text-2xl font-serif text-amber-200/95 italic font-bangla">
                  "{MADRASAH_INFO.tagline}"
                </p>
              </div>

              {/* Mission Prose */}
              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl font-bangla">
                কুরআনে কারীমের সহীহ হিফজ, হাদিস শাস্ত্র ও ইলমে দ্বীনের আলোয় নারীদের আলোকিত চরিত্র গঠনে বিশ্বস্ত প্রতিষ্ঠান। সম্পূর্ণ শরয়ী পর্দার ভেতর আধুনিক সুযোগ-সুবিধাসহ একনিষ্ঠ শিক্ষিকাদের তত্ত্বাবধানে আপনার কন্যার আদর্শ ভবিষ্যৎ গড়ে তুলুন।
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-emerald-100/95 font-bangla">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>সম্পূর্ণ মহিলা শিক্ষিকা দ্বারা পরিচালিত ক্লাস</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>নিরাপদ ও সুশৃঙ্খল আবাসিক ছাত্রীবাস</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>আন্তর্জাতিক মানের তাজবীদ ও ক্বেরাত শিক্ষা</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>দ্বীনি শিক্ষার পাশাপাশি বাংলা, ইংরেজি ও গণিত</span>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex items-center gap-4 pt-4 flex-wrap">
                <a
                  href="#admission"
                  className="px-6 py-3 text-sm font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors shadow-md inline-flex items-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-emerald-950"
                >
                  <span>অনলাইনে ভর্তি ফরম পূরণ করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#academics"
                  className="px-5 py-3 text-sm font-medium text-emerald-100 hover:text-white border border-emerald-600/80 hover:border-emerald-400 rounded-md transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <BookOpen className="w-4 h-4 text-emerald-300" />
                  <span>বিভাগ ও সিলেবাস দেখুন</span>
                </a>
              </div>
            </div>

            {/* Right Campus Photography Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-lg overflow-hidden border border-emerald-700/60 shadow-2xl bg-emerald-950 aspect-[4/3] lg:aspect-auto lg:h-[420px]">
                <img
                  src="/src/assets/images/madrasah_campus_hero_1791811339923.jpg"
                  alt="তালিমুল কুরআন মহিলা মাদ্রাসা মনোরম ক্যাম্পাস প্রাঙ্গণ"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs uppercase tracking-wider text-amber-300 font-medium">
                    আধুনিক ও সুপরিসর শিক্ষাঙ্গন
                  </div>
                  <div className="text-sm font-bangla font-semibold text-stone-100 mt-0.5">
                    পর্দাপূর্ণ মনোরম পরিবেশে ইলম ও আমলের অনন্য মিলনস্থল
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards (Stat Strip adhering to zero-pill & tabular figures) */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-6 lg:-mt-8 relative z-20">
        <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200/90 dark:border-stone-800 shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-stone-800">
          {STATS.map((stat, idx) => (
            <div key={idx} className="p-6 text-center sm:text-left flex flex-col justify-center">
              <div className="text-2xl lg:text-3xl font-bold font-bangla text-[#064E3B] dark:text-emerald-400 tracking-tight tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 font-bangla mt-1">
                {stat.label}
              </div>
              <div className="text-xs text-stone-600 dark:text-stone-400 font-bangla mt-0.5">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
