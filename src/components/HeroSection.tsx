import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, BookOpen, GraduationCap, ArrowRight, FileText } from 'lucide-react';
import { PdfResource, ActiveTab } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedCourse: string;
  setSelectedCourse: (course: string) => void;
  onExploreClick: () => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  totalResourcesCount: number;
  totalArticlesCount: number;
  lang: 'bn' | 'en';
  resources?: PdfResource[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  setSelectedCourse,
  setSelectedYear,
  onExploreClick,
  onNavigateTab,
  totalResourcesCount,
  totalArticlesCount,
  lang,
  resources = []
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const quickSearches = [
    { label: lang === 'bn' ? 'ডিআইবি পার্ট-১' : 'DIB Part-1', action: () => { setSelectedCourse('DIB-1'); onExploreClick(); } },
    { label: lang === 'bn' ? 'ডিআইবি পার্ট-২' : 'DIB Part-2', action: () => { setSelectedCourse('DIB-2'); onExploreClick(); } },
    { label: lang === 'bn' ? '২০২৪ মে সেশন' : '2024 May Session', action: () => { setSelectedYear('2024'); onExploreClick(); } },
    { label: lang === 'bn' ? 'মুদারাবা ও মুশারাকা' : 'Mudaraba & Musharaka', action: () => { setSearchQuery('Mudaraba'); onExploreClick(); } },
    { label: lang === 'bn' ? 'ব্যাংক কোম্পানি আইন' : 'Bank Company Act', action: () => { setSearchQuery('Bank Company Act'); onExploreClick(); } },
    { label: lang === 'bn' ? 'এএওআইএফআই (AAOIFI)' : 'AAOIFI Standards', action: () => { setSearchQuery('AAOIFI'); onExploreClick(); } },
  ];

  // Search Autocomplete Suggestions logic
  const autocompleteSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 1) return [];

    const suggestions: { title: string; type: 'subject' | 'year' | 'paper'; queryToSet: string; badge: string }[] = [];

    // Check predefined popular topics
    const topics = [
      { nameBn: 'মুদারাবা ও মুশারাকা নীতিমালা', nameEn: 'Mudaraba & Musharaka Principles', query: 'Mudaraba' },
      { nameBn: 'ব্যাংক কোম্পানি আইন ১৯৯১', nameEn: 'Bank Company Act 1991', query: 'Bank Company Act' },
      { nameBn: 'এএওআইএফআই (AAOIFI) অ্যাকাউন্টিং স্ট্যান্ডার্ড', nameEn: 'AAOIFI Accounting Standards', query: 'AAOIFI' },
      { nameBn: 'রিবা ও ইসলামিক ব্যাংকিং মুনাফা পার্থক্য', nameEn: 'Riba vs Islamic Profit', query: 'Riba' },
      { nameBn: 'ডিআইবি পার্ট-১ বিগত প্রশ্ন', nameEn: 'DIB Part-1 Past Questions', query: 'DIB-1' },
      { nameBn: 'ডিআইবি পার্ট-২ বিগত প্রশ্ন', nameEn: 'DIB Part-2 Past Questions', query: 'DIB-2' },
      { nameBn: '২০২৪ মে সেশন প্রশ্ন ও সমাধান', nameEn: '2024 May Session Solutions', query: '2024' },
      { nameBn: '২০২৩ নভেম্বর সেশন প্রশ্ন ও সমাধান', nameEn: '2023 November Session Solutions', query: '2023' },
    ];

    topics.forEach(t => {
      if (t.nameBn.toLowerCase().includes(q) || t.nameEn.toLowerCase().includes(q) || t.query.toLowerCase().includes(q)) {
        suggestions.push({
          title: lang === 'bn' ? t.nameBn : t.nameEn,
          type: 'subject',
          queryToSet: t.query,
          badge: lang === 'bn' ? 'টপিক' : 'Topic'
        });
      }
    });

    // Check actual PDF resources
    resources.forEach(res => {
      const titleMatch = res.title.toLowerCase().includes(q) || res.titleBn.toLowerCase().includes(q);
      const subjectMatch = res.subject.toLowerCase().includes(q) || res.subjectBn.toLowerCase().includes(q);
      if (titleMatch || subjectMatch) {
        if (!suggestions.some(s => s.title === (lang === 'bn' ? res.titleBn : res.title))) {
          suggestions.push({
            title: lang === 'bn' ? res.titleBn : res.title,
            type: 'paper',
            queryToSet: res.titleBn.substring(0, 30),
            badge: res.course
          });
        }
      }
    });

    return suggestions.slice(0, 6);
  }, [searchQuery, lang, resources]);

  // Click outside listener for autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (item: { queryToSet: string }) => {
    setSearchQuery(item.queryToSet);
    setIsFocused(false);
    onExploreClick();
  };

  return (
    <div className="relative bg-[#14532D] text-stone-100 overflow-hidden">
      {/* Background with measured deep emerald and subtle gold gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b331b] via-[#14532D] to-[#047857]/90" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Copy and Actions */}
          <div className="lg:col-span-7">
            {/* Subtle gold-accented kicker */}
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-wider text-[#D4AF37] uppercase mb-2.5 px-2.5 py-0.5 rounded-full bg-black/25 border border-[#D4AF37]/30 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <span>{lang === 'bn' ? 'বাংলাদেশের ব্যাংকার ও শিক্ষার্থীদের জন্য উন্মুক্ত পাঠাগার' : 'Open Educational Repository for Bangladesh'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2.5 leading-snug">
              {lang === 'bn' 
                ? 'ইসলামিক ব্যাংকিং ও ডিপ্লোমা (DIB) পরীক্ষার প্রামাণ্য পাঠাগার' 
                : 'Diploma in Islamic Banking Exam Papers & Research Hub'}
            </h1>

            <p className="text-xs sm:text-sm text-stone-200/90 font-normal mb-4 leading-relaxed font-bengali line-clamp-2 sm:line-clamp-none">
              {lang === 'bn'
                ? 'ইনস্টিটিউট অব ব্যাংকার্স, বাংলাদেশ (IBB) ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (পার্ট-১ ও পার্ট-২)-এর বিগত বছরের প্রশ্ন, সমাধানকৃত মডেল উত্তর, আন্তর্জাতিক এএওআইএফআই মানদণ্ড এবং ব্যাংকিং গবেষণাপত্র।'
                : 'Free high-yield past examination questions, verified model answers, AAOIFI Shariah standards, and bilingual research articles for banking professionals.'}
            </p>

            {/* Trust Signal Badge (Neutral, no fabricated stats) */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-stone-200/90 bg-emerald-950/40 border border-emerald-700/50 rounded-lg px-3 py-1.5 w-fit mb-4">
              <span className="text-[#D4AF37] font-semibold">✓ {lang === 'bn' ? 'বিশ্বস্ত শিক্ষামূলক রিসোর্স ও প্রামাণ্য সিলেবাস সহায়তা' : 'Verified Educational Resource & Syllabus Support'}</span>
              <span className="hidden sm:inline text-stone-400">•</span>
              <span className="text-stone-300">{lang === 'bn' ? '[শিক্ষার্থী সংখ্যা দিন]+ সক্রিয় পাঠক' : '[Active Reader Count]+ Learners'}</span>
            </div>

            {/* Clear Call-to-Action (CTA) Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
              <button
                onClick={() => onNavigateTab ? onNavigateTab('diploma') : onExploreClick()}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#bfa030] text-[#0f3d20] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#0f3d20]" />
                <span>{lang === 'bn' ? 'সিলেবাস দেখুন' : 'View Syllabus'}</span>
              </button>

              <button
                onClick={() => onNavigateTab ? onNavigateTab('previous-questions') : onExploreClick()}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs sm:text-sm font-semibold backdrop-blur-xs transition-all active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-300" />
                <span>{lang === 'bn' ? 'প্রশ্নব্যাংক দেখুন' : 'Question Bank'}</span>
              </button>

              <button
                onClick={() => onNavigateTab ? onNavigateTab('pdf-library') : onExploreClick()}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-700/80 text-white border border-emerald-600/50 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <span>{lang === 'bn' ? 'PDF ডাউনলোড করুন' : 'Download PDFs'}</span>
              </button>
            </div>

            {/* Prominent Search Box with Autocomplete */}
            <div ref={containerRef} className="relative">
              <div className="bg-white p-1.5 sm:p-2 rounded-xl shadow-xl border-2 border-[#D4AF37]/50 focus-within:border-[#D4AF37] transition-all">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 ml-2.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsFocused(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsFocused(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsFocused(false);
                        onExploreClick();
                      }
                    }}
                    placeholder={lang === 'bn' ? 'খুঁজুন...' : 'Search...'}
                    className="w-full pl-2.5 pr-2 py-2 sm:py-2.5 text-xs sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none font-bengali"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-stone-400 hover:text-stone-700 mr-1"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsFocused(false);
                      onExploreClick();
                    }}
                    className="shrink-0 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#047857] hover:bg-[#065f46] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'অনুসন্ধান' : 'Search'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Real-time Autocomplete Dropdown with No Results Found State */}
              {isFocused && (
                autocompleteSuggestions.length > 0 ? (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 text-stone-900 animate-in fade-in-50 duration-150">
                    <div className="px-4 py-2 bg-[#F8FAF5] border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
                      <span>{lang === 'bn' ? 'পরামর্শ ও তাৎক্ষণিক ফলাফল' : 'Suggestions'}</span>
                      <span className="text-[10px] text-stone-400 font-normal">{lang === 'bn' ? 'ক্লিক করে ফিল্টার করুন' : 'Click to filter'}</span>
                    </div>
                    <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                      {autocompleteSuggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectSuggestion(item);
                          }}
                          className="px-4 py-2.5 hover:bg-emerald-50 cursor-pointer transition-colors flex items-center justify-between gap-3 text-left group"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {item.type === 'subject' ? (
                              <GraduationCap className="w-4 h-4 text-[#047857] shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-stone-400 shrink-0" />
                            )}
                            <span className="text-xs sm:text-sm font-medium text-stone-800 group-hover:text-[#047857] truncate font-bengali">
                              {item.title}
                            </span>
                          </div>
                          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 group-hover:bg-emerald-100 text-stone-600 group-hover:text-[#047857]">
                            {item.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (searchQuery.trim().length > 0 ? (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 p-4 z-50 text-stone-700 text-center text-xs sm:text-sm font-bengali animate-in fade-in-50 duration-150">
                    <div className="text-stone-800 font-medium">
                      {lang === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No matching results found'}
                    </div>
                    <div className="text-[11px] sm:text-xs text-stone-400 mt-1">
                      {lang === 'bn' ? 'অন্য কোনো বিষয় বা বছর লিখে চেষ্টা করুন (যেমন: মুদারাবা, ২০২৪, পার্ট-১)' : 'Try searching with another keyword or session'}
                    </div>
                  </div>
                ) : null)
              )}
            </div>

            {/* Quick Filter Tags (Horizontally scrollable on mobile to prevent overflow) */}
            <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-stone-300 font-medium shrink-0 text-[11px]">
                {lang === 'bn' ? 'জনপ্রিয়:' : 'Popular:'}
              </span>
              {quickSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className="shrink-0 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-stone-100 text-[11px] sm:text-xs transition-colors hover:border-[#D4AF37]/60 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Key Rigorous Metrics Strip */}
            <div className="mt-5 sm:mt-6 pt-4 border-t border-emerald-800/70 grid grid-cols-3 gap-2 sm:gap-4 text-stone-200">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                  {totalResourcesCount}+
                </div>
                <div className="text-[10px] sm:text-xs text-stone-300 mt-0.5 font-bengali">
                  {lang === 'bn' ? 'ডিআইবি প্রশ্ন ও পিডিএফ' : 'Exam PDFs & Papers'}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                  2018–2024
                </div>
                <div className="text-[10px] sm:text-xs text-stone-300 mt-0.5 font-bengali">
                  {lang === 'bn' ? 'বিগত বছরের কাভারেজ' : 'Session Coverage'}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                  {totalArticlesCount} {lang === 'bn' ? 'টি' : 'Deep'}
                </div>
                <div className="text-[10px] sm:text-xs text-stone-300 mt-0.5 font-bengali">
                  {lang === 'bn' ? 'দ্বিভাষিক গবেষণা প্রবন্ধ' : 'Shariah Articles'}
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual: Optimized WebP Image with <picture>, fetchpriority="high", responsive width/height */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-2xl bg-emerald-950/40">
              <picture>
                <source srcSet="/images/hero_islamic_library_1793322325013.webp" type="image/webp" />
                <img
                  src="/images/hero_islamic_library_1793322325013.webp"
                  alt={lang === 'bn' ? 'ইসলামিক ব্যাংকিং ডিপ্লোমা ও গবেষণা পাঠাগার' : 'Diploma in Islamic Banking Academic Reference Library'}
                  width={1200}
                  height={600}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-auto object-cover aspect-16/10 transition-transform duration-500 hover:scale-102"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-white font-bengali">
                <div className="text-[#D4AF37] font-bold text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>{lang === 'bn' ? 'ডিআইবি ও ইসলামিক ফাইন্যান্স প্রামাণ্য পাঠাগার' : 'DIB & Islamic Finance Reference Library'}</span>
                </div>
                <div className="text-[11px] text-stone-300 mt-0.5">
                  {lang === 'bn' ? 'আইবিবি অনুমোদিত সিলেবাস ও বিগত প্রশ্নাবলি সংবলিত উন্মুক্ত আর্কাইভ' : 'Verified Open Digital Archive for Banking Scholars'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
