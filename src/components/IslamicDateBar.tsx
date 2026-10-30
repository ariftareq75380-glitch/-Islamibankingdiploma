import React, { useMemo } from 'react';
import { Moon, Calendar, Sun, ArrowRightLeft, Clock, Compass } from 'lucide-react';
import { getTriDate } from '../utils/dateUtils';
import { BANGLADESH_DISTRICTS, calculatePrayerTimes } from '../utils/prayerTimes';

interface IslamicDateBarProps {
  onOpenCalendarModal: () => void;
  onOpenPrayerTimesModal: () => void;
  lang: 'bn' | 'en';
}

export const IslamicDateBar: React.FC<IslamicDateBarProps> = ({
  onOpenCalendarModal,
  onOpenPrayerTimesModal,
  lang
}) => {
  const triDate = getTriDate(new Date());

  // Quick district prayer status (Dhaka default or saved preference)
  const currentDistrict = useMemo(() => {
    try {
      const savedId = localStorage.getItem('ikl_selected_district_id') || 'dhaka';
      return BANGLADESH_DISTRICTS.find(d => d.id === savedId) || BANGLADESH_DISTRICTS[0];
    } catch {
      return BANGLADESH_DISTRICTS[0];
    }
  }, []);

  const prayerData = useMemo(() => {
    return calculatePrayerTimes(currentDistrict, new Date());
  }, [currentDistrict]);

  return (
    <div className="bg-emerald-950 text-emerald-100 border-b border-emerald-900/80 text-xs py-1.5 px-4 font-bengali">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        {/* Date & Prayer Display Group */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-emerald-100">
          {/* Hijri Date */}
          <div className="flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-200">
              {lang === 'bn' ? triDate.hijri.formattedBn : triDate.hijri.formattedEn}
            </span>
          </div>

          <span className="hidden sm:inline text-emerald-700">|</span>

          {/* Bengali Date */}
          <div className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="font-medium text-emerald-100">
              {lang === 'bn' ? triDate.bengali.formattedBn : triDate.bengali.formattedEn}
            </span>
          </div>

          <span className="hidden md:inline text-emerald-700">|</span>

          {/* Quick Next Prayer snippet */}
          <button
            onClick={onOpenPrayerTimesModal}
            className="flex items-center gap-1.5 text-emerald-200 hover:text-white transition-colors"
            title={lang === 'bn' ? `${currentDistrict.nameBn} জেলার নামাজের সময় দেখুন` : `View ${currentDistrict.nameEn} prayer times`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {lang === 'bn' 
                ? `পরবর্তী ওয়াক্ত (${currentDistrict.nameBn}): ${prayerData.nextPrayer.nameBn} ${prayerData.nextPrayer.timeStr} (হানাফী)`
                : `Next: ${prayerData.nextPrayer.nameEn} ${prayerData.nextPrayer.timeStr} (${currentDistrict.nameEn})`}
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Prayer times modal trigger */}
          <button
            onClick={onOpenPrayerTimesModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/90 hover:bg-emerald-800 text-white text-[11px] font-semibold transition-colors border border-emerald-700/80 shadow-2xs"
            title={lang === 'bn' ? 'জেলাভেদে হানাফী নামাজের সময়সূচি' : 'District-wise Hanafi Prayer Times'}
          >
            <Compass className="w-3 h-3 text-emerald-300" />
            <span>{lang === 'bn' ? 'নামাজের সময় (জেলাভেদে)' : 'Prayer Times (Hanafi)'}</span>
          </button>

          {/* Tri-Date Converter button */}
          <button
            onClick={onOpenCalendarModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 hover:text-white text-[11px] font-semibold transition-colors border border-emerald-700/80 shadow-2xs group"
            title={lang === 'bn' ? 'তারিখ রূপান্তরক ও ক্যালেন্ডার খুলুন' : 'Open Calendar Converter'}
          >
            <ArrowRightLeft className="w-3 h-3 text-emerald-300 group-hover:rotate-180 transition-transform duration-300" />
            <span>{lang === 'bn' ? 'তারিখ রূপান্তরক' : 'Date Converter'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
