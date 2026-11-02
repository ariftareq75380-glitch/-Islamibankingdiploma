// These weights must be verified by a qualified scholar before publishing.
const NISAB_GOLD_GRAMS = 87.48;
const NISAB_SILVER_GRAMS = 612.36;

const DEFAULT_NISAB_BASIS: 'silver' | 'gold' = 'silver';
const REVIEW_DATE = "০১/১১/২০২৬";

import React, { useState, useEffect, useMemo } from 'react';
import { updateSEOMetadata } from '../utils/seo';
import { Calculator, ArrowRight, RotateCcw, Scale } from 'lucide-react';

interface ZakatCalculatorProps {
  lang?: 'bn' | 'en';
  onNavigateUrl?: (path: string) => void;
}

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
  onNavigateUrl
}) => {
  // Update SEO Metadata on Mount
  useEffect(() => {
    updateSEOMetadata({
      title: 'যাকাত ক্যালকুলেটর (Zakat Calculator) | ইসলামী ব্যাংকিং ডিপ্লোমা',
      description: 'আপনার সম্পদের পরিমাণ লিখে নিসাব অনুযায়ী যাকাতের আনুমানিক হিসাব জানুন। নিসাবের টাকার মূল্য আপনার দেওয়া দামের ভিত্তিতে হিসাব হয়।',
      canonicalPath: '/zakat-calculator'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Nisab basis selection (default: silver)
  const [nisabBasis, setNisabBasis] = useState<'silver' | 'gold'>(DEFAULT_NISAB_BASIS);

  // Inputs state - all non-negative numbers, default 0
  const [cash, setCash] = useState<number>(0);
  const [goldGrams, setGoldGrams] = useState<number>(0);
  const [silverGrams, setSilverGrams] = useState<number>(0);
  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [silverPrice, setSilverPrice] = useState<number>(0);
  const [businessGoods, setBusinessGoods] = useState<number>(0);
  const [investments, setInvestments] = useState<number>(0);
  const [otherAssets, setOtherAssets] = useState<number>(0);
  const [debts, setDebts] = useState<number>(0);
  const [priceDate, setPriceDate] = useState<string>('');

  // Calculations
  const goldValue = useMemo(() => {
    return (goldGrams || 0) * (goldPrice || 0);
  }, [goldGrams, goldPrice]);

  const silverValue = useMemo(() => {
    return (silverGrams || 0) * (silverPrice || 0);
  }, [silverGrams, silverPrice]);

  const totalAssets = useMemo(() => {
    return (cash || 0) + goldValue + silverValue + (businessGoods || 0) + (investments || 0) + (otherAssets || 0);
  }, [cash, goldValue, silverValue, businessGoods, investments, otherAssets]);

  const netWealth = useMemo(() => {
    return Math.max(0, totalAssets - (debts || 0));
  }, [totalAssets, debts]);

  // Selected basis unit price
  const basisPrice = nisabBasis === 'silver' ? silverPrice : goldPrice;
  const hasBasisPrice = basisPrice > 0;

  // Nisab value in Taka
  const nisabValue = useMemo(() => {
    if (!hasBasisPrice) return null;
    return nisabBasis === 'silver' 
      ? NISAB_SILVER_GRAMS * silverPrice 
      : NISAB_GOLD_GRAMS * goldPrice;
  }, [hasBasisPrice, nisabBasis, silverPrice, goldPrice]);

  // Zakat amount
  const { zakatAmount, isNisabReached } = useMemo(() => {
    if (!hasBasisPrice || nisabValue === null) {
      return { zakatAmount: null, isNisabReached: false };
    }
    if (netWealth >= nisabValue) {
      return { zakatAmount: netWealth * 0.025, isNisabReached: true };
    }
    return { zakatAmount: 0, isNisabReached: false };
  }, [hasBasisPrice, nisabValue, netWealth]);

  const handleReset = () => {
    setCash(0);
    setGoldGrams(0);
    setSilverGrams(0);
    setGoldPrice(0);
    setSilverPrice(0);
    setBusinessGoods(0);
    setInvestments(0);
    setOtherAssets(0);
    setDebts(0);
    setPriceDate('');
    setNisabBasis(DEFAULT_NISAB_BASIS);
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

      {/* 1. H1: যাকাত ক্যালকুলেটর */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#14532D] mb-3">
          <Calculator className="w-3.5 h-3.5 text-[#047857]" />
          <span>ইসলামিক আর্থিক অনুশাসন ও যাকাত হিসাব</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
          যাকাত ক্যালকুলেটর
        </h1>
      </div>

      {/* 2. Intro paragraph (verbatim) */}
      <p className="text-sm sm:text-base text-stone-700 leading-relaxed mb-8 bg-stone-50 border border-stone-200 p-4 rounded-xl">
        এই ক্যালকুলেটরটি আপনার সম্পদের হিসাব অনুযায়ী যাকাতের আনুমানিক পরিমাণ দেখাতে সাহায্য করে। এটি একটি সাধারণ নির্দেশিকা। জটিল বা ব্যক্তিগত ক্ষেত্রে স্থানীয় আলেমের পরামর্শ নিন।
      </p>

      {/* 3. Calculator Section (Tasks 4 to 6) */}
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

        {/* Task 5: Nisab Basis Selector */}
        <div className="mb-6 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
          <label 
            htmlFor="input-nisab-basis"
            className="block text-xs sm:text-sm font-bold text-[#14532D] mb-1.5"
          >
            নিসাবের ভিত্তি নির্বাচন করুন
          </label>
          <select
            id="input-nisab-basis"
            value={nisabBasis}
            onChange={(e) => setNisabBasis(e.target.value as 'silver' | 'gold')}
            className="w-full bg-white border border-emerald-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#047857]"
          >
            <option value="silver">রৌপ্যের নিসাব (৬১২.৩৬ গ্রাম রৌপ্য)</option>
            <option value="gold">স্বর্ণের নিসাব (৮৭.৪৮ গ্রাম স্বর্ণ)</option>
          </select>
          <p className="text-[11px] text-stone-500 mt-1.5">
            অধিকাংশ আলেমের মতে সাধারণ সম্পদ ও নগদ টাকার ক্ষেত্রে দরিদ্রদের কল্যাণে রৌপ্যের নিসাব অনুসরণ করা অধিক নিরাপদ।
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Section: বাজারদর ও তারিখ */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              ১. বাজারদর ও হিসাবের তারিখ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label 
                  htmlFor="input-gold-price"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  স্বর্ণের দাম প্রতি গ্রাম (টাকা)
                </label>
                <input
                  id="input-gold-price"
                  type="number"
                  min="0"
                  step="any"
                  value={goldPrice === 0 ? '' : goldPrice}
                  placeholder="0"
                  onChange={(e) => setGoldPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                />
              </div>

              <div>
                <label 
                  htmlFor="input-silver-price"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  রৌপ্যের দাম প্রতি গ্রাম (টাকা)
                </label>
                <input
                  id="input-silver-price"
                  type="number"
                  min="0"
                  step="any"
                  value={silverPrice === 0 ? '' : silverPrice}
                  placeholder="0"
                  onChange={(e) => setSilverPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                />
              </div>

              <div>
                <label 
                  htmlFor="input-price-date"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  হিসাবের দামের তারিখ
                </label>
                <input
                  id="input-price-date"
                  type="date"
                  value={priceDate}
                  onChange={(e) => setPriceDate(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                />
              </div>
            </div>
          </div>

          {/* Section: নগদ, স্বর্ণ ও রৌপ্য */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              ২. নগদ অর্থ ও ধাতু
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              </div>

              <div>
                <label 
                  htmlFor="input-gold-grams"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  স্বর্ণ (গ্রাম): জমানো বা বিনিয়োগের স্বর্ণ
                </label>
                <input
                  id="input-gold-grams"
                  type="number"
                  min="0"
                  step="any"
                  value={goldGrams === 0 ? '' : goldGrams}
                  placeholder="0"
                  onChange={(e) => setGoldGrams(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                />
                {goldValue > 0 && (
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    মূল্য: {formatBnNumber(goldValue)} টাকা
                  </span>
                )}
              </div>

              <div>
                <label 
                  htmlFor="input-silver-grams"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  রৌপ্য (গ্রাম)
                </label>
                <input
                  id="input-silver-grams"
                  type="number"
                  min="0"
                  step="any"
                  value={silverGrams === 0 ? '' : silverGrams}
                  placeholder="0"
                  onChange={(e) => setSilverGrams(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                />
                {silverValue > 0 && (
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    মূল্য: {formatBnNumber(silverValue)} টাকা
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section: ব্যবসা, বিনিয়োগ ও অন্যান্য সম্পদ */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              ৩. ব্যবসায়িক পণ্য ও বিনিয়োগ
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
              </div>

              <div>
                <label 
                  htmlFor="input-investments"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  বিনিয়োগ (টাকা)
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
              </div>

              <div>
                <label 
                  htmlFor="input-other-assets"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  অন্যান্য সম্পদ (টাকা)
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
              </div>
            </div>
          </div>

          {/* Section: ঋণ ও দায় */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              ৪. ঋণ ও দায়
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
              </div>
            </div>
          </div>
        </form>

        {/* Task 6 Results Display */}
        <div className="mt-8 pt-6 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              হিসাবের ফলাফল
            </h3>
            <div className="text-xs text-stone-600 bg-stone-100 px-3 py-1 rounded-full w-fit">
              {priceDate ? `হিসাবের দামের তারিখ: ${priceDate}` : 'হিসাবের দামের তারিখ: তারিখ লিখুন'}
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
            </div>

            {/* 2. নিট সম্পদ */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500 block mb-1 font-medium">
                নিট সম্পদ
              </span>
              <span className="text-lg sm:text-xl font-bold text-stone-900">
                {formatBnNumber(netWealth)} টাকা
              </span>
            </div>

            {/* 3. নিসাবের মূল্য */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500 block mb-1 font-medium">
                নিসাবের মূল্য
              </span>
              <div className="text-lg sm:text-xl font-bold text-stone-900">
                {nisabValue !== null ? `${formatBnNumber(nisabValue)} টাকা` : 'দাম লিখুন'}
              </div>
              <span className="text-[10px] text-stone-500 block mt-1">
                {nisabBasis === 'silver' ? '৬১২.৩৬ গ্রাম রৌপ্য' : '৮৭.৪৮ গ্রাম স্বর্ণ'}
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
                {!hasBasisPrice ? (
                  <span className="text-stone-400">দাম লিখুন</span>
                ) : isNisabReached && zakatAmount !== null ? (
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
                  নিট সম্পদের ২.৫%
                </span>
              )}
            </div>
          </div>

          {/* Task 6b: Nisab note */}
          <div className="text-xs text-stone-600 bg-stone-50 border border-stone-200/80 rounded-lg p-3">
            {nisabBasis === 'silver' ? (
              <span>এই অঙ্ক আপনার দেওয়া রৌপ্যের দামের ভিত্তিতে হিসাব করা হয়েছে।</span>
            ) : (
              <span>এই অঙ্ক আপনার দেওয়া স্বর্ণের দামের ভিত্তিতে হিসাব করা হয়েছে।</span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Explanation Section (verbatim) */}
      <section className="space-y-8 mb-12">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-2">
            নিসাব কী?
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            নিসাব হলো সেই নির্দিষ্ট পরিমাণ সম্পদ, যা একজন মুসলিমের কাছে থাকলে তার উপর যাকাত ফরজ হয়। এটি স্বর্ণ বা রৌপ্যের ওজনের ভিত্তিতে ধরা হয়। স্বর্ণের নিসাব প্রায় ৮৭.৪৮ গ্রাম এবং রৌপ্যের নিসাব প্রায় ৬১২.৩৬ গ্রাম। এই ওজনের টাকার মূল্য বাজারদরের ওপর নির্ভর করে। কোন ভিত্তিতে হিসাব করা হবে, তা নিয়ে আলেমদের মতভেদ আছে। এই পেজে রৌপ্যের ভিত্তি ডিফল্ট হিসেবে রাখা হয়েছে।
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-2">
            যাকাতের হার কত?
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            সাধারণত নিট সম্পদের ২.৫ শতাংশ (চল্লিশ ভাগের এক ভাগ) যাকাত হিসেবে দেওয়া হয়। এটি তখনই প্রযোজ্য, যখন সম্পদ নিসাব পরিমাণ থাকে এবং এক চান্দ্র বছর (হাওল) পূর্ণ হয়। এই ক্যালকুলেটর বছর পূর্ণ হয়েছে কিনা তা যাচাই করে না। সেটি আপনাকে নিজে দেখতে হবে।
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-2">
            কোন সম্পদের যাকাত দিতে হয়?
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            সাধারণত নগদ টাকা, ব্যাংকে জমা, বিক্রির জন্য রাখা ব্যবসায়িক পণ্য, এমন বিনিয়োগ যা বিক্রি করলে নগদ হবে, এবং জমানো স্বর্ণ ও রৌপ্য যাকাতযোগ্য সম্পদ হিসেবে গণ্য হয়। ব্যক্তিগত ব্যবহারের বাড়ি, গাড়ি, আসবাব ও পোশাককে সাধারণত যাকাতযোগ্য ধরা হয় না। ব্যবহারের অলংকারের যাকাত নিয়ে মতভেদ আছে। তাই এ বিষয়ে আলেমের মত নিন।
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-2">
            কাদের উপর যাকাত ফরজ?
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            যে মুসলিম সাধারণত প্রাপ্তবয়স্ক ও জ্ঞানসম্পন্ন, এবং যার মালিকানায় নিসাব পরিমাণ অতিরিক্ত সম্পদ এক চান্দ্র বছর থাকে, তার উপর যাকাত ফরজ হয়। সম্পদ তার নিজের মালিকানার হতে হবে এবং তার মৌলিক প্রয়োজনের অতিরিক্ত হতে হবে। অপ্রাপ্তবয়স্কের সম্পদের যাকাত নিয়ে আলেমদের মতভেদ আছে।
          </p>
        </div>
      </section>

      {/* 5. FAQ Section (verbatim) */}
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
            সাধারণত এখনই পরিশোধযোগ্য ঋণ মোট সম্পদ থেকে বিয়োগ করে নিট সম্পদ ধরা হয়। কোন ধরনের ঋণ কোন শর্তে বিয়োগ হবে, যেমন দীর্ঘমেয়াদি বা আদায়যোগ্য নয় এমন ঋণ, তা নিয়ে আলেমদের মতভেদ আছে। এই ক্যালকুলেটরে শুধু "বর্তমানে পরিশোধযোগ্য ঋণ" বিয়োগ করা হয়।
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
          <h3 className="text-base font-bold text-stone-900">
            ব্যবহারের জন্য রাখা অলংকারের যাকাত লাগবে কিনা?
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed">
            এ বিষয়ে আলেমদের মধ্যে মতভেদ আছে। কেউ মনে করেন ব্যবহারের অলংকারেও যাকাত দিতে হয়। আবার কেউ মনে করেন ব্যবহারের জন্য রাখা অলংকারে যাকাত দিতে হয় না। আপনার অবস্থার জন্য কোন মত নেবেন, তা স্থানীয় আলেমের কাছে জিজ্ঞাসা করুন। এই ক্যালকুলেটরে স্বর্ণের ঘরে শুধু জমানো বা বিনিয়োগের স্বর্ণ লিখতে বলা হয়েছে।
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
          <h3 className="text-base font-bold text-stone-900">
            স্বর্ণ ও রৌপ্য দুটোই থাকলে কীভাবে হিসাব হবে?
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed">
            স্বর্ণ ও রৌপ্যের মোট মূল্য যোগ করে নিট সম্পদের সঙ্গে ধরা হয়। নিসাবের ভিত্তি (স্বর্ণ না রৌপ্য) আপনি বেছে নেবেন। দুই ধাতু থাকলে কোন নিয়মে নিসাব মেলানো হবে, তা নিয়েও মতভেদ আছে। তাই আলেমের সঙ্গে নিশ্চিত হোন।
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
          <h3 className="text-base font-bold text-stone-900">
            পেজে দামের তারিখ কেন লেখা থাকে?
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed">
            স্বর্ণ ও রৌপ্যের দাম প্রতিদিন বদলায়। যে দামে হিসাব করা হয়েছে, তার তারিখ লেখা থাকলে বোঝা যায় ফলাফল কোন সময়ের। ক্যালকুলেটরে দাম আপনাকে নিজে লিখতে হয়।
          </p>
        </div>
      </section>

      {/* 6. Final note (verbatim, plain paragraph) */}
      <p className="text-sm text-stone-600 bg-stone-50 border border-stone-200/90 rounded-xl p-4 leading-relaxed mb-4">
        এই হিসাব একটি সাধারণ নির্দেশিকা। জটিল ক্ষেত্রে স্থানীয় আলেমের পরামর্শ নিন।
      </p>

      {/* 7. Review line, below the final note (see Task 2b) */}
      {REVIEW_DATE && (
        <p className="text-xs font-medium text-stone-500 pt-2 border-t border-stone-200">
          এই লেখা আলেম কর্তৃক যাচাই করা হয়েছে: {REVIEW_DATE}
        </p>
      )}
    </div>
  );
};
