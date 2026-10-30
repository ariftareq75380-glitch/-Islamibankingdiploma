import React from 'react';

interface AdPlacementProps {
  slotType: 'header-banner' | 'sidebar-rect' | 'in-feed-horizontal' | 'bottom-wide';
  lang: 'bn' | 'en';
}

/**
 * AdSense-compliant ethical ad container.
 * Clearly labeled as "Advertisement / বিজ্ঞাপন" and strictly isolated
 * from download or navigation buttons to prevent accidental/deceptive clicks.
 */
export const AdPlacement: React.FC<AdPlacementProps> = ({ slotType, lang }) => {
  const getDimensions = () => {
    switch (slotType) {
      case 'header-banner':
        return 'w-full max-w-4xl h-24 my-6';
      case 'sidebar-rect':
        return 'w-full h-64 my-4';
      case 'in-feed-horizontal':
        return 'w-full h-32 my-8';
      case 'bottom-wide':
        return 'w-full max-w-5xl h-28 my-8';
    }
  };

  return (
    <div className={`mx-auto flex flex-col items-center justify-center ${getDimensions()}`}>
      {/* Required clear AdSense label */}
      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium mb-1">
        {lang === 'bn' ? 'বিজ্ঞাপন (নন-ইনট্রুসিভ)' : 'Sponsored Advertisement'}
      </span>

      {/* Styled placeholder matching Google Display Network standards */}
      <div className="w-full h-full bg-stone-100/90 border border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center p-3 text-center">
        <span className="text-xs font-semibold text-stone-500">
          {lang === 'bn' ? 'অ্যাডসেন্স প্লেসমেন্ট জোন' : 'Google AdSense Placement Zone'}
        </span>
        <span className="text-[11px] text-stone-400 mt-0.5">
          {slotType === 'header-banner' && '728x90 Leaderboard / Responsive Banner'}
          {slotType === 'sidebar-rect' && '300x250 Medium Rectangle'}
          {slotType === 'in-feed-horizontal' && 'Responsive Native In-Feed Unit'}
          {slotType === 'bottom-wide' && '970x90 Large Leaderboard Slot'}
        </span>
      </div>
    </div>
  );
};
