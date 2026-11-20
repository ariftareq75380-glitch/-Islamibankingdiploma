/**
 * Vercel Serverless Function: per-article Open Graph tags for social crawlers.
 *
 * Social preview crawlers (WhatsApp, Facebook, X, Telegram, LinkedIn, Slack)
 * do not run JavaScript, so for this client-side React SPA they only ever see
 * index.html's generic OG tags. vercel.json rewrites /diploma/:slug requests
 * from those crawlers to this function, which returns a minimal HTML document
 * carrying the article's own title, description and cover image.
 *
 * Search crawlers (Googlebot, Bingbot) are rewritten here too, for the same
 * reason: they must see the article's own title, canonical and Article +
 * BreadcrumbList JSON-LD in the raw HTML, instead of the identical homepage
 * shell every article would otherwise serve. Humans never reach this
 * function: the rewrite only matches crawler User-Agents, and everyone else
 * gets the SPA shell.
 *
 * The same function also serves /faq to search crawlers (vercel.json
 * rewrites /faq for Googlebot/Bingbot to /api/og?faq=1). It returns the
 * FAQ page's own title and FAQPage JSON-LD built from the shared FAQ data
 * (src/data/faq.json — the same source FaqSection.tsx renders), with the
 * questions and answers visible in the body so the markup matches what a
 * visitor sees.
 *
 * Plain JavaScript on purpose: no TypeScript transpilation step is involved
 * in building this function.
 */

import faqData from '../src/data/faq.json';

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

function escapeAttr(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function trimDescription(text, max = 125) {
  const chars = Array.from(text.trim().replace(/\s+/g, ' '));
  if (chars.length <= max) return chars.join('');
  const cut = chars.slice(0, max - 1).join('');
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut) + '…';
}

/**
 * Pick a crawler-safe cover image. WhatsApp does not reliably render base64
 * data URIs or .webp images, so those fall back to the site JPG. Relative
 * paths are absolutized first; unknown formats fall back too.
 */
