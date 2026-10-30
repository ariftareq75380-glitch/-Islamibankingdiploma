import React from 'react';

interface AdPlacementProps {
  slotType: 'header-banner' | 'sidebar-rect' | 'in-feed-horizontal' | 'bottom-wide';
  lang: 'bn' | 'en';
  /**
   * By default, placeholder banners are hidden unless live AdSense code is active,
   * avoiding "raw" or unfinished look on production.
   */
  forceShowPlaceholder?: boolean;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ 
  slotType, 
  lang, 
  forceShowPlaceholder = false 
}) => {
  // If no live ad script is injected and not explicitly forced in debug mode, hide the space
  const hasLiveAdSense = typeof window !== 'undefined' && Boolean((window as unknown as { adsbygoogle?: unknown }).adsbygoogle);

  if (!hasLiveAdSense && !forceShowPlaceholder) {
    return null;
  }

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
    <aside 
      aria-label={lang === 'bn' ? 'বিজ্ঞাপন' : 'Advertisement'} 
      className={`mx-auto flex flex-col items-center justify-center ${getDimensions()}`}
    >
      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium mb-1">
        {lang === 'bn' ? 'বিজ্ঞাপন' : 'Advertisement'}
      </span>
      <div className="w-full h-full bg-stone-100/60 border border-stone-200/80 rounded-lg flex flex-col items-center justify-center p-3 text-center">
        {/* Live ins element when AdSense is active */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9876543210123456"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
};
