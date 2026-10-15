import React, { useState } from 'react';
import {
  X,
  LogOut,
  Bell,
  Award,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Printer,
  ChevronRight,
  Eye,
  Key,
  RefreshCw,
  Phone,
  Calendar,
  BookOpen,
  Filter,
  Check,
  ShieldCheck,
  Building,
  GraduationCap
} from 'lucide-react';
import { useMadrasah } from '../../context/MadrasahContext';
import { NoticeItem, StudentResult, AdmissionApplication, AdmissionStatus, DepartmentId } from '../../types';
import { MADRASAH_INFO } from '../../data/madrasahData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const {
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    results,
    addOrUpdateResult,
    deleteResult,
    applications,
    updateApplicationStatus,
    deleteApplication,
    logoutAdmin,
    changeAdminPassword,
    resetAllData,
    adminUsername,
    hasCustomPassword
  } = useMadrasah();

  const [activeTab, setActiveTab] = useState<'admissions' | 'notices' | 'results' | 'settings'>('admissions');

  // Admissions state
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<'all' | AdmissionStatus>('all');
  const [appDeptFilter, setAppDeptFilter] = useState<'all' | DepartmentId>('all');
  const [selectedAppForView, setSelectedAppForView] = useState<AdmissionApplication | null>(null);

  // Notices state
  const [noticeSearch, setNoticeSearch] = useState('');
  const [isNoticeFormOpen, setIsNoticeFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [noticeFormData, setNoticeFormData] = useState({
    title: '',
    category: 'general' as NoticeItem['category'],
    categoryLabel: 'সাধারণ নোটিশ',
    date: '১৪ অক্টোবর ২০২৬',
    publishedBy: 'মুহতামিম দফতর',
    content: '',
    isImportant: false,
  });

  // Results state
  const [resultSearch, setResultSearch] = useState('');
  const [isResultFormOpen, setIsResultFormOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<StudentResult | null>(null);
  const [resultFormData, setResultFormData] = useState<StudentResult>({
    roll: '',
    registrationNo: '',
    name: '',
    fatherName: '',
    department: 'কিতাব বিভাগ (দাওরায়ে হাদীস)',
    examName: 'বার্ষিক মূল্যায়ন পরীক্ষা ২০২৬',
    session: '২০২৫-২০২৬',
    totalMarks: 500,
    obtainedMarks: 450,
    percentage: 90,
    grade: 'মুমতাজ (A+)',
    resultStatus: 'উত্তীর্ণ',
    subjects: [
      { subjectName: 'সহীহুল বুখারী ও হাদীস শাস্ত্র', fullMarks: 100, obtainedMarks: 95, gradeLetter: 'A+' },
      { subjectName: 'ফিকহ ও উসূলে ফিকহ', fullMarks: 100, obtainedMarks: 90, gradeLetter: 'A+' },
      { subjectName: 'তাফসীরুল কুরআন', fullMarks: 100, obtainedMarks: 92, gradeLetter: 'A+' },
      { subjectName: 'আরবী ব্যাকরণ ও সাহিত্য', fullMarks: 100, obtainedMarks: 88, gradeLetter: 'A' },
      { subjectName: 'ইসলামী ইতিহাস ও সাধারণ জ্ঞান', fullMarks: 100, obtainedMarks: 85, gradeLetter: 'A' },
    ],
    muhtamimSignatureDate: '১৪ অক্টোবর ২০২৬',
  });

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  if (!isOpen) return null;

  // Filtered Admissions
  const filteredApps = applications.filter((app) => {
    const matchesStatus = appStatusFilter === 'all' || app.status === appStatusFilter;
    const matchesDept = appDeptFilter === 'all' || app.data.departmentChoice === appDeptFilter;
    const q = appSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.id.toLowerCase().includes(q) ||
      app.data.studentName.toLowerCase().includes(q) ||
      app.data.studentNameEn.toLowerCase().includes(q) ||
      app.data.guardianMobile.includes(q);
    return matchesStatus && matchesDept && matchesSearch;
  });

  // Filtered Notices
  const filteredNotices = notices.filter((n) => {
    const q = noticeSearch.toLowerCase().trim();
    return !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  // Filtered Results
  const resultList = Object.values(results);
  const filteredResults = resultList.filter((r) => {
    const q = resultSearch.toLowerCase().trim();
    return !q || r.roll.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
  });

  // KPI counts
  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;

  // Handle Notice Save
  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeFormData.title.trim() || !noticeFormData.content.trim()) {
      alert('অনুগ্রহ করে নোটিশের শিরোনাম ও বিস্তারিত বিবরণ লিখুন।');
      return;
    }

    let categoryLabel = 'সাধারণ নোটিশ';
    if (noticeFormData.category === 'admission') categoryLabel = 'ভর্তি বিজ্ঞপ্তি';
    else if (noticeFormData.category === 'exam') categoryLabel = 'পরীক্ষা';
    else if (noticeFormData.category === 'holiday') categoryLabel = 'ছুটি ও অনুষ্ঠান';

    if (editingNotice) {
      updateNotice(editingNotice.id, {
        ...noticeFormData,
        categoryLabel,
      });
      showToast('নোটিশ সফলভাবে আপডেট করা হয়েছে!');
    } else {
      addNotice({
        ...noticeFormData,
        categoryLabel,
      });
      showToast('নতুন নোটিশ সফলভাবে প্রকাশ করা হয়েছে!');
    }

    setIsNoticeFormOpen(false);
    setEditingNotice(null);
  };

  const openNewNoticeModal = () => {
    const now = new Date();
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const todayStr = `${now.getDate()} ${months[now.getMonth()]} ২০২৬`;

    setNoticeFormData({
      title: '',
      category: 'general',
      categoryLabel: 'সাধারণ নোটিশ',
      date: todayStr,
      publishedBy: 'অধ্যক্ষ / মুহতামিম দফতর',
      content: '',
      isImportant: false,
    });
    setEditingNotice(null);
    setIsNoticeFormOpen(true);
  };

  const openEditNoticeModal = (notice: NoticeItem) => {
    setEditingNotice(notice);
    setNoticeFormData({
      title: notice.title,
      category: notice.category,
      categoryLabel: notice.categoryLabel,
      date: notice.date,
      publishedBy: notice.publishedBy,
      content: notice.content,
      isImportant: notice.isImportant || false,
    });
    setIsNoticeFormOpen(true);
  };

  // Handle Result Save
  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultFormData.roll.trim() || !resultFormData.name.trim()) {
      alert('রোল এবং শিক্ষার্থীর নাম আবশ্যক।');
      return;
    }

    // Calculate marks and percentage
    const totalPossible = resultFormData.subjects.reduce((sum, s) => sum + (Number(s.fullMarks) || 0), 0) || 100;
    const totalObtained = resultFormData.subjects.reduce((sum, s) => sum + (Number(s.obtainedMarks) || 0), 0);
    const calculatedPercentage = parseFloat(((totalObtained / totalPossible) * 100).toFixed(1));

    let calculatedGrade: StudentResult['grade'] = 'মাকবুল (C)';
    if (calculatedPercentage >= 80) calculatedGrade = 'মুমতাজ (A+)';
    else if (calculatedPercentage >= 70) calculatedGrade = 'জায়্যিদ জিদ্দান (A)';
    else if (calculatedPercentage >= 60) calculatedGrade = 'জায়্যিদ (B)';

    const resultToSave: StudentResult = {
      ...resultFormData,
      roll: resultFormData.roll.trim(),
      totalMarks: totalPossible,
      obtainedMarks: totalObtained,
      percentage: calculatedPercentage,
      grade: calculatedGrade,
      resultStatus: calculatedPercentage >= 40 ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ',
    };

    addOrUpdateResult(resultToSave);
    showToast(`রোল ${resultToSave.roll}-এর ফলাফল সফলভাবে সংরক্ষিত হয়েছে!`);
    setIsResultFormOpen(false);
    setEditingResult(null);
  };

  const openNewResultModal = () => {
    setResultFormData({
      roll: '',
      registrationNo: `TQWM-2026-0${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      fatherName: '',
      department: 'কিতাব বিভাগ (দাওরায়ে হাদীস)',
      examName: 'বার্ষিক মূল্যায়ন পরীক্ষা ২০২৬',
      session: '২০২৫-২০২৬',
      totalMarks: 500,
      obtainedMarks: 450,
      percentage: 90,
      grade: 'মুমতাজ (A+)',
      resultStatus: 'উত্তীর্ণ',
      subjects: [
        { subjectName: 'সহীহুল বুখারী ও হাদীস শাস্ত্র', fullMarks: 100, obtainedMarks: 95, gradeLetter: 'A+' },
        { subjectName: 'ফিকহ ও উসূলে ফিকহ', fullMarks: 100, obtainedMarks: 90, gradeLetter: 'A+' },
        { subjectName: 'তাফসীরুল কুরআন', fullMarks: 100, obtainedMarks: 92, gradeLetter: 'A+' },
        { subjectName: 'আরবী ব্যাকরণ ও সাহিত্য', fullMarks: 100, obtainedMarks: 88, gradeLetter: 'A' },
      ],
      muhtamimSignatureDate: '১৪ অক্টোবর ২০২৬',
    });
    setEditingResult(null);
    setIsResultFormOpen(true);
  };

  const openEditResultModal = (res: StudentResult) => {
    setEditingResult(res);
    setResultFormData({ ...res });
    setIsResultFormOpen(true);
  };

  // Subject helpers for result form
  const handleSubjectChange = (index: number, field: string, value: any) => {
    const updated = [...resultFormData.subjects];
    updated[index] = { ...updated[index], [field]: value };
    // update grade letter automatically
    if (field === 'obtainedMarks' || field === 'fullMarks') {
      const full = Number(field === 'fullMarks' ? value : updated[index].fullMarks) || 100;
      const obt = Number(field === 'obtainedMarks' ? value : updated[index].obtainedMarks) || 0;
      const pct = (obt / full) * 100;
      let letter = 'F';
      if (pct >= 80) letter = 'A+';
      else if (pct >= 70) letter = 'A';
      else if (pct >= 60) letter = 'B';
      else if (pct >= 50) letter = 'C';
      else if (pct >= 40) letter = 'D';
      updated[index].gradeLetter = letter;
    }
    setResultFormData({ ...resultFormData, subjects: updated });
  };

  const addSubjectRow = () => {
    setResultFormData({
      ...resultFormData,
      subjects: [
        ...resultFormData.subjects,
        { subjectName: 'নতুন বিষয়', fullMarks: 100, obtainedMarks: 80, gradeLetter: 'A+' },
      ],
    });
  };

  const removeSubjectRow = (index: number) => {
    if (resultFormData.subjects.length <= 1) return;
    const updated = resultFormData.subjects.filter((_, i) => i !== index);
    setResultFormData({ ...resultFormData, subjects: updated });
  };

  // Change Password
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'নতুন পাসওয়ার্ড ও নিশ্চিতকরণ পাসওয়ার্ড মেলেনি।', isError: true });
      return;
    }
    const res = changeAdminPassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ text: res.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!', isError: false });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
    } else {
      setPasswordMsg({ text: res.message || 'ব্যর্থ হয়েছে!', isError: true });
    }
  };

  const getStatusBadge = (status: AdmissionStatus) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">বিবেচনাধীন</span>;
      case 'interview_selected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">সাক্ষাতকার নির্বাচিত</span>;
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">ভর্তি নিশ্চিত</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">বাতিল</span>;
    }
  };

  const getDepartmentLabel = (id: DepartmentId | '') => {
    switch (id) {
      case 'noorani': return 'মক্তব ও নূরানী';
      case 'nazera': return 'নাজেরা বিভাগ';
      case 'hifz': return 'হিফজুল কুরআন';
      case 'kitab': return 'কিতাব বিভাগ';
      default: return id || 'বিভাগ';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-6xl h-[94vh] max-h-[94vh] bg-[#FAF9F5] rounded-2xl shadow-2xl border border-stone-300 flex flex-col overflow-hidden">
        {/* Top Bar / Header */}
        <div className="bg-[#064E3B] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-900 border border-emerald-700/60 flex items-center justify-center text-amber-300 shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-bangla text-white">
                  প্রশাসনিক ড্যাশবোর্ড ও নিয়ন্ত্রণ প্যানেল
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] bg-emerald-800/80 text-amber-300 font-sans border border-emerald-700/50">
                  {adminUsername}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 font-bangla hidden sm:block">
                তালিমুল কুরআন মহিলা মাদ্রাসা • অনলাইন ভর্তি, নোটিশ ও ফলাফল নিয়ন্ত্রণ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-lg transition-colors border border-emerald-700/60 cursor-pointer"
              title="লগআউট করুন"
            >
              <LogOut className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline font-bangla">লগআউট</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-16 right-6 z-50 bg-[#064E3B] text-amber-300 px-4 py-2.5 rounded-lg shadow-xl border border-amber-400/40 text-xs sm:text-sm font-bangla flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('admissions')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all font-bangla flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'admissions'
                  ? 'bg-white text-[#064E3B] shadow-xs font-bold border border-stone-300'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-700" />
              <span>ভর্তি আবেদনসমূহ</span>
              {pendingAppsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-stone-900">
                  {pendingAppsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all font-bangla flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'notices'
                  ? 'bg-white text-[#064E3B] shadow-xs font-bold border border-stone-300'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Bell className="w-4 h-4 text-emerald-700" />
              <span>নোটিশ প্রকাশ</span>
              <span className="text-[11px] text-stone-500 font-sans">({notices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all font-bangla flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-white text-[#064E3B] shadow-xs font-bold border border-stone-300'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-700" />
              <span>পরীক্ষার ফলাফল</span>
              <span className="text-[11px] text-stone-500 font-sans">({resultList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all font-bangla flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white text-[#064E3B] shadow-xs font-bold border border-stone-300'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Settings className="w-4 h-4 text-emerald-700" />
              <span>পাসওয়ার্ড ও নিরাপত্তা</span>
            </button>
          </div>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF9F5]">
          {/* TAB 1: ADMISSIONS MANAGEMENT */}
          {activeTab === 'admissions' && (
            <div className="space-y-4">
              {/* Controls bar */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      placeholder="শিক্ষার্থীর নাম, আইডি বা মোবাইল দিয়ে খুঁজুন..."
                      className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B] font-bangla"
                    />
                  </div>

                  <select
                    value={appStatusFilter}
                    onChange={(e) => setAppStatusFilter(e.target.value as any)}
                    className="py-2 px-3 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-700 font-bangla focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <option value="all">সব স্ট্যাটাস ({applications.length})</option>
                    <option value="pending">বিবেচনাধীন ({applications.filter(a => a.status === 'pending').length})</option>
                    <option value="interview_selected">সাক্ষাতকার নির্বাচিত</option>
                    <option value="approved">ভর্তি নিশ্চিত</option>
                    <option value="rejected">বাতিল</option>
                  </select>

                  <select
                    value={appDeptFilter}
                    onChange={(e) => setAppDeptFilter(e.target.value as any)}
                    className="py-2 px-3 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-700 font-bangla focus:outline-none focus:ring-2 focus:ring-[#064E3B] hidden sm:block"
                  >
                    <option value="all">সব বিভাগ</option>
                    <option value="hifz">হিফজুল কুরআন</option>
                    <option value="nazera">নাজেরা বিভাগ</option>
                    <option value="kitab">কিতাব বিভাগ</option>
                    <option value="noorani">নূরানী বিভাগ</option>
                  </select>
                </div>

                <div className="text-xs text-stone-500 font-bangla flex items-center justify-between sm:justify-end gap-3">
                  <span>মোট প্রদর্শিত: <strong>{filteredApps.length}</strong> টি আবেদন</span>
                </div>
              </div>

              {/* Application List */}
              {filteredApps.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-stone-200">
                  <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h4 className="text-stone-700 font-bangla font-semibold">কোনো ভর্তি আবেদন পাওয়া যায়নি</h4>
                  <p className="text-xs text-stone-500 font-bangla mt-1">
                    সার্চ কুয়েরি পরিবর্তন করুন অথবা শিক্ষার্থীরা অনলাইন ফরম পূরণ করলে এখানে জমা হবে।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-4 rounded-xl border border-stone-200 hover:border-emerald-600/50 shadow-xs transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {app.id}
                          </span>
                          <span className="text-xs text-stone-400">•</span>
                          <span className="text-xs text-stone-500 font-bangla flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {app.submittedAt}
                          </span>
                          {getStatusBadge(app.status)}
                        </div>

                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-stone-900 font-bangla">
                            {app.data.studentName}
                          </h4>
                          {app.data.studentNameEn && (
                            <span className="text-xs text-stone-500 font-sans">
                              ({app.data.studentNameEn})
                            </span>
                          )}
                          <span className="text-xs text-stone-400">|</span>
                          <span className="text-xs text-stone-600 font-bangla">
                            পিতা: <strong>{app.data.fatherName}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-stone-600 font-bangla flex-wrap">
                          <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-800">
                            {getDepartmentLabel(app.data.departmentChoice)}
                          </span>
                          <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-800">
                            {app.data.residentType === 'residential' ? 'আবাসিক' : 'অনাবাসিক'}
                          </span>
                          <a
                            href={`tel:${app.data.guardianMobile}`}
                            className="text-[#064E3B] hover:underline flex items-center gap-1 font-sans font-medium"
                          >
                            <Phone className="w-3 h-3" />
                            {app.data.guardianMobile}
                          </a>
                          {app.data.bloodGroup && (
                            <span className="text-rose-600 font-sans font-semibold">
                              রক্ত: {app.data.bloodGroup}
                            </span>
                          )}
                        </div>

                        {app.adminNotes && (
                          <p className="text-xs text-amber-800 bg-amber-50/70 px-2.5 py-1 rounded border border-amber-200/60 font-bangla">
                            <strong>এডমিন নোট:</strong> {app.adminNotes}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-stone-100">
                        {/* Status selector */}
                        <select
                          value={app.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as AdmissionStatus;
                            updateApplicationStatus(app.id, newStatus);
                            showToast(`আবেদন ${app.id}-এর স্ট্যাটাস পরিবর্তন করা হয়েছে!`);
                          }}
                          className="py-1.5 px-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-bangla focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                        >
                          <option value="pending">বিবেচনাধীন</option>
                          <option value="interview_selected">সাক্ষাতকার নির্বাচিত</option>
                          <option value="approved">ভর্তি নিশ্চিত</option>
                          <option value="rejected">বাতিল</option>
                        </select>

                        <button
                          onClick={() => setSelectedAppForView(app)}
                          className="px-3 py-1.5 text-xs font-medium bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-lg transition-colors flex items-center gap-1.5 font-bangla cursor-pointer shadow-xs"
                          title="সম্পূর্ণ আবেদনপত্র দেখুন"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-300" />
                          <span>বিস্তারিত ও স্লিপ</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`আপনি কি নিশ্চিত যে আবেদন "${app.id}" (${app.data.studentName}) মুছে ফেলতে চান?`)) {
                              deleteApplication(app.id);
                              showToast('আবেদনটি মুছে ফেলা হয়েছে।');
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="আবেদন মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: NOTICES MANAGEMENT */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={noticeSearch}
                    onChange={(e) => setNoticeSearch(e.target.value)}
                    placeholder="নোটিশের শিরোনাম বা বিষয় দিয়ে খুঁজুন..."
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B] font-bangla"
                  />
                </div>

                <button
                  onClick={openNewNoticeModal}
                  className="px-4 py-2 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 font-bangla shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>নতুন নোটিশ প্রকাশ করুন</span>
                </button>
              </div>

              {/* Notice Cards */}
              <div className="grid grid-cols-1 gap-3">
                {filteredNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="bg-white p-4 rounded-xl border border-stone-200 hover:border-emerald-600/40 shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 font-bangla">
                            {notice.categoryLabel}
                          </span>
                          {notice.isImportant && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200 font-bangla">
                              জরুরি নোটিশ
                            </span>
                          )}
                          <span className="text-xs text-stone-400">•</span>
                          <span className="text-xs text-stone-500 font-bangla flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {notice.date}
                          </span>
                          <span className="text-xs text-stone-400">•</span>
                          <span className="text-xs text-stone-500 font-bangla">
                            {notice.publishedBy}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-stone-900 font-bangla">
                          {notice.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openEditNoticeModal(notice)}
                          className="p-1.5 text-stone-500 hover:text-[#064E3B] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="নোটিশ এডিট করুন"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`আপনি কি "${notice.title}" নোটিশটি মুছে ফেলতে চান?`)) {
                              deleteNotice(notice.id);
                              showToast('নোটিশটি মুছে ফেলা হয়েছে।');
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="নোটিশ ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 font-bangla leading-relaxed bg-stone-50/70 p-3 rounded-lg border border-stone-200/50">
                      {notice.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EXAM RESULTS MANAGEMENT */}
          {activeTab === 'results' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={resultSearch}
                    onChange={(e) => setResultSearch(e.target.value)}
                    placeholder="রোল নম্বর (যেমন: 101) বা নাম দিয়ে খুঁজুন..."
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B] font-bangla"
                  />
                </div>

                <button
                  onClick={openNewResultModal}
                  className="px-4 py-2 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 font-bangla shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>নতুন ফলাফল আপলোড করুন</span>
                </button>
              </div>

              {/* Results Grid / Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredResults.map((res) => (
                  <div
                    key={res.roll}
                    className="bg-white p-4 rounded-xl border border-stone-200 hover:border-emerald-600/40 shadow-xs transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            রোল: {res.roll}
                          </span>
                          <span className="text-[11px] font-mono text-stone-500">
                            {res.registrationNo}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-stone-900 font-bangla mt-1">
                          {res.name}
                        </h4>
                        <p className="text-xs text-stone-600 font-bangla">
                          পিতা: {res.fatherName}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditResultModal(res)}
                          className="p-1.5 text-stone-500 hover:text-[#064E3B] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="ফলাফল এডিট করুন"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`আপনি কি রোল ${res.roll} (${res.name})-এর ফলাফল মুছে ফেলতে চান?`)) {
                              deleteResult(res.roll);
                              showToast(`রোল ${res.roll}-এর ফলাফল মুছে ফেলা হয়েছে।`);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="ফলাফল ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 bg-stone-50 rounded-lg text-xs space-y-1 font-bangla border border-stone-200/50">
                      <div className="flex justify-between text-stone-700">
                        <span>বিভাগ:</span>
                        <span className="font-semibold">{res.department}</span>
                      </div>
                      <div className="flex justify-between text-stone-700">
                        <span>পরীক্ষার নাম:</span>
                        <span className="font-semibold">{res.examName}</span>
                      </div>
                      <div className="flex justify-between text-stone-700">
                        <span>মোট প্রাপ্ত নম্বর:</span>
                        <span className="font-semibold font-mono text-[#064E3B]">
                          {res.obtainedMarks} / {res.totalMarks} ({res.percentage}%)
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                        <span>ফলাফল ও গ্রেড:</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          {res.grade} • {res.resultStatus}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-500 font-bangla flex items-center justify-between">
                      <span>বিষয় সংখ্যা: {res.subjects?.length || 0} টি</span>
                      <span>স্বাক্ষর তারিখ: {res.muhtamimSignatureDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Password Change Box */}
              <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-[#064E3B] dark:text-emerald-300 flex items-center justify-center">
                      <Key className="w-5 h-5 text-[#064E3B] dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 font-bangla">
                        এডমিন পাসওয়ার্ড পরিবর্তন
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-bangla">
                        নিরাপত্তার স্বার্থে নিয়মিত আপনার এডমিন পাসওয়ার্ড পরিবর্তন করুন।
                      </p>
                    </div>
                  </div>

                  {/* Password status badge */}
                  <div>
                    {hasCustomPassword ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bangla">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>কাস্টম পাসওয়ার্ড সক্রিয়</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bangla">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>ডিফল্ট পাসওয়ার্ড (admin1234) সক্রিয়</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700/60 text-xs text-stone-600 dark:text-stone-300 font-bangla space-y-1">
                  <p className="font-semibold text-stone-800 dark:text-stone-200">
                    💡 পাসওয়ার্ড ওভাররাইট নীতি:
                  </p>
                  <p>
                    নতুন পাসওয়ার্ড সেট করার সাথে সাথে তা ব্রাউজারের সিকিউর স্টোরেজে সেভ হয়ে যাবে এবং ডিফল্ট <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded font-sans text-stone-800 dark:text-amber-300">admin1234</code> পাসওয়ার্ডটি সম্পূর্ণ অকার্যকর (ওভাররাইট) হয়ে যাবে। পরবর্তীতে শুধুমাত্র আপনার দেওয়া নতুন পাসওয়ার্ড দিয়েই এডমিন প্যানেলে লগইন করা যাবে।
                  </p>
                </div>

                {passwordMsg && (
                  <div
                    className={`p-3.5 rounded-lg text-xs font-bangla flex items-start gap-2 ${
                      passwordMsg.isError
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60'
                    }`}
                  >
                    {passwordMsg.isError ? (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangePasswordSubmit} className="space-y-4 font-bangla">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      বর্তমান পাসওয়ার্ড <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder={hasCustomPassword ? 'আপনার বর্তমান পাসওয়ার্ডটি লিখুন' : 'বর্তমান পাসওয়ার্ড দিন (ডিফল্ট: admin1234)'}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B] font-sans"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৪ অক্ষর)"
                        className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B] font-sans"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        নতুন পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                        className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B] font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 font-bangla shadow-xs cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>পাসওয়ার্ড আপডেট ও ওভাররাইট করুন</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Data Reset Box */}
              <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-rose-200 dark:border-rose-950/60 shadow-xs space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-rose-100 dark:border-rose-950/60">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-rose-700 dark:text-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 font-bangla">
                      ডেমো ডেটা ও পাসওয়ার্ড রিসেট
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-bangla">
                      সকল নোটিশ, ফলাফল ও ভর্তি আবেদন মাদ্রাসার প্রাথমিক ডেমো অবস্থায় ফিরিয়ে আনুন।
                    </p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 font-bangla">
                  আপনি যদি পরীক্ষামূলক তথ্য মুছে ফেলে মাদ্রাসার আদি কনফিগারেশন রিস্টোর করতে চান, তবে নিচের বাটনটি ব্যবহার করতে পারেন। এতে কাস্টম পাসওয়ার্ড মুছে গিয়ে পুনরায় ডিফল্ট পাসওয়ার্ড <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded font-sans font-bold text-stone-800 dark:text-amber-300 border border-stone-300 dark:border-stone-700">admin1234</code> সেট হবে।
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('আপনি কি নিশ্চিত যে সকল তথ্য ও পাসওয়ার্ড রিসেট করে প্রাথমিক ডেমো অবস্থায় নিতে চান?')) {
                      resetAllData();
                      setPasswordMsg({ text: 'সকল তথ্য ও পাসওয়ার্ড সফলভাবে প্রাথমিক অবস্থায় রিসেট হয়েছে!', isError: false });
                      showToast('সকল ডেটা সফলভাবে প্রাথমিক অবস্থায় রিসেট করা হয়েছে!');
                    }
                  }}
                  className="px-4 py-2 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 font-bangla cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>প্রাথমিক অবস্থায় রিসেট করুন</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL 1: VIEW FULL APPLICATION & PRINT SLIP */}
        {selectedAppForView && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
            onClick={() => setSelectedAppForView(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#064E3B]" />
                  <h3 className="text-lg font-bold text-stone-900 font-bangla">
                    ভর্তি আবেদনপত্র স্লিপ
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAppForView(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Slip Content */}
              <div id="printable-admin-app-slip" className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4 text-xs font-bangla">
                <div className="text-center border-b border-stone-300 pb-3">
                  <h2 className="text-lg font-bold text-[#064E3B]">{MADRASAH_INFO.name}</h2>
                  <p className="text-[11px] text-stone-500 font-sans">{MADRASAH_INFO.address}</p>
                  <div className="inline-block mt-1 px-3 py-1 bg-emerald-100 text-emerald-900 rounded font-semibold text-xs">
                    অনলাইন ভর্তি আবেদন স্লিপ (অফিস কপি)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-stone-200">
                  <div>
                    <span className="text-stone-500">আবেদন ট্র্যাকিং আইডি:</span>
                    <p className="font-mono font-bold text-stone-900">{selectedAppForView.id}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">আবেদনের তারিখ:</span>
                    <p className="font-semibold text-stone-900">{selectedAppForView.submittedAt}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">কাঙ্ক্ষিত বিভাগ:</span>
                    <p className="font-bold text-[#064E3B]">{getDepartmentLabel(selectedAppForView.data.departmentChoice)}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">বর্তমান স্ট্যাটাস:</span>
                    <p className="font-bold">{getStatusBadge(selectedAppForView.status)}</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-2">
                  <h5 className="font-bold text-stone-900 border-b pb-1">শিক্ষার্থীর তথ্য:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-stone-500">পূর্ণ নাম (বাংলা):</span>
                      <p className="font-bold text-stone-900">{selectedAppForView.data.studentName}</p>
                    </div>
                    <div>
                      <span className="text-stone-500">পূর্ণ নাম (ইংরেজি):</span>
                      <p className="font-sans font-semibold text-stone-900">{selectedAppForView.data.studentNameEn || '—'}</p>
                    </div>
                    <div>
                      <span className="text-stone-500">পিতার নাম:</span>
                      <p className="font-semibold text-stone-900">{selectedAppForView.data.fatherName}</p>
                    </div>
                    <div>
                      <span className="text-stone-500">পিতার পেশা:</span>
                      <p className="text-stone-900">{selectedAppForView.data.fatherOccupation || '—'}</p>
                    </div>
                    <div>
                      <span className="text-stone-500">মাতার নাম:</span>
                      <p className="font-semibold text-stone-900">{selectedAppForView.data.motherName}</p>
                    </div>
                    <div>
                      <span className="text-stone-500">জন্ম তারিখ:</span>
                      <p className="font-sans text-stone-900">{selectedAppForView.data.dateOfBirth}</p>
                    </div>
                    <div>
                      <span className="text-stone-500">রক্তের গ্রুপ:</span>
                      <p className="font-sans font-bold text-rose-600">{selectedAppForView.data.bloodGroup}</p>
                    </div>
                    <div>
                      <span className="text-stone-500">আবাসিক ধরন:</span>
                      <p className="text-stone-900">{selectedAppForView.data.residentType === 'residential' ? 'আবাসিক' : 'অনাবাসিক'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-2">
                  <h5 className="font-bold text-stone-900 border-b pb-1">যোগাযোগ ও ঠিকানা:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-stone-500">অভিভাবকের মোবাইল:</span>
                      <p className="font-sans font-bold text-stone-900">{selectedAppForView.data.guardianMobile}</p>
                    </div>
                    <div>
                      <span className="text-stone-500">বিকল্প মোবাইল:</span>
                      <p className="font-sans text-stone-900">{selectedAppForView.data.guardianAlternateMobile || '—'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-500">বর্তমান ঠিকানা:</span>
                      <p className="text-stone-900">{selectedAppForView.data.presentAddress}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-500">স্থায়ী ঠিকানা:</span>
                      <p className="text-stone-900">{selectedAppForView.data.permanentAddress}</p>
                    </div>
                    {selectedAppForView.data.previousInstitute && (
                      <div className="col-span-2">
                        <span className="text-stone-500">পূর্ববর্তী শিক্ষা প্রতিষ্ঠান:</span>
                        <p className="text-stone-900">{selectedAppForView.data.previousInstitute}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-end border-t border-dashed border-stone-300">
                  <div className="text-center">
                    <div className="w-32 border-b border-stone-400 mb-1" />
                    <span className="text-[10px] text-stone-500">অভিভাবকের স্বাক্ষর</span>
                  </div>
                  <div className="text-center">
                    <div className="w-32 border-b border-stone-400 mb-1" />
                    <span className="text-[10px] text-stone-500">ভর্তি নিয়ন্ত্রক / মুহতামিম</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 font-bangla cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>স্লিপ প্রিন্ট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAppForView(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-medium font-bangla"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: NOTICE FORM (CREATE / EDIT) */}
        {isNoticeFormOpen && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsNoticeFormOpen(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#064E3B]" />
                  <h3 className="text-lg font-bold text-stone-900 font-bangla">
                    {editingNotice ? 'নোটিশ এডিট করুন' : 'নতুন নোটিশ প্রকাশ করুন'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsNoticeFormOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNotice} className="space-y-3 font-bangla text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    নোটিশের শিরোনাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={noticeFormData.title}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, title: e.target.value })}
                    placeholder="যেমন: ১৪৪৭-৪৮ হিজরী শিক্ষাবর্ষে সকল বিভাগে ভর্তি কার্যক্রম..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      ক্যাটাগরি
                    </label>
                    <select
                      value={noticeFormData.category}
                      onChange={(e) => setNoticeFormData({ ...noticeFormData, category: e.target.value as any })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    >
                      <option value="general">সাধারণ নোটিশ</option>
                      <option value="admission">ভর্তি বিজ্ঞপ্তি</option>
                      <option value="exam">পরীক্ষা</option>
                      <option value="holiday">ছুটি ও অনুষ্ঠান</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      প্রকাশের তারিখ
                    </label>
                    <input
                      type="text"
                      value={noticeFormData.date}
                      onChange={(e) => setNoticeFormData({ ...noticeFormData, date: e.target.value })}
                      placeholder="যেমন: ১৪ অক্টোবর ২০২৬"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    প্রকাশকারী কর্তৃপক্ষ
                  </label>
                  <input
                    type="text"
                    value={noticeFormData.publishedBy}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, publishedBy: e.target.value })}
                    placeholder="যেমন: মুহতামিম দফতর / পরীক্ষা নিয়ন্ত্রণ কমিটি"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    নোটিশের পূর্ণাঙ্গ বিবরণ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={noticeFormData.content}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, content: e.target.value })}
                    placeholder="বিস্তারিত নোটিশের বক্তব্য এখানে লিখুন..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isImportantNotice"
                    checked={noticeFormData.isImportant}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, isImportant: e.target.checked })}
                    className="w-4 h-4 text-[#064E3B] rounded border-stone-300 focus:ring-[#064E3B]"
                  />
                  <label htmlFor="isImportantNotice" className="text-stone-700 font-medium cursor-pointer">
                    গুরুত্বপূর্ণ / জরুরি নোটিশ হিসেবে পিন করুন (Important Notice Badge)
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsNoticeFormOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-medium"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>{editingNotice ? 'আপডেট করুন' : 'প্রকাশ করুন'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: RESULT FORM (CREATE / EDIT) */}
        {isResultFormOpen && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsResultFormOpen(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#064E3B]" />
                  <h3 className="text-lg font-bold text-stone-900 font-bangla">
                    {editingResult ? `রোল ${editingResult.roll}-এর ফলাফল পরিবর্তন` : 'নতুন শিক্ষার্থীর ফলাফল আপলোড'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsResultFormOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveResult} className="space-y-4 font-bangla text-xs">
                {/* Basic Student Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      রোল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={resultFormData.roll}
                      onChange={(e) => setResultFormData({ ...resultFormData, roll: e.target.value })}
                      placeholder="যেমন: 105"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B] font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      রেজিস্ট্রেশন নম্বর
                    </label>
                    <input
                      type="text"
                      value={resultFormData.registrationNo}
                      onChange={(e) => setResultFormData({ ...resultFormData, registrationNo: e.target.value })}
                      placeholder="TQWM-2026-0105"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      শিক্ষার্থীর নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={resultFormData.name}
                      onChange={(e) => setResultFormData({ ...resultFormData, name: e.target.value })}
                      placeholder="যেমন: হাবিবা বিনতে ফারুক"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      পিতার নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={resultFormData.fatherName}
                      onChange={(e) => setResultFormData({ ...resultFormData, fatherName: e.target.value })}
                      placeholder="যেমন: মুফতি ফারুক আহমেদ"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      বিভাগ
                    </label>
                    <select
                      value={resultFormData.department}
                      onChange={(e) => setResultFormData({ ...resultFormData, department: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    >
                      <option value="কিতাব বিভাগ (দাওরায়ে হাদীস)">কিতাব বিভাগ (দাওরায়ে হাদীস)</option>
                      <option value="হিফজুল কুরআন বিভাগ">হিফজুল কুরআন বিভাগ</option>
                      <option value="নাজেরা বিভাগ">নাজেরা বিভাগ</option>
                      <option value="মক্তব ও নূরানী বিভাগ">মক্তব ও নূরানী বিভাগ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      পরীক্ষার নাম ও সেশন
                    </label>
                    <input
                      type="text"
                      value={resultFormData.examName}
                      onChange={(e) => setResultFormData({ ...resultFormData, examName: e.target.value })}
                      placeholder="বার্ষিক মূল্যায়ন পরীক্ষা ২০২৬"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                      required
                    />
                  </div>
                </div>

                {/* Subject-wise Marks Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-stone-900">বিষয়ভিত্তিক নম্বরপত্র (Subjects & Marks):</h5>
                    <button
                      type="button"
                      onClick={addSubjectRow}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-100 text-[#064E3B] hover:bg-emerald-200 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>বিষয় যোগ করুন</span>
                    </button>
                  </div>

                  <div className="border border-stone-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
                        <tr>
                          <th className="p-2">বিষয়ের নাম</th>
                          <th className="p-2 w-20 text-center">পূর্ণমান</th>
                          <th className="p-2 w-20 text-center">প্রাপ্ত নম্বর</th>
                          <th className="p-2 w-16 text-center">গ্রেড</th>
                          <th className="p-2 w-10 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {resultFormData.subjects.map((sub, idx) => (
                          <tr key={idx} className="bg-white hover:bg-stone-50">
                            <td className="p-2">
                              <input
                                type="text"
                                value={sub.subjectName}
                                onChange={(e) => handleSubjectChange(idx, 'subjectName', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                                required
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                value={sub.fullMarks}
                                onChange={(e) => handleSubjectChange(idx, 'fullMarks', Number(e.target.value))}
                                className="w-16 px-1.5 py-1 text-xs text-center border border-stone-300 rounded focus:outline-none font-mono"
                                required
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                value={sub.obtainedMarks}
                                onChange={(e) => handleSubjectChange(idx, 'obtainedMarks', Number(e.target.value))}
                                className="w-16 px-1.5 py-1 text-xs text-center font-bold text-[#064E3B] border border-stone-300 rounded focus:outline-none font-mono"
                                required
                              />
                            </td>
                            <td className="p-2 text-center font-mono font-bold text-amber-700">
                              {sub.gradeLetter}
                            </td>
                            <td className="p-2 text-center">
                              {resultFormData.subjects.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSubjectRow(idx)}
                                  className="text-stone-400 hover:text-red-600 p-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsResultFormOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-medium"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>ফলাফল সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
