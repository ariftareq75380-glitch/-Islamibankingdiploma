import React, { useState } from 'react';
import { 
  X, 
  FileCode, 
  Check, 
  Copy, 
  Download, 
  Server, 
  Layers, 
  Database, 
  ExternalLink,
  ShieldAlert,
  Zap,
  DollarSign,
  Globe,
  Link2,
  UploadCloud
} from 'lucide-react';
import { StorageService } from '../services/storage';

interface WordPressArchitectureModalProps {
  onClose: () => void;
  lang: 'bn' | 'en';
}

export const WordPressArchitectureModal: React.FC<WordPressArchitectureModalProps> = ({
  onClose,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'cpt-code' | 'plugins' | 'export-json' | 'google-seo' | 'custom-link'>('custom-link');
  const [copiedCode, setCopiedCode] = useState(false);

  const phpSnippet = `<?php
/**
 * Plugin Name: Islamic Knowledge Library - Custom Post Types & Taxonomies
 * Description: Registers 'pdf_resource' & 'banking_article' with custom taxonomies for DIB examinations.
 * Version: 1.0.0
 * Author: Islamic Knowledge Library Team
 */

if (!defined('ABSPATH')) exit;

function ikl_register_post_types_and_taxonomies() {
    // 1. Register PDF Resource Custom Post Type
    register_post_type('pdf_resource', [
        'labels' => [
            'name'          => 'PDF Resources',
            'singular_name' => 'PDF Resource',
            'menu_name'     => 'PDF Library (DIB)',
            'add_new_item'  => 'Add New DIB Exam PDF',
            'edit_item'     => 'Edit Exam PDF',
        ],
        'public'        => true,
        'has_archive'   => true,
        'menu_icon'     => 'dashicons-pdf',
        'supports'      => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
        'show_in_rest'  => true,
        'rewrite'       => ['slug' => 'pdf-resources'],
    ]);

    // 2. Register Banking Articles CPT
    register_post_type('banking_article', [
        'labels' => [
            'name'          => 'Banking Articles',
            'singular_name' => 'Banking Article',
            'menu_name'     => 'Banking Articles',
            'add_new_item'  => 'Write New Islamic Banking Article',
        ],
        'public'        => true,
        'has_archive'   => true,
        'menu_icon'     => 'dashicons-welcome-write-blog',
        'supports'      => ['title', 'editor', 'author', 'thumbnail', 'excerpt'],
        'show_in_rest'  => true,
        'rewrite'       => ['slug' => 'articles'],
    ]);

    // 3. Taxonomies for PDF Resources
    // Exam Year
    register_taxonomy('exam_year', ['pdf_resource'], [
        'label'        => 'Exam Year',
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite'      => ['slug' => 'exam-year'],
    ]);

    // Exam Session (May, November, Special)
    register_taxonomy('exam_session', ['pdf_resource'], [
        'label'        => 'Exam Session',
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite'      => ['slug' => 'session'],
    ]);

    // Course / Track (DIB Part 1, Part 2, Islamic Studies)
    register_taxonomy('course_track', ['pdf_resource'], [
        'label'        => 'Course Track',
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite'      => ['slug' => 'course'],
    ]);

    // Subject Taxonomy
    register_taxonomy('banking_subject', ['pdf_resource', 'banking_article'], [
        'label'        => 'Subject / বিষয়ের নাম',
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite'      => ['slug' => 'subject'],
    ]);
}
add_action('init', 'ikl_register_post_types_and_taxonomies');
`;

  const handleCopyPhp = () => {
    navigator.clipboard.writeText(phpSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportJson = () => {
    const json = StorageService.exportDatabaseBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `islamic_knowledge_library_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                {lang === 'bn' ? 'ওয়ার্ডপ্রেস কারিগরি ব্লুপ্রিন্ট ও আর্কিটেকচার' : 'WordPress CMS Technical Blueprint'}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn' ? 'ওয়ার্ডপ্রেস বাস্তবায়ন ও ডাটা স্ট্রাকচার গাইড' : 'WordPress Architecture, Themes & Plugins Plan'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-stone-100 border-b border-stone-200 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'architecture' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            1. Architecture & Themes
          </button>
          <button
            onClick={() => setActiveTab('plugins')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'plugins' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            2. Required Plugins Stack
          </button>
          <button
            onClick={() => setActiveTab('cpt-code')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'cpt-code' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            3. Native PHP / CPT Code
          </button>
          <button
            onClick={() => setActiveTab('export-json')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'export-json' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            4. Export / Migration JSON
          </button>
          <button
            onClick={() => setActiveTab('google-seo')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'google-seo' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            5. Google SEO & Ranking
          </button>
          <button
            onClick={() => setActiveTab('custom-link')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'custom-link' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ⚡ ৬. কাস্টম লিঙ্ক ও ফ্রি ডোমেন (Vercel)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="overflow-y-auto p-6 space-y-6 text-stone-800 text-sm">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  A. Recommended Lightweight, SEO-Friendly WordPress Themes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-xs font-bold text-emerald-800 uppercase">Top Recommendation</span>
                    <h4 className="font-bold text-stone-900 text-base mt-1">GeneratePress (Free / Premium)</h4>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      Adds less than 30KB of HTTP payload, zero dependencies (no jQuery), 100% Core Web Vitals score, and clean semantic HTML5 markup. Native integration with Bengali Google fonts (Hind Siliguri / Noto Sans Bengali).
                    </p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-xs font-bold text-stone-500 uppercase">Alternative</span>
                    <h4 className="font-bold text-stone-900 text-base mt-1">Kadence WP Theme</h4>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      Features a powerful drag-and-drop header/footer builder, schema built-in, lightning-fast rendering, and excellent WooCommerce or LMS compatibility if course monetization is desired later.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  B. High-Traffic PDF Storage Strategy (Cloudflare R2 / AWS S3)
                </h3>
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-stone-700 leading-relaxed space-y-2">
                  <p>
                    <strong>Why avoid storing thousands of 15MB PDFs inside WordPress <code>/wp-content/uploads/</code>?</strong>
                  </p>
                  <p>
                    Local web host storage will quickly fill up, degrading backup speeds and exhausting disk I/O. As traffic grows among Bangladeshi students during exam weeks (May & November), offload PDFs to <strong>Cloudflare R2</strong> or <strong>Wasabi/AWS S3</strong> using the free <em>WP Offload Media Lite</em> plugin or direct Google Drive embeds. Cloudflare R2 has <strong>$0 egress fees</strong>, ensuring zero cost even when thousands of students download past question PDFs simultaneously!
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  C. Google AdSense Monetization & Policy Compliance
                </h3>
                <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1.5">
                  <li><strong>Clear Separation:</strong> Never place ads directly adjacent to or disguised as "Download PDF" buttons.</li>
                  <li><strong>Mandatory Policy Pages:</strong> Privacy Policy, Terms, Disclaimer, and Contact Form must exist and be accessible in the footer.</li>
                  <li><strong>Valuable Unique Content:</strong> In addition to past question PDFs, maintain your bilingual articles and analytical study notes to satisfy AdSense content depth criteria.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'plugins' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">
                Recommended Strict Minimal Plugin Stack (Zero-Bloat Rule)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Advanced Custom Fields (ACF Pro) or Pods Framework</h4>
                    <p className="text-stone-600 mt-0.5">Defines custom meta fields: PDF upload file, Google Drive backup URL, Exam Year, Exam Session, File Size, and Key Topics.</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Relevanssi or Search & Filter Pro</h4>
                    <p className="text-stone-600 mt-0.5">Replaces standard WordPress search with indexed taxonomy, subject, and custom field search. Instant multi-criteria filtering by Course, Year, and Session without bloated page reloads.</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">RankMath SEO</h4>
                    <p className="text-stone-600 mt-0.5">Generates clean XML sitemaps for <code>/pdf-resources/</code>, configures Schema.org EducationalOrganization, and controls OpenGraph social share previews in Bengali & English.</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">4</div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">LiteSpeed Cache or WP Rocket</h4>
                    <p className="text-stone-600 mt-0.5">Enables page caching, CSS/JS compression, and instant server response times for mobile visitors across Bangladesh on 3G/4G networks.</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">5</div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Ad Inserter (Compliant Ad Management)</h4>
                    <p className="text-stone-600 mt-0.5">Places Google AdSense banner and in-feed units automatically into designated safe zones with strict "Advertisement" labeling.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cpt-code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900">Custom Post Types & Taxonomies Code (functions.php)</h3>
                  <p className="text-xs text-stone-500">Paste this into your child theme <code>functions.php</code> or custom site plugin:</p>
                </div>
                <button
                  onClick={handleCopyPhp}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy PHP Code'}</span>
                </button>
              </div>

              <pre className="p-4 bg-stone-950 text-emerald-300 text-xs rounded-xl overflow-x-auto font-mono max-h-96 leading-relaxed">
                {phpSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'export-json' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900">Export Current Resources & Articles Database</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                All resources, Bengali/English articles, and site configurations created in this applet can be downloaded as a structured JSON backup. You can use this to migrate your data directly to WordPress using the WP All Import plugin or custom REST API importer.
              </p>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-stone-900">Full Database JSON Archive</div>
                  <div className="text-[11px] text-stone-500">Includes all DIB past questions, solutions, articles, and site settings.</div>
                </div>
                <button
                  onClick={handleExportJson}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup JSON</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'google-seo' && (
            <div className="space-y-6 text-xs text-stone-700 leading-relaxed font-bengali">
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  গুগল সার্চে ১ নম্বরে ওয়েবসাইট আনার পূর্ণাঙ্গ ব্লুপ্রিন্ট (Step-by-Step Ranking Guide)
                </h3>
                <p className="text-stone-500">
                  বাংলাদেশী ব্যাংকিং শিক্ষার্থী ও পরীক্ষার্থীরা যেন গুগলে সার্চ করলেই আপনার সাইটের লিঙ্ক খুঁজে পায়, তার প্রফেশনাল গাইড।
                </p>
              </div>

              {/* Step 1: Custom Domain */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[11px]">১</span>
                  <span>একটি সুন্দর কাস্টম ডোমেইন যুক্ত করুন (Custom Domain)</span>
                </div>
                <p>
                  গুগলে স্থায়ী ট্রাস্ট এবং ব্র্যান্ডিংয়ের জন্য একটি সুন্দর ডোমেইন কেনা জরুরি (যেমন: <code>islamicbankinglibrary.com</code>, <code>dibbd.com</code> বা <code>islamicbankers.org</code>)। Namecheap, Hostinger বা বাংলাদেশি যেকোনো ডোমেইন প্রোভাইডার থেকে এটি কিনতে পারবেন।
                </p>
              </div>

              {/* Step 2: Google Search Console */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[11px]">২</span>
                  <span>Google Search Console (GSC)-এ সাইট ভেরিফাই ও সাইটম্যাপ জমা</span>
                </div>
                <p>
                  গুগলের অফিসিয়াল টুল <strong>Google Search Console</strong> (search.google.com/search-console)-এ গিয়ে আপনার সাইটের লিংক যোগ করুন। এরপর <strong>Sitemaps</strong> অপশনে গিয়ে আপনার সাইটের <code>/sitemap.xml</code> লিংকটি সাবমিট করুন। এতে গুগলের রোবট আপনার সব পিডিএফ প্রশ্নপত্র ও আর্টিকেল ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ইনডেক্স করে সার্চ রেজাল্টে নিয়ে আসবে।
                </p>
              </div>

              {/* Step 3: High Volume Target Keywords */}
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3">
                <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[11px]">৩</span>
                  <span>যেসব কি-ওয়ার্ডে ছাত্ররা গুগলে সার্চ করে (High-Intent Keywords)</span>
                </div>
                <p>
                  আপনার প্রতিটি প্রশ্নপত্র ও আর্টিকেলের শিরোনামে নিচের কি-ওয়ার্ডগুলো বাংলায় ও ইংরেজিতে ব্যবহার করবেন (আমরা সাইটে ইতোমধ্যে এই মেটা ট্যাগগুলো যুক্ত করে দিয়েছি):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                    <strong className="text-emerald-900 block mb-1">ইংরেজি কি-ওয়ার্ড:</strong>
                    • Diploma in Islamic Banking question paper<br/>
                    • DIB past question and solution PDF<br/>
                    • IBB Islamic Banking exam guide<br/>
                    • Mudaraba vs Musharaka difference notes
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                    <strong className="text-emerald-900 block mb-1">বাংলা কি-ওয়ার্ড:</strong>
                    • ডিআইবি পরীক্ষার প্রশ্ন ও সমাধান ২০২৪<br/>
                    • ইসলামিক ব্যাংকিং ডিপ্লোমা হ্যান্ডনোট<br/>
                    • ব্যাংক কোম্পানি আইন ১৯৯১ প্রশ্ন উত্তর<br/>
                    • আইবিবি বিগত বছরের প্রশ্ন ব্যাংক
                  </div>
                </div>
              </div>

              {/* Step 4: Facebook & Banker Community Traffic */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[11px]">৪</span>
                  <span>সোশ্যাল সিগন্যাল ও ব্যাকলিংক (Fast Initial Traffic)</span>
                </div>
                <p>
                  ফেসবুকে বাংলাদেশে ব্যাংকারদের ও DIB পরীক্ষার্থীদের বহু বড় বড় গ্রুপ রয়েছে (যেমন: <em>IBB Banking Diploma Study Group</em>, <em>Islamic Bankers Bangladesh</em>)। সেখানে আপনার সাইটের সমাধানকৃত প্রশ্ন ও ইউনিক আর্টিকেলের লিংক শেয়ার করলে সাথে সাথে শত শত ভিজিটর ঢুকবে। প্রাথমিক এই ট্রাফিক গুগলের কাছে সাইটের গ্রহণযোগ্যতা বহুগুণ বাড়িয়ে দ্রুত র‍্যাংক করিয়ে দেয়।
                </p>
              </div>

              {/* Step 5: Google AdSense Approval */}
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                <div className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[11px]">৫</span>
                  <span>গুগল অ্যাডসেন্স (AdSense) অনুমোদন পাওয়ার কৌশল</span>
                </div>
                <p>
                  আপনার সাইটে ইতোমধ্যে অ্যাডসেন্সের সকল আবশ্যকীয় পেজ (About, Contact, Privacy Policy, Terms, Disclaimer) প্রস্তুত রয়েছে। প্রতি সপ্তাহে ১-২টি করে বাংলায় ইসলামী ব্যাংকিংয়ের মৌলিক বিষয়ের উপর মৌলিক আর্টিকেল লিখবেন। ২০-২৫টি ভালো রিসোর্স ও নিয়মিত ট্রাফিক থাকলে সহজেই গুগল অ্যাডসেন্স অনুমোদন পাবেন।
                </p>
              </div>
            </div>
          )}

          {activeTab === 'custom-link' && (
            <div className="space-y-6 font-bengali">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-base mb-1">
                  <Globe className="w-5 h-5 text-emerald-700" />
                  <span>আপনার পছন্দের নামে লিঙ্ক তৈরি করার পূর্ণাঙ্গ নির্দেশিকা</span>
                </div>
                <p className="text-emerald-900 text-xs leading-relaxed">
                  গুগল এআই স্টুডিওর ডিফল্ট লিঙ্ক <code className="bg-emerald-150 text-emerald-950 px-1 py-0.5 rounded font-mono text-[11px]">ais-dev-...run.app</code>-এর পরিবর্তে আপনার পছন্দের নাম <strong>"islamibankingdiploma"</strong> দিয়ে লিঙ্ক পাওয়ার ৩টি সেরা পদ্ধতি নিচে দেওয়া হলো।
                </p>
              </div>

              {/* Method 1: Instant Custom Short URL */}
              <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">১</span>
                    <h4 className="font-bold text-stone-900 text-sm">ইনস্ট্যান্ট ফ্রি কাস্টম শর্ট-লিঙ্ক (১ মিনিটে তৈরি)</h4>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-semibold">ফ্রি ও তাৎক্ষণিক</span>
                </div>
                <p className="text-stone-600 text-xs">
                  TinyURL বা Dub.sh ব্যবহার করে আপনার বর্তমান লাইভ লিঙ্কের জন্য একটি সুন্দর নাম সেট করে নিন:
                </p>
                
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-stone-500 uppercase font-semibold">প্রস্তাবিত শর্ট লিঙ্ক:</div>
                    <div className="font-mono text-sm font-bold text-emerald-800">https://tinyurl.com/IslamiBankingDiploma</div>
                  </div>
                  <a
                    href={`https://tinyurl.com/create.php?url=${encodeURIComponent('https://ais-dev-nmuhcmtnza2esxdb47amfo-365705660922.asia-southeast1.run.app')}&alias=IslamiBankingDiploma`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>TinyURL-এ তৈরি করুন</span>
                  </a>
                </div>
              </div>

              {/* Method 2: Vercel Free Hosting */}
              <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center">২</span>
                    <h4 className="font-bold text-stone-900 text-sm">Vercel-এ আজীবন ফ্রি হোস্টিং (islamibankingdiploma.vercel.app)</h4>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[11px] font-semibold">প্রফেশনাল ও সেরা</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  আমরা ইতোমধ্যে এই প্রজেক্টে <code className="bg-stone-100 px-1 py-0.5 rounded text-blue-700 font-mono">vercel.json</code> এবং <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">_redirects</code> ফাইল কনফিগার করে দিয়েছি। Vercel-এ সাইটটি আপলোড করলে আপনি ফ্রিতে পাবেন:
                </p>

                <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-xs space-y-1.5">
                  <div className="font-mono font-bold text-blue-900">👉 https://islamibankingdiploma.vercel.app</div>
                  <ul className="list-disc list-inside text-stone-600 space-y-1 pt-1">
                    <li>সম্পূর্ণ ফ্রি লাইফটাইম হাই-স্পিড CDN এবং ফ্রি SSL সার্টিফিকেট (https)।</li>
                    <li><strong>কীভাবে করবেন:</strong> আপনার গিটহাব (GitHub) একাউন্টে এই কোডগুলো পুশ করে <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-semibold">Vercel.com</a>-এ লগইন করে "Add New Project" দিন। প্রজেক্টের নাম দিন <code>islamibankingdiploma</code>। মাত্র ১ মিনিটে সাইট লাইভ হয়ে যাবে।</li>
                  </ul>
                </div>
              </div>

              {/* Method 3: Official Custom Domain */}
              <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center">৩</span>
                    <h4 className="font-bold text-stone-900 text-sm">অফিসিয়াল .com / .org ডোমেন (গুগলে এক নম্বর হওয়ার জন্য)</h4>
                  </div>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-[11px] font-semibold">ব্র্যান্ডিং ও ট্রাস্ট</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  আপনি যদি এটিকে বাংলাদেশের এক নম্বর ইসলামী ব্যাংকিং ডিপ্লোমা পোর্টাল বানাতে চান, তবে একটি অফিসিয়াল ডোমেইন কেনা সবচেয়ে ভালো হবে:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="font-bold text-purple-950 font-mono text-sm">islamibankingdiploma.com</div>
                    <div className="text-stone-500 text-[11px] mt-1">সবচেয়ে জনপ্রিয় বৈশ্বিক ডোমেন এক্সটেনশন</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="font-bold text-purple-950 font-mono text-sm">islamibankingdiploma.org</div>
                    <div className="text-stone-500 text-[11px] mt-1">শিক্ষামূলক ও গবেষণামূলক অর্গানাইজেশনের জন্য আদর্শ</div>
                  </div>
                </div>
                <p className="text-stone-500 text-[11px]">
                  💡 <em>Namecheap, DianaHost বা ExonHost থেকে ডোমেন কিনে Vercel বা ক্লাউডফ্লেয়ারে কানেক্ট করা খুবই সহজ। আমরা এর ডিএনএস (DNS) রেকর্ড সেটআপেও আপনাকে সাহায্য করব।</em>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
          <span className="text-stone-500">
            {lang === 'bn' ? 'ওয়ার্ডপ্রেস মাইগ্রেশন সহায়িকা' : 'WordPress Implementation Specification'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors"
          >
            {lang === 'bn' ? 'বুঝেছি / বন্ধ করুন' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
