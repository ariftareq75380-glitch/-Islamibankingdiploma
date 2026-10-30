import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  AlertTriangle, 
  Copy, 
  Check, 
  Search,
  BookOpen,
  Compass,
  Sparkles
} from 'lucide-react';
import { 
  BANGLADESH_DISTRICTS, 
  DistrictLocation, 
  calculatePrayerTimes, 
  formatTimeInBengali 
} from '../utils/prayerTimes';
import { toBengaliNumerals } from '../utils/dateUtils';

interface PrayerTimesModalProps {
  onClose: () => void;
  lang: 'bn' | 'en';
}

const DISTRICT_STORAGE_KEY = 'ikl_selected_district_id';

export const PrayerTimesModal: React.FC<PrayerTimesModalProps> = ({
  onClose,
  lang
}) => {
  // Load saved district or default to Dhaka
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(() => {
    try {
      return localStorage.getItem(DISTRICT_STORAGE_KEY) || 'dhaka';
    } catch {
      return 'dhaka';
    }
  });

  const [searchDistrict, setSearchDistrict] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  // Selected district object
  const currentDistrict = useMemo(() => {
    return BANGLADESH_DISTRICTS.find(d => d.id === selectedDistrictId) || BANGLADESH_DISTRICTS[0];
  }, [selectedDistrictId]);

  // Save district preference
  const handleSelectDistrict = (id: string) => {
    setSelectedDistrictId(id);
    try {
      localStorage.setItem(DISTRICT_STORAGE_KEY, id);
    } catch {
      // ignore
    }
  };

  // Calculate prayer times
  const prayerData = useMemo(() => {
    return calculatePrayerTimes(currentDistrict, new Date());
  }, [currentDistrict]);

  // Filtered districts list
  const filteredDistricts = useMemo(() => {
    return BANGLADESH_DISTRICTS.filter(d => {
      const matchesSearch = 
        d.nameEn.toLowerCase().includes(searchDistrict.toLowerCase()) ||
        d.nameBn.includes(searchDistrict);
      const matchesDiv = selectedDivision === 'ALL' || d.divisionEn === selectedDivision;
      return matchesSearch && matchesDiv;
    });
  }, [searchDistrict, selectedDivision]);

  const divisionsList = [
    { en: 'ALL', bn: 'সব বিভাগ' },
    { en: 'Dhaka', bn: 'ঢাকা' },
    { en: 'Chattogram', bn: 'চট্টগ্রাম' },
    { en: 'Sylhet', bn: 'সিলেট' },
    { en: 'Rajshahi', bn: 'রাজশাহী' },
    { en: 'Khulna', bn: 'খুলনা' },
    { en: 'Barishal', bn: 'বরিশাল' },
    { en: 'Rangpur', bn: 'রংপুর' },
    { en: 'Mymensingh', bn: 'ময়মনসিংহ' }
  ];

  const handleCopyTimes = () => {
    const text = `
🕌 ${lang === 'bn' ? currentDistrict.nameBn : currentDistrict.nameEn} জেলার নামাজের সময়সূচী (হানাফী)
📅 তারিখ: ${new Date().toLocaleDateString('bn-BD')}
----------------------------
• ফজর: ${prayerData.times.fajr} (সেহরি শেষ: ${prayerData.times.tahajjudEnd})
• সূর্যোদয়: ${prayerData.times.sunrise} | ইশরাক: ${prayerData.times.ishraq}
• যোহর: ${prayerData.times.dhuhr}
• আসর (হানাফী): ${prayerData.times.asr}
• মাগরিব (ইফতার): ${prayerData.times.maghrib}
• এশা: ${prayerData.times.isha}
----------------------------
Islamic Knowledge & Banking Library
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const remainingHours = Math.floor(prayerData.nextPrayer.remainingMinutes / 60);
  const remainingMins = prayerData.nextPrayer.remainingMinutes % 60;
  const countdownStr = remainingHours > 0 
    ? `${toBengaliNumerals(remainingHours)} ঘণ্টা ${toBengaliNumerals(remainingMins)} মিনিট বাকি`
    : `${toBengaliNumerals(remainingMins)} মিনিট বাকি`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-bengali">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-950 text-stone-100 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900 text-emerald-300 rounded-lg">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                {lang === 'bn' ? 'বাংলাদেশ জেলাভিত্তিক নামাজের সময়সূচি' : 'Bangladesh District-wise Prayer Timetable'}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{lang === 'bn' ? `${currentDistrict.nameBn} জেলা (হানাফী সময়)` : `${currentDistrict.nameEn} District (Hanafi)`}</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-emerald-800 text-emerald-200">
                  {lang === 'bn' ? 'ইসলামিক ফাউন্ডেশন মানদণ্ড' : 'IFB Standard'}
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Top District Selector Bar */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
                <span className="font-bold text-stone-900 text-xs sm:text-sm">
                  {lang === 'bn' ? 'আপনার জেলা নির্বাচন করুন:' : 'Select District:'}
                </span>
              </div>

              {/* District Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchDistrict}
                  onChange={(e) => setSearchDistrict(e.target.value)}
                  placeholder={lang === 'bn' ? 'জেলা খুঁজুন (যেমন: চট্টগ্রাম, সিলেট)...' : 'Search district...'}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-emerald-800"
                />
              </div>
            </div>

            {/* Division Filter Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {divisionsList.map((div) => (
                <button
                  key={div.en}
                  onClick={() => setSelectedDivision(div.en)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 text-[11px] font-semibold ${
                    selectedDivision === div.en
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {lang === 'bn' ? div.bn : div.en}
                </button>
              ))}
            </div>

            {/* District Buttons Cloud */}
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-white rounded-lg border border-stone-200 text-xs">
              {filteredDistricts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDistrict(d.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedDistrictId === d.id
                      ? 'bg-emerald-800 text-white font-bold shadow-xs'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/70'
                  }`}
                >
                  {lang === 'bn' ? d.nameBn : d.nameEn}
                  {d.dhakaOffsetMin !== 0 && (
                    <span className="text-[10px] opacity-75 ml-1">
                      ({d.dhakaOffsetMin > 0 ? `+${d.dhakaOffsetMin}` : d.dhakaOffsetMin})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Next Prayer Countdown Spotlight Banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-800/80 flex items-center justify-center shrink-0 border border-emerald-700/60">
                <Clock className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider block">
                  {lang === 'bn' ? 'পরবর্তী ওয়াক্ত' : 'Upcoming Prayer'}
                </span>
                <div className="text-xl font-bold flex items-center gap-2">
                  <span>{lang === 'bn' ? prayerData.nextPrayer.nameBn : prayerData.nextPrayer.nameEn}</span>
                  <span className="text-emerald-300 tabular-nums">({prayerData.nextPrayer.timeStr})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <span className="text-[11px] text-emerald-300 block">
                  {lang === 'bn' ? 'ওয়াক্তের সময় বাকি' : 'Time Remaining'}
                </span>
                <span className="text-sm font-bold text-white bg-emerald-800/90 px-3 py-1 rounded-lg inline-block tabular-nums">
                  {lang === 'bn' ? countdownStr : `${prayerData.nextPrayer.remainingMinutes} min left`}
                </span>
              </div>
              <button
                onClick={handleCopyTimes}
                className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                title="Copy timetable"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'কপি করুন' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* 5 Daily Prayers Grid (Hanafi Asr Highlighted) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>{lang === 'bn' ? '৫ ওয়াক্তের সময়সূচি (হানাফী মাযহাব)' : 'Daily 5 Prayers (Hanafi)'}</span>
              </h3>
              <span className="text-xs text-stone-500">
                {lang === 'bn' ? 'ঢাকা থেকে সময় সমন্বয়সহ' : 'Calibrated to district coordinates'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              {/* Fajr */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-emerald-600 transition-all shadow-2xs">
                <div className="text-xs font-bold text-stone-500 mb-1">
                  {lang === 'bn' ? 'ফজর' : 'Fajr'}
                </div>
                <div className="text-lg font-bold text-emerald-950 tabular-nums">
                  {prayerData.times.fajr}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 border-t border-stone-200/70 pt-1">
                  {lang === 'bn' ? 'সেহরি শেষ: ' : 'Sahri: '}
                  <span className="font-semibold text-stone-700">{prayerData.times.tahajjudEnd}</span>
                </div>
              </div>

              {/* Dhuhr */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-emerald-600 transition-all shadow-2xs">
                <div className="text-xs font-bold text-stone-500 mb-1">
                  {lang === 'bn' ? 'যোহর' : 'Dhuhr'}
                </div>
                <div className="text-lg font-bold text-emerald-950 tabular-nums">
                  {prayerData.times.dhuhr}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 border-t border-stone-200/70 pt-1">
                  {lang === 'bn' ? 'দুপুর দ্বিপ্রহর পর' : 'Post-Zawal'}
                </div>
              </div>

              {/* Asr (Hanafi) */}
              <div className="p-4 rounded-xl border-2 border-emerald-600/70 bg-emerald-50/50 hover:bg-emerald-50 transition-all shadow-2xs relative">
                <div className="text-xs font-bold text-emerald-900 mb-1 flex items-center justify-center gap-1">
                  <span>{lang === 'bn' ? 'আসর (হানাফী)' : 'Asr (Hanafi)'}</span>
                </div>
                <div className="text-lg font-bold text-emerald-950 tabular-nums">
                  {prayerData.times.asr}
                </div>
                <div className="text-[10px] font-semibold text-emerald-800 mt-1 border-t border-emerald-200 pt-1">
                  {lang === 'bn' ? '★ দ্বিগুণ ছায়া (মিছলাইন)' : '★ 2x Shadow Standard'}
                </div>
              </div>

              {/* Maghrib */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-emerald-600 transition-all shadow-2xs">
                <div className="text-xs font-bold text-stone-500 mb-1">
                  {lang === 'bn' ? 'মাগরিব' : 'Maghrib'}
                </div>
                <div className="text-lg font-bold text-emerald-950 tabular-nums">
                  {prayerData.times.maghrib}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 border-t border-stone-200/70 pt-1">
                  {lang === 'bn' ? 'ইফতারের সময়' : 'Iftar Time'}
                </div>
              </div>

              {/* Isha */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-emerald-600 transition-all shadow-2xs col-span-2 sm:col-span-1">
                <div className="text-xs font-bold text-stone-500 mb-1">
                  {lang === 'bn' ? 'এশা' : 'Isha'}
                </div>
                <div className="text-lg font-bold text-emerald-950 tabular-nums">
                  {prayerData.times.isha}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 border-t border-stone-200/70 pt-1">
                  {lang === 'bn' ? 'রাত্রিকালীন ওয়াক্ত' : 'Night Prayer'}
                </div>
              </div>
            </div>
          </div>

          {/* Auxiliary Times: Sunrise & Ishraq */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-amber-700" />
                <div>
                  <span className="font-bold text-stone-900 block">
                    {lang === 'bn' ? 'সূর্যোদয় (Sunrise): ' : 'Sunrise: '}
                    <span className="text-amber-900 tabular-nums">{prayerData.times.sunrise}</span>
                  </span>
                  <span className="text-[11px] text-stone-600">
                    {lang === 'bn' ? 'ফজরের ওয়াক্ত সমাপ্তির সময়' : 'End of Fajr prayer window'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="font-bold text-stone-900 block">
                    {lang === 'bn' ? 'ইশরাক শুরু (Ishraq): ' : 'Ishraq: '}
                    <span className="text-emerald-900 tabular-nums">{prayerData.times.ishraq}</span>
                  </span>
                  <span className="text-[11px] text-stone-600">
                    {lang === 'bn' ? 'সূর্যোদয়ের ১৫ মিনিট পর নফল নামাজ' : 'Voluntary prayer after sunrise'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Forbidden Prayer Times Warning Box */}
          <div className="p-4 bg-red-50/80 rounded-xl border border-red-200 text-xs text-red-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-950">
              <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{lang === 'bn' ? 'নামাজের ৩টি মাকরুহ / নিষিদ্ধ সময় (হাদিস অনুযায়ী):' : 'Three Prohibited Prayer Times (Hadith):'}</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-700">
              <li className="bg-white/80 p-2 rounded-lg border border-red-200/60">
                <strong>{lang === 'bn' ? '১. সূর্যোদয়কালে: ' : '1. Sunrise: '}</strong>
                <span className="tabular-nums font-semibold text-red-800">{prayerData.forbiddenTimes.sunrise}</span>
              </li>
              <li className="bg-white/80 p-2 rounded-lg border border-red-200/60">
                <strong>{lang === 'bn' ? '২. ঠিক দ্বিপ্রহরে: ' : '2. Exact Noon: '}</strong>
                <span className="tabular-nums font-semibold text-red-800">{prayerData.forbiddenTimes.noon}</span>
              </li>
              <li className="bg-white/80 p-2 rounded-lg border border-red-200/60">
                <strong>{lang === 'bn' ? '৩. সূর্যাস্তকালে: ' : '3. Sunset: '}</strong>
                <span className="tabular-nums font-semibold text-red-800">{prayerData.forbiddenTimes.sunset}</span>
              </li>
            </ul>
          </div>

          {/* Shariah & Hanafi Rule Explanation Note */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
            <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
              <span>{lang === 'bn' ? 'হানাফী আসর ও ইসলামিক ফাউন্ডেশন মানদণ্ড' : 'Hanafi Asr & IFB Standards Note'}</span>
            </h4>
            <p>
              {lang === 'bn'
                ? 'ইমাম আবু হানিফা (রহ.)-এর মতে আসরের সময় শুরু হয় যখন কোনো বস্তুর ছায়া তার মূল ছায়া বাদে দ্বিগুণ হয় (মিছলাইন / Mithlayn)। ইসলামিক ফাউন্ডেশন বাংলাদেশ এবং এদেশের শীর্ষ উলামায়ে কেরাম আসরের জন্য এই হানাফী সময় অনুসরণ করেন। অন্যান্য মাযহাবে (শাফেয়ী, মালেকী, হাম্বলী) এক গুণ ছায়ায় আসর শুরু হয়।'
                : 'Under the Hanafi school of jurisprudence followed predominantly in Bangladesh, Asr begins when the shadow of an object reaches twice its length plus the noon shadow (Mithlayn). Islamic Foundation Bangladesh adheres to this calculation.'}
            </p>
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="px-6 py-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>
            {lang === 'bn' 
              ? `${currentDistrict.nameBn} জেলার জন্য সংরক্ষিত। পরিবর্তন করতে উপরের তালিকা থেকে জেলা বেছে নিন।` 
              : `Saved for ${currentDistrict.nameEn}. Switch anytime from the district list.`}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
