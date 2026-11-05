import React, { useState, useEffect, useMemo } from 'react';
import { updateSEOMetadata } from '../utils/seo';
import { Calculator, RotateCcw, Scale, Info } from 'lucide-react';
import { SiteSettings } from '../types';
import { StorageService } from '../services/storage';

interface ZakatCalculatorProps {
  lang?: 'bn' | 'en';
  onNavigateUrl?: (path: string) => void;
  settings?: SiteSettings;
}

// Weight Conversion: 1 Bhori (Tola) = 11.664 Grams
const BHORI_TO_GRAM = 11.664;
const REVIEW_DATE = '০৪/১১/২০২৬';

const formatBnNumber = (val: number): string => {
  const rounded = Math.round(val);
  try {
    return new Intl.NumberFormat('bn-BD').format(rounded);
  } catch {
    const en = rounded.toLocaleString('en-IN');
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return en.replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
  }
};

export const ZakatCalculator: React.FC<ZakatCalculatorProps> = ({
  onNavigateUrl,
  settings: initialPropSettings
}) => {
  // Update SEO Metadata on Mount
  useEffect(() => {
    updateSEOMetadata({
      title: 'যাকাত ক্যালকুলেটর (Zakat Calculator) | ইসলামী ব্যাংকিং ডিপ্লোমা',
      description: 'আপনার সম্পদের পরিমাণ লিখে নিসাব অনুযায়ী যাকাতের আনুমানিক হিসাব জানুন। নিসাবের টাকার মূল্য এবং স্বর্ণ-রৌপ্যের বাজারদর অনুযায়ী স্বয়ংক্রিয় হিসাব।',
      canonicalPath: '/zakat-calculator'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Database-driven Nisab & Metal Rate Settings
  const [nisabAmount, setNisabAmount] = useState<number>(() => initialPropSettings?.nisab_amount_bdt || 173250);
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>(() => initialPropSettings?.last_updated_date || '০৪/১১/২০২৬');
  const [goldRate, setGoldRate] = useState<number>(() => initialPropSettings?.gold_rate_22k_per_gram || 11500);
  const [silverRate, setSilverRate] = useState<number>(() => initialPropSettings?.silver_rate_per_gram || 282.85);

  // Fetch latest settings from database (app_settings / site_settings)
  useEffect(() => {
    let isMounted = true;
    StorageService.getAppSettings()
      .then((data) => {
        if (isMounted && data) {
          if (data.nisab_amount_bdt) setNisabAmount(data.nisab_amount_bdt);
          if (data.last_updated_date) setLastUpdatedDate(data.last_updated_date);
          if (data.gold_rate_22k_per_gram) setGoldRate(data.gold_rate_22k_per_gram);
          if (data.silver_rate_per_gram) setSilverRate(data.silver_rate_per_gram);
        }
      })
      .catch((err) => {
        console.warn('Error fetching app settings for Zakat Calculator:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Inputs state
  const [cash, setCash] = useState<number>(0);
  const [goldWeight, setGoldWeight] = useState<number>(0);
  const [goldUnit, setGoldUnit] = useState<'bhori' | 'gram'>('bhori');
  const [silverWeight, setSilverWeight] = useState<number>(0);
  const [silverUnit, setSilverUnit] = useState<'bhori' | 'gram'>('bhori');
  const [businessGoods, setBusinessGoods] = useState<number>(0);
  const [investments, setInvestments] = useState<number>(0);
  const [otherAssets, setOtherAssets] = useState<number>(0);
  const [debts, setDebts] = useState<number>(0);

  // Task 3: Automatic Gold & Silver Value Calculations
  const totalGoldGrams = useMemo(() => {
    if (!goldWeight || goldWeight <= 0) return 0;
    return goldUnit === 'bhori' ? goldWeight * BHORI_TO_GRAM : goldWeight;
  }, [goldWeight, goldUnit]);

  const totalGoldValue = useMemo(() => {
    return Math.round(totalGoldGrams * (goldRate || 0));
  }, [totalGoldGrams, goldRate]);

  const totalSilverGrams = useMemo(() => {
    if (!silverWeight || silverWeight <= 0) return 0;
    return silverUnit === 'bhori' ? silverWeight * BHORI_TO_GRAM : silverWeight;
  }, [silverWeight, silverUnit]);

  const totalSilverValue = useMemo(() => {
    return Math.round(totalSilverGrams * (silverRate || 0));
  }, [totalSilverGrams, silverRate]);

  // Total Assets (মোট সম্পদ) includes auto-calculated Gold and Silver values
  const totalAssets = useMemo(() => {
    return (cash || 0) + totalGoldValue + totalSilverValue + (businessGoods || 0) + (investments || 0) + (otherAssets || 0);
  }, [cash, totalGoldValue, totalSilverValue, businessGoods, investments, otherAssets]);

  // Net Wealth (নিট সম্পদ) after deducting immediate payable debts
  const netWealth = useMemo(() => {
    return Math.max(0, totalAssets - (debts || 0));
  }, [totalAssets, debts]);

  // Zakat threshold comparison against Admin-configured Nisab amount
  const isNisabReached = netWealth >= nisabAmount;
  const zakatAmount = isNisabReached ? netWealth * 0.025 : 0;

  const handleReset = () => {
    setCash(0);
    setGoldWeight(0);
    setGoldUnit('bhori');
    setSilverWeight(0);
    setSilverUnit('bhori');
    setBusinessGoods(0);
    setInvestments(0);
    setOtherAssets(0);
    setDebts(0);
  };

  const handleNavHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateUrl) {
      onNavigateUrl('/');
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-bengali">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-stone-500">
        <a 
          href="/" 
          onClick={handleNavHome}
          className="hover:text-emerald-800 transition-colors"
        >
          হোম
        </a>
        <span>/</span>
        <span className="text-stone-800 font-medium">যাকাত ক্যালকুলেটর</span>
      </nav>

      {/* Title Header */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#14532D] mb-3">
          <Calculator className="w-3.5 h-3.5 text-[#047857]" />
          <span>ইসলামিক আর্থিক অনুশাসন ও যাকাত হিসাব</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
          যাকাত ক্যালকুলেটর
        </h1>
      </div>

      {/* Task 2: Specific Nisab Banner UI (Light Green Rounded Box, Center-Aligned) */}
      <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl p-6 sm:p-8 text-center shadow-xs mb-4">
        {/* Top Text: "যাকাতের নিসাব" (Medium font, dark green) */}
        <p className="text-sm sm:text-base font-medium text-[#065f46] mb-1">
          যাকাতের নিসাব
        </p>

        {/* Middle Text: The BDT amount in Bengali numerals in very large bold green font with small info icon */}
        <div className="flex items-center justify-center gap-2 my-2 sm:my-3">
          <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#047857] tracking-tight">
            ৳ {formatBnNumber(nisabAmount)}
          </span>
          <div className="relative group inline-block">
            <Info 
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#059669] hover:text-[#047857] cursor-pointer transition-colors" 
              aria-label="নিসাব সংক্রান্ত তথ্য"
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 sm:w-72 p-3 bg-stone-900 text-white text-[11px] rounded-xl shadow-xl z-20 text-center font-normal leading-relaxed">
              রৌপ্যের নিসাব (৫২.৫ ভরি বা ৬১২.৩৬ গ্রাম) অনুযায়ী বর্তমান বাজারমূল্যের সমপরিমাণ নগদ সম্পদ।
              <div className="w-2 h-2 bg-stone-900 rotate-45 mx-auto -mb-1 mt-1"></div>
            </div>
          </div>
        </div>

        {/* Bottom Text: "সর্বশেষ হালনাগাদ [last_updated_date]" with an underline, in a smaller font */}
        <p className="text-xs sm:text-sm text-[#047857]">
          <span className="underline decoration-[#34d399] underline-offset-4">
            সর্বশেষ হালনাগাদ {lastUpdatedDate}
          </span>
        </p>
      </div>

      {/* Task 2: Instructional text below the banner (Verbatim) */}
      <div className="bg-stone-50 border border-stone-200/90 rounded-xl p-4 sm:p-5 text-xs sm:text-sm text-stone-700 leading-relaxed mb-8">
        যে সকল সম্পদ আপনার নেই এবং যে সকল প্রশ্ন আপনার ক্ষেত্রে প্রযোজ্য হবে না সেগুলো পূরণ করার প্রয়োজন নেই, অর্থাৎ সেগুলো সম্পূর্ণ খালি রাখবেন। আপনার যদি নগদ অর্থ বা ব্যবসা পণ্য না থাকে, শুধু স্বর্ণ অথবা শুধু রূপা থাকে—তাহলে আপনার জন্য এই ক্যালকুলেটর প্রয়োজনীয় নয়। শুধু স্বর্ণের ক্ষেত্রে ৭.৫ ভরি এবং শুধু রূপার ক্ষেত্রে ৫২.৫ ভরি থাকলে যাকাত ফরজ হবে।
      </div>

      {/* 3. Calculator Input Section */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-7 mb-12">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
          <div className="flex items-center gap-2 text-[#14532D] font-bold text-base sm:text-lg">
            <Scale className="w-5 h-5 text-[#047857]" />
            <span>সম্পদ ও ঋণের তথ্য প্রদান করুন</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-red-700 hover:bg-red-50 border border-stone-200 hover:border-red-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট করুন</span>
          </button>
        </div>

        {/* Admin Rate Summary Badge */}
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>অ্যাডমিন নির্ধারিত বর্তমান বাজারদর:</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-900 font-medium">
            <span>২২ ক্যারেট স্বর্ণ: <strong>৳ {formatBnNumber(goldRate)}</strong> / গ্রাম</span>
            <span>•</span>
            <span>রৌপ্য: <strong>৳ {formatBnNumber(silverRate)}</strong> / গ্রাম</span>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Section: নগদ অর্থ, স্বর্ণ ও রৌপ্যের ওজন */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              ১. নগদ অর্থ, স্বর্ণ ও রৌপ্য (ওজন ভিত্তিক)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Cash & Bank Deposit */}
              <div>
                <label 
                  htmlFor="input-cash"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  নগদ ও ব্যাংক জমা (টাকা)
                </label>
                <input
                  id="input-cash"
                  type="number"
                  min="0"
                  step="any"
                  value={cash === 0 ? '' : cash}
                  placeholder="0"
                  onChange={(e) => setCash(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  হাতে থাকা নগদ, সেভিংস ও কারেন্ট ব্যাংক ব্যালেন্স
                </span>
              </div>

              {/* Task 3: Gold Weight Input with Unit Dropdown/Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label 
                    htmlFor="input-gold-weight"
                    className="block text-xs font-semibold text-stone-800"
                  >
                    স্বর্ণের ওজন (Gold Weight)
                  </label>
                </div>
                <div className="flex rounded-lg border border-stone-300 overflow-hidden focus-within:border-[#047857] focus-within:ring-1 focus-within:ring-[#047857]">
                  <input
                    id="input-gold-weight"
                    type="number"
                    min="0"
                    step="any"
                    value={goldWeight === 0 ? '' : goldWeight}
                    placeholder="0"
                    onChange={(e) => setGoldWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="flex-1 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none"
                  />
                  <select
                    value={goldUnit}
                    onChange={(e) => setGoldUnit(e.target.value as 'bhori' | 'gram')}
                    className="bg-stone-100 border-l border-stone-300 px-2.5 py-2 text-xs text-stone-800 font-semibold focus:outline-none cursor-pointer"
                    title="স্বর্ণের একক নির্বাচন করুন"
                  >
                    <option value="bhori">ভরি (Bhori)</option>
                    <option value="gram">গ্রাম (Gram)</option>
                  </select>
                </div>
                {/* Auto-calculated Gold value display */}
                <div className="mt-1 text-[11px] text-stone-600 space-y-0.5">
                  <span className="block text-stone-500">
                    {goldUnit === 'bhori' ? '১ ভরি = ১১.৬৬৪ গ্রাম' : 'গ্রামের ভিত্তিতে হিসাব'}
                  </span>
                  {totalGoldValue > 0 && (
                    <span className="block font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      আনুমানিক মূল্য: ৳ {formatBnNumber(totalGoldValue)} ({totalGoldGrams.toFixed(2)} গ্রাম)
                    </span>
                  )}
                </div>
              </div>

              {/* Task 3: Silver Weight Input with Unit Dropdown/Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label 
                    htmlFor="input-silver-weight"
                    className="block text-xs font-semibold text-stone-800"
                  >
                    রৌপ্যের ওজন (Silver Weight)
                  </label>
                </div>
                <div className="flex rounded-lg border border-stone-300 overflow-hidden focus-within:border-[#047857] focus-within:ring-1 focus-within:ring-[#047857]">
                  <input
                    id="input-silver-weight"
                    type="number"
                    min="0"
                    step="any"
                    value={silverWeight === 0 ? '' : silverWeight}
                    placeholder="0"
                    onChange={(e) => setSilverWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="flex-1 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none"
                  />
                  <select
                    value={silverUnit}
                    onChange={(e) => setSilverUnit(e.target.value as 'bhori' | 'gram')}
                    className="bg-stone-100 border-l border-stone-300 px-2.5 py-2 text-xs text-stone-800 font-semibold focus:outline-none cursor-pointer"
                    title="রৌপ্যের একক নির্বাচন করুন"
                  >
                    <option value="bhori">ভরি (Bhori)</option>
                    <option value="gram">গ্রাম (Gram)</option>
                  </select>
                </div>
                {/* Auto-calculated Silver value display */}
                <div className="mt-1 text-[11px] text-stone-600 space-y-0.5">
                  <span className="block text-stone-500">
                    {silverUnit === 'bhori' ? '১ ভরি = ১১.৬৬৪ গ্রাম' : 'গ্রামের ভিত্তিতে হিসাব'}
                  </span>
                  {totalSilverValue > 0 && (
                    <span className="block font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      আনুমানিক মূল্য: ৳ {formatBnNumber(totalSilverValue)} ({totalSilverGrams.toFixed(2)} গ্রাম)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: ব্যবসা, বিনিয়োগ ও অন্যান্য সম্পদ */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              ২. ব্যবসায়িক পণ্য ও অন্যান্য বিনিয়োগ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label 
                  htmlFor="input-business-goods"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  ব্যবসায়িক পণ্য (টাকা)
                </label>
                <input
                  id="input-business-goods"
                  type="number"
                  min="0"
                  step="any"
                  value={businessGoods === 0 ? '' : businessGoods}
                  placeholder="0"
                  onChange={(e) => setBusinessGoods(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  বিক্রির উদ্দেশ্যে মজুদ পণ্যের ক্রয়মূল্য
                </span>
              </div>

              <div>
                <label 
                  htmlFor="input-investments"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  শেয়ার ও বিনিয়োগ (টাকা)
                </label>
                <input
                  id="input-investments"
                  type="number"
                  min="0"
                  step="any"
                  value={investments === 0 ? '' : investments}
                  placeholder="0"
                  onChange={(e) => setInvestments(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  শেয়ার, ইসলামিক মিউচুয়াল ফান্ড বা সঞ্চয়পত্র
                </span>
              </div>

              <div>
                <label 
                  htmlFor="input-other-assets"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  অন্যান্য যাকাতযোগ্য সম্পদ (টাকা)
                </label>
                <input
                  id="input-other-assets"
                  type="number"
                  min="0"
                  step="any"
                  value={otherAssets === 0 ? '' : otherAssets}
                  placeholder="0"
                  onChange={(e) => setOtherAssets(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  পাওনা টাকা (যা দ্রুত আদায়ের নিশ্চিত আশা আছে)
                </span>
              </div>
            </div>
          </div>

          {/* Section: ঋণ ও দায় */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              ৩. বর্তমানে পরিশোধযোগ্য ঋণ ও দায়
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="input-debts"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  বর্তমানে পরিশোধযোগ্য ঋণ (টাকা)
                </label>
                <input
                  id="input-debts"
                  type="number"
                  min="0"
                  step="any"
                  value={debts === 0 ? '' : debts}
                  placeholder="0"
                  onChange={(e) => setDebts(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  যে ঋণ অবিলম্বে বা এই মাসে পরিশোধ করতে হবে (দীর্ঘমেয়াদি ঋণের শুধু বকেয়া কিস্তি)
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Results Display */}
        <div className="mt-8 pt-6 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              হিসাবের ফলাফল
            </h3>
            <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-200">
              নিসাব মানদণ্ড: ৳ {formatBnNumber(nisabAmount)} (হালনাগাদ: {lastUpdatedDate})
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* 1. মোট সম্পদ */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500 block mb-1 font-medium">
                মোট সম্পদ
              </span>
              <span className="text-lg sm:text-xl font-bold text-stone-900">
                {formatBnNumber(totalAssets)} টাকা
              </span>
              <span className="text-[10px] text-stone-400 block mt-1">
                নগদ + স্বর্ণ + রূপা + পণ্য + বিনিয়োগ
              </span>
            </div>

            {/* 2. নিট সম্পদ */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500 block mb-1 font-medium">
                নিট সম্পদ
              </span>
              <span className="text-lg sm:text-xl font-bold text-stone-900">
                {formatBnNumber(netWealth)} টাকা
              </span>
              <span className="text-[10px] text-stone-400 block mt-1">
                মোট সম্পদ বিয়োগ পরিশোধযোগ্য ঋণ
              </span>
            </div>

            {/* 3. নিসাবের মূল্য */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500 block mb-1 font-medium">
                নিসাবের মূল্য
              </span>
              <div className="text-lg sm:text-xl font-bold text-stone-900">
                {formatBnNumber(nisabAmount)} টাকা
              </div>
              <span className="text-[10px] text-stone-500 block mt-1">
                রৌপ্যের নিসাব (৫২.৫ ভরি বা ৬১২.৩৬ গ্রাম)
              </span>
            </div>

            {/* 4. যাকাতের পরিমাণ */}
            <div className={`p-4 rounded-xl border ${
              isNisabReached 
                ? 'bg-emerald-50 border-emerald-300 text-[#14532D]' 
                : 'bg-stone-50 border-stone-200 text-stone-900'
            }`}>
              <span className="text-xs text-stone-500 block mb-1 font-medium">
                যাকাতের পরিমাণ
              </span>
              <div className="text-lg sm:text-xl font-bold">
                {isNisabReached && zakatAmount > 0 ? (
                  <span className="text-[#047857]">{formatBnNumber(zakatAmount)} টাকা</span>
                ) : (
                  <div className="space-y-0.5">
                    <span className="block text-stone-700">০ টাকা</span>
                    <span className="text-xs font-semibold text-amber-700 block">নিসাব পূর্ণ হয়নি</span>
                  </div>
                )}
              </div>
              {isNisabReached && (
                <span className="text-[10px] text-emerald-800 block mt-1">
                  নিট সম্পদের ২.৫% (১/৪০ অংশ)
                </span>
              )}
            </div>
          </div>

          <div className="text-xs text-stone-600 bg-stone-50 border border-stone-200/80 rounded-lg p-3">
            <span>
              বর্তমান নিসাব মানদণ্ড ৳ {formatBnNumber(nisabAmount)} এবং স্বর্ণের দর প্রতি গ্রাম ৳ {formatBnNumber(goldRate)}, রৌপ্যের দর প্রতি গ্রাম ৳ {formatBnNumber(silverRate)} অনুযায়ী এই হিসাব করা হয়েছে।
            </span>
          </div>
        </div>
      </div>

      {/* 4. Scholarly Explanation Section */}
      <section className="space-y-8 mb-12">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-2">
            নিসাব কী?
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            নিসাব হলো সেই নির্দিষ্ট পরিমাণ সম্পদ, যা একজন মুসলিমের কাছে থাকলে তার উপর যাকাত ফরজ হয়। এটি স্বর্ণ বা রৌপ্যের ওজনের ভিত্তিতে ধরা হয়। স্বর্ণের নিসাব প্রায় ৭.৫ ভরি (৮৭.৪৮ গ্রাম) এবং রৌপ্যের নিসাব প্রায় ৫২.৫ ভরি (৬১২.৩৬ গ্রাম)। নগদ টাকা, ব্যাংকে গচ্ছিত অর্থ এবং ব্যবসায়িক পণ্যের ক্ষেত্রে আলেমগণের বৃহত্তর ঐকমত্য অনুযায়ী রৌপ্যের নিসাব অনুসরণ করা হয়, যাতে দরিদ্র ও অভাবী মানুষদের সর্বাধিক কল্যাণ নিশ্চিত হয়।
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-2">
            যাকাতের হার কত?
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            সাধারণত নিট সম্পদের ২.৫ শতাংশ (চল্লিশ ভাগের এক ভাগ বা ২.৫%) যাকাত হিসেবে প্রদান করতে হয়। এটি তখনই প্রযোজ্য, যখন সম্পদ নিসাব পরিমাণ থাকে এবং এক চান্দ্র বছর (হাওল) ব্যক্তির মালিকানায় অতিবাহিত হয়।
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-2">
            কোন সম্পদের যাকাত দিতে হয়?
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            সাধারণত নগদ টাকা, ব্যাংকে জমা, বিক্রির জন্য রাখা ব্যবসায়িক পণ্য, এমন বিনিয়োগ যা বিক্রি করলে নগদ হবে, এবং জমানো স্বর্ণ ও রৌপ্য যাকাতযোগ্য সম্পদ হিসেবে গণ্য হয়। ব্যক্তিগত ব্যবহারের বাড়ি, গাড়ি, আসবাব ও পোশাককে সাধারণত যাকাতযোগ্য ধরা হয় না।
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-2">
            কাদের উপর যাকাত ফরজ?
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            যে মুসলিম প্রাপ্তবয়স্ক ও সুস্থমস্তিষ্কসম্পন্ন, এবং যার মালিকানায় নিসাব পরিমাণ অতিরিক্ত সম্পদ এক চান্দ্র বছর থাকে, তার উপর যাকাত ফরজ হয়। সম্পদ তার সম্পূর্ণ মালিকানায় থাকতে হবে এবং তার ও তার পরিবারের মৌলিক প্রয়োজনের অতিরিক্ত হতে হবে।
          </p>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="space-y-6 mb-10 pt-6 border-t border-stone-200">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6">
          সাধারণ প্রশ্নোত্তর
        </h2>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
          <h3 className="text-base font-bold text-stone-900">
            নিসাব না পৌঁছালে কী করতে হবে?
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed">
            নিট সম্পদ নিসাবের চেয়ে কম হলে যাকাত ফরজ হয় না। তবে সম্পদ বাড়লে বা নিসাব পরিমাণ হলে নতুন করে হিসাব করতে হবে। নফল সাদাকা যেকোনো সময় দেওয়া যায়।
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
          <h3 className="text-base font-bold text-stone-900">
            ঋণ কি সম্পদ থেকে বিয়োগ হবে?
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed">
            সাধারণত এখনই পরিশোধযোগ্য ঋণ মোট সম্পদ থেকে বিয়োগ করে নিট সম্পদ ধরা হয়। এই ক্যালকুলেটরে "বর্তমানে পরিশোধযোগ্য ঋণ" বিয়োগ করা হয়।
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
          <h3 className="text-base font-bold text-stone-900">
            ব্যবহারের জন্য রাখা অলংকারের যাকাত লাগবে কিনা?
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed">
            এ বিষয়ে ফুকাহায়ে কেরামের মধ্যে মতভেদ আছে। হানাফী মাজহাব মতে অতিরিক্ত বা অলংকার হিসেবে রাখা স্বর্ণ-রৌপ্য নিসাব পরিমাণ হলে যাকাত প্রযোজ্য।
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
          <h3 className="text-base font-bold text-stone-900">
            স্বর্ণ ও রৌপ্য দুটোই থাকলে কীভাবে হিসাব হবে?
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed">
            স্বর্ণ ও রৌপ্যের মোট মূল্য যোগ করে নিট সম্পদের সঙ্গে ধরা হয় এবং রৌপ্যের নিসাবের সমমূল্যের সাথে সমন্বয় করা হয়।
          </p>
        </div>
      </section>

      {/* 6. Final note */}
      <p className="text-sm text-stone-600 bg-stone-50 border border-stone-200/90 rounded-xl p-4 leading-relaxed mb-4">
        এই হিসাব একটি সাধারণ নির্দেশিকা। জটিল ক্ষেত্রে স্থানীয় বিজ্ঞ মুফতি বা আলেমের পরামর্শ নিন।
      </p>

      {/* 7. Review line */}
      {REVIEW_DATE && (
        <p className="text-xs font-medium text-stone-500 pt-2 border-t border-stone-200">
          এই তথ্য আলেম ও শরীয়াহ গবেষক কর্তৃক নিয়মিত যাচাইকৃত: {REVIEW_DATE}
        </p>
      )}
    </div>
  );
};
