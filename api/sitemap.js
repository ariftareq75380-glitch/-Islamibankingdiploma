/**
 * Vercel Serverless Function: dynamic sitemap.xml.
 *
 * The old sitemap was a static file (public/sitemap.xml) that was last
 * updated by hand, so new articles never appeared in it — Google could not
 * discover the most-read books (Code 103/104/105-notes/105-English/
 * 106-repeated). That file is deleted; vercel.json rewrites /sitemap.xml
 * to this function instead.
 *
 * On every request the function reads the published articles from Supabase
 * (same public publishable key as api/og.js — already public, embedded in
 * the live JS bundle) and builds the XML, so an article published from the
 * admin panel shows up in the sitemap immediately, with no redeploy.
 *
 * If Supabase cannot be reached, it falls back to a hardcoded list of the
 * known published articles, so Googlebot always gets a valid sitemap
 * instead of an error or an empty one.
 *
 * Plain JavaScript on purpose: no TypeScript transpilation step is involved
 * in building this function (same as api/og.js).
 */

const SITE_URL = 'https://islamibankingdiploma-4f7m.vercel.app';
const SUPABASE_URL = 'https://cdgkjgjltlrihipnvpxb.supabase.co';
// Public publishable key (already public: embedded in the live JS bundle).
const SUPABASE_KEY = 'sb_publishable_LOWfR5rUGwFsaj68oam1Mw_B2zwlyCF';

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,119}$/;
// The seed "Article test" article: the app hides it from public lists
// (src/services/storage.ts filters out slug 'article-publish'), so the
// sitemap must not list it either.
const EXCLUDED_SLUGS = new Set(['article-publish']);

// Static (non-article) pages, carried over from the old static sitemap.xml.
const STATIC_URLS = [
  { loc: `${SITE_URL}/`, lastmod: '2026-11-20', changefreq: 'daily', priority: '1.0' },
  { loc: `${SITE_URL}/diploma`, lastmod: '2026-10-31', changefreq: 'weekly', priority: '0.9' },
  { loc: `${SITE_URL}/previous-questions`, lastmod: '2026-10-31', changefreq: 'weekly', priority: '0.9' },
  { loc: `${SITE_URL}/pdf-library`, lastmod: '2026-10-31', changefreq: 'daily', priority: '0.9' },
  { loc: `${SITE_URL}/mock-test`, lastmod: '2026-10-31', changefreq: 'weekly', priority: '0.85' },
  { loc: `${SITE_URL}/quiz`, lastmod: '2026-11-19', changefreq: 'daily', priority: '0.85' },
  { loc: `${SITE_URL}/banking`, lastmod: '2026-10-31', changefreq: 'weekly', priority: '0.85' },
  { loc: `${SITE_URL}/islamic-studies`, lastmod: '2026-10-31', changefreq: 'weekly', priority: '0.8' },
  { loc: `${SITE_URL}/quran-hadith`, lastmod: '2026-10-31', changefreq: 'weekly', priority: '0.8' },
  { loc: `${SITE_URL}/fiqh-fatwa`, lastmod: '2026-10-31', changefreq: 'weekly', priority: '0.8' },
  { loc: `${SITE_URL}/articles`, lastmod: '2026-11-18', changefreq: 'daily', priority: '0.85' },
  { loc: `${SITE_URL}/faq`, lastmod: '2026-10-31', changefreq: 'monthly', priority: '0.7' },
  { loc: `${SITE_URL}/about`, lastmod: '2026-10-31', changefreq: 'monthly', priority: '0.6' },
  { loc: `${SITE_URL}/contact`, lastmod: '2026-10-31', changefreq: 'monthly', priority: '0.6' },
  { loc: `${SITE_URL}/privacy`, lastmod: '2026-10-31', changefreq: 'yearly', priority: '0.4' },
  { loc: `${SITE_URL}/disclaimer`, lastmod: '2026-10-31', changefreq: 'yearly', priority: '0.4' },
  { loc: `${SITE_URL}/zakat-calculator`, lastmod: '2026-11-02', changefreq: 'monthly', priority: '0.85' },
];

