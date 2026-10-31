import React from 'react';
import { PlayCircle, CheckCircle2, BookOpen, ArrowRight, RotateCcw } from 'lucide-react';
import { PdfResource } from '../types';

interface ResumeStudyBannerProps {
  lastRead: { id: string; title: string; titleBn: string; timestamp: number } | null;
  completedCount: number;
  totalCount: number;
  onResume: (resourceId: string) => void;
  lang: 'bn' | 'en';
}

export const ResumeStudyBanner: React.FC<ResumeStudyBannerProps> = ({
  lastRead,
  completedCount,
  totalCount,
  onResume,
  lang
}) => {
  if (!lastRead && completedCount === 0) {
    return null;
  }

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-[#14532D] via-[#047857] to-[#0f3d23] text-white rounded-xl p-3.5 sm:p-5 shadow-md border border-[#D4AF37]/30 my-4 sm:my-6 font-bengali">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Last read info & Resume button */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-emerald-300 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">
              {lang === 'bn' ? 'আপনার শেষ পঠিত বিষয়' : 'Last Visited Study Material'}
            </div>
            <div className="text-sm sm:text-base font-bold text-white truncate max-w-md">
              {lastRead ? (lang === 'bn' ? lastRead.titleBn : lastRead.title) : (lang === 'bn' ? 'স্টাডি প্রগ্রেস চালু রয়েছে' : 'Study Progress Active')}
            </div>
          </div>
        </div>

        {/* Center/Right: Progress bar & Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0 justify-end">
          {/* Progress pill */}
          <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white">{completedCount}</span>
              <span className="text-emerald-200"> / {totalCount} {lang === 'bn' ? 'টি পড়া শেষ' : 'Completed'}</span>
              <span className="ml-1 text-emerald-300 font-semibold">({progressPercent}%)</span>
            </div>
          </div>

          {/* 1-Click Resume Button */}
          {lastRead && (
            <button
              onClick={() => onResume(lastRead.id)}
              className="w-full sm:w-auto px-4 py-2 bg-white text-emerald-950 hover:bg-emerald-50 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 group cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-emerald-800 group-hover:scale-110 transition-transform" />
              <span>{lang === 'bn' ? 'যেখানে ছেড়েছিলেন সেখান থেকে শুরু' : 'Resume Where You Left Off'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-800" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
