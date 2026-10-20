import React, { useState } from 'react';
import { Phone, Mail, Menu, X, HeartHandshake, Sparkles, BookOpen, Bot, Smartphone, Lock, ShieldCheck, Sun, Moon } from 'lucide-react';
import { MADRASAH_INFO } from '../data/madrasahData';
import { useMadrasah } from '../context/MadrasahContext';

interface HeaderProps {
  onOpenDonation: () => void;
  onOpenAssistant: () => void;
  onOpenShare: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDonation, onOpenAssistant, onOpenShare, onOpenAdmin, activeSection }) => {
  const { isAdminLoggedIn, isDark, toggleTheme } = useMadrasah();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: 'হোম', id: 'home' },
    { href: '#about', label: 'আমাদের কথা', id: 'about' },
    { href: '#academics', label: 'শিক্ষা বিভাগ ও রুটিন', id: 'academics' },
    { href: '#admission', label: 'অনলাইন ভর্তি', id: 'admission' },
    { href: '#notices-results', label: 'নোটিশ ও ফলাফল', id: 'notices-results' },
    { href: '#gallery', label: 'গ্যালারি', id: 'gallery' },
    { href: '#contact', label: 'যোগাযোগ', id: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F5]/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      {/* Top Utility Information Strip */}
      <div className="bg-[#064E3B] text-emerald-50 text-xs px-4 lg:px-8 py-2 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center sm:justify-start">
            <a
              href={`tel:${MADRASAH_INFO.phonePrimary}`}
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-sans font-medium">{MADRASAH_INFO.phonePrimary}</span>
            </a>
            <span className="text-emerald-700 hidden sm:inline" aria-hidden="true">|</span>
            <a
              href={`mailto:${MADRASAH_INFO.email}`}
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors hidden md:flex"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-sans">{MADRASAH_INFO.email}</span>
            </a>
            <span className="text-emerald-700 hidden md:inline" aria-hidden="true">|</span>
            <span className="text-emerald-200/90 hidden lg:inline">
              {MADRASAH_INFO.officeHours}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Theme Toggle Button (Light / Dark Mode) */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded transition-colors shadow-xs cursor-pointer bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 border border-emerald-600/60"
              title={isDark ? 'লাইট মোডে পরিবর্তন করুন (Light Mode)' : 'ডার্ক মোডে পরিবর্তন করুন (Dark Mode)'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">লাইট মোড</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">ডার্ক মোড</span>
                </>
              )}
            </button>

            {/* Mobile Share / QR Code button */}
            <button
              onClick={onOpenShare}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-900 rounded transition-colors shadow-xs cursor-pointer"
              aria-label="মোবাইলে লিংক ও কিউআর কোড"
            >
              <Smartphone className="w-3.5 h-3.5 text-stone-900" />
              <span>মোবাইল লিংক</span>
            </button>

            {/* Desktop / Tablet Utility Buttons */}
            <button
              onClick={onOpenAssistant}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 rounded transition-colors border border-emerald-600/60 cursor-pointer"
              aria-label="তালিমুল কুরআন সহকারী"
            >
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>সহকারী</span>
            </button>
            <button
              onClick={onOpenDonation}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-600 hover:bg-amber-500 text-stone-900 rounded transition-colors shadow-sm cursor-pointer"
              aria-label="দান ও সদাকাহ"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-stone-900" />
              <span>দান ফান্ড</span>
            </button>
            <button
              onClick={onOpenAdmin}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors shadow-xs cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold ring-1 ring-emerald-300'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-amber-200 border border-emerald-700/60'
              }`}
              aria-label={isAdminLoggedIn ? 'এডমিন ড্যাশবোর্ড' : 'এডমিন লগইন'}
            >
              {isAdminLoggedIn ? (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>{isAdminLoggedIn ? 'এডমিন ড্যাশবোর্ড' : 'এডমিন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          className="group flex items-center gap-2.5 sm:gap-3 shrink min-w-0 focus:outline-none"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#064E3B] text-amber-400 flex items-center justify-center font-serif text-lg font-bold shadow-sm ring-1 ring-emerald-800/20 group-hover:bg-[#043d2e] transition-colors shrink-0">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-[#064E3B] dark:text-emerald-400 font-bangla group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors truncate">
              তালিমুল কুরআন মহিলা মাদ্রাসা
            </span>
            <span className="text-[10px] sm:text-[11px] font-sans text-stone-500 dark:text-stone-400 tracking-wider hidden sm:block truncate">
              Talimul Quran Women's Madrasah · ফতেয়াবাদ, চট্টগ্রাম
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden xl:flex items-center gap-6 text-sm font-medium text-stone-700 dark:text-stone-200"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`whitespace-nowrap transition-colors py-1 relative ${
                activeSection === link.id
                  ? 'text-[#064E3B] dark:text-emerald-400 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#064E3B] dark:after:bg-emerald-400'
                  : 'hover:text-[#064E3B] dark:hover:text-emerald-400'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick theme toggle on desktop main nav */}
          <button
            onClick={toggleTheme}
            className="hidden sm:inline-flex p-2 text-stone-700 dark:text-amber-300 hover:text-stone-900 dark:hover:text-amber-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
            title={isDark ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-stone-700" />}
          </button>

          <a
            href="#admission"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043d2e] rounded-md transition-colors shadow-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>ভর্তি আবেদন</span>
          </a>

          {/* Direct Admin Access Button (visible on both Laptop and Mobile) */}
          <button
            onClick={onOpenAdmin}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-xs ${
              isAdminLoggedIn
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white ring-1 ring-emerald-400'
                : 'bg-emerald-950 text-amber-300 border border-emerald-700/80 hover:bg-emerald-900'
            }`}
            title={isAdminLoggedIn ? 'এডমিন ড্যাশবোর্ড খুলুন (Laptop ও Mobile)' : 'এডমিন লগইন করুন (Laptop ও Mobile)'}
            aria-label="এডমিন প্যানেল"
          >
            {isAdminLoggedIn ? <ShieldCheck className="w-4 h-4 text-amber-300" /> : <Lock className="w-4 h-4 text-amber-300" />}
            <span className="font-bangla">{isAdminLoggedIn ? 'ড্যাশবোর্ড' : 'এডমিন'}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 dark:border-stone-800 bg-[#FAF9F5] dark:bg-stone-900 px-4 py-4 space-y-1 shadow-lg animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200 dark:border-stone-800">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 font-bangla">থিম মোড পরিবর্তন:</span>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-amber-300 shadow-xs cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>লাইট মোড চালু করুন</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-700" />
                  <span>ডার্ক মোড চালু করুন</span>
                </>
              )}
            </button>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-[#064E3B] dark:hover:text-emerald-300 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShare();
              }}
              className="w-full text-center px-4 py-2 text-sm font-semibold text-stone-900 bg-amber-300 hover:bg-amber-400 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Smartphone className="w-4 h-4 text-stone-900" />
              <span>মোবাইলে খুলুন ও শেয়ার করুন (QR Code)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssistant();
              }}
              className="w-full text-center px-4 py-2 text-sm font-medium text-emerald-950 dark:text-emerald-100 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-[#064E3B] dark:text-amber-300" />
              <span>তালিমুল কুরআন সহকারী (AI Assistant)</span>
            </button>
            <a
              href="#admission"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#043d2e] rounded-md transition-colors"
            >
              অনলাইন ভর্তি আবেদন
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonation();
              }}
              className="w-full text-center px-4 py-2 text-sm font-medium text-amber-900 dark:text-amber-100 bg-amber-100 dark:bg-amber-950/70 hover:bg-amber-200 dark:hover:bg-amber-900 rounded-md transition-colors"
            >
              দান ও সাদাকাহ ফান্ড
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className={`w-full text-center px-4 py-2.5 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                isAdminLoggedIn
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200'
              }`}
            >
              {isAdminLoggedIn ? (
                <ShieldCheck className="w-4 h-4 text-amber-300" />
              ) : (
                <Lock className="w-4 h-4 text-stone-700 dark:text-amber-300" />
              )}
              <span>{isAdminLoggedIn ? 'এডমিন ড্যাশবোর্ড (লগইন করা)' : 'মাদ্রাসা এডমিন লগইন'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
