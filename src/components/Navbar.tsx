import React, { useState } from 'react';
import { 
  BookOpen, 
  Menu, 
  X, 
  Languages, 
  SlidersHorizontal,
  FileText,
  Search,
  Bookmark,
  Moon,
  Calendar,
  Clock,
  Lock
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  openAdminModal: () => void;
  openBlueprintModal: () => void;
  openCalendarModal: () => void;
  openPrayerModal: () => void;
  bookmarkedCount: number;
  openBookmarks: () => void;
  onSearchFocus?: () => void;
  siteName: string;
  siteNameBn: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  openAdminModal,
  openBlueprintModal,
  openCalendarModal,
  openPrayerModal,
  bookmarkedCount,
  openBookmarks,
  siteName,
  siteNameBn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { tab: ActiveTab; labelEn: string; labelBn: string }[] = [
    { tab: 'home', labelEn: 'Home', labelBn: 'হোম' },
    { tab: 'diploma', labelEn: 'DIB Resources', labelBn: 'ডিআইবি রিসোর্স' },
    { tab: 'previous-questions', labelEn: 'Past Questions', labelBn: 'বিগত প্রশ্ন' },
    { tab: 'pdf-library', labelEn: 'PDF Library', labelBn: 'পিডিএফ লাইব্রেরি' },
    { tab: 'articles', labelEn: 'Articles', labelBn: 'প্রবন্ধ ও কলাম' },
  ];

  const fullCategories: { tab: ActiveTab; labelEn: string; labelBn: string }[] = [
    { tab: 'banking', labelEn: 'Islamic Banking', labelBn: 'ইসলামী ব্যাংকিং' },
    { tab: 'diploma', labelEn: 'Diploma in Islamic Banking', labelBn: 'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং' },
    { tab: 'previous-questions', labelEn: 'Previous Year Questions', labelBn: 'বিগত বছরের প্রশ্ন' },
    { tab: 'islamic-studies', labelEn: 'Islamic Studies', labelBn: 'ইসলামী শিক্ষা' },
    { tab: 'quran-hadith', labelEn: 'Quran & Hadith', labelBn: 'কুরআন ও হাদিস' },
    { tab: 'fiqh-fatwa', labelEn: 'Fiqh & Fatwa', labelBn: 'ফিকহ ও ফতোয়া' },
    { tab: 'pdf-library', labelEn: 'Full PDF Library', labelBn: 'সম্পূর্ণ পাঠাগার' },
    { tab: 'articles', labelEn: 'Articles (বাংলা/EN)', labelBn: 'ব্যাংকিং প্রবন্ধ' },
    { tab: 'about', labelEn: 'About Us', labelBn: 'আমাদের সম্পর্কে' },
    { tab: 'contact', labelEn: 'Contact Us', labelBn: 'যোগাযোগ' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Notice Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-emerald-400">
              {lang === 'bn' ? 'বিশেষ বিজ্ঞপ্তি:' : 'Exam Notice:'}
            </span>
            <span className="truncate">
              {lang === 'bn' 
                ? 'আইবিবি (IBB) ডিপ্লোমা ইন ইসলামিক ব্যাংকিং ৯৯তম পরীক্ষার প্রস্তুতিমূলক প্রশ্নোত্তর ও মাস্টার নোটস উন্মুক্ত।'
                : 'IBB Diploma in Islamic Banking 99th exam guide & model solutions now accessible.'}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs text-emerald-200">
            <button 
              onClick={openPrayerModal}
              className="hover:text-white flex items-center gap-1 transition-colors"
              title={lang === 'bn' ? 'জেলাভেদে হানাফী নামাজের সময়সূচি' : 'District-wise Hanafi Prayer Times'}
            >
              <Clock className="w-3 h-3 text-emerald-300" />
              <span>{lang === 'bn' ? 'নামাজের সময়' : 'Prayer Times'}</span>
            </button>
            <span className="hidden sm:inline text-emerald-600">|</span>
            <button 
              onClick={openCalendarModal}
              className="hover:text-white flex items-center gap-1 transition-colors"
              title={lang === 'bn' ? 'হিজরি ও বঙ্গাব্দ ক্যালেন্ডার' : 'Islamic & Bengali Calendar'}
            >
              <Moon className="w-3 h-3 text-emerald-300" />
              <span>{lang === 'bn' ? 'হিজরি ক্যালেন্ডার' : 'Islamic Calendar'}</span>
            </button>
            <span className="hidden sm:inline text-emerald-600">|</span>
            <button 
              onClick={openBlueprintModal}
              className="hover:text-white underline underline-offset-2 flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>{lang === 'bn' ? 'ওয়ার্ডপ্রেস ব্লুপ্রিন্ট' : 'WP Blueprint'}</span>
            </button>
            <span className="hidden sm:inline text-emerald-600">|</span>
            <button 
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 hover:text-white font-medium transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract (Zone 1 - Zone 2 - Zone 3) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element brand wordmark */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-900 text-emerald-100 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors whitespace-nowrap">
                {lang === 'bn' ? siteNameBn : siteName}
              </span>
              <span className="text-[11px] text-stone-500 font-medium tracking-wide hidden sm:block">
                {lang === 'bn' ? 'ডিআইবি পরীক্ষা ও ইসলামী ব্যাংকিং পাঠাগার' : 'Islamic Educational & Banking PDF Library'}
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 Nav links, single line */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navLinks.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                  activeTab === item.tab
                    ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                    : 'hover:text-stone-900'
                }`}
              >
                {lang === 'bn' ? item.labelBn : item.labelEn}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action + Quick Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Bookmarks */}
            <button
              onClick={openBookmarks}
              title={lang === 'bn' ? 'বুকমার্কসমূহ' : 'Bookmarks'}
              className="relative p-2 text-stone-600 hover:text-emerald-800 rounded-md hover:bg-stone-100 transition-colors"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Admin Management Button (PIN Protected) */}
            <button
              onClick={openAdminModal}
              title={lang === 'bn' ? 'অ্যাডমিন পোর্টাল (পিন সুরক্ষিত)' : 'Admin Portal (PIN Protected)'}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-900 rounded-md hover:bg-emerald-800 transition-colors whitespace-nowrap shadow-xs cursor-pointer border border-emerald-800/60"
            >
              <Lock className="w-3 h-3 text-emerald-300" />
              <span>{lang === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Category Sub-Nav for quick subject access on Desktop */}
      <div className="hidden lg:block bg-stone-50/80 border-t border-stone-200/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 overflow-x-auto py-2 scrollbar-none text-stone-600">
          <span className="font-semibold text-emerald-900 shrink-0">
            {lang === 'bn' ? 'প্রধান ক্যাটাগরি:' : 'Explore:'}
          </span>
          {fullCategories.slice(0, 7).map((cat) => (
            <button
              key={cat.tab}
              onClick={() => setActiveTab(cat.tab)}
              className={`whitespace-nowrap hover:text-emerald-800 transition-colors ${
                activeTab === cat.tab ? 'text-emerald-800 font-semibold' : ''
              }`}
            >
              {lang === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('articles')}
            className="whitespace-nowrap text-amber-800 font-medium hover:underline ml-auto shrink-0"
          >
            {lang === 'bn' ? '★ ব্যাংকিং কলাম ও প্রবন্ধ' : '★ Banking Articles'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 px-2">
            {lang === 'bn' ? 'মেনু নেভিগেশন' : 'Navigation Menu'}
          </div>
          <div className="grid grid-cols-1 gap-1">
            {fullCategories.map((item) => (
              <button
                key={item.tab}
                onClick={() => {
                  setActiveTab(item.tab);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeTab === item.tab 
                    ? 'bg-emerald-50 text-emerald-900 font-semibold' 
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {lang === 'bn' ? item.labelBn : item.labelEn}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
            <button
              onClick={() => {
                openBlueprintModal();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md text-xs font-medium text-emerald-800 bg-emerald-50/60 flex items-center justify-between"
            >
              <span>{lang === 'bn' ? 'ওয়ার্ডপ্রেস আর্কিটেকচার ও প্লাগইন গাইড' : 'WordPress Architecture & Plugins'}</span>
              <FileText className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setLang(lang === 'bn' ? 'en' : 'bn');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-100 flex items-center justify-between"
            >
              <span>{lang === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় দেখুন'}</span>
              <Languages className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
