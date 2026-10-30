import React, { useState } from 'react';
import { Bookmark, Trash2, ArrowLeft, BookOpen, Download, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { PdfResource } from '../types';
import { PdfCard } from './PdfCard';

interface BookmarksViewProps {
  resources: PdfResource[];
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onPreview: (res: PdfResource) => void;
  onDownloadIncrement: (id: string) => void;
  completedIds: string[];
  onToggleComplete: (id: string) => void;
  onBackToLibrary: () => void;
  lang: 'bn' | 'en';
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  resources,
  bookmarks,
  onToggleBookmark,
  onPreview,
  onDownloadIncrement,
  completedIds,
  onToggleComplete,
  onBackToLibrary,
  lang
}) => {
  const [filterPart, setFilterPart] = useState<'ALL' | 'DIB-1' | 'DIB-2'>('ALL');

  const bookmarkedResources = resources.filter(r => bookmarks.includes(r.id));
  const filtered = bookmarkedResources.filter(r => {
    if (filterPart === 'ALL') return true;
    return r.course === filterPart;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-bengali">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={onBackToLibrary}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-800 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'মূল পাঠাগারে ফিরে যান' : 'Back to Library'}</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <Bookmark className="w-6 h-6 fill-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
                {lang === 'bn' ? 'সংরক্ষিত প্রশ্ন ও স্টাডি রিসোর্স' : 'Saved Questions & Bookmarks'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                {lang === 'bn' 
                  ? `মোট ${bookmarkedResources.length} টি গুরুত্বপূর্ণ প্রশ্নোত্তর ও হ্যান্ডনোট বুকমার্ক তালিকায় সংরক্ষিত রয়েছে।`
                  : `You have ${bookmarkedResources.length} questions and study guides saved for quick revision.`}
              </p>
            </div>
          </div>
        </div>

        {/* Filter by Part 1 vs Part 2 */}
        {bookmarkedResources.length > 0 && (
          <div className="flex items-center bg-stone-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setFilterPart('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterPart === 'ALL' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'bn' ? 'সবগুলো' : 'All'} ({bookmarkedResources.length})
            </button>
            <button
              onClick={() => setFilterPart('DIB-1')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterPart === 'DIB-1' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'bn' ? 'পার্ট-১' : 'Part-1'}
            </button>
            <button
              onClick={() => setFilterPart('DIB-2')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterPart === 'DIB-2' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'bn' ? 'পার্ট-২' : 'Part-2'}
            </button>
          </div>
        )}
      </div>

      {/* Bookmarked Grid or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(res => (
            <PdfCard
              key={res.id}
              resource={res}
              onPreview={onPreview}
              onDownloadIncrement={onDownloadIncrement}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
              lang={lang}
              isCompleted={completedIds.includes(res.id)}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">
            {lang === 'bn' ? 'কোনো সংরক্ষিত প্রশ্ন পাওয়া যায়নি' : 'No Bookmarks Found'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 font-bengali">
            {lang === 'bn' 
              ? 'যেকোনো পরীক্ষার প্রশ্ন বা পাঠ্য উপাদানের ডানপাশের বুকমার্ক (Bookmark) আইকনে ক্লিক করে এখানে সেভ করে রাখুন, যাতে রিভিশনের সময় এক ক্লিকেই পেয়ে যান।'
              : 'Click the bookmark icon on any exam paper or note to keep it in this personal revision folder.'}
          </p>
          <button
            onClick={onBackToLibrary}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-xs"
          >
            {lang === 'bn' ? 'প্রশ্নপত্র পাঠাগার ঘুরে দেখুন' : 'Explore Library'}
          </button>
        </div>
      )}
    </div>
  );
};
