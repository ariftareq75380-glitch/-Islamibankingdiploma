import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Bookmark, 
  ExternalLink, 
  AlertCircle,
  Share2,
  Check,
  CheckCircle2
} from 'lucide-react';
import { PdfResource } from '../types';
import { generateStudyDocumentBlob, triggerDownload } from '../utils/pdfUtils';

interface PdfCardProps {
  resource: PdfResource;
  onPreview: (resource: PdfResource) => void;
  onDownloadIncrement: (id: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  lang: 'bn' | 'en';
  isCompleted?: boolean;
  onToggleComplete?: (id: string) => void;
}

export const PdfCard: React.FC<PdfCardProps> = ({
  resource,
  onPreview,
  onDownloadIncrement,
  isBookmarked,
  onToggleBookmark,
  lang,
  isCompleted = false,
  onToggleComplete
}) => {
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadError(null);

    // Validate available source
    if (!resource.pdfFileUrl && !resource.googleDriveUrl) {
      setDownloadError(
        lang === 'bn' 
          ? 'এই রিসোর্সটির কোনো বৈধ ডাউনলোড লিঙ্ক বা ফাইল যুক্ত নেই।' 
          : 'No valid download source or URL found for this resource.'
      );
      return;
    }

    onDownloadIncrement(resource.id);

    // If external Google Drive URL is provided and preferred
    if (resource.googleDriveUrl && !resource.pdfFileUrl) {
      window.open(resource.googleDriveUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Direct download generation
    try {
      const blob = generateStudyDocumentBlob(
        resource.title,
        resource.titleBn,
        resource.subject,
        resource.examYear,
        resource.examSession,
        resource.description,
        resource.keyTopics || []
      );
      const filename = `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}_DIB_Study.html`;
      triggerDownload(blob, filename);
    } catch {
      // Fallback
      if (resource.pdfFileUrl) {
        window.open(resource.pdfFileUrl, '_blank');
      }
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
      isCompleted 
        ? 'bg-emerald-50/40 border-emerald-300 shadow-xs' 
        : 'bg-white border-stone-200 hover:border-emerald-700/50 hover:shadow-md'
    }`}>
      <div>
        {/* Unboxed Metadata Header */}
        <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-emerald-800">
              {lang === 'bn' ? resource.subjectBn : resource.subject}
            </span>
            <span aria-hidden="true">·</span>
            <span>{resource.examYear} {resource.examSession !== 'All' ? `(${resource.examSession})` : ''}</span>
            <span aria-hidden="true">·</span>
            <span className="uppercase text-[11px] font-medium text-stone-600">
              {resource.course}
            </span>
            <span aria-hidden="true">·</span>
            <span>{resource.fileSize}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Mark as Completed / Read Tracker */}
            {onToggleComplete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(resource.id);
                }}
                title={isCompleted ? (lang === 'bn' ? 'পড়া সম্পন্ন হয়েছে (আনমার্ক করুন)' : 'Completed (Click to unmark)') : (lang === 'bn' ? 'পড়া সম্পন্ন হিসেবে চিহ্নিত করুন' : 'Mark as Read')}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium ${
                  isCompleted 
                    ? 'text-emerald-800 bg-emerald-100/80 font-semibold' 
                    : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-700' : ''}`} />
                <span className="hidden sm:inline">
                  {isCompleted ? (lang === 'bn' ? 'পড়া শেষ' : 'Read') : (lang === 'bn' ? 'চিহ্নিত করুন' : 'Mark')}
                </span>
              </button>
            )}

            {/* Bookmark Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(resource.id);
              }}
              title={isBookmarked ? (lang === 'bn' ? 'বুকমার্ক মুছুন' : 'Remove bookmark') : (lang === 'bn' ? 'বুকমার্ক করুন' : 'Bookmark this PDF')}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked ? 'text-amber-600 bg-amber-50' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Resource Title */}
        <h3 
          onClick={() => onPreview(resource)}
          className="text-base sm:text-lg font-bold text-stone-900 hover:text-emerald-800 cursor-pointer transition-colors leading-snug mb-1.5 font-bengali"
        >
          {lang === 'bn' ? resource.titleBn : resource.title}
        </h3>

        {/* Secondary Title */}
        <p className="text-xs text-stone-500 italic mb-3">
          {lang === 'bn' ? resource.title : resource.titleBn}
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4 line-clamp-3 font-bengali">
          {lang === 'bn' ? resource.descriptionBn : resource.description}
        </p>

        {/* High-yield exam topics preview */}
        {resource.keyTopics && resource.keyTopics.length > 0 && (
          <div className="mb-4 bg-stone-50/80 rounded-xl p-3 border border-stone-200/60 text-xs font-bengali">
            <span className="font-semibold text-stone-700 block mb-1">
              {lang === 'bn' ? 'পরীক্ষার প্রধান টপিক:' : 'Key Exam Topics:'}
            </span>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-stone-600">
              {resource.keyTopics.slice(0, 3).map((topic, i) => (
                <span key={i} className="inline-flex items-center">
                  <span className="text-emerald-700 mr-1">•</span>
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error notification if broken link */}
        {downloadError && (
          <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs rounded-md flex items-center gap-1.5 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{downloadError}</span>
          </div>
        )}
      </div>

      {/* Footer Actions & Stats */}
      <div className="pt-4 border-t border-stone-100 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-3">
            <span>{resource.downloadsCount} {lang === 'bn' ? 'ডাউনলোড' : 'downloads'}</span>
            <span>·</span>
            <span>{resource.viewsCount} {lang === 'bn' ? 'বার পড়া হয়েছে' : 'views'}</span>
          </div>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 hover:text-stone-700 text-stone-400 transition-colors"
            title="Share or Copy Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{copied ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'শেয়ার' : 'Share')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Preview Button */}
          <button
            onClick={() => onPreview(resource)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'প্রিভিউ দেখুন' : 'Quick Preview'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}</span>
          </button>
        </div>

        {/* Optional Google Drive indicator if present */}
        {resource.googleDriveUrl && (
          <div className="flex items-center justify-end text-[11px] text-stone-400">
            <a 
              href={resource.googleDriveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-700 inline-flex items-center gap-1 underline underline-offset-2"
            >
              <span>{lang === 'bn' ? 'গুগল ড্রাইভ ব্যাকআপ লিঙ্ক' : 'Google Drive Mirror'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
