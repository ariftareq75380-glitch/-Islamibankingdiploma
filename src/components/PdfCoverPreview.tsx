import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { StorageService } from '../services/storage';
import { hasRealPdfFile, resourceKeyForPdfUrl } from '../utils/pdfUtils';

interface PdfCoverPreviewProps {
  pdfUrl: string;
  title: string;
  lang: 'bn' | 'en';
}

/**
 * Static preview of a real PDF: its cover / first pages, rendered to
 * images (see utils/pdfCoverData.ts).
 *
 * No iframe and no external viewer service is used here, on purpose:
 * a direct-PDF iframe shows only a filename + "Open" button on Android
 * Chrome, and the Google Docs viewer (gview) refused to connect and
 * rendered a blank frame. Images render on every device.
 *
 * The cover images live in a lazily imported module (base64 data URIs),
 * so they do not bloat the main bundle — they are fetched only when a
 * preview is actually shown. While loading, a small "loading" card is
 * shown. When no cover image was generated for the PDF, a neat
 * placeholder card is shown instead — never an empty frame and never a
 * fake file. Tapping the cover (or the button) opens the full PDF in a
 * new tab.
 */
export const PdfCoverPreview: React.FC<PdfCoverPreviewProps> = ({ pdfUrl, title, lang }) => {
  // null = cover module still loading; [] = no cover generated for this PDF.
  const [coverImages, setCoverImages] = useState<string[] | null>(null);

  // The shared count key for this PDF's real file. Tapping the cover (or
  // the fallback button) opens the full PDF, so it counts as a download
  // — same key as the library card and the article page button, so all
  // of them count together (one row per session per day).
  const downloadKey = hasRealPdfFile(pdfUrl) ? resourceKeyForPdfUrl(pdfUrl) : null;

  // Fire-and-forget: the PDF must open immediately, never wait for the
  // recording. The anchor's normal navigation is untouched.
  const handleOpenPdf = () => {
    if (downloadKey) {
      StorageService.recordPdfDownload(downloadKey);
    }
  };

  useEffect(() => {
    let cancelled = false;
    import('../utils/pdfCoverData')
      .then((m) => m.loadPdfCoverImages(pdfUrl))
      .then((images) => {
        if (!cancelled) setCoverImages(images);
      })
      .catch(() => {
        if (!cancelled) setCoverImages([]);
      });
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  const header = (
    <div className="px-3 py-2 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-2">
      <span className="text-xs font-bold text-stone-900">
        {lang === 'bn' ? 'PDF প্রিভিউ — প্রথম পৃষ্ঠা' : 'PDF preview — first pages'}
      </span>
    </div>
  );

  if (coverImages === null) {
    return (
      <div className="rounded-xl border border-stone-300 bg-white overflow-hidden">
        {header}
        <div className="p-6 text-center text-xs text-stone-500 animate-pulse">
          {lang === 'bn' ? 'প্রিভিউ লোড হচ্ছে…' : 'Loading preview…'}
        </div>
      </div>
    );
  }

  if (coverImages.length === 0) {
    return (
      <div className="rounded-xl border border-stone-300 bg-stone-50 p-6 text-center">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <p className="font-bold text-stone-900 text-sm mb-1">{title}</p>
        <p className="text-xs text-stone-600 leading-relaxed mb-3">
          {lang === 'bn'
            ? 'এই PDF-এর প্রিভিউ ছবি এখনো তৈরি করা হয়নি। নিচের বাটনে ক্লিক করে পুরো PDF পড়ুন।'
            : 'No preview image has been generated for this PDF yet. Use the button below to read the full PDF.'}
        </p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOpenPdf}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'নতুন ট্যাবে PDF পড়ুন' : 'Read PDF in new tab'}</span>
        </a>
      </div>
    );
  }

  return (
    <a
      href={pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleOpenPdf}
      className="block group"
      title={lang === 'bn' ? 'পুরো PDF পড়তে ক্লিক করুন (নতুন ট্যাবে খুলবে)' : 'Click to read the full PDF (opens in a new tab)'}
    >
      <div className="rounded-xl border border-stone-300 bg-white overflow-hidden">
        <div className="px-3 py-2 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-stone-900">
            {lang === 'bn' ? 'PDF প্রিভিউ — প্রথম পৃষ্ঠা' : 'PDF preview — first pages'}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 shrink-0">
            <ExternalLink className="w-3 h-3" />
            <span>{lang === 'bn' ? 'বড় করে দেখুন' : 'Open full PDF'}</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-100">
          {coverImages.map((src, i) => (
            <img
              key={src.slice(0, 40) + i}
              src={src}
              alt={`${title} — ${lang === 'bn' ? `পৃষ্ঠা ${i + 1}` : `page ${i + 1}`}`}
              loading="lazy"
              decoding="async"
              className="w-full rounded border border-stone-200 shadow-xs bg-white transition-transform group-hover:scale-[1.01]"
            />
          ))}
        </div>
      </div>
    </a>
  );
};
