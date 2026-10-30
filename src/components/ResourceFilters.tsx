import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
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
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-emerald-800" />
          <span>{lang === 'bn' ? 'ফিল্টার ও বাছাই' : 'Refine Resources'}</span>
          {activeFilterCount > 0 && (
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-emerald-800 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
        {/* Course Filter */}
        <div>
          <label className="block font-medium text-stone-700 mb-1">
            {lang === 'bn' ? 'কোর্স / প্রোগ্রাম' : 'Course / Track'}
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-emerald-700"
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
          <label className="block font-medium text-stone-700 mb-1">
            {lang === 'bn' ? 'পাঠ্য বিষয়' : 'Subject'}
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-emerald-700 truncate"
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
          <label className="block font-medium text-stone-700 mb-1">
            {lang === 'bn' ? 'পরীক্ষার সাল' : 'Exam Year'}
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-emerald-700"
          >
            <option value="ALL">{lang === 'bn' ? 'সকল সাল (2018–2024)' : 'All Years (2018–2024)'}</option>
            {examYearsList.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Session Filter */}
        <div>
          <label className="block font-medium text-stone-700 mb-1">
            {lang === 'bn' ? 'পরীক্ষা সেশন' : 'Exam Session'}
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-emerald-700"
          >
            <option value="ALL">{lang === 'bn' ? 'সব সেশন' : 'All Sessions'}</option>
            <option value="May">{lang === 'bn' ? 'মে সেশন (May)' : 'May Session'}</option>
            <option value="November">{lang === 'bn' ? 'নভেম্বর সেশন (Nov)' : 'November Session'}</option>
            <option value="Special">{lang === 'bn' ? 'বিশেষ সেশন' : 'Special Editions'}</option>
          </select>
        </div>

        {/* Resource Category */}
        <div>
          <label className="block font-medium text-stone-700 mb-1">
            {lang === 'bn' ? 'রিসোর্সের ধরন' : 'Category Type'}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-emerald-700"
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
          <label className="block font-medium text-stone-700 mb-1">
            {lang === 'bn' ? 'ভাষার মাধ্যম' : 'Medium / Language'}
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-emerald-700"
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