// Fallback article list, used only when Supabase cannot be reached.
// Kept in sync with the published articles as of 2026-11-20 (14 articles:
// every published row except the seed 'article-publish' test article).
const FALLBACK_ARTICLES = [
  { slug: 'dib-part-1-104-repeated-model-answers', lastmod: '2026-11-20' },
  { slug: 'dib-part-1-103-repeated-model-answers', lastmod: '2026-11-19' },
  { slug: 'dib-part-1-106-repeated-model-answers', lastmod: '2026-11-19' },
  { slug: 'dib-part-1-105-repeated-questions-notes', lastmod: '2026-11-19' },
  { slug: 'dib-part-1-code-105-business-communication-model-answers-english', lastmod: '2026-11-19' },
  { slug: 'dib-part-1-code-106-model-answers', lastmod: '2026-11-18' },
  { slug: 'zakat-nisab', lastmod: '2026-11-16' },
  { slug: 'has-nominee-the-rights-to-know-account-holder-s-bank-balance-', lastmod: '2026-11-16' },
  { slug: 'bfiu-circuler-26', lastmod: '2026-11-13' },
  { slug: 'mudaraba-definition', lastmod: '2026-11-04' },
  { slug: 'riba-vs-profit-fundamental-distinctions', lastmod: '2026-11-04' },
  { slug: 'strategic-roadmap-to-ace-dib-examination', lastmod: '2026-11-04' },
  { slug: 'dynamics-and-challenges-of-islamic-banking-bangladesh', lastmod: '2026-11-04' },
  { slug: 'bfiu-circular-26-summary', lastmod: '2026-11-04' },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function validLastmod(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

/**
 * Fetch the published articles from Supabase. Mirrors the app's own rule
 * (src/services/storage.ts): a row is a draft only when is_published is
 * explicitly false, and slug 'article-publish' is never listed publicly.
 * Returns null on any failure so the caller can fall back.
 */
async function fetchArticles() {
  try {
    const qs = new URLSearchParams();
    qs.set('select', 'data,is_published,updated_at');
    qs.set('limit', '1000');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?${qs.toString()}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const rows = await response.json();
    if (!Array.isArray(rows)) return null;
    const articles = [];
    for (const row of rows) {
      const slug = row && row.data ? row.data.slug : null;
      if (typeof slug !== 'string' || !SLUG_RE.test(slug)) continue;
      if (EXCLUDED_SLUGS.has(slug)) continue;
      if (row.is_published === false) continue;
      articles.push({
        slug,
        lastmod: validLastmod(typeof row.updated_at === 'string' ? row.updated_at.slice(0, 10) : null),
      });
    }
    return articles;
  } catch {
    return null;
  }
}

function renderSitemap(urls) {
  const body = urls
    .map((u) => {
      const lastmod = u.lastmod ? `\n    <lastmod>${escapeXml(u.lastmod)}</lastmod>` : '';
      const changefreq = u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : '';
      const priority = u.priority ? `\n    <priority>${u.priority}</priority>` : '';
      return `  <url>\n    <loc>${escapeXml(u.loc)}</loc>${lastmod}${changefreq}${priority}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export default async function handler(req, res) {
  const live = await fetchArticles();
  const articles = live && live.length > 0 ? live : FALLBACK_ARTICLES;
  // Newest first, so the freshest books sit at the top of the file.
  const sorted = [...articles].sort((a, b) => {
    const byDate = (b.lastmod || '').localeCompare(a.lastmod || '');
    return byDate !== 0 ? byDate : a.slug.localeCompare(b.slug);
  });

  const seen = new Set();
  const urls = [];
  for (const u of STATIC_URLS) {
    if (seen.has(u.loc)) continue;
    seen.add(u.loc);
    urls.push(u);
  }
  for (const a of sorted) {
    const loc = `${SITE_URL}/diploma/${a.slug}`;
    if (seen.has(loc)) continue;
    seen.add(loc);
    urls.push({ loc, lastmod: a.lastmod, changefreq: 'monthly', priority: '0.85' });
  }

  const xml = renderSitemap(urls);
  res.status(200);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.send(xml);
}
