/**
 * Vercel Serverless Function: per-article Open Graph tags for social crawlers.
 *
 * Social preview crawlers (WhatsApp, Facebook, X, Telegram, LinkedIn, Slack)
 * do not run JavaScript, so for this client-side React SPA they only ever see
 * index.html's generic OG tags. vercel.json rewrites /diploma/:slug requests
 * from those crawlers to this function, which returns a minimal HTML document
 * carrying the article's own title, description and cover image.
 *
 * Humans and Googlebot never reach this function: the rewrite only matches
 * social-crawler User-Agents, and everyone else gets the SPA shell.
 *
 * Uses the canonical default-export Node handler form.
 */

const SITE_URL = 'https://islamibankingdiploma-4f7m.vercel.app';
const SUPABASE_URL = 'https://cdgkjgjltlrihipnvpxb.supabase.co';
// Public publishable key (already public: embedded in the live JS bundle).
const SUPABASE_KEY = 'sb_publishable_LOWfR5rUGwFsaj68oam1Mw_B2zwlyCF';

const SITE_TITLE = 'ইসলামী ব্যাংকিং ডিপ্লোমা | Islami Banking Diploma';
const SITE_DESCRIPTION =
  'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB) পরীক্ষার বিগত বছরের প্রশ্ন, সমাধান, স্টাডি নোটস এবং ইসলামী অর্থনীতির পূর্ণাঙ্গ উন্মুক্ত পিডিএফ পাঠাগার।';
const SITE_IMAGE = `${SITE_URL}/images/hero_islamic_library_1793322325013.jpg`;
const SITE_IMAGE_WIDTH = 1376;
const SITE_IMAGE_HEIGHT = 768;

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,119}$/;

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function trimDescription(text: string, max = 125): string {
  const chars = Array.from(text.trim().replace(/\s+/g, ' '));
  if (chars.length <= max) return chars.join('');
  const cut = chars.slice(0, max - 1).join('');
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut) + '…';
}

interface ArticleData {
  title?: string;
  titleBn?: string;
  summary?: string;
  summaryBn?: string;
  coverImage?: string;
}

/**
 * Pick a crawler-safe cover image. WhatsApp does not reliably render base64
 * data URIs or .webp images, so those fall back to the site JPG. Relative
 * paths are absolutized first; unknown formats fall back too.
 */
function pickImage(cover: string | undefined): {
  url: string;
  width?: number;
  height?: number;
} {
  let candidate = (cover || '').trim();
  if (!candidate || candidate.startsWith('data:')) {
    return { url: SITE_IMAGE, width: SITE_IMAGE_WIDTH, height: SITE_IMAGE_HEIGHT };
  }
  if (candidate.startsWith('/')) {
    candidate = SITE_URL + candidate;
  }
  const clean = candidate.split(/[?#]/)[0];
  if (/^https?:\/\/.+\.(jpe?g|png)$/i.test(clean)) {
    return { url: candidate };
  }
  return { url: SITE_IMAGE, width: SITE_IMAGE_WIDTH, height: SITE_IMAGE_HEIGHT };
}

function renderPage(options: {
  title: string;
  description: string;
  pageUrl: string;
  ogType: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
}): string {
  const t = escapeAttr(options.title);
  const d = escapeAttr(options.description);
  const u = escapeAttr(options.pageUrl);
  const img = escapeAttr(options.imageUrl);
  const dims =
    options.imageWidth && options.imageHeight
      ? `    <meta property="og:image:width" content="${options.imageWidth}" />\n    <meta property="og:image:height" content="${options.imageHeight}" />\n    <meta property="og:image:type" content="image/jpeg" />\n`
      : '';
  return `<!doctype html>
<html lang="bn">
  <head>
    <meta charset="UTF-8" />
    <title>${t}</title>
    <meta name="description" content="${d}" />
    <link rel="canonical" href="${u}" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:type" content="${options.ogType}" />
    <meta property="og:url" content="${u}" />
    <meta property="og:site_name" content="Islami Banking Diploma" />
    <meta property="og:image" content="${img}" />
${dims}    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="${img}" />
    <meta http-equiv="refresh" content="0; url=${u}" />
  </head>
  <body>
    <p><a href="${u}">${t}</a></p>
  </body>
</html>
`;
}

export default async function handler(req: any, res: any): Promise<void> {
  const rawUrl = typeof req.url === 'string' ? req.url : '/';
  const host =
    req.headers && typeof req.headers.host === 'string'
      ? req.headers.host
      : 'islamibankingdiploma-4f7m.vercel.app';
  const url = new URL(rawUrl, `https://${host}`);
  const rawSlug = url.searchParams.get('slug') || '';
  const slug = SLUG_RE.test(rawSlug) ? rawSlug : '';
  const articleUrl = slug ? `${SITE_URL}/diploma/${slug}` : SITE_URL;

  let article: ArticleData | null = null;
  if (slug) {
    try {
      const qs = new URLSearchParams();
      qs.set('select', 'data,cover_image');
      qs.set('data->>slug', `eq.${slug}`);
      qs.set('limit', '1');
      const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?${qs.toString()}`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const rows = (await response.json()) as Array<{
          data?: ArticleData;
          cover_image?: string;
        }>;
        if (rows.length > 0) {
          article = { ...(rows[0].data || {}) };
          if (!article.coverImage && rows[0].cover_image) {
            article.coverImage = rows[0].cover_image;
          }
        }
      }
    } catch {
      // Any fetch failure falls through to the site-wide tags below.
      article = null;
    }
  }

  const title = article?.titleBn || article?.title || SITE_TITLE;
  const description = trimDescription(
    article?.summaryBn || article?.summary || SITE_DESCRIPTION,
  );
  const image = pickImage(article?.coverImage);

  const html = renderPage({
    title,
    description,
    pageUrl: articleUrl,
    ogType: article ? 'article' : 'website',
    imageUrl: image.url,
    imageWidth: image.width,
    imageHeight: image.height,
  });

  res.status(200);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(html);
}
