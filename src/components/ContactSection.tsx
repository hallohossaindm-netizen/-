import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, ExternalLink, HelpCircle } from 'lucide-react';
import { MADRASAH_INFO, FAQS } from '../data/madrasahData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMessage('অনুগ্রহ করে নাম, ফোন নম্বর এবং আপনার বার্তা লিখুন।');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 400);
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-[#064E3B] dark:text-emerald-400 font-semibold">
            যোগাযোগ ও অনুসন্ধান
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bangla text-stone-900 dark:text-stone-100 mt-2">
            আমাদের সাথে যোগাযোগ করুন
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm font-bangla mt-3">
            ভর্তি তথ্য, ক্যাম্পাসে সাক্ষাৎ অথবা যেকোনো পরামর্শের জন্য সরাসরি কল করুন বা বার্তা পাঠান।
          </p>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Contact Cards & Campus Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FAF9F5] dark:bg-stone-900 p-6 sm:p-8 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 font-bangla">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-3">
                মাদ্রাসার ঠিকানা ও হটলাইন
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-950 text-[#064E3B] dark:text-emerald-400 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">ক্যাম্পাস অবস্থান (সঠিক ঠিকানা):</span>
                    <span className="text-stone-700 dark:text-stone-200 font-medium leading-relaxed block">{MADRASAH_INFO.address}</span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 block">সন্দীপ কলোনি, ১নং ওয়ার্ড, ফতেয়াবাদ ৪৩৩৫, চট্টগ্রাম</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-950 text-[#064E3B] dark:text-emerald-400 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">প্রধান যোগাযোগ ও হেল্পলাইন:</span>
                    <a href={`tel:${MADRASAH_INFO.contactNumber}`} className="text-[#064E3B] dark:text-emerald-400 font-mono text-base font-bold hover:underline block">
                      {MADRASAH_INFO.contactNumber}
                    </a>
                    <span className="text-xs text-stone-500 dark:text-stone-400">ভর্তি, পরীক্ষা ও জরুরি অনুসন্ধান</span>
                  </div>
                </div>

                {/* Education Director Direct Contact Highlight */}
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">শিক্ষা পরিচালক:</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 font-semibold">সরাসরি যোগাযোগ</span>
                  </div>
                  <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">{MADRASAH_INFO.educationDirector.name}</div>
                  <div className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">পড়াশোনা, সিলেবাস ও ভর্তি পরামর্শের জন্য কল করুন</div>
                  <a
                    href={`tel:${MADRASAH_INFO.educationDirector.phone}`}
                    className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-[#064E3B] hover:bg-emerald-900 text-white rounded text-xs font-bold transition-colors font-mono shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{MADRASAH_INFO.educationDirector.phone}</span>
                  </a>
                </div>

                {/* Leadership Strip */}
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-xs space-y-1.5 text-stone-600 dark:text-stone-400">
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">প্রতিষ্ঠাতা: </span>
                    <span>{MADRASAH_INFO.founder.name}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">বর্তমান পরিচালক: </span>
                    <span>{MADRASAH_INFO.currentDirector.name} ({MADRASAH_INFO.currentDirector.relation})</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-950 text-[#064E3B] dark:text-emerald-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">অফিস সময়সূচী:</span>
                    <span className="text-stone-600 dark:text-stone-300">{MADRASAH_INFO.officeHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Integration */}
            <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs font-bangla font-semibold text-stone-700 dark:text-stone-200">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#064E3B] dark:text-emerald-400" />
                  <span>গুগল ম্যাপে মাদ্রাসার অবস্থান (ফতেয়াবাদ, চট্টগ্রাম)</span>
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Fateyabad, Chittagong, Bangladesh')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#064E3B] hover:underline inline-flex items-center gap-1"
                >
                  <span>ম্যাপ অ্যাপে খুলুন</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative aspect-[16/9] bg-stone-200">
                {/* Styled Map frame pointing to Fateyabad, Chittagong */}
                <iframe
                  title="Google Map Location Fateyabad Chittagong"
                  className="w-full h-full border-0"
                  src="https://maps.google.com/maps?q=Fateyabad,%20Chattogram,%20Bangladesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Inquiry Form */}
          <div className="lg:col-span-7 bg-[#FAF9F5] dark:bg-stone-900 p-6 sm:p-8 lg:p-10 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs font-bangla">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                সরাসরি বার্তা ও জিজ্ঞাসা পাঠান (Direct Inquiry)
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1">
                আপনার যেকোনো প্রশ্ন বা মতামত নিচের ফরমে লিখে পাঠান। আমাদের দায়িত্বপ্রাপ্ত কর্মকর্তা দ্রুত উত্তর দেবেন।
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-white dark:bg-stone-800/80 rounded-lg border border-emerald-300 dark:border-emerald-700 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  আলহামদুলিল্লাহ! আপনার বার্তাটি গৃহীত হয়েছে।
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                  তালিমুল কুরআন মহিলা মাদ্রাসার সাথে যোগাযোগের জন্য আন্তরিক ধন্যবাদ। আমাদের দপ্তর থেকে অতিসত্বর আপনার সাথে যোগাযোগ করা হবে।
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043d2e] rounded transition-colors cursor-pointer"
                >
                  অন্য বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                {errorMessage && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      আপনার নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="নাম লিখুন"
                      className="w-full px-3.5 py-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="01712345678"
                      className="w-full px-3.5 py-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      ইমেইল ঠিকানা (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@mail.com"
                      className="w-full px-3.5 py-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      জিজ্ঞাসার বিষয় (Subject)
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    >
                      <option value="">বিষয় নির্বাচন করুন</option>
                      <option value="admission">ভর্তি সংক্রান্ত তথ্য</option>
                      <option value="hostel">হোস্টেল ও আবাসিক ফি</option>
                      <option value="donation">সাদাকাহ ও অনুদান প্রদান</option>
                      <option value="other">সাধারণ জিজ্ঞাসা</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    আপনার বার্তা বা প্রশ্ন <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="আপনার প্রশ্ন বা মতামত বিস্তারিত লিখুন..."
                    className="w-full px-3.5 py-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#064E3B] hover:bg-[#043d2e] text-white font-semibold rounded-md shadow-sm transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'বার্তা পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Frequently Asked Questions (FAQ) Section */}
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>সাধারণ প্রশ্নোত্তর</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-bangla text-stone-900 dark:text-stone-100 mt-1">
              অভিভাবকদের সচরাচর জিজ্ঞাসিত প্রশ্ন
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-stone-50 dark:bg-stone-900/80 p-5 rounded-lg border border-stone-200 dark:border-stone-800 space-y-2 font-bangla">
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-start gap-2">
                  <span className="text-[#064E3B] dark:text-emerald-400 font-bold">প্র:</span>
                  <span>{faq.question}</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
