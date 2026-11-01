import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Tag, 
  Globe, 
  Link as LinkIcon, 
  Upload, 
  Check, 
  Eye, 
  FileText, 
  Quote, 
  AlertCircle,
  Copy,
  Lock,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Minus,
  Trash2,
  Smartphone
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

// Preset Curated Islamic Banking & Educational WebP Thumbnails
const PRESET_THUMBNAILS = [
  {
    id: 'banking_banner',
    name: 'ইসলামী ব্যাংকিং ব্যানার',
    url: '/images/banner_bangladesh_banking_1793322325377.webp'
  },
  {
    id: 'diploma_study',
    name: 'ডিআইবি পাঠাগার ও গবেষণা',
    url: '/images/category_diploma_banking_1793322326189.webp'
  },
  {
    id: 'quran_fiqh',
    name: 'কুরআন ও হাদিসে অর্থনীতি',
    url: '/images/category_quran_hadith_1793322326327.webp'
  },
  {
    id: 'master_library',
    name: 'ইসলামিক নলেজ মাস্টার লাইব্রেরি',
    url: '/images/hero_islamic_library_1793322325013.webp'
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
  'সুদ বনাম মুনাফা',
  'BFIU Circular'
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

  // Form states
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [categoryBn, setCategoryBn] = useState('ডিআইবি পার্ট-১ ও মূলনীতি');
  const [categoryEn, setCategoryEn] = useState('Diploma in Islamic Banking (Part 1)');
  const [urlPrefix, setUrlPrefix] = useState<'diploma' | 'articles'>('diploma');
  
  // Author
  const [author, setAuthor] = useState('মুহাম্মদ আরিফুর রহমান');
  const [authorDesignation, setAuthorDesignation] = useState('সিনিয়র ইসলামিক ব্যাংকিং স্পেশালিস্ট ও ডিআইবি মেন্টর');

  // Content
  const [summaryBn, setSummaryBn] = useState('');
  const [contentMarkdownBn, setContentMarkdownBn] = useState('');
  const [contentMarkdownEn, setContentMarkdownEn] = useState('');

  // Keywords
  const [keywords, setKeywords] = useState<string[]>(['মুদারাবা', 'DIB Part 1', 'ইসলামিক ব্যাংকিং']);
  const [keywordInput, setKeywordInput] = useState('');

  // Thumbnail
  const [thumbnailUrl, setThumbnailUrl] = useState(PRESET_THUMBNAILS[0].url);
  const [thumbnailSourceType, setThumbnailSourceType] = useState<'upload' | 'presets' | 'url'>('upload');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Preview Mode
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize form states whenever modal opens or existingArticle changes
  useEffect(() => {
    if (isOpen) {
      if (existingArticle) {
        setTitleBn(existingArticle.titleBn || existingArticle.title || '');
        setTitleEn(existingArticle.title || '');
        setSlug(existingArticle.slug || '');
        setIsSlugManual(true);
        setCategoryBn(existingArticle.categoryBn || 'ডিআইবি পার্ট-১ ও মূলনীতি');
        setCategoryEn(existingArticle.category || 'Diploma in Islamic Banking (Part 1)');
        setAuthor(existingArticle.author || 'মুহাম্মদ আরিফুর রহমান');
        setAuthorDesignation(existingArticle.authorDesignation || 'সিনিয়র ইসলামিক ব্যাংকিং স্পেশালিস্ট ও ডিআইবি মেন্টর');
        setSummaryBn(existingArticle.summaryBn || existingArticle.summary || '');
        setContentMarkdownBn(existingArticle.contentMarkdownBn || '');
        setContentMarkdownEn(existingArticle.contentMarkdownEn || '');
        
        const existingKw = existingArticle.keywords && existingArticle.keywords.length > 0 
          ? existingArticle.keywords 
          : (existingArticle.tags || ['মুদারাবা', 'DIB Part 1']);
        setKeywords(existingKw);
        setThumbnailUrl(existingArticle.coverImage || PRESET_THUMBNAILS[0].url);
      } else {
        // Clear for new article
        setTitleBn('');
        setTitleEn('');
        setSlug('');
        setIsSlugManual(false);
        setCategoryBn('ডিআইবি পার্ট-১ ও মূলনীতি');
        setCategoryEn('Diploma in Islamic Banking (Part 1)');
        setAuthor('মুহাম্মদ আরিফুর রহমান');
        setAuthorDesignation('সিনিয়র ইসলামিক ব্যাংকিং স্পেশালিস্ট ও ডিআইবি মেন্টর');
        setSummaryBn('');
        setContentMarkdownBn('');
        setContentMarkdownEn('');
        setKeywords(['মুদারাবা', 'DIB Part 1', 'ইসলামিক ব্যাংকিং']);
        setThumbnailUrl(PRESET_THUMBNAILS[0].url);
      }
      setActiveTab('editor');
      setValidationError(null);
      setUploadMessage(null);
      setPinError(false);
    }
  }, [isOpen, existingArticle]);

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

  // Auto-generate clean slug from English title or Bengali transliteration
  useEffect(() => {
    if (!isSlugManual && !existingArticle) {
      const source = titleEn || titleBn;
      if (source) {
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
        } else if (titleBn.includes('সার্কুলার') || titleBn.includes('বিএফআইইউ')) {
          setSlug('bfiu-circuler-26');
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

  // Direct Phone/Computer Image Upload handler with compression & Base64 storage
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 4.5) {
      setValidationError('ছবির সাইজ অনেক বড়। অনুগ্রহ করে ৪.৫ মেগাবাইট বা তার চেয়ে ছোট ছবি নির্বাচন করুন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setThumbnailUrl(reader.result);
        setUploadMessage('ফোন স্টোরেজ থেকে থাম্বনেল সফলভাবে যুক্ত হয়েছে!');
        setValidationError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Smart Formatting Tool applying bold, italic, underline, headers, lists, quotes, links
  const applyFormat = (formatType: 'bold' | 'italic' | 'underline' | 'h2' | 'h3' | 'quote' | 'bullet' | 'number' | 'link' | 'divider') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = contentMarkdownBn;
    const selectedText = currentVal.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (formatType) {
      case 'bold':
        replacement = `**${selectedText || 'বোল্ড লেখা'}**`;
        cursorOffset = selectedText ? replacement.length : 2;
        break;
      case 'italic':
        replacement = `*${selectedText || 'ইটালিক লেখা'}*`;
        cursorOffset = selectedText ? replacement.length : 1;
        break;
      case 'underline':
        replacement = `<u>${selectedText || 'আন্ডারলাইন করা লেখা'}</u>`;
        cursorOffset = selectedText ? replacement.length : 3;
        break;
      case 'h2':
        replacement = `\n## ${selectedText || 'নতুন পরিচ্ছেদ শিরোনাম'}\n`;
        cursorOffset = replacement.length;
        break;
      case 'h3':
        replacement = `\n### ${selectedText || 'উপ-শিরোনাম'}\n`;
        cursorOffset = replacement.length;
        break;
      case 'quote':
        replacement = `\n> ${selectedText || 'আরবি বা নির্ভরযোগ্য উদ্ধৃতি'}\n`;
        cursorOffset = replacement.length;
        break;
      case 'bullet':
        if (selectedText.includes('\n')) {
          replacement = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        } else {
          replacement = `\n- ${selectedText || 'পয়েন্ট ১'}\n- পয়েন্ট ২\n`;
        }
        cursorOffset = replacement.length;
        break;
      case 'number':
        if (selectedText.includes('\n')) {
          replacement = selectedText.split('\n').map((line, idx) => `${idx + 1}. ${line}`).join('\n');
        } else {
          replacement = `\n১. ${selectedText || 'প্রথম শর্ত'}\n২. দ্বিতীয় শর্ত\n`;
        }
        cursorOffset = replacement.length;
        break;
      case 'link':
        replacement = `[${selectedText || 'লিংকের শিরোনাম'}](https://)`;
        cursorOffset = replacement.length - 1;
        break;
      case 'divider':
        replacement = `\n\n---\n\n`;
        cursorOffset = replacement.length;
        break;
    }

    const updatedText = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    setContentMarkdownBn(updatedText);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 50);
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://islamibankingdiploma-4f7m.vercel.app';
  const fullLiveUrl = `${currentOrigin}/${urlPrefix}/${slug || 'mudaraba-definition'}`;

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

    const finalSlug = (slug || 'study-guide')
      .toLowerCase()
      .replace(/[^\w-]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!finalSlug) {
      setValidationError('একটি বৈধ ইংরেজি URL স্লাগ প্রদান করুন (যেমন: bfiu-circuler-26)।');
      return;
    }

    if (!contentMarkdownBn.trim()) {
      setValidationError('অনুগ্রহ করে আর্টিকেলের মূল বক্তব্য বা ব্যাখ্যা বাংলায় লিখুন।');
      return;
    }

    const wordCount = contentMarkdownBn.split(/\s+/).filter(Boolean).length;
    const calculatedReadTime = `${Math.max(3, Math.ceil(wordCount / 150))} মিনিট পাঠ`;

    const articlePayload: Article = {
      id: existingArticle?.id || `art-${Date.now()}`,
      title: titleEn || titleBn,
      titleBn: titleBn,
      slug: finalSlug,
      author: author || 'মুহাম্মদ আরিফুর রহমান',
      authorDesignation: authorDesignation || 'সিনিয়র ইসলামিক ব্যাংকিং স্পেশালিস্ট ও ডিআইবি মেন্টর',
      publishedDate: existingArticle?.publishedDate || new Date().toISOString().split('T')[0],
      readTime: calculatedReadTime,
      category: categoryEn,
      categoryBn: categoryBn,
      summary: (summaryBn || titleBn).slice(0, 150) + '...',
      summaryBn: summaryBn || titleBn,
      contentMarkdownEn: contentMarkdownEn || summaryBn || titleBn,
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
                className="flex-1 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-semibold text-white bg-[#047857] hover:bg-[#065f46] rounded-xl shadow-xs cursor-pointer"
              >
                {lang === 'bn' ? 'যাচাই করুন' : 'Verify'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-bengali">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#14532D] to-[#047857] text-white flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 border border-[#D4AF37]/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {existingArticle ? 'আর্টিকেল সম্পাদনা ও আপডেট' : 'নতুন আর্টিকেল ও স্টাডি গাইড প্রকাশ'}
              </h2>
              <p className="text-xs text-emerald-100/90">
                স্থায়ী URL, ফোন থেকে থাম্বনেল আপলোড, ও রিচ টেক্সট ফরম্যাটিং
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch between Editor & Preview */}
            <div className="flex items-center bg-emerald-950/60 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'editor' ? 'bg-white text-emerald-950 font-bold' : 'text-emerald-200 hover:text-white'
                }`}
              >
                এডিটর
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  activeTab === 'preview' ? 'bg-white text-emerald-950 font-bold' : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>লাইভ প্রিভিউ</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live URL Slug Banner */}
        <div className="bg-stone-100 border-b border-stone-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold text-stone-600">স্থায়ী ওয়েব লিংক (Permanent URL):</span>
            <span className="font-mono text-emerald-800 font-bold bg-white px-2 py-1 rounded border border-stone-200 truncate max-w-md">
              /{urlPrefix}/{slug || 'bfiu-circuler-26'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyLiveUrl}
            className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-emerald-800 font-semibold bg-white hover:bg-emerald-50 px-2.5 py-1 rounded border border-stone-200 transition-colors cursor-pointer"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'কপি হয়েছে!' : 'লিংক কপি করুন'}</span>
          </button>
        </div>

        {/* Validation error notice */}
        {validationError && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Upload success message */}
        {uploadMessage && (
          <div className="mx-5 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shrink-0">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{uploadMessage}</span>
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
                      placeholder="যেমন: বিএফআইইউ সার্কুলার ২৬: ইসলামী ব্যাংকিং কমপ্লায়েন্স ও এএমএল নির্দেশিকা"
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      ইংরেজি শিরোনাম (URL তৈরি ও আন্তর্জাতিক সার্চের জন্য)
                    </label>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="e.g. BFIU Circular 26 Compliance and AML Protocols"
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
                      <option value="diploma">/diploma/:slug (DIB সিলেবাস ও স্টাডি)</option>
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
                              (titleEn || 'study-guide')
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-+|-+$/g, '')
                            );
                          }
                        }}
                        className="text-[11px] text-emerald-800 hover:underline font-medium cursor-pointer"
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
                        placeholder="bfiu-circuler-26"
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-r-lg text-stone-900 font-mono text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Phone Storage Thumbnail Upload / থাম্বনেল আপলোড অপশন */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-700" />
                    <span>২. কন্টেন্ট থাম্বনেল আপলোড (ফোন স্টোরেজ / গ্যালারি)</span>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    মোবাইল থেকে সরাসরি ছবি আপলোড করা যাবে
                  </span>
                </div>

                {/* Thumbnail Source Mode Switch */}
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <button
                    type="button"
                    onClick={() => setThumbnailSourceType('upload')}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      thumbnailSourceType === 'upload' ? 'bg-[#047857] text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-300'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>ফোন স্টোরেজ / ফাইল থেকে আপলোড</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbnailSourceType('presets')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      thumbnailSourceType === 'presets' ? 'bg-[#047857] text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-300'
                    }`}
                  >
                    প্রিসেট গ্যালারি
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbnailSourceType('url')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      thumbnailSourceType === 'url' ? 'bg-[#047857] text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-300'
                    }`}
                  >
                    ইমেজ লিংক (URL)
                  </button>
                </div>

                {/* Sub-view: Mobile / PC Phone Storage Upload */}
                {thumbnailSourceType === 'upload' && (
                  <div className="p-5 bg-white border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl text-center transition-colors">
                    <Upload className="w-8 h-8 text-[#047857] mx-auto mb-2" />
                    <p className="font-bold text-stone-800 text-xs mb-1">
                      মোবাইল গ্যালারি বা কম্পিউটার থেকে ছবি সিলেক্ট করুন
                    </p>
                    <p className="text-[11px] text-stone-500 mb-3">
                      JPG, PNG, অথবা WebP ফরম্যাট (সর্বোচ্চ ৪.৫ MB)
                    </p>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept="image/*" 
                      onChange={handleImageFileUpload}
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm active:scale-95 transition-all"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>গ্যালারি / ফাইল ম্যানেজার খুলুন</span>
                    </button>
                  </div>
                )}

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
                      পাবলিক ইমেজ URL লিংক
                    </label>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs font-mono"
                    />
                  </div>
                )}

                {/* Live Preview of Selected Thumbnail */}
                {thumbnailUrl && (
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200">
                    <img 
                      src={thumbnailUrl} 
                      alt="Thumbnail Preview" 
                      className="w-24 h-16 object-cover rounded-lg border border-stone-200 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                        বর্তমান সক্রিয় থাম্বনেল
                      </div>
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {titleBn || 'শিরোনাম নির্ধারণ করুন'}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {(keywords || []).join(' · ')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setThumbnailUrl('')}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-50 cursor-pointer"
                      title="থাম্বনেল মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Section 3: Formatting Toolbar & Content Writing / এডিটর টুলস */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="font-semibold text-stone-700">
                    মূল আর্টিকেল ও ব্যাখ্যা (বাংলায়) *
                  </label>

                  {/* Rich Text Markdown Formatting Toolbar (বোল্ড, ইটালিক, আন্ডারলাইন ইত্যাদি) */}
                  <div className="flex items-center flex-wrap gap-1 bg-stone-100 p-1.5 rounded-xl border border-stone-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => applyFormat('bold')}
                      className="p-1.5 bg-white hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 rounded-lg border border-stone-200 flex items-center gap-1 font-bold cursor-pointer"
                      title="বোল্ড করুন (**লেখা**)"
                    >
                      <Bold className="w-3.5 h-3.5 text-stone-900" />
                      <span className="text-[11px] hidden sm:inline">বোল্ড</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormat('italic')}
                      className="p-1.5 bg-white hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 rounded-lg border border-stone-200 flex items-center gap-1 italic cursor-pointer"
                      title="ইটালিক করুন (*লেখা*)"
                    >
                      <Italic className="w-3.5 h-3.5 text-stone-900" />
                      <span className="text-[11px] hidden sm:inline">ইটালিক</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormat('underline')}
                      className="p-1.5 bg-white hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 rounded-lg border border-stone-200 flex items-center gap-1 underline cursor-pointer"
                      title="আন্ডারলাইন করুন (<u>লেখা</u>)"
                    >
                      <UnderlineIcon className="w-3.5 h-3.5 text-stone-900" />
                      <span className="text-[11px] hidden sm:inline">আন্ডারলাইন</span>
                    </button>

                    <span className="w-px h-5 bg-stone-300 mx-0.5" />

                    <button
                      type="button"
                      onClick={() => applyFormat('h2')}
                      className="px-2 py-1 bg-white hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-200 text-[11px] font-bold cursor-pointer"
                      title="বড় শিরোনাম (H2)"
                    >
                      H2
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormat('h3')}
                      className="px-2 py-1 bg-white hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-200 text-[11px] font-bold cursor-pointer"
                      title="উপ-শিরোনাম (H3)"
                    >
                      H3
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormat('bullet')}
                      className="p-1.5 bg-white hover:bg-stone-200 rounded-lg border border-stone-200 text-stone-800 cursor-pointer"
                      title="বুলেট তালিকা (- পয়েন্ট)"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormat('number')}
                      className="p-1.5 bg-white hover:bg-stone-200 rounded-lg border border-stone-200 text-stone-800 cursor-pointer"
                      title="নম্বরযুক্ত তালিকা (১, ২, ৩)"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormat('quote')}
                      className="p-1.5 bg-white hover:bg-stone-200 rounded-lg border border-stone-200 text-stone-800 cursor-pointer"
                      title="উদ্ধৃতি / কোটেশন"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormat('link')}
                      className="p-1.5 bg-white hover:bg-stone-200 rounded-lg border border-stone-200 text-stone-800 cursor-pointer"
                      title="ওয়েব লিংক যুক্ত করুন"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormat('divider')}
                      className="p-1.5 bg-white hover:bg-stone-200 rounded-lg border border-stone-200 text-stone-800 cursor-pointer"
                      title="ডিভাইডার দাগ (---)"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  rows={12}
                  required
                  value={contentMarkdownBn}
                  onChange={(e) => setContentMarkdownBn(e.target.value)}
                  placeholder="## ১. পটভূমি ও প্রজ্ঞাপনের মূল উদ্দেশ্য&#10;&#10;বাংলাদেশ ফাইন্যান্সিয়াল ইন্টেলিজেন্স ইউনিট (BFIU) সার্কুলার ২৬-এর আলোকে সকল ইসলামী ব্যাংককে গ্রাহক সনাক্তকরণ (KYC) ও সন্দেহজনক লেনদেন (STR) তদারকিতে সতর্ক থাকার নির্দেশ দেওয়া হয়েছে...&#10;&#10;**প্রধান দিকসমূহ:**&#10;- পয়েন্ট ১&#10;- পয়েন্ট ২"
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-mono leading-relaxed focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Section 4: Summary (Meta Description for Google Search) */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  সংক্ষিপ্ত সারসংক্ষেপ (Google Search Snippet ও Meta Description) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={summaryBn}
                  onChange={(e) => setSummaryBn(e.target.value)}
                  placeholder="সার্কুলারের মূল বক্তব্য এবং ডিআইবি পরীক্ষার্থীদের জন্য গুরুত্বপূর্ণ দিকসমূহ..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs leading-relaxed"
                />
              </div>

              {/* Section 5: Keywords / কি-ওয়ার্ড যোগ করার অপশন */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <span>৪. এসইও কি-ওয়ার্ড ও ট্যাগ (Google Search Keywords)</span>
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
                      placeholder="যেমন: BFIU Circular 26, মানি লন্ডারিং প্রতিরোধ, DIB Part 1..."
                      className="flex-1 p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddKeyword(keywordInput)}
                      className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-700 text-xs cursor-pointer"
                    >
                      যুক্ত করুন
                    </button>
                  </div>
                </div>

                {/* Active Keyword Chips */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] pt-1">
                  {(keywords || []).map((kw, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-900 font-medium rounded-full text-xs border border-emerald-200"
                    >
                      <span>#{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-emerald-700 hover:text-red-600 rounded-full p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick Add Suggestions */}
                <div className="pt-2 border-t border-stone-200/80">
                  <div className="text-[11px] font-semibold text-stone-600 mb-1.5">
                    সুপারিশকৃত কি-ওয়ার্ড:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_KEYWORDS.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddKeyword(sug)}
                        className="px-2 py-0.5 bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-[11px] rounded-md border border-stone-200 transition-colors cursor-pointer"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 6: Author & Category Metadata */}
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

              {/* English Optional translation */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Full Article (English Translation - Optional for Bilingual Indexing)
                </label>
                <textarea
                  rows={4}
                  value={contentMarkdownEn}
                  onChange={(e) => setContentMarkdownEn(e.target.value)}
                  placeholder="## Section 1: Background & Scope&#10;English text for bilingual readership..."
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
                    {titleBn || 'আর্টিকেলের বাংলা শিরোনাম'} | ইসলামী ব্যাংকিং ডিপ্লোমা
                  </div>
                  <div className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {summaryBn || 'আর্টিকেলের সংক্ষিপ্ত সারসংক্ষেপ ও পরীক্ষার মূল বিষয়বস্তু...'}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(keywords || []).map((kw, i) => (
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
                      alt={titleBn || 'Cover'} 
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
                      {(author || 'লেখক').charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">{author || 'মুহাম্মদ আরিফুর রহমান'}</div>
                      <div className="text-[11px]">{authorDesignation || 'ডিআইবি মেন্টর'}</div>
                    </div>
                  </div>

                  <div className="space-y-3 leading-relaxed text-stone-800">
                    {(contentMarkdownBn || '')
                      .split('\n\n')
                      .map((para, i) => {
                        if (!para.trim()) return null;
                        if (para.startsWith('## ')) {
                          return <h2 key={i} className="text-lg font-bold text-emerald-950 mt-4">{para.replace('## ', '')}</h2>;
                        }
                        if (para.startsWith('### ')) {
                          return <h3 key={i} className="text-base font-bold text-emerald-900 mt-3">{para.replace('### ', '')}</h3>;
                        }
                        if (para.startsWith('> ')) {
                          return <blockquote key={i} className="p-3 bg-emerald-50 border-l-4 border-emerald-700 italic rounded-r">{para.replace('> ', '')}</blockquote>;
                        }
                        if (para.startsWith('---')) {
                          return <hr key={i} className="border-t border-stone-200 my-4" />;
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
        <div className="px-5 py-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-stone-200 text-stone-700 font-semibold rounded-xl border border-stone-300 transition-colors cursor-pointer"
          >
            বাতিল করুন
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {activeTab === 'editor' ? 'প্রিভিউ দেখুন' : 'এডিটরে ফিরুন'}
            </button>

            <button
              type="submit"
              form="content-author-form"
              className="px-6 py-2 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{existingArticle ? 'আপডেট সম্পন্ন করুন' : 'প্রকাশ করুন (Publish Live)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
