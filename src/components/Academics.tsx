import React, { useState } from 'react';
import { BookOpen, Crown, Scroll, Sparkles, Clock, Check, ChevronRight, Calendar } from 'lucide-react';
import { DEPARTMENTS, DAILY_ROUTINE } from '../data/madrasahData';
import { DepartmentId } from '../types';

export const Academics: React.FC = () => {
  const [selectedDeptId, setSelectedDeptId] = useState<DepartmentId>('nazera');
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'worship' | 'study' | 'rest'>('all');

  const selectedDept = DEPARTMENTS.find((d) => d.id === selectedDeptId) || DEPARTMENTS[0];

  const filteredRoutine = DAILY_ROUTINE.filter((item) => {
    if (scheduleFilter === 'all') return true;
    return item.category === scheduleFilter;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-500" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-500" />;
      case 'Scroll':
        return <Scroll className="w-5 h-5 text-amber-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <section id="academics" className="py-16 lg:py-24 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-[#064E3B] dark:text-emerald-400 font-bold">
            একাডেমিক বিভাগ ও শিক্ষাক্রম
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bangla text-stone-900 dark:text-stone-100 mt-2">
            আমাদের শিক্ষা বিভাগসমূহ
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm font-bangla mt-3">
            পবিত্র কুরআনের বিশুদ্ধ তিলাওয়াত থেকে শুরু করে দাওরায়ে হাদীস (মাস্টার্স সমমান) পর্যন্ত পর্যায়ক্রমিক দ্বীনি পাঠ্যসূচী।
          </p>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4" />
        </div>

        {/* Department Interactive Tab Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {DEPARTMENTS.map((dept) => {
            const isActive = dept.id === selectedDeptId;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`p-4 rounded-lg text-left transition-all border flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-md ring-1 ring-emerald-500'
                    : 'bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-800'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-2 rounded ${isActive ? 'bg-emerald-950/50' : 'bg-white dark:bg-stone-800 shadow-xs'}`}>
                    {getIcon(dept.iconName)}
                  </div>
                  <span className={`text-[11px] font-sans ${isActive ? 'text-amber-300' : 'text-stone-500 dark:text-stone-400 font-medium'}`}>
                    {dept.duration}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold font-bangla text-base">{dept.name}</div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bangla font-semibold ${
                      dept.id === 'hifz'
                        ? isActive ? 'bg-amber-400 text-stone-900' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : isActive ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                    }`}>
                      {dept.id === 'hifz' ? 'আবাসিক (ছাত্র)' : 'অনাবাসিক'}
                    </span>
                  </div>
                  <div className={`text-xs mt-0.5 font-arabic ${isActive ? 'text-emerald-200' : 'text-stone-500 dark:text-stone-400'}`}>
                    {dept.nameArabic}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Department Detailed Panel */}
        <div className="bg-[#FAF9F5] dark:bg-stone-900/80 rounded-lg border border-stone-200 dark:border-stone-800 p-6 sm:p-8 lg:p-10 mb-16 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Overview & Key Features */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400 font-bangla flex-wrap">
                  <span>কোর্স মেয়াদ: <strong className="text-stone-900 dark:text-stone-100">{selectedDept.duration}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>বয়সসীমা: <strong className="text-stone-900 dark:text-stone-100">{selectedDept.ageLimit}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    selectedDept.id === 'hifz'
                      ? 'bg-emerald-100 text-[#064E3B] dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border border-stone-300 dark:border-stone-700'
                  }`}>
                    {selectedDept.id === 'hifz' ? '🏡 ছেলেদের একমাত্র আবাসিক বিভাগ' : '🎒 সম্পূর্ণ অনাবাসিক বিভাগ (ডে-কেয়ার)'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-bangla text-stone-900 dark:text-stone-100 mt-2">
                  {selectedDept.name} ({selectedDept.nameArabic})
                </h3>
                <p className="text-amber-800 dark:text-amber-300 font-semibold text-sm font-bangla mt-1">
                  {selectedDept.subtitle}
                </p>
              </div>

              <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed font-bangla">
                {selectedDept.description}
              </p>

              {/* Department Highlights */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-stone-900 dark:text-stone-100 font-bangla">
                  বিভাগের প্রধান বৈশিষ্ট্যসমূহ:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedDept.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-bangla">
                      <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="#admission"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043d2e] rounded-md transition-colors shadow-sm"
                >
                  <span>এই বিভাগে অনলাইনে ভর্তি আবেদন করুন</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Department Syllabus & Subject Structure */}
            <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 font-bangla font-bold">
                <BookOpen className="w-4 h-4 text-[#064E3B] dark:text-emerald-400" />
                <span>পাঠ্যসূচী ও কিতাব তালিকা (Syllabus)</span>
              </div>

              <div className="space-y-3">
                {selectedDept.syllabus.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700">
                    <span className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-950 text-[#064E3B] dark:text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-bangla leading-normal">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-bangla pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>সকল বিভাগে নিয়মিত সাপ্তাহিক ও মাসিক পরীক্ষা অনুষ্ঠিত হয়।</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Routine and Class Schedule Overview */}
        <div className="pt-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>শিক্ষার্থীদের সুশৃঙ্খল দিনলিপি ও পাঠপরিকল্পনা</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-bangla text-stone-900 dark:text-stone-100 mt-1">
              দৈনিক রুটিন ও সময়সূচী
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-bangla mt-1">
              ভোর থেকে রাত পর্যন্ত ইবাদত, পাঠদান ও বিশ্রামের আদর্শ সুষম বণ্টন।
            </p>
          </div>

          {/* Routine Filter Buttons (functional buttons with click handlers) */}
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setScheduleFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                scheduleFilter === 'all'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
              }`}
            >
              সম্পূর্ণ রুটিন ({DAILY_ROUTINE.length})
            </button>
            <button
              onClick={() => setScheduleFilter('study')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                scheduleFilter === 'study'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
              }`}
            >
              পাঠদান ও তালিম
            </button>
            <button
              onClick={() => setScheduleFilter('worship')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                scheduleFilter === 'worship'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
              }`}
            >
              সালাত ও ইবাদত
            </button>
            <button
              onClick={() => setScheduleFilter('rest')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                scheduleFilter === 'rest'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
              }`}
            >
              খাবার ও বিশ্রাম
            </button>
          </div>

          {/* Schedule Table / Timeline Grid */}
          <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-200 font-bangla">
                    <th className="py-3 px-4 w-36 sm:w-44">সময় (Time)</th>
                    <th className="py-3 px-4 w-48 sm:w-60">কার্যক্রম ও বিষয়</th>
                    <th className="py-3 px-4">বিস্তারিত বিবরণ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs sm:text-sm font-bangla">
                  {filteredRoutine.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-amber-50/30 dark:hover:bg-stone-800/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-[#064E3B] dark:text-emerald-400 whitespace-nowrap tabular-nums">
                        {item.time}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-stone-100">
                        {item.activity}
                      </td>
                      <td className="py-3.5 px-4 text-stone-700 dark:text-stone-300 leading-relaxed">
                        {item.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
