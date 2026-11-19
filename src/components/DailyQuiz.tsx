import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Share2,
  ChevronRight,
  Sparkles,
  Users,
  HelpCircle,
  Home,
  Check
} from 'lucide-react';
import {
  bundledQuizQuestions,
  getTodayQuizSet,
  todayDateKey,
  type QuizQuestion
} from '../data/quizQuestions';
import { StorageService, type QuizDayStats } from '../services/storage';
import { toBengaliNumerals, GREGORIAN_MONTHS_BN, BENGALI_DAYS } from '../utils/dateUtils';

function todayDateBn(date: Date = new Date()): string {
  return `${BENGALI_DAYS[date.getDay()]}, ${toBengaliNumerals(date.getDate())} ${GREGORIAN_MONTHS_BN[date.getMonth()]} ${toBengaliNumerals(date.getFullYear())}`;
}

function scoreMessage(score: number, total: number, lang: 'bn' | 'en'): string {
  if (lang !== 'bn') {
    if (score === total) return 'Amazing! All correct.';
    if (score === total - 1) return 'Very good!';
    if (score >= 1) return 'Good effort!';
    return 'Try again!';
  }
  if (score === total) return 'অসাধারণ! সবগুলো সঠিক';
  if (score === total - 1) return 'খুব ভালো!';
  if (score >= 1) return 'ভালো চেষ্টা!';
  return 'আবার চেষ্টা করুন';
}

interface DailyQuizProps {
  lang: 'bn' | 'en';
  onBackToHome: () => void;
}

