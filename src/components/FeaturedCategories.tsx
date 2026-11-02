import React from 'react';
import { 
  ArrowRight, 
  GraduationCap, 
  BookOpen, 
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { CategoryInfo, CourseType } from '../types';

interface FeaturedCategoriesProps {
  categories?: CategoryInfo[];
  onSelectCategory?: (courseType?: CourseType, categorySlug?: string) => void;
  onNavigateUrl?: (path: string) => void;
  lang: 'bn' | 'en';
  dibCount?: number;
  articlesCount?: number;
  pdfCount?: number;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  onNavigateUrl,
  lang,
  dibCount,
  articlesCount,
  pdfCount
}) => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (onNavigateUrl) {
      onNavigateUrl(path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-stone-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#047857] tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{lang === 'bn' ? 'প্রধান বিভাগসমূহ' : 'Main Hubs'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-stone-900">
              {lang === 'bn' ? 'প্রধান শিক্ষামূলক বিভাগ' : 'Featured Knowledge Categories'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md font-bengali">
            {lang === 'bn' 
              ? 'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং প্রস্তুতি, প্রামাণ্য গবেষণা প্রবন্ধ এবং উন্মুক্ত পিডিএফ লাইব্রেরি।'
              : 'Direct access to structured study modules, scholarly articles, and open PDF archives.'}
          </p>
        </div>

        {/* 3 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: ডিআইবি পরীক্ষা */}
          <div className="group rounded-2xl border border-stone-200 overflow-hidden bg-white hover:border-[#047857]/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
            <div>
              {/* Header Visual */}
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 p-5 flex flex-col justify-between text-white">
                <svg className="absolute right-2 -bottom-4 w-32 h-32 opacity-15 text-emerald-300" viewBox="0 0 100 100" fill="currentColor">
                  <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                  <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-400/40 bg-emerald-500/20 text-emerald-200 backdrop-blur-xs">
                    {lang === 'bn' ? 'আইবিবি ডিপ্লোমা' : 'IBB Diploma'}
                  </span>
                  {typeof dibCount === 'number' && (
                    <span className="font-semibold text-xs px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[#D4AF37]">
                      {dibCount} {lang === 'bn' ? 'টি আইটেম' : 'Items'}
                    </span>
                  )}
                </div>

                <div className="relative z-10 flex items-center gap-3 mt-auto">
                  <div className="p-2.5 rounded-xl bg-emerald-800/80 text-emerald-200 border border-emerald-600/40 shadow-md group-hover:scale-105 transition-transform duration-200">
                    <GraduationCap className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-snug group-hover:text-[#D4AF37] transition-colors">
                      <a href="/articles?menu=dib-part-1" onClick={(e) => handleNav(e, '/articles?menu=dib-part-1')}>
                        {lang === 'bn' ? 'ডিআইবি পরীক্ষা' : 'DIB Exam'}
                      </a>
                    </h3>
                    <span className="text-[11px] text-emerald-200/80 block">
                      {lang === 'bn' ? 'পার্ট ১ ও পার্ট ২ প্রস্তুতি' : 'Part 1 & Part 2 Prep'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-xs sm:text-sm text-stone-600 font-bengali leading-relaxed mb-4">
                  {lang === 'bn'
                    ? 'ইনস্টিটিউট অব ব্যাংকার্স, বাংলাদেশ (IBB) ডিপ্লোমা পরীক্ষার সম্পূর্ণ সিলেবাস, মূলনীতি ও বিষয়ভিত্তিক আলোচনা।'
                    : 'Structured modules, fundamental banking principles, and comprehensive syllabus guides for DIB exams.'}
                </p>

                {/* Sub-list showing Part 1 and Part 2 */}
                <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5 space-y-1.5">
                  <div className="text-[11px] font-semibold text-stone-500 px-2 py-0.5 uppercase tracking-wider">
                    {lang === 'bn' ? 'উপ-বিভাগসমূহ:' : 'Sub-categories:'}
                  </div>
                  <a
                    href="/articles?menu=dib-part-1"
                    onClick={(e) => handleNav(e, '/articles?menu=dib-part-1')}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-stone-200/60 hover:border-emerald-300 transition-colors text-xs font-medium text-stone-800 hover:text-emerald-800"
                  >
                    <span className="flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{lang === 'bn' ? 'ডিআইবি পার্ট ১' : 'DIB Part 1'}</span>
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/60 px-1.5 py-0.5 rounded">
                      {lang === 'bn' ? 'সিলেবাস ও প্রশ্ন' : 'Part 1'}
                    </span>
                  </a>
                  <a
                    href="/articles?menu=dib-part-2"
                    onClick={(e) => handleNav(e, '/articles?menu=dib-part-2')}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-stone-200/60 hover:border-emerald-300 transition-colors text-xs font-medium text-stone-800 hover:text-emerald-800"
                  >
                    <span className="flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{lang === 'bn' ? 'ডিআইবি পার্ট ২' : 'DIB Part 2'}</span>
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/60 px-1.5 py-0.5 rounded">
                      {lang === 'bn' ? 'আইন ও সার্কুলার' : 'Part 2'}
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Card Footer Link */}
            <div className="p-4 border-t border-stone-100 bg-stone-50/50">
              <a
                href="/articles?menu=dib-part-1"
                onClick={(e) => handleNav(e, '/articles?menu=dib-part-1')}
                className="inline-flex items-center justify-between w-full text-xs font-semibold text-[#047857] hover:text-[#14532D]"
              >
                <span>{lang === 'bn' ? 'ডিআইবি কর্নারে যান' : 'Explore DIB Exam'}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 2: আর্টিকেলসমূহ */}
          <div className="group rounded-2xl border border-stone-200 overflow-hidden bg-white hover:border-[#047857]/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
            <div>
              {/* Header Visual */}
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-5 flex flex-col justify-between text-white">
                <svg className="absolute right-2 -bottom-4 w-32 h-32 opacity-15 text-blue-300" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M20,90 L20,40 Q50,10 80,40 L80,90 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                  <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
                  <line x1="20" y1="90" x2="80" y2="90" stroke="currentColor" strokeWidth="3" />
                </svg>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-blue-400/40 bg-blue-500/20 text-blue-200 backdrop-blur-xs">
                    {lang === 'bn' ? 'গবেষণা ও কলাম' : 'Scholarly Articles'}
                  </span>
                  {typeof articlesCount === 'number' && (
                    <span className="font-semibold text-xs px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[#D4AF37]">
                      {articlesCount} {lang === 'bn' ? 'টি আর্টিকেল' : 'Articles'}
                    </span>
                  )}
                </div>

                <div className="relative z-10 flex items-center gap-3 mt-auto">
                  <div className="p-2.5 rounded-xl bg-blue-900/80 text-blue-200 border border-blue-600/40 shadow-md group-hover:scale-105 transition-transform duration-200">
                    <BookOpen className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-snug group-hover:text-[#D4AF37] transition-colors">
                      <a href="/articles" onClick={(e) => handleNav(e, '/articles')}>
                        {lang === 'bn' ? 'আর্টিকেলসমূহ' : 'Articles'}
                      </a>
                    </h3>
                    <span className="text-[11px] text-blue-200/80 block">
                      {lang === 'bn' ? 'দ্বিভাষিক বিশ্লেষণ ও প্রবন্ধ' : 'Bilingual Analytical Essays'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-xs sm:text-sm text-stone-600 font-bengali leading-relaxed mb-4">
                  {lang === 'bn'
                    ? 'ইসলামিক অর্থনীতি, ব্যাংকিং আইন, ফিকহুল মুআমালাত এবং শরীয়াহ নীতিমালা বিষয়ক গবেষণাধর্মী কলাম ও বিশেষজ্ঞদের মতামত।'
                    : 'Theological and empirical analyses on Islamic economics, profit-loss sharing, and ethical financial governance.'}
                </p>

                {/* Sub-list showing categories */}
                <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5 space-y-1.5">
                  <div className="text-[11px] font-semibold text-stone-500 px-2 py-0.5 uppercase tracking-wider">
                    {lang === 'bn' ? 'ক্যাটাগরিসমূহ:' : 'Categories:'}
                  </div>
                  <a
                    href="/articles?menu=islamic-economics"
                    onClick={(e) => handleNav(e, '/articles?menu=islamic-economics')}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-stone-200/60 hover:border-blue-300 transition-colors text-xs font-medium text-stone-800 hover:text-blue-900"
                  >
                    <span className="flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>{lang === 'bn' ? 'ইসলামিক অর্থনীতি' : 'Islamic Economics'}</span>
                    </span>
                    <span className="text-[10px] text-blue-800 font-semibold bg-blue-100/60 px-1.5 py-0.5 rounded">
                      {lang === 'bn' ? 'অর্থনীতি' : 'Economics'}
                    </span>
                  </a>
                  <a
                    href="/articles?menu=islamic-essays"
                    onClick={(e) => handleNav(e, '/articles?menu=islamic-essays')}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-stone-200/60 hover:border-blue-300 transition-colors text-xs font-medium text-stone-800 hover:text-blue-900"
                  >
                    <span className="flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>{lang === 'bn' ? 'ইসলামিক প্রবন্ধ' : 'Islamic Essays'}</span>
                    </span>
                    <span className="text-[10px] text-blue-800 font-semibold bg-blue-100/60 px-1.5 py-0.5 rounded">
                      {lang === 'bn' ? 'প্রবন্ধ' : 'Essays'}
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Card Footer Link */}
            <div className="p-4 border-t border-stone-100 bg-stone-50/50">
              <a
                href="/articles"
                onClick={(e) => handleNav(e, '/articles')}
                className="inline-flex items-center justify-between w-full text-xs font-semibold text-[#047857] hover:text-[#14532D]"
              >
                <span>{lang === 'bn' ? 'সকল আর্টিকেল পড়ুন' : 'View All Articles'}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 3: পিডিএফ কর্নার */}
          <div className="group rounded-2xl border border-stone-200 overflow-hidden bg-white hover:border-[#047857]/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
            <div>
              {/* Header Visual */}
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-yellow-950 p-5 flex flex-col justify-between text-white">
                <svg className="absolute right-2 -bottom-4 w-32 h-32 opacity-15 text-amber-300" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M10,80 Q50,60 90,80 L80,30 Q50,45 20,30 Z" fill="none" stroke="currentColor" strokeWidth="3" />
                  <polygon points="50,20 60,40 40,40" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                </svg>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-amber-400/40 bg-amber-500/20 text-amber-200 backdrop-blur-xs">
                    {lang === 'bn' ? 'ডিজিটাল পাঠাগার' : 'Digital Archive'}
                  </span>
                  {typeof pdfCount === 'number' && (
                    <span className="font-semibold text-xs px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[#D4AF37]">
                      {pdfCount} {lang === 'bn' ? 'টি পিডিএফ' : 'PDFs'}
                    </span>
                  )}
                </div>

                <div className="relative z-10 flex items-center gap-3 mt-auto">
                  <div className="p-2.5 rounded-xl bg-amber-900/80 text-amber-200 border border-amber-600/40 shadow-md group-hover:scale-105 transition-transform duration-200">
                    <FileText className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-snug group-hover:text-[#D4AF37] transition-colors">
                      <a href="/pdf-library" onClick={(e) => handleNav(e, '/pdf-library')}>
                        {lang === 'bn' ? 'পিডিএফ কর্নার' : 'PDF Corner'}
                      </a>
                    </h3>
                    <span className="text-[11px] text-amber-200/80 block">
                      {lang === 'bn' ? 'প্রশ্নব্যাংক ও রেফারেন্স বুক' : 'Question Bank & Reference Books'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-xs sm:text-sm text-stone-600 font-bengali leading-relaxed mb-4">
                  {lang === 'bn'
                    ? 'বিগত বছরের প্রশ্নপত্র, সিলেবাস, এএওআইএফআই গাইড ও প্রয়োজনীয় বইয়ের উন্মুক্ত ডিজিটাল লাইব্রেরি।'
                    : 'Download authentic exam papers, solved questions, and verified Islamic financial literature in clean PDF format.'}
                </p>

                {/* Sub-list showing quick links */}
                <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5 space-y-1.5">
                  <div className="text-[11px] font-semibold text-stone-500 px-2 py-0.5 uppercase tracking-wider">
                    {lang === 'bn' ? 'জনপ্রিয় ফাইলসমূহ:' : 'Quick Archives:'}
                  </div>
                  <a
                    href="/previous-questions"
                    onClick={(e) => handleNav(e, '/previous-questions')}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 border border-stone-200/60 hover:border-amber-300 transition-colors text-xs font-medium text-stone-800 hover:text-amber-900"
                  >
                    <span className="flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{lang === 'bn' ? 'বিগত বছরের প্রশ্ন ও সমাধান' : 'Past Papers & Solutions'}</span>
                    </span>
                    <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/60 px-1.5 py-0.5 rounded">
                      {lang === 'bn' ? '২০১৮–২০২৪' : '2018–2024'}
                    </span>
                  </a>
                  <a
                    href="/pdf-library"
                    onClick={(e) => handleNav(e, '/pdf-library')}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 border border-stone-200/60 hover:border-amber-300 transition-colors text-xs font-medium text-stone-800 hover:text-amber-900"
                  >
                    <span className="flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{lang === 'bn' ? 'সম্পূর্ণ উন্মুক্ত পিডিএফ পাঠাগার' : 'Master PDF Library'}</span>
                    </span>
                    <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/60 px-1.5 py-0.5 rounded">
                      {lang === 'bn' ? 'সকল ফাইল' : 'All Files'}
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Card Footer Link */}
            <div className="p-4 border-t border-stone-100 bg-stone-50/50">
              <a
                href="/pdf-library"
                onClick={(e) => handleNav(e, '/pdf-library')}
                className="inline-flex items-center justify-between w-full text-xs font-semibold text-[#047857] hover:text-[#14532D]"
              >
                <span>{lang === 'bn' ? 'পিডিএফ লাইব্রেরিতে যান' : 'Go to PDF Corner'}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
