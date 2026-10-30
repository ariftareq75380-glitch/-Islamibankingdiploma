import React, { useState } from 'react';
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
  Type
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
  openBookmarks,
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

  // Categorized navigation groups with clear icons for fast scanning
  const menuGroups = [
    {
      titleBn: 'পড়ার বিষয় ও সিলেবাস',
      titleEn: 'Study Subjects & Modules',
      items: [
        { 
          tab: 'diploma' as ActiveTab, 
          labelBn: 'ডিআইবি পার্ট ১ ও ২', 
          labelEn: 'DIB Part 1 & 2',
          icon: <GraduationCap className="w-4 h-4 text-emerald-700" />
        },
        { 
          tab: 'previous-questions' as ActiveTab, 
          labelBn: 'বিগত বছরের প্রশ্ন ও সমাধান', 
          labelEn: 'Previous Solved Papers',
          icon: <FileCheck className="w-4 h-4 text-emerald-700" />
        },
        { 
          tab: 'banking' as ActiveTab, 
          labelBn: 'ইসলামিক ব্যাংকিং ও অর্থায়ন', 
          labelEn: 'Islamic Banking & Finance',
          icon: <Building2 className="w-4 h-4 text-blue-700" />
        },
        { 
          tab: 'quran-hadith' as ActiveTab, 
          labelBn: 'কুরআন ও হাদিসে অর্থনৈতিক বিধান', 
          labelEn: 'Quran & Hadith on Finance',
          icon: <BookOpen className="w-4 h-4 text-amber-700" />
        },
        { 
          tab: 'fiqh-fatwa' as ActiveTab, 
          labelBn: 'ফিকহুল মুআমালাত ও ফতোয়া', 
          labelEn: 'Fiqh al-Muamalat & Fatwas',
          icon: <Scale className="w-4 h-4 text-teal-700" />
        },
        { 
          tab: 'pdf-library' as ActiveTab, 
          labelBn: 'সম্পূর্ণ পিডিএফ পাঠাগার', 
          labelEn: 'Full PDF Library',
          icon: <BookMarked className="w-4 h-4 text-stone-700" />
        }
      ]
    },
    {
      titleBn: 'পরীক্ষা ও অনুশীলন',
      titleEn: 'Exam & Practice',
      items: [
        { 
          tab: 'mock-test' as ActiveTab, 
          labelBn: 'মডেল টেস্ট ও MCQ কুইজ', 
          labelEn: 'Mock Test & Quiz',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          isHighlight: true
        },
        { 
          tab: 'articles' as ActiveTab, 
          labelBn: 'ব্যাংকিং প্রবন্ধ ও কলাম', 
          labelEn: 'Banking Articles',
          icon: <Sparkles className="w-4 h-4 text-amber-600" />
        }
      ]
    },
    {
      titleBn: 'সাহায্য ও তথ্য',
      titleEn: 'Help & Information',
      items: [
        { 
          tab: 'bookmarks-view' as ActiveTab, 
          labelBn: 'সংরক্ষিত প্রশ্নসমূহ (বুকমার্ক)', 
          labelEn: 'Saved Questions (Bookmarks)',
          icon: <Bookmark className="w-4 h-4 text-amber-600" />
        },
        { 
          tab: 'faq' as ActiveTab, 
          labelBn: 'সচরাচর জিজ্ঞাসা (FAQ)', 
          labelEn: 'Frequently Asked Questions',
          icon: <HelpCircle className="w-4 h-4 text-blue-600" />
        },
        { 
          tab: 'about' as ActiveTab, 
          labelBn: 'আমাদের সম্পর্কে', 
          labelEn: 'About Us',
          icon: <Info className="w-4 h-4 text-stone-600" />
        },
        { 
          tab: 'contact' as ActiveTab, 
          labelBn: 'যোগাযোগ ও মতামত', 
          labelEn: 'Contact Us',
          icon: <Mail className="w-4 h-4 text-stone-600" />
        }
      ]
    }
  ];

  // Quick primary desktop bar links
  const primaryDesktopLinks = [
    { tab: 'home' as ActiveTab, labelBn: 'হোম', labelEn: 'Home' },
    { tab: 'diploma' as ActiveTab, labelBn: 'ডিআইবি রিসোর্স', labelEn: 'DIB Hub' },
    { tab: 'previous-questions' as ActiveTab, labelBn: 'বিগত প্রশ্ন', labelEn: 'Past Papers' },
    { tab: 'mock-test' as ActiveTab, labelBn: 'অনুশীলন ও কুইজ', labelEn: 'Mock Test', isNew: true },
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Main Top Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Brand Wordmark */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-center shadow-xs group-hover:bg-emerald-800 transition-colors">
              <BookOpen className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors whitespace-nowrap">
                {lang === 'bn' ? siteNameBn : siteName}
              </span>
              <span className="text-[11px] text-stone-500 font-medium tracking-wide hidden sm:block">
                {lang === 'bn' ? 'ডিআইবি পরীক্ষা ও ইসলামী ব্যাংকিং জ্ঞানভাণ্ডার' : 'Islamic Banking Diploma Exam Hub'}
              </span>
            </div>
          </button>

          {/* Desktop Primary Nav */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-stone-600">
            {primaryDesktopLinks.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
                  activeTab === item.tab
                    ? 'text-emerald-800 font-bold border-b-2 border-emerald-800'
                    : 'hover:text-stone-900'
                }`}
              >
                <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                {item.isNew && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    {lang === 'bn' ? 'নতুন' : 'NEW'}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Quick Reading Tools & Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Font Size Adjuster (A-, A, A+) */}
            <button
              onClick={cycleFontSize}
              title={
                lang === 'bn' 
                  ? `ফন্ট সাইজ পরিবর্তন করুন (বর্তমান: ${fontSize.toUpperCase()})` 
                  : `Change reading text size (Current: ${fontSize.toUpperCase()})`
              }
              className="p-1.5 sm:px-2 sm:py-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1 border border-stone-200"
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
              className="p-1.5 sm:px-2 sm:py-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1 border border-stone-200"
            >
              {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
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
              className={`relative p-2 rounded-lg transition-colors border border-stone-200 ${
                activeTab === 'bookmarks-view' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-stone-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              title={lang === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-emerald-900 bg-stone-100 hover:bg-stone-200/80 transition-colors flex items-center gap-1 border border-stone-200"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Admin Management Button (Secret - Only shown when unlocked) */}
            {isAdminVisible && (
              <div className="flex items-center gap-1 bg-emerald-950/20 p-0.5 rounded-md border border-emerald-800/40">
                <button
                  onClick={openAdminModal}
                  title={lang === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-900 rounded-md hover:bg-emerald-800 transition-colors whitespace-nowrap shadow-xs cursor-pointer border border-emerald-800/60"
                >
                  <Lock className="w-3 h-3 text-emerald-300" />
                  <span className="hidden sm:inline">{lang === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
                </button>
                {onHideAdmin && (
                  <button
                    onClick={onHideAdmin}
                    title={lang === 'bn' ? 'অ্যাডমিন বাটন আবার লুকিয়ে ফেলুন' : 'Hide admin button'}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                  >
                    <EyeOff className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg border border-stone-200 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Categorized Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto space-y-5 animate-in slide-in-from-top-2 duration-200">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                <span>{lang === 'bn' ? group.titleBn : group.titleEn}</span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {group.items.map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between ${
                      activeTab === item.tab
                        ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/80 shadow-2xs'
                        : 'text-stone-700 hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-stone-100">
                        {item.icon}
                      </div>
                      <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                    </div>
                    {item.isHighlight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {lang === 'bn' ? 'কুইজ' : 'Quiz'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Mobile Admin Link if visible */}
          {isAdminVisible && (
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => {
                  openAdminModal();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 flex items-center gap-2 flex-1"
              >
                <Lock className="w-4 h-4 text-emerald-800" />
                <span>{lang === 'bn' ? 'অ্যাডমিন পোর্টাল খুলুন' : 'Open Admin Portal'}</span>
              </button>
              {onHideAdmin && (
                <button
                  onClick={() => {
                    onHideAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="ml-2 px-3 py-2 text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  {lang === 'bn' ? 'লুকান' : 'Hide'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