export const DailyQuiz: React.FC<DailyQuizProps> = ({ lang, onBackToHome }) => {
  const dateKey = useMemo(() => todayDateKey(), []);
  const [questions, setQuestions] = useState<QuizQuestion[]>(bundledQuizQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  // undefined = stats not loaded yet, null = quiz tables not set up (hide counts).
  const [stats, setStats] = useState<QuizDayStats | null | undefined>(undefined);
  const [shareToast, setShareToast] = useState(false);
  // Attempts recorded in this mount — a replay must never count twice.
  const recordedRef = useRef<Set<string>>(new Set());

  const todaySet = useMemo(() => getTodayQuizSet(questions), [questions]);
  const currentQ = todaySet[currentIndex];

  // Merge admin-added questions (if the quiz tables exist) after the bundled 30.
  useEffect(() => {
    let mounted = true;
    StorageService.getQuizQuestions().then(({ questions: dbQuestions }) => {
      if (mounted && dbQuestions.length > 0) {
        setQuestions([...bundledQuizQuestions, ...dbQuestions]);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const refreshStats = (ids: string[]) => {
    StorageService.getTodayQuizStats(ids, dateKey).then((s) => setStats(s));
  };

  useEffect(() => {
    if (todaySet.length > 0) {
      refreshStats(todaySet.map((q) => q.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todaySet]);

  const score = useMemo(() => {
    return todaySet.filter((q) => answers[q.id] === q.correctIndex).length;
  }, [answers, todaySet]);

  const handleSelectOption = (optIdx: number) => {
    if (!currentQ || isFinished) return;
    if (answers[currentQ.id] !== undefined) return; // one answer per question
    const isCorrect = optIdx === currentQ.correctIndex;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
    // Record once per (question, session, day). The service also guards
    // with sessionStorage + a UNIQUE constraint, so a replay is safe.
    if (!recordedRef.current.has(currentQ.id)) {
      recordedRef.current.add(currentQ.id);
      StorageService.recordQuizAttempt(currentQ.id, isCorrect, dateKey).then(() => {
        refreshStats(todaySet.map((q) => q.id));
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < todaySet.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    // Restart only resets the local answers — recorded attempts are never
    // re-inserted (recordedRef + sessionStorage guard + UNIQUE constraint).
    setAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/quiz` : '';
    const text = lang === 'bn'
      ? `আজকের কুইজে আমি ${toBengaliNumerals(todaySet.length)}টির মধ্যে ${toBengaliNumerals(score)}টি সঠিক উত্তর দিয়েছি! আপনিও চেষ্টা করুন: ${url}`
      : `I got ${score} out of ${todaySet.length} right in today's quiz! Try it: ${url}`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'আজকের কুইজ', text, url });
        return;
      }
      throw new Error('share unavailable');
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      } catch {
        // clipboard unavailable — nothing to do
      }
    }
  };

  const participantsLine = () => {
    if (stats === undefined || stats === null) return null;
    if (stats.participants === 0) {
      return lang === 'bn'
        ? 'এখনো কেউ অংশ নেয়নি — প্রথম হোন!'
        : 'Nobody has played yet — be the first!';
    }
    return lang === 'bn'
      ? `আজ ${toBengaliNumerals(stats.participants)} জন অংশ নিয়েছে`
      : `${stats.participants} people played today`;
  };

  const answeredPercentLine = (q: QuizQuestion) => {
    if (!stats) return null;
    const row = stats.perQuestion[q.id];
    if (!row || row.total === 0) return null;
    const pct = Math.round((row.correct / row.total) * 100);
    return lang === 'bn'
      ? `আজ ${toBengaliNumerals(pct)}% সঠিক উত্তর দিয়েছে`
      : `${pct}% answered correctly today`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-bengali">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{lang === 'bn' ? 'প্রতিদিনের ইসলামি কুইজ' : 'Daily Islamic Quiz'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900">
              {lang === 'bn' ? 'আজকের কুইজ' : "Today's Quiz"}
            </h1>
            <p className="text-xs text-stone-500 mt-1">{todayDateBn()}</p>
          </div>
          <button
            onClick={onBackToHome}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{lang === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 mt-4 border-t border-stone-100">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>
              {lang === 'bn'
                ? `${toBengaliNumerals(todaySet.length)}টি সহজ প্রশ্ন`
                : `${todaySet.length} easy questions`}
            </span>
          </span>
          {participantsLine() && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200 text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>{participantsLine()}</span>
            </span>
          )}
        </div>
      </div>

      {!isFinished && currentQ ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              {currentQ.topic}
            </span>
            <span>
              {lang === 'bn'
                ? `প্রশ্ন ${toBengaliNumerals(currentIndex + 1)} / ${toBengaliNumerals(todaySet.length)}`
                : `Question ${currentIndex + 1} of ${todaySet.length}`}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden mb-6">
            <div
              className="h-full bg-[#047857] rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / todaySet.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-6 leading-relaxed">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, optIdx) => {
              const selected = answers[currentQ.id];
              const hasAnswered = selected !== undefined;
              const isSelected = selected === optIdx;
              const isCorrect = currentQ.correctIndex === optIdx;

              let style = 'border-stone-200 hover:border-emerald-600 hover:bg-stone-50 text-stone-800';
              if (hasAnswered) {
                if (isSelected) {
                  style = isCorrect
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold'
                    : 'border-red-400 bg-red-50/80 text-red-950 font-semibold';
                } else if (isCorrect) {
                  style = 'border-emerald-400 bg-emerald-50/40 text-emerald-900';
                } else {
                  style = 'border-stone-200 text-stone-500';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm ${style} ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && (
                    isCorrect
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      : <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  {!isSelected && hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant feedback */}
          {answers[currentQ.id] !== undefined && (
            <div
              className={`p-4 rounded-xl border mb-6 text-xs sm:text-sm ${
                answers[currentQ.id] === currentQ.correctIndex
                  ? 'bg-emerald-50/60 border-emerald-200/80'
                  : 'bg-red-50/60 border-red-200/80'
              }`}
            >
              <div className={`font-bold mb-1.5 flex items-center gap-1.5 ${
                answers[currentQ.id] === currentQ.correctIndex ? 'text-emerald-900' : 'text-red-900'
              }`}>
                {answers[currentQ.id] === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{lang === 'bn' ? 'অভিনন্দন! সঠিক উত্তর' : 'Congratulations! Correct answer'}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>
                      {lang === 'bn'
                        ? `সঠিক উত্তর: ${currentQ.options[currentQ.correctIndex]}`
                        : `Correct answer: ${currentQ.options[currentQ.correctIndex]}`}
                    </span>
                  </>
                )}
              </div>
              {currentQ.explanation && (
                <p className="text-stone-700 leading-relaxed">{currentQ.explanation}</p>
              )}
              {answeredPercentLine(currentQ) && (
                <p className="text-stone-500 mt-2 font-semibold">{answeredPercentLine(currentQ)}</p>
              )}
            </div>
          )}

          {/* Next */}
          <div className="flex items-center justify-end pt-4 border-t border-stone-100">
            <button
              onClick={handleNext}
              disabled={answers[currentQ.id] === undefined}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs ${
                answers[currentQ.id] === undefined
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white cursor-pointer'
              }`}
            >
              <span>
                {currentIndex < todaySet.length - 1
                  ? (lang === 'bn' ? 'পরের প্রশ্ন' : 'Next Question')
                  : (lang === 'bn' ? 'ফলাফল দেখুন' : 'View Result')}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Result screen */
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-xs">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            {lang === 'bn' ? 'কুইজের ফলাফল' : 'Quiz Result'}
          </h2>
          <p className="text-stone-600 text-sm mb-1">
            {lang === 'bn'
              ? `আপনি ${toBengaliNumerals(todaySet.length)}টির মধ্যে ${toBengaliNumerals(score)}টি সঠিক উত্তর দিয়েছেন।`
              : `You got ${score} out of ${todaySet.length} right.`}
          </p>
          <p className="text-emerald-800 font-bold text-base mb-6">
            {scoreMessage(score, todaySet.length, lang)}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleShare}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ফলাফল শেয়ার করুন' : 'Share Result'}</span>
            </button>
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'bn' ? 'আবার খেলুন' : 'Play Again'}</span>
            </button>
            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{lang === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}</span>
            </button>
          </div>

          {shareToast && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ফলাফল কপি হয়েছে — শেয়ার করুন!' : 'Result copied — share it!'}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// --- Homepage card: "আজকের কুইজ" ---

interface QuizHomeCardProps {
  lang: 'bn' | 'en';
  onOpenQuiz: () => void;
}

export const QuizHomeCard: React.FC<QuizHomeCardProps> = ({ lang, onOpenQuiz }) => {
  const dateKey = useMemo(() => todayDateKey(), []);
  // undefined = not loaded yet, null = quiz tables not set up (hide counts).
  const [participants, setParticipants] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    StorageService.getQuizQuestions().then(({ questions: dbQuestions }) => {
      const merged = dbQuestions.length > 0
        ? [...bundledQuizQuestions, ...dbQuestions]
        : bundledQuizQuestions;
      const todaySet = getTodayQuizSet(merged);
      StorageService.getTodayQuizStats(todaySet.map((q) => q.id), dateKey).then((s) => {
        if (mounted) setParticipants(s ? s.participants : null);
      });
    });
    return () => {
      mounted = false;
    };
  }, [dateKey]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 font-bengali">
      <div className="rounded-2xl border border-emerald-900/20 bg-gradient-to-l from-[#047857] to-[#065f46] p-6 sm:p-8 shadow-sm text-white overflow-hidden relative">
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -right-2 top-16 w-16 h-16 rounded-full bg-[#D4AF37]/15" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37] text-emerald-950 text-[11px] font-bold mb-2">
              <Sparkles className="w-3 h-3" />
              <span>{lang === 'bn' ? 'প্রতিদিন নতুন' : 'New every day'}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">
              {lang === 'bn' ? 'আজকের কুইজ' : "Today's Quiz"}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-50/90 mt-1 leading-relaxed">
              {lang === 'bn'
                ? 'প্রতিদিন ৩টি সহজ প্রশ্ন — ইসলাম, যাকাত ও ইসলামী ব্যাংকিং নিয়ে। সঠিক হলে অভিনন্দন, ভুল হলে সঠিক উত্তরটাই শিখে নিন।'
                : 'Three easy questions every day — Islam, Zakat and Islamic banking. Get a congratulation when right, learn the answer when wrong.'}
            </p>
            {participants !== undefined && participants !== null && (
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-200 mt-2">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {participants === 0
                    ? (lang === 'bn' ? 'এখনো কেউ অংশ নেয়নি — প্রথম হোন!' : 'Nobody has played yet — be the first!')
                    : (lang === 'bn'
                      ? `আজ ${toBengaliNumerals(participants)} জন অংশ নিয়েছে`
                      : `${participants} people played today`)}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={onOpenQuiz}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-900 text-sm font-bold shadow-sm hover:bg-amber-50 transition-colors cursor-pointer"
          >
            <span>{lang === 'bn' ? 'কুইজ দিন' : 'Take the Quiz'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
