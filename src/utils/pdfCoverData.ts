// Static preview images for real PDFs, rendered from the PDF files
// themselves (pdftoppm at 120 DPI -> webp -> base64 data URIs).
//
// WHY base64 in code, not files under public/images/: the deploy
// pipeline available to this agent only accepts text files, so binary
// image files cannot be committed through it. The images therefore live
// in code as data URIs.
//
// WHY one module per book (src/utils/pdfCovers/): the six books' images
// together are ~1.26 MB of base64. They used to live in this single
// module, so opening ANY article page downloaded and parsed all six
// books' images (a ~930 KB gzip JS chunk) just to show two of them.
// Now each book's images are their own lazily imported chunk, so an
// article page only fetches that one book's ~160-290 KB of images.
//
// To add a preview for a future real PDF: render its first pages to
// webp (pdftoppm -r 120), base64-encode them, add one file under
// src/utils/pdfCovers/ exporting the image array as default, and add
// one entry below keyed by a distinctive part of the PDF file name.
// Anything without an entry gets the styled placeholder card - never
// an iframe, never a fake file.

const PDF_COVER_LOADERS: {
  match: string;
  load: () => Promise<{ default: string[] }>;
}[] = [
  {
// Code 106 model-answers book (63 pages). The article copy and the
// library copy are the same PDF uploaded twice, so one entry covers
// both storage URLs.
    match: 'diploma-islamic-banking-part-i.pdf',
    load: () => import('./pdfCovers/106-model-answers'),
  },
  {
// Code 105 model-answers book, English version (227 pages).
// Attached to the article dib-part-1-code-105-business-communication-
// model-answers-english; the match is the distinctive file name.
    match: 'dib-part-1-105-model-answers-english.pdf',
    load: () => import('./pdfCovers/105-model-answers-english'),
  },
  {
// Code 106 repeated-questions model-answers book, Bengali version
// (137 pages: 51 questions that appeared 3+ times + 31 repeated
// short notes). The match is the distinctive file name.
    match: 'dib-part-1-106-repeated-51-model-answers-bengali.pdf',
    load: () => import('./pdfCovers/106-repeated'),
  },
  {
// Code 105 repeated-questions revision notes book, English version
// (23 pages: 13 main topics + 2 short notes that appeared 3+ times,
// May 2023 - May 2026). The match is the distinctive file name.
    match: 'dib-part-1-105-repeated-questions-notes-english.pdf',
    load: () => import('./pdfCovers/105-repeated-notes'),
  },
  {
// Code 103 repeated-questions model-answers book, Bengali version
// (116 pages: 35 main questions that appeared 3+ times + 17 repeated
// short notes, sessions Sep 2016 - May 2026). The match is the distinctive file name.
    match: 'dib-part-1-103-repeated-52-model-answers-bengali.pdf',
    load: () => import('./pdfCovers/103-repeated'),
  },
  {
// Code 104 repeated-questions model-answers book, Bengali version
// (101 pages: 27 main questions that appeared 3+ times + 12 repeated
// short notes, sessions Sep 2016 - May 2026). The match is the distinctive file name.
    match: 'dib-part-1-104-repeated-model-answers-bengali.pdf',
    load: () => import('./pdfCovers/104-repeated'),
  },
];

// Cover/first-page images for a PDF, or [] when none was generated.
// Callers must render the styled placeholder in that case.
export async function loadPdfCoverImages(pdfUrl?: string | null): Promise<string[]> {
  if (!pdfUrl) return [];
  const entry = PDF_COVER_LOADERS.find((e) => pdfUrl.includes(e.match));
  if (!entry) return [];
  try {
    const mod = await entry.load();
    return mod.default;
  } catch {
    return [];
  }
}
