import React from 'react';
import { Search, X, BookOpen, GraduationCap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  setSelectedCourse,
  setSelectedYear,
  onExploreClick,
  totalResourcesCount,
  totalArticlesCount,
  lang
}) => {
  const quickSearches = [
    { label: lang === 'bn' ? 'ডিআইবি পার্ট-১' : 'DIB Part-1', action: () => { setSelectedCourse('DIB-1'); onExploreClick(); } },
    { label: lang === 'bn' ? 'ডিআইবি পার্ট-২' : 'DIB Part-2', action: () => { setSelectedCourse('DIB-2'); onExploreClick(); } },
    { label: lang === 'bn' ? '২০২৪ মে সেশন' : '2024 May Session', action: () => { setSelectedYear('2024'); onExploreClick(); } },
    { label: lang === 'bn' ? 'মুদারাবা ও মুশারাকা' : 'Mudaraba & Musharaka', action: () => { setSearchQuery('Mudaraba'); onExploreClick(); } },
    { label: lang === 'bn' ? 'ব্যাংক কোম্পানি আইন' : 'Bank Company Act', action: () => { setSearchQuery('Bank Company Act'); onExploreClick(); } },
    { label: lang === 'bn' ? 'এএওআইএফআই (AAOIFI)' : 'AAOIFI Standards', action: () => { setSearchQuery('AAOIFI'); onExploreClick(); } },
  ];

  return (
    <div className="relative bg-stone-900 text-stone-100 overflow-hidden">
      {/* Background imagery with measured dark scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_islamic_library_1793322325013.jpg"
          alt="Islamic Knowledge Library Architecture"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-emerald-950/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          {/* Subtle natural eyebrow kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{lang === 'bn' ? 'বাংলাদেশের শিক্ষার্থীদের জন্য উন্মুক্ত ইসলামিক ব্যাংকিং পাঠাগার' : 'Open Educational Repository for Bangladesh'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5 leading-tight [text-wrap:balance]">
            {lang === 'bn' 
              ? 'ইসলামিক ব্যাংকিং ও ডিপ্লোমা (DIB) পরীক্ষার প্রামাণ্য পিডিএফ লাইব্রেরি' 
              : 'Diploma in Islamic Banking Exam Papers & Research PDF Library'}
          </h1>

          <p className="text-base sm:text-lg text-stone-300 font-normal mb-8 leading-relaxed [text-wrap:balance]">
            {lang === 'bn'
              ? 'ইনস্টিটিউট অব ব্যাংকার্স, বাংলাদেশ (IBB) ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (পার্ট-১ ও পার্ট-২)-এর বিগত বছরের প্রশ্ন, সমাধানকৃত মডেল উত্তর, আন্তর্জাতিক এএওআইএফআই মানদণ্ড এবং ব্যাংকিং গবেষণাপত্র।'
              : 'Free high-yield past examination questions, verified model answers, AAOIFI Shariah standards, and bilingual research articles for banking professionals.'}
          </p>

          {/* Prominent Search Box */}
          <div className="bg-white p-2 rounded-xl shadow-xl border border-stone-200">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'bn'
                    ? 'বিষয়, প্রশ্নপত্রের সাল, সেশন বা কি-ওয়ার্ড দিয়ে খুঁজুন (যেমন: ২০২৪, মুদারাবা, AAOIFI)...'
                    : 'Search by subject, year, exam session, or keyword (e.g., 2024, Mudaraba, DIB Part 1)...'
                }
                className="w-full pl-3 pr-10 py-3 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
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
                onClick={onExploreClick}
                className="shrink-0 px-5 py-3 bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>{lang === 'bn' ? 'অনুসন্ধান' : 'Search'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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
                className="px-2.5 py-1 rounded bg-stone-800/80 hover:bg-emerald-900/60 border border-stone-700/80 text-stone-200 text-xs transition-colors hover:border-emerald-600/50"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Key Rigorous Metrics Strip adjacent to claim */}
          <div className="mt-10 pt-8 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-3 gap-6 text-stone-300">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                {totalResourcesCount}+
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {lang === 'bn' ? 'ডিআইবি প্রশ্ন ও পিডিএফ ডকুমেন্টস' : 'Verified Exam PDFs & Papers'}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                2018–2024
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {lang === 'bn' ? 'বিগত বছরের পরীক্ষার কাভারেজ' : 'Comprehensive Session Coverage'}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                {totalArticlesCount} {lang === 'bn' ? 'টি' : 'Deep'}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {lang === 'bn' ? 'দ্বিভাষিক ব্যাংকিং প্রবন্ধ ও বিশ্লেষণ' : 'Bilingual Shariah Insights'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
