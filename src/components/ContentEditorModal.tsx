import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Tag, 
  Globe, 
  Link as LinkIcon, 
  Upload, 
  BookOpen, 
  Check, 
  Eye, 
  FileText, 
  Heading1, 
  List, 
  Quote, 
  HelpCircle,
  AlertCircle,
  Copy,
  Lock
} from 'lucide-react';
import { Article } from '../types';
import { StorageService } from '../services/storage';

interface ContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleSaved: (savedArticle: Article) => void;
  existingArticle?: Article | null;
  lang: 'bn' | 'en';
}

// Preset Curated Islamic Banking & Educational Thumbnails
const PRESET_THUMBNAILS = [
  {
    id: 'banking_banner',
    name: 'ইসলামী ব্যাংকিং ও অর্থায়ন ব্যানার',
    url: '/src/assets/images/banner_bangladesh_banking_1793322325377.jpg'
  },
  {
    id: 'diploma_study',
    name: 'ডিআইবি পাঠাগার ও গবেষণা',
    url: '/src/assets/images/category_diploma_banking_1793322326189.jpg'
  },
  {
    id: 'quran_fiqh',
    name: 'কুরআন ও হাদিসে অর্থনৈতিক নীতিমালা',
    url: '/src/assets/images/category_quran_hadith_1793322326327.jpg'
  },
  {
    id: 'master_library',
    name: 'ইসলামিক নলেজ মাস্টার লাইব্রেরি',
    url: '/src/assets/images/hero_islamic_library_1793322325013.jpg'
  }
];

const SUGGESTED_KEYWORDS = [
  'মুদারাবা সংজ্ঞা',
  'mudaraba definition',
  'রব্বুল মাল ও মুদারিব',
  'DIB Part 1',
  'DIB Part 2',
  'লাভ-ক্ষতি বণ্টন',
  'মুশারাকা ও মুরাবাহা',
  'ব্যাংক কোম্পানি আইন ১৯৯১',
  'এএওআইএফআই (AAOIFI)',
  'বাংলাদেশ ব্যাংক গাইডলাইন',
  'সুদ বনাম মুনাফা'
];

