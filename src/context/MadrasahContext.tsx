import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NOTICES, DEMO_RESULTS, DEMO_ADMISSIONS } from '../data/madrasahData';
import { NoticeItem, StudentResult, AdmissionApplication, AdmissionFormData, AdmissionStatus } from '../types';

interface MadrasahContextType {
  // Notices
  notices: NoticeItem[];
  addNotice: (notice: Omit<NoticeItem, 'id'>) => NoticeItem;
  updateNotice: (id: string, updated: Partial<NoticeItem>) => void;
  deleteNotice: (id: string) => void;

  // Results
  results: Record<string, StudentResult>;
  addOrUpdateResult: (result: StudentResult) => void;
  deleteResult: (roll: string) => void;

  // Admission Applications
  applications: AdmissionApplication[];
  submitApplication: (data: AdmissionFormData) => AdmissionApplication;
  updateApplicationStatus: (id: string, status: AdmissionStatus, notes?: string) => void;
  deleteApplication: (id: string) => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminUsername: string;
  hasCustomPassword: boolean;
  loginAdmin: (password: string) => { success: boolean; message?: string };
  logoutAdmin: () => void;
  changeAdminPassword: (currentPass: string, newPass: string) => { success: boolean; message?: string };

  // Theme & Contrast
  theme: 'light' | 'dark' | 'system';
  isDark: boolean;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;

  // System
  resetAllData: () => void;
}

const STORAGE_KEYS = {
  NOTICES: 'tqwm_notices_v2',
  RESULTS: 'tqwm_results_v2',
  APPLICATIONS: 'tqwm_applications_v2',
  ADMIN_AUTH: 'tqwm_admin_auth_v2',
  ADMIN_PASS: 'tqwm_admin_pass_v2',
  THEME: 'tqwm_theme_mode',
};

const DEFAULT_ADMIN_PASSWORD = 'admin1234';

const MadrasahContext = createContext<MadrasahContextType | undefined>(undefined);

