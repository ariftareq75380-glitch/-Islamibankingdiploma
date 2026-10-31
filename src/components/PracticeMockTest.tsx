import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  RotateCcw, 
  Award, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface QuestionItem {
  id: number;
  part: 'DIB-1' | 'DIB-2';
  subjectBn: string;
  subjectEn: string;
  questionBn: string;
  questionEn: string;
  optionsBn: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationBn: string;
  explanationEn: string;
  reference: string;
}

const mockQuestionsData: QuestionItem[] = [
  {
    id: 1,
    part: 'DIB-1',
    subjectBn: 'ইসলামিক অর্থনীতি ও ব্যাংকিং নীতিমালা',
    subjectEn: 'Islamic Economics & Principles',
    questionBn: 'ইসলামিক ব্যাংকিংয়ে "মুদারাবা" (Mudaraba) চুক্তিতে যিনি মূলধন বা অর্থ বিনিয়োগ করেন তাকে কী বলা হয়?',
    questionEn: 'In a Mudaraba contract, what is the capital provider called?',
    optionsBn: ['মুদারিব (Mudarib)', 'রব্বুল মাল (Rabb-ul-Mal)', 'কাফিল (Kafil)', 'মুয়াক্কিল (Muwakkil)'],
    optionsEn: ['Mudarib', 'Rabb-ul-Mal', 'Kafil', 'Muwakkil'],
    correctIndex: 1,
    explanationBn: 'মুদারাবা হলো শ্রম ও মূলধনের অংশীদারি। মূলধন সরবরাহকারীকে "রব্বুল মাল" (অর্থের মালিক) এবং ব্যবসায়ী বা পরিচালনাকারীকে "মুদারিব" বলা হয়।',
    explanationEn: 'Mudaraba is a partnership in profit. The investor providing capital is Rabb-ul-Mal, and the working entrepreneur is Mudarib.',
    reference: 'AAOIFI Shariah Standard No. 13'
  },
  {
    id: 2,
    part: 'DIB-1',
    subjectBn: 'ইসলামিক অর্থনীতি ও রিবা বিধান',
    subjectEn: 'Islamic Economics & Riba',
    questionBn: 'সময়ের বিনিময়ে ঋণের মূলধনের ওপর পূর্বনির্ধারিত অতিরিক্ত অর্থ গ্রহণ করাকে কুরআন ও সুন্নাহর পরিভাষায় কী বলা হয়?',
    questionEn: 'What is predefined surplus demanded on a loan in exchange for time termed in Islamic law?',
    optionsBn: ['রিবা আল-বাই (Riba al-Buyu)', 'রিবা আন-নাসিআহ (Riba an-Nasi’ah)', 'ঘারার (Gharar)', 'বায় সালাম (Bai Salam)'],
    optionsEn: ['Riba al-Buyu', 'Riba an-Nasi’ah', 'Gharar', 'Bai Salam'],
    correctIndex: 1,
    explanationBn: 'প্রচলিত ব্যাংকের ঋণ বা সুদ মূলত "রিবা আন-নাসিআহ" (বিলম্বের বিনিময়ে অতিরিক্ত আদায়), যা সূরা আল-বাকারার ২৭৫-২৭৯ আয়াতে কঠোরভাবে হারাম ঘোষিত হয়েছে।',
    explanationEn: 'Riba an-Nasi’ah refers to interest charged over a delayed payment period on a debt, explicitly forbidden in the Quran.',
    reference: 'Holy Quran (2:275-279)'
  },
  {
    id: 3,
    part: 'DIB-1',
    subjectBn: 'ফিকহুল মুআমালাতের মূলনীতি',
    subjectEn: 'Legal Maxims of Fiqh',
    questionBn: '"আল-খারাজ বিদ-দামান" (Al-Kharaj bid-Daman) হাদিসের এই মৌলিক শরীয়াহ মূলনীতির তাৎপর্য কী?',
    questionEn: 'What is the fundamental meaning of the prophetic maxim "Al-Kharaj bid-Daman"?',
    optionsBn: [
      'ঋণ গ্রহণের সাথে সাথে লাভ নিশ্চিত হয়',
      'মুনাফা ভোগের অধিকার তখনই জন্মায়, যখন সম্ভাব্য ক্ষতির ঝুঁকি ও দায়ভার বহন করা হয়',
      'ব্যাংক কোনো অবস্থায় ক্ষতি বহন করবে না',
      'যেকোনো ব্যবসায় পূর্বনির্ধারিত লাভ বাধ্যতামূলক'
    ],
    optionsEn: [
      'Profit is guaranteed upon receiving debt',
      'Entitlement to revenue/profit is justified solely by bearing risk of liability',
      'Banks must never absorb losses',
      'Fixed return is mandatory in all commerce'
    ],
    correctIndex: 1,
    explanationBn: 'রাসূলুল্লাহ (সা.) বলেছেন, "আল-খারাজ বিদ-দামান" অর্থাৎ সম্পদের মুনাফা ভোগ করতে হলে তার ক্ষতির দায়দায়িত্বও গ্রহণ করতে হবে। ঝুঁকিহীন নিশ্চিত অতিরিক্ত অর্থই সুদ।',
    explanationEn: 'The entitlement to profit is accompanied by liability for loss. Without risk-bearing, surplus amounts to forbidden interest.',
    reference: 'Sunan Abu Dawud / Tirmidhi (Sahih)'
  },
  {
    id: 4,
    part: 'DIB-1',
    subjectBn: 'মুশারাকা ও যৌথ মূলধনী ব্যবসা',
    subjectEn: 'Musharaka & Joint Financing',
    questionBn: 'মুশারাকা (Musharaka) ব্যবসায় কোনো আর্থিক ক্ষতি সংঘটিত হলে অংশীদারদের মাঝে তা কীভাবে বণ্টিত হবে?',
    questionEn: 'In a Musharaka venture, how must financial loss be distributed?',
    optionsBn: [
      'যে পরিচালনায় ছিল সে এককভাবে বহন করবে',
      'সকলের মাঝে সমান অনুপাতে (৫০:৫০) বণ্টিত হবে',
      'প্রত্যেক অংশীদারের বিনিয়োগকৃত মূলধনের সংখ্যানুপাতে (Pro-rata capital)',
      'সিনিয়র অংশীদার সম্পূর্ণ ক্ষতি পূরণ দেবে'
    ],
    optionsEn: [
      'The managing partner absorbs it completely',
      'Equally divided regardless of shares',
      'Strictly in proportion to capital contribution (Pro-rata)',
      'The senior partner reimburses the loss'
    ],
    correctIndex: 2,
    explanationBn: 'ইসলামী শরীয়াহর অলঙ্ঘনীয় নিয়ম: লাভ পারস্পরিক সম্মতিতে নির্ধারিত হারে হতে পারে, কিন্তু আর্থিক লোকসান অবশ্যই নিজ নিজ মূলধনের অনুপাতে বণ্টন করতে হবে।',
    explanationEn: 'While profit ratio can be mutually agreed, losses in Musharaka MUST strictly be shared in exact proportion to capital contributed.',
    reference: 'AAOIFI Standard No. 12 (Musharaka)'
  },
  {
    id: 5,
    part: 'DIB-2',
    subjectBn: 'আন্তর্জাতিক হিসাবরক্ষণ ও নিয়ন্ত্রক সংস্থা',
    subjectEn: 'International Accounting & Governance',
    questionBn: 'ইসলামিক আর্থিক প্রতিষ্ঠানের জন্য বিশ্বখ্যাত আন্তর্জাতিক সংস্থা AAOIFI-এর পূর্ণরূপ কী?',
    questionEn: 'What is the full form of AAOIFI?',
    optionsBn: [
      'Asian Association of Islamic Finance Institutes',
      'Accounting and Auditing Organization for Islamic Financial Institutions',
      'All Arab Organization for Islamic Finance and Investment',
      'Auditing Authority of International Fiqh Institutions'
    ],
    optionsEn: [
      'Asian Association of Islamic Finance Institutes',
      'Accounting and Auditing Organization for Islamic Financial Institutions',
      'All Arab Organization for Islamic Finance and Investment',
      'Auditing Authority of International Fiqh Institutions'
    ],
    correctIndex: 1,
    explanationBn: 'AAOIFI (বাহরাইনে প্রতিষ্ঠিত ১৯৯১ সালে) হলো বিশ্বব্যাপী ইসলামী ব্যাংক ও আর্থিক প্রতিষ্ঠানের জন্য শরীয়াহ, অডিটিং এবং অ্যাকাউন্টিং মানদণ্ড প্রণয়নকারী প্রধান আন্তর্জাতিক সংস্থা।',
    explanationEn: 'AAOIFI is the Accounting and Auditing Organization for Islamic Financial Institutions based in Manama, Bahrain.',
    reference: 'AAOIFI Governance Framework'
  },
  {
    id: 6,
    part: 'DIB-2',
    subjectBn: 'মুরাবাহা বিনিয়োগ পদ্ধতি',
    subjectEn: 'Murabaha Mechanics',
    questionBn: 'মুরাবাহা মুয়াজ্জাল (Murabaha Mu’ajjal) পদ্ধতিতে ব্যাংকের বিক্রয় বৈধ হওয়ার প্রধান শর্ত কোনটি?',
    questionEn: 'What is the critical prerequisite for a bank to execute a valid Murabaha sale to a client?',
    optionsBn: [
      'গ্রাহককে সরাসরি নগদ অর্থ হস্তান্তর করা',
      'পণ্যটি বিক্রেতার কাছ থেকে কিনে ব্যাংকের মালিকানা ও স্বত্ব (Ownership & Risk) প্রতিষ্ঠিত করা',
      'মুনাফার হার কেন্দ্রীয় ব্যাংকের চেয়ে বেশি রাখা',
      'কোনো জামানত গ্রহণ না করা'
    ],
    optionsEn: [
      'Disbursing cash directly to client',
      'Purchasing asset into bank’s constructive possession and assuming risk before sale',
      'Setting margin higher than repo rate',
      'Waiving collateral'
    ],
    correctIndex: 1,
    explanationBn: 'ইসলামে নিজের মালিকানা ও দখলের পূর্বে পণ্য বিক্রি বৈধ নয়। ব্যাংককে অবশ্যই সরবরাহকারীর কাছ থেকে পণ্য কিনে নিজস্ব ঝুঁকি গ্রহণের পরই গ্রাহকের কাছে মুনাফাসহ বাকিতে বিক্রি করতে হবে।',
    explanationEn: 'The bank must acquire legitimate title and constructive possession (risk) before executing the onward sale to the buyer.',
    reference: 'Bangladesh Bank Guidelines for Islamic Banking 2009'
  },
  {
    id: 7,
    part: 'DIB-2',
    subjectBn: 'সুকুক ও পুঁজিবাজার অর্থায়ন',
    subjectEn: 'Sukuk vs Conventional Bonds',
    questionBn: 'ইসলামিক সুকুক (Sukuk) এবং প্রচলিত সুদি বন্ডের (Bond) মধ্যকার মৌলিক পার্থক্য কী?',
    questionEn: 'What is the core distinction between Islamic Sukuk and conventional bonds?',
    optionsBn: [
      'সুকুকে কোনো মেয়াদ থাকে না',
      'সুকুক বাস্তব সম্পদের অবিভাজ্য অংশীদারিত্ব নির্দেশ করে, আর বন্ড হলো সুদি ঋণের দলিল',
      'সুকুকে মুনাফা সর্বদা শূন্য থাকে',
      'সুকুক কেবল সরকার ইস্যু করতে পারে'
    ],
    optionsEn: [
      'Sukuk has no maturity',
      'Sukuk represents undivided ownership in tangible underlying assets; bonds are interest-bearing debt certificates',
      'Sukuk has zero return',
      'Only sovereigns may issue Sukuk'
    ],
    correctIndex: 1,
    explanationBn: 'বন্ড হলো সুদভিত্তিক ঋণচুক্তি। পক্ষান্তরে সুকুক হলো নির্দিষ্ট ভৌত সম্পদ বা প্রকল্পের অবিভাজ্য মালিকানার শরীয়াহসম্মত সার্টিফিকেট, যার আয় আসে বৈধ সম্পদ ব্যবহারের মাধ্যমে।',
    explanationEn: 'Sukuk certificates represent undivided beneficial ownership in underlying tangible assets, usufruct, or services, not mere loans.',
    reference: 'AAOIFI Shariah Standard No. 17 (Investment Sukuk)'
  },
  {
    id: 8,
    part: 'DIB-2',
    subjectBn: 'ব্যাংক কোম্পানি আইন ও বিধিমালা',
    subjectEn: 'Banking Laws & Regulations',
    questionBn: 'বাংলাদেশে ব্যাংক কোম্পানি আইন ১৯৯১ এর কোন সংশোধনীতে ইসলামিক ব্যাংকিং কার্যক্রমের আইনি স্বীকৃতি জোরদার করা হয়?',
    questionEn: 'Which legal framework governs banking companies in Bangladesh?',
    optionsBn: [
      'ব্যাংক কোম্পানি আইন ১৯৯১ (Bank Company Act 1991)',
      'নেগোশিয়েবল ইনস্ট্রুমেন্টস অ্যাক্ট ১৮৮১',
      'কোম্পানি আইন ১৯৯৪',
      'অর্থঋণ আদালত আইন ২০০৩'
    ],
    optionsEn: [
      'Bank Company Act 1991',
      'Negotiable Instruments Act 1881',
      'Companies Act 1994',
      'Artha Rin Adalat Act 2003'
    ],
    correctIndex: 0,
    explanationBn: 'বাংলাদেশে সব বাণিজ্যিক ব্যাংকের জন্য ব্যাংক কোম্পানি আইন ১৯৯১ প্রধান আইনি ভিত্তি। বাংলাদেশ ব্যাংক এ আইনের আওতায় ইসলামী ব্যাংকিং নীতিমালা ও নির্দেশনা জারি করে থাকে।',
    explanationEn: 'The Bank Company Act 1991 is the primary statutory law governing banking institutions and Islamic banking windows in Bangladesh.',
    reference: 'Bank Company Act 1991 (Bangladesh)'
  }
];

