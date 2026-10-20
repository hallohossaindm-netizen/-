import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAJtkPHjq-wT7sPyHBPbfBqn-FV0B_qLi0",
  authDomain: "talimulquranmohilamadras-41714.firebaseapp.com",
  projectId: "talimulquranmohilamadras-41714",
  storageBucket: "talimulquranmohilamadras-41714.firebasestorage.app",
  messagingSenderId: "471458363664",
  appId: "1:471458363664:web:c05cf013979adcbb094d95",
  measurementId: "G-T7T09T2G19"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Pre-authorized admin emails list (Strict matching, no wildcard, no localStorage tampering)
export const DEFAULT_ALLOWED_ADMIN_EMAILS: string[] = [
  'hallo.hossain.dm@gmail.com',
  'admin@talimulquran-madrasah.edu.bd',
  'principal@talimulquran-madrasah.edu.bd',
  'talimulquran@gmail.com'
];

// Pre-authorized admin Firebase User UIDs (immutable, tamper-proof)
export const DEFAULT_ALLOWED_ADMIN_UIDS: string[] = [
  // Optional pre-configured admin UIDs
];

/**
 * Checks whether an email is in the authorized admin list.
 * NOTE: Wildcards and localStorage tampering have been completely removed.
 */
export const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();

  // 1. Match in strict default list
  if (DEFAULT_ALLOWED_ADMIN_EMAILS.some((e) => e.toLowerCase() === clean)) {
    return true;
  }

  // 2. Match in environment variable list (VITE_ADMIN_EMAILS)
  try {
    const envAdmins = (import.meta.env.VITE_ADMIN_EMAILS || '')
      .split(',')
      .map((e: string) => e.trim().toLowerCase())
      .filter(Boolean);
    if (envAdmins.includes(clean)) {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
};

/**
 * Checks whether a Firebase User UID is in the authorized admin UIDs list.
 */
export const isAuthorizedAdminUid = (uid?: string | null): boolean => {
  if (!uid) return false;
  const clean = uid.trim();

  if (DEFAULT_ALLOWED_ADMIN_UIDS.includes(clean)) {
    return true;
  }

  try {
    const envUids = (import.meta.env.VITE_ADMIN_UIDS || '')
      .split(',')
      .map((u: string) => u.trim())
      .filter(Boolean);
    if (envUids.includes(clean)) {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
};

export interface AdminAuthVerificationResult {
  isAuthorized: boolean;
  role?: string;
  verifiedBy?: 'custom_claims' | 'uid' | 'email';
  reason?: string;
}

/**
 * Real Firebase Admin authorization verification.
 * Verifies the user's fresh ID token with Firebase Auth and checks:
 * 1. Cryptographic Firebase Custom Claims (e.g. claims.admin === true or claims.role === 'admin')
 * 2. Immutable Firebase User UID check
 * 3. Strictly authorized Admin Email list
 *
 * Never relies on localStorage, sessionStorage, or unverified wildcards.
 */
export const verifyAdminUser = async (
  user: User | null,
  forceRefresh = false
): Promise<AdminAuthVerificationResult> => {
  if (!user) {
    return { isAuthorized: false, reason: 'ব্যবহারকারী লগইন করা নেই।' };
  }

  try {
    // Cryptographically inspect the fresh token from Google Firebase Auth
    const tokenResult = await user.getIdTokenResult(forceRefresh);
    const claims = tokenResult.claims;

    // 1. Check Firebase Custom Claims (Server-minted & cryptographically signed by Google)
    if (
      claims.admin === true ||
      claims.role === 'admin' ||
      claims.role === 'superadmin' ||
      claims.is_admin === true
    ) {
      return {
        isAuthorized: true,
        role: (claims.role as string) || 'admin',
        verifiedBy: 'custom_claims'
      };
    }

    // 2. Check Immutable Firebase UID
    if (isAuthorizedAdminUid(user.uid)) {
      return {
        isAuthorized: true,
        role: 'admin',
        verifiedBy: 'uid'
      };
    }

    // 3. Check Strictly Authorized Admin Email
    if (isAuthorizedAdminEmail(user.email)) {
      return {
        isAuthorized: true,
        role: 'admin',
        verifiedBy: 'email'
      };
    }

    return {
      isAuthorized: false,
      reason: 'এই Firebase অ্যাকাউন্টে অ্যাডমিন অনুমোদন নেই।'
    };
  } catch (error: any) {
    console.error('Firebase token verification error:', error);
    return {
      isAuthorized: false,
      reason: error?.message || 'টোকেন যাচাইয়ে ত্রুটি।'
    };
  }
};
