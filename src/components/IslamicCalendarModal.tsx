import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Moon, 
  Sun, 
  Copy, 
  Check, 
  ArrowRightLeft, 
  BookOpen, 
  ShieldCheck, 
  Clock,
  Sparkles
} from 'lucide-react';
import { getTriDate, ISLAMIC_BANKING_CALENDAR_EVENTS, toBengaliNumerals } from '../utils/dateUtils';

interface IslamicCalendarModalProps {
  onClose: () => void;
  lang: 'bn' | 'en';
}

export const IslamicCalendarModal: React.FC<IslamicCalendarModalProps> = ({
  onClose,
  lang
}) => {
  // Today's date info
  const todayTriDate = getTriDate(new Date());

  // Interactive conversion state
  const [selectedDateInput, setSelectedDateInput] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Compute conversion on selected input date
  const convertedTriDate = React.useMemo(() => {
    try {
      const parts = selectedDateInput.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (!isNaN(d.getTime())) {
          return getTriDate(d);
        }
      }
    } catch {
      // fallback
    }
    return todayTriDate;
  }, [selectedDateInput, todayTriDate]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                {lang === 'bn' ? 'ইসলামিক ও বঙ্গাব্দ ক্যালেন্ডার ইউটিলিটি' : 'Islamic & Bengali Calendar Utility'}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn' ? 'হিজরি, বঙ্গাব্দ ও ইংরেজি সমন্বিত তারিখ রূপান্তরক' : 'Tri-Calendar Synchronizer & Hijri Converter'}
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

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Card 1: Today's Three Calendar Real-Time Status */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>{lang === 'bn' ? 'আজকের সার্বজনীন ৩টি ক্যালেন্ডার তারিখ' : "Today's Tri-Calendar Synchronization"}</span>
              </span>
              <span className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                {lang === 'bn' ? 'লাইভ সিনক্রোনাইজড' : 'Live Synchronized'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Hijri Calendar */}
              <div className="p-4 rounded-xl border border-emerald-300 bg-gradient-to-b from-emerald-50/80 to-white flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'bn' ? 'হিজরি সন (ইসলামী)' : 'Hijri Calendar'}</span>
                    </span>
                    <button
                      onClick={() => handleCopy(lang === 'bn' ? todayTriDate.hijri.formattedBn : todayTriDate.hijri.formattedEn, 'hijri-today')}
                      className="text-stone-400 hover:text-emerald-800 transition-colors p-1"
                      title="Copy Hijri date"
                    >
                      {copiedKey === 'hijri-today' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-lg font-bold text-emerald-950 font-bengali">
                    {lang === 'bn' ? todayTriDate.hijri.formattedBn : todayTriDate.hijri.formattedEn}
                  </div>
                </div>
                <div className="text-[11px] text-emerald-700/80 mt-2 font-medium">
                  {lang === 'bn' ? todayTriDate.hijri.formattedEn : todayTriDate.hijri.formattedBn}
                </div>
              </div>

              {/* Bengali Solar Calendar */}
              <div className="p-4 rounded-xl border border-amber-300 bg-gradient-to-b from-amber-50/70 to-white flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      <span>{lang === 'bn' ? 'বঙ্গাব্দ (বাংলাদেশ)' : 'Bengali Solar'}</span>
                    </span>
                    <button
                      onClick={() => handleCopy(lang === 'bn' ? todayTriDate.bengali.formattedBn : todayTriDate.bengali.formattedEn, 'bengali-today')}
                      className="text-stone-400 hover:text-amber-800 transition-colors p-1"
                      title="Copy Bengali date"
                    >
                      {copiedKey === 'bengali-today' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-lg font-bold text-stone-900 font-bengali">
                    {lang === 'bn' ? todayTriDate.bengali.formattedBn : todayTriDate.bengali.formattedEn}
                  </div>
                </div>
                <div className="text-[11px] text-amber-800/80 mt-2 font-medium">
                  {lang === 'bn' ? todayTriDate.bengali.formattedEn : todayTriDate.bengali.formattedBn}
                </div>
              </div>

              {/* Gregorian Calendar */}
              <div className="p-4 rounded-xl border border-stone-200 bg-gradient-to-b from-stone-50 to-white flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-500" />
                      <span>{lang === 'bn' ? 'খ্রিস্টাব্দ (ইংরেজি)' : 'Gregorian Standard'}</span>
                    </span>
                    <button
                      onClick={() => handleCopy(lang === 'bn' ? todayTriDate.gregorian.formattedBn : todayTriDate.gregorian.formattedEn, 'greg-today')}
                      className="text-stone-400 hover:text-stone-800 transition-colors p-1"
                      title="Copy Gregorian date"
                    >
                      {copiedKey === 'greg-today' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-lg font-bold text-stone-900 font-bengali">
                    {lang === 'bn' ? todayTriDate.gregorian.formattedBn : todayTriDate.gregorian.formattedEn}
                  </div>
                </div>
                <div className="text-[11px] text-stone-500 mt-2 font-medium">
                  {lang === 'bn' ? todayTriDate.gregorian.formattedEn : todayTriDate.gregorian.formattedBn}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Date Converter for Banking Contracts & Exams */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-800" />
                  <span>{lang === 'bn' ? 'তারিখ রূপান্তরক (চুক্তি ও পরীক্ষার তারিখ হিসাব)' : 'Date Converter for Islamic Banking Contracts'}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {lang === 'bn'
                    ? 'মুরাবাহা চুক্তি, বাই-সালাম ডেলিভারি বা ডিআইবি পরীক্ষার ইংরেজি তারিখ নির্বাচন করুন — সাথে সাথে হিজরি ও বঙ্গাব্দ তারিখ তৈরি হবে।'
                    : 'Select any Gregorian date to calculate matching Hijri & Bengali calendar dates for contracts or DIB papers.'}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDateInput}
                  onChange={(e) => setSelectedDateInput(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-semibold focus:outline-emerald-800 shadow-xs"
                />
              </div>
            </div>

            {/* Results of chosen date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-emerald-200/90 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="font-semibold text-emerald-800">
                    {lang === 'bn' ? 'হিজরি রূপান্তর:' : 'Hijri Equivalent:'}
                  </span>
                  <button
                    onClick={() => handleCopy(lang === 'bn' ? convertedTriDate.hijri.formattedBn : convertedTriDate.hijri.formattedEn, 'conv-hijri')}
                    className="text-stone-400 hover:text-emerald-700"
                  >
                    {copiedKey === 'conv-hijri' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="font-bold text-stone-900 text-sm font-bengali">
                  {lang === 'bn' ? convertedTriDate.hijri.formattedBn : convertedTriDate.hijri.formattedEn}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-amber-200/90 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="font-semibold text-amber-900">
                    {lang === 'bn' ? 'বঙ্গাব্দ রূপান্তর:' : 'Bengali Solar:'}
                  </span>
                  <button
                    onClick={() => handleCopy(lang === 'bn' ? convertedTriDate.bengali.formattedBn : convertedTriDate.bengali.formattedEn, 'conv-bengali')}
                    className="text-stone-400 hover:text-amber-800"
                  >
                    {copiedKey === 'conv-bengali' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="font-bold text-stone-900 text-sm font-bengali">
                  {lang === 'bn' ? convertedTriDate.bengali.formattedBn : convertedTriDate.bengali.formattedEn}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="font-semibold text-stone-700">
                    {lang === 'bn' ? 'ইংরেজি রূপান্তর:' : 'Gregorian:'}
                  </span>
                  <button
                    onClick={() => handleCopy(lang === 'bn' ? convertedTriDate.gregorian.formattedBn : convertedTriDate.gregorian.formattedEn, 'conv-greg')}
                    className="text-stone-400 hover:text-stone-800"
                  >
                    {copiedKey === 'conv-greg' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="font-bold text-stone-900 text-sm font-bengali">
                  {lang === 'bn' ? convertedTriDate.gregorian.formattedBn : convertedTriDate.gregorian.formattedEn}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Islamic Banking Shariah & Financial Calendar Reference */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
              <span>{lang === 'bn' ? 'ইসলামিক ব্যাংকিং ক্যালেন্ডারের গুরুত্বপূর্ণ মাইলফলক' : 'Islamic Banking Key Shariah Milestones'}</span>
            </h4>

            <div className="space-y-2.5">
              {ISLAMIC_BANKING_CALENDAR_EVENTS.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-emerald-600/60 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-800">
                      {lang === 'bn' ? item.eventBn : item.eventEn}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {item.hijriMonth}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-bengali">
                    {lang === 'bn' ? item.descriptionBn : item.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>
            {lang === 'bn'
              ? 'বাংলা একাডেমি ও আন্তর্জাতিক উম্মুল কুরা মানদণ্ড অনুযায়ী গণনাকৃত।'
              : 'Computed according to Bangla Academy Solar and Umm al-Qura Lunar Standards.'}
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