export const MadrasahProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Notices State
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return NOTICES;
  });

  // 2. Results State
  const [results, setResults] = useState<Record<string, StudentResult>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESULTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEMO_RESULTS;
  });

  // 3. Applications State
  const [applications, setApplications] = useState<AdmissionApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEMO_ADMISSIONS;
  });

  // 4. Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS);
      return saved || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    } catch {
      // ignore
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
    } catch {
      // ignore
    }
  }, [results]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch {
      // ignore
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, adminPassword);
    } catch {
      // ignore
    }
  }, [adminPassword]);

  // Notice Actions
  const addNotice = (newNoticeData: Omit<NoticeItem, 'id'>): NoticeItem => {
    const id = `n-${Date.now()}`;
    const notice: NoticeItem = {
      ...newNoticeData,
      id,
    };
    setNotices((prev) => [notice, ...prev]);
    return notice;
  };

  const updateNotice = (id: string, updated: Partial<NoticeItem>) => {
    setNotices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((item) => item.id !== id));
  };

  // Result Actions
  const addOrUpdateResult = (result: StudentResult) => {
    setResults((prev) => ({
      ...prev,
      [result.roll.trim()]: result,
    }));
  };

  const deleteResult = (roll: string) => {
    setResults((prev) => {
      const updated = { ...prev };
      delete updated[roll.trim()];
      return updated;
    });
  };

  // Application Actions
  const submitApplication = (data: AdmissionFormData): AdmissionApplication => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newId = `TQWM-2026-${randomDigits}`;
    const now = new Date();
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const submittedAt = `${now.getDate()} ${months[now.getMonth()]} ২০২৬, ${now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}`;

    const newApp: AdmissionApplication = {
      id: newId,
      submittedAt,
      data,
      status: 'pending',
      adminNotes: 'অনলাইন পোর্টাল থেকে নতুন আবেদন জমা পড়েছে।',
    };

    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateApplicationStatus = (id: string, status: AdmissionStatus, notes?: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status,
              ...(notes !== undefined ? { adminNotes: notes } : {}),
            }
          : app
      )
    );
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  // Admin Auth Actions
  const loginAdmin = (password: string) => {
    const cleanInput = password.trim();
    if (!cleanInput) {
      return { success: false, message: 'অনুগ্রহ করে এডমিন পাসওয়ার্ড প্রদান করুন।' };
    }

    // Always fetch the latest effective password:
    // First from localStorage, falling back to state or DEFAULT_ADMIN_PASSWORD.
    let effectivePassword = adminPassword;
    try {
      const savedPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS);
      if (savedPass && savedPass.trim()) {
        effectivePassword = savedPass.trim();
      }
    } catch {
      // fallback to state
    }

    // Strict validation: Once a user sets a new password, it completely overwrites
    // the default ('admin1234'). Only the effective password is accepted.
    if (cleanInput === effectivePassword) {
      setIsAdminLoggedIn(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      } catch {
        // ignore
      }
      return { success: true };
    }

    return {
      success: false,
      message: 'ভুল পাসওয়ার্ড! আপনার বর্তমান সঠিক এডমিন পাসওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।',
    };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch {
      // ignore
    }
  };

  const changeAdminPassword = (currentPass: string, newPass: string) => {
    const cleanCurrent = currentPass.trim();
    const cleanNew = newPass.trim();

    // Check against current active password (from localStorage or state)
    let effectivePassword = adminPassword;
    try {
      const savedPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS);
      if (savedPass && savedPass.trim()) {
        effectivePassword = savedPass.trim();
      }
    } catch {
      // fallback to state
    }

    if (cleanCurrent !== effectivePassword) {
      return {
        success: false,
        message: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়। অনুগ্রহ করে আপনার সঠিক বর্তমান পাসওয়ার্ড লিখুন।',
      };
    }

    if (!cleanNew || cleanNew.length < 4) {
      return {
        success: false,
        message: 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।',
      };
    }

    if (cleanNew === effectivePassword) {
      return {
        success: false,
        message: 'নতুন পাসওয়ার্ডটি বর্তমান পাসওয়ার্ড থেকে ভিন্ন হতে হবে।',
      };
    }

    // 1. Immediately and synchronously overwrite localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, cleanNew);
    } catch (err) {
      console.error('Failed to save updated password to localStorage', err);
      return {
        success: false,
        message: 'ব্রাউজার স্টোরেজে পাসওয়ার্ড সংরক্ষণে ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।',
      };
    }

    // 2. Synchronously update React state
    setAdminPassword(cleanNew);

    return {
      success: true,
      message: 'এডমিন পাসওয়ার্ড সফলভাবে পরিবর্তন ও আপডেট করা হয়েছে! ডিফল্ট পাসওয়ার্ড সফলভাবে ওভাররাইট হয়েছে। পরবর্তীতে লগইনের জন্য এই নতুন পাসওয়ার্ডটি ব্যবহার করুন।',
    };
  };

  // Theme State & Synchronization
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.THEME);
        if (saved === 'dark') return true;
        if (saved === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    const updateTheme = () => {
      let activeIsDark = false;
      if (theme === 'dark') {
        activeIsDark = true;
      } else if (theme === 'light') {
        activeIsDark = false;
      } else {
        activeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(activeIsDark);
      if (activeIsDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Reset System to initial demo state
  const resetAllData = () => {
    setNotices(NOTICES);
    setResults(DEMO_RESULTS);
    setApplications(DEMO_ADMISSIONS);
    setAdminPassword(DEFAULT_ADMIN_PASSWORD);
    try {
      localStorage.removeItem(STORAGE_KEYS.NOTICES);
      localStorage.removeItem(STORAGE_KEYS.RESULTS);
      localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_PASS);
      localStorage.removeItem(STORAGE_KEYS.THEME);
    } catch {
      // ignore
    }
  };

  return (
    <MadrasahContext.Provider
      value={{
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        results,
        addOrUpdateResult,
        deleteResult,
        applications,
        submitApplication,
        updateApplicationStatus,
        deleteApplication,
        isAdminLoggedIn,
        adminUsername: 'মুহতামিম / প্রধান এডমিন',
        hasCustomPassword: adminPassword !== DEFAULT_ADMIN_PASSWORD,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        theme,
        isDark,
        setTheme,
        toggleTheme,
        resetAllData,
      }}
    >
      {children}
    </MadrasahContext.Provider>
  );
};

export const useMadrasah = (): MadrasahContextType => {
  const context = useContext(MadrasahContext);
  if (!context) {
    throw new Error('useMadrasah must be used within a MadrasahProvider');
  }
  return context;
};
