import React, { useState, useMemo } from 'react';
import { Article, PdfResource } from '../types';
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight, 
  Calendar, 
  Tag, 
  Globe, 
  Plus, 
  Sparkles,
  Search,
  X,
  FileText,
  Filter
} from 'lucide-react';

export const VALID_ARTICLE_MENU_CATEGORIES = [
  'dib-part-1',
  'dib-part-2',
  'islamic-economics',
  'islamic-essays',
  'miscellaneous'
] as const;

export type ArticleMenuCategoryKey = typeof VALID_ARTICLE_MENU_CATEGORIES[number];

export const ARTICLE_MENU_META: Record<ArticleMenuCategoryKey, { en: string; bn: string; descEn: string; descBn: string }> = {
  'dib-part-1': {
    en: 'DIB Part 1',
    bn: 'ডিআইবি পার্ট ১',
    descEn: 'Fundamental principles, Mudaraba, Musharaka, and DIB Part 1 study modules',
    descBn: 'মুদারাবা, মুশারাকা ও ডিআইবি পার্ট-১ পরীক্ষার প্রস্তুতিমূলক মূলনীতি ও সমাধান'
  },
  'dib-part-2': {
    en: 'DIB Part 2',
    bn: 'ডিআইবি পার্ট ২',
    descEn: 'Banking laws, BFIU regulations, AML/CFT compliance, and DIB Part 2 papers',
    descBn: 'ব্যাংক কোম্পানি আইন, বিএফআইইউ সার্কুলার ২৬, এএমএল কমপ্লায়েন্স ও পার্ট-২ সহায়িকা'
  },
  'islamic-economics': {
    en: 'Islamic Economics',
    bn: 'ইসলামিক অর্থনীতি',
    descEn: 'Theological and economic frameworks, Riba vs profit, and wealth distribution',
    descBn: 'সুদ ও মুনাফার পার্থক্য, ইসলামী অর্থনীতির মূলভিত্তি ও শরীয়াহ বিশ্লেষণ'
  },
  'islamic-essays': {
    en: 'Islamic Essays',
    bn: 'ইসলামিক প্রবন্ধ',
    descEn: 'In-depth essays and research on Islamic banking history and future outlook',
    descBn: 'বাংলাদেশে ইসলামী ব্যাংকিংয়ের গতিপ্রকৃতি, গবেষণামূলক প্রবন্ধ ও কলাম'
  },
  'miscellaneous': {
    en: 'Miscellaneous',
    bn: 'বিবিধ',
    descEn: 'Exam tips, preparation roadmaps, and career development guidance',
    descBn: 'পরীক্ষা প্রস্তুতি কৌশল, ৬০ দিনের মাস্টার প্ল্যান ও সাধারণ দিকনির্দেশনা'
  }
};

interface ArticlesSectionProps {
  articles: Article[];
  resources: PdfResource[];
  onOpenArticle: (article: Article) => void;
  onWriteArticle?: () => void;
  lang: 'bn' | 'en';
  menuFilter?: string | null;
  onSelectMenuFilter?: (menu: string | null) => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  articles,
  resources,
  onOpenArticle,
  onWriteArticle,
  lang,
  menuFilter,
  onSelectMenuFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Read the menu query parameter from props or current URL
  const activeMenuKey = useMemo<ArticleMenuCategoryKey | null>(() => {
    let key = menuFilter;
    if (key === undefined && typeof window !== 'undefined') {
      key = new URLSearchParams(window.location.search).get('menu');
    }
    if (key && (VALID_ARTICLE_MENU_CATEGORIES as readonly string[]).includes(key)) {
      return key as ArticleMenuCategoryKey;
    }
    return null;
  }, [menuFilter]);

  // 2. Filter by menuCategory and sort by publishedAt descending (or fallback to all if missing/unknown)
  const categoryFilteredArticles = useMemo(() => {
    if (!activeMenuKey) {
      return articles;
    }
    return articles
      .filter((a) => a.menuCategory === activeMenuKey)
      .sort((a, b) => {
        const dateA = a.publishedAt || a.publishedDate || '';
        const dateB = b.publishedAt || b.publishedDate || '';
        return dateB.localeCompare(dateA); // Descending sort
      });
  }, [articles, activeMenuKey]);

