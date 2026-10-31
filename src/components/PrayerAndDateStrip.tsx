import React, { useMemo, useState } from 'react';
import { Moon, Sun, Clock, MapPin, Calendar, ArrowRightLeft, ChevronDown } from 'lucide-react';
import { getTriDate } from '../utils/dateUtils';
import { BANGLADESH_DISTRICTS, calculatePrayerTimes } from '../utils/prayerTimes';

interface PrayerAndDateStripProps {
  onOpenCalendarModal: () => void;
  onOpenPrayerTimesModal: () => void;
  lang: 'bn' | 'en';
}

export const PrayerAndDateStrip: React.FC<PrayerAndDateStripProps> = ({
  onOpenCalendarModal,
  onOpenPrayerTimesModal,
  lang
}) => {
  const triDate = getTriDate(new Date());

  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(() => {
    try {
      return localStorage.getItem('ikl_selected_district_id') || 'dhaka';
    } catch {
      return 'dhaka';
    }
  });

  const currentDistrict = useMemo(() => {
    return BANGLADESH_DISTRICTS.find(d => d.id === selectedDistrictId) || BANGLADESH_DISTRICTS[0];
  }, [selectedDistrictId]);

  const prayerData = useMemo(() => {
    return calculatePrayerTimes(currentDistrict, new Date());
  }, [currentDistrict]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedDistrictId(newId);
    try {
      localStorage.setItem('ikl_selected_district_id', newId);
    } catch {
      // storage not available
    }
  };

  return (
    <div className="bg-[#F4F6F0] border-b border-stone-200/80 text-stone-700 text-xs py-2 px-3 sm:px-4 font-bengali">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Tri-Calendar Dates (Hijri & Bangla) */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1 text-[11px] sm:text-xs">
          {/* Hijri */}
          <button
            onClick={onOpenCalendarModal}
            className="flex items-center gap-1.5 text-[#14532D] font-bold hover:text-[#047857] transition-colors"
            title={lang === 'bn' ? 'হিজরি ও বঙ্গাব্দ ক্যালেন্ডার বিস্তারিত' : 'View Islamic Calendar'}
          >
            <Moon className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/20 shrink-0" />
            <span>{lang === 'bn' ? triDate.hijri.formattedBn : triDate.hijri.formattedEn}</span>
          </button>

          <span className="text-stone-300">·</span>

          {/* Bengali Date */}
          <div className="flex items-center gap-1.5 text-stone-600">
            <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{lang === 'bn' ? triDate.bengali.formattedBn : triDate.bengali.formattedEn}</span>
          </div>

          <span className="text-stone-300 hidden sm:inline">·</span>

          {/* Gregorian */}
          <span className="text-stone-500 hidden sm:inline">
            {lang === 'bn' ? triDate.gregorian.formattedBn : triDate.gregorian.formattedEn}
          </span>
        </div>

        {/* Right: Hanafi Prayer Time for District + Quick District Switch */}
        <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap text-[11px] sm:text-xs">
          {/* Next Prayer Badge */}
          <button
            onClick={onOpenPrayerTimesModal}
            className="inline-flex items-center gap-1.5 bg-white text-[#14532D] border border-emerald-200/90 shadow-2xs px-2.5 py-1 rounded-md font-semibold hover:border-[#047857] transition-colors"
            title={lang === 'bn' ? 'সব ওয়াক্তের নামাজের সময়সূচি দেখুন' : 'View all prayer times'}
          >
            <Clock className="w-3 h-3 text-[#047857] shrink-0" />
            <span>
              {lang === 'bn'
                ? `ওয়াক্ত: ${prayerData.nextPrayer.nameBn} (${prayerData.nextPrayer.timeStr})`
                : `Next: ${prayerData.nextPrayer.nameEn} (${prayerData.nextPrayer.timeStr})`}
            </span>
          </button>

          {/* Quick District Selector */}
          <div className="relative inline-flex items-center">
            <MapPin className="w-3 h-3 text-stone-400 absolute left-2 pointer-events-none" />
            <select
              value={selectedDistrictId}
              onChange={handleDistrictChange}
              className="pl-5 pr-5 py-1 text-[11px] bg-white border border-stone-200 rounded-md text-stone-700 hover:border-stone-400 focus:outline-none focus:ring-1 focus:ring-[#047857] appearance-none cursor-pointer"
              title={lang === 'bn' ? 'জেলা পরিবর্তন করুন' : 'Change District'}
            >
              {BANGLADESH_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {lang === 'bn' ? d.nameBn : d.nameEn}
                </option>
              ))}
            </select>
            <ChevronDown className="w-2.5 h-2.5 text-stone-400 absolute right-1.5 pointer-events-none" />
          </div>

          {/* Date Converter Trigger */}
          <button
            onClick={onOpenCalendarModal}
            className="text-stone-500 hover:text-[#047857] transition-colors flex items-center gap-1 px-1.5 py-1 rounded hover:bg-stone-200/50"
            title={lang === 'bn' ? 'তারিখ রূপান্তরক' : 'Date Converter'}
          >
            <ArrowRightLeft className="w-3 h-3 text-[#047857]" />
            <span className="hidden md:inline">{lang === 'bn' ? 'রূপান্তরক' : 'Converter'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
