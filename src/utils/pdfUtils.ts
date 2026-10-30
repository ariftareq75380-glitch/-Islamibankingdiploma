export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:' || urlString.startsWith('data:');
  } catch {
    return false;
  }
}

export function isGoogleDriveUrl(urlString: string): boolean {
  if (!urlString) return false;
  return urlString.includes('drive.google.com') || urlString.includes('docs.google.com');
}

export function getGoogleDriveEmbedUrl(driveUrl: string): string {
  if (!driveUrl) return '';
  // Convert standard /view or /edit or file/d/ID to /preview for embedded iframe
  const fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  }
  return driveUrl;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Creates a synthetic educational printable HTML/PDF document blob
 * so students get a real, formatted study sheet when downloading.
 */
export function generateStudyDocumentBlob(
  title: string,
  titleBn: string,
  subject: string,
  year: string,
  session: string,
  description: string,
  keyTopics: string[] = []
): Blob {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @page { margin: 20mm; size: A4; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hind Siliguri", sans-serif; color: #1e293b; line-height: 1.6; }
    .header { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 24px; text-align: center; }
    .org-title { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #047857; margin: 0; font-weight: bold; }
    .doc-title { font-size: 22px; font-weight: bold; margin: 8px 0 4px; color: #0f172a; }
    .doc-title-bn { font-size: 18px; color: #334155; margin: 0 0 12px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    .meta-table td { padding: 6px 10px; border: 1px solid #e2e8f0; }
    .meta-label { font-weight: bold; background-color: #f8fafc; width: 25%; }
    .section-title { font-size: 16px; font-weight: bold; color: #0f172a; border-left: 3px solid #059669; padding-left: 8px; margin: 20px 0 8px; }
    .topics-list { list-style: disc; padding-left: 20px; }
    .topics-list li { margin-bottom: 6px; }
    .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; }
    .watermark { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <p class="org-title">Islami Banking Diploma · Bangladesh</p>
    <div class="doc-title">${title}</div>
    <div class="doc-title-bn">${titleBn}</div>
  </div>

  <table class="meta-table">
    <tr>
      <td class="meta-label">Subject / বিষয়:</td>
      <td>${subject}</td>
      <td class="meta-label">Examination Year:</td>
      <td>${year} (${session})</td>
    </tr>
    <tr>
      <td class="meta-label">Target Audience:</td>
      <td>Diploma in Islamic Banking (DIB) / Bankers in Bangladesh</td>
      <td class="meta-label">Reference Standard:</td>
      <td>AAOIFI / Bangladesh Bank Guidelines</td>
    </tr>
  </table>

  <div class="section-title">Overview & Syllabus Scope / সারসংক্ষেপ</div>
  <p>${description}</p>

  ${
    keyTopics.length > 0
      ? `
  <div class="section-title">Key Core Topics & Exam Focus / গুরুত্বপূর্ণ বিষয়বস্তু</div>
  <ul class="topics-list">
    ${keyTopics.map(t => `<li><strong>${t}</strong>: High-probability question areas for theoretical & practical case studies.</li>`).join('')}
  </ul>
  `
      : ''
  }

  <div class="section-title">Essential Examination Guidelines</div>
  <p>1. Always ground definitions in authentic Shariah principles (Al-Kharaj bi al-Daman, prohibition of Gharar, Riba, and Maysir).<br>
     2. Differentiate clearly between trading modes (Murabaha/Salam/Istisna'a) and partnership financing (Mudaraba/Musharaka).<br>
     3. Quote relevant Bank Company Act 1991 sections and Central Shariah Board for Islamic Banks of Bangladesh (CSBIB) resolutions.</p>

  <div class="footer">
    Downloaded from <strong>Islami Banking Diploma</strong> (ইসলামী ব্যাংকিং ডিপ্লোমা) | Open Educational Resource for Bangladesh
  </div>
</body>
</html>
  `;
  return new Blob([content], { type: 'text/html' });
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
