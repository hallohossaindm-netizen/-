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

function MainApp() {
  const { isAdminLoggedIn } = useMadrasah();
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
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
    } else {
      setIsAdminLoginOpen(true);
    }
  };

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
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
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
