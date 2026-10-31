import React, { useState } from 'react';
import { PdfResource, CourseType } from '../types';
import { PdfCard } from './PdfCard';
import { Calendar, GraduationCap, ArrowRight, Filter } from 'lucide-react';
import { examYearsList } from '../data/mockData';

interface DiplomaExamSectionProps {
  resources: PdfResource[];
  onPreview: (res: PdfResource) => void;
  onDownloadIncrement: (id: string) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  lang: 'bn' | 'en';
  completedIds?: string[];
  onToggleComplete?: (id: string) => void;
}

export const DiplomaExamSection: React.FC<DiplomaExamSectionProps> = ({
  resources,
  onPreview,
  onDownloadIncrement,
  bookmarks,
  onToggleBookmark,
  lang,
  completedIds = [],
  onToggleComplete
}) => {
  const [selectedPart, setSelectedPart] = useState<'ALL' | 'DIB-1' | 'DIB-2'>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');

  // Filter DIB specific resources
  const dibResources = resources.filter(r => 
    r.course === 'DIB-1' || r.course === 'DIB-2' || r.course === 'DIB-General'
  );

  const filtered = dibResources.filter(r => {
    const matchesPart = selectedPart === 'ALL' || r.course === selectedPart || r.course === 'DIB-General';
    const matchesYear = selectedYear === 'ALL' || r.examYear === selectedYear;
    return matchesPart && matchesYear;
  });

  return (
    <section className="py-10 sm:py-14 bg-[#F8FAF5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#047857] tracking-wider uppercase mb-1">
              <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'bn' ? 'আইবিবি ডিপ্লোমা ইন ইসলামিক ব্যাংকিং' : 'IBB Diploma Examination Hub'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-stone-900">
              {lang === 'bn' ? 'বিগত বছরের প্রশ্নপত্র ও সমাধান (সালভিত্তিক)' : 'Previous Year Questions & Solutions by Year'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl font-bengali">
              {lang === 'bn'
                ? 'আইবিবি (IBB) ডিপ্লোমা ইন ইসলামিক ব্যাংকিং পরীক্ষার বিগত সেশনসমূহের অফিশিয়াল প্রশ্ন ও অভিজ্ঞ ব্যাংকারদের প্রস্তুতকৃত বিশদ উত্তর।'
                : 'Official examination papers, answer keys, and model solutions indexed by year and exam session for banking candidates.'}
            </p>
          </div>

          {/* Part 1 vs Part 2 Segmented Control */}
          <div className="flex items-center bg-stone-200/70 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setSelectedPart('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedPart === 'ALL' 
                  ? 'bg-[#14532D] text-white shadow-2xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'bn' ? 'সব পেপার' : 'All Papers'}
            </button>
            <button
              onClick={() => setSelectedPart('DIB-1')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedPart === 'DIB-1' 
                  ? 'bg-[#14532D] text-white shadow-2xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'bn' ? 'ডিআইবি পার্ট-১' : 'DIB Part-1'}
            </button>
            <button
              onClick={() => setSelectedPart('DIB-2')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedPart === 'DIB-2' 
                  ? 'bg-[#14532D] text-white shadow-2xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'bn' ? 'ডিআইবি পার্ট-২' : 'DIB Part-2'}
            </button>
          </div>
        </div>

        {/* Year Pills Filter Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-none text-xs">
          <span className="text-stone-500 font-medium shrink-0 flex items-center gap-1 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-[#047857]" />
            <span>{lang === 'bn' ? 'সাল:' : 'Year:'}</span>
          </span>
          <button
            onClick={() => setSelectedYear('ALL')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium shrink-0 text-xs ${
              selectedYear === 'ALL'
                ? 'bg-[#047857] text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {lang === 'bn' ? 'সকল সাল' : 'All Years'}
          </button>
          {examYearsList.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium shrink-0 text-xs ${
                selectedYear === year
                  ? 'bg-[#047857] text-white shadow-2xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {year} {lang === 'bn' ? 'সাল' : ''}
            </button>
          ))}
        </div>

        {/* DIB Resources Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(res => (
              <PdfCard
                key={res.id}
                resource={res}
                onPreview={onPreview}
                onDownloadIncrement={onDownloadIncrement}
                isBookmarked={bookmarks.includes(res.id)}
                onToggleBookmark={onToggleBookmark}
                lang={lang}
                isCompleted={completedIds.includes(res.id)}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
            {lang === 'bn'
              ? 'নির্বাচিত সাল বা ক্যাটাগরিতে কোনো প্রশ্নপত্র পাওয়া যায়নি। অন্য সাল নির্বাচন করুন।'
              : 'No DIB exam question papers found for the selected year and part filter.'}
          </div>
        )}
      </div>
    </section>
  );
};
