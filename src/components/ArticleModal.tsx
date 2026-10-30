import React, { useState } from 'react';
import { 
  X, 
  Languages, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  Check, 
  BookOpen, 
  Download,
  FileText
} from 'lucide-react';
import { Article, PdfResource } from '../types';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  allResources: PdfResource[];
  onOpenResource: (resource: PdfResource) => void;
  initialLang: 'bn' | 'en';
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  allResources,
  onOpenResource,
  initialLang
}) => {
  if (!article) return null;

  const [articleLang, setArticleLang] = useState<'bn' | 'en'>(initialLang);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedPdfs = allResources.filter(r => 
    article.relatedResourceIds?.includes(r.id)
  );

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setArticleLang(articleLang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900 text-emerald-200 hover:bg-emerald-800 text-xs font-semibold transition-colors"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{articleLang === 'bn' ? 'Read in English' : 'বাংলায় পড়ুন'}</span>
            </button>

            {/* Font size controller */}
            <div className="hidden sm:flex items-center bg-stone-800 rounded-lg p-0.5 text-xs text-stone-300">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded ${fontSize === 'sm' ? 'bg-stone-700 text-white' : 'hover:text-white'}`}
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 rounded ${fontSize === 'base' ? 'bg-stone-700 text-white' : 'hover:text-white'}`}
                title="Normal text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded ${fontSize === 'lg' ? 'bg-stone-700 text-white' : 'hover:text-white'}`}
                title="Large text"
              >
                A+
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors"
              title="Share article"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Article Header */}
          <div className="border-b border-stone-200 pb-6">
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <span className="font-semibold text-emerald-800">
                {articleLang === 'bn' ? article.categoryBn : article.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{article.publishedDate}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.readTime}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight mb-4 font-bengali">
              {articleLang === 'bn' ? article.titleBn : article.title}
            </h1>

            {/* Author Byline */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                {article.author.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-stone-900">{article.author}</div>
                <div className="text-xs text-stone-500">{article.authorDesignation}</div>
              </div>
            </div>
          </div>

          {/* Article Full Text */}
          <div className={`text-stone-800 ${fontSizeClasses[fontSize]} font-bengali space-y-4`}>
            {(articleLang === 'bn' ? article.contentMarkdownBn : article.contentMarkdownEn)
              .split('\n\n')
              .map((paragraph, idx) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-xl sm:text-2xl font-bold text-stone-900 mt-6 mb-3 pt-2">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-lg font-bold text-stone-900 mt-4 mb-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('> ')) {
                  return (
                    <blockquote key={idx} className="p-4 bg-emerald-50/70 border-l-4 border-emerald-700 italic text-stone-800 my-4 rounded-r-lg">
                      {paragraph.replace('> ', '')}
                    </blockquote>
                  );
                }
                return (
                  <p key={idx} className="leading-relaxed whitespace-pre-line text-stone-700">
                    {paragraph}
                  </p>
                );
              })}
          </div>

          {/* Related DIB Past Questions for this article */}
          {relatedPdfs.length > 0 && (
            <div className="mt-8 pt-6 border-t border-stone-200 bg-stone-50 p-5 rounded-xl">
              <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-800" />
                <span>
                  {articleLang === 'bn' 
                    ? 'এই আর্টিকেল সম্পর্কিত বিগত ডিআইবি প্রশ্নপত্র ও সমাধান' 
                    : 'Related DIB Exam Questions & Reference PDFs'}
                </span>
              </h4>
              <div className="space-y-2">
                {relatedPdfs.map(res => (
                  <div 
                    key={res.id}
                    onClick={() => {
                      onClose();
                      onOpenResource(res);
                    }}
                    className="p-3 bg-white rounded-lg border border-stone-200 hover:border-emerald-600 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-emerald-800">
                        {res.examYear} · {res.subject}
                      </div>
                      <div className="text-sm font-bold text-stone-900">
                        {articleLang === 'bn' ? res.titleBn : res.title}
                      </div>
                    </div>
                    <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1 shrink-0">
                      <span>{articleLang === 'bn' ? 'পিডিএফ দেখুন' : 'View PDF'}</span>
                      <Download className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-2 text-xs">
            <span className="text-stone-400 font-medium">{articleLang === 'bn' ? 'বিষয়সূচি:' : 'Tags:'}</span>
            {article.tags.map((tag, i) => (
              <span key={i} className="text-stone-600 hover:text-emerald-800 cursor-default">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>{articleLang === 'bn' ? 'উন্মুক্ত ইসলামিক অর্থনীতি গবেষণা' : 'Open Islamic Economics Research'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold transition-colors"
          >
            {articleLang === 'bn' ? 'পড়া সম্পন্ন করুন' : 'Finish Reading'}
          </button>
        </div>
      </div>
    </div>
  );
};
