import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User 
} from 'firebase/auth';
import { auth, verifyAdminUser } from '../firebase';
import { NOTICES, DEMO_RESULTS, DEMO_ADMISSIONS, DEMO_ADMIT_CARDS } from '../data/madrasahData';
import { NoticeItem, StudentResult, AdmissionApplication, AdmissionFormData, AdmissionStatus, AdmitCardData } from '../types';

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

  // Admit Cards (প্রবেশপত্র)
  admitCards: Record<string, AdmitCardData>;
  addOrUpdateAdmitCard: (card: AdmitCardData) => void;
  deleteAdmitCard: (roll: string) => void;

  // Admission Applications & Settings
  applications: AdmissionApplication[];
  isAdmissionOpen: boolean;
  toggleAdmissionStatus: (isOpen?: boolean) => void;
  submitApplication: (data: AdmissionFormData) => AdmissionApplication;
  updateApplicationStatus: (id: string, status: AdmissionStatus, notes?: string) => void;
  deleteApplication: (id: string) => void;

  // Admin Auth (Firebase Powered)
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  adminUser: User | null;
  authLoading: boolean;
  adminUsername: string;
  hasCustomPassword: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => Promise<void>;
  changeAdminPassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
  sendPasswordReset: (email?: string) => Promise<{ success: boolean; message?: string }>;

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
  ADMIT_CARDS: 'tqwm_admit_cards_v2',
  APPLICATIONS: 'tqwm_applications_v2',
  ADMISSION_OPEN: 'tqwm_admission_open_v2',
  THEME: 'tqwm_theme_mode',
};

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

  // 2.1 Admit Cards State
  const [admitCards, setAdmitCards] = useState<Record<string, AdmitCardData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIT_CARDS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEMO_ADMIT_CARDS;
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

  // 3.1 Admission Open/Closed Control State
  const [isAdmissionOpen, setIsAdmissionOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMISSION_OPEN);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // fallback
    }
    return true; // default: admission is open
  });

  const toggleAdmissionStatus = (isOpen?: boolean) => {
    setIsAdmissionOpen((prev) => {
      const nextVal = typeof isOpen === 'boolean' ? isOpen : !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.ADMISSION_OPEN, String(nextVal));
      } catch {
        // ignore
      }
      return nextVal;
    });
  };

  // 4. Firebase Admin Auth State
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Synchronize Firebase Auth State across reloads and tab sessions
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      if (user) {
        try {
          const authCheck = await verifyAdminUser(user);
          if (authCheck.isAuthorized) {
            if (isMounted) {
              setAdminUser(user);
              setIsAdminLoggedIn(true);
            }
          } else {
            // General Firebase user without admin authorization
            // Immediately disconnect the session so unprivileged users cannot hold an admin session
            await signOut(auth);
            if (isMounted) {
              setAdminUser(null);
              setIsAdminLoggedIn(false);
            }
          }
        } catch (error) {
          console.error('Session authorization error:', error);
          if (isMounted) {
            setAdminUser(null);
            setIsAdminLoggedIn(false);
          }
        }
      } else {
        if (isMounted) {
          setAdminUser(null);
          setIsAdminLoggedIn(false);
        }
      }

      if (isMounted) {
        setAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

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
      localStorage.setItem(STORAGE_KEYS.ADMIT_CARDS, JSON.stringify(admitCards));
    } catch {
      // ignore
    }
  }, [admitCards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch {
      // ignore
    }
  }, [applications]);


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

  // Admit Card Actions
  const addOrUpdateAdmitCard = (card: AdmitCardData) => {
    setAdmitCards((prev) => ({
      ...prev,
      [card.roll.trim()]: card,
    }));
  };

  const deleteAdmitCard = (roll: string) => {
    setAdmitCards((prev) => {
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

  // Firebase Admin Auth Actions
  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      return { success: false, message: 'অনুগ্রহ করে এডমিন ইমেইল লিখুন।' };
    }
    if (!cleanPassword) {
      return { success: false, message: 'অনুগ্রহ করে এডমিন পাসওয়ার্ড লিখুন।' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const user = userCredential.user;

      // Real Firebase Admin authorization verification (Token claims, immutable UID, strict authorized list)
      const authCheck = await verifyAdminUser(user, true);

      if (!authCheck.isAuthorized) {
        await signOut(auth);
        setAdminUser(null);
        setIsAdminLoggedIn(false);
        return {
          success: false,
          message: `দুঃখিত, এই Firebase অ্যাকাউন্টটি (${user.email || cleanEmail}) অ্যাডমিন ড্যাশবোর্ড ব্যবহারের জন্য অনুমোদিত নয়। শুধুমাত্র নির্ধারিত মাদ্রাসার অ্যাডমিনই ড্যাশবোর্ড অ্যাক্সেস করতে পারবেন।`,
        };
      }

      setAdminUser(user);
      setIsAdminLoggedIn(true);
      return { success: true };
    } catch (err: any) {
      console.warn('Firebase Admin Login error:', err?.code, err?.message);
      let userFriendlyMessage = 'লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';

      switch (err?.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          userFriendlyMessage = 'ভুল ইমেইল অথবা পাসওয়ার্ড! আপনার ফায়ারবেস অথেন্টিকেশন তথ্য সঠিকভাবে লিখুন।';
          break;
        case 'auth/invalid-email':
          userFriendlyMessage = 'ইমেইল অ্যাড্রেসটি সঠিক ফরম্যাটে লিখুন (যেমন: name@example.com)।';
          break;
        case 'auth/too-many-requests':
          userFriendlyMessage = 'অতিরিক্ত ব্যর্থ চেষ্টার কারণে অ্যাকাউন্ট সাময়িকভাবে বন্ধ আছে। কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন অথবা পাসওয়ার্ড রিসেট করুন।';
          break;
        case 'auth/user-disabled':
          userFriendlyMessage = 'এই এডমিন অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। প্রধান প্রশাসকের সাথে যোগাযোগ করুন।';
          break;
        case 'auth/network-request-failed':
          userFriendlyMessage = 'ইন্টারনেট সংযোগ ব্যর্থ হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।';
          break;
        default:
          if (err?.message) {
            userFriendlyMessage = `লগইন ত্রুটি: ${err.message}`;
          }
      }

      return { success: false, message: userFriendlyMessage };
    }
  };

  const logoutAdmin = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    } finally {
      setAdminUser(null);
      setIsAdminLoggedIn(false);
    }
  };

  const changeAdminPassword = async (currentPass: string, newPass: string): Promise<{ success: boolean; message?: string }> => {
    if (!auth.currentUser || !auth.currentUser.email) {
      return { success: false, message: 'আপনি বর্তমানে লগইন অবস্থায় নেই। অনুগ্রহ করে প্রথমে লগইন করুন।' };
    }

    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
    }

    try {
      // Re-authenticate user with current password before updating
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPass.trim());
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPass.trim());
      return { success: true, message: 'Firebase পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' };
    } catch (err: any) {
      console.error('Change password error:', err);
      if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        return { success: false, message: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়। অনুগ্রহ করে সঠিক বর্তমান পাসওয়ার্ড লিখুন।' };
      }
      if (err?.code === 'auth/weak-password') {
        return { success: false, message: 'পাসওয়ার্ডটি খুবই দুর্বল। কমপক্ষে ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড দিন।' };
      }
      return { success: false, message: err?.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।' };
    }
  };

  const sendPasswordReset = async (targetEmail?: string): Promise<{ success: boolean; message?: string }> => {
    const emailToSend = targetEmail?.trim() || adminUser?.email;
    if (!emailToSend) {
      return { success: false, message: 'অনুগ্রহ করে আপনার ইমেইল প্রদান করুন।' };
    }

    try {
      await sendPasswordResetEmail(auth, emailToSend);
      return {
        success: true,
        message: `${emailToSend} ঠিকানায় পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।`,
      };
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err?.code === 'auth/user-not-found') {
        return { success: false, message: 'এই ইমেইলে কোনো ফায়ারবেস অ্যাকাউন্ট পাওয়া যায়নি।' };
      }
      return { success: false, message: err?.message || 'পাসওয়ার্ড রিসেট লিংক পাঠাতে সমস্যা হয়েছে।' };
    }
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
    setAdmitCards(DEMO_ADMIT_CARDS);
    setApplications(DEMO_ADMISSIONS);
    setIsAdmissionOpen(true);
    try {
      localStorage.removeItem(STORAGE_KEYS.NOTICES);
      localStorage.removeItem(STORAGE_KEYS.RESULTS);
      localStorage.removeItem(STORAGE_KEYS.ADMIT_CARDS);
      localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
      localStorage.removeItem(STORAGE_KEYS.ADMISSION_OPEN);
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
        admitCards,
        addOrUpdateAdmitCard,
        deleteAdmitCard,
        applications,
        isAdmissionOpen,
        toggleAdmissionStatus,
        submitApplication,
        updateApplicationStatus,
        deleteApplication,
        isAdminLoggedIn,
        adminEmail: adminUser?.email || null,
        adminUser,
        authLoading,
        adminUsername: adminUser?.displayName || adminUser?.email || 'মুহতামিম / প্রধান এডমিন',
        hasCustomPassword: true,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        sendPasswordReset,
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
