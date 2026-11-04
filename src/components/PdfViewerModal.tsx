import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  FileText, 
  Calendar, 
  Bookmark, 
  Share2, 
  Check, 
  AlertTriangle,
  BookOpen,
  Info,
  Maximize2
} from 'lucide-react';
import { PdfResource } from '../types';
import { 
  getGoogleDriveEmbedUrl, 
  isGoogleDriveUrl, 
  generateStudyDocumentBlob, 
  triggerDownload 
} from '../utils/pdfUtils';

interface PdfViewerModalProps {
  resource: PdfResource | null;
  onClose: () => void;
  onDownloadIncrement: (id: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  allResources: PdfResource[];
  onSelectRelated: (resource: PdfResource) => void;
  lang: 'bn' | 'en';
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  resource,
  onClose,
  onDownloadIncrement,
  isBookmarked,
  onToggleBookmark,
  allResources,
  onSelectRelated,
  lang
}) => {
  if (!resource) return null;

  const [copied, setCopied] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const hasDirectPdf = Boolean(resource.pdfFileUrl);
  const hasDriveLink = Boolean(resource.googleDriveUrl);
  const hasAnySource = hasDirectPdf || hasDriveLink;

  const handleDownload = () => {
    if (!hasAnySource) {
      setDownloadError(
        lang === 'bn' 
          ? 'এই নথির কোনো বৈধ উৎস বা ফাইল সংরক্ষিত নেই।' 
          : 'No valid file attachment or download link available.'
      );
      return;
    }

    onDownloadIncrement(resource.id);

    // If direct Supabase Storage PDF is available, open / trigger download
    if (resource.pdfFileUrl) {
      const a = document.createElement('a');
      a.href = resource.pdfFileUrl;
      a.target = '_blank';
      a.rel = 'noopener,noreferrer';
      a.download = `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (hasDriveLink) {
      window.open(resource.googleDriveUrl, '_blank', 'noopener,noreferrer');
      return;
    }

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
      const filename = `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}_DIB_Resource.html`;
      triggerDownload(blob, filename);
    } catch {
      // fallback
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find related resources based on subject or course
  const related = allResources
    .filter(r => r.id !== resource.id && (r.subject === resource.subject || r.course === resource.course))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3 truncate pr-4">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                {lang === 'bn' ? resource.subjectBn : resource.subject} · {resource.examYear}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {lang === 'bn' ? resource.titleBn : resource.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleBookmark(resource.id)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-amber-500 text-stone-900' : 'bg-stone-800 text-stone-300 hover:text-white'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors"
              title="Copy resource URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-500 block">{lang === 'bn' ? 'কোর্স / প্রোগ্রাম:' : 'Track / Course:'}</span>
              <span className="font-semibold text-stone-900">{resource.course}</span>
            </div>
            <div>
              <span className="text-stone-500 block">{lang === 'bn' ? 'পরীক্ষার সাল ও সেশন:' : 'Year & Session:'}</span>
              <span className="font-semibold text-stone-900">{resource.examYear} ({resource.examSession})</span>
            </div>
            <div>
              <span className="text-stone-500 block">{lang === 'bn' ? 'ফাইলের আকার:' : 'File Size:'}</span>
              <span className="font-semibold text-stone-900">{resource.fileSize} ({resource.pageCount || 10} {lang === 'bn' ? 'পৃষ্ঠা' : 'pages'})</span>
            </div>
            <div>
              <span className="text-stone-500 block">{lang === 'bn' ? 'ভাষার মাধ্যম:' : 'Language:'}</span>
              <span className="font-semibold text-stone-900 uppercase">{resource.language}</span>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-2">
              {lang === 'bn' ? 'নথির বিবরণ ও সংক্ষিপ্ত পর্যালোচনা' : 'Resource Overview & Examination Scope'}
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-stone-200">
              {lang === 'bn' ? resource.descriptionBn : resource.description}
            </p>
          </div>

          {/* High Yield Key Topics if provided */}
          {resource.keyTopics && resource.keyTopics.length > 0 && (
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'bn' ? 'পরীক্ষার সিলেবাসভিত্তিক প্রধান বিষয়বস্তু' : 'Key Syllabus Themes Covered'}</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-800">
                {resource.keyTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Preview Canvas / Embedded Viewer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-stone-900">
                {lang === 'bn' ? 'ডিজিটাল রিডিং ও প্রিভিউ মোড' : 'Digital Reader & Document Preview'}
              </h4>
              <span className="text-xs text-stone-500">
                {resource.googleDriveUrl ? (lang === 'bn' ? 'গুগল ড্রাইভ ভিউয়ার সক্রিয়' : 'Google Drive Embed Active') : (lang === 'bn' ? 'ইন্টারেক্টিভ স্টাডি প্রিভিউ' : 'Interactive Document Canvas')}
              </span>
            </div>

            <div className="relative rounded-xl border border-stone-300 bg-stone-100 overflow-hidden min-h-[300px] flex flex-col justify-center items-center p-6 text-center">
              {resource.pdfFileUrl ? (
                <div className="w-full space-y-4">
                  <div className="max-w-md mx-auto text-xs text-stone-600 bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-stone-900 text-sm">
                      {lang === 'bn' ? 'Supabase ক্লাউড পিডিএফ ডকুমেন্ট' : 'Supabase Cloud PDF Document'}
                    </p>
                    <p className="leading-relaxed">
                      {lang === 'bn'
                        ? 'এই ডকুমেন্টটি Supabase Storage "pdfs" বাকেটে সুরক্ষিতভাবে সংরক্ষিত রয়েছে।'
                        : 'This document is securely stored on Supabase Storage "pdfs" bucket.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <a
                        href={resource.pdfFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        <span>{lang === 'bn' ? 'নতুন ট্যাবে সরাসরি পড়ুন' : 'Read in New Tab'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium transition-colors cursor-pointer border border-stone-300"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : resource.googleDriveUrl ? (
                <div className="w-full space-y-4">
                  <div className="max-w-md mx-auto text-xs text-stone-600 bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
                    <p className="font-semibold text-stone-900 mb-1">
                      {lang === 'bn' ? 'গুগল ড্রাইভ থেকে ব্রাউজ করুন' : 'Cloud Hosted on Google Drive'}
                    </p>
                    <p className="mb-3">
                      {lang === 'bn'
                        ? 'এই ডকুমেন্টটি গুগল ড্রাইভে সরাসরি প্রিভিউ ও হাই-কোয়ালিটিতে প্রিন্ট করা যাবে।'
                        : 'Open in new tab to read directly inside Google Docs / Drive with native zooming and printing.'}
                    </p>
                    <a
                      href={resource.googleDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <span>{lang === 'bn' ? 'নতুন ট্যাবে গুগল ড্রাইভে খুলুন' : 'Open in Google Drive'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="max-w-lg space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm">
                    {lang === 'bn' ? 'প্রামাণ্য স্টাডি শিট ও প্রশ্ন সমাধান প্রস্তুত' : 'Verified Study Document Ready'}
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {lang === 'bn'
                      ? 'ডাউনলোড বোতামে ক্লিক করলেই পূর্ণাঙ্গ ফরম্যাটেড স্টাডি শিটটি আপনার ডিভাইসে সেভ হবে। প্রিন্ট করে বা অফলাইনে পড়াশোনার জন্য অত্যন্ত উপযোগী।'
                      : 'Click the download button below to save the formatted revision document directly to your device for offline study.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Validation or Download Error warning */}
          {downloadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{downloadError}</span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            <span className="text-xs text-stone-500 font-medium mr-1">
              {lang === 'bn' ? 'ট্যাগসমূহ:' : 'Tags:'}
            </span>
            {resource.tags.map((tag, i) => (
              <span 
                key={i} 
                className="text-xs text-stone-600 hover:text-emerald-800 cursor-default"
              >
                #{tag}{i < resource.tags.length - 1 ? ' ·' : ''}
              </span>
            ))}
          </div>

          {/* Related Resources */}
          {related.length > 0 && (
            <div className="pt-4 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                {lang === 'bn' ? 'সম্পর্কিত অন্যান্য ডিপ্লোমা রিসোর্স' : 'Related Exam Resources'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {related.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectRelated(item)}
                    className="p-3 rounded-lg border border-stone-200 bg-stone-50 hover:bg-white hover:border-emerald-600 cursor-pointer transition-all text-left"
                  >
                    <div className="text-[11px] text-emerald-800 font-semibold mb-1 truncate">
                      {item.examYear} · {item.course}
                    </div>
                    <div className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug">
                      {lang === 'bn' ? item.titleBn : item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            {lang === 'bn' 
              ? 'আইবিবি সিলেবাস এবং বাংলাদেশ ব্যাংক গাইডলাইন সমর্থিত শিক্ষামূলক রিসোর্স।'
              : 'Grounded in IBB syllabus and Bangladesh Bank Islamic banking frameworks.'}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ডাউনলোড করুন (ফ্রি)' : 'Download Document'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
