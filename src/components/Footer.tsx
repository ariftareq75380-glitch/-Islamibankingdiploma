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
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-200 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {lang === 'bn' ? settings.siteNameBn : settings.siteName}
              </span>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm font-bengali">
              {lang === 'bn' 
                ? 'বাংলাদেশের ব্যাংকিং প্রফেশনাল ও ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB) পরীক্ষার্থীদের জন্য উন্মুক্ত গবেষণামূলক জ্ঞান পাঠাগার। সমৃদ্ধ প্রশ্ন ব্যাংক, সমাধান ও দ্বিভাষিক গবেষণা।'
                : 'An open-access academic digital repository dedicated to Diploma in Islamic Banking (DIB) candidates, banking professionals, and researchers in Bangladesh.'}
            </p>

            <div className="pt-2 text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{settings.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {lang === 'bn' ? 'ডিআইবি বিভাগ' : 'DIB Archives'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('diploma')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'ডিআইবি পার্ট-১ রিসোর্স' : 'DIB Part-1 Modules'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('diploma')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'ডিআইবি পার্ট-২ রিসোর্স' : 'DIB Part-2 Modules'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('previous-questions')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'বিগত বছরের প্রশ্ন ও উত্তর' : 'Past Year Question Papers'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('pdf-library')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'সম্পূর্ণ পিডিএফ লাইব্রেরি' : 'Master PDF Repository'}
                </button>
              </li>
            </ul>
          </div>

          {/* Shariah & Articles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {lang === 'bn' ? 'ইসলামী অর্থনীতি' : 'Islamic Studies'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('articles')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'ব্যাংকিং প্রবন্ধ ও কলাম' : 'Banking Research Articles'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('quran-hadith')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'কুরআন ও হাদিসে অর্থনীতি' : 'Quran & Hadith on Finance'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('fiqh-fatwa')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'সেন্ট্রাল শরীয়াহ বোর্ডের ফতোয়া' : 'CSBIB Fatwa Resolutions'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('mock-test')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'মডেল টেস্ট ও MCQ কুইজ' : 'DIB Mock Test & Quiz'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('faq')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'সচরাচর জিজ্ঞাসা (FAQ)' : 'Exam FAQs & Tips'}
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal (Critical for AdSense) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {lang === 'bn' ? 'আইনি ও নীতিমালা' : 'Legal & Policies'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('about')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'আমাদের পরিচিতি' : 'About Our Mission'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('contact')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'যোগাযোগ ও ফিডব্যাক' : 'Contact Helpdesk'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('privacy')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'গোপনীয়তা নীতিমালা (Privacy)' : 'Privacy Policy & Terms'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('disclaimer')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'কপিরাইট ও ডিসক্লেইমার' : 'Copyright & Disclaimer'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
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
              className="opacity-20 hover:opacity-100 text-stone-600 hover:text-emerald-400 p-0.5 rounded transition-all focus:outline-none cursor-pointer"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span>Non-profit Islamic Educational Initiative</span>
            <span>·</span>
            <span>Made for DIB Students in Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
