import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, BookOpen, GraduationCap, CheckCircle, Mail, ArrowRight } from 'lucide-react';

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

const faqData: FaqItem[] = [
  {
    id: 1,
    category: 'exam',
    categoryBn: 'পরীক্ষা পদ্ধতি ও নিয়মাবলী',
    categoryEn: 'Exam Rules & Procedure',
    questionBn: 'আইবিবি (IBB) ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB) কী এবং এর গুরুত্ব কী?',
    questionEn: 'What is the Diploma in Islamic Banking (DIB) under IBB and why is it important?',
    answerBn: 'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB) হলো দ্য ইনস্টিটিউট অব ব্যাংকার্স, বাংলাদেশ (IBB) কর্তৃক পরিচালিত একটি পেশাদার ব্যাংকিং ডিপ্লোমা। বাংলাদেশে ইসলামিক ব্যাংকসমূহ ও কনভেনশনাল ব্যাংকের ইসলামিক ব্যাংকিং উইং-এ কর্মরত অফিসারদের পদোন্নতি, বিশেষ ইনক্রিমেন্ট এবং শরীয়াহ কমপ্লায়েন্সে দক্ষতা বৃদ্ধির জন্য এটি অত্যন্ত মর্যাদাপূর্ণ ও প্রয়োজনীয় যোগ্যতা।',
    answerEn: 'Diploma in Islamic Banking (DIB) is an official professional banking certification administered by the Institute of Bankers, Bangladesh (IBB) for banking professionals to advance their careers and master Shariah banking.'
  },
  {
    id: 2,
    category: 'syllabus',
    categoryBn: 'সিলেবাস ও বিষয়সমূহ',
    categoryEn: 'Syllabus & Subjects',
    questionBn: 'ডিআইবি পার্ট-১ এবং পার্ট-২ এ কোন কোন বিষয় অন্তর্ভুক্ত থাকে?',
    questionEn: 'Which subjects are included in DIB Part 1 and Part 2?',
    answerBn: 'ডিআইবি মূলত দুটি ভাগে বিভক্ত:\n• পার্ট-১: ইসলামিক অর্থনীতি, ব্যাংকিং নীতিমালা, বিনিয়োগের পদ্ধতিসমূহ (মুদারাবা, মুশারাকা, মুরাবাহা, ইজারা) এবং ইসলামিক কমার্শিয়াল ল।\n• পার্ট-২: আন্তর্জাতিক ইসলামিক অ্যাকাউন্টিং ও অডিটিং (AAOIFI FAS), ব্যাংক কোম্পানি আইন ১৯৯১, বৈদেশিক বাণিজ্য (Islamic Trade Finance), সুকুক এবং শরীয়াহ গভর্ন্যান্স।',
    answerEn: 'Part 1 covers Islamic Economics, Principles of Banking, Investment Modes (Mudaraba, Musharaka, Murabaha), and Commercial Law. Part 2 covers AAOIFI Accounting Standards, Banking Laws 1991, Trade Finance, Sukuk, and Shariah Governance.'
  },
  {
    id: 3,
    category: 'exam',
    categoryBn: 'পরীক্ষা পদ্ধতি ও নিয়মাবলী',
    categoryEn: 'Exam Rules & Procedure',
    questionBn: 'ডিআইবি পরীক্ষায় পাস মার্ক কত এবং কোনো বিষয়ে অকৃতকার্য হলে কী হয়?',
    questionEn: 'What is the passing score in DIB exams and what happens if one fails a subject?',
    answerBn: 'প্রতিটি বিষয়ে ১০০ নম্বরের লিখিত পরীক্ষা অনুষ্ঠিত হয় এবং ন্যূনতম পাস মার্ক ৫০। কোনো বিষয়ে ৫০ বা তার বেশি পেলে সেই বিষয়ে পাস হিসেবে ক্রেডিট সংরক্ষিত থাকে। অনুত্তীর্ণ বিষয়গুলোর জন্য পরবর্তীতে শুধু সেই বিষয়েই পুনরায় পরীক্ষা দেওয়ার সুযোগ থাকে।',
    answerEn: 'Each paper is graded out of 100 with a passing mark of 50. Passed subjects retain permanent credit, and candidates only need to re-appear for unpassed subjects.'
  },
  {
    id: 4,
    category: 'preparation',
    categoryBn: 'প্রস্তুতি ও স্টাডি রুটিন',
    categoryEn: 'Preparation & Study Routine',
    questionBn: 'চাকরির ব্যস্ততার মাঝে প্রথমবারেই উভয় পার্ট পাসের কার্যকর উপায় কী?',
    questionEn: 'What is the most effective roadmap to pass DIB on the first attempt while working full-time?',
    answerBn: '১. বিগত ৫–১০ বছরের প্রশ্ন বিশ্লেষণ: পরীক্ষার প্রায় ৬৫% প্রশ্ন আগের সেশনগুলোর ধারণা থেকেই বারবার আসে।\n২. আকদ ও ফর্মুলার ছক: মুদারাবা ও মুশারাকার লাভ-লোকসান বণ্টনের গাণিতিক সমস্যাগুলো স্পষ্ট ছক আকারে চর্চা করুন।\n৩. পয়েন্টভিত্তিক উত্তর: ঢালাও লেখার পরিবর্তে সংজ্ঞা, শর্তাবলি, ফ্লো-চার্ট ও বাংলাদেশ ব্যাংকের সংশ্লিষ্ট সার্কুলার উল্লেখ করুন।',
    answerEn: 'Focus on 5-10 year previous question trends (65% conceptual repeat), practice numerical profit-sharing math with clean flowcharts, and cite Bangladesh Bank circulars.'
  },
  {
    id: 5,
    category: 'exam',
    categoryBn: 'পরীক্ষা পদ্ধতি ও নিয়মাবলী',
    categoryEn: 'Exam Rules & Procedure',
    questionBn: 'ডিআইবি পরীক্ষায় কি ক্যালকুলেটর ব্যবহার করার অনুমতি রয়েছে?',
    questionEn: 'Are calculators permitted in DIB examinations?',
    answerBn: 'হ্যাঁ, ডিআইবি পরীক্ষায় নন-প্রোগ্রামেবল সাধারণ সায়েন্টিফিক ক্যালকুলেটর (যেমন: fx-82MS, fx-991ES ইত্যাদি) ব্যবহারের অনুমতি থাকে। তবে কোনো ধরনের প্রোগ্রামযোগ্য ক্যালকুলেটর বা মোবাইল ডিভাইস সম্পূর্ণ নিষিদ্ধ।',
    answerEn: 'Yes, standard non-programmable scientific calculators are permitted for numerical calculation problems.'
  },
  {
    id: 6,
    category: 'preparation',
    categoryBn: 'প্রস্তুতি ও স্টাডি রুটিন',
    categoryEn: 'Preparation & Study Routine',
    questionBn: 'খাতায় উত্তর লেখার সময় আরবি আয়াত বা হাদিসের মূল পাঠ লেখা কি আবশ্যক?',
    questionEn: 'Is writing original Arabic text for Quran or Hadith mandatory in exam scripts?',
    answerBn: 'আরবি হরফে হুবহু মূল পাঠ লেখা বাধ্যতামূলক নয়; নির্ভুল বাংলা ভাবানুবাদ এবং প্রাসঙ্গিক সূরার নাম বা হাদিস গ্রন্থ (যেমন: বুখারী, মুসলিম, আবু দাউদ) উল্লেখ করলেই পূর্ণ নম্বর দেওয়া হয়। তবে আরবি হরফ শুদ্ধভাবে লিখতে পারলে তা উত্তরের গ্রহণযোগ্যতা ও সৌন্দর্য উল্লেখযোগ্যভাবে বৃদ্ধি করে।',
    answerEn: 'Original Arabic script is not strictly mandatory; accurate Bengali translation with chapter/source citations receives full marks. Including correct Arabic script provides added distinction.'
  },
  {
    id: 7,
    category: 'resources',
    categoryBn: 'পাঠাগার ও রিসোর্স',
    categoryEn: 'Library & Resources',
    questionBn: 'এই ওয়েবসাইটের সব প্রশ্নপত্র ও হ্যান্ডনোটস কি সম্পূর্ণ ফ্রি?',
    questionEn: 'Are all past question papers and study guides on this site free to access?',
    answerBn: 'হ্যাঁ, এই প্ল্যাটফর্মের সকল বিগত বছরের প্রশ্ন, সমাধানকৃত মডেল উত্তর, আন্তর্জাতিক এএওআইএফআই গাইডলাইন এবং স্টাডি হ্যান্ডনোটস সম্পূর্ণ উন্মুক্ত ও বিনামূল্যে ডাউনলোডের জন্য উন্মুক্ত। কোনো প্রকার সাইন-আপ বা সাবস্ক্রিপশন ফি নেই।',
    answerEn: 'Yes, 100% of the past exam papers, solutions, and reference materials are free and openly accessible without paywalls or required logins.'
  }
];

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
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 font-bengali"
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
            className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              activeCategory === 'all' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
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
