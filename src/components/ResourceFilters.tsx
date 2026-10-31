import React, { useState } from 'react';
import { Filter, X, RotateCcw, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { CourseType, ExamSession, ResourceCategory } from '../types';
import { examYearsList, subjectsList } from '../data/mockData';

interface ResourceFiltersProps {
  selectedCourse: string;
  setSelectedCourse: (course: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedSession: string;
  setSelectedSession: (session: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onReset: () => void;
  activeFilterCount: number;
  lang: 'bn' | 'en';
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  selectedCourse,
  setSelectedCourse,
  selectedSubject,
  setSelectedSubject,
  selectedYear,
  setSelectedYear,
  selectedSession,
  setSelectedSession,
  selectedLanguage,
  setSelectedLanguage,
  selectedCategory,
  setSelectedCategory,
  onReset,
  activeFilterCount,
  lang
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const quickTracks = [
    { id: 'ALL', labelBn: 'সকল ফাইল', labelEn: 'All Tracks' },
    { id: 'DIB-1', labelBn: 'ডিআইবি পার্ট-১', labelEn: 'DIB Part-1' },
    { id: 'DIB-2', labelBn: 'ডিআইবি পার্ট-২', labelEn: 'DIB Part-2' },
    { id: 'Islamic-Banking', labelBn: 'ইসলামিক ব্যাংকিং', labelEn: 'Islamic Finance' },
  ];

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-3.5 sm:p-5 shadow-xs font-bengali">
      {/* Top Header Row with Filter Summary and Mobile Toggle */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
          <SlidersHorizontal className="w-4 h-4 text-[#047857]" />
          <span>{lang === 'bn' ? 'ফিল্টার ও বাছাই' : 'Refine Resources'}</span>
          {activeFilterCount > 0 && (
            <span className="text-[11px] bg-emerald-100 text-[#047857] font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-[11px] sm:text-xs text-stone-500 hover:text-red-700 font-medium transition-colors px-2 py-1 rounded hover:bg-stone-100"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </button>
          )}

          {/* Mobile Collapse/Expand Button */}
          <button
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="sm:hidden flex items-center gap-1 text-xs font-semibold text-[#047857] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
            aria-expanded={isMobileExpanded}
          >
            <span>{isMobileExpanded ? (lang === 'bn' ? 'লুকান' : 'Hide') : (lang === 'bn' ? 'সব ফিল্টার' : 'Filters')}</span>
            {isMobileExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Track Chips (Always accessible horizontally on mobile & desktop) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {quickTracks.map((tr) => (
          <button
            key={tr.id}
            onClick={() => setSelectedCourse(tr.id)}
            className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              selectedCourse === tr.id
                ? 'bg-[#14532D] text-white shadow-2xs font-semibold'
                : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
            }`}
          >
            {lang === 'bn' ? tr.labelBn : tr.labelEn}
          </button>
        ))}
      </div>

      {/* Detailed Filter Selectors: Collapsible on mobile, visible on sm+ screens */}
      <div className={`${isMobileExpanded ? 'grid' : 'hidden sm:grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs pt-2`}>
        {/* Course Filter */}
        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            {lang === 'bn' ? 'কোর্স / প্রোগ্রাম' : 'Course / Track'}
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-[#047857] text-xs"
          >
            <option value="ALL">{lang === 'bn' ? 'সকল কোর্স' : 'All Tracks'}</option>
            <option value="DIB-1">DIB Part-1 (আইবিবি)</option>
            <option value="DIB-2">DIB Part-2 (আইবিবি)</option>
            <option value="DIB-General">DIB General Handbook</option>
            <option value="Islamic-Banking">Islamic Banking & Finance</option>
            <option value="Quran-Hadith">Quran & Hadith</option>
            <option value="Fiqh-Fatwa">Fiqh & Fatwa</option>
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            {lang === 'bn' ? 'পাঠ্য বিষয়' : 'Subject'}
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-[#047857] truncate text-xs"
          >
            {subjectsList.map((sub, i) => (
              <option key={i} value={sub === 'All Subjects' ? 'ALL' : sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Exam Year Filter */}
        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            {lang === 'bn' ? 'পরীক্ষার সাল' : 'Exam Year'}
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-[#047857] text-xs"
          >
            <option value="ALL">{lang === 'bn' ? 'সকল সাল (2018–2024)' : 'All Years (2018–2024)'}</option>
            {examYearsList.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Session Filter */}
        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            {lang === 'bn' ? 'পরীক্ষা সেশন' : 'Exam Session'}
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-[#047857] text-xs"
          >
            <option value="ALL">{lang === 'bn' ? 'সব সেশন' : 'All Sessions'}</option>
            <option value="May">{lang === 'bn' ? 'মে সেশন (May)' : 'May Session'}</option>
            <option value="November">{lang === 'bn' ? 'নভেম্বর সেশন (Nov)' : 'November Session'}</option>
            <option value="Special">{lang === 'bn' ? 'বিশেষ সেশন' : 'Special Editions'}</option>
          </select>
        </div>

        {/* Resource Category */}
        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            {lang === 'bn' ? 'রিসোর্সের ধরন' : 'Category Type'}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-[#047857] text-xs"
          >
            <option value="ALL">{lang === 'bn' ? 'সকল প্রকার' : 'All Types'}</option>
            <option value="Question-Paper">{lang === 'bn' ? 'প্রশ্নপত্র (Questions)' : 'Question Papers'}</option>
            <option value="Solved-Answer">{lang === 'bn' ? 'সমাধানকৃত উত্তর (Solved)' : 'Solved Answers'}</option>
            <option value="Study-Notes">{lang === 'bn' ? 'স্টাডি নোটস (Notes)' : 'Study Notes'}</option>
            <option value="Book-Reference">{lang === 'bn' ? 'রেফারেন্স বই (Books)' : 'Reference Books'}</option>
            <option value="Fatwa-Resolution">{lang === 'bn' ? 'ফতোয়া সংকলন (Fatwas)' : 'Fatwa Resolutions'}</option>
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            {lang === 'bn' ? 'ভাষার মাধ্যম' : 'Medium / Language'}
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-[#047857] text-xs"
          >
            <option value="ALL">{lang === 'bn' ? 'সকল ভাষা' : 'All Languages'}</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="en">English</option>
            <option value="bilingual">দ্বিভাষিক (Bilingual)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
