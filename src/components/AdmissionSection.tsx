import React, { useState } from 'react';
import { FileText, CheckCircle, Printer, X, Download, AlertCircle, Info, Calendar } from 'lucide-react';
import { ADMISSION_REQUIREMENTS, MADRASAH_INFO } from '../data/madrasahData';
import { AdmissionFormData, DepartmentId } from '../types';
import { useMadrasah } from '../context/MadrasahContext';

export const AdmissionSection: React.FC = () => {
  const { submitApplication } = useMadrasah();
  const [formData, setFormData] = useState<AdmissionFormData>({
    studentName: '',
    studentNameEn: '',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    dateOfBirth: '',
    bloodGroup: 'A+',
    presentAddress: '',
    permanentAddress: '',
    departmentChoice: 'hifz',
    residentType: 'residential',
    guardianMobile: '',
    guardianAlternateMobile: '',
    previousInstitute: '',
    agreement: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AdmissionFormData, string>>>({});
  const [submittedApplication, setSubmittedApplication] = useState<{
    appId: string;
    submittedAt: string;
    data: AdmissionFormData;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Partial<Record<keyof AdmissionFormData, string>> = {};
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'শিক্ষার্থীর পূর্ণ নাম লিখুন';
    }
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = 'পিতার নাম আবশ্যক';
    }
    if (!formData.motherName.trim()) {
      newErrors.motherName = 'মাতার নাম আবশ্যক';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'জন্ম তারিখ নির্বাচন করুন';
    }
    if (!formData.presentAddress.trim()) {
      newErrors.presentAddress = 'বর্তমান ঠিকানা লিখুন';
    }
    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = 'স্থায়ী ঠিকানা লিখুন';
    }
    if (!formData.departmentChoice) {
      newErrors.departmentChoice = 'কাঙ্ক্ষিত বিভাগ নির্বাচন করুন';
    }
    if (!formData.guardianMobile.trim()) {
      newErrors.guardianMobile = 'অভিভাবকের সক্রিয় মোবাইল নম্বর দিন';
    } else if (!/^01[3-9]\d{8}$/.test(formData.guardianMobile.replace(/\s+/g, ''))) {
      newErrors.guardianMobile = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)';
    }
    if (!formData.agreement) {
      newErrors.agreement = 'মাদ্রাসার নিয়মাবলী মেনে নেওয়ার অঙ্গীকার করুন';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newApp = submitApplication(formData);
      setSubmittedApplication({
        appId: newApp.id,
        submittedAt: newApp.submittedAt,
        data: newApp.data,
      });
      setIsSubmitting(false);
    }, 400);
  };

  const getDepartmentLabel = (id: DepartmentId | '') => {
    switch (id) {
      case 'noorani':
        return 'মক্তব ও নূরানী বিভাগ';
      case 'nazera':
        return 'নাজেরা বিভাগ';
      case 'hifz':
        return 'হিফজুল কুরআন বিভাগ';
      case 'kitab':
        return 'কিতাব বিভাগ (শরীয়াহ ও হাদীস)';
      default:
        return 'সাধারণ বিভাগ';
    }
  };

  return (
    <section id="admission" className="py-16 lg:py-24 bg-[#FAF9F5] dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-[#064E3B] dark:text-emerald-400 font-semibold">
            নতুন শিক্ষাবর্ষে ভর্তি
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bangla text-stone-900 dark:text-stone-100 mt-2">
            অনলাইন ভর্তি ও নির্দেশিকা
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm font-bangla mt-3">
            সহজেই ঘরে বসে আপনার কন্যার প্রাথমিক ভর্তি ফরম পূরণ করুন এবং ডিজিটাল আবেদন স্লিপ সংগ্রহ করুন।
          </p>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4" />
        </div>

        {/* Admission Guidelines & Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {ADMISSION_REQUIREMENTS.map((req, idx) => (
            <div key={idx} className="bg-white dark:bg-stone-900 p-6 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold font-bangla text-base">
                <Info className="w-4 h-4 text-[#064E3B] dark:text-emerald-400" />
                <h3>{req.title}</h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-bangla">
                {req.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Clean Online Admission Form */}
        <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="bg-[#064E3B] text-white px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-900">
            <div>
              <h3 className="text-lg font-bold font-bangla">
                অনলাইন ভর্তি আবেদন ফরম (Online Admission Form)
              </h3>
              <p className="text-xs text-emerald-200 font-bangla">
                সকল তথ্য যথাযথভাবে বাংলায় অথবা ইংরেজিতে পূরণ করুন
              </p>
            </div>
            <div className="text-xs bg-emerald-900/60 text-amber-300 px-3 py-1 rounded font-bangla">
              সেশন: ১৪৪৭-৪৮ হিজরী / ২০২৬-২৭
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10 space-y-8 font-bangla">
            {/* Section 1: Student Information */}
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider pb-2 border-b border-stone-200 dark:border-stone-800 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#064E3B] dark:text-emerald-400" />
                <span>১. শিক্ষার্থীর ব্যক্তিগত বিবরণ</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    শিক্ষার্থীর পূর্ণ নাম (বাংলায়) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="উদা: খাদিজা তাসনিম"
                    className={`w-full px-3.5 py-2 text-sm rounded border ${
                      errors.studentName
                        ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500'
                    } focus:outline-none focus:ring-2 focus:ring-[#064E3B]`}
                  />
                  {errors.studentName && (
                    <p className="text-red-600 dark:text-red-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.studentName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    শিক্ষার্থীর নাম (ইংরেজিতে - বড় অক্ষরে)
                  </label>
                  <input
                    type="text"
                    value={formData.studentNameEn}
                    onChange={(e) => setFormData({ ...formData, studentNameEn: e.target.value })}
                    placeholder="KHADIJA TASNIM"
                    className="w-full px-3.5 py-2 text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    জন্ম তারিখ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className={`w-full px-3.5 py-2 text-sm rounded border ${
                      errors.dateOfBirth
                        ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                    } focus:outline-none focus:ring-2 focus:ring-[#064E3B]`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-600 dark:text-red-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    রক্তের গ্রুপ (Blood Group)
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <option value="A+">A+ (পজিটিভ)</option>
                    <option value="A-">A- (নেগেটিভ)</option>
                    <option value="B+">B+ (পজিটিভ)</option>
                    <option value="B-">B- (নেগেটিভ)</option>
                    <option value="O+">O+ (পজিটিভ)</option>
                    <option value="O-">O- (নেগেটিভ)</option>
                    <option value="AB+">AB+ (পজিটিভ)</option>
                    <option value="AB-">AB- (নেগেটিভ)</option>
                    <option value="অজানা">জানা নেই</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    কাঙ্ক্ষিত শিক্ষা বিভাগ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.departmentChoice}
                    onChange={(e) => setFormData({ ...formData, departmentChoice: e.target.value as DepartmentId })}
                    className={`w-full px-3.5 py-2 text-sm rounded border ${
                      errors.departmentChoice ? 'border-red-400' : 'border-stone-300 dark:border-stone-700'
                    } bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#064E3B]`}
                  >
                    <option value="nazera">নাজেরা বিভাগ (তাজবীদ ও সহীহ তিলাওয়াত)</option>
                    <option value="hifz">হিফজুল কুরআন বিভাগ (পূর্ণাঙ্গ হিফজ)</option>
                    <option value="kitab">কিতাব বিভাগ (মিজান থেকে দাওরায়ে হাদীস)</option>
                    <option value="noorani">মক্তব ও নূরানী বিভাগ (প্রাথমিক বুনিয়াদ)</option>
                  </select>
                  {errors.departmentChoice && (
                    <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.departmentChoice}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    আবাসিক নাকি অনাবাসিক? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4 pt-1.5">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-800 dark:text-stone-200">
                      <input
                        type="radio"
                        name="residentType"
                        checked={formData.residentType === 'residential'}
                        onChange={() => setFormData({ ...formData, residentType: 'residential' })}
                        className="text-[#064E3B] focus:ring-[#064E3B]"
                      />
                      <span>আবাসিক (হোস্টেল)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-800 dark:text-stone-200">
                      <input
                        type="radio"
                        name="residentType"
                        checked={formData.residentType === 'non_residential'}
                        onChange={() => setFormData({ ...formData, residentType: 'non_residential' })}
                        className="text-[#064E3B] focus:ring-[#064E3B]"
                      />
                      <span>অনাবাসিক (ডে-কেয়ার)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Parents & Guardian Information */}
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider pb-2 border-b border-stone-200 dark:border-stone-800 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#064E3B] dark:text-emerald-400" />
                <span>২. পিতা, মাতা ও অভিভাবকের তথ্য</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    পিতার পূর্ণ নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="পিতার নাম লিখুন"
                    className={`w-full px-3.5 py-2 text-sm rounded border ${
                      errors.fatherName
                        ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500'
                    } focus:outline-none focus:ring-2 focus:ring-[#064E3B]`}
                  />
                  {errors.fatherName && (
                    <p className="text-red-600 dark:text-red-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fatherName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    মাতার পূর্ণ নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    placeholder="মাতার নাম লিখুন"
                    className={`w-full px-3.5 py-2 text-sm rounded border ${
                      errors.motherName
                        ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500'
                    } focus:outline-none focus:ring-2 focus:ring-[#064E3B]`}
                  />
                  {errors.motherName && (
                    <p className="text-red-600 dark:text-red-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.motherName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    পিতা/অভিভাবকের পেশা
                  </label>
                  <input
                    type="text"
                    value={formData.fatherOccupation}
                    onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                    placeholder="উদা: শিক্ষক / ব্যবসায়ী / প্রবাসী"
                    className="w-full px-3.5 py-2 text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    অভিভাবকের মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.guardianMobile}
                    onChange={(e) => setFormData({ ...formData, guardianMobile: e.target.value })}
                    placeholder="01712345678"
                    className={`w-full px-3.5 py-2 text-sm rounded border ${
                      errors.guardianMobile
                        ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500'
                    } focus:outline-none focus:ring-2 focus:ring-[#064E3B]`}
                  />
                  {errors.guardianMobile && (
                    <p className="text-red-600 dark:text-red-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.guardianMobile}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    বিকল্প মোবাইল নম্বর (জরুরি যোগাযোগের জন্য)
                  </label>
                  <input
                    type="tel"
                    value={formData.guardianAlternateMobile}
                    onChange={(e) => setFormData({ ...formData, guardianAlternateMobile: e.target.value })}
                    placeholder="01819876543"
                    className="w-full px-3.5 py-2 text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    পূর্ববর্তী শিক্ষা প্রতিষ্ঠান (যদি থাকে)
                  </label>
                  <input
                    type="text"
                    value={formData.previousInstitute}
                    onChange={(e) => setFormData({ ...formData, previousInstitute: e.target.value })}
                    placeholder="পূর্বের মাদ্রাসার বা স্কুলের নাম"
                    className="w-full px-3.5 py-2 text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Address Information */}
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider pb-2 border-b border-stone-200 dark:border-stone-800 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#064E3B] dark:text-emerald-400" />
                <span>৩. ঠিকানার বিবরণ</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    বর্তমান ঠিকানা (Present Address) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.presentAddress}
                    onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                    placeholder="বাড়ি নং, রোড, গ্রাম/মহল্লা, থানা, জেলা"
                    className={`w-full px-3.5 py-2 text-sm rounded border ${
                      errors.presentAddress
                        ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500'
                    } focus:outline-none focus:ring-2 focus:ring-[#064E3B]`}
                  />
                  {errors.presentAddress && (
                    <p className="text-red-600 dark:text-red-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.presentAddress}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                      স্থায়ী ঠিকানা (Permanent Address) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, permanentAddress: formData.presentAddress })}
                      className="text-[11px] text-[#064E3B] dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      বর্তমান ঠিকানার অনুরূপ
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.permanentAddress}
                    onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                    placeholder="গ্রাম, ডাকঘর, থানা/উপজেলা, জেলা"
                    className={`w-full px-3.5 py-2 text-sm rounded border ${
                      errors.permanentAddress
                        ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500'
                    } focus:outline-none focus:ring-2 focus:ring-[#064E3B]`}
                  />
                  {errors.permanentAddress && (
                    <p className="text-red-600 dark:text-red-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.permanentAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Declaration & Submission */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreement}
                  onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
                  className="mt-1 text-[#064E3B] rounded focus:ring-[#064E3B]"
                />
                <span className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  আমি এই মর্মে অঙ্গীকার করছি যে, উপরে প্রদত্ত সকল তথ্য সম্পূর্ণ সত্য ও সঠিক। আমার কন্যা তালিমুল কুরআন মহিলা মাদ্রাসার শৃঙ্খলা, ইসলামী আদব ও হোস্টেল বিধিবিধান আন্তরিকতার সাথে মেনে চলবে।
                </span>
              </label>
              {errors.agreement && (
                <p className="text-red-600 dark:text-red-400 text-[11px] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.agreement}
                </p>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>আবেদন জমা দেওয়ার সাথে সাথে আপনি একটি ডাউনলোডযোগ্য প্রিন্ট স্লিপ পাবেন।</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#064E3B] hover:bg-[#043d2e] text-white font-semibold text-sm rounded-md transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>আবেদন প্রক্রিয়াধীন...</span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-amber-300" />
                      <span>অনলাইন ভর্তি ফরম জমা দিন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Official Admission Slip Modal */}
      {submittedApplication && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-lg max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative my-8 font-bangla">
            {/* Modal Close Button (no-print) */}
            <button
              onClick={() => setSubmittedApplication(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 no-print cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Admission Slip Body */}
            <div id="printable-admission-slip" className="space-y-6">
              {/* Slip Header */}
              <div className="text-center pb-4 border-b-2 border-stone-800 dark:border-stone-600">
                <div className="text-xs uppercase tracking-widest text-[#064E3B] dark:text-emerald-400 font-bold">
                  {MADRASAH_INFO.arabicVerse}
                </div>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {MADRASAH_INFO.name}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-sans mt-0.5">
                  {MADRASAH_INFO.address} · হেল্পলাইন: {MADRASAH_INFO.phonePrimary}
                </p>
                <div className="inline-block mt-3 px-4 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-bold rounded uppercase">
                  অনলাইন প্রাথমিক ভর্তি আবেদন স্লিপ (Student Application Slip)
                </div>
              </div>

              {/* Application Key Info Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded border border-stone-200 dark:border-stone-700 text-xs">
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block">আবেদন নম্বর (App ID):</span>
                  <strong className="font-mono text-sm text-[#064E3B] dark:text-emerald-400">{submittedApplication.appId}</strong>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block">জমা দেওয়ার তারিখ:</span>
                  <strong className="text-stone-800 dark:text-stone-200">{submittedApplication.submittedAt}</strong>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block">আবেদনের ধরন:</span>
                  <strong className="text-stone-800 dark:text-stone-200">
                    {submittedApplication.data.residentType === 'residential' ? 'আবাসিক' : 'অনাবাসিক'}
                  </strong>
                </div>
              </div>

              {/* Student Detail Rows */}
              <div className="border border-stone-200 dark:border-stone-700 rounded divide-y divide-stone-100 dark:divide-stone-800 text-xs sm:text-sm">
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-stone-500 dark:text-stone-400">শিক্ষার্থীর নাম:</span>
                  <span className="col-span-2 font-bold text-stone-900 dark:text-stone-100">
                    {submittedApplication.data.studentName} {submittedApplication.data.studentNameEn ? `(${submittedApplication.data.studentNameEn})` : ''}
                  </span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-stone-500 dark:text-stone-400">পিতার নাম:</span>
                  <span className="col-span-2 text-stone-800 dark:text-stone-200">{submittedApplication.data.fatherName}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-stone-500 dark:text-stone-400">মাতার নাম:</span>
                  <span className="col-span-2 text-stone-800 dark:text-stone-200">{submittedApplication.data.motherName}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-stone-500 dark:text-stone-400">জন্ম তারিখ ও রক্তের গ্রুপ:</span>
                  <span className="col-span-2 text-stone-800 dark:text-stone-200 font-mono">
                    {submittedApplication.data.dateOfBirth} · গ্রুপ: {submittedApplication.data.bloodGroup}
                  </span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-stone-500 dark:text-stone-400">কাঙ্ক্ষিত বিভাগ:</span>
                  <span className="col-span-2 font-bold text-emerald-800 dark:text-emerald-400">
                    {getDepartmentLabel(submittedApplication.data.departmentChoice)}
                  </span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-stone-500 dark:text-stone-400">অভিভাবকের মোবাইল:</span>
                  <span className="col-span-2 font-mono text-stone-900 dark:text-stone-100">{submittedApplication.data.guardianMobile}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-stone-500 dark:text-stone-400">বর্তমান ঠিকানা:</span>
                  <span className="col-span-2 text-stone-700 dark:text-stone-300">{submittedApplication.data.presentAddress}</span>
                </div>
              </div>

              {/* Office Instructions */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-3.5 rounded text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                  <span>গুরুত্বপূর্ণ নির্দেশনা:</span>
                </div>
                <p>
                  ১. এই স্লিপটি প্রিন্ট করে সংরক্ষণ করুন এবং মৌখিক সাক্ষাতকারের দিন সাথে নিয়ে আসবেন।
                </p>
                <p>
                  ২. শিক্ষার্থীর জন্ম নিবন্ধনের ফটোকপি ও ২ কপি পাসপোর্ট সাইজ ছবি সাথে আনতে হবে।
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-center border-t border-dashed border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                <div>
                  <div className="w-32 border-b border-stone-400 dark:border-stone-500 mx-auto mb-1" />
                  <span>অভিভাবকের স্বাক্ষর</span>
                </div>
                <div>
                  <div className="w-32 border-b border-stone-400 dark:border-stone-500 mx-auto mb-1" />
                  <span>ভর্তি শাখা ও অফিস সিল</span>
                </div>
              </div>
            </div>

            {/* Modal Actions (no-print) */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3 no-print">
              <button
                type="button"
                onClick={() => setSubmittedApplication(null)}
                className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043d2e] rounded transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>স্লিপ প্রিন্ট করুন (Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
