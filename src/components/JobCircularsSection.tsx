import React from 'react';
import { Article } from '../types';
import { Briefcase, Calendar, ArrowRight } from 'lucide-react';

// The category value the admin forms write for a job-circular article.
// Both article editors (AdminPanel + ContentEditorModal) offer
// 'নিয়োগ বিজ্ঞপ্তি' in their category dropdown; the English value is
// what AdminPanel stores in `category` for it.
export const JOB_CIRCULAR_CATEGORY_BN = 'নিয়োগ বিজ্ঞপ্তি';
export const JOB_CIRCULAR_CATEGORY_EN = 'Job Circulars';

export const isJobCircular = (a: Article): boolean =>
  a.categoryBn === JOB_CIRCULAR_CATEGORY_BN || a.category === JOB_CIRCULAR_CATEGORY_EN;

// Published circulars, newest first (same date rule as
// RecentArticlesSection: publishedAt, falling back to publishedDate).
export const getJobCirculars = (articles: Article[]): Article[] =>
  articles
    .filter((a) => isJobCircular(a) && a.status !== 'draft' && !a.isDraft)
    .sort((a, b) => {
      const timeA = a.publishedAt
        ? new Date(a.publishedAt).getTime()
        : a.publishedDate
          ? new Date(a.publishedDate).getTime()
          : 0;
      const timeB = b.publishedAt
        ? new Date(b.publishedAt).getTime()
        : b.publishedDate
          ? new Date(b.publishedDate).getTime()
          : 0;
      return timeB - timeA;
    });

const getArticleHref = (art: Article): string => {
  if (art.slug) {
    return art.slug.startsWith('diploma/') ? `/${art.slug}` : `/diploma/${art.slug}`;
  }
  return `/diploma/${art.id}`;
};

const getDisplayDate = (art: Article): string => art.publishedAt || art.publishedDate || '';

const getTitle = (art: Article, lang: 'bn' | 'en'): string =>
  lang === 'bn' ? art.titleBn || art.title : art.title || art.titleBn;

const getSummary = (art: Article, lang: 'bn' | 'en'): string =>
  lang === 'bn' ? art.summaryBn || art.summary : art.summary || art.summaryBn;

interface JobCircularsProps {
  articles: Article[];
  onOpenArticle: (article: Article) => void;
  onNavigateUrl?: (path: string) => void;
  lang: 'bn' | 'en';
}

/**
 * Full /job-circulars list page. Reads only published articles whose
 * category is "নিয়োগ বিজ্ঞপ্তি" — no new table, no placeholder or fake
 * circular is ever shown. Until the owner publishes the first circular,
 * visitors see the honest empty state.
 */
export const JobCircularsPage: React.FC<JobCircularsProps> = ({
  articles,
  onOpenArticle,
  lang
}) => {
  const circulars = React.useMemo(() => getJobCirculars(articles), [articles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-bengali">
      <div className="mb-6 border-b border-stone-200 pb-4">
        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          {lang === 'bn' ? 'ব্যাংক চাকরি' : 'Bank Jobs'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          {lang === 'bn' ? 'নিয়োগ বিজ্ঞপ্তি' : 'Job Circulars'}
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
          {lang === 'bn'
            ? 'ইসলামী ব্যাংক ও বাংলাদেশ ব্যাংকের চলমান নিয়োগ বিজ্ঞপ্তি — পদ, পদসংখ্যা, আবেদনের শেষ তারিখ ও অফিসিয়াল আবেদনের লিংকসহ এক নজরে।'
            : 'Ongoing recruitment circulars from Islamic banks and Bangladesh Bank — post, vacancy, deadline and the official apply link at a glance.'}
        </p>
      </div>

      {circulars.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <Briefcase className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-900 mb-1">
            {lang === 'bn' ? 'এই মুহূর্তে কোনো চলমান নিয়োগ বিজ্ঞপ্তি নেই' : 'No live job circular right now'}
          </h3>
          <p className="text-xs text-stone-500 mb-4 leading-relaxed">
            {lang === 'bn'
              ? 'নতুন কোনো নিয়োগ বিজ্ঞপ্তি প্রকাশিত হলেই এখানে দেখতে পাবেন।'
              : 'New circulars will appear here as soon as they are published.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circulars.map((art) => {
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
                  <div className="p-4 bg-gradient-to-br from-emerald-950 via-[#14532D] to-teal-900 text-white flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
                      <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{lang === 'bn' ? JOB_CIRCULAR_CATEGORY_BN : JOB_CIRCULAR_CATEGORY_EN}</span>
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{getDisplayDate(art)}</span>
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-base group-hover:text-[#047857] transition-colors leading-snug mb-2.5 font-bengali">
                      {getTitle(art, lang)}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 font-bengali line-clamp-3 leading-relaxed mb-4">
                      {getSummary(art, lang)}
                    </p>
                  </div>
                </div>
                <div className="p-4 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-[#047857]">
                    {lang === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read details'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#047857] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Compact homepage section. Always rendered so visitors discover the new
 * section; when no circular exists yet it shows a single honest line
 * instead of cards (never a fake circular).
 */
export const JobCircularsHomeSection: React.FC<JobCircularsProps> = ({
  articles,
  onOpenArticle,
  onNavigateUrl,
  lang
}) => {
  const circulars = React.useMemo(() => getJobCirculars(articles).slice(0, 3), [articles]);

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateUrl) {
      onNavigateUrl('/job-circulars');
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/job-circulars');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-stone-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#047857] tracking-wider uppercase mb-1">
              <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{lang === 'bn' ? 'ব্যাংক চাকরি' : 'Bank Jobs'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-stone-900">
              {lang === 'bn' ? 'সাম্প্রতিক নিয়োগ বিজ্ঞপ্তি' : 'Recent Job Circulars'}
            </h2>
          </div>
          <a
            href="/job-circulars"
            onClick={handleViewAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-xs sm:text-sm font-semibold text-[#047857] shadow-xs hover:shadow-sm transition-all w-fit cursor-pointer"
          >
            <span>{lang === 'bn' ? 'সব দেখুন' : 'View All'}</span>
            <ArrowRight className="w-4 h-4 text-[#047857]" />
          </a>
        </div>

        {circulars.length === 0 ? (
          <p className="text-sm text-stone-500 leading-relaxed">
            {lang === 'bn'
              ? 'এই মুহূর্তে কোনো চলমান নিয়োগ বিজ্ঞপ্তি নেই — নতুন বিজ্ঞপ্তি প্রকাশিত হলেই এখানে দেখতে পাবেন।'
              : 'No live job circular right now — new circulars will appear here as soon as they are published.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {circulars.map((art) => {
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
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{getDisplayDate(art)}</span>
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-base group-hover:text-[#047857] transition-colors leading-snug mb-2.5 font-bengali">
                      {getTitle(art, lang)}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 font-bengali line-clamp-3 leading-relaxed">
                      {getSummary(art, lang)}
                    </p>
                  </div>
                  <div className="p-4 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between text-xs text-stone-500">
                    <span className="font-semibold text-[#047857]">
                      {lang === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read details'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#047857] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
