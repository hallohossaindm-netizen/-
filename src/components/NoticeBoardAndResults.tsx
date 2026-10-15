import React, { useState } from 'react';
import { Bell, Search, FileText, Download, Award, CheckCircle, AlertCircle, Printer, X, Calendar, User, BookOpen } from 'lucide-react';
import { MADRASAH_INFO } from '../data/madrasahData';
import { NoticeItem, StudentResult } from '../types';
import { useMadrasah } from '../context/MadrasahContext';

export const NoticeBoardAndResults: React.FC = () => {
  const { notices, results } = useMadrasah();
  const [activeTab, setActiveTab] = useState<'notices' | 'results'>('notices');
  
  // Notice state
  const [noticeFilter, setNoticeFilter] = useState<'all' | 'admission' | 'exam' | 'holiday' | 'general'>('all');
  const [noticeSearch, setNoticeSearch] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  // Result state
  const [rollInput, setRollInput] = useState('101');
  const [examSelection, setExamSelection] = useState('annual');
  const [searchedResult, setSearchedResult] = useState<StudentResult | null>(() => results['101'] || null);
  const [resultError, setResultError] = useState<string | null>(null);
  const [isSearchingResult, setIsSearchingResult] = useState(false);

  // Filter notices
  const filteredNotices = notices.filter((item) => {
    const matchesCategory = noticeFilter === 'all' || item.category === noticeFilter;
    const matchesSearch = item.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
                          item.content.toLowerCase().includes(noticeSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleResultSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResultError(null);
    const cleanRoll = rollInput.trim();

    if (!cleanRoll) {
      setResultError('অনুগ্রহ করে সঠিক রোল বা রেজিস্ট্রেশন নম্বর দিন।');
      return;
    }

    setIsSearchingResult(true);
    setTimeout(() => {
      if (results[cleanRoll]) {
        setSearchedResult(results[cleanRoll]);
        setResultError(null);
      } else {
        setSearchedResult(null);
        const sampleRolls = Object.keys(results).slice(0, 5).join(', ');
        setResultError(`রোল "${cleanRoll}"-এর কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে সঠিক রোল (যেমন: ${sampleRolls || '101, 102'}) দিয়ে চেষ্টা করুন অথবা এডমিন প্যানেল থেকে ফলাফল আপলোড করুন।`);
      }
      setIsSearchingResult(false);
    }, 250);
  };


  return (
    <section id="notices-results" className="py-16 lg:py-24 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="text-xs uppercase tracking-widest text-[#064E3B] dark:text-emerald-400 font-bold">
            ঘোষণা ও একাডেমিক মূল্যায়ন
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bangla text-stone-900 dark:text-stone-100 mt-2">
            নোটিশ বোর্ড ও ফলাফল পোর্টাল
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm font-bangla mt-3">
            মাদ্রাসার যাবতীয় জরুরি প্রশাসনিক বিজ্ঞপ্তি, ছুটির দিনপঞ্জি এবং অনলাইন ফলাফল অনুসন্ধান ব্যবস্থা।
          </p>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4" />
        </div>

        {/* Section Level Segmented Switcher (interactive buttons) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all font-bangla flex items-center gap-2 cursor-pointer ${
                activeTab === 'notices'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-300" />
              <span>নোটিশ বোর্ড ও পরীক্ষা রুটিন</span>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all font-bangla flex items-center gap-2 cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>অনলাইন ফলাফল (Result Portal)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Notice Board */}
        {activeTab === 'notices' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter and Search Bar */}
            <div className="bg-[#FAF9F5] dark:bg-stone-900/80 p-4 rounded-lg border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setNoticeFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors font-bangla cursor-pointer ${
                    noticeFilter === 'all'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  সব নোটিশ
                </button>
                <button
                  onClick={() => setNoticeFilter('admission')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors font-bangla cursor-pointer ${
                    noticeFilter === 'admission'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  ভর্তি সংক্রান্ত
                </button>
                <button
                  onClick={() => setNoticeFilter('exam')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors font-bangla cursor-pointer ${
                    noticeFilter === 'exam'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  পরীক্ষা ও রুটিন
                </button>
                <button
                  onClick={() => setNoticeFilter('holiday')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors font-bangla cursor-pointer ${
                    noticeFilter === 'holiday'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  ছুটি ও উৎসব
                </button>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="নোটিশ অনুসন্ধান করুন..."
                  value={noticeSearch}
                  onChange={(e) => setNoticeSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-[#064E3B] font-bangla"
                />
              </div>
            </div>

            {/* Notices Structured List */}
            <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 shadow-xs">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 sm:p-5 hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      {/* Zero-Pill unboxed metadata */}
                      <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 font-bangla">
                        <span className="text-[#064E3B] dark:text-emerald-400 font-bold">{notice.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{notice.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{notice.publishedBy}</span>
                      </div>

                      <h3
                        onClick={() => setSelectedNotice(notice)}
                        className="text-sm sm:text-base font-bold font-bangla text-stone-900 dark:text-stone-100 hover:text-[#064E3B] dark:hover:text-emerald-400 cursor-pointer transition-colors"
                      >
                        {notice.title}
                      </h3>

                      <p className="text-xs text-stone-700 dark:text-stone-300 line-clamp-1 font-bangla">
                        {notice.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setSelectedNotice(notice)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#064E3B] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded border border-emerald-700/20 dark:border-emerald-700/60 transition-colors font-bangla cursor-pointer"
                      >
                        বিস্তারিত দেখুন
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-stone-500 dark:text-stone-400 font-bangla text-sm">
                  কোনো নোটিশ পাওয়া যায়নি। অন্য কিওয়ার্ড দিয়ে অনুসন্ধান করুন।
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Result-Checking Portal Mock */}
        {activeTab === 'results' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
            {/* Search Box Card */}
            <div className="bg-[#FAF9F5] dark:bg-stone-900 p-6 sm:p-8 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold font-bangla text-stone-900 dark:text-stone-100">
                  শিক্ষার্থী ফলাফল অনুসন্ধান (Student Result Portal)
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-bangla mt-1">
                  রোল নম্বর এবং পরীক্ষার নাম নির্বাচন করে ফলাফল ও গ্রেডশিট দেখুন
                </p>
              </div>

              <form onSubmit={handleResultSearch} className="space-y-4 font-bangla">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      পরীক্ষার নাম (Select Examination)
                    </label>
                    <select
                      value={examSelection}
                      onChange={(e) => setExamSelection(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    >
                      <option value="annual">বার্ষিক মূল্যায়ন পরীক্ষা ২০২৬</option>
                      <option value="half_yearly">অর্ধবার্ষিক পরীক্ষা ২০২৬</option>
                      <option value="hifz_eval">হিফজ সমাপনী ও লাহজ পরীক্ষা</option>
                      <option value="noorani_board">নূরানী বোর্ড কেন্দ্রীয় পরীক্ষা</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      রোল বা রেজিস্ট্রেশন নম্বর (Roll / ID)
                    </label>
                    <input
                      type="text"
                      value={rollInput}
                      onChange={(e) => setRollInput(e.target.value)}
                      placeholder="যেমন: 101"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    />
                  </div>
                </div>

                {/* Quick Demo Roll helper buttons */}
                <div className="flex items-center gap-2 pt-1 flex-wrap text-xs text-stone-600 dark:text-stone-400">
                  <span>নমুনা রোল ক্লিক করুন:</span>
                  {Object.keys(results).slice(0, 5).map((demo) => (
                    <button
                      key={demo}
                      type="button"
                      onClick={() => {
                        setRollInput(demo);
                        setSearchedResult(results[demo] || null);
                        setResultError(null);
                      }}
                      className="px-2 py-0.5 rounded bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-[#064E3B] dark:text-emerald-400 font-mono text-xs font-medium cursor-pointer"
                    >
                      রোল {demo}
                    </button>
                  ))}
                </div>

                {resultError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resultError}</span>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={isSearchingResult}
                    className="px-8 py-2.5 bg-[#064E3B] hover:bg-[#043d2e] text-white text-xs sm:text-sm font-semibold rounded-md shadow-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-amber-300" />
                    <span>{isSearchingResult ? 'অনুসন্ধান চলছে...' : 'ফলাফল অনুসন্ধান করুন'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Result Marksheet Display Card */}
            {searchedResult && (
              <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden font-bangla">
                {/* Result Card Header */}
                <div className="bg-[#064E3B] text-white p-6 border-b border-emerald-900 text-center">
                  <div className="text-xs font-arabic text-amber-300 mb-0.5">
                    {MADRASAH_INFO.arabicVerse}
                  </div>
                  <h4 className="text-xl font-bold font-bangla">
                    {MADRASAH_INFO.name}
                  </h4>
                  <div className="text-xs text-emerald-200 font-sans mt-0.5">
                    {searchedResult.examName} · শিক্ষাবর্ষ: {searchedResult.session}
                  </div>
                  <div className="mt-3 inline-block px-3 py-1 bg-white/10 rounded border border-white/20 text-xs font-semibold text-amber-200">
                    একাডেমিক নম্বরপত্র (Official Academic Transcript)
                  </div>
                </div>

                {/* Student Info Grid */}
                <div className="p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-stone-500 dark:text-stone-400 block">শিক্ষার্থীর নাম:</span>
                    <strong className="text-stone-900 dark:text-stone-100 text-sm">{searchedResult.name}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-stone-400 block">পিতার নাম:</span>
                    <strong className="text-stone-800 dark:text-stone-200">{searchedResult.fatherName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-stone-400 block">রোল ও আইডি:</span>
                    <strong className="font-mono text-stone-900 dark:text-stone-100">{searchedResult.roll} ({searchedResult.registrationNo})</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-stone-400 block">শিক্ষা বিভাগ:</span>
                    <strong className="text-[#064E3B] dark:text-emerald-400 font-semibold">{searchedResult.department}</strong>
                  </div>
                </div>

                {/* Subject Marksheet Table */}
                <div className="p-6">
                  <h5 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-3">
                    বিষয়ভিত্তিক নম্বর ও গ্রেড বিবরণী:
                  </h5>
                  <div className="border border-stone-200 dark:border-stone-700 rounded overflow-hidden">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-stone-100 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold">
                          <th className="py-2.5 px-3">ক্রম</th>
                          <th className="py-2.5 px-3">বিষয়ের নাম</th>
                          <th className="py-2.5 px-3 text-right">পূর্ণমান</th>
                          <th className="py-2.5 px-3 text-right">প্রাপ্ত নম্বর</th>
                          <th className="py-2.5 px-3 text-center">গ্রেড</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {searchedResult.subjects.map((sub, idx) => (
                          <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                            <td className="py-2 px-3 text-stone-500 dark:text-stone-400 font-mono">{idx + 1}</td>
                            <td className="py-2 px-3 font-semibold text-stone-900 dark:text-stone-100">{sub.subjectName}</td>
                            <td className="py-2 px-3 text-right font-mono tabular-nums text-stone-700 dark:text-stone-300">{sub.fullMarks}</td>
                            <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-[#064E3B] dark:text-emerald-400">{sub.obtainedMarks}</td>
                            <td className="py-2 px-3 text-center font-bold text-amber-700 dark:text-amber-400">{sub.gradeLetter}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-700 font-bold text-xs sm:text-sm">
                          <td colSpan={2} className="py-3 px-3 text-stone-900 dark:text-stone-100">
                            সর্বমোট ফলাফল
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums text-stone-800 dark:text-stone-200">
                            {searchedResult.totalMarks}
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-[#064E3B] dark:text-emerald-400">
                            {searchedResult.obtainedMarks} ({searchedResult.percentage}%)
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-800 dark:text-emerald-400">
                            {searchedResult.grade}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Summary Badges & Office Endorsement */}
                  <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs">
                    <div>
                      <span className="text-stone-600 dark:text-stone-400">ফলাফল মূল্যায়ন:</span>{' '}
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {searchedResult.resultStatus} — {searchedResult.grade}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043d2e] rounded transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-300" />
                        <span>নম্বরপত্র প্রিন্ট করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notice Detail Reader Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-lg max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative font-bangla space-y-4">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Zero-Pill unboxed metadata */}
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="text-[#064E3B] dark:text-emerald-400 font-bold">{selectedNotice.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{selectedNotice.date}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedNotice.publishedBy}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
              {selectedNotice.title}
            </h3>

            <div className="text-stone-800 dark:text-stone-200 text-sm leading-relaxed p-4 bg-stone-50 dark:bg-stone-800/70 rounded border border-stone-200 dark:border-stone-700">
              {selectedNotice.content}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800">
              <span>{MADRASAH_INFO.name}, ফতেয়াবাদ, চট্টগ্রাম</span>
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-1.5 bg-[#064E3B] text-white rounded font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
