import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, BookOpen, GraduationCap, CheckCircle, Mail, ArrowRight } from 'lucide-react';
import faqDataJson from '../data/faq.json';

interface FaqItem {
  id: number;
  category: 'exam' | 'syllabus' | 'preparation' | 'resources';
  categoryBn: string;
  categoryEn: string;
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
}

// Shared data source (src/data/faq.json) — also read server-side by api/og.js
// for the FAQPage JSON-LD served to search crawlers on /faq.
const faqData: FaqItem[] = faqDataJson as FaqItem[];

interface FaqSectionProps {
  lang: 'bn' | 'en';
  onContactClick: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang, onContactClick }) => {
  const [openIds, setOpenIds] = useState<number[]>([1, 2]); // default open first two
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleAccordion = (id: number) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenIds(faqData.map(f => f.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  const filteredFaqs = useMemo(() => {
    return faqData.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        item.questionBn.toLowerCase().includes(q) ||
        item.questionEn.toLowerCase().includes(q) ||
        item.answerBn.toLowerCase().includes(q) ||
        item.answerEn.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-bengali">
      {/* FAQ Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'bn' ? 'সচরাচর জিজ্ঞাসা ও নিয়মাবলী' : 'Frequently Asked Questions'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-3">
          {lang === 'bn' ? 'ডিআইবি পরীক্ষা ও প্রস্তুতি সংক্রান্ত প্রশ্নোত্তরি' : 'DIB Examination Guidance & FAQs'}
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          {lang === 'bn'
            ? 'আইবিবি ডিপ্লোমা ইন ইসলামিক ব্যাংকিং পরীক্ষা, পাস মার্ক, সিলেবাসের পরিবর্তন এবং চাকরির পাশাপাশি স্টাডি রুটিন সংক্রান্ত জরুরি প্রশ্নের উত্তর।'
            : 'Answers to the most common queries regarding IBB DIB exams, syllabus modules, passing criteria, and preparation roadmap.'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'bn' ? 'যেকোনো প্রশ্ন বা বিষয় খুঁজুন...' : 'Search questions or keywords...'}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#047857] font-bengali"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs text-stone-500">
            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 rounded-lg hover:bg-stone-100 font-medium"
            >
              {lang === 'bn' ? 'সব খুলুন' : 'Expand All'}
            </button>
            <span>·</span>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 rounded-lg hover:bg-stone-100 font-medium"
            >
              {lang === 'bn' ? 'সব বন্ধ করুন' : 'Collapse All'}
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 mt-3 border-t border-stone-100 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors shrink-0 ${
              activeCategory === 'all' ? 'bg-[#047857] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {lang === 'bn' ? 'সকল প্রশ্ন' : 'All'}
          </button>
          <button
            onClick={() => setActiveCategory('exam')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              activeCategory === 'exam' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {lang === 'bn' ? 'পরীক্ষা ও নিয়মাবলী' : 'Rules & Process'}
          </button>
          <button
            onClick={() => setActiveCategory('syllabus')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              activeCategory === 'syllabus' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {lang === 'bn' ? 'সিলেবাস' : 'Syllabus'}
          </button>
          <button
            onClick={() => setActiveCategory('preparation')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              activeCategory === 'preparation' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {lang === 'bn' ? 'প্রস্তুতি কৌশল' : 'Study Strategy'}
          </button>
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3 mb-10">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {faq.id}
                    </span>
                    <span className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                      {lang === 'bn' ? faq.questionBn : faq.questionEn}
                    </span>
                  </div>
                  <div className="text-stone-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-700" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-stone-100/80 bg-stone-50/40 text-xs sm:text-sm text-stone-700 leading-relaxed font-bengali whitespace-pre-line pl-14">
                    {lang === 'bn' ? faq.answerBn : faq.answerEn}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
            {lang === 'bn' ? 'আপনার অনুসন্ধানের সাথে মিল পাওয়া কোনো প্রশ্ন পাওয়া যায়নি।' : 'No matching questions found.'}
          </div>
        )}
      </div>

      {/* Have more questions card */}
      <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="font-bold text-white text-base mb-1">
            {lang === 'bn' ? 'আপনার কি আরও কোনো প্রশ্ন রয়েছে?' : 'Have More Specific Questions?'}
          </h3>
          <p className="text-xs text-emerald-300">
            {lang === 'bn' 
              ? 'আইবিবি ডিপ্লোমা সিলেবাস বা নোটস সংক্রান্ত কোনো প্রশ্ন থাকলে সরাসরি আমাদের লিখুন।'
              : 'Feel free to reach out to our academic team for queries regarding DIB syllabus.'}
          </p>
        </div>
        <button
          onClick={onContactClick}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
        >
          <Mail className="w-4 h-4" />
          <span>{lang === 'bn' ? 'আমাদের বার্তা পাঠান' : 'Contact Us'}</span>
        </button>
      </div>
    </div>
  );
};
