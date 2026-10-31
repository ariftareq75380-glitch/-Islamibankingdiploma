import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  BookOpen, 
  Menu, 
  X, 
  Languages, 
  FileText,
  Search,
  Bookmark,
  Moon,
  Sun,
  Coffee,
  Calendar,
  Clock,
  Lock,
  EyeOff,
  GraduationCap,
  Building2,
  Scale,
  CheckCircle2,
  HelpCircle,
  Info,
  Mail,
  Sparkles,
  BookMarked,
  FileCheck,
  Type,
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  openAdminModal: () => void;
  openBlueprintModal?: () => void;
  bookmarkedCount: number;
  openBookmarks: () => void;
  siteName: string;
  siteNameBn: string;
  isAdminVisible?: boolean;
  onHideAdmin?: () => void;
  theme: 'light' | 'sepia' | 'dark';
  onThemeChange: (theme: 'light' | 'sepia' | 'dark') => void;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  onFontSizeChange: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  openAdminModal,
  bookmarkedCount,
  siteName,
  siteNameBn,
  isAdminVisible,
  onHideAdmin,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on Escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Grouped navigation links: 1. Exam Preparation, 2. Study Resources, 3. Help & Information
  const menuGroups = [
    {
      titleBn: 'পরীক্ষা প্রস্তুতি',
      titleEn: 'Exam Preparation',
      items: [
        { 
          tab: 'diploma' as ActiveTab, 
          labelBn: 'ডিআইবি পার্ট ১ ও ২', 
          labelEn: 'DIB Part 1 & 2',
          icon: <GraduationCap className="w-4 h-4 text-emerald-700" />,
          descBn: 'সিলেবাস, হ্যান্ডনোট ও পূর্ণাঙ্গ গাইডলাইন'
        },
        { 
          tab: 'previous-questions' as ActiveTab, 
          labelBn: 'বিগত বছরের প্রশ্ন ও সমাধান', 
          labelEn: 'Previous Solved Papers',
          icon: <FileCheck className="w-4 h-4 text-emerald-700" />,
          descBn: '২০১৮–২০২৪ সালের অফিশিয়াল প্রশ্ন ও মডেল উত্তর'
        },
        { 
          tab: 'mock-test' as ActiveTab, 
          labelBn: 'মডেল টেস্ট ও অনুশীলন কুইজ', 
          labelEn: 'Mock Test & Practice',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          descBn: 'টাইমার সহ রিয়েল-টাইম সেলফ অ্যাসেসমেন্ট',
          isHighlight: true
        }
      ]
    },
    {
      titleBn: 'অধ্যয়ন ও রেফারেন্স',
      titleEn: 'Study Resources',
      items: [
        { 
          tab: 'banking' as ActiveTab, 
          labelBn: 'ইসলামিক ব্যাংকিং ও অর্থায়ন', 
          labelEn: 'Islamic Banking & Finance',
          icon: <Building2 className="w-4 h-4 text-emerald-700" />,
          descBn: 'মুদারাবা, মুশারাকা ও আধুনিক ব্যাংকিং নীতিমালা'
        },
        { 
          tab: 'pdf-library' as ActiveTab, 
          labelBn: 'সম্পূর্ণ উন্মুক্ত পিডিএফ পাঠাগার', 
          labelEn: 'Master PDF Library',
          icon: <BookMarked className="w-4 h-4 text-teal-700" />,
          descBn: 'আইবিবি অনুমোদিত সকল শিক্ষামূলক বই ও নোট'
        },
        { 
          tab: 'quran-hadith' as ActiveTab, 
          labelBn: 'কুরআন ও হাদিসে অর্থনৈতিক বিধান', 
          labelEn: 'Quran & Hadith on Finance',
          icon: <BookOpen className="w-4 h-4 text-amber-700" />,
          descBn: 'মুআমালাত সংক্রান্ত কোরআনের আয়াত ও সহীহ হাদিস'
        },
        { 
          tab: 'fiqh-fatwa' as ActiveTab, 
          labelBn: 'ফিকহুল মুআমালাত ও ফতোয়া', 
          labelEn: 'Fiqh al-Muamalat & Fatwas',
          icon: <Scale className="w-4 h-4 text-emerald-800" />,
          descBn: 'সেন্ট্রাল শরীয়াহ বোর্ডের গুরুত্বপূর্ণ সিদ্ধান্ত'
        },
        { 
          tab: 'articles' as ActiveTab, 
          labelBn: 'ব্যাংকিং প্রবন্ধ ও কলাম', 
          labelEn: 'Banking Articles & Columns',
          icon: <Sparkles className="w-4 h-4 text-amber-600" />,
          descBn: 'বিশেষজ্ঞ ব্যাংকারদের দ্বিভাষিক গবেষণাপত্র'
        }
      ]
    },
    {
      titleBn: 'সাহায্য ও তথ্য',
      titleEn: 'Help & Information',
      items: [
        { 
          tab: 'bookmarks-view' as ActiveTab, 
          labelBn: 'সংরক্ষিত প্রশ্ন ও বই (Bookmarks)', 
          labelEn: 'Saved Questions (Bookmarks)',
          icon: <Bookmark className="w-4 h-4 text-amber-600" />,
          descBn: 'আপনার বুকমার্ক করা সকল প্রয়োজনীয় ডকুমেন্ট'
        },
        { 
          tab: 'faq' as ActiveTab, 
          labelBn: 'সচরাচর জিজ্ঞাসা (FAQ)', 
          labelEn: 'Frequently Asked Questions',
          icon: <HelpCircle className="w-4 h-4 text-blue-600" />,
          descBn: 'ডিআইবি রেজিস্ট্রেশন ও পরীক্ষা সংক্রান্ত প্রশ্ন'
        },
        { 
          tab: 'about' as ActiveTab, 
          labelBn: 'আমাদের সম্পর্কে', 
          labelEn: 'About Us',
          icon: <Info className="w-4 h-4 text-stone-600" />,
          descBn: 'ওয়েবসাইটের লক্ষ্য ও শিক্ষামূলক উদ্দেশ্য'
        },
        { 
          tab: 'contact' as ActiveTab, 
          labelBn: 'যোগাযোগ ও মতামত', 
          labelEn: 'Contact Us',
          icon: <Mail className="w-4 h-4 text-stone-600" />,
          descBn: 'কোনো প্রশ্ন বা নোটস পাঠানোর জন্য'
        }
      ]
    }
  ];

  // Primary desktop bar links
  const primaryDesktopLinks = [
    { tab: 'home' as ActiveTab, labelBn: 'হোম', labelEn: 'Home' },
    { tab: 'diploma' as ActiveTab, labelBn: 'ডিআইবি রিসোর্স', labelEn: 'DIB Hub' },
    { tab: 'previous-questions' as ActiveTab, labelBn: 'বিগত প্রশ্ন', labelEn: 'Past Papers' },
    { tab: 'mock-test' as ActiveTab, labelBn: 'মডেল টেস্ট', labelEn: 'Mock Test', isNew: true },
    { tab: 'pdf-library' as ActiveTab, labelBn: 'পাঠাগার', labelEn: 'Library' },
    { tab: 'faq' as ActiveTab, labelBn: 'এফএকিউ', labelEn: 'FAQ' },
  ];

  const cycleTheme = () => {
    if (theme === 'light') onThemeChange('sepia');
    else if (theme === 'sepia') onThemeChange('dark');
    else onThemeChange('light');
  };

  const cycleFontSize = () => {
    if (fontSize === 'sm') onFontSizeChange('base');
    else if (fontSize === 'base') onFontSizeChange('lg');
    else if (fontSize === 'lg') onFontSizeChange('xl');
    else onFontSizeChange('sm');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
      {/* Main Top Navigation Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-15 sm:h-16">
          
          {/* Left: Menu Button + Logo & Brand Wordmark Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Left Menu Button (Bringing menu bar to the left side as requested) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-stone-700 hover:text-[#14532D] rounded-lg border border-stone-200 hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer"
              aria-label={lang === 'bn' ? (mobileMenuOpen ? 'মেনু বন্ধ করুন' : 'মেনু বার খুলুন') : (mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu')}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              title={lang === 'bn' ? 'মেনু বার খুলুন' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#14532D]" /> : <Menu className="w-5 h-5 text-[#14532D]" />}
            </button>

            {/* Logo & Brand Wordmark Area */}
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 sm:gap-3 text-left shrink-0 group focus:outline-none"
            >
              {/* Islamic Emblem Icon with restrained gold accent */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#14532D] via-[#047857] to-[#064e3b] text-white flex items-center justify-center shadow-xs border border-[#D4AF37]/40 group-hover:border-[#D4AF37] transition-all">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-100" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D4AF37] ring-1 ring-white" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-base md:text-lg font-bold tracking-tight text-[#14532D] group-hover:text-[#047857] transition-colors whitespace-nowrap font-bengali">
                    {lang === 'bn' ? siteNameBn : siteName}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium tracking-wide hidden sm:block font-bengali">
                  {lang === 'bn' ? 'ডিআইবি পরীক্ষা ও উন্মুক্ত জ্ঞান পাঠাগার' : 'Islamic Banking Diploma Academic Hub'}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Primary Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            {primaryDesktopLinks.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 font-bengali ${
                  activeTab === item.tab
                    ? 'text-[#047857] font-bold border-b-2 border-[#047857]'
                    : 'hover:text-[#14532D]'
                }`}
              >
                <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                {item.isNew && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#D4AF37]/15 text-[#14532D] border border-[#D4AF37]/40">
                    {lang === 'bn' ? 'কুইজ' : 'NEW'}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Quick Reading Tools & Action Bar */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Font Size Adjuster (A-, A, A+) */}
            <button
              onClick={cycleFontSize}
              title={
                lang === 'bn' 
                  ? `ফন্ট সাইজ পরিবর্তন করুন (বর্তমান: ${fontSize.toUpperCase()})` 
                  : `Change reading text size (Current: ${fontSize.toUpperCase()})`
              }
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-stone-600 hover:text-[#14532D] hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1 border border-stone-200 transition-colors"
            >
              <Type className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline uppercase text-[11px]">{fontSize}</span>
            </button>

            {/* Theme Toggle (Light / Sepia Cream / Dark) */}
            <button
              onClick={cycleTheme}
              title={
                lang === 'bn' 
                  ? `থিম পরিবর্তন (বর্তমান: ${theme === 'sepia' ? 'আই-কেয়ার ক্রিম' : theme === 'dark' ? 'নাইট ডার্ক' : 'লাইট'})` 
                  : `Toggle theme (Current: ${theme})`
              }
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-stone-600 hover:text-[#14532D] hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1 border border-stone-200 transition-colors"
            >
              {theme === 'light' && <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />}
              {theme === 'sepia' && <Coffee className="w-3.5 h-3.5 text-amber-700" />}
              {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              <span className="hidden sm:inline text-[11px]">
                {theme === 'light' ? (lang === 'bn' ? 'লাইট' : 'Light') : 
                 theme === 'sepia' ? (lang === 'bn' ? 'ক্রিম' : 'Sepia') : 
                 (lang === 'bn' ? 'ডার্ক' : 'Dark')}
              </span>
            </button>

            {/* Bookmarks Page Trigger */}
            <button
              onClick={() => setActiveTab('bookmarks-view')}
              title={lang === 'bn' ? 'সংরক্ষিত প্রশ্ন ও বই' : 'Bookmarks'}
              className={`relative p-2 rounded-lg transition-colors border ${
                activeTab === 'bookmarks-view' 
                  ? 'bg-emerald-50 text-[#047857] border-emerald-300' 
                  : 'text-stone-600 hover:text-[#047857] hover:bg-emerald-50 border-stone-200'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#047857] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              title={lang === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
              className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-[#047857] bg-stone-100 hover:bg-emerald-50 transition-colors flex items-center gap-1 border border-stone-200"
            >
              <Languages className="w-3.5 h-3.5 text-[#047857]" />
              <span className="font-semibold">{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Admin Management Button (Secret - Only shown when unlocked) */}
            {isAdminVisible && (
              <div className="flex items-center gap-1 bg-emerald-950/20 p-0.5 rounded-md border border-emerald-800/40">
                <button
                  onClick={openAdminModal}
                  title={lang === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-[#14532D] rounded-md hover:bg-[#047857] transition-colors whitespace-nowrap shadow-xs cursor-pointer border border-[#D4AF37]/40"
                >
                  <Lock className="w-3 h-3 text-[#D4AF37]" />
                  <span className="hidden sm:inline">{lang === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
                </button>
                {onHideAdmin && (
                  <button
                    onClick={onHideAdmin}
                    title={lang === 'bn' ? 'অ্যাডমিন বাটন লুকান' : 'Hide admin button'}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                  >
                    <EyeOff className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      </header>

      {/* Left Sidebar Navigation Drawer (Rendered via Portal to avoid header backdrop-blur clipping) */}
      {typeof document !== 'undefined' && mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex font-bengali">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Left-side Drawer Panel */}
          <div 
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'bn' ? 'প্রধান ন্যাভিগেশন মেনু' : 'Main Navigation'}
            className="relative w-80 max-w-[85vw] bg-white h-screen shadow-2xl flex flex-col z-[10000] animate-in slide-in-from-left duration-250 border-r border-stone-200"
          >
            {/* Drawer Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#14532D] to-[#047857] text-white flex items-center justify-between border-b border-emerald-900 shadow-xs shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">{lang === 'bn' ? siteNameBn : siteName}</div>
                  <div className="text-[10px] text-emerald-200">{lang === 'bn' ? 'বাম পাশের প্রধান মেনু' : 'Portal Navigation'}</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={lang === 'bn' ? 'মেনু বন্ধ করুন' : 'Close Menu'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable menu links */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 bg-white min-h-0">
              {menuGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1.5">
                  {/* Group Title with Gold Accent Indicator */}
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span className="text-stone-700">{lang === 'bn' ? group.titleBn : group.titleEn}</span>
                  </div>

                  {/* Group Items */}
                  <div className="grid grid-cols-1 gap-1">
                    {group.items.map((item) => (
                      <button
                        key={item.tab}
                        onClick={() => {
                          setActiveTab(item.tab);
                          setMobileMenuOpen(false);
                        }}
                        className={`text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between min-h-[44px] cursor-pointer ${
                          activeTab === item.tab
                            ? 'bg-emerald-50 text-[#14532D] font-bold border border-emerald-300 shadow-2xs'
                            : 'text-stone-700 hover:bg-stone-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === item.tab ? 'bg-emerald-100 text-[#047857]' : 'bg-stone-100 text-stone-600'}`}>
                            {item.icon}
                          </div>
                          <div className="truncate">
                            <div className="font-semibold truncate leading-snug">
                              {lang === 'bn' ? item.labelBn : item.labelEn}
                            </div>
                            {item.descBn && (
                              <div className="text-[10px] text-stone-500 font-normal truncate">
                                {lang === 'bn' ? item.descBn : ''}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {item.isHighlight && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#14532D] border border-[#D4AF37]/40">
                              {lang === 'bn' ? 'কুইজ' : 'Quiz'}
                            </span>
                          )}
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Mobile Admin Link if visible */}
              {isAdminVisible && (
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <button
                    onClick={() => {
                      openAdminModal();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#14532D] hover:bg-[#047857] flex items-center justify-center gap-2 flex-1 shadow-xs cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#D4AF37]" />
                    <span>{lang === 'bn' ? 'অ্যাডমিন পোর্টাল খুলুন' : 'Open Admin Portal'}</span>
                  </button>
                  {onHideAdmin && (
                    <button
                      onClick={() => {
                        onHideAdmin();
                        setMobileMenuOpen(false);
                      }}
                      className="ml-2 px-3 py-2 text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                    >
                      {lang === 'bn' ? 'লুকান' : 'Hide'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
