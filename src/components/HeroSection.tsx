import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, BookOpen, GraduationCap, ArrowRight, Sparkles, Clock, FileText } from 'lucide-react';
import { PdfResource } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedCourse: string;
  setSelectedCourse: (course: string) => void;
  onExploreClick: () => void;
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
    <div className="relative bg-stone-900 text-stone-100 overflow-hidden">
      {/* Background imagery with measured dark scrim */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-900/90 to-emerald-950/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
        <div className="max-w-3xl">
          {/* Subtle natural eyebrow kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{lang === 'bn' ? 'বাংলাদেশের ব্যাংকার ও শিক্ষার্থীদের জন্য উন্মুক্ত পাঠাগার' : 'Open Educational Repository for Bangladesh'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            {lang === 'bn' 
              ? 'ইসলামিক ব্যাংকিং ও ডিপ্লোমা (DIB) পরীক্ষার প্রামাণ্য পাঠাগার' 
              : 'Diploma in Islamic Banking Exam Papers & Research Hub'}
          </h1>

          <p className="text-sm sm:text-base text-stone-300 font-normal mb-7 leading-relaxed font-bengali">
            {lang === 'bn'
              ? 'ইনস্টিটিউট অব ব্যাংকার্স, বাংলাদেশ (IBB) ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (পার্ট-১ ও পার্ট-২)-এর বিগত বছরের প্রশ্ন, সমাধানকৃত মডেল উত্তর, আন্তর্জাতিক এএওআইএফআই মানদণ্ড এবং ব্যাংকিং গবেষণাপত্র।'
              : 'Free high-yield past examination questions, verified model answers, AAOIFI Shariah standards, and bilingual research articles for banking professionals.'}
          </p>

          {/* Prominent Search Box with Autocomplete */}
          <div ref={containerRef} className="relative">
            <div className="bg-white p-2 rounded-xl shadow-2xl border border-stone-200">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
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
                  className="w-full pl-3 pr-10 py-3 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none font-bengali"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-stone-400 hover:text-stone-700 mr-2"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsFocused(false);
                    onExploreClick();
                  }}
                  className="shrink-0 px-5 py-3 bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>{lang === 'bn' ? 'অনুসন্ধান' : 'Search'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Real-time Autocomplete Dropdown */}
            {isFocused && autocompleteSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 text-stone-900 animate-in fade-in-50 duration-150">
                <div className="px-4 py-2 bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
                  <span>{lang === 'bn' ? 'পরামর্শ ও তাৎক্ষণিক ফলাফল' : 'Suggestions'}</span>
                  <span className="text-[10px] text-stone-400 font-normal">{lang === 'bn' ? 'ক্লিক করে সরাসরি ফিল্টার করুন' : 'Click to filter'}</span>
                </div>
                <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
                  {autocompleteSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(item);
                      }}
                      className="px-4 py-3 hover:bg-emerald-50/80 cursor-pointer transition-colors flex items-center justify-between gap-3 text-left group"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {item.type === 'subject' ? (
                          <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-stone-400 shrink-0" />
                        )}
                        <span className="text-xs sm:text-sm font-medium text-stone-800 group-hover:text-emerald-900 truncate font-bengali">
                          {item.title}
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 group-hover:bg-emerald-100 text-stone-600 group-hover:text-emerald-800">
                        {item.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Filter Tags (Clickable functional filters) */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-400 font-medium">
              {lang === 'bn' ? 'জনপ্রিয় টপিক:' : 'Popular Searches:'}
            </span>
            {quickSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="px-2.5 py-1 rounded-lg bg-stone-800/90 hover:bg-emerald-900/80 border border-stone-700/80 text-stone-200 text-xs transition-colors hover:border-emerald-600/50"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Key Rigorous Metrics Strip adjacent to claim */}
          <div className="mt-8 pt-6 border-t border-stone-800/90 grid grid-cols-2 sm:grid-cols-3 gap-6 text-stone-300">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                {totalResourcesCount}+
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                {lang === 'bn' ? 'ডিআইবি প্রশ্ন ও পিডিএফ ডকুমেন্টস' : 'Verified Exam PDFs & Papers'}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                2018–2024
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                {lang === 'bn' ? 'বিগত বছরের পরীক্ষার কাভারেজ' : 'Comprehensive Session Coverage'}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                {totalArticlesCount} {lang === 'bn' ? 'টি' : 'Deep'}
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                {lang === 'bn' ? 'দ্বিভাষিক ব্যাংকিং প্রবন্ধ ও বিশ্লেষণ' : 'Bilingual Shariah Insights'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