function pickImage(cover) {
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

/**
 * Build the Article + BreadcrumbList JSON-LD for one article, mirroring the
 * client-side schema in src/utils/seo.ts (same breadcrumb trail, same
 * author default). datePublished comes only from the article's real date —
 * if the article has no date, the field is omitted rather than invented.
 * The JSON is escaped so a `</script>` inside a title or description can
 * never break out of the script tag.
 */
function buildArticleJsonLd({ title, description, pageUrl, imageUrl, author, datePublished }) {
  const article = {
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: title,
    description,
    image: [imageUrl],
    author: {
      '@type': 'Person',
      name: author || 'Admin',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Islami Banking Diploma',
    },
  };
  if (datePublished) {
    article.datePublished = datePublished;
    article.dateModified = datePublished;
  }
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'হোম', item: `${SITE_URL}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB)',
        item: `${SITE_URL}/diploma`,
      },
      { '@type': 'ListItem', position: 3, name: title, item: pageUrl },
    ],
  };
  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [article, breadcrumb],
  }).replace(/<\//g, '<\\/');
  return json;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Build the FAQPage JSON-LD for /faq from the shared FAQ data
 * (src/data/faq.json — the same source FaqSection.tsx renders).
 * Bengali is used: it is the site's default language and the version a
 * first-load visitor sees. The JSON is escaped the same way as the
 * Article JSON-LD so a `</script>` inside an answer can never break out.
 */
function buildFaqJsonLd() {
  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.questionBn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answerBn,
      },
    })),
  }).replace(/<\//g, '<\\/');
  return json;
}

/**
 * Visible FAQ content for the /faq crawler page, so the FAQPage markup is
 * backed by the same questions and answers a visitor sees (Bengali, the
 * site's default language). Newlines in answers become line breaks.
 */
function buildFaqBody() {
  const items = faqData
    .map(
      (item) =>
        `      <h2>${escapeHtml(item.questionBn)}</h2>\n      <p>${escapeHtml(item.answerBn).replace(/\n/g, '<br />')}</p>`,
    )
    .join('\n');
  return `    <h1>ডিআইবি পরীক্ষা ও প্রস্তুতি সংক্রান্ত প্রশ্নোত্তরি</h1>\n${items}\n    <p><a href="${SITE_URL}/faq">FAQ | ইসলামী ব্যাংকিং ডিপ্লোমা</a></p>`;
}

function renderPage(options) {
  const t = escapeAttr(options.title);
  const d = escapeAttr(options.description);
  const u = escapeAttr(options.pageUrl);
  const img = escapeAttr(options.imageUrl);
  const dims =
    options.imageWidth && options.imageHeight
      ? `    <meta property="og:image:width" content="${options.imageWidth}" />\n    <meta property="og:image:height" content="${options.imageHeight}" />\n    <meta property="og:image:type" content="image/jpeg" />\n`
      : '';
  const jsonLd = options.jsonLd
    ? `    <script type="application/ld+json">\n${options.jsonLd}\n    </script>\n`
    : '';
  const body = options.bodyHtml || `    <p><a href="${u}">${t}</a></p>`;
  return `<!doctype html>
<html lang="bn">
  <head>
    <meta charset="UTF-8" />
    <title>${t}</title>
    <meta name="description" content="${d}" />
    <link rel="canonical" href="${u}" />
${jsonLd}    <meta property="og:title" content="${t}" />
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
${body}
  </body>
</html>
`;
}

export default async function handler(req, res) {
  const rawUrl = typeof req.url === 'string' ? req.url : '/';
  const host =
    req.headers && typeof req.headers.host === 'string'
      ? req.headers.host
      : 'islamibankingdiploma-4f7m.vercel.app';
  const url = new URL(rawUrl, `https://${host}`);

  // /faq for search crawlers: FAQPage JSON-LD from the shared FAQ data.
  // Title matches what the SPA sets for the faq tab; the description is the
  // FAQ section's own Bengali intro line from FaqSection.tsx.
  if (url.searchParams.get('faq') === '1') {
    const html = renderPage({
      title: 'FAQ | ইসলামী ব্যাংকিং ডিপ্লোমা',
      description: trimDescription(
        'আইবিবি ডিপ্লোমা ইন ইসলামিক ব্যাংকিং পরীক্ষা, পাস মার্ক, সিলেবাসের পরিবর্তন এবং চাকরির পাশাপাশি স্টাডি রুটিন সংক্রান্ত জরুরি প্রশ্নের উত্তর।',
      ),
      pageUrl: `${SITE_URL}/faq`,
      ogType: 'website',
      imageUrl: SITE_IMAGE,
      imageWidth: SITE_IMAGE_WIDTH,
      imageHeight: SITE_IMAGE_HEIGHT,
      jsonLd: buildFaqJsonLd(),
      bodyHtml: buildFaqBody(),
    });
    res.status(200);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(html);
    return;
  }

  const rawSlug = url.searchParams.get('slug') || '';
  const slug = SLUG_RE.test(rawSlug) ? rawSlug : '';
  const articleUrl = slug ? `${SITE_URL}/diploma/${slug}` : SITE_URL;

  let article = null;
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
        const rows = await response.json();
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

  const title = (article && (article.titleBn || article.title)) || SITE_TITLE;
  const description = trimDescription(
    (article && (article.summaryBn || article.summary)) || SITE_DESCRIPTION,
  );
  const image = pickImage(article && article.coverImage);

  // Article + BreadcrumbList JSON-LD for search crawlers. The schema
  // description uses the full summary (the meta description above is the
  // trimmed 125-char version). Only emitted when a real article was found.
  const jsonLd = article
    ? buildArticleJsonLd({
        title,
        description: ((article.summaryBn || article.summary) || SITE_DESCRIPTION)
          .trim()
          .replace(/\s+/g, ' '),
        pageUrl: articleUrl,
        imageUrl: image.url,
        author: article.author,
        datePublished: article.publishedDate || article.publishedAt || '',
      })
    : '';

  const html = renderPage({
    title,
    description,
    pageUrl: articleUrl,
    ogType: article ? 'article' : 'website',
    imageUrl: image.url,
    imageWidth: image.width,
    imageHeight: image.height,
    jsonLd,
  });

  res.status(200);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(html);
}
