import React, { useState, useEffect, useRef } from 'react';
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
  ChevronRight,
  ChevronDown,
  Calculator
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNavigateUrl?: (url: string) => void;
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
  onNavigateUrl,
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
  const [activeDropdown, setActiveDropdown] = useState<'dib-exam' | 'articles' | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path: string, tab?: ActiveTab) => {
    setActiveDropdown(null);
    if (onNavigateUrl) {
      onNavigateUrl(path);
    } else if (tab) {
      setActiveTab(tab);
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

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

  interface DrawerMenuItem {
    tab: ActiveTab;
    labelBn: string;
    labelEn: string;
    icon: React.ReactNode;
    descBn: string;
    isHighlight?: boolean;
    href?: string;
  }

  interface DrawerMenuGroup {
    titleBn: string;
    titleEn: string;
    items: DrawerMenuItem[];
  }

  // Navigation groups for drawer: Help & Information group kept
  const menuGroups: DrawerMenuGroup[] = [
    {
      titleBn: 'সাহায্য ও তথ্য',
      titleEn: 'Help & Information',
      items: [
        { 
          tab: 'zakat-calculator' as ActiveTab, 
          labelBn: 'যাকাত ক্যালকুলেটর', 
          labelEn: 'Zakat Calculator',
          icon: <Calculator className="w-4 h-4 text-emerald-700" />,
          descBn: 'নিসাব ও যাকাত হিসাবের ডিজিটাল ক্যালকুলেটর',
          href: '/zakat-calculator'
        },
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

  // Primary desktop bar links (duplicates removed: DIB Hub & Library now handled by DIB Exam & PDF Corner)
  const primaryDesktopLinks = [
    { tab: 'home' as ActiveTab, labelBn: 'হোম', labelEn: 'Home' },
    { tab: 'previous-questions' as ActiveTab, labelBn: 'বিগত প্রশ্ন', labelEn: 'Past Papers' },
    { tab: 'mock-test' as ActiveTab, labelBn: 'মডেল টেস্ট', labelEn: 'Mock Test', isNew: true },
    { tab: 'zakat-calculator' as ActiveTab, labelBn: 'যাকাত ক্যালকুলেটর', labelEn: 'Zakat Calculator' },
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
          <nav 
            ref={dropdownRef}
            className="hidden lg:flex items-center gap-3 xl:gap-4 text-xs xl:text-sm font-medium text-stone-600"
            aria-label="Main Navigation"
          >
            {/* 1. DIB Exam Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'dib-exam' ? null : 'dib-exam')}
                onMouseEnter={() => setActiveDropdown('dib-exam')}
                aria-expanded={activeDropdown === 'dib-exam'}
                className="py-1 px-2 rounded-lg hover:text-[#14532D] hover:bg-emerald-50/70 transition-colors flex items-center gap-1 font-bengali font-semibold text-stone-700 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'ডিআইবি পরীক্ষা' : 'DIB Exam'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${activeDropdown === 'dib-exam' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'dib-exam' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute left-0 top-full mt-1 w-56 rounded-xl bg-white shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 font-bengali"
                >
                  <button
                    onClick={() => handleNavigate('/articles?menu=dib-part-1', 'articles')}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 hover:text-[#14532D] flex items-center justify-between text-stone-700 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold">{lang === 'bn' ? 'ডিআইবি পার্ট ১ (DIB Part 1)' : 'DIB Part 1'}</div>
                      <div className="text-[10px] text-stone-400">/articles?menu=dib-part-1</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                  </button>
                  <button
                    onClick={() => handleNavigate('/articles?menu=dib-part-2', 'articles')}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 hover:text-[#14532D] flex items-center justify-between text-stone-700 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold">{lang === 'bn' ? 'ডিআইবি পার্ট ২ (DIB Part 2)' : 'DIB Part 2'}</div>
                      <div className="text-[10px] text-stone-400">/articles?menu=dib-part-2</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                  </button>
                </div>
              )}
            </div>

            {/* 2. PDF Corner Direct Link */}
            <button
              onClick={() => handleNavigate('/pdf-library', 'pdf-library')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 px-2 rounded-lg flex items-center gap-1.5 font-bengali cursor-pointer ${
                activeTab === 'pdf-library'
                  ? 'text-[#047857] font-bold bg-emerald-50/80 border-b-2 border-[#047857]'
                  : 'text-stone-700 hover:text-[#14532D] hover:bg-emerald-50/70 font-semibold'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5 text-teal-700" />
              <span>{lang === 'bn' ? 'পিডিএফ কর্নার' : 'PDF Corner'}</span>
            </button>

            {/* 3. Articles Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'articles' ? null : 'articles')}
                onMouseEnter={() => setActiveDropdown('articles')}
                aria-expanded={activeDropdown === 'articles'}
                className="py-1 px-2 rounded-lg hover:text-[#14532D] hover:bg-emerald-50/70 transition-colors flex items-center gap-1 font-bengali font-semibold text-stone-700 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'আর্টিকেলসমূহ' : 'Articles'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${activeDropdown === 'articles' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'articles' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute left-0 top-full mt-1 w-60 rounded-xl bg-white shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 font-bengali"
                >
                  <button
                    onClick={() => handleNavigate('/articles?menu=islamic-economics', 'articles')}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 hover:text-[#14532D] flex items-center justify-between text-stone-700 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold">{lang === 'bn' ? 'ইসলামিক অর্থনীতি' : 'Islamic Economics'}</div>
                      <div className="text-[10px] text-stone-400">/articles?menu=islamic-economics</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                  </button>
                  <button
                    onClick={() => handleNavigate('/articles?menu=islamic-essays', 'articles')}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 hover:text-[#14532D] flex items-center justify-between text-stone-700 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold">{lang === 'bn' ? 'ইসলামিক প্রবন্ধ' : 'Islamic Essays'}</div>
                      <div className="text-[10px] text-stone-400">/articles?menu=islamic-essays</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                  </button>
                  <button
                    onClick={() => handleNavigate('/articles?menu=miscellaneous', 'articles')}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 hover:text-[#14532D] flex items-center justify-between text-stone-700 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold">{lang === 'bn' ? 'বিবিধ' : 'Miscellaneous'}</div>
                      <div className="text-[10px] text-stone-400">/articles?menu=miscellaneous</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                  </button>
                </div>
              )}
            </div>

            {/* Subtle Divider between new structure and existing links */}
            <div className="h-4 w-px bg-stone-200 mx-0.5" aria-hidden="true" />

            {/* Existing Menu Links Kept Intact */}
            {primaryDesktopLinks.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNavigate(`/${item.tab === 'home' ? '' : item.tab}`, item.tab)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 font-bengali cursor-pointer ${
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

            {/* Admin Management Button */}
            {isAdminVisible && (
              <div className="flex items-center gap-1 bg-emerald-950/20 p-0.5 rounded-md border border-emerald-800/40">
                <button
                  onClick={() => {
                    if (onNavigateUrl) {
                      onNavigateUrl('/admin');
                    } else {
                      openAdminModal();
                    }
                  }}
                  title={lang === 'bn' ? 'অ্যাডমিন পোর্টাল (/admin)' : 'Admin Portal (/admin)'}
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
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white min-h-0">
              
              {/* 1. New Menu Structure Required */}
              <div className="space-y-1.5 pb-3 border-b border-stone-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 px-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>{lang === 'bn' ? 'প্রধান মেনু' : 'Primary Menu'}</span>
                </div>

                {/* DIB Exam Item with Nested Sub-items */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-2 space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-[#14532D]">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-700" />
                      <span>{lang === 'bn' ? 'ডিআইবি পরীক্ষা (DIB Exam)' : 'DIB Exam'}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold px-1.5 py-0.5 rounded bg-emerald-100">
                      ২টি পার্ট
                    </span>
                  </div>
                  <div className="pl-6 pr-1 space-y-1">
                    <button
                      onClick={() => {
                        handleNavigate('/articles?menu=dib-part-1', 'articles');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:text-[#14532D] hover:bg-emerald-100/70 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'ডিআইবি পার্ট ১ (DIB Part 1)' : 'DIB Part 1'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                    <button
                      onClick={() => {
                        handleNavigate('/articles?menu=dib-part-2', 'articles');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:text-[#14532D] hover:bg-emerald-100/70 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'ডিআইবি পার্ট ২ (DIB Part 2)' : 'DIB Part 2'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  </div>
                </div>

                {/* PDF Corner Link */}
                <button
                  onClick={() => {
                    handleNavigate('/pdf-library', 'pdf-library');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-between min-h-[42px] cursor-pointer text-stone-800 hover:bg-stone-50 border border-stone-200/80"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                      <BookMarked className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 leading-snug">
                        {lang === 'bn' ? 'পিডিএফ কর্নার (PDF Corner)' : 'PDF Corner'}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {lang === 'bn' ? 'উন্মুক্ত বই ও বিগত প্রশ্নপত্র পাঠাগার' : 'Open /pdf-library'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {/* Articles Item with Nested Sub-items */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-2 space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-stone-900">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'bn' ? 'আর্টিকেলসমূহ (Articles)' : 'Articles'}</span>
                    </div>
                    <span className="text-[10px] text-amber-800 font-semibold px-1.5 py-0.5 rounded bg-amber-100">
                      ৩টি বিভাগ
                    </span>
                  </div>
                  <div className="pl-6 pr-1 space-y-1">
                    <button
                      onClick={() => {
                        handleNavigate('/articles?menu=islamic-economics', 'articles');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:text-amber-900 hover:bg-amber-100/60 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'ইসলামিক অর্থনীতি (Islamic Economics)' : 'Islamic Economics'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                    <button
                      onClick={() => {
                        handleNavigate('/articles?menu=islamic-essays', 'articles');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:text-amber-900 hover:bg-amber-100/60 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'ইসলামিক প্রবন্ধ (Islamic Essays)' : 'Islamic Essays'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                    <button
                      onClick={() => {
                        handleNavigate('/articles?menu=miscellaneous', 'articles');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:text-amber-900 hover:bg-amber-100/60 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'বিবিধ (Miscellaneous)' : 'Miscellaneous'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. All Existing Menu Groups Kept Intact */}
              {menuGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1.5">
                  {/* Group Title with Gold Accent Indicator */}
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span className="text-stone-700">{lang === 'bn' ? group.titleBn : group.titleEn}</span>
                  </div>

                  {/* Group Items */}
                  <div className="grid grid-cols-1 gap-1">
                    {group.items.map((item) => {
                      const itemHref = item.href || (item.tab === 'home' ? '/' : `/${item.tab}`);
                      return (
                        <a
                          key={item.tab}
                          href={itemHref}
                          onClick={(e) => {
                            e.preventDefault();
                            if (item.href) {
                              handleNavigate(item.href, item.tab);
                            } else {
                              setActiveTab(item.tab);
                            }
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
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Mobile Admin Link if visible */}
              {isAdminVisible && (
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (onNavigateUrl) {
                        onNavigateUrl('/admin');
                      } else {
                        openAdminModal();
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#14532D] hover:bg-[#047857] flex items-center justify-center gap-2 flex-1 shadow-xs cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#D4AF37]" />
                    <span>{lang === 'bn' ? 'অ্যাডমিন পোর্টাল খুলুন (/admin)' : 'Open Admin Portal (/admin)'}</span>
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
