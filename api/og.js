// Minimal probe: does ANY serverless function break this project's Vercel build?
export default function handler(req, res) {
  res.status(200);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send('og-probe-ok');
}
