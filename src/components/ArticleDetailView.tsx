import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Languages, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  Check, 
  BookOpen, 
  Download,
  FileText,
  Tag,
  Copy,
  Globe,
  Bookmark,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { Article, PdfResource } from '../types';
import { updateSEOMetadata } from '../utils/seo';

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
  allResources: PdfResource[];
  onOpenResource: (resource: PdfResource) => void;
  onEditArticle?: (article: Article) => void;
  lang: 'bn' | 'en';
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onBack,
  allResources,
  onOpenResource,
  onEditArticle,
  lang
}) => {
  const [contentLang, setContentLang] = useState<'bn' | 'en'>(lang);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync SEO metadata when article opens
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://islamibankingdiploma-4f7m.vercel.app';
    const canonicalPath = `/diploma/${article.slug}`;

    updateSEOMetadata({
      title: article.title,
      titleBn: article.titleBn,
      description: article.summaryBn || article.summary,
      keywords: article.keywords || article.tags,
      canonicalPath: canonicalPath,
      ogImage: article.coverImage ? `${origin}${article.coverImage.startsWith('/') ? '' : '/'}${article.coverImage}` : undefined,
      ogType: 'article',
      author: article.author,
      datePublished: article.publishedDate,
      breadcrumbs: [
        { name: 'হোম', url: '/' },
        { name: 'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB)', url: '/diploma' },
        { name: article.titleBn, url: canonicalPath }
      ]
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article]);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://islamibankingdiploma-4f7m.vercel.app';
  const fullArticleUrl = `${origin}/diploma/${article.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullArticleUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 font-bengali">
      {/* 1. SEO Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500">
          <li>
            <button 
              onClick={onBack} 
              className="hover:text-emerald-800 transition-colors"
            >
              হোম
            </button>
          </li>
          <li><ChevronRight className="w-3.5 h-3.5 text-stone-400" /></li>
          <li>
            <button 
              onClick={onBack} 
              className="hover:text-emerald-800 transition-colors"
            >
              ডিপ্লোমা ইন ইসলামিক ব্যাংকিং
            </button>
          </li>
          <li><ChevronRight className="w-3.5 h-3.5 text-stone-400" /></li>
          <li className="font-semibold text-emerald-900 truncate max-w-xs sm:max-w-md">
            {article.titleBn}
          </li>
        </ol>
      </nav>

      {/* 2. Permalink & Google Indexable URL Strip */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl px-4 py-2.5 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Globe className="w-4 h-4 text-emerald-800 shrink-0" />
          <span className="font-semibold text-emerald-950 shrink-0">স্থায়ী লিংক:</span>
          <span className="font-mono text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200 truncate max-w-full text-[11px]">
            {fullArticleUrl}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-800 text-white text-[10px] font-bold rounded-full">
            <Check className="w-3 h-3" />
            <span>Google Search Ready</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-300 font-semibold transition-colors text-xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
          </button>

          {onEditArticle && (
            <button
              onClick={() => onEditArticle(article)}
              className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
              title="Edit Article"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>এডিট</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Hero / Cover Thumbnail Image */}
      {article.coverImage && (
        <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md bg-stone-900 max-h-[380px]">
          <img 
            src={article.coverImage} 
            alt={article.titleBn} 
            loading="lazy"
            decoding="async"
            width={800}
            height={400}
            className="w-full h-64 sm:h-80 object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-800 text-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {contentLang === 'bn' ? article.categoryBn : article.category}
              </span>
              <span className="text-stone-300 text-xs font-mono">
                /{article.slug}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold leading-tight font-bengali">
              {contentLang === 'bn' ? article.titleBn : article.title}
            </h1>
          </div>
        </div>
      )}

      {/* 4. Article Header & Metadata (if no cover image, display title normally) */}
      {!article.coverImage && (
        <div className="border-b border-stone-200 pb-6 mb-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              {contentLang === 'bn' ? article.categoryBn : article.category}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.publishedDate}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
            {contentLang === 'bn' ? article.titleBn : article.title}
          </h1>
        </div>
      )}

      {/* 5. Author byline & Reading tools toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-stone-200 mb-6 bg-white p-4 rounded-xl border border-stone-100 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-base shadow-2xs">
            {article.author.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-stone-900 text-sm">{article.author}</div>
            <div className="text-xs text-stone-500">{article.authorDesignation}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setContentLang(contentLang === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 text-xs font-semibold transition-colors"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{contentLang === 'bn' ? 'Read in English' : 'বাংলায় পড়ুন'}</span>
          </button>

          {/* Font size */}
          <div className="flex items-center bg-stone-100 rounded-lg p-0.5 text-xs text-stone-700 font-semibold">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-1 rounded ${fontSize === 'sm' ? 'bg-white shadow-xs text-emerald-900' : 'hover:text-stone-900'}`}
              title="Small text"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-1 rounded ${fontSize === 'base' ? 'bg-white shadow-xs text-emerald-900' : 'hover:text-stone-900'}`}
              title="Normal text"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 rounded ${fontSize === 'lg' ? 'bg-white shadow-xs text-emerald-900' : 'hover:text-stone-900'}`}
              title="Large text"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* 6. Summary Callout Box */}
      {article.summaryBn && (
        <div className="p-4 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-xl mb-6 text-stone-800 text-xs sm:text-sm leading-relaxed">
          <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>সংক্ষিপ্ত সারসংক্ষেপ ও পরীক্ষার মূল পয়েন্ট:</span>
          </div>
          <p className="font-bengali">
            {contentLang === 'bn' ? article.summaryBn : article.summary}
          </p>
        </div>
      )}

      {/* 7. Full Article Text with Arabic & DIB Exam formatting */}
      <div className={`text-stone-800 ${fontSizeClasses[fontSize]} font-bengali space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs`}>
        {(contentLang === 'bn' ? article.contentMarkdownBn : article.contentMarkdownEn)
          .split('\n\n')
          .map((paragraph, idx) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-xl sm:text-2xl font-bold text-stone-900 mt-8 mb-3 pb-2 border-b border-stone-100 flex items-center gap-2">
                  <span className="w-2 h-5 bg-emerald-800 rounded-full inline-block"></span>
                  <span>{paragraph.replace('## ', '')}</span>
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-lg font-bold text-stone-900 mt-5 mb-2 text-emerald-950">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={idx} className="p-4 bg-emerald-50 border-l-4 border-emerald-800 italic text-stone-900 my-4 rounded-r-xl font-arabic text-base sm:text-lg">
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            if (paragraph.startsWith('**প্রশ্ন:**') || paragraph.startsWith('**প্রশ্ন:')) {
              return (
                <div key={idx} className="p-4 bg-stone-50 border border-stone-200 rounded-xl my-4 space-y-2">
                  <div className="font-bold text-emerald-900">{paragraph}</div>
                </div>
              );
            }
            if (paragraph.startsWith('- ') || paragraph.startsWith('১. ') || paragraph.startsWith('1. ')) {
              return (
                <div key={idx} className="pl-2 space-y-1 my-3">
                  {paragraph.split('\n').map((line, li) => (
                    <div key={li} className="flex items-start gap-2 text-stone-800">
                      <span className="text-emerald-700 font-bold mt-0.5">•</span>
                      <span>{line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <p key={idx} className="leading-relaxed whitespace-pre-line text-stone-800">
                {paragraph}
              </p>
            );
          })}
      </div>

      {/* 8. Keywords & Tags Section ("কি-ওয়ার্ড যোগ করার অপশন") */}
      {(article.keywords || article.tags) && (
        <div className="mt-8 p-4 bg-stone-100 rounded-xl border border-stone-200">
          <div className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-emerald-800" />
            <span>এসইও কি-ওয়ার্ড ও বিষয়ভিত্তিক ট্যাগসমূহ:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from(new Set([...(article.keywords || []), ...(article.tags || [])])).map((kw, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 bg-white text-emerald-900 font-semibold rounded-lg text-xs border border-stone-200 shadow-2xs hover:border-emerald-600 transition-colors"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 9. Related Downloadable Past Exam PDF Materials */}
      {relatedPdfs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-stone-200">
          <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-800" />
            <span>সম্পর্কিত বিগত প্রশ্ন ও মডেল সমাধান (PDF Downloads)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPdfs.map(res => (
              <div 
                key={res.id} 
                className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-emerald-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-semibold text-emerald-800 mb-1">
                    {res.examYear} · {res.course} · {res.sessionBangla || res.examSession}
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-2 mb-2">
                    {lang === 'bn' ? res.titleBn : res.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mb-3">
                    {lang === 'bn' ? res.descriptionBn : res.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <button
                    onClick={() => onOpenResource(res)}
                    className="text-emerald-800 font-bold hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>পিডিএফ প্রিভিউ দেখুন</span>
                  </button>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {res.fileSize}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. Back button bottom */}
      <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>তালিকায় ফিরে যান</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>আর্টিকেল শেয়ার করুন</span>
        </button>
      </div>
    </article>
  );
};
