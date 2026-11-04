import React, { useState, useMemo } from 'react';
import { 
  PdfResource 
} from '../types';
import { 
  auditResourceSeo, 
  auditEntireCatalog, 
  autoOptimizeResource, 
  ResourceSeoAudit,
  DIB_INTENT_PATTERNS
} from '../utils/seoAudit';
import { StorageService } from '../services/storage';
import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Zap, 
  Sparkles, 
  ExternalLink, 
  Eye, 
  Globe, 
  BarChart2, 
  RefreshCw,
  Check,
  Smartphone,
  Monitor
} from 'lucide-react';

interface AdminSeoAuditTabProps {
  resources: PdfResource[];
  onRefreshData: () => void;
  onEditResource: (resource: PdfResource) => void;
  lang: 'bn' | 'en';
}

export const AdminSeoAuditTab: React.FC<AdminSeoAuditTabProps> = ({
  resources,
  onRefreshData,
  onEditResource,
  lang
}) => {
  const [filterRating, setFilterRating] = useState<'ALL' | 'CRITICAL' | 'NEEDS_WORK' | 'OPTIMIZED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [optimizationNotice, setOptimizationNotice] = useState<{ id: string; changes: string[] } | null>(null);
  const [batchSuccessNotice, setBatchSuccessNotice] = useState<string | null>(null);
  const [serpDevice, setSerpDevice] = useState<'mobile' | 'desktop'>('mobile');

  // Compute audits for all resources
  const auditsMap = useMemo(() => {
    const map = new Map<string, ResourceSeoAudit>();
    resources.forEach(r => {
      map.set(r.id, auditResourceSeo(r));
    });
    return map;
  }, [resources]);

  // Overall catalog summary
  const catalogSummary = useMemo(() => {
    return auditEntireCatalog(resources);
  }, [resources]);

  // Filtered resources list
  const filteredList = useMemo(() => {
    return resources.filter(r => {
      const audit = auditsMap.get(r.id);
      if (!audit) return true;

      // Filter rating
      if (filterRating === 'CRITICAL' && !audit.issues.some(i => i.type === 'critical')) return false;
      if (filterRating === 'NEEDS_WORK' && (audit.score >= 85 || audit.issues.some(i => i.type === 'critical'))) return false;
      if (filterRating === 'OPTIMIZED' && audit.score < 85) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q) || r.titleBn.toLowerCase().includes(q);
        const matchesSubject = r.subject.toLowerCase().includes(q);
        return matchesTitle || matchesSubject;
      }

      return true;
    });
  }, [resources, auditsMap, filterRating, searchQuery]);

  // Handle single resource optimization
  const handleOptimizeSingle = async (res: PdfResource) => {
    const { optimized, appliedChanges } = autoOptimizeResource(res);
    const result = await StorageService.saveResourceToSupabase(optimized);
    if (!result.success) {
      alert(`ত্রুটি: ${result.message}`);
      return;
    }
    await onRefreshData();
    setOptimizationNotice({ id: res.id, changes: appliedChanges });
    setTimeout(() => {
      setOptimizationNotice(null);
    }, 4000);
  };

  // Handle batch optimization of entire catalog
  const handleBatchOptimizeAll = async () => {
    if (!confirm(lang === 'bn' 
      ? 'আপনি কি সম্পূর্ণ লাইব্রেরির সকল প্রশ্নপত্র ও রিসোর্সের মেটাডাটা গুগল এসইও অনুযায়ী স্বয়ংক্রিয়ভাবে অপ্টিমাইজ করতে চান?' 
      : 'Auto-optimize metadata for all resources in the catalog for Google search ranking?')) {
      return;
    }

    let optimizedCount = 0;
    for (const res of resources) {
      const { optimized } = autoOptimizeResource(res);
      const result = await StorageService.saveResourceToSupabase(optimized);
      if (result.success) {
        optimizedCount++;
      }
    }

    await onRefreshData();
    setBatchSuccessNotice(
      lang === 'bn'
        ? `সফলভাবে ${optimizedCount}টি রিসোর্সের মেটাডাটা অপ্টিমাইজ এবং সেভ করা হয়েছে!`
        : `Successfully optimized SEO metadata for ${optimizedCount} resources!`
    );
    setTimeout(() => setBatchSuccessNotice(null), 4000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 65) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-red-700 bg-red-50 border-red-300';
  };

  return (
    <div className="space-y-6 font-bengali text-stone-800 text-xs sm:text-sm">
      {/* Top Banner & KPI Summary */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 text-white rounded-2xl p-6 border border-emerald-900 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-800/80 text-emerald-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{lang === 'bn' ? 'স্বয়ংক্রিয় গুগল এসইও অডিট ও অপ্টিমাইজার' : 'Automated DIB Search Intent Engine'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {lang === 'bn' 
                ? 'ডিআইবি ও আইবিবি পরীক্ষার গুগল সার্চ র‍্যাংকিং অডিট' 
                : 'Bangladesh DIB Exam SEO Audit & Optimization'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1 leading-relaxed">
              {lang === 'bn'
                ? 'বাংলাদেশের ব্যাংকিং পরীক্ষার্থীদের সার্চ প্যাটার্ন (বিগত সাল, সমাধান, মুদারাবা, IBB, DIB Part 1/2) অনুযায়ী প্রতিটি নথির টাইটেল, মেটা ডেসক্রিপশন এবং কি-ওয়ার্ড ডেনসিটি বিশ্লেষণ করে সর্বোচ্চ র‍্যাংকিং নিশ্চিত করুন।'
                : 'Scans your PDF catalog against authentic high-volume search intent keywords used by banking diploma candidates in Bangladesh.'}
            </p>
          </div>

          {/* Action: Batch Optimize */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleBatchOptimizeAll}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-xs sm:text-sm"
            >
              <Zap className="w-4 h-4 text-emerald-100 fill-current" />
              <span>{lang === 'bn' ? '১-ক্লিকে সকল রিসোর্স অপ্টিমাইজ করুন' : '1-Click Auto-Optimize All'}</span>
            </button>
          </div>
        </div>

        {/* Catalog Health KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-stone-800 text-xs">
          <div className="bg-stone-800/70 p-3 rounded-xl border border-stone-700/80">
            <span className="text-stone-400 block mb-0.5">
              {lang === 'bn' ? 'গড় এসইও স্কোর' : 'Catalog SEO Score'}
            </span>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="tabular-nums">{catalogSummary.overallScore}</span>
              <span className="text-xs text-stone-400 font-normal">/ 100</span>
            </div>
          </div>

          <div className="bg-stone-800/70 p-3 rounded-xl border border-stone-700/80">
            <span className="text-stone-400 block mb-0.5">
              {lang === 'bn' ? 'জরুরি সংশোধনী (Critical)' : 'Critical Action Needed'}
            </span>
            <div className="text-2xl font-bold text-red-400 tabular-nums">
              {catalogSummary.criticalCount}
            </div>
          </div>

          <div className="bg-stone-800/70 p-3 rounded-xl border border-stone-700/80">
            <span className="text-stone-400 block mb-0.5">
              {lang === 'bn' ? 'উন্নতি প্রয়োজন (Warnings)' : 'Moderate Warnings'}
            </span>
            <div className="text-2xl font-bold text-amber-400 tabular-nums">
              {catalogSummary.warningCount}
            </div>
          </div>

          <div className="bg-stone-800/70 p-3 rounded-xl border border-stone-700/80">
            <span className="text-stone-400 block mb-0.5">
              {lang === 'bn' ? 'পূর্ণ অপ্টিমাইজড (Good/Top)' : 'Fully Optimized'}
            </span>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">
              {catalogSummary.optimizedCount} <span className="text-xs text-stone-400">/ {catalogSummary.totalAudited}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notice messages */}
      {batchSuccessNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{batchSuccessNotice}</span>
        </div>
      )}

      {optimizationNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl space-y-1 text-xs">
          <div className="font-bold flex items-center gap-1.5 text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'bn' ? 'রিসোর্সটি সফলভাবে অপ্টিমাইজ করা হয়েছে:' : 'Resource metadata auto-optimized:'}</span>
          </div>
          <ul className="list-disc pl-5 text-emerald-800 space-y-0.5">
            {optimizationNotice.changes.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setFilterRating('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
              filterRating === 'ALL' ? 'bg-emerald-800 text-white' : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
            }`}
          >
            {lang === 'bn' ? `সকল রিসোর্স (${resources.length})` : `All (${resources.length})`}
          </button>
          <button
            onClick={() => setFilterRating('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
              filterRating === 'CRITICAL' ? 'bg-red-700 text-white' : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
            }`}
          >
            {lang === 'bn' ? `জরুরি সমস্যা (${catalogSummary.criticalCount})` : `Critical (${catalogSummary.criticalCount})`}
          </button>
          <button
            onClick={() => setFilterRating('NEEDS_WORK')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
              filterRating === 'NEEDS_WORK' ? 'bg-amber-600 text-white' : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
            }`}
          >
            {lang === 'bn' ? `উন্নতি প্রয়োজন (${catalogSummary.warningCount})` : `Warnings (${catalogSummary.warningCount})`}
          </button>
          <button
            onClick={() => setFilterRating('OPTIMIZED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
              filterRating === 'OPTIMIZED' ? 'bg-emerald-700 text-white' : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
            }`}
          >
            {lang === 'bn' ? `শীর্ষ অপ্টিমাইজড (${catalogSummary.optimizedCount})` : `Optimized (${catalogSummary.optimizedCount})`}
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'রিসোর্স খুঁজুন...' : 'Search resources...'}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-emerald-800"
          />
        </div>
      </div>

      {/* Resources Audit List */}
      <div className="space-y-4">
        {filteredList.map((res) => {
          const audit = auditsMap.get(res.id) || auditResourceSeo(res);
          const isSelected = selectedResourceId === res.id;

          return (
            <div 
              key={res.id}
              className={`rounded-xl border transition-all ${
                isSelected 
                  ? 'border-emerald-600 bg-white shadow-md' 
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-emerald-800">
                      {res.course} · {res.examYear}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs text-stone-500 font-medium">
                      {res.subject}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                    {res.titleBn || res.title}
                  </h4>
                  <div className="text-xs text-stone-500 italic truncate">
                    {res.title}
                  </div>
                </div>

                {/* Score & Action Pill */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 ${getScoreColor(audit.score)}`}>
                    <span className="text-base tabular-nums">{audit.score}</span>
                    <span className="text-[11px] font-medium opacity-80">
                      ({lang === 'bn' ? audit.ratingBn : audit.rating})
                    </span>
                  </div>

                  <button
                    onClick={() => handleOptimizeSingle(res)}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                    title="Run one-click auto optimization"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-300 fill-current" />
                    <span>{lang === 'bn' ? 'অটো ফিক্স' : 'Auto Fix'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedResourceId(isSelected ? null : res.id)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {isSelected ? (lang === 'bn' ? 'সংক্ষেপ করুন' : 'Collapse') : (lang === 'bn' ? 'অডিট দেখুন' : 'Audit Details')}
                  </button>
                </div>
              </div>

              {/* Expanded Detailed Audit Panel */}
              {isSelected && (
                <div className="border-t border-stone-200 bg-stone-50/70 p-5 space-y-6">
                  {/* 1. Google SERP Simulator */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>Google Search Result Snippet Preview</span>
                      </span>
                      <div className="flex items-center gap-1 bg-stone-200 p-0.5 rounded-lg text-[11px]">
                        <button
                          onClick={() => setSerpDevice('mobile')}
                          className={`px-2 py-0.5 rounded flex items-center gap-1 ${serpDevice === 'mobile' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'}`}
                        >
                          <Smartphone className="w-3 h-3" />
                          <span>Mobile</span>
                        </button>
                        <button
                          onClick={() => setSerpDevice('desktop')}
                          className={`px-2 py-0.5 rounded flex items-center gap-1 ${serpDevice === 'desktop' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'}`}
                        >
                          <Monitor className="w-3 h-3" />
                          <span>Desktop</span>
                        </button>
                      </div>
                    </div>

                    <div className={`p-4 bg-white rounded-xl border border-stone-200 shadow-xs ${serpDevice === 'mobile' ? 'max-w-md' : 'max-w-2xl'}`}>
                      <div className="text-[11px] text-stone-500 mb-0.5 flex items-center gap-1.5 truncate">
                        <div className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px] font-bold">IK</div>
                        <span className="truncate">{audit.serpPreview.displayUrl}</span>
                      </div>
                      <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer leading-snug mb-1">
                        {audit.serpPreview.title}
                      </div>
                      <div className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                        {audit.serpPreview.snippet}
                      </div>
                    </div>
                  </div>

                  {/* 2. Detected Issues & Recommendations */}
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-emerald-800" />
                      <span>{lang === 'bn' ? 'চিহ্নিত এসইও ত্রুটি ও সমাধানের পরামর্শ' : 'Audit Findings & Actionable Recommendations'}</span>
                    </h5>

                    {audit.issues.length > 0 ? (
                      <div className="space-y-2">
                        {audit.issues.map((issue) => (
                          <div 
                            key={issue.id} 
                            className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                              issue.type === 'critical' 
                                ? 'bg-red-50 border-red-200 text-red-900' 
                                : issue.type === 'warning' 
                                ? 'bg-amber-50 border-amber-200 text-amber-900' 
                                : 'bg-blue-50 border-blue-200 text-blue-900'
                            }`}
                          >
                            {issue.type === 'critical' ? (
                              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1">
                              <div className="font-bold">
                                {lang === 'bn' ? issue.messageBn : issue.messageEn}
                              </div>
                              <div className="opacity-90">
                                <strong>{lang === 'bn' ? 'পরামর্শ:' : 'Recommendation:'}</strong>{' '}
                                {lang === 'bn' ? issue.recommendationBn : issue.recommendationEn}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg flex items-center gap-2 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>{lang === 'bn' ? 'কোনো এসইও ত্রুটি পাওয়া যায়নি! নথিটি গুগল সার্চের জন্য পুরোপুরি অপ্টিমাইজড।' : 'No SEO issues found! Metadata perfectly matches search intent.'}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Search Intent Keyword Coverage Matrix */}
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wide mb-2">
                      {lang === 'bn' ? 'ডিআইবি সার্চ ইনটেন্ট কি-ওয়ার্ড কাভারেজ ম্যাট্রিক্স' : 'DIB Search Intent Keyword Coverage Matrix'}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                      {audit.keywordCoverage.map((kw, i) => (
                        <div 
                          key={i} 
                          className={`p-2.5 rounded-lg border ${
                            kw.isMissing 
                              ? 'bg-stone-100/80 border-stone-300 text-stone-500' 
                              : 'bg-white border-emerald-200 text-emerald-950 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-stone-800">
                              {lang === 'bn' ? kw.intentTypeBn : kw.intentType}
                            </span>
                            {kw.isMissing ? (
                              <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.2 rounded">
                                {lang === 'bn' ? 'অনুপস্থিত' : 'Missing'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                                ✓ {lang === 'bn' ? 'যুক্ত' : 'Covered'}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-600 truncate">
                            {kw.matchedKeywords.length > 0 
                              ? kw.matchedKeywords.join(', ') 
                              : (lang === 'bn' ? 'কোনো কি-ওয়ার্ড নেই' : 'No target matches')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditResource(res)}
                      className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {lang === 'bn' ? 'ম্যানুয়াল এডিট করুন' : 'Manual Edit'}
                    </button>
                    <button
                      onClick={() => handleOptimizeSingle(res)}
                      className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-300 fill-current" />
                      <span>{lang === 'bn' ? '১-ক্লিকে অটো ফিক্স প্রয়োগ করুন' : 'Apply Auto-Optimization'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
