import React, { useRef } from 'react';
import { BookOpen, ShieldCheck, Mail, MapPin, Phone, Heart, Lock } from 'lucide-react';
import { ActiveTab, SiteSettings } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  openBlueprintModal: () => void;
  settings: SiteSettings;
  lang: 'bn' | 'en';
  onSecretAdminTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  openBlueprintModal,
  settings,
  lang,
  onSecretAdminTrigger
}) => {
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<any>(null);

  const handleSecretTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      onSecretAdminTrigger?.();
    } else {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 1500);
    }
  };
  return (
    <footer className="bg-[#14532D] text-stone-300 border-t-2 border-[#D4AF37]/40 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#047857] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {lang === 'bn' ? settings.siteNameBn : settings.siteName}
              </span>
            </div>

            <p className="text-stone-300/80 text-xs leading-relaxed max-w-sm font-bengali">
              {lang === 'bn' 
                ? 'বাংলাদেশের ব্যাংকিং প্রফেশনাল ও ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB) পরীক্ষার্থীদের জন্য উন্মুক্ত গবেষণামূলক জ্ঞান পাঠাগার। সমৃদ্ধ প্রশ্ন ব্যাংক, সমাধান ও দ্বিভাষিক গবেষণা।'
                : 'An open-access academic digital repository dedicated to Diploma in Islamic Banking (DIB) candidates, banking professionals, and researchers in Bangladesh.'}
            </p>

            <div className="pt-1 text-[11px] text-stone-300/70 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{settings.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Group 1: Exam Preparation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
              {lang === 'bn' ? 'পরীক্ষা প্রস্তুতি' : 'Exam Preparation'}
            </h4>
            <ul className="space-y-2 font-bengali text-xs">
              <li>
                <button 
                  onClick={() => setActiveTab('diploma')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'ডিআইবি পার্ট-১ ও পার্ট-২' : 'DIB Part-1 & Part-2'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('previous-questions')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'বিগত বছরের প্রশ্ন ও উত্তর' : 'Past Year Question Papers'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('mock-test')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'মডেল টেস্ট ও কুইজ' : 'Mock Test & Quiz'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('pdf-library')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'সম্পূর্ণ পিডিএফ লাইব্রেরি' : 'Master PDF Repository'}
                </button>
              </li>
            </ul>
          </div>

          {/* Group 2: Study Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
              {lang === 'bn' ? 'অধ্যয়ন রিসোর্স' : 'Study Resources'}
            </h4>
            <ul className="space-y-2 font-bengali text-xs">
              <li>
                <button 
                  onClick={() => setActiveTab('articles')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'ব্যাংকিং প্রবন্ধ ও কলাম' : 'Banking Research Articles'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('quran-hadith')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'কুরআন ও হাদিসে অর্থনীতি' : 'Quran & Hadith on Finance'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('fiqh-fatwa')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'ফিকহ ও শরীয়াহ ফতোয়া' : 'Fiqh & Fatwa Resolutions'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('faq')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'সচরাচর জিজ্ঞাসা (FAQ)' : 'Exam FAQs & Tips'}
                </button>
              </li>
            </ul>
          </div>

          {/* Group 3: Help & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
              {lang === 'bn' ? 'সাহায্য ও তথ্য' : 'Help & Information'}
            </h4>
            <ul className="space-y-2 font-bengali text-xs">
              <li>
                <button 
                  onClick={() => setActiveTab('bookmarks-view')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'সংরক্ষিত বুকমার্কসমূহ' : 'Saved Bookmarks'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('about')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'আমাদের পরিচিতি' : 'About Our Mission'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('contact')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'যোগাযোগ ও ফিডব্যাক' : 'Contact Helpdesk'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('privacy')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'গোপনীয়তা নীতিমালা' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('disclaimer')} 
                  className="hover:text-white transition-colors text-stone-300"
                >
                  {lang === 'bn' ? 'কপিরাইট ও ডিসক্লেইমার' : 'Copyright & Terms'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* অন্যান্য রিসোর্স (Other Resources) Section */}
        <div className="pt-6 pb-6 border-t border-emerald-900/60 mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>অন্যান্য রিসোর্স</span>
            <span className="text-[10px] text-stone-400 font-sans font-normal">(Other Resources)</span>
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 font-bengali text-xs">
            <li>
              <a
                href="/previous-questions"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/previous-questions');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-300 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
              >
                <span className="text-[#D4AF37]">›</span>
                <span>বিগত বছরের প্রশ্ন ও সমাধান</span>
              </a>
            </li>
            <li>
              <a
                href="/mock-test"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/mock-test');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-300 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
              >
                <span className="text-[#D4AF37]">›</span>
                <span>মডেল টেস্ট ও অনুশীলন কুঠুরি</span>
              </a>
            </li>
            <li>
              <a
                href="/banking"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/banking');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-300 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
              >
                <span className="text-[#D4AF37]">›</span>
                <span>ইসলামিক ব্যাংকিং ও অর্থায়ন</span>
              </a>
            </li>
            <li>
              <a
                href="/pdf-library"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/pdf-library');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-300 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
              >
                <span className="text-[#D4AF37]">›</span>
                <span>সম্পূর্ণ উন্মুক্ত পিডিএফ পাঠাগার</span>
              </a>
            </li>
            <li>
              <a
                href="/quran-hadith"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/quran-hadith');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-300 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
              >
                <span className="text-[#D4AF37]">›</span>
                <span>কুরআন ও হাদিসে অর্থনৈতিক বিধান</span>
              </a>
            </li>
            <li>
              <a
                href="/fiqh-fatwa"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/fiqh-fatwa');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-300 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
              >
                <span className="text-[#D4AF37]">›</span>
                <span>ফিকহুল মুআমালাত ও ফতোয়া</span>
              </a>
            </li>
            <li>
              <a
                href="/diploma"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/diploma');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-stone-300 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
              >
                <span className="text-[#D4AF37]">›</span>
                <span>ডিআইবি পার্ট ১ ও ২ (সব আর্টিকেল)</span>
              </a>
            </li>
            <li>
              <a
                href="/zakat-calculator"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('zakat-calculator');
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/zakat-calculator');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-stone-300 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
              >
                <span className="text-[#D4AF37]">›</span>
                <span>যাকাত ক্যালকুলেটর</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span 
              onClick={handleSecretTap} 
              className="cursor-default select-none"
              title=""
            >
              © {new Date().getFullYear()} {settings.siteNameBn} ({settings.siteName}). All rights reserved.
            </span>
            <button
              type="button"
              onClick={() => onSecretAdminTrigger?.()}
              aria-label="Admin Control Gateway"
              title={lang === 'bn' ? 'অ্যাডমিন সিকিউরিটি পোর্টাল' : 'Admin Security Gateway'}
              className="opacity-20 hover:opacity-100 text-stone-400 hover:text-[#D4AF37] p-0.5 rounded transition-all focus:outline-none cursor-pointer"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-stone-300/80">
            <span>Non-profit Islamic Educational Initiative</span>
            <span>·</span>
            <span>Made for DIB Students in Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
