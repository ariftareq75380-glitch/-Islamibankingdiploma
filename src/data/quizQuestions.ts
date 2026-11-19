// Daily quiz question bank — approved by the site owner on 2026-11-19.
// Source of truth: ~/workspace/your_files/quiz-question-bank.md
// Do NOT change wording, answers or explanations here; new questions are
// added from the admin panel and stored in the `quiz_questions` table.

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_SET_SIZE = 3;

// Rotation epoch: the first day of the quiz. Every visitor sees the same
// 3 questions on a given day, and the sets cycle every ceil(N / 3) days.
const QUIZ_EPOCH = new Date(2026, 10, 19); // 19 Nov 2026 (local midnight)

export const bundledQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'ইসলামের মৌলিক বিষয়',
    question: 'ঈমান অর্থ কী?',
    options: ['বিশ্বাস করা', 'নামাজ পড়া', 'রোজা রাখা', 'হজ করা'],
    correctIndex: 0,
    explanation: 'ঈমান অর্থ অন্তরে বিশ্বাস করা ও মুখে স্বীকার করা।'
  },
  {
    id: 'q2',
    topic: 'ইসলামের মৌলিক বিষয়',
    question: 'ইসলাম অর্থ কী?',
    options: ['আত্মসমর্পণ', 'যুদ্ধ', 'ব্যবসা', 'রাজনীতি'],
    correctIndex: 0,
    explanation: 'ইসলাম অর্থ আল্লাহর নির্দেশের কাছে আত্মসমর্পণ করা।'
  },
  {
    id: 'q3',
    topic: 'ইসলামের মৌলিক বিষয়',
    question: 'ইসলামের মূল ভিত্তি কয়টি?',
    options: ['৩টি', '৪টি', '৫টি', '৬টি'],
    correctIndex: 2,
    explanation: 'কালেমা, নামাজ, রোজা, যাকাত ও হজ — এই ৫টি।'
  },
  {
    id: 'q4',
    topic: 'ইসলামের মৌলিক বিষয়',
    question: 'ঈমানের মূল ভিত্তি কয়টি?',
    options: ['৫টি', '৬টি', '৭টি', '৪টি'],
    correctIndex: 1,
    explanation: 'আল্লাহ, ফেরেশতা, আসমানি কিতাব, রাসূল, আখিরাত ও তাকদির।'
  },
  {
    id: 'q5',
    topic: 'ইসলামের মৌলিক বিষয়',
    question: 'প্রথম কালেমা কোনটি?',
    options: [
      'লা ইলাহা ইল্লাল্লাহু মুহাম্মাদুর রাসূলুল্লাহ',
      'সুবহানাল্লাহ',
      'আলহামদুলিল্লাহ',
      'আল্লাহু আকবর'
    ],
    correctIndex: 0,
    explanation: ''
  },
  {
    id: 'q6',
    topic: 'ইসলামের মৌলিক বিষয়',
    question: 'পবিত্র কুরআন কোন ভাষায় নাজিল হয়েছে?',
    options: ['ফারসি', 'আরবি', 'উর্দু', 'হিব্রু'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q7',
    topic: 'ইসলামের মৌলিক বিষয়',
    question: 'মুসলমানদের প্রথম কিবলা কোনটি?',
    options: ['কাবা শরিফ', 'মসজিদে নববি', 'বায়তুল মুকাদ্দাস', 'মসজিদুল হারাম'],
    correctIndex: 2,
    explanation: 'প্রথমে বায়তুল মুকাদ্দাসের দিকে নামাজ পড়া হতো, পরে কাবার দিকে ফিরে যাওয়া হয়।'
  },
  {
    id: 'q8',
    topic: 'যাকাত',
    question: 'যাকাত শব্দের অর্থ কী?',
    options: ['কর দেওয়া', 'বৃদ্ধি ও পবিত্রতা', 'দান করা', 'সঞ্চয় করা'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q9',
    topic: 'যাকাত',
    question: 'যাকাতের খাত কয়টি?',
    options: ['৫টি', '৬টি', '৭টি', '৮টি'],
    correctIndex: 3,
    explanation: 'সূরা তাওবার ৬০ নম্বর আয়াতে ৮টি খাতের কথা আছে।'
  },
  {
    id: 'q10',
    topic: 'যাকাত',
    question: 'যাকাতের প্রথম খাত কোনটি?',
    options: ['মিসকিন', 'ফকির', 'মুসাফির', 'ঋণগ্রস্ত'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q11',
    topic: 'যাকাত',
    question: 'নগদ টাকা ও ব্যবসার পণ্যের যাকাতের হার কত?',
    options: ['৫%', '২.৫%', '১০%', '২০%'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q12',
    topic: 'যাকাত',
    question: 'সোনার নিসাব কত?',
    options: ['৫ ভরি', '৭.৫ ভরি', '১০ ভরি', '৫২.৫ ভরি'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q13',
    topic: 'যাকাত',
    question: 'রূপার নিসাব কত?',
    options: ['৭.৫ ভরি', '৫২.৫ ভরি', '২০ ভরি', '১০ ভরি'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q14',
    topic: 'যাকাত',
    question: 'যাকাত বছরে কয়বার দিতে হয়?',
    options: ['প্রতি মাসে', 'একবার', 'দুইবার', 'প্রতি সপ্তাহে'],
    correctIndex: 1,
    explanation: 'নিসাব পরিমাণ সম্পদের উপর এক চন্দ্র বছর পূর্ণ হলে বছরে একবার যাকাত ফরজ হয়।'
  },
  {
    id: 'q15',
    topic: 'যাকাত',
    question: 'যাকাত কাদের উপর ফরজ?',
    options: [
      'সব মুসলমানের উপর',
      'নিসাব পরিমাণ সম্পদের মালিক মুসলমানের উপর',
      'শুধু ব্যবসায়ীদের উপর',
      'শুধু ধনীদের উপর'
    ],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q16',
    topic: 'ইসলামী ব্যাংকিং',
    question: 'মুদারাবা কাকে বলে?',
    options: [
      'দুজনে মূলধন দেবে',
      'একজন মূলধন দেবে, আরেকজন শ্রম দেবে',
      'সুদে টাকা ধার দেওয়া',
      'ভাড়ায় সম্পদ দেওয়া'
    ],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q17',
    topic: 'ইসলামী ব্যাংকিং',
    question: 'মুশারাকা কাকে বলে?',
    options: [
      'একজন মূলধন, আরেকজন শ্রম',
      'সবাই মূলধন দেবে, লাভ-ক্ষতি ভাগ হবে',
      'কিস্তিতে বিক্রি',
      'অগ্রিম টাকা দেওয়া'
    ],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q18',
    topic: 'ইসলামী ব্যাংকিং',
    question: 'ইসলামী ব্যাংকে সুদের বদলে কী থাকে?',
    options: ['লাভ-ক্ষতির ভাগাভাগি', 'বেশি সুদ', 'কম সুদ', 'কিছুই থাকে না'],
    correctIndex: 0,
    explanation: ''
  },
  {
    id: 'q19',
    topic: 'ইসলামী ব্যাংকিং',
    question: 'রিবা অর্থ কী?',
    options: ['লাভ', 'সুদ', 'ভাড়া', 'কর'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q20',
    topic: 'ইসলামী ব্যাংকিং',
    question: 'মুরাবাহা কী?',
    options: [
      'খরচের সাথে লাভ যোগ করে কিস্তিতে বিক্রি',
      'সুদে ধার দেওয়া',
      'ভাড়ায় দেওয়া',
      'দান করা'
    ],
    correctIndex: 0,
    explanation: ''
  },
  {
    id: 'q21',
    topic: 'ইসলামী ব্যাংকিং',
    question: 'ইজারা অর্থ কী?',
    options: ['বিক্রি', 'ভাড়া', 'ধার', 'জামানত'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q22',
    topic: 'ইসলামী ব্যাংকিং',
    question: 'ইসলামী ব্যাংকের শরিয়াহ দেখভাল কে করে?',
    options: ['বাংলাদেশ ব্যাংক', 'শরিয়াহ সুপারভাইজরি কমিটি', 'পরিচালনা পর্ষদ', 'অডিটর'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q23',
    topic: 'ইসলামী ব্যাংকিং',
    question: 'বাই-মুয়াজ্জাল কী?',
    options: ['নগদে বিক্রি', 'বাকিতে বিক্রি', 'অগ্রিম বিক্রি', 'ভাড়ায় দেওয়া'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q24',
    topic: 'ইসলামী ব্যাংকিং',
    question: 'সালাম কী?',
    options: [
      'অগ্রিম মূল্য দিয়ে ভবিষ্যতে পণ্য কেনা',
      'বাকিতে কেনা',
      'নগদে কেনা',
      'ভাড়ায় নেওয়া'
    ],
    correctIndex: 0,
    explanation: ''
  },
  {
    id: 'q25',
    topic: 'ইসলামী অর্থনীতি',
    question: 'ইসলামে সুদ কেমন?',
    options: ['হালাল', 'হারাম', 'মাকরুহ', 'জায়েজ'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q26',
    topic: 'ইসলামী অর্থনীতি',
    question: 'হালাল উপার্জন অর্থ কী?',
    options: ['যেকোনোভাবে উপার্জন', 'বৈধ পথে উপার্জন', 'বেশি উপার্জন', 'কম উপার্জন'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q27',
    topic: 'ইসলামী অর্থনীতি',
    question: 'সদকা আর যাকাতের পার্থক্য কী?',
    options: ['দুটোই ফরজ', 'যাকাত ফরজ, সদকা নফল', 'দুটোই নফল', 'কোনো পার্থক্য নেই'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q28',
    topic: 'ইসলামী অর্থনীতি',
    question: 'যাকাত দেওয়ার মূল উদ্দেশ্য কী?',
    options: [
      'সম্পদ পবিত্র করা ও দরিদ্রদের সাহায্য করা',
      'কর দেওয়া',
      'সম্পদ বাড়ানো',
      'নাম করা'
    ],
    correctIndex: 0,
    explanation: ''
  },
  {
    id: 'q29',
    topic: 'ইসলামী অর্থনীতি',
    question: 'ইসলামী অর্থনীতির মূল নীতি কী?',
    options: ['সুদভিত্তিক লেনদেন', 'সুদমুক্ত লেনদেন ও ন্যায়বিচার', 'মুনাফা বাড়ানো', 'কর কমানো'],
    correctIndex: 1,
    explanation: ''
  },
  {
    id: 'q30',
    topic: 'ইসলামী অর্থনীতি',
    question: 'ইসলামী ব্যাংকে গ্রাহকের জমা টাকা কী হিসেবে থাকে?',
    options: ['সুদি ঋণ', 'আমানত বা মুদারাবা', 'সরকারি কর', 'শেয়ার'],
    correctIndex: 1,
    explanation: ''
  }
];

// Local YYYY-MM-DD key for "today" (used as answered_date).
export function todayDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Deterministic daily set: everyone sees the same 3 questions on a given
// day. Sets cycle every ceil(questions.length / 3) days. When the merged
// list is not a multiple of 3, the last set wraps around so the quiz
// always shows exactly 3 questions.
export function getTodayQuizSet(
  questions: QuizQuestion[],
  date: Date = new Date()
): QuizQuestion[] {
  if (!questions || questions.length === 0) return [];
  const todayMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayIndex = Math.max(0, Math.floor((todayMidnight - QUIZ_EPOCH.getTime()) / 86400000));
  const setCount = Math.ceil(questions.length / QUIZ_SET_SIZE);
  const setIndex = dayIndex % setCount;
  const start = setIndex * QUIZ_SET_SIZE;
  const picked: QuizQuestion[] = [];
  for (let i = 0; i < QUIZ_SET_SIZE; i++) {
    picked.push(questions[(start + i) % questions.length]);
  }
  return picked;
}
