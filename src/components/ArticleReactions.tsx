import React, { useEffect, useState } from 'react';
import { ThumbsUp, Check } from 'lucide-react';
import { StorageService } from '../services/storage';
import { toBengaliNumerals } from '../utils/dateUtils';

interface ArticleReactionsProps {
  /** The article's slug — the count key in Supabase. */
  slug: string;
  lang: 'bn' | 'en';
}

/**
 * "Was this article helpful?" reaction card, rendered under the article
 * body. One click per visitor (localStorage `article-liked-<slug>`).
 *
 * The count lives in Supabase (public.article_reaction_counts, see
 * supabase/migrations/20261120_article_reactions.sql). Until the owner
 * runs that SQL, the button still works from localStorage and the count
 * line is simply hidden — the component never crashes the page or shows
 * an error to the visitor.
 */
export const ArticleReactions: React.FC<ArticleReactionsProps> = ({ slug, lang }) => {
  // null = counts not set up yet (SQL not run) — hide the count line.
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    try {
      setLiked(window.localStorage.getItem(`article-liked-${slug}`) === '1');
    } catch {
      // Private mode / storage unavailable — liking still works for
      // this visit; the liked state just won't persist.
    }

    StorageService.getArticleHelpfulCount(slug).then((c) => {
      if (!cancelled && c !== null) setCount(c);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleLike = async () => {
    if (liked || busy) return;
    // Mark liked immediately so the button never double-fires, even if
    // the network call is slow or the SQL hasn't been run yet.
    setLiked(true);
    setBusy(true);
    try {
      window.localStorage.setItem(`article-liked-${slug}`, '1');
    } catch {
      // Ignore — the in-memory liked state still stands.
    }
    const newCount = await StorageService.incrementArticleHelpful(slug);
    if (newCount !== null) setCount(newCount);
    // If the RPC is unavailable (SQL not run yet), the local liked state
    // still stands and the count line stays hidden — never an error.
    setBusy(false);
  };

  const countLine =
    count === null
      ? lang === 'bn'
        ? 'আপনার মতামত জানান — এক ক্লিকেই'
        : 'Let us know with one click'
      : count === 0
        ? lang === 'bn'
          ? 'এখনো কেউ জানাননি — আপনিই প্রথম জানান!'
          : 'No one yet — be the first to let us know!'
        : lang === 'bn'
          ? `${toBengaliNumerals(count)} জন পাঠক কাজে লেগেছে বলেছেন`
          : `${count} reader${count === 1 ? '' : 's'} found this helpful`;

  return (
    <div className="mt-8 p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3 font-bengali">
      <div className="flex-1 min-w-0">
        <div className="font-bold text-emerald-950 text-sm">
          {lang === 'bn' ? 'এই লেখাটা কাজে লেগেছে?' : 'Was this article helpful?'}
        </div>
        <div className="text-xs text-emerald-800/80 mt-0.5">{countLine}</div>
      </div>
      <button
        type="button"
        onClick={handleLike}
        disabled={liked || busy}
        aria-pressed={liked}
        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0 cursor-pointer ${
          liked
            ? 'bg-emerald-800 text-white cursor-default'
            : 'bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-500'
        } disabled:opacity-100`}
      >
        {liked ? <Check className="w-3.5 h-3.5" /> : <ThumbsUp className="w-3.5 h-3.5" />}
        <span>
          {liked
            ? lang === 'bn'
              ? 'ধন্যবাদ!'
              : 'Thanks!'
            : lang === 'bn'
              ? 'কাজে লেগেছে'
              : 'Helpful'}
        </span>
        {count !== null && (
          <span
            className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
              liked ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {lang === 'bn' ? toBengaliNumerals(count) : count}
          </span>
        )}
      </button>
    </div>
  );
};