interface PracticeMockTestProps {
  lang: 'bn' | 'en';
  onBackToLibrary: () => void;
}

export const PracticeMockTest: React.FC<PracticeMockTestProps> = ({ lang, onBackToLibrary }) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'DIB-1' | 'DIB-2'>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const filteredQuestions = mockQuestionsData.filter(q => {
    if (selectedFilter === 'ALL') return true;
    return q.part === selectedFilter;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || isTestFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          setIsTestFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isTestFinished]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIndex: number) => {
    if (isTestFinished) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
  };

  const toggleExplanation = (qId: number) => {
    setShowExplanation(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    filteredQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleRestart = () => {
    setUserAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
    setIsTestFinished(false);
    setTimerSeconds(600);
    setIsTimerRunning(true);
  };

  const score = calculateScore();
  const percentage = Math.round((score / filteredQuestions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-bengali">
      {/* Quiz Header & Mode Selector */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{lang === 'bn' ? 'ডিআইবি পরীক্ষা অনুশীলন মডিউল' : 'DIB Examination Practice Hub'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900">
              {lang === 'bn' ? 'মডেল টেস্ট ও সেলফ-অ্যাসেসমেন্ট কুইজ' : 'Mock Test & Knowledge Assessment'}
            </h1>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-bold ${
              timerSeconds < 120 
                ? 'bg-red-50 text-red-700 border-red-300 animate-pulse' 
                : 'bg-[#F8FAF5] text-[#14532D] border-stone-200'
            }`}>
              <Clock className="w-4 h-4 text-[#047857]" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
            <button
              onClick={handleRestart}
              title={lang === 'bn' ? 'পুনরায় শুরু করুন' : 'Restart Test'}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Segment (All vs Part 1 vs Part 2) */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">{lang === 'bn' ? 'মডিউল:' : 'Module:'}</span>
            <button
              onClick={() => { setSelectedFilter('ALL'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                selectedFilter === 'ALL' ? 'bg-[#047857] text-white shadow-2xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {lang === 'bn' ? 'সব প্রশ্ন (পার্ট ১ ও ২)' : 'All (Part 1 & 2)'}
            </button>
            <button
              onClick={() => { setSelectedFilter('DIB-1'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedFilter === 'DIB-1' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {lang === 'bn' ? 'ডিআইবি পার্ট-১' : 'DIB Part-1'}
            </button>
            <button
              onClick={() => { setSelectedFilter('DIB-2'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedFilter === 'DIB-2' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {lang === 'bn' ? 'ডিআইবি পার্ট-২' : 'DIB Part-2'}
            </button>
          </div>

          <div className="text-xs text-stone-500">
            {lang === 'bn' 
              ? `প্রশ্ন ${currentIndex + 1} / ${filteredQuestions.length}` 
              : `Question ${currentIndex + 1} of ${filteredQuestions.length}`}
          </div>
        </div>
      </div>

      {/* Main Question Card or Final Score View */}
      {!isTestFinished ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-8">
          {/* Question Tag */}
          <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              {currentQ.part} · {lang === 'bn' ? currentQ.subjectBn : currentQ.subjectEn}
            </span>
            <span className="text-stone-400">
              {lang === 'bn' ? `প্রশ্ন নং ${currentIndex + 1}` : `Q #${currentIndex + 1}`}
            </span>
          </div>

          {/* Question Title */}
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-6 leading-relaxed">
            {lang === 'bn' ? currentQ.questionBn : currentQ.questionEn}
          </h2>

          {/* Options List */}
          <div className="space-y-3 mb-6">
            {(lang === 'bn' ? currentQ.optionsBn : currentQ.optionsEn).map((opt, optIdx) => {
              const isSelected = userAnswers[currentQ.id] === optIdx;
              const hasAnswered = userAnswers[currentQ.id] !== undefined;
              const isCorrect = currentQ.correctIndex === optIdx;

              let style = 'border-stone-200 hover:border-emerald-600 hover:bg-stone-50 text-stone-800';
              if (isSelected) {
                style = isCorrect 
                  ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold' 
                  : 'border-red-400 bg-red-50/80 text-red-950 font-semibold';
              } else if (hasAnswered && isCorrect) {
                style = 'border-emerald-400 bg-emerald-50/40 text-emerald-900';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && (
                    isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Explanation / Citations */}
          {userAnswers[currentQ.id] !== undefined && (
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 mb-6 text-xs sm:text-sm">
              <div className="flex items-center justify-between font-bold text-emerald-900 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'bn' ? 'সঠিক উত্তর ও শরীয়াহ রেফারেন্স' : 'Explanation & Reference'}</span>
                </span>
                <span className="text-[11px] font-normal text-emerald-700">{currentQ.reference}</span>
              </div>
              <p className="text-stone-700 leading-relaxed font-bengali">
                {lang === 'bn' ? currentQ.explanationBn : currentQ.explanationEn}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                currentIndex === 0 
                  ? 'text-stone-300 cursor-not-allowed' 
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {lang === 'bn' ? 'পূর্ববর্তী প্রশ্ন' : 'Previous'}
            </button>

            {currentIndex < filteredQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>{lang === 'bn' ? 'পরবর্তী প্রশ্ন' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsTestFinished(true)}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-xs"
              >
                {lang === 'bn' ? 'টেস্ট সমাপ্ত করুন ও রেজাল্ট দেখুন' : 'Submit & View Score'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Result & Score Summary View */
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-xs mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            {lang === 'bn' ? 'মডেল টেস্ট ফলাফল' : 'Mock Test Result'}
          </h2>
          <p className="text-stone-600 text-sm mb-6">
            {lang === 'bn'
              ? `আপনি মোট ${filteredQuestions.length} টি প্রশ্নের মধ্যে ${score} টি সঠিক উত্তর দিয়েছেন।`
              : `You scored ${score} out of ${filteredQuestions.length} questions.`}
          </p>

          <div className="max-w-xs mx-auto bg-stone-50 rounded-2xl p-6 border border-stone-200 mb-8">
            <div className="text-4xl font-extrabold text-emerald-900 mb-1">
              {percentage}%
            </div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {percentage >= 60 
                ? (lang === 'bn' ? 'উত্তীর্ণ (পাস স্কোর)' : 'Passed') 
                : (lang === 'bn' ? 'আরো প্রস্তুতি প্রয়োজন' : 'Needs Practice')}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'bn' ? 'আবার পরীক্ষা দিন' : 'Retake Test'}</span>
            </button>
            <button
              onClick={onBackToLibrary}
              className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold rounded-xl transition-colors"
            >
              {lang === 'bn' ? 'পাঠাগারে ফিরে যান' : 'Back to Library'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