  // 3. Search filter over the category-filtered list
  const displayedArticles = useMemo(() => {
    if (!searchQuery.trim()) {
      return categoryFilteredArticles;
    }
    const q = searchQuery.toLowerCase().trim();
    return categoryFilteredArticles.filter((art) => {
      const matchTitle = (art.title && art.title.toLowerCase().includes(q)) || (art.titleBn && art.titleBn.toLowerCase().includes(q));
      const matchSummary = (art.summary && art.summary.toLowerCase().includes(q)) || (art.summaryBn && art.summaryBn.toLowerCase().includes(q));
      const matchAuthor = art.author && art.author.toLowerCase().includes(q);
      const matchTags = art.tags && art.tags.some(t => t.toLowerCase().includes(q));
      const matchKeywords = art.keywords && art.keywords.some(k => k.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchAuthor || matchTags || matchKeywords;
    });
  }, [categoryFilteredArticles, searchQuery]);

  const activeMeta = activeMenuKey ? ARTICLE_MENU_META[activeMenuKey] : null;

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-stone-200 font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Category Name in English and Bengali */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              <BookOpen className="w-4 h-4 text-[#047857]" />
              {activeMeta ? (
                <span>{activeMeta.en} · {activeMeta.bn}</span>
              ) : (
                <span>{lang === 'bn' ? 'ইসলামী ব্যাংকিং ও অর্থনীতি কলাম' : 'Islamic Banking Research & Articles'}</span>
              )}
            </div>

            {/* Main Heading showing both English and Bengali */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 leading-tight">
              {activeMeta ? (
                <>
                  <span>{activeMeta.bn}</span>
                  <span className="text-stone-500 font-medium text-lg sm:text-2xl ml-2 font-sans">
                    ({activeMeta.en})
                  </span>
                </>
              ) : (
                lang === 'bn' ? 'প্রবন্ধ ও ব্যাংকিং বিশ্লেষণ (স্থায়ী URL ও কন্টেন্ট)' : 'Bilingual Banking Insights & Articles'
              )}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-2xl font-bengali">
              {activeMeta ? (
                lang === 'bn' ? activeMeta.descBn : activeMeta.descEn
              ) : (
                lang === 'bn'
                  ? 'মুদারাবা-মুশারাকা চুক্তি, রিবা বনাম মুনাফা এবং ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB) পরীক্ষার পূর্ণাঙ্গ বিশ্লেষণী নিবন্ধ।'
                  : 'Scholarly yet practical analyses on Islamic banking evolution, contract structuring, risk frameworks, and DIB examination strategies.'
              )}
            </p>
          </div>

          {/* Action Tools: Search Box and Write Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input Box */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'bn' ? 'আর্টিকেল খুঁজুন...' : 'Search articles...'}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-700"
                  title={lang === 'bn' ? 'মুছে ফেলুন' : 'Clear search'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {onWriteArticle && (
              <button
                onClick={onWriteArticle}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'bn' ? 'নতুন কন্টেন্ট লিখুন' : 'Write New Article'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Pills / Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-stone-100 text-xs scrollbar-thin">
          <button
            onClick={() => onSelectMenuFilter?.(null)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium cursor-pointer ${
              !activeMenuKey
                ? 'bg-[#14532D] text-white font-bold shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {lang === 'bn' ? 'সকল আর্টিকেল' : 'All Articles'} ({articles.length})
          </button>
          {VALID_ARTICLE_MENU_CATEGORIES.map((catKey) => {
            const meta = ARTICLE_MENU_META[catKey];
            const count = articles.filter(a => a.menuCategory === catKey).length;
            const isSelected = activeMenuKey === catKey;
            return (
              <button
                key={catKey}
                onClick={() => onSelectMenuFilter?.(catKey)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#14532D] text-white font-bold shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#14532D]'
                }`}
              >
                <span>{lang === 'bn' ? meta.bn : meta.en}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 1. Empty State: When category has no articles */}
        {categoryFilteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center max-w-md mx-auto shadow-xs my-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              এই ক্যাটাগরিতে এখনো কোনো আর্টিকেল নেই
            </h3>
            <p className="text-xs text-stone-500 mb-4 font-bengali">
              {lang === 'bn'
                ? 'শীঘ্রই এই ক্যাটাগরিতে নতুন গবেষণামূলক আর্টিকেল যুক্ত করা হবে।'
                : 'No articles are available in this category yet. New articles will be published soon.'}
            </p>
            {onSelectMenuFilter && (
              <button
                onClick={() => onSelectMenuFilter(null)}
                className="px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                {lang === 'bn' ? 'সকল আর্টিকেল দেখুন' : 'View All Articles'}
              </button>
            )}
          </div>
        ) : displayedArticles.length === 0 ? (
          /* 2. Empty State: When search query yields no matches */
          <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center max-w-md mx-auto shadow-xs my-8">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {lang === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No Results Found'}
            </h3>
            <p className="text-xs text-stone-500 mb-4 font-bengali">
              {lang === 'bn'
                ? `"${searchQuery}" এর সাথে মিলে এমন কোনো আর্টিকেল পাওয়া যায়নি।`
                : `No articles matched your query "${searchQuery}".`}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl cursor-pointer"
            >
              {lang === 'bn' ? 'অনুসন্ধান রিসেট করুন' : 'Clear Search'}
            </button>
          </div>
        ) : (
          /* 3. Articles Grid: Each card links to its existing URL (/diploma/<slug>) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedArticles.map((art) => {
              const articleHref = `/diploma/${art.slug}`;
              return (
                <a
                  key={art.id}
                  href={articleHref}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenArticle(art);
                  }}
                  className="group rounded-xl border border-stone-200 bg-white hover:border-[#047857]/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer no-underline text-inherit"
                >
                  <div>
                    {/* Cover Image / Thumbnail */}
                    {art.coverImage && (
                      <div className="relative h-44 sm:h-48 overflow-hidden bg-stone-200">
                        <img
                          src={art.coverImage}
                          alt={art.titleBn || art.title}
                          loading="lazy"
                          decoding="async"
                          width={400}
                          height={200}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[10px] font-semibold bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded">
                            {art.readTime}
                          </span>
                        </div>

                        {/* Distinct URL Slug badge showing existing permanent URL */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#D4AF37] bg-stone-900/90 backdrop-blur-xs px-2 py-0.5 rounded truncate max-w-full">
                            <Globe className="w-3 h-3 text-[#D4AF37] shrink-0" />
                            <span className="truncate">{articleHref}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-5">
                      {/* Category and Date */}
                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                        <span className="font-bold text-[#047857]">
                          {lang === 'bn' ? art.categoryBn : art.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{art.publishedAt || art.publishedDate}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-stone-900 text-base sm:text-lg group-hover:text-emerald-800 transition-colors leading-snug mb-2 font-bengali">
                        {lang === 'bn' ? art.titleBn : art.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed mb-4 font-bengali">
                        {lang === 'bn' ? art.summaryBn : art.summary}
                      </p>

                      {/* Keyword Chips */}
                      {(art.keywords || art.tags) && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Array.from(new Set([...(art.keywords || []), ...(art.tags || [])]))
                            .slice(0, 3)
                            .map((kw, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded"
                              >
                                #{kw}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Author & Read More Bar */}
                  <div className="px-5 py-3 border-t border-stone-200/80 bg-stone-50/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-stone-600 truncate max-w-[65%]">
                      <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate font-medium">{art.author}</span>
                    </div>

                    <div className="flex items-center gap-1 font-semibold text-emerald-800 group-hover:text-emerald-950">
                      <span>{lang === 'bn' ? 'সম্পূর্ণ পড়ুন' : 'Read Article'}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* অন্যান্য রিসোর্স (Other Resources) Section */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span>অন্যান্য রিসোর্স</span>
              <span className="text-xs font-normal text-stone-500 font-sans">(Other Resources)</span>
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              {lang === 'bn' 
                ? 'ইসলামিক ব্যাংকিং ও ডিআইবি পরীক্ষার অন্যান্য প্রয়োজনীয় রেফারেন্স ও স্টাডি উপাদানসমূহ:' 
                : 'Other essential Islamic banking and DIB examination study references:'}
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            <li>
              <a
                href="/previous-questions"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/previous-questions');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-700 hover:text-[#047857] hover:underline text-xs flex items-center gap-1.5 py-1 transition-colors"
              >
                <span className="text-[#D4AF37] text-xs">›</span>
                <span>বিগত বছরের প্রশ্ন ও সমাধান</span>
              </a>
            </li>
            <li>
              <a
                href="/mock-test"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/mock-test');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-700 hover:text-[#047857] hover:underline text-xs flex items-center gap-1.5 py-1 transition-colors"
              >
                <span className="text-[#D4AF37] text-xs">›</span>
                <span>মডেল টেস্ট ও অনুশীলন কুঠুরি</span>
              </a>
            </li>
            <li>
              <a
                href="/banking"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/banking');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-700 hover:text-[#047857] hover:underline text-xs flex items-center gap-1.5 py-1 transition-colors"
              >
                <span className="text-[#D4AF37] text-xs">›</span>
                <span>ইসলামিক ব্যাংকিং ও অর্থায়ন</span>
              </a>
            </li>
            <li>
              <a
                href="/pdf-library"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/pdf-library');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-700 hover:text-[#047857] hover:underline text-xs flex items-center gap-1.5 py-1 transition-colors"
              >
                <span className="text-[#D4AF37] text-xs">›</span>
                <span>সম্পূর্ণ উন্মুক্ত পিডিএফ পাঠাগার</span>
              </a>
            </li>
            <li>
              <a
                href="/quran-hadith"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/quran-hadith');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-700 hover:text-[#047857] hover:underline text-xs flex items-center gap-1.5 py-1 transition-colors"
              >
                <span className="text-[#D4AF37] text-xs">›</span>
                <span>কুরআন ও হাদিসে অর্থনৈতিক বিধান</span>
              </a>
            </li>
            <li>
              <a
                href="/fiqh-fatwa"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/fiqh-fatwa');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-700 hover:text-[#047857] hover:underline text-xs flex items-center gap-1.5 py-1 transition-colors"
              >
                <span className="text-[#D4AF37] text-xs">›</span>
                <span>ফিকহুল মুআমালাত ও ফতোয়া</span>
              </a>
            </li>
            <li>
              <a
                href="/diploma"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/diploma');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-700 hover:text-[#047857] hover:underline text-xs flex items-center gap-1.5 py-1 transition-colors"
              >
                <span className="text-[#D4AF37] text-xs">›</span>
                <span>ডিআইবি পার্ট ১ ও ২ (সব আর্টিকেল)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
