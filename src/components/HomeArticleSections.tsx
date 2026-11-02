import React from 'react';
import { Article } from '../types';
import { Sparkles, Calendar, User, ArrowRight, BookOpen, Star } from 'lucide-react';

interface ArticleSectionProps {
  articles: Article[];
  onOpenArticle: (article: Article) => void;
  onNavigateUrl?: (path: string) => void;
  lang: 'bn' | 'en';
}

const getArticleHref = (art: Article): string => {
  if (art.slug) {
    return art.slug.startsWith('diploma/') ? `/${art.slug}` : `/diploma/${art.slug}`;
  }
  return `/diploma/${art.id}`;
};

export const HighlightedArticlesSection: React.FC<ArticleSectionProps> = ({
  articles,
  onOpenArticle,
  lang
}) => {
  // Up to two articles where featured is true, sorted by publishedAt descending
  const featuredArticles = React.useMemo(() => {
    return articles
      .filter((a) => a.featured === true && a.status !== 'draft' && !a.isDraft)
      .sort((a, b) => {
        const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 2);
  }, [articles]);

  // If none are featured, hide this section completely
  if (featuredArticles.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 bg-linear-to-b from-[#14532D]/5 via-white to-white border-b border-stone-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
            <Star className="w-4 h-4 fill-current text-[#D4AF37]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#047857] uppercase tracking-wider">
              {lang === 'bn' ? 'বিশেষ নির্বাচিত' : 'Featured Selection'}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {lang === 'bn' ? 'হাইলাইটেড আর্টিকেল' : 'Highlighted Articles'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredArticles.map((art) => {
            const href = getArticleHref(art);
            return (
              <a
                key={art.id}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenArticle(art);
                }}
                className="group flex flex-col justify-between bg-white rounded-2xl border-2 border-[#D4AF37]/50 hover:border-[#047857] shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {art.coverImage ? (
                  <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                    <img
                      src={art.coverImage}
                      alt={lang === 'bn' ? art.titleBn : art.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#D4AF37] text-[#0f3d20] shadow-sm">
                        ★ {lang === 'bn' ? 'হাইলাইটেড' : 'Featured'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D4AF37] text-[#0f3d20]">
                      ★ {lang === 'bn' ? 'হাইলাইটেড' : 'Featured'}
                    </span>
                    <span className="text-xs text-emerald-200">
                      {lang === 'bn' ? art.categoryBn : art.category}
                    </span>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                      <span className="font-semibold text-[#047857]">
                        {lang === 'bn' ? art.categoryBn : art.category}
                      </span>
                      {art.publishedAt && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            <span>{art.publishedAt}</span>
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#047857] transition-colors leading-snug mb-2 font-bengali">
                      {lang === 'bn' ? art.titleBn : art.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 font-bengali line-clamp-3 leading-relaxed mb-4">
                      {lang === 'bn' ? art.summaryBn : art.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1.5 truncate max-w-[60%]">
                      <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{art.author}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#047857] group-hover:text-[#14532D]">
                      <span>{lang === 'bn' ? 'সম্পূর্ণ পড়ুন' : 'Read Article'}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const RecentArticlesSection: React.FC<ArticleSectionProps> = ({
  articles,
  onOpenArticle,
  onNavigateUrl,
  lang
}) => {
  // 3 newest articles by publishedAt descending
  const recentArticles = React.useMemo(() => {
    return [...articles]
      .filter((a) => a.status !== 'draft' && !a.isDraft)
      .sort((a, b) => {
        const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : (a.publishedDate ? new Date(a.publishedDate).getTime() : 0);
        const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : (b.publishedDate ? new Date(b.publishedDate).getTime() : 0);
        return timeB - timeA;
      })
      .slice(0, 3);
  }, [articles]);

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateUrl) {
      onNavigateUrl('/articles');
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/articles');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-[#F8FAF5] border-b border-stone-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with "সব দেখুন" link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#047857] tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{lang === 'bn' ? 'নতুন প্রকাশনা' : 'Latest Insights'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-stone-900">
              {lang === 'bn' ? 'সাম্প্রতিক আর্টিকেল' : 'Recent Articles'}
            </h2>
          </div>

          <a
            href="/articles"
            onClick={handleViewAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-xs sm:text-sm font-semibold text-[#047857] shadow-xs hover:shadow-sm transition-all w-fit cursor-pointer"
          >
            <span>{lang === 'bn' ? 'সব দেখুন' : 'View All'}</span>
            <ArrowRight className="w-4 h-4 text-[#047857]" />
          </a>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentArticles.map((art) => {
            const href = getArticleHref(art);
            return (
              <a
                key={art.id}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenArticle(art);
                }}
                className="group flex flex-col justify-between bg-white rounded-2xl border border-stone-200 hover:border-[#047857]/60 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div>
                  {art.coverImage ? (
                    <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                      <img
                        src={art.coverImage}
                        alt={lang === 'bn' ? art.titleBn : art.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                          {lang === 'bn' ? art.categoryBn : art.category}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-br from-emerald-950 via-[#14532D] to-teal-900 text-white flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
                        <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{lang === 'bn' ? art.categoryBn : art.category}</span>
                      </span>
                      {art.readTime && (
                        <span className="text-[10px] text-stone-300 bg-black/30 px-2 py-0.5 rounded-full">
                          {art.readTime}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{art.publishedAt || art.publishedDate}</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-base group-hover:text-[#047857] transition-colors leading-snug mb-2.5 font-bengali">
                      {lang === 'bn' ? art.titleBn : art.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 font-bengali line-clamp-3 leading-relaxed mb-4">
                      {lang === 'bn' ? art.summaryBn : art.summary}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1.5 truncate max-w-[60%]">
                    <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{art.author}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#047857] group-hover:text-[#14532D]">
                    <span>{lang === 'bn' ? 'পড়ুন' : 'Read'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
