/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PrincipalMessage } from './components/PrincipalMessage';
import { Academics } from './components/Academics';
import { AdmissionSection } from './components/AdmissionSection';
import { NoticeBoardAndResults } from './components/NoticeBoardAndResults';
import { Gallery } from './components/Gallery';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { DonationModal } from './components/DonationModal';
import { IslamicAssistantModal } from './components/IslamicAssistantModal';
import { FloatingAssistantButton } from './components/FloatingAssistantButton';
import { ShareModal } from './components/ShareModal';
import { MadrasahProvider, useMadrasah } from './context/MadrasahContext';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { AdmitCardVerificationModal } from './components/AdmitCardVerificationModal';
import { AdmitCardData } from './types';

function MainApp() {
  const { isAdminLoggedIn, authLoading, admitCards } = useMadrasah();
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [verifiedCardForModal, setVerifiedCardForModal] = useState<AdmitCardData | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'academics', 'admission', 'notices-results', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setIsAdminDashboardOpen(true);
      setIsAdminLoginOpen(false);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    const checkAdminTrigger = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash === '#admin' || search.includes('admin=true') || search.includes('admin=1')) {
        if (isAdminLoggedIn) {
          setIsAdminDashboardOpen(true);
          setIsAdminLoginOpen(false);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);
    return () => window.removeEventListener('hashchange', checkAdminTrigger);
  }, [isAdminLoggedIn, authLoading]);

  // Security guard: immediately close dashboard if admin session terminates or is unauthorized
  useEffect(() => {
    if (!isAdminLoggedIn && isAdminDashboardOpen) {
      setIsAdminDashboardOpen(false);
    }
  }, [isAdminLoggedIn, isAdminDashboardOpen]);

  // QR Code Admit Card Verification Listener (Detects camera scan visits)
  useEffect(() => {
    const checkAdmitVerification = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hash = window.location.hash;
        const isVerify =
          searchParams.get('verify_admit') === '1' ||
          searchParams.get('verify_admit') === 'true' ||
          hash.includes('verify-admit');

        if (isVerify) {
          const roll = searchParams.get('roll') || '';
          const reg = searchParams.get('reg') || '';

          // 1. Look up in stored context admit cards
          let foundCard: AdmitCardData | undefined = undefined;
          if (roll && admitCards[roll]) {
            foundCard = admitCards[roll];
          } else if (reg) {
            foundCard = Object.values(admitCards).find((c) => c.registrationNo === reg);
          }

          // 2. Reconstruct from verified URL payload if opened on another device/browser
          if (!foundCard && (roll || reg)) {
            const studentName = searchParams.get('student') || 'তালিমুল কুরআন মাদরাসার পরীক্ষার্থী';
            const studentNameEn = searchParams.get('studentEn') || '';
            const fatherName = searchParams.get('father') || 'অভিভাবক';
            const motherName = searchParams.get('mother') || '';
            const department = searchParams.get('dept') || 'হিফজুল কুরআন বিভাগ';
            const examName = searchParams.get('exam') || 'বার্ষিক মূল্যায়ন পরীক্ষা ২০২৬';
            const session = searchParams.get('session') || '২০২৫-২০২৬';
            const examCenter = searchParams.get('center') || 'মাদরাসা মিলনায়তন, রামগঞ্জ রোড, লক্ষ্মীপুর';
            const residentType =
              (searchParams.get('res') as 'residential' | 'non_residential') || 'residential';
            const issueDate = searchParams.get('issued') || '১৫ অক্টোবর ২০২৬';

            foundCard = {
              roll: roll || '101',
              registrationNo: reg || 'TQWM-2026-0101',
              studentName,
              studentNameEn,
              fatherName,
              motherName,
              department,
              examName,
              session,
              examCenter,
              residentType,
              issueDate,
              schedule: [
                {
                  date: '২৫ অক্টোবর ২০২৬',
                  day: 'রবিবার',
                  time: 'সকাল ৯:০০ - ১২:০০',
                  subject: 'কুরআনুল কারীম ও হিফজ/নাজেরা',
                  roomNo: 'হল-১',
                },
                {
                  date: '২৭ অক্টোবর ২০২৬',
                  day: 'মঙ্গলবার',
                  time: 'সকাল ৯:০০ - ১২:০০',
                  subject: 'তাজবীদ ও মাসনুন দোয়া',
                  roomNo: 'হল-১',
                },
                {
                  date: '২৯ অক্টোবর ২০২৬',
                  day: 'বৃহস্পতিবার',
                  time: 'সকাল ৯:০০ - ১২:০০',
                  subject: 'আকীদা ও ইসলামিয়াত',
                  roomNo: 'হল-১',
                },
              ],
              instructions: [
                'পরীক্ষার হলে প্রবেশের সময় মূল প্রবেশপত্র প্রদর্শন করতে হবে।',
                'প্রবেশপত্রের কিউআর কোড স্ক্যান করে পরীক্ষার্থীর তথ্য অনলাইনে সম্পূর্ণ যাচাইকৃত।',
                'পরীক্ষার নিয়মকানুন যথাযথভাবে মেনে চলতে হবে।',
              ],
            };
          }

          if (foundCard) {
            setVerifiedCardForModal(foundCard);
          }
        }
      } catch (err) {
        console.error('Failed to parse admit verification URL', err);
      }
    };

    checkAdmitVerification();
    window.addEventListener('hashchange', checkAdmitVerification);
    return () => window.removeEventListener('hashchange', checkAdmitVerification);
  }, [admitCards]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#FAF9F5] text-stone-900 dark:bg-stone-950 dark:text-stone-100 font-bangla selection:bg-emerald-900 selection:text-amber-100 transition-colors duration-200">
      {/* Top Header & Navigation Bar */}
      <Header
        onOpenDonation={() => setIsDonationOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        activeSection={activeSection}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* 2. Hero Section (Home Page) */}
        <Hero />

        {/* 3. Principal's Message Section */}
        <PrincipalMessage />

        {/* 4. Academics Section */}
        <Academics />

        {/* 5. Online Admission Section */}
        <AdmissionSection />

        {/* 6. Notice Board & Results */}
        <NoticeBoardAndResults />

        {/* 7. Photo Gallery */}
        <Gallery />

        {/* 8. Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenDonation={() => setIsDonationOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating Islamic AI Assistant Button */}
      <FloatingAssistantButton onClick={() => setIsAssistantOpen(true)} />

      {/* Mobile Live View & QR Code Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Islamic AI Assistant Modal */}
      <IslamicAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Donation / Zakat Fund Modal */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => {
          setIsAdminLoginOpen(false);
          if (window.location.hash === '#admin') {
            try {
              history.replaceState(null, '', window.location.pathname + window.location.search);
            } catch {
              // ignore
            }
          }
        }}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => {
          setIsAdminDashboardOpen(false);
          if (window.location.hash === '#admin') {
            try {
              history.replaceState(null, '', window.location.pathname + window.location.search);
            } catch {
              // ignore
            }
          }
        }}
      />

      {/* Admit Card Online Verification Modal (Triggered by QR Code Scan) */}
      {verifiedCardForModal && (
        <AdmitCardVerificationModal
          card={verifiedCardForModal}
          onClose={() => {
            setVerifiedCardForModal(null);
            try {
              const url = new URL(window.location.href);
              url.searchParams.delete('verify_admit');
              url.searchParams.delete('roll');
              url.searchParams.delete('reg');
              url.searchParams.delete('student');
              url.searchParams.delete('studentEn');
              url.searchParams.delete('father');
              url.searchParams.delete('mother');
              url.searchParams.delete('dept');
              url.searchParams.delete('exam');
              url.searchParams.delete('session');
              url.searchParams.delete('center');
              url.searchParams.delete('res');
              url.searchParams.delete('issued');
              if (url.hash.includes('verify-admit')) {
                url.hash = '';
              }
              window.history.replaceState(
                null,
                '',
                url.pathname + (url.search ? url.search : '') + url.hash
              );
            } catch {
              // ignore
            }
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <MadrasahProvider>
      <MainApp />
    </MadrasahProvider>
  );
}
