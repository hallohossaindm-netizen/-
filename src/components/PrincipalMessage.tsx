import React, { useState } from 'react';
import { Quote, Award, ShieldCheck, HeartHandshake, Phone, MapPin, User, ChevronDown, ChevronUp, BookOpen, Sparkles } from 'lucide-react';
import { MADRASAH_INFO } from '../data/madrasahData';

export const PrincipalMessage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'director' | 'founder' | 'academic'>('director');
  const [isDirectorExpanded, setIsDirectorExpanded] = useState(false);
  const [isFounderExpanded, setIsFounderExpanded] = useState(false);

  return (
    <section id="about" className="py-16 lg:py-24 bg-[#FAF9F5] dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#064E3B] dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-300 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>আমাদের ঐতিহ্য, ইতিহাস ও নেতৃত্ব</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bangla text-stone-900 dark:text-stone-100 mt-1">
            প্রতিষ্ঠাতা স্মরণ ও পরিচালনা পরিষদের বাণী
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm font-bangla mt-2 max-w-xl mx-auto">
            ত্যাগের রক্তিম ইতিহাস, সুযোগ্য পরিচালনা এবং নিবেদিতপ্রাণ শিক্ষা ব্যবস্থাপনায় আলোকিত চট্টগ্রামের স্বনামধন্য নারী দ্বীনি বিদ্যাপীঠ।
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Navigation Tabs between Director, Founder, and Education Director */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('director')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold font-bangla transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'director'
                ? 'bg-[#064E3B] text-white shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700'
            }`}
          >
            <User className="w-4 h-4 text-amber-400" />
            <span>বর্তমান পরিচালক: মাওলানা আমিন রাসূল সাহেব</span>
          </button>

          <button
            onClick={() => setActiveTab('founder')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold font-bangla transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'founder'
                ? 'bg-[#064E3B] text-white shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-amber-500" />
            <span>প্রতিষ্ঠাতা ও ত্যাগের ইতিহাস: মাওলানা মোঃ আব্দুর রহমান সাহেব</span>
          </button>

          <button
            onClick={() => setActiveTab('academic')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold font-bangla transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'academic'
                ? 'bg-[#064E3B] text-white shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>শিক্ষা প্রশাসন: হযরত মাওলানা জাহিদ উল্লাহ সাহেব</span>
          </button>
        </div>

        {/* Tab 1: Current Director (মাওলানা আমিন রাসূল সাহেব) */}
        {activeTab === 'director' && (
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Photo & Identity Column */}
              <div className="lg:col-span-4 bg-stone-50 dark:bg-stone-950/60 p-6 lg:p-8 flex flex-col items-center text-center justify-between border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-stone-800">
                <div className="space-y-4 w-full">
                  <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 rounded-xl overflow-hidden border-2 border-emerald-700/30 shadow-md bg-stone-200">
                    <img
                      src="/src/assets/images/madrasah_principal_1791811356816.jpg"
                      alt={MADRASAH_INFO.currentDirector.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-900/80 to-transparent p-2 text-white text-[11px] font-bangla">
                      বর্তমান পরিচালক
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-bangla text-stone-900 dark:text-stone-100">
                      {MADRASAH_INFO.currentDirector.name}
                    </h3>
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 font-bangla mt-1">
                      {MADRASAH_INFO.currentDirector.title}
                    </div>
                    <div className="inline-block mt-2 px-3 py-1 bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 rounded-full text-[11px] text-amber-950 dark:text-amber-200 font-medium font-bangla">
                      {MADRASAH_INFO.currentDirector.relation}
                    </div>
                  </div>
                </div>

                {/* Core Commitments */}
                <div className="w-full mt-6 pt-6 border-t border-stone-200 dark:border-stone-800 space-y-2.5 text-left text-xs text-stone-700 dark:text-stone-300 font-bangla">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>শতভাগ শরয়ী পর্দার নিশ্ছিদ্র নিরাপত্তা</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>বেফাক বোর্ডে শতভাগ সাফল্য ও মেধা অর্জন</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>মমতাময়ী মাতৃতুল্য আবাসিক তত্ত্বাবধান</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="text-[11px] text-stone-600 dark:text-stone-400">{MADRASAH_INFO.address}</span>
                  </div>
                </div>
              </div>

              {/* Welcoming Speech Body */}
              <div className="lg:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <Quote className="w-6 h-6 rotate-180 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-semibold tracking-wider font-bangla uppercase">
                      বিসমিল্লাহির রাহমানির রাহীম — বর্তমান পরিচালকের বাণী
                    </span>
                  </div>

                  <div className="text-stone-800 dark:text-stone-200 font-bangla text-base leading-relaxed space-y-4">
                    <p className="first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#064E3B] dark:first-letter:text-emerald-400 first-letter:leading-none">
                      আলহামদুলিল্লাহি রাব্বিল আলামীন, ওয়াসসালাতু ওয়াসসালামু আলা সাইয়্যিদিল মুরসালীন। তালিমুল কুরআন মহিলা মাদ্রাসা চট্টগ্রামের ফতেয়াবাদে নারী দ্বীনি শিক্ষার এক আলোকবর্তিকা। আমার শ্রদ্ধেয় বড় ভাই এবং এই মাদ্রাসার সম্মানিত প্রতিষ্ঠাতা মাওলানা মোঃ আব্দুর রহমান সাহেব যে মহান লক্ষ্য ও সীমাহীন ত্যাগের মাধ্যমে প্রতিষ্ঠানটির ভিত্তিপ্রস্তর স্থাপন করেছিলেন, আজ তাঁর সেই নিষ্ঠা ও মেহনতের ফলশ্রুতিতেই শত শত মুসলিম কন্যারা পবিত্র কুরআনের হাফেজা ও দ্বীনের একনিষ্ঠ খাদেমা হিসেবে গড়ে উঠছে।
                    </p>

                    <p>
                      বর্তমান সময়ে যখন নৈতিক অবক্ষয় পরিবার ও সমাজকে গ্রাস করছে, তখন আমাদের মা-বোনদের কুরআন ও সুন্নাহর ছায়াতলে আদর্শ জীবন গঠনের কোনো বিকল্প নেই। "একজন দ্বীনদার শিক্ষিত মা গড়ে তুলতে পারেন একটি আদর্শ পরিবার ও আলোকিত সমাজ"—এই মূলমন্ত্রকে সামনে রেখে আমরা মাদ্রাসার পাঠদান, শৃঙ্খলা ও তরবিয়ত পরিচালনা করে আসছি।
                    </p>

                    {isDirectorExpanded && (
                      <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                        <p>
                          আমাদের মাদ্রাসায় নাজেরা, আন্তর্জাতিক মানের হিফজুল কুরআন এবং কিতাব বিভাগে বেফাক বোর্ডের মানসম্মত সিলেবাস পূর্ণ নিষ্ঠার সাথে পাঠদান করা হয়। নারী শিক্ষার্থীদের শারীরিক ও আত্মিক সুরক্ষায় মহিলা শিক্ষক ও অভিজ্ঞ হাফেযাদের দ্বারা নিবিড় তত্ত্বাবধান নিশ্চিত করা হয়।
                        </p>
                        <p>
                          আমরা ফতেয়াবাদ, পাহাড়তলীসহ চট্টগ্রামের সর্বস্তরের মুসলিম ভাই-বোন ও অভিভাবকদের প্রতি উদাত্ত আহ্বান জানাই—আপনার আদরের কন্যাদের দ্বীনি শিক্ষায় শিক্ষিত করতে আমাদের সাথে থাকুন এবং প্রতিষ্ঠাতা সাহেবের সূচিত এই বরকতময় খেদমতকে সার্বিক দোয়া ও সহযোগিতায় ধন্য করুন।
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsDirectorExpanded(!isDirectorExpanded)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors pt-2 focus:outline-none cursor-pointer"
                  >
                    <span>{isDirectorExpanded ? 'সংক্ষিপ্ত বক্তব্য দেখুন' : 'সম্পূর্ণ বক্তব্য পড়ুন...'}</span>
                    {isDirectorExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Signature Lockup */}
                <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-bold font-bangla text-stone-900 dark:text-stone-100">
                      {MADRASAH_INFO.currentDirector.name}
                    </div>
                    <div className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold font-bangla">
                      বর্তমান পরিচালক ও মুহতামিম
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-bangla">
                      {MADRASAH_INFO.name}, ফতেয়াবাদ, চট্টগ্রাম
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-arabic text-amber-800 dark:text-amber-300 text-lg">
                      جزاکم اللہ خیرا
                    </div>
                    <div className="text-[11px] text-stone-400 dark:text-stone-500">
                      জাযাকুমুল্লাহু খাইরান
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Founder & History (মাওলানা মোঃ আব্দুর রহমান সাহেব) */}
        {activeTab === 'founder' && (
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden p-6 sm:p-10 lg:p-12 animate-in fade-in duration-300">
            <div className="max-w-4xl mx-auto space-y-8 font-bangla">
              {/* Founder Profile Top Box */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-3xl shrink-0 border-4 border-amber-400 shadow-md">
                  রহমান
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <div className="text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400 font-bold">
                    মাদ্রাসার প্রতিষ্ঠাতা ও স্বপ্নদ্রষ্টা
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {MADRASAH_INFO.founder.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl">
                    {MADRASAH_INFO.founder.bio}
                  </p>
                  <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 pt-1">
                    প্রতিষ্ঠাকাল: {MADRASAH_INFO.established} · ফতেয়াবাদ, চট্টগ্রাম
                  </div>
                </div>
              </div>

              {/* History & Struggle Memoir */}
              <div className="space-y-5 text-stone-800 dark:text-stone-200 text-base leading-relaxed">
                <div className="border-l-4 border-amber-500 pl-4 py-1">
                  <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    আমাদের ইতিহাস ও প্রতিষ্ঠাতা সাহেবের অক্লান্ত ত্যাগের স্মৃতিচারণ
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    যে ত্যাগ ও পরিশ্রমের শক্তিতে তিলে তিলে দাঁড়িয়েছে আজকের এই ঐতিহ্যবাহী প্রতিষ্ঠান
                  </p>
                </div>

                <p>
                  চট্টগ্রামের ফতেয়াবাদ এলাকার সন্দীপ কলোনিতে নারী শিক্ষার জন্য যখন কোনো সুনির্দিষ্ট এবং বিশ্বস্ত কওমী দ্বীনি প্রতিষ্ঠান ছিল না, তখন শ্রদ্ধেয় <strong>মাওলানা মোঃ আব্দুর রহমান সাহেব</strong> নিজের আরাম-আয়েশ বিসর্জন দিয়ে এই প্রতিষ্ঠানটির ভিত্তিপ্রস্তর স্থাপন করেন। শত প্রতিকূলতা, আর্থিক টানাপোড়েন এবং সামাজিক চ্যালেঞ্জের মুখোমুখি হয়েও তিনি কখনো পিছপা হননি।
                </p>

                <p>
                  তিনি নিজে বাড়ি বাড়ি গিয়ে অভিভাবকদের বুঝিয়েছেন, মুসলিম মা-বোনদের জন্য বিশুদ্ধ কুরআন শিক্ষার গুরুত্ব তুলে ধরেছেন এবং নিজের সর্বস্ব উজাড় করে দিয়ে একটি জরাজীর্ণ স্থান থেকে এই প্রতিষ্ঠানকে তিলে তিলে আজকের এই সুদৃঢ় রূপ দান করেছেন। প্রতিষ্ঠাতা সাহেবের সেই আন্তরিক কান্না, দোয়া এবং নির্ঘুম রাতের মেহনতই আজ এই মাদ্রাসার মূল আত্মিক শক্তি।
                </p>

                {isFounderExpanded ? (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <p>
                      প্রতিষ্ঠানটি দাঁড় করাতে গিয়ে মাওলানা মোঃ আব্দুর রহমান সাহেব যে শারীরিক ও মানসিক কষ্ট সহ্য করেছেন, তা এই মাদ্রাসার ইতিহাসে চিরস্মরণীয় হয়ে থাকবে। কখনো বৃষ্টিতে ভিজে, কখনো প্রচণ্ড রোদে তিনি ছাত্রীদের বাসস্থান ও খাবারের সংস্থানে ছুটেছেন। আজ তাঁর সেই সুদূরপ্রসারী স্বপ্নের ওপর দাঁড়িয়ে শত শত ছাত্রী কুরআন হিফজ সম্পন্ন করছে ও আলিমা হিসেবে নিজেদের গড়ে তুলছে।
                    </p>
                    <p className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm">
                      <strong>প্রতিষ্ঠাতা সাহেবের মূল আদর্শ:</strong> "আমাদের এই প্রতিষ্ঠান কোনো ব্যবসায়িক উদ্দেশ্য নয়, বরং এটি মহান আল্লাহর সন্তুষ্টি ও রাসুলুল্লাহ (সা.)-এর সুন্নাহকে পুনরুজ্জীবিত করার এক পবিত্র আমানত।" আজ তাঁর সুযোগ্য ভাই <strong>মাওলানা আমিন রাসূল সাহেব</strong> এবং শিক্ষা পরিচালক <strong>হযরত মাওলানা জাহিদ উল্লাহ সাহেব</strong> এই আদর্শকে বুকে ধারণ করেই মাদ্রাসাটিকে আরও সুউচ্চ শিখরে এগিয়ে নিয়ে যাচ্ছেন।
                    </p>
                  </div>
                ) : null}

                <button
                  onClick={() => setIsFounderExpanded(!isFounderExpanded)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors pt-2 focus:outline-none cursor-pointer"
                >
                  <span>{isFounderExpanded ? 'সংক্ষিপ্ত ইতিহাস দেখুন' : 'প্রতিষ্ঠাতা সাহেবের বিস্তারিত ত্যাগ ও ইতিহাস পড়ুন...'}</span>
                  {isFounderExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Tribute Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
                  <div className="text-amber-700 dark:text-amber-400 font-bold text-lg">২০০৮ ইং</div>
                  <div className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-medium">প্রতিষ্ঠাতা সাহেবের হাতে সূচনা</div>
                </div>
                <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
                  <div className="text-[#064E3B] dark:text-emerald-400 font-bold text-lg">নিঃস্বার্থ সেবা</div>
                  <div className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-medium">নারী দ্বীনি শিক্ষার নিবেদিত প্রাণ</div>
                </div>
                <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
                  <div className="text-emerald-800 dark:text-emerald-400 font-bold text-lg">সদকায়ে জারিয়া</div>
                  <div className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-medium">হাজারো তালিবাতের দোয়ার ভাণ্ডার</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Education Director & Administration (হযরত মাওলানা জাহিদ উল্লাহ সাহেব) */}
        {activeTab === 'academic' && (
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden p-6 sm:p-10 lg:p-12 animate-in fade-in duration-300">
            <div className="max-w-4xl mx-auto space-y-8 font-bangla">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#064E3B] text-amber-300 flex items-center justify-center font-bold text-3xl shrink-0 border-2 border-emerald-600 shadow-md">
                  <BookOpen className="w-12 h-12 text-amber-400" />
                </div>
                <div className="text-center sm:text-left space-y-1 flex-1">
                  <div className="text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-bold">
                    শিক্ষা প্রশাসন ও একাডেমিক প্রধান
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {MADRASAH_INFO.educationDirector.name}
                  </h3>
                  <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {MADRASAH_INFO.educationDirector.title} ও নাযেমাতুত তালিমাত
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl pt-1">
                    {MADRASAH_INFO.educationDirector.message}
                  </p>
                  
                  {/* Direct Contact Button */}
                  <div className="pt-3 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                    <a
                      href={`tel:${MADRASAH_INFO.educationDirector.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#064E3B] hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>সরাসরি কল করুন: {MADRASAH_INFO.educationDirector.phone}</span>
                    </a>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      (পড়াশোনা ও ভর্তি সংক্রান্ত পরামর্শের জন্য)
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-stone-800 dark:text-stone-200">
                <div className="p-5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 space-y-2">
                  <h5 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>পাঠ্যক্রম ও পাঠদান তদারকি</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের অনুমোদিত পাঠ্যক্রম অনুযায়ী কিতাব, নাজেরা ও হিফজ বিভাগের পাঠপরিকল্পনা প্রণয়ন এবং সাপ্তাহিক মূল্যায়ন পরীক্ষা সম্পন্ন করা হয়।
                  </p>
                </div>

                <div className="p-5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 space-y-2">
                  <h5 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>মহিলা শিক্ষিকাবৃন্দের দিকনির্দেশনা</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    অভিজ্ঞ মুহাদ্দিসা ও আন্তর্জাতিক মানের হাফেযাদের নিয়ে গঠিত শিক্ষকমণ্ডলীকে সরাসরি নিবিড় পরামর্শ ও তত্ত্বাবধান প্রদান করেন শিক্ষা পরিচালক মহোদয়।
                  </p>
                </div>
              </div>

              {/* Location Card */}
              <div className="p-4 bg-stone-100 dark:bg-stone-800/80 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center gap-3 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">ক্যাম্পাস কার্যালয়: </span>
                  <span>{MADRASAH_INFO.address}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Three-Pillar Leadership Strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveTab('founder')}
            className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 cursor-pointer transition-all hover:shadow-sm"
          >
            <div className="text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1">
              সম্মানিত প্রতিষ্ঠাতা
            </div>
            <div className="font-bold text-stone-900 dark:text-stone-100 text-sm font-bangla">
              {MADRASAH_INFO.founder.name}
            </div>
            <div className="text-xs text-stone-600 dark:text-stone-400 font-bangla mt-1">
              যাঁর অক্লান্ত কষ্ট ও ত্যাগে মাদ্রাসাটি তিলে তিলে দাঁড় হয়েছে
            </div>
          </div>

          <div
            onClick={() => setActiveTab('director')}
            className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-500 dark:hover:border-emerald-400 cursor-pointer transition-all hover:shadow-sm"
          >
            <div className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold mb-1">
              বর্তমান পরিচালক (ভাই)
            </div>
            <div className="font-bold text-stone-900 dark:text-stone-100 text-sm font-bangla">
              {MADRASAH_INFO.currentDirector.name}
            </div>
            <div className="text-xs text-stone-600 dark:text-stone-400 font-bangla mt-1">
              প্রতিষ্ঠাতা সাহেবের সহোদর ভাই ও বর্তমান মুহতামিম
            </div>
          </div>

          <div
            onClick={() => setActiveTab('academic')}
            className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-500 dark:hover:border-emerald-400 cursor-pointer transition-all hover:shadow-sm"
          >
            <div className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold mb-1">
              শিক্ষা পরিচালক
            </div>
            <div className="font-bold text-stone-900 dark:text-stone-100 text-sm font-bangla">
              {MADRASAH_INFO.educationDirector.name}
            </div>
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold font-mono mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{MADRASAH_INFO.educationDirector.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
