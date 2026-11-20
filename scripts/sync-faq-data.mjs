// Regenerates api/faqData.js from src/data/faq.json (the single source of
// truth for the FAQ, also imported by src/components/FaqSection.tsx).
// Runs automatically as `prebuild` before `bun run build`, so the server
// copy can never drift from the JSON. Run by hand with:
//   node scripts/sync-faq-data.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const faq = JSON.parse(readFileSync(join(root, 'src/data/faq.json'), 'utf8'));

const out = `// GENERATED FILE — do not edit by hand.
// Source of truth: src/data/faq.json (also imported by
// src/components/FaqSection.tsx). Regenerate with:
//   node scripts/sync-faq-data.mjs
// (runs automatically as \`prebuild\` before \`bun run build\`).
// Kept as a plain JS module inside api/ so the serverless function can
// import it without a JSON import, which Vercel's runtime rejects.
export const faqData = ${JSON.stringify(faq, null, 2)};
`;

writeFileSync(join(root, 'api/faqData.js'), out, 'utf8');
console.log(`api/faqData.js regenerated (${faq.length} FAQ items).`);