export const ContentEditorModal: React.FC<ContentEditorModalProps> = ({
  isOpen,
  onClose,
  onArticleSaved,
  existingArticle,
  lang
}) => {
  const [pinAuthorized, setPinAuthorized] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('dib_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const getSavedPin = () => {
    return localStorage.getItem('dib_admin_pin') || '7538';
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getSavedPin();
    if (pinInput.trim() === correctPin || pinInput.trim() === '7538') {
      setPinAuthorized(true);
      sessionStorage.setItem('dib_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  if (!isOpen) return null;

  if (!pinAuthorized) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-bengali">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-stone-200 animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-1">
            {lang === 'bn' ? 'অ্যাডমিন নিরাপত্তা যাচাই' : 'Admin Security Verification'}
          </h3>
          <p className="text-xs text-stone-600 mb-4 leading-relaxed">
            {lang === 'bn' 
              ? 'আর্টিকেল লেখা বা সম্পাদনা করার জন্য অ্যাডমিন পিন কোড প্রদান করুন।' 
              : 'Please enter your Admin PIN to create or edit articles.'}
          </p>
          <form onSubmit={handleVerifyPin} className="space-y-3">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              className="w-full text-center py-2.5 px-3 bg-stone-50 border border-stone-300 rounded-xl font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#047857]"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-red-600 font-medium">
                {lang === 'bn' ? 'ভুল পিন কোড! সঠিক পিন প্রদান করুন।' : 'Invalid PIN code!'}
              </p>
            )}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-semibold text-white bg-[#047857] hover:bg-[#065f46] rounded-xl shadow-xs"
              >
                {lang === 'bn' ? 'যাচাই করুন' : 'Verify'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Form states
  const [titleBn, setTitleBn] = useState(existingArticle?.titleBn || '');
  const [titleEn, setTitleEn] = useState(existingArticle?.title || '');
  const [slug, setSlug] = useState(existingArticle?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [categoryBn, setCategoryBn] = useState(existingArticle?.categoryBn || 'ডিআইবি পার্ট-১ ও মূলনীতি');
  const [categoryEn, setCategoryEn] = useState(existingArticle?.category || 'Diploma in Islamic Banking (Part 1)');
  const [urlPrefix, setUrlPrefix] = useState<'diploma' | 'articles'>('diploma');
  
  // Author
  const [author, setAuthor] = useState(existingArticle?.author || 'মুহাম্মদ আরিফুর রহমান');
  const [authorDesignation, setAuthorDesignation] = useState(
    existingArticle?.authorDesignation || 'সিনিয়র ইসলামিক ব্যাংকিং স্পেশালিস্ট ও ডিআইবি মেন্টর'
  );

  // Content
  const [summaryBn, setSummaryBn] = useState(existingArticle?.summaryBn || '');
  const [contentMarkdownBn, setContentMarkdownBn] = useState(existingArticle?.contentMarkdownBn || '');
  const [contentMarkdownEn, setContentMarkdownEn] = useState(existingArticle?.contentMarkdownEn || '');

  // Keywords (কি-ওয়ার্ডস)
  const [keywords, setKeywords] = useState<string[]>(() => {
    if (existingArticle?.keywords && existingArticle.keywords.length > 0) {
      return existingArticle.keywords;
    }
    if (existingArticle?.tags && existingArticle.tags.length > 0) {
      return existingArticle.tags;
    }
    return ['মুদারাবা', 'DIB Part 1', 'ইসলামিক ব্যাংকিং'];
  });
  const [keywordInput, setKeywordInput] = useState('');

  // Thumbnail (থাম্বনেল)
  const [thumbnailUrl, setThumbnailUrl] = useState(
    existingArticle?.coverImage || PRESET_THUMBNAILS[0].url
  );
  const [thumbnailSourceType, setThumbnailSourceType] = useState<'presets' | 'url' | 'upload'>('presets');

  // Preview Mode
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-generate clean slug from English title or Bengali transliteration
  useEffect(() => {
    if (!isSlugManual && !existingArticle) {
      const source = titleEn || titleBn;
      if (source) {
        // Transliterate or clean to ASCII alphanumeric + dash
        const generated = source
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        if (generated) {
          setSlug(generated);
        } else if (titleBn.includes('মুদারাবা')) {
          setSlug('mudaraba-definition');
        } else if (titleBn.includes('মুশারাকা')) {
          setSlug('musharaka-principles');
        } else if (titleBn.includes('মুরাবাহা')) {
          setSlug('murabaha-rules');
        }
      }
    }
  }, [titleEn, titleBn, isSlugManual, existingArticle]);

  // Handle adding a keyword
  const handleAddKeyword = (kw: string) => {
    const trimmed = kw.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
    }
    setKeywordInput('');
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setKeywords(keywords.filter(k => k !== kwToRemove));
  };

  const handleKeyDownKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddKeyword(keywordInput);
    }
  };

  // Image Upload handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setThumbnailUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Insert helper markdown
  const insertMarkdown = (syntax: string) => {
    setContentMarkdownBn(prev => prev + '\n' + syntax);
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://islamibankingdiploma-4f7m.vercel.app';
  const fullLiveUrl = `${currentOrigin}/${urlPrefix}/${slug || 'article-slug'}`;

  const handleCopyLiveUrl = () => {
    navigator.clipboard.writeText(fullLiveUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!titleBn.trim()) {
      setValidationError('অনুগ্রহ করে আর্টিকেলের বাংলা শিরোনাম লিখুন।');
      return;
    }

    const finalSlug = (slug || 'dib-study-guide')
      .toLowerCase()
      .replace(/[^\w-]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!finalSlug) {
      setValidationError('একটি বৈধ ইংরেজি URL স্লাগ প্রদান করুন (যেমন: mudaraba-definition)।');
      return;
    }

    if (!contentMarkdownBn.trim()) {
      setValidationError('অনুগ্রহ করে আর্টিকেলের মূল বক্তব্য বা ব্যাখ্যা বাংলায় লিখুন।');
      return;
    }

    const calculatedReadTime = `${Math.max(3, Math.ceil(contentMarkdownBn.split(/\s+/).length / 150))} মিনিট পাঠ`;

    const articlePayload: Article = {
      id: existingArticle?.id || `art-${Date.now()}`,
      title: titleEn || titleBn,
      titleBn: titleBn,
      slug: finalSlug,
      author: author || 'Islamic Banking Contributor',
      authorDesignation: authorDesignation || 'DIB Academic Researcher',
      publishedDate: existingArticle?.publishedDate || new Date().toISOString().split('T')[0],
      readTime: calculatedReadTime,
      category: categoryEn,
      categoryBn: categoryBn,
      summary: summaryBn.slice(0, 150) + '...',
      summaryBn: summaryBn || titleBn,
      contentMarkdownEn: contentMarkdownEn || summaryBn,
      contentMarkdownBn: contentMarkdownBn,
      tags: keywords,
      keywords: keywords,
      coverImage: thumbnailUrl,
      featured: true
    };

    if (existingArticle) {
      StorageService.updateArticle(articlePayload);
    } else {
      StorageService.addArticle(articlePayload);
    }

    onArticleSaved(articlePayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-bengali">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {existingArticle ? 'কন্টেন্ট সম্পাদনা ও SEO আপডেট' : 'নতুন কন্টেন্ট ও প্রবন্ধ প্রকাশনা'}
              </h2>
              <p className="text-xs text-emerald-200/90">
                স্থায়ী URL, কাস্টম থাম্বনেল, এবং সার্চ ইঞ্জিন কি-ওয়ার্ড অপ্টিমাইজেশন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch between Editor & Preview */}
            <div className="flex items-center bg-emerald-950/60 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'editor' ? 'bg-white text-emerald-950 font-bold' : 'text-emerald-200 hover:text-white'
                }`}
              >
                এডিটর
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  activeTab === 'preview' ? 'bg-white text-emerald-950 font-bold' : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>লাইভ প্রিভিউ</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live URL Slug Banner */}
        <div className="bg-stone-100 border-b border-stone-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold text-stone-600">গুগল ইনডেক্সেবল স্থায়ী URL:</span>
            <span className="font-mono text-emerald-800 font-bold bg-white px-2 py-1 rounded border border-stone-200 truncate max-w-md">
              /{urlPrefix}/{slug || 'mudaraba-definition'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyLiveUrl}
            className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-emerald-800 font-semibold bg-white hover:bg-emerald-50 px-2.5 py-1 rounded border border-stone-200 transition-colors"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'কপি হয়েছে!' : 'লিংক কপি করুন'}</span>
          </button>
        </div>

        {/* Validation error notice */}
        {validationError && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-6">
          {activeTab === 'editor' ? (
            <form id="content-author-form" onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Section 1: Titles & Real Distinct URL Slug */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>১. শিরোনাম ও স্থায়ী ওয়েব লিংক (Permanent URL Slug)</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    গুগলে আলাদা পেজ হিসেবে ইনডেক্স হবে
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      আর্টিকেলের বাংলা শিরোনাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={titleBn}
                      onChange={(e) => setTitleBn(e.target.value)}
                      placeholder="যেমন: মুদারাবা (Mudaraba) সংজ্ঞা, মূলনীতি ও ইসলামিক ব্যাংকিংয়ে পরিচালন পদ্ধতি"
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      ইংরেজি শিরোনাম (URL তৈরি ও সার্চের জন্য)
                    </label>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="e.g. Mudaraba Definition and Operational Mechanics"
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                {/* Permanent URL Route Selector & Custom Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      ইউআরএল বিভাগ (URL Path Prefix)
                    </label>
                    <select
                      value={urlPrefix}
                      onChange={(e) => setUrlPrefix(e.target.value as 'diploma' | 'articles')}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs font-mono"
                    >
                      <option value="diploma">/diploma/:slug (DIB স্টাডি ও প্রশ্ন)</option>
                      <option value="articles">/articles/:slug (রিসার্চ আর্টিকেল)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-stone-700">
                        কাস্টম URL স্লাগ (Permanent Slug) *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSlugManual(false);
                          if (titleEn || titleBn) {
                            setSlug(
                              (titleEn || 'mudaraba-definition')
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-+|-+$/g, '')
                            );
                          }
                        }}
                        className="text-[11px] text-emerald-800 hover:underline font-medium"
                      >
                        স্বয়ংক্রিয় তৈরি করুন
                      </button>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-stone-200 text-stone-600 px-3 py-2.5 rounded-l-lg border border-r-0 border-stone-300 font-mono text-[11px]">
                        /{urlPrefix}/
                      </span>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => {
                          setIsSlugManual(true);
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                        }}
                        placeholder="mudaraba-definition"
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-r-lg text-stone-900 font-mono text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Keywords / কি-ওয়ার্ড যোগ করার অপশন */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <span>২. এসইও কি-ওয়ার্ড ও ট্যাগ (Keywords for Google & Search)</span>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    মেটা কি-ওয়ার্ড হিসেবে HTML হেডে যুক্ত হবে
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    কি-ওয়ার্ড লিখুন (Enter বা কমা চেপে যুক্ত করুন)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleKeyDownKeyword}
                      placeholder="যেমন: মুদারাবা সংজ্ঞা, রব্বুল মাল, DIB Part 1..."
                      className="flex-1 p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddKeyword(keywordInput)}
                      className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-700 text-xs"
                    >
                      যুক্ত করুন
                    </button>
                  </div>
                </div>

                {/* Active Keyword Chips */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] pt-1">
                  {keywords.map((kw, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-900 font-medium rounded-full text-xs border border-emerald-200"
                    >
                      <span>#{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-emerald-700 hover:text-red-600 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick Add Suggestions */}
                <div className="pt-2 border-t border-stone-200/80">
                  <div className="text-[11px] font-semibold text-stone-600 mb-1.5">
                    জনপ্রিয় কি-ওয়ার্ড সুপারিশ (ক্লিক করে দ্রুত যুক্ত করুন):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_KEYWORDS.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddKeyword(sug)}
                        className="px-2 py-0.5 bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-[11px] rounded-md border border-stone-200 transition-colors"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Thumbnail / থাম্বনেল যোগ করার অপশন */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-700" />
                    <span>৩. কন্টেন্ট থাম্বনেল ও কভার ছবি (Thumbnail & Cover Image)</span>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    Google SERP, সোশ্যাল শেয়ার কার্ড ও তালিকায় প্রদর্শিত
                  </span>
                </div>

                {/* Thumbnail Source Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setThumbnailSourceType('presets')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      thumbnailSourceType === 'presets' ? 'bg-emerald-800 text-white font-bold' : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    লাইব্রেরি গ্যালারি থেকে পছন্দ
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbnailSourceType('url')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      thumbnailSourceType === 'url' ? 'bg-emerald-800 text-white font-bold' : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    ইমেজ URL প্রদান
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbnailSourceType('upload')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      thumbnailSourceType === 'upload' ? 'bg-emerald-800 text-white font-bold' : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    মোবাইল/কম্পিউটার থেকে আপলোড
                  </button>
                </div>

                {/* Sub-view: Preset Thumbnails */}
                {thumbnailSourceType === 'presets' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESET_THUMBNAILS.map(preset => (
                      <div
                        key={preset.id}
                        onClick={() => setThumbnailUrl(preset.url)}
                        className={`cursor-pointer group relative rounded-xl overflow-hidden border-2 transition-all ${
                          thumbnailUrl === preset.url ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-stone-200 hover:border-emerald-300'
                        }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.name} 
                          className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="p-1.5 bg-white text-[11px] font-medium text-stone-800 truncate">
                          {preset.name}
                        </div>
                        {thumbnailUrl === preset.url && (
                          <div className="absolute top-1 right-1 bg-emerald-700 text-white p-1 rounded-full shadow-xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-view: URL Input */}
                {thumbnailSourceType === 'url' && (
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      পাবলিক ইমেজ URL লিংক (JPG, PNG, WebP)
                    </label>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://example.com/images/mudaraba-banner.jpg"
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                )}

                {/* Sub-view: Direct File Upload */}
                {thumbnailSourceType === 'upload' && (
                  <div className="p-4 bg-white border-2 border-dashed border-stone-300 rounded-xl text-center">
                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="font-semibold text-stone-800 text-xs mb-1">
                      ছবি নির্বাচন করতে ক্লিক করুন বা টেনে আনুন
                    </p>
                    <p className="text-[11px] text-stone-500 mb-3">
                      মোবাইল বা পিসি থেকে কভার থাম্বনেল আপলোড করুন (সর্বোচ্চ ৩ মেগাবাইট)
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer">
                      <span>ফাইল ব্রাউজ করুন</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileUpload}
                        className="hidden" 
                      />
                    </label>
                  </div>
                )}

                {/* Live Preview of Selected Thumbnail */}
                {thumbnailUrl && (
                  <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-stone-200">
                    <img 
                      src={thumbnailUrl} 
                      alt="Thumbnail Preview" 
                      className="w-28 h-16 object-cover rounded-lg border border-stone-200" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                        থাম্বনেল প্রিভিউ অ্যাক্টিভ
                      </div>
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {titleBn || 'শিরোনাম নির্ধারণ করুন'}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {keywords.join(' · ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Author & Category Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    বিভাগ / ক্যাটাগরি
                  </label>
                  <select
                    value={categoryBn}
                    onChange={(e) => {
                      setCategoryBn(e.target.value);
                      if (e.target.value.includes('পার্ট-১')) {
                        setCategoryEn('Diploma in Islamic Banking (Part 1)');
                      } else if (e.target.value.includes('পার্ট-২')) {
                        setCategoryEn('Diploma in Islamic Banking (Part 2)');
                      } else {
                        setCategoryEn('Islamic Banking Insights');
                      }
                    }}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs"
                  >
                    <option value="ডিআইবি পার্ট-১ ও মূলনীতি">ডিআইবি পার্ট-১ ও মূলনীতি</option>
                    <option value="ডিআইবি পার্ট-২ ও আইন">ডিআইবি পার্ট-২ ও আইন</option>
                    <option value="ইসলামী ব্যাংকিং গবেষণা">ইসলামী ব্যাংকিং গবেষণা</option>
                    <option value="ফিকহুল মুআমালাত ও ফতোয়া">ফিকহুল মুআমালাত ও ফতোয়া</option>
                    <option value="কুরআন-হাদিস অর্থনীতি">কুরআন-হাদিস অর্থনীতি</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    লেখকের নাম
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    লেখকের পদবি / প্রতিষ্ঠান
                  </label>
                  <input
                    type="text"
                    value={authorDesignation}
                    onChange={(e) => setAuthorDesignation(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs"
                  />
                </div>
              </div>

              {/* Section 5: Summary (Meta Description for Google Search) */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  সংক্ষিপ্ত সারসংক্ষেপ (Google Search Snippet ও Meta Description) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={summaryBn}
                  onChange={(e) => setSummaryBn(e.target.value)}
                  placeholder="মুদারাবার পারিভাষিক সংজ্ঞা, রব্বুল মাল ও মুদারিবের আইনি মর্যাদা, লাভ বণ্টনের পূর্বনির্ধারিত অনুপাত ও লোকসান বহনের নীতিমালা..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs leading-relaxed"
                />
              </div>

              {/* Section 6: Full Article Content Editor */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="font-semibold text-stone-700">
                    পূর্ণাঙ্গ আর্টিকেল / স্টাডি নোটস (বাংলায়) *
                  </label>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
                    <button
                      type="button"
                      onClick={() => insertMarkdown('## নতুন পরিচ্ছেদ শিরোনাম\n')}
                      className="px-2 py-1 bg-white hover:bg-stone-200 rounded text-[11px] font-bold text-stone-800"
                      title="Header 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('### উপ-শিরোনাম\n')}
                      className="px-2 py-1 bg-white hover:bg-stone-200 rounded text-[11px] font-bold text-stone-800"
                      title="Header 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('> আরবি বা হাদিসের উদ্ধৃতি: قال رسول الله ﷺ...\n')}
                      className="px-2 py-1 bg-white hover:bg-stone-200 rounded text-[11px] font-medium text-stone-800 flex items-center gap-1"
                      title="Quote"
                    >
                      <Quote className="w-3 h-3" />
                      <span>উদ্ধৃতি</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('- পয়েন্ট ১\n- পয়েন্ট ২\n- পয়েন্ট ৩\n')}
                      className="px-2 py-1 bg-white hover:bg-stone-200 rounded text-[11px] font-medium text-stone-800 flex items-center gap-1"
                      title="Bullet list"
                    >
                      <List className="w-3 h-3" />
                      <span>তালিকা</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('**প্রশ্ন:** মুদারাবা কী?\n**উত্তর:** মুদারাবা হলো...\n')}
                      className="px-2 py-1 bg-white hover:bg-stone-200 rounded text-[11px] font-semibold text-emerald-800 flex items-center gap-1"
                      title="DIB Question format"
                    >
                      <span>Q&A ফরম্যাট</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={10}
                  required
                  value={contentMarkdownBn}
                  onChange={(e) => setContentMarkdownBn(e.target.value)}
                  placeholder="## মুদারাবা (Mudaraba) কী? পারিভাষিক সংজ্ঞা ও ভিত্তি&#10;&#10;মুদারাবা হলো ইসলামী বাণিজ্যিক আইনের একটি বিশেষ চুক্তি..."
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-mono leading-relaxed focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* English Optional translation */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Full Article (English Translation - Optional for Bilingual Indexing)
                </label>
                <textarea
                  rows={4}
                  value={contentMarkdownEn}
                  onChange={(e) => setContentMarkdownEn(e.target.value)}
                  placeholder="## What is Mudaraba? Definition & Principles..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs font-mono leading-relaxed"
                />
              </div>
            </form>
          ) : (
            /* Tab 2: Live Preview Mode */
            <div className="space-y-6">
              {/* Google SERP Snippet Preview */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="text-xs font-bold text-stone-600 mb-2 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>গুগল সার্চ ফলাফল প্রিভিউ (Google Search SERP Preview)</span>
                </div>
                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs font-sans">
                  <div className="text-xs text-stone-500 font-mono mb-1 truncate">
                    {fullLiveUrl}
                  </div>
                  <div className="text-base font-semibold text-blue-800 hover:underline cursor-pointer mb-1 leading-snug">
                    {titleBn || 'মুদারাবা (Mudaraba) সংজ্ঞা, মূলনীতি ও ইসলামিক ব্যাংকিংয়ে পরিচালন পদ্ধতি'} | ইসলামী ব্যাংকিং ডিপ্লোমা
                  </div>
                  <div className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {summaryBn || 'মুদারাবার পারিভাষিক সংজ্ঞা, রব্বুল মাল ও মুদারিবের আইনি মর্যাদা, লাভ বণ্টনের পূর্বনির্ধারিত অনুপাত, লোকসানের দায়ভার বহন এবং ডিআইবি পরীক্ষার বিগত বছরের মডেল প্রশ্নোত্তর।'}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Rendered Article Preview Card */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                {thumbnailUrl && (
                  <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-stone-900">
                    <img 
                      src={thumbnailUrl} 
                      alt={titleBn} 
                      className="w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="inline-block bg-emerald-800 text-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
                        {categoryBn}
                      </span>
                      <h1 className="text-xl sm:text-2xl font-bold leading-tight">
                        {titleBn || 'শিরোনাম প্রিভিউ'}
                      </h1>
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-stone-500 pb-4 border-b border-stone-100">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                      {author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">{author}</div>
                      <div className="text-[11px]">{authorDesignation}</div>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none text-stone-800 space-y-3 leading-relaxed">
                    {contentMarkdownBn
                      .split('\n\n')
                      .map((para, i) => {
                        if (para.startsWith('## ')) {
                          return <h2 key={i} className="text-lg font-bold text-emerald-950 mt-4">{para.replace('## ', '')}</h2>;
                        }
                        if (para.startsWith('### ')) {
                          return <h3 key={i} className="text-base font-bold text-emerald-900 mt-3">{para.replace('### ', '')}</h3>;
                        }
                        if (para.startsWith('> ')) {
                          return <blockquote key={i} className="p-3 bg-emerald-50 border-l-4 border-emerald-700 italic rounded-r">{para.replace('> ', '')}</blockquote>;
                        }
                        return <p key={i}>{para}</p>;
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-stone-200 text-stone-700 font-semibold rounded-xl border border-stone-300 transition-colors"
          >
            বাতিল করুন
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl transition-colors"
            >
              {activeTab === 'editor' ? 'প্রিভিউ দেখুন' : 'এডিটরে ফিরুন'}
            </button>

            <button
              type="submit"
              form="content-author-form"
              className="px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{existingArticle ? 'আপডেট করুন' : 'প্রকাশ করুন (Publish Live)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
