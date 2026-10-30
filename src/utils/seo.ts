/**
 * SEO & Dynamic Head Manager for Islami Banking Diploma
 * Updates title, meta tags, canonical link, OpenGraph, Twitter cards, and Schema.org JSON-LD
 * to ensure every article, diploma guide, and past question has fully crawlable metadata.
 */

export interface SeoMetadataOptions {
  title?: string;
  titleBn?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  author?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: { name: string; url: string }[];
}

const DEFAULT_ORIGIN = 'https://islamibankingdiploma-4f7m.vercel.app';

export const updateSEOMetadata = (options: SeoMetadataOptions): void => {
  const currentOrigin = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('run.app')
    ? window.location.origin
    : DEFAULT_ORIGIN;

  const rawTitle = options.titleBn || options.title || 'ইসলামী ব্যাংকিং ডিপ্লোমা';
  const siteSuffix = ' | Islami Banking Diploma (DIB)';
  const fullTitle = rawTitle.includes('ইসলামী ব্যাংকিং') || rawTitle.includes('DIB') 
    ? rawTitle 
    : `${rawTitle}${siteSuffix}`;

  // 1. Title
  document.title = fullTitle;

  // 2. Canonical URL
  const path = options.canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const canonicalUrl = `${currentOrigin}${path.startsWith('/') ? path : `/${path}`}`;
  
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 3. Helper to update/create meta tag by name or property
  const setMeta = (attribute: 'name' | 'property', attrValue: string, content: string) => {
    let meta = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, attrValue);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Description
  const description = options.description || 
    'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB) পরীক্ষার বিগত বছরের প্রশ্ন, মডেল সমাধান, স্টাডি নোটস এবং ইসলামী ব্যাংকিং ও অর্থায়ন গবেষণার উন্মুক্ত প্ল্যাটফর্ম।';
  setMeta('name', 'description', description);
  setMeta('property', 'og:description', description);
  setMeta('name', 'twitter:description', description);

  // Keywords
  const defaultKeywords = [
    'Diploma in Islamic Banking',
    'DIB Exam Bangladesh',
    'IBB past questions',
    'ইসলামিক ব্যাংকিং ডিপ্লোমা',
    'ডিআইবি পরীক্ষার প্রশ্ন ও সমাধান',
    'মুদারাবা',
    'মুশারাকা',
    'ব্যাংক কোম্পানি আইন ১৯৯১'
  ];
  const combinedKeywords = Array.from(new Set([...(options.keywords || []), ...defaultKeywords]));
  setMeta('name', 'keywords', combinedKeywords.join(', '));

  // OpenGraph & Twitter
  setMeta('property', 'og:title', fullTitle);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:type', options.ogType || 'website');
  setMeta('property', 'og:site_name', 'Islami Banking Diploma');

  const ogImage = options.ogImage || `${currentOrigin}/src/assets/images/hero_islamic_library_1793322325013.jpg`;
  setMeta('property', 'og:image', ogImage);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', fullTitle);
  setMeta('name', 'twitter:image', ogImage);

  // 4. Schema.org JSON-LD Structured Data
  const existingScript = document.getElementById('dynamic-seo-ld-json');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.id = 'dynamic-seo-ld-json';
  script.type = 'application/ld+json';

  const schemaGraph: any[] = [];

  // Breadcrumbs Schema
  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    schemaGraph.push({
      '@type': 'BreadcrumbList',
      'itemListElement': options.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': `${currentOrigin}${crumb.url}`
      }))
    });
  }

  // Article or WebPage Schema
  if (options.ogType === 'article') {
    schemaGraph.push({
      '@type': 'Article',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      'headline': options.titleBn || options.title,
      'description': description,
      'image': [ogImage],
      'author': {
        '@type': 'Person',
        'name': options.author || 'Islamic Banking Scholar'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Islami Banking Diploma',
        'logo': {
          '@type': 'ImageObject',
          'url': `${currentOrigin}/src/assets/images/category_diploma_banking_1793322326189.jpg`
        }
      },
      'datePublished': options.datePublished || new Date().toISOString(),
      'dateModified': options.dateModified || options.datePublished || new Date().toISOString(),
      'keywords': combinedKeywords.slice(0, 10).join(', ')
    });
  } else {
    schemaGraph.push({
      '@type': 'WebPage',
      '@id': canonicalUrl,
      'name': fullTitle,
      'description': description,
      'url': canonicalUrl,
      'inLanguage': ['bn', 'en']
    });
  }

  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemaGraph
  });

  document.head.appendChild(script);
};
