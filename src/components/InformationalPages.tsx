import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Send, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  FileText, 
  AlertCircle,
  HelpCircle,
  Building
} from 'lucide-react';
import { SiteSettings } from '../types';

interface InformationalPagesProps {
  page: 'about' | 'contact' | 'privacy' | 'disclaimer';
  settings: SiteSettings;
  lang: 'bn' | 'en';
}

export const InformationalPages: React.FC<InformationalPagesProps> = ({
  page,
  settings,
  lang
}) => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormSubject('');
      setFormMessage('');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* About Us Page */}
      {page === 'about' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {lang === 'bn' ? 'আমাদের পরিচয় ও লক্ষ্য' : 'Institutional Mission'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Islamic Knowledge & Banking Library'}
            </h1>
          </div>

          <div className="prose text-stone-700 text-sm sm:text-base leading-relaxed space-y-4 font-bengali">
            <p>
              {lang === 'bn'
                ? 'ইসলামিক জ্ঞান ও ব্যাংকিং পাঠাগার (Islamic Knowledge & Banking Library) বাংলাদেশের ব্যাংকিং সেক্টরের কর্মকর্তা, ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB) পরীক্ষার্থী এবং ইসলামী অর্থনীতির গবেষকদের জন্য একটি অলাভজনক ও উন্মুক্ত জ্ঞানভাণ্ডার।'
                : 'Islamic Knowledge & Banking Library is an independent, non-profit academic repository established to empower banking professionals, candidates of the Diploma in Islamic Banking (DIB) conducted by the Institute of Bankers, Bangladesh (IBB), and researchers in Islamic economics.'}
            </p>

            <h3 className="text-lg font-bold text-stone-900">
              {lang === 'bn' ? 'আমাদের মূল উদ্দেশ্যসমূহ:' : 'Our Core Educational Pillars:'}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-stone-700">
              <li>
                <strong>{lang === 'bn' ? 'ডিআইবি পরীক্ষার প্রশ্নোত্তর সংরক্ষণ:' : 'DIB Archive Preservation:'}</strong>{' '}
                {lang === 'bn' 
                  ? 'বিগত বছরের প্রশ্নপত্র এবং অভিজ্ঞ ইসলামী ব্যাংকিং ট্রেইনারদের দ্বারা প্রস্তুতকৃত প্রামাণ্য মডেল উত্তর সবার জন্য উন্মুক্ত রাখা।'
                  : 'Systematic compilation of past examination question papers and verified model answers for Part 1 & Part 2.'}
              </li>
              <li>
                <strong>{lang === 'bn' ? 'দ্বিভাষিক গবেষণা ও কলাম:' : 'Bilingual Knowledge Dissemination:'}</strong>{' '}
                {lang === 'bn'
                  ? 'আন্তর্জাতিক অ্যাকাউন্টিং স্ট্যান্ডার্ড (AAOIFI) এবং বাংলাদেশ ব্যাংকের নীতিমালা বাংলায় সহজবোধ্য করে উপস্থাপন।'
                  : 'Bridging international standards (AAOIFI, IFSB) with local Bangladesh banking jurisprudence in accessible Bengali & English.'}
              </li>
              <li>
                <strong>{lang === 'bn' ? 'নৈতিক ও হালাল আর্থিক ব্যবস্থার প্রসার:' : 'Ethical Islamic Finance Propagation:'}</strong>{' '}
                {lang === 'bn'
                  ? 'সুদবিহীন কল্যাণমূলক অর্থায়ন এবং সম্পদভিত্তিক বিনিয়োগ পদ্ধতির তাত্ত্বিক ও বাস্তব বিশ্লেষণ।'
                  : 'Advocating for asset-backed, profit-and-loss sharing financial models free from exploitation and Riba.'}
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Contact Us Page */}
      {page === 'contact' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {lang === 'bn' ? 'সহযোগিতা ও মতামত' : 'Get in Touch'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {lang === 'bn' ? 'যোগাযোগ ও ফিডব্যাক' : 'Contact Us & Student Inquiries'}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <Mail className="w-5 h-5 text-emerald-800 mb-2" />
              <div className="text-xs text-stone-500">{lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}</div>
              <div className="text-sm font-semibold text-stone-900">{settings.contactEmail}</div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <Phone className="w-5 h-5 text-emerald-800 mb-2" />
              <div className="text-xs text-stone-500">{lang === 'bn' ? 'যোগাযোগ নাম্বার' : 'Helpline'}</div>
              <div className="text-sm font-semibold text-stone-900">{settings.contactPhone}</div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <MapPin className="w-5 h-5 text-emerald-800 mb-2" />
              <div className="text-xs text-stone-500">{lang === 'bn' ? 'ঠিকানা' : 'Location'}</div>
              <div className="text-sm font-semibold text-stone-900">{settings.officeAddress}</div>
            </div>
          </div>

          {formSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <h3 className="font-bold text-emerald-950 text-base">
                {lang === 'bn' ? 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
              </h3>
              <p className="text-xs text-emerald-800">
                {lang === 'bn' 
                  ? 'আমাদের টিম খুব দ্রুত আপনার ইমেইলে উত্তর প্রদান করবে।' 
                  : 'Our academic advisory desk will review and reply to your inquiry shortly.'}
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-2 text-xs font-semibold text-emerald-900 underline"
              >
                {lang === 'bn' ? 'আরেকটি বার্তা লিখুন' : 'Send another inquiry'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitContact} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    {lang === 'bn' ? 'আপনার নাম *' : 'Your Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={lang === 'bn' ? 'যেমন: মোহাম্মদ আরিফুর রহমান' : 'e.g. Arifur Rahman'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-emerald-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    {lang === 'bn' ? 'ইমেইল অ্যাড্রেস *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-emerald-800"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-medium text-stone-700 mb-1">
                  {lang === 'bn' ? 'বিষয় (পরীক্ষা/রিসোর্স অনুরোধ/অন্যান্য)' : 'Inquiry Subject'}
                </label>
                <input
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: ৯৫তম পরীক্ষার সমাধান নোট অনুরোধ' : 'e.g., Question paper inquiry'}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-emerald-800"
                />
              </div>

              <div className="text-xs">
                <label className="block font-medium text-stone-700 mb-1">
                  {lang === 'bn' ? 'আপনার বার্তা বা প্রশ্ন লিখুন *' : 'Your Message / Resource Request *'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder={lang === 'bn' ? 'আপনার প্রয়োজনীয় তথ্য বিস্তারিত লিখুন...' : 'Write your question or request...'}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-emerald-800"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'বার্তা পাঠান' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Privacy Policy & Terms */}
      {page === 'privacy' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Legal & Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Privacy Policy & Terms of Service
            </h1>
            <p className="text-xs text-stone-500 mt-1">Last updated: October 2026</p>
          </div>

          <div className="prose text-stone-700 text-sm leading-relaxed space-y-4">
            <h3 className="font-bold text-stone-900">1. Information Collection and Educational Usage</h3>
            <p>
              Islamic Knowledge & Banking Library operates under strict educational fair-use principles. We do not sell or monetize personal data. Cookies are strictly utilized for saving your preferred language, reading preferences, and bookmark state.
            </p>

            <h3 className="font-bold text-stone-900">2. Google AdSense & Third-Party Advertising Policy</h3>
            <p>
              In compliance with Google AdSense program policies, all sponsored placements are clearly labeled as "Advertisement" and kept separate from primary action and download triggers. We do not engage in misleading ad placements, pop-unders, or deceptive download prompts.
            </p>

            <h3 className="font-bold text-stone-900">3. Copyright & Intellectual Property Protection</h3>
            <p>
              The study materials and model solutions provided are compiled by independent educators for examination preparation under fair educational use. We respect copyright laws. If you represent an academic publisher and believe a document violates copyright, please contact us immediately for prompt de-indexing.
            </p>
          </div>
        </div>
      )}

      {/* Disclaimer Page */}
      {page === 'disclaimer' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {lang === 'bn' ? 'আইনি দায়মুক্তি ও ঘোষণা' : 'Academic Disclaimer'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {lang === 'bn' ? 'দায়মুক্তি ও কপিরাইট পলিসি' : 'Disclaimer & Examination Integrity'}
            </h1>
          </div>

          <div className="prose text-stone-700 text-sm leading-relaxed space-y-4 font-bengali">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>{lang === 'bn' ? 'আইবিবি (IBB) সংক্রান্ত স্পষ্টীকরণ:' : 'Official Clarification:'}</strong>{' '}
                {lang === 'bn'
                  ? 'এই ওয়েবসাইটটি ইনস্টিটিউট অব ব্যাংকার্স, বাংলাদেশ (IBB) বা কোনো নির্দিষ্ট ব্যাংকের সরাসরি প্রাতিষ্ঠানিক মুখপাত্র নয়। এটি শিক্ষার্থীদের সুবিধার্থে একটি উন্মুক্ত ও নিরপেক্ষ স্টাডি পোর্টাল।'
                  : 'This portal is an independent academic repository for educational purposes and is not directly operated by or officially endorsed by the Institute of Bankers, Bangladesh (IBB).'}
              </div>
            </div>

            <p>
              {lang === 'bn'
                ? '১. সমাধানকৃত প্রশ্নাবলি ও মডেল উত্তরগুলো পরীক্ষার্থীদের রিভিশন ও অধ্যয়নের সুবিধার্থে তৈরি করা হয়েছে। পরীক্ষার খাতায় লেখার সময় পরীক্ষার্থীদের নিজস্ব যুক্তি ও বাংলাদেশ ব্যাংকের সর্বশেষ সার্কুলার যাচাই করে নেওয়ার পরামর্শ দেওয়া হচ্ছে।'
                : '1. Model solutions and study guides are compiled for examination revision. Students should corroborate answers with updated Bangladesh Bank prudential circulars.'}
            </p>
            <p>
              {lang === 'bn'
                ? '২. এই ওয়েবসাইটে কোনো প্রকার পাইরেটেড বা বাণিজ্যিক সফটওয়্যার শেয়ার করা হয় না। সকল পিডিএফ শিক্ষামূলক রেফারেন্স ও গবেষণার অংশ।'
                : '2. All resources are intended strictly for individual educational study under academic fair-use doctrine.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
