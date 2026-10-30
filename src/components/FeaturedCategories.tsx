import React from 'react';
import { 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Scale, 
  FileCheck, 
  Coins, 
  BookMarked, 
  Award,
  Sparkles
} from 'lucide-react';
import { CategoryInfo, CourseType } from '../types';

interface FeaturedCategoriesProps {
  categories: CategoryInfo[];
  onSelectCategory: (courseType?: CourseType, categorySlug?: string) => void;
  lang: 'bn' | 'en';
}

interface CategoryVisualConfig {
  gradient: string;
  badgeBg: string;
  badgeText: string;
  badgeLabelBn: string;
  badgeLabelEn: string;
  accentColor: string;
  iconBg: string;
  icon: React.ReactNode;
  patternSvg: React.ReactNode;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  categories,
  onSelectCategory,
  lang
}) => {
  // Bespoke visual styling for each subject so each card looks distinct, vibrant, and never shows a blank gray box
  const visualConfigs: Record<string, CategoryVisualConfig> = {
    'cat-dib': {
      gradient: 'from-emerald-900 via-emerald-950 to-teal-950',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200',
      badgeText: 'text-emerald-300',
      badgeLabelBn: 'আইবিবি ডিআইবি পার্ট ১ ও ২',
      badgeLabelEn: 'IBB DIB Part 1 & 2',
      accentColor: '#10b981',
      iconBg: 'bg-emerald-800/80 text-emerald-200 border border-emerald-600/40',
      icon: <GraduationCap className="w-8 h-8 text-emerald-300" />,
      patternSvg: (
        <svg className="absolute right-2 -bottom-4 w-36 h-36 opacity-15 text-emerald-300" viewBox="0 0 100 100" fill="currentColor">
          {/* Islamic 8-pointed star rosette */}
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    'cat-banking': {
      gradient: 'from-blue-950 via-slate-900 to-indigo-950',
      badgeBg: 'bg-blue-500/20 border-blue-400/40 text-blue-200',
      badgeText: 'text-blue-300',
      badgeLabelBn: 'মুদারাবা, মুশারাকা ও সুকুক',
      badgeLabelEn: 'Mudaraba, PLS & Sukuk',
      accentColor: '#3b82f6',
      iconBg: 'bg-blue-900/80 text-blue-200 border border-blue-600/40',
      icon: <Building2 className="w-8 h-8 text-blue-300" />,
      patternSvg: (
        <svg className="absolute right-2 -bottom-4 w-36 h-36 opacity-15 text-blue-300" viewBox="0 0 100 100" fill="currentColor">
          {/* Islamic Vault Arch & Geometric Lattice */}
          <path d="M20,90 L20,40 Q50,10 80,40 L80,90 Z" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="20" y1="90" x2="80" y2="90" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    },
    'cat-quran': {
      gradient: 'from-amber-950 via-stone-900 to-yellow-950',
      badgeBg: 'bg-amber-500/20 border-amber-400/40 text-amber-200',
      badgeText: 'text-amber-300',
      badgeLabelBn: 'আয়াত ও সহীহ হাদিস সংকলন',
      badgeLabelEn: 'Quran & Hadith Compilations',
      accentColor: '#f59e0b',
      iconBg: 'bg-amber-900/80 text-amber-200 border border-amber-600/40',
      icon: <BookOpen className="w-8 h-8 text-amber-300" />,
      patternSvg: (
        <svg className="absolute right-2 -bottom-4 w-36 h-36 opacity-15 text-amber-300" viewBox="0 0 100 100" fill="currentColor">
          {/* Open Rehal & Floral Arabesque geometry */}
          <path d="M10,80 Q50,60 90,80 L80,30 Q50,45 20,30 Z" fill="none" stroke="currentColor" strokeWidth="3" />
          <polygon points="50,20 60,40 40,40" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
        </svg>
      )
    },
    'cat-fiqh': {
      gradient: 'from-teal-950 via-emerald-950 to-stone-950',
      badgeBg: 'bg-teal-500/20 border-teal-400/40 text-teal-200',
      badgeText: 'text-teal-300',
      badgeLabelBn: 'শরীয়াহ ফতোয়া ও রুলিং',
      badgeLabelEn: 'Fiqh Resolutions & Fatwas',
      accentColor: '#14b8a6',
      iconBg: 'bg-teal-900/80 text-teal-200 border border-teal-600/40',
      icon: <Scale className="w-8 h-8 text-teal-300" />,
      patternSvg: (
        <svg className="absolute right-2 -bottom-4 w-36 h-36 opacity-15 text-teal-300" viewBox="0 0 100 100" fill="currentColor">
          {/* Scales of Justice & Islamic Octagon */}
          <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="3" />
          <line x1="30" y1="35" x2="70" y2="35" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    }
  };

  const getVisual = (id: string): CategoryVisualConfig => {
    return visualConfigs[id] || visualConfigs['cat-dib'];
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'bn' ? 'বিষয়ভিত্তিক বিভাগসমূহ' : 'Subject Divisions'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              {lang === 'bn' ? 'প্রধান শিক্ষামূলক বিভাগ' : 'Featured Knowledge Categories'}
            </h2>
          </div>
          <p className="text-sm text-stone-500 max-w-md">
            {lang === 'bn' 
              ? 'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং, আন্তর্জাতিক শরীয়াহ স্ট্যান্ডার্ড এবং প্রামাণ্য ইসলামিক ফিকহ সংকলন।'
              : 'Direct access to structured study modules, past question papers, and authentic financial treatises.'}
          </p>
        </div>

        {/* 4 Cards Grid - with distinct colorful headers & icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const visual = getVisual(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.courseType, cat.slug)}
                className="group cursor-pointer rounded-2xl border border-stone-200/90 overflow-hidden bg-stone-50 hover:bg-white hover:border-emerald-600/60 hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1"
              >
                {/* Visual Header with Distinct Islamic Theme & Colors */}
                <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${visual.gradient} p-5 flex flex-col justify-between text-white`}>
                  {/* Subtle Background Pattern (never empty/broken) */}
                  {visual.patternSvg}

                  {/* Top Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-xs ${visual.badgeBg}`}>
                      {lang === 'bn' ? visual.badgeLabelBn : visual.badgeLabelEn}
                    </span>
                    <span className="font-semibold text-xs px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-white/90">
                      {cat.itemCount} {lang === 'bn' ? 'টি রিসোর্স' : 'PDFs'}
                    </span>
                  </div>

                  {/* Center/Bottom Subject Icon Emblem */}
                  <div className="relative z-10 flex items-center gap-3 mt-auto">
                    <div className={`p-3 rounded-xl shadow-lg backdrop-blur-md ${visual.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                      {visual.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug drop-shadow-sm group-hover:text-emerald-200 transition-colors">
                        {lang === 'bn' ? cat.nameBn : cat.name}
                      </h3>
                      <span className="text-[11px] text-stone-300 block">
                        {lang === 'bn' ? 'পূর্ণাঙ্গ সিলেবাস ও নোটস' : 'Comprehensive syllabus'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-stone-600 font-bengali line-clamp-3 leading-relaxed mb-4">
                    {lang === 'bn' ? cat.descriptionBn : cat.description}
                  </p>

                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-900">
                    <span className="flex items-center gap-1">
                      <span>{lang === 'bn' ? 'ফাইলগুলো পড়ুন ও ডাউনলোড করুন' : 'Explore Archive'}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform text-emerald-700" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
