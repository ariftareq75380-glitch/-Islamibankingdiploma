/**
 * Utilities for handling WYSIWYG HTML content and backward-compatible legacy Markdown.
 */

export const isHtmlContent = (content: string): boolean => {
  if (!content) return false;
  const trimmed = content.trim();
  return /<\/?(p|h1|h2|h3|h4|ul|ol|li|strong|em|u|a|blockquote|hr|br|div|span)\b[^>]*>/i.test(trimmed);
};

export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Escapes HTML special characters in plain text segments before inline markdown conversion.
 */
const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Converts inline Markdown (**bold**, *italic*, [label](url), preserving <u>...</u>) to HTML.
 */
const convertInlineMarkdown = (text: string): string => {
  // Temporarily preserve <u>...</u> tags if present
  const uPlaceholders: string[] = [];
  let processed = text.replace(/<u>([\s\S]*?)<\/u>/gi, (_m, inner) => {
    const idx = uPlaceholders.length;
    uPlaceholders.push(inner);
    return `%%U_OPEN_${idx}%%${inner}%%U_CLOSE_${idx}%%`;
  });

  processed = escapeHtml(processed);

  // Restore <u> tags
  processed = processed.replace(/%%U_OPEN_(\d+)%%([\s\S]*?)%%U_CLOSE_\1%%/g, (_m, _idx, inner) => {
    return `<u>${inner}</u>`;
  });

  // Links: [label](url)
  processed = processed.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });

  // Bold: **text**
  processed = processed.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text*
  processed = processed.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

  return processed;
};

/**
 * Converts legacy Markdown article content into clean HTML so existing articles
 * open smoothly in the TipTap WYSIWYG editor and render properly.
 */
export const markdownToHtml = (content: string): string => {
  if (!content || !content.trim()) return '';
  if (isHtmlContent(content)) return content;

  const blocks = content.split(/\n\s*\n/);
  const htmlParts: string[] = [];

  for (const rawBlock of blocks) {
    const block = rawBlock.trim();
    if (!block) continue;

    if (block.startsWith('## ')) {
      htmlParts.push(`<h2>${convertInlineMarkdown(block.slice(3).trim())}</h2>`);
      continue;
    }

    if (block.startsWith('### ')) {
      htmlParts.push(`<h3>${convertInlineMarkdown(block.slice(4).trim())}</h3>`);
      continue;
    }

    if (block.startsWith('> ')) {
      const quoteLines = block
        .split('\n')
        .map((line) => convertInlineMarkdown(line.replace(/^>\s?/, '')))
        .join('<br />');
      htmlParts.push(`<blockquote><p>${quoteLines}</p></blockquote>`);
      continue;
    }

    if (/^---+$/.test(block)) {
      htmlParts.push('<hr />');
      continue;
    }

    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const isBulletList = lines.length > 0 && lines.every((l) => l.startsWith('- ') || l.startsWith('* '));
    if (isBulletList) {
      const items = lines
        .map((l) => `<li><p>${convertInlineMarkdown(l.slice(2).trim())}</p></li>`)
        .join('');
      htmlParts.push(`<ul>${items}</ul>`);
      continue;
    }

    const isOrderedList = lines.length > 0 && lines.every((l) => /^(\d+|[০-৯]+)\.\s+/.test(l));
    if (isOrderedList) {
      const items = lines
        .map((l) => `<li><p>${convertInlineMarkdown(l.replace(/^(\d+|[০-৯]+)\.\s+/, '').trim())}</p></li>`)
        .join('');
      htmlParts.push(`<ol>${items}</ol>`);
      continue;
    }

    const paragraphHtml = lines.map((l) => convertInlineMarkdown(l)).join('<br />');
    htmlParts.push(`<p>${paragraphHtml}</p>`);
  }

  return htmlParts.join('');
};

export const ensureHtmlContent = (content: string): string => {
  if (!content || !content.trim()) return '';
  return isHtmlContent(content) ? content : markdownToHtml(content);
};

/**
 * Basic client-side HTML sanitization before rendering article HTML in public views.
 */
export const sanitizeHtmlForRender = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/href\s*=\s*(["'])\s*javascript:[^"']*\1/gi, 'href="#"');
};
