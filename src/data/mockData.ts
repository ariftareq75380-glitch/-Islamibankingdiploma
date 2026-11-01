import { PdfResource, Article, CategoryInfo, SiteSettings } from '../types';

export const initialSiteSettings: SiteSettings = {
  siteName: 'Islami Banking Diploma',
  siteNameBn: 'ইসলামী ব্যাংকিং ডিপ্লোমা',
  subtitle: 'Educational PDF Library & Research Hub for DIB Examinations',
  subtitleBn: 'আইবিবি ডিআইবি পরীক্ষার বিগত প্রশ্ন, সমাধান ও স্টাডি হ্যান্ডনোট পাঠাগার',
  noticeText: 'Upcoming 99th Diploma in Islamic Banking (DIB) Examination registration guidelines and model solutions are now available for download.',
  noticeTextBn: 'আসন্ন ৯৯তম ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB) পরীক্ষার সহায়িকা ও বিগত বছরের সমাধান নোটস এখন ডাউনলোডযোগ্য।',
  contactEmail: 'contact@islamibankingdiploma.org',
  contactPhone: '+880 1712-345678',
  officeAddress: 'Motijheel Commercial Area, Dhaka-1000, Bangladesh',
  enableAdPlacements: true,
  adsensePublisherId: 'ca-pub-9876543210123456'
};

export const samplePdfResources: PdfResource[] = [
  {
    id: 'dib-2024-may-q1',
    title: '97th DIB Exam: Islamic Economics and Principles of Islamic Banking',
    titleBn: '৯৭তম ডিআইবি পরীক্ষা: ইসলামিক অর্থনীতি এবং ইসলামিক ব্যাংকিং নীতিমালা (প্রশ্ন ও সমাধান)',
    subject: 'Islamic Economics & Banking Principles',
    subjectBn: 'ইসলামিক অর্থনীতি ও ব্যাংকিং নীতিমালা',
    course: 'DIB-1',
    examYear: '2024',
    examSession: 'May',
    sessionBangla: 'মে ২০২৪ (৯৭তম পরীক্ষা)',
    language: 'bilingual',
    description: 'Comprehensive question paper and detailed handwritten & typed solutions with citations from Quran, Sunnah, and AAOIFI standards. Includes comparative analysis of conventional interest vs Islamic profit distribution.',
    descriptionBn: '৯৭তম ডিপ্লোমা ইন ইসলামিক ব্যাংকিং পরীক্ষার পূর্ণাঙ্গ প্রশ্ন এবং ব্যাখ্যাসহ বিস্তারিত মডেল সমাধান। কুরআন, সুন্নাহ এবং এএওআইএফআই (AAOIFI) রেফারেন্সসহ উত্তর প্রস্তুতকৃত।',
    category: 'Solved-Answer',
    categoryBn: 'সমাধানকৃত প্রশ্নপত্র',
    tags: ['DIB Part 1', 'IBB', 'Islamic Economics', '2024', 'May Session', 'Riba vs Profit'],
    pdfFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    googleDriveUrl: 'https://drive.google.com/file/d/1SAMPLE_DIB_2024_MAY_Q1/view?usp=sharing',
    fileSize: '3.8 MB',
    pageCount: 32,
    publicationDate: '2024-06-15',
    downloadsCount: 1842,
    viewsCount: 4290,
    isPopular: true,
    isFeatured: true,
    previewSupported: true,
    slug: '97th-dib-islamic-economics-banking-principles',
    thumbnailUrl: '/images/banner_bangladesh_banking_1793322325377.webp',
    keywords: ['97th DIB Exam', 'Islamic Economics', 'DIB Part 1', 'মে ২০২৪ ডিআইবি পরীক্ষা', 'ইসলামিক অর্থনীতি'],
    keyTopics: ['Definition of Islamic Economics', 'Tawhid in Wealth Distribution', 'Riba-an-Nasiyah vs Riba-al-Fadl', 'Role of Central Bank in Islamic Banking']
  },
  {
    id: 'dib-2023-nov-q2',
    title: '96th DIB Exam: Investment Modes (Mudaraba, Musharaka, Murabaha)',
    titleBn: '৯৬তম ডিআইবি পরীক্ষা: ইসলামিক বিনিয়োগ পদ্ধতি (মুদারাবা, মুশারাকা ও মুরাবাহা)',
    subject: 'Investment Modes & Asset Financing',
    subjectBn: 'বিনিয়োগ পদ্ধতি ও সম্পদ অর্থায়ন',
    course: 'DIB-1',
    examYear: '2023',
    examSession: 'November',
    sessionBangla: 'নভেম্বর ২০২৩ (৯৬তম পরীক্ষা)',
    language: 'bilingual',
    description: 'Past exam paper with step-by-step mathematical problem solutions on Profit and Loss Sharing (PLS) ratio calculation, Murabaha mark-up pricing, and risk mitigations under Bangladesh Bank guidelines.',
    descriptionBn: 'মুনাফা-ক্ষতি বণ্টন অনুপাত নির্ণয়, মুরাবাহা মূল্যায়নের গাণিতিক সমস্যা এবং বাংলাদেশ ব্যাংক গাইডলাইন অনুযায়ী ঝুঁকি ব্যবস্থাপনার বিশদ বিশ্লেষণ।',
    category: 'Solved-Answer',
    categoryBn: 'সমাধানকৃত প্রশ্নপত্র',
    tags: ['Mudaraba', 'Musharaka', 'Murabaha', 'Math Solutions', 'DIB Part 1', '2023'],
    pdfFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    googleDriveUrl: 'https://drive.google.com/file/d/1SAMPLE_DIB_2023_NOV_Q2/view',
    fileSize: '4.2 MB',
    pageCount: 44,
    publicationDate: '2023-12-20',
    downloadsCount: 2310,
    viewsCount: 5120,
    isPopular: true,
    isFeatured: true,
    previewSupported: true,
    slug: '96th-dib-investment-modes-mudaraba-musharaka',
    thumbnailUrl: '/images/category_diploma_banking_1793322326189.webp',
    keywords: ['96th DIB Exam', 'Mudaraba', 'Musharaka', 'Murabaha', 'ডিআইবি বিনিয়োগ পদ্ধতি', 'DIB Math Solutions'],
    keyTopics: ['Mudaraba Capital Loss Rules', 'Musharaka Mutanaqisa for Home Finance', 'Murabaha Delivery & Ownership Risk']
  },
  {
    id: 'dib-2023-may-law',
    title: '95th DIB Exam: Laws & Regulations Governing Islamic Banks in Bangladesh',
    titleBn: '৯৫তম ডিআইবি পরীক্ষা: বাংলাদেশে ইসলামিক ব্যাংকিং পরিচালনাকারী আইন ও বিধিমালার প্রশ্ন-উত্তর',
    subject: 'Banking Laws & Regulations',
    subjectBn: 'ব্যাংকিং আইন ও নীতিমালা',
    course: 'DIB-2',
    examYear: '2023',
    examSession: 'May',
    sessionBangla: 'মে ২০২৩ (৯৫তম পরীক্ষা)',
    language: 'bn',
    description: 'Bank Company Act 1991 (applicable Islamic sections), Bangladesh Bank 2009 Guidelines on Islamic Banking, Shariah Supervisory Board responsibilities and statutory penalties.',
    descriptionBn: 'ব্যাংক কোম্পানি আইন ১৯৯১, বাংলাদেশ ব্যাংকের ২০০৯ সালের ইসলামী ব্যাংকিং নীতিমালা এবং শরীয়াহ সুপারভাইজরি কমিটির আইনি দায়দায়িত্ব সম্পর্কিত পূর্ণাঙ্গ নোট ও বিগত পরীক্ষার উত্তর।',
    category: 'Question-Paper',
    categoryBn: 'বিগত বছরের প্রশ্নপত্র',
    tags: ['Bank Company Act 1991', 'Bangladesh Bank Circulars', 'DIB Part 2', 'Legal Framework'],
    pdfFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '2.9 MB',
    pageCount: 28,
    publicationDate: '2023-06-10',
    downloadsCount: 1420,
    viewsCount: 3100,
    isPopular: false,
    isFeatured: false,
    previewSupported: true,
    slug: '95th-dib-banking-laws-regulations-bangladesh',
    thumbnailUrl: '/images/banner_bangladesh_banking_1793322325377.webp',
    keywords: ['Bank Company Act 1991', 'DIB Part 2', 'ব্যাংক কোম্পানি আইন', 'বাংলাদেশ ব্যাংক সার্কুলার'],
    keyTopics: ['Section 7(a) Bank Company Act', 'Role of CSBIB', 'Statutory Liquidity Reserve (SLR) in Islamic Banks']
  },
  {
    id: 'dib-2022-nov-acc',
    title: '94th DIB Exam: Accounting and Auditing in Islamic Financial Institutions',
    titleBn: '৯৪তম ডিআইবি পরীক্ষা: ইসলামিক ব্যাংকের হিসাববিজ্ঞান ও নিরীক্ষা পদ্ধতি (প্রশ্ন ও সমাধান)',
    subject: 'Accounting & Auditing (AAOIFI)',
    subjectBn: 'হিসাববিজ্ঞান ও নিরীক্ষা (AAOIFI)',
    course: 'DIB-2',
    examYear: '2022',
    examSession: 'November',
    sessionBangla: 'নভেম্বর ২০২২ (৯৪তম পরীক্ষা)',
    language: 'en',
    description: 'Comprehensive solutions on AAOIFI Financial Accounting Standards (FAS) 1, FAS 28 (Murabaha deferred profits), and Shariah governance audit checklists for internal Shariah auditors.',
    descriptionBn: 'এএওআইএফআই ফিন্যান্সিয়াল অ্যাকাউন্টিং স্ট্যান্ডার্ড (FAS) ১ ও ২৮ এর আলোকে জার্নাল এন্ট্রি, ব্যালেন্স শিট উপস্থাপনা এবং অভ্যন্তরীণ শরীয়াহ নিরীক্ষার মডেল উত্তর।',
    category: 'Solved-Answer',
    categoryBn: 'সমাধানকৃত প্রশ্নপত্র',
    tags: ['AAOIFI Standards', 'Financial Accounting', 'Auditing', 'DIB Part 2'],
    pdfFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    googleDriveUrl: 'https://drive.google.com/file/d/1SAMPLE_DIB_ACC_2022/view',
    fileSize: '5.1 MB',
    pageCount: 52,
    publicationDate: '2022-12-18',
    downloadsCount: 1950,
    viewsCount: 3870,
    isPopular: true,
    isFeatured: false,
    previewSupported: true,
    keyTopics: ['FAS 1 Presentation', 'Deferred Profit Accounting', 'Profit Equalization Reserve (PER)']
  },
  {
    id: 'dib-study-guide-complete',
    title: 'Complete Master Study Guide: Diploma in Islamic Banking (Part 1 & 2)',
    titleBn: 'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (পার্ট-১ ও পার্ট-২) পূর্ণাঙ্গ মাস্টার স্টাডি গাইড ও হ্যান্ডনোট',
    subject: 'All DIB Subjects Comprehensive',
    subjectBn: 'ডিআইবি সকল বিষয়ের সমন্বিত গাইড',
    course: 'DIB-General',
    examYear: '2024',
    examSession: 'Special',
    sessionBangla: 'বিশেষ সংস্করণ ২০২৪',
    language: 'bilingual',
    description: 'Comprehensive 180-page compiled handbook containing topic-wise summaries, repetitive questions analysis of the past 10 years (88th to 97th exams), key formulas, and exam tips.',
    descriptionBn: 'বিগত ১০ বছরের (৮৮তম থেকে ৯৭তম) গুরুত্বপূর্ণ প্রশ্নাবলির ট্রেন্ড অ্যানালাইসিস, অধ্যায়ভিত্তিক সারসংক্ষেপ ও সহজ বোধগম্য বাংলায় প্রস্তুতকৃত মাস্টার নোটস।',
    category: 'Study-Notes',
    categoryBn: 'স্টাডি নোটস ও সহায়িকা',
    tags: ['Master Guide', 'DIB Part 1 & 2', 'Exam Tips', 'Short Notes', 'High Yield'],
    pdfFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1SAMPLE_MASTER_GUIDE',
    fileSize: '12.4 MB',
    pageCount: 180,
    publicationDate: '2024-01-10',
    downloadsCount: 5410,
    viewsCount: 12400,
    isPopular: true,
    isFeatured: true,
    previewSupported: true,
    keyTopics: ['10 Year Exam Frequency Chart', 'Key Arabic Terminology Glossary', 'Model Answers for 20-mark Questions']
  },
  {
    id: 'res-aaoifi-bengali',
    title: 'AAOIFI Shariah Standards: Concise Bengali Translation & Explanatory Guide',
    titleBn: 'এএওআইএফআই (AAOIFI) শরীয়াহ মানদণ্ড: সহজ বাংলা সারসংক্ষেপ ও ব্যাংকিং ব্যাখ্যা',
    subject: 'International Shariah Standards',
    subjectBn: 'আন্তর্জাতিক শরীয়াহ মানদণ্ড',
    course: 'Islamic-Banking',
    examYear: '2023',
    examSession: 'All',
    sessionBangla: 'সার্বজনীন রেফারেন্স',
    language: 'bn',
    description: 'Detailed translation and banking application of AAOIFI Standard No. 8 (Murabaha), No. 9 (Ijarah & Ijarah Muntahia Bittamleek), and No. 13 (Mudaraba) for Bangladeshi professionals.',
    descriptionBn: 'বাংলাদেশী ব্যাংকার ও গবেষকদের জন্য বাহরাইনভিত্তিক আন্তর্জাতিক সংস্থা এএওআইএফআই-এর শরীয়াহ স্ট্যান্ডার্ডের প্রাতিষ্ঠানিক বাংলা অনুবাদ ও বাস্তব কেস স্টাডি।',
    category: 'Book-Reference',
    categoryBn: 'রেফারেন্স গ্রন্থ',
    tags: ['AAOIFI', 'Standard No 8', 'Standard No 9', 'Ijarah', 'Murabaha', 'Shariah Governance'],
    pdfFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '6.5 MB',
    pageCount: 88,
    publicationDate: '2023-08-01',
    downloadsCount: 3120,
    viewsCount: 6890,
    isPopular: true,
    isFeatured: false,
    previewSupported: true,
    keyTopics: ['AAOIFI Standard 8 Murabaha', 'AAOIFI Standard 9 Ijarah', 'Takaful Principles']
  },
  {
    id: 'res-quran-riba',
    title: 'The Prohibition of Riba (Interest) in Al-Quran and Hadith: Detailed Tafsir',
    titleBn: 'আল-কুরআন ও হাদিসের আলোকে সুদের (রিবা) নিষেধাজ্ঞা: বিস্তারিত তাফসির ও আধুনিক ব্যাখ্যা',
    subject: 'Quran, Hadith & Economic Ethics',
    subjectBn: 'কুরআন, হাদিস ও অর্থনৈতিক নৈতিকতা',
    course: 'Quran-Hadith',
    examYear: '2024',
    examSession: 'All',
    sessionBangla: 'ইসলামী শিক্ষা সংকলন',
    language: 'bn',
    description: 'Comprehensive collection of all Ayats of Surah Al-Baqarah, Al-Imran, An-Nisa, and Ar-Rum prohibiting Riba with classical and contemporary commentaries on fiat money and inflation.',
    descriptionBn: 'সুরা বাকারা, আলে ইমরান, নিসা ও রুমের সুদের নিষেধাজ্ঞাসূচক আয়াতসমূহের বিস্তারিত শানে নুযুল, নির্ভরযোগ্য তাফসির এবং আধুনিক মুদ্রাস্ফীতি বনাম সুদের শরয়ী বিশ্লেষণ।',
    category: 'Study-Notes',
    categoryBn: 'স্টাডি নোটস ও সহায়িকা',
    tags: ['Quran', 'Tafsir', 'Riba Prohibition', 'Surah Baqarah', 'Hadith'],
    pdfFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    googleDriveUrl: 'https://drive.google.com/file/d/1SAMPLE_QURAN_RIBA/view',
    fileSize: '4.7 MB',
    pageCount: 56,
    publicationDate: '2024-03-05',
    downloadsCount: 2890,
    viewsCount: 7100,
    isPopular: true,
    isFeatured: true,
    previewSupported: true,
    keyTopics: ['Ayat on Riba (Al-Baqarah: 275-281)', 'The Farewell Sermon Declaration', 'Inflation vs Indexation in Fiqh']
  },
  {
    id: 'res-fatwa-csbib',
    title: 'Central Shariah Board Resolutions and Fatwas for Islamic Banks of Bangladesh',
    titleBn: 'সেন্ট্রাল শরীয়াহ বোর্ড ফর ইসলামিক ব্যাংকস অব বাংলাদেশ (CSBIB)-এর ফতোয়া ও সিদ্ধান্ত সংকলন',
    subject: 'Fiqh al-Muamalat & Fatwas',
    subjectBn: 'ফিকহুহুল মুআমালাত ও ফতোয়া',
    course: 'Fiqh-Fatwa',
    examYear: '2023',
    examSession: 'All',
    sessionBangla: 'ফতোয়া সংকলন ২০২৩',
    language: 'bn',
    description: 'Official decisions on Credit Card usage under Islamic modes, late payment compensation (charity fund allocation), Agent Banking Shariah screening, and FinTech mobile money.',
    descriptionBn: 'ইসলামিক ক্রেডিট কার্ড, বিলম্বিত কিস্তির ক্ষতিপূরণ (চ্যারিটি ফান্ড ব্যবস্হাপনা), এজেন্ট ব্যাংকিং শরীয়াহ নিরীক্ষা এবং ডিজিটাল ওয়ালেটের লেনদেন সংক্রান্ত ফতোয়া।',
    category: 'Fatwa-Resolution',
    categoryBn: 'ফতোয়া ও সিদ্ধান্ত',
    tags: ['CSBIB', 'Fatwa', 'Late Payment Penalty', 'Credit Cards', 'Shariah Governance'],
    pdfFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '3.4 MB',
    pageCount: 64,
    publicationDate: '2023-09-12',
    downloadsCount: 1670,
    viewsCount: 3950,
    isPopular: false,
    isFeatured: false,
    previewSupported: true,
    keyTopics: ['Late Payment Compensation Handling', 'Islamic Credit Card Models', 'CSR Fund Shariah Protocols']
  },
  {
    id: 'dib-2021-may-q',
    title: '92nd DIB Exam: International Trade, Foreign Exchange & Sukuk',
    titleBn: '৯২তম ডিআইবি পরীক্ষা: বৈদেশিক বাণিজ্য, বৈদেশিক মুদ্রা ব্যবস্থাপনা ও সুকুক বন্ড',
    subject: 'Foreign Exchange & Sukuk',
    subjectBn: 'বৈদেশিক বাণিজ্য ও সুকুক',
    course: 'DIB-2',
    examYear: '2021',
    examSession: 'May',
    sessionBangla: 'মে ২০২১ (৯২তম পরীক্ষা)',
    language: 'bilingual',
    description: 'Shariah guidelines for Letter of Credit (LC) under Murabaha and Wakala, currency exchange (Sarf) rules, and sovereign Bangladesh Government Islamic Investment Sukuk (BGIIS) issuance mechanics.',
    descriptionBn: 'মুরাবাহা ও ওয়াকালা পদ্ধতিতে এলসি (Letter of Credit) খোলা, মুদ্রার বিনিময় (বাই-উস-সারফ) এবং সরকারি ইসলামিক সুকুকের কাঠামো ও বিগত পরীক্ষার প্রশ্নোত্তর।',
    category: 'Question-Paper',
    categoryBn: 'বিগত বছরের প্রশ্নপত্র',
    tags: ['Foreign Trade', 'Letter of Credit', 'Sarf', 'Sukuk', 'DIB Part 2', '2021'],
    pdfFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '3.1 MB',
    pageCount: 36,
    publicationDate: '2021-06-25',
    downloadsCount: 1280,
    viewsCount: 2940,
    isPopular: false,
    isFeatured: false,
    previewSupported: true,
    keyTopics: ['Wakala vs Murabaha LC', 'Rules of Bai-us-Sarf', 'Ijara Sukuk Structure']
  },
  {
    id: 'dib-2020-nov-q',
    title: '91st DIB Exam: Islamic Commercial Law & Shariah Supervisory Governance',
    titleBn: '৯১তম ডিআইবি পরীক্ষা: ইসলামিক বাণিজ্যিক আইন এবং শরীয়াহ সুপারভাইজরি গভর্ন্যান্স',
    subject: 'Commercial Law & Shariah Governance',
    subjectBn: 'বাণিজ্যিক আইন ও শরীয়াহ গভর্ন্যান্স',
    course: 'DIB-1',
    examYear: '2020',
    examSession: 'November',
    sessionBangla: 'নভেম্বর ২০২০ (৯১তম পরীক্ষা)',
    language: 'bilingual',
    description: 'Elements of a valid contract (Aqd) under Fiqh al-Muamalat, Gharar (excessive ambiguity), Maysir (gambling), and structure of Shariah Supervisory Boards in private commercial banks.',
    descriptionBn: 'ইসলামী চুক্তির (আকদ) অপরিহার্য শর্তাবলি, গারার ও মায়সিরের সংজ্ঞা এবং তফসিলি ব্যাংকে শরীয়াহ সুপারভাইজরি কমিটির কর্তৃত্ব ও জবাবদিহিতা।',
    category: 'Solved-Answer',
    categoryBn: 'সমাধানকৃত প্রশ্নপত্র',
    tags: ['Aqd', 'Contract Law', 'Gharar', 'Shariah Board', '2020'],
    pdfFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '2.7 MB',
    pageCount: 30,
    publicationDate: '2020-12-14',
    downloadsCount: 1150,
    viewsCount: 2600,
    isPopular: false,
    isFeatured: false,
    previewSupported: true,
    keyTopics: ['Elements of Valid Aqd', 'Khiyar (Options in Sale)', 'Separation of Board and Management']
  }
];

export const sampleArticles: Article[] = [
  {
    id: 'art-mudaraba-definition',
    title: 'Mudaraba Definition, Core Principles and Operational Mechanics in Islamic Banking',
    titleBn: 'মুদারাবা (Mudaraba) সংজ্ঞা, মূলনীতি ও ইসলামিক ব্যাংকিংয়ে পরিচালন পদ্ধতি',
    slug: 'mudaraba-definition',
    author: 'Dr. Shah Mohammad Waliullah, AAOIFI Certified Scholar',
    authorDesignation: 'Head of Shariah Supervisory Secretariat & DIB Examiner',
    publishedDate: '2024-06-01',
    readTime: '9 min read',
    category: 'Diploma in Islamic Banking (Part 1)',
    categoryBn: 'ডিআইবি পার্ট-১ ও মূলনীতি',
    summary: 'A comprehensive study module on Mudaraba contract covering the definitions of Rabb-ul-Mal and Mudarib, profit-sharing ratios, capital loss allocation, and DIB past exam model answers.',
    summaryBn: 'মুদারাবার পারিভাষিক সংজ্ঞা, রব্বুল মাল ও মুদারিবের আইনি মর্যাদা, লাভ বণ্টনের পূর্বনির্ধারিত অনুপাত, লোকসানের দায়ভার বহন এবং ডিআইবি পরীক্ষার বিগত বছরের মডেল প্রশ্নোত্তর।',
    contentMarkdownEn: `## What is Mudaraba? (Definition and Legal Foundation)

Mudaraba (مضاربة) is a fiduciary equity partnership contract where one party supplies the entire financial capital (**Rabb-ul-Mal** / Capital Provider) and the other party contributes specialized labor, management expertise, and skill (**Mudarib** / Fund Manager).

### Pillars (Arkan) of Mudaraba
1. **The Contracting Parties (Aqidan):** Rabb-ul-Mal (Investor) and Mudarib (Working Partner).
2. **Capital (Ra's al-Mal):** Must be clearly quantified in liquid cash or accepted monetary valuation at contract inception.
3. **Labor & Activity (Amal):** Entrusted exclusively to the Mudarib without undue day-to-day managerial interference from the capital provider.
4. **Profit (Ribh):** Must be shared strictly in agreed-upon fractional percentages (e.g., 70:30 or 60:40) of actual realized profit, never as a guaranteed fixed amount or fixed percentage of capital.
5. **Offer and Acceptance (Ijab and Qabul).**

### Loss Bearing Maxim: Capitalist Bears the Financial Loss
One of the most frequently tested concepts in the **Diploma in Islamic Banking (DIB)** is the rule of loss:
> **"Financial loss is borne exclusively by the capital provider (Rabb-ul-Mal) up to the limit of his capital, while the Mudarib loses his labor, time, and unearned reward."**
*Exception:* If the loss is proven to have occurred due to negligence (Taqsir), misconduct (Ta'addi), or violation of agreed terms by the Mudarib, the Mudarib becomes liable to reimburse the full capital.

### Operational Application in Islamic Banks
- **Deposit Side (Liability):** Depositors act as Rabb-ul-Mal, and the Islamic Bank acts as Mudarib.
- **Investment Side (Asset):** The Islamic Bank acts as Rabb-ul-Mal, financing entrepreneurs or corporate clients who act as Mudarib.`,
    contentMarkdownBn: `## মুদারাবা (Mudaraba) কী? পারিভাষিক সংজ্ঞা ও ভিত্তি

মুদারাবা (المضاربة) হলো ইসলামী বাণিজ্যিক আইন (Fiqh al-Muamalat)-এর একটি বিশেষায়িত অংশীদারিত্বমূলক চুক্তি, যেখানে এক পক্ষ সম্পূর্ণ মূলধন সরবরাহ করে এবং অপর পক্ষ তার মেধা, শ্রম, সততা ও পরিচালনা দক্ষতা দিয়ে ব্যবসা পরিচালনা করে।

### মুদারাবা চুক্তির প্রধান পক্ষসমূহ:
১. **রব্বুল মাল (সাহিবুল মাল / Capital Provider):** যিনি ব্যবসায় সম্পূর্ণ অর্থ বা মূলধন বিনিয়োগ করেন।
২. **মুদারিব (উদ্যোক্তা / Working Partner):** যিনি শ্রম ও দক্ষতা দিয়ে প্রতিষ্ঠান বা বাণিজ্য পরিচালনা করেন।

> পবিত্র কুরআনে আল্লাহ তাআলা বলেন: *"আর অন্যরা আল্লাহর অনুগ্রহ (জীবিকা) অন্বেষণে পৃথিবীতে ভ্রমণ করে..."* (সূরা আল-মুযযাম্মিল: ২০)। এই আয়াতের 'ইয়াদরিবুনা ফিল আরদ' থেকেই মুদারাবা শব্দের উৎপত্তি।

---

### মুদারাবার রুকন ও অপরিহার্য শর্তাবলি
১. **মূলধন (রা'সুল মাল):** মূলধন সুনির্দিষ্ট ও নগদ অর্থে হতে হবে। ঋণ বা বাকির দায়কে মুদারাবার মূলধন হিসেবে গণ্য করা যায় না।
২. **মুনাফা বণ্টন অনুপাত (Profit Sharing Ratio - PSR):** মুনাফা কীভাবে বণ্টিত হবে তা চুক্তির সময়ই শতকরা হারে নির্ধারিত হতে হবে (যেমন: ৭০:৩০ বা ৬০:৪০)। মূলধনের ওপর কোনো নির্দিষ্ট টাকা (যেমন মাসে ১০,০০০ টাকা) দেওয়া যাবে না।
৩. **ব্যবসা পরিচালনার স্বাধীনতা:** রব্বুল মাল ব্যবসায় নজরদারি রাখতে পারবেন, তবে মুদারিবের দৈনন্দিন স্বাধীন ব্যবস্থাপনায় অপ্রয়োজনীয় হস্তক্ষেপ করতে পারবেন না।

---

### লোকসান বহনের অমোঘ বিধান (ডিআইবি পরীক্ষার বিশেষ প্রশ্ন)
পরীক্ষায় বারবার আসা একটি প্রশ্ন: *"মুদারাবায় ক্ষতি হলে কে কতটুকু বহন করবে?"*
- **আর্থিক ক্ষতি:** ব্যবসায় যদি কোনো আর্থিক ক্ষতি (Financial Loss) হয়, তবে তা **এককভাবে রব্বুল মাল (বিনিয়োগকারী)** বহন করবে।
- **শ্রমের ক্ষতি:** মুদারিব তার কষ্ট ও শ্রমের কোনো পারিশ্রমিক বা মুনাফা পাবে না, অর্থাৎ তার শ্রম বৃথা যাবে।
- **ব্যতিক্রম:** মুদারিব যদি স্পষ্ট গাফিলতি (Taqsir), জালিয়াতি, বা শর্ত ভঙ্গ (Ta'addi) করে ক্ষতি করে, তবে সেই ক্ষতির দায় মুদারিবকে ব্যক্তিগতভাবে ক্ষতিপূরণ দিতে হবে।

---

### আধুনিক ব্যাংকিংয়ে মুদারাবার দ্বৈত ভূমিকা (Two-Tier Mudaraba)
১. **আমানত গ্রহণ পর্যায় (Liability Side):** সাধারণ গ্রাহক হলেন 'রব্বুল মাল' এবং ব্যাংক হলো 'মুদারিব'।
২. **বিনিয়োগ পর্যায় (Asset Side):** ব্যাংক হলো 'রব্বুল মাল' এবং উদ্যোক্তা বা শিল্পপ্রতিষ্ঠান হলো 'মুদারিব'।

---

### বিগত বছরের ডিআইবি পরীক্ষার মডেল প্রশ্ন ও উত্তর
**প্রশ্ন:** মুদারাবা ও মুশারাকার মধ্যে দুটি প্রধান পার্থক্য লিখুন।
**উত্তর:**
১. মুশারাকায় সব অংশীদার মূলধন সরবরাহ করে; কিন্তু মুদারাবায় কেবল রব্বুল মাল মূলধন দেয় এবং মুদারিব দেয় শ্রম।
২. মুশারাকায় ক্ষতি মূলধনের অনুপাত অনুযায়ী সবার মাঝে বণ্টিত হয়; মুদারাবায় আর্থিক ক্ষতি কেবল রব্বুল মাল বহন করে।`,
    tags: ['Mudaraba', 'DIB Part 1', 'Rabb-ul-Mal', 'Mudarib', 'Profit-Loss Sharing', 'Islamic Economics', 'AAOIFI'],
    keywords: ['মুদারাবা সংজ্ঞা', 'mudaraba definition', 'রব্বুল মাল', 'মুদারিব', 'DIB Part 1', 'ইসলামিক ব্যাংকিং ডিপ্লোমা', 'লাভ-ক্ষতি বণ্টন', 'AAOIFI Shariah Standard'],
    coverImage: '/src/assets/images/banner_bangladesh_banking_1793322325377.jpg',
    featured: false,
    relatedResourceIds: ['dib-2023-nov-q2', 'dib-2024-may-q1'],
    menuCategory: 'dib-part-1',
    publishedAt: '2024-06-01',
    pdfId: null
  },
  {
    id: 'art-01',
    title: 'Current Dynamics, Structural Challenges and Future Outlook of Islamic Banking in Bangladesh',
    titleBn: 'বাংলাদেশে ইসলামী ব্যাংকিংয়ের বর্তমান গতিপ্রকৃতি, কাঠামোগত চ্যালেঞ্জ ও ভবিষ্যৎ সম্ভাবনা',
    slug: 'dynamics-and-challenges-of-islamic-banking-bangladesh',
    author: 'Mohammad Arifur Rahman, CSBIB Research Fellow',
    authorDesignation: 'Senior Islamic Banking Specialist & DIB Mentor',
    publishedDate: '2024-05-18',
    readTime: '8 min read',
    category: 'Islamic Banking Insights',
    categoryBn: 'ইসলামী ব্যাংকিং গবেষণা',
    summary: 'An in-depth empirical exploration of Islamic banking growth in Bangladesh, market share of deposits and investments, liquidity management instruments, and the urgent need for a comprehensive Islamic Banking Act.',
    summaryBn: 'বাংলাদেশে ইসলামী ব্যাংকিংয়ের চার দশকের অগ্রযাত্রা, আমানত ও বিনিয়োগে প্রায় ২৫% বাজার অংশীদারিত্ব, তারল্য ব্যবস্থাপনায় সুকুকের ভূমিকা এবং একটি পূর্ণাঙ্গ ইসলামী ব্যাংকিং আইনের অপরিহার্যতা নিয়ে বিশদ পর্যালোচনা।',
    contentMarkdownEn: `## Introduction to Islamic Banking in Bangladesh

Islamic banking in Bangladesh began its journey in 1983 with the establishment of Islami Bank Bangladesh Limited. Over the last four decades, the industry has experienced phenomenal expansion. Today, full-fledged Islamic banks, along with Islamic banking branches and windows of conventional commercial banks, hold more than 25% of the total banking sector's deposits and investments.

### Key Milestones & Growth Metrics
1. **Pioneering Era (1983-2000):** Focus on basic retail Murabaha and Mudaraba deposit schemes.
2. **Expansion Era (2001-2015):** Multiple private commercial banks converted to full-fledged Islamic operations.
3. **Institutional Modernization (2016-Present):** Introduction of Bangladesh Government Islamic Investment Sukuk (BGIIS) and Central Bank Liquidity Windows.

### Critical Structural Challenges Facing the Sector
- **Lack of a Standalone Islamic Banking Act:** While the Bank Company Act 1991 incorporates certain clauses, a separate, unified legal charter is imperative to resolve disputes under Shariah governance.
- **Over-reliance on Debt-based Modes:** More than 70% of financing is concentrated in Murabaha and Bai-Muajjal, rather than true Profit & Loss Sharing (PLS) instruments like Mudaraba and Musharaka.
- **Liquidity Management Dilemmas:** Absence of a broad secondary market for Islamic bonds and treasury bills has historically created surplus or deficit friction during tight monetary cycles.

### Recommendations for Banking Professionals & DIB Candidates
Candidates appearing for Diploma in Islamic Banking (DIB) examinations must focus on the regulatory distinctions outlined in Bangladesh Bank's 2009 Guidelines and the latest prudential circulars regarding capital adequacy (Basel III) compliance.`,
    contentMarkdownBn: `## বাংলাদেশে ইসলামী ব্যাংকিংয়ের সংক্ষিপ্ত পটভূমি

১৯৮৩ সালে ইসলামী ব্যাংক বাংলাদেশ লিমিটেড প্রতিষ্ঠার মধ্য দিয়ে বাংলাদেশে ইসলামী ধারার ব্যাংকিং কার্যক্রমের আনুষ্ঠানিক সূচনা ঘটে। বিগত চার দশকে এ দেশের সাধারণ জনগণের বিপুল আস্থা ও নৈতিক সমর্থনের কারণে ইসলামী ব্যাংকিং এক অভাবনীয় বিপ্লব সাধন করেছে। বর্তমানে দেশে পূর্ণাঙ্গ ইসলামী ব্যাংক, পাশাপাশি প্রচলিত বাণিজ্যিক ব্যাংকসমূহের ইসলামিক উইন্ডো ও শাখা মিলিয়ে মোট ব্যাংকিং সেক্টরের আমানত ও বিনিয়োগের এক-চতুর্থাংশের বেশি পরিচালিত হচ্ছে শরীয়াহ নীতিমালায়।

### ব্যাংকিং খাতের মূল অর্জনসমূহ
১. **আমানতকারীদের বিপুল আস্থা:** প্রচলিত সুদি ব্যবস্থার বিপরীতে হালাল মুনাফা অর্জনের নিশ্চয়তায় তৃণমূল পর্যায় পর্যন্ত সঞ্চয় সংগ্রহ।
২. **উৎপাদনশীল খাতে বিনিয়োগ:** ক্ষুদ্র, মাঝারি ও বৃহৎ শিল্পে সম্পদভিত্তিক (Asset-backed) অর্থায়ন।
৩. **সরকারি সুকুক প্রবর্তন:** বাংলাদেশ সরকার কর্তৃক ইসলামিক ইনভেস্টমেন্ট সুকুক (BGIIS) চালুর মাধ্যমে দীর্ঘমেয়াদি অবকাঠামোগত অর্থায়ন সহজতর হয়েছে।

### বর্তমান কাঠামোগত সংকট ও চ্যালেঞ্জ
- **স্বতন্ত্র ইসলামী ব্যাংকিং আইনের অনুপস্থিতি:** ব্যাংক কোম্পানি আইন ১৯৯১-এর কিছু ধারায় বিষয়গুলো উল্লিখিত থাকলেও একটি পূর্ণাঙ্গ, স্বয়ংসম্পূর্ণ আইনি কাঠামোর অভাব রয়েছে।
- **মুরাবাহা-নির্ভর বিনিয়োগ:** শরীয়াহর মূল স্পিরিট হলো 'লাভ-লোকসান অংশীদারিত্ব' (মুশারাকা ও মুদারাবা)। অথচ বাস্তবে বেশিরভাগ ব্যাংক মুরাবাহা ও বাই-মুয়াজ্জালভিত্তিক পণ্য কেনাবেচায় সীমিত থাকছে।
- **দক্ষ মানবসম্পদের স্বল্পতা:** প্রাতিষ্ঠানিক শরীয়াহ জ্ঞান ও আধুনিক ফিনটেক প্রযুক্তিতে দক্ষ ব্যাংকারের সংকট এখনো লক্ষণীয়।

### ডিআইবি পরীক্ষার্থী ও ব্যাংকারদের জন্য পরামর্শ
ডিআইবি পার্ট-১ ও পার্ট-২ পরীক্ষার্থীদের বাংলাদেশ ব্যাংকের ২০০৯ সালের গাইডলাইন, তারল্য ব্যবস্থাপনাসংক্রান্ত সার্কুলার এবং ব্যাসেল-৩ কমপ্লায়েন্স সম্পর্কে স্পষ্ট ধারণা রাখতে হবে। পরীক্ষায় তাত্ত্বিক ব্যাখ্যার সাথে ব্যাংকিং অপারেশনের বাস্তব উদাহরণ দিলে সর্বোচ্চ নম্বর পাওয়া সম্ভব।`,
    tags: ['Islamic Banking', 'Bangladesh Economy', 'DIB Preparation', 'Sukuk', 'Bank Company Act'],
    coverImage: '/src/assets/images/banner_bangladesh_banking_1793322325377.jpg',
    featured: false,
    relatedResourceIds: ['dib-2024-may-q1', 'dib-2023-may-law'],
    menuCategory: 'islamic-essays',
    publishedAt: '2024-05-18',
    pdfId: null
  },
  {
    id: 'art-02',
    title: 'Riba vs. Profit: Clarifying the Fundamental Jurisprudential Distinctions',
    titleBn: 'সুদ (রিবা) ও মুনাফার মৌলিক পার্থক্য: কুরআন, হাদিস ও আধুনিক অর্থনীতির আলোকে স্পষ্টীকরণ',
    slug: 'riba-vs-profit-fundamental-distinctions',
    author: 'Mufti Dr. Enamul Haque, Shariah Advisor',
    authorDesignation: 'Member, Central Shariah Supervisory Board',
    publishedDate: '2024-04-10',
    readTime: '6 min read',
    category: 'Fiqh al-Muamalat',
    categoryBn: 'মুআমালাত ও ফিকহ',
    summary: 'A definitive theological and operational breakdown answering the common skepticism: "How is Islamic bank profit different from conventional bank interest?"',
    summaryBn: 'সাধারণ মানুষ ও ব্যাংকিং শিক্ষার্থীদের বহুল আলোচিত প্রশ্ন: "ইসলামী ব্যাংকের মুনাফা ও প্রচলিত ব্যাংকের সুদের মধ্যে বাস্তব পার্থক্য কী?" — এর প্রামাণিক বিশ্লেষণ।',
    contentMarkdownEn: `## The Core Distinction: Risk Bearing vs Capital Commodification

The most frequent query encountered by Islamic bankers is: *"Conventional banks charge 9% interest, and Islamic banks charge 9% profit markup. How are they spiritually or economically different?"*

The answer lies in the **underlying legal reality (Haqiqah)** and the Islamic legal maxim:
> **"Al-Kharaj bi al-Daman"** *(Gain is accompanied by liability for loss)* and **"Al-Ghunm bi al-Ghurm"** *(Profit comes with risk)*.

### 1. In Conventional Banking (Money as a Commodity)
- Money is lent as a loan (Qard).
- Interest ($Riba$) is a predetermined increment charged solely for the deferment of time ($Nasi'ah$), independent of whether the borrower makes a commercial gain or incurs total destruction of goods.
- Risk is 100% shifted onto the borrower.

### 2. In Islamic Banking (Money as a Medium of Exchange)
- Money is never rented or lent for profit.
- Islamic banks engage in **real trading** (Murabaha/Salam/Istisna'a), **leasing** (Ijarah), or **equity partnerships** (Musharaka/Mudaraba).
- Before markup is recognized, the bank assumes constructive possession ($Qabd$) and liability ($Daman$) of the tangible goods. If goods perish before delivery to the client, the bank bears the total loss.

### Essential Takeaway for Examination
In DIB Question Papers, examiners award maximum credit when candidates illustrate this with a trade flow diagram showing ownership transfer.`,
    contentMarkdownBn: `## সবচেয়ে বড় বিভ্রান্তি: "উভয় ব্যবস্থার পার্সেন্টেজ তো প্রায় একই, তবে পার্থক্য কোথায়?"

ইসলামী ব্যাংকার ও গ্রাহক উভয়ের মনেই বহুল আলোচিত একটি প্রশ্ন: *"সুদি ব্যাংক ৯% হারে সুদ নেয়, আর ইসলামিক ব্যাংক ৯% হারে মুনাফা ধরে। তাহলে মৌলিক পার্থক্যটি কী?"*

ইসলামী শরীয়াহর বিশ্ববিখ্যাত মূলনীতি হলো:
> **"আল-খারাজ বিদ-দামান"** (মুনাফা ভোগ করার অধিকার তখনই জন্মায়, যখন ক্ষতির ঝুঁকি নেওয়ার দায় গ্রহণ করা হয়) এবং **"আল-গুন্মু বিল-গুরম"** (ঝুঁকি ছাড়া কোনো বৈধ লাভ হতে পারে না)।

### ১. প্রচলিত সুদি ব্যাংকিংয়ের পদ্ধতি
- ব্যাংকের টাকা হলো সরাসরি একটি 'ঋণ' (Loan/Qard)।
- সময়ের বিনিময়ে মূলধনের ওপর পূর্বনির্ধারিত অতিরিক্ত অর্থ আদায় করা হয়, যা সরাসরি কুরআনে নিষিদ্ধ 'রিবা আন-নাসিআহ' (Riba an-Nasi'ah)।
- গ্রাহক লাভ করুক বা আগুনে তার গুদাম পুড়ে যাক—সুদি ব্যাংক তার মূলধন ও সুদ আদায় করবেই। অর্থাৎ ঝুঁকির কোনো বণ্টন নেই।

### ২. ইসলামী ব্যাংকিংয়ের পদ্ধতি
- ইসলামী ব্যাংকে টাকাকে পণ্য হিসেবে ভাড়া দেওয়া যায় না। টাকা কেবল বিনিময়ের মাধ্যম (Medium of Exchange)।
- ব্যাংক গ্রাহককে নগদ টাকা দেয় না; বরং গ্রাহকের পছন্দের পণ্য বিক্রেতার কাছ থেকে কিনে নিয়ে নিজস্ব মালিকানায় আনে এবং ঝুঁকি গ্রহণ করে তা গ্রাহকের কাছে বিক্রি করে।
- হস্তান্তরের পূর্বে পণ্যে কোনো ক্ষতি হলে সেই ক্ষতি ব্যাংককে এককভাবে বহন করতে হয়। 

### পরীক্ষার জন্য গুরুত্বপূর্ণ টিপস
ডিআইবি পরীক্ষায় এই প্রশ্নটি প্রতি ২-৩ সেশন পরপরই এসে থাকে। খাতায় উত্তর লেখার সময় পণ্য ক্রয়ের পর স্বত্ব হস্তান্তর (Possession & Ownership Transfer)-এর ধাপগুলো ছক আকারে দেখালে পূর্ণ নম্বর অর্জিত হয়।`,
    tags: ['Riba', 'Profit', 'Fiqh al-Muamalat', 'DIB Questions', 'Islamic Economics'],
    coverImage: '/src/assets/images/category_diploma_banking_1793322326189.jpg',
    featured: false,
    relatedResourceIds: ['dib-2024-may-q1', 'res-quran-riba'],
    menuCategory: 'islamic-economics',
    publishedAt: '2024-04-10',
    pdfId: null
  },
  {
    id: 'art-03',
    title: 'Strategic Roadmap to Ace the Diploma in Islamic Banking (DIB) on the First Attempt',
    titleBn: 'প্রথম প্রচেষ্টাতেই ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB) পরীক্ষায় উত্তীর্ণ হওয়ার পূর্ণাঙ্গ কৌশল ও গাইডলাইন',
    slug: 'strategic-roadmap-to-ace-dib-examination',
    author: 'Engr. Kazi Tariqul Islam, DIB Gold Medalist',
    authorDesignation: 'Executive Officer & DIB Academic Instructor',
    publishedDate: '2024-03-02',
    readTime: '7 min read',
    category: 'Exam Guidance',
    categoryBn: 'পরীক্ষা প্রস্তুতি ও দিকনির্দেশনা',
    summary: 'A practical, step-by-step master plan for busy bankers in Bangladesh to study effectively for DIB Part 1 and Part 2 within 60 days.',
    summaryBn: 'চাকরির পাশাপাশি মাত্র ৬০ দিনের পরিকল্পিত স্টাডি রুটিন, বিগত ১০ বছরের প্রশ্ন বিশ্লেষণের টেকনিক এবং খাতায় লেখার আদর্শ উপস্থাপন কৌশল।',
    contentMarkdownEn: `## The Reality of Preparing While Working Full-Time

Passing the Diploma in Islamic Banking (DIB) under the Institute of Bankers, Bangladesh (IBB) is crucial for career promotion in commercial banks. However, balancing full-time branch hours with intensive study requires a smart, surgical approach rather than memorizing textbooks cover-to-cover.

### Step 1: Analyze 10-Year Question Trends
Exam questions follow structured patterns. Over 65% of the syllabus repeats across alternating sessions:
- **Part 1 High-Yield Focus:** Islamic contracts ($Aqd$), Murabaha mechanics, Mudaraba profit loss formulas, and Shariah board criteria.
- **Part 2 High-Yield Focus:** Bank Company Act 1991, Sukuk issuance steps, AAOIFI FAS 1 requirements, and Foreign Trade LC models.

### Step 2: Answer Writing Structure
1. **Quranic/Hadith Evidence:** Always cite at least one Arabic/Bengali reference where applicable.
2. **Definition & Conditions (Shurút):** Use bullet points.
3. **Operational Workflow Diagram:** Draw simple boxes showing the flow of fund, asset, and ownership.
4. **Bangladesh Banking Context:** Mention relevant Bangladesh Bank circulars.`,
    contentMarkdownBn: `## ব্যাংকিং কর্মব্যস্ততার মাঝে কার্যকর পড়াশোনার উপায়

ইনস্টিটিউট অব ব্যাংকার্স, বাংলাদেশ (IBB)-এর অধীনে ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB) ব্যাংকারদের পদোন্নতি ও ইনক্রিমেন্টের জন্য অত্যন্ত তাৎপর্যপূর্ণ। কিন্তু সারাদিন ব্রাঞ্চের চাপ সামলে রাতে শত শত পৃষ্ঠার বই মুখস্থ করা সম্ভব নয়। এজন্য প্রয়োজন কৌশলী পড়াশোনা।

### ১. বিগত ১০ বছরের প্রশ্ন বিশ্লেষণ ও ৬০/৪০ ফর্মুলা
পরীক্ষার প্রায় ৬৫% প্রশ্ন বিগত ৫-১০ বছরের প্রশ্নপত্র থেকে কিছুটা ঘুরিয়ে আসে।
- **ডিআইবি পার্ট-১ এর জন্য:** আকদের শর্তাবলি, মুরাবাহা কেনাবেচার ঝুঁকি, মুদারাবা-মুশারাকার গাণিতিক সমাধান এবং রিবার প্রকারভেদ।
- **ডিআইবি পার্ট-২ এর জন্য:** ব্যাংক কোম্পানি আইন ১৯৯১ এর গুরুত্বপূর্ণ ধারা, সুকুক বন্ডের কাঠামো, এএওআইএফআই হিসাবরক্ষণ মানদণ্ড এবং বৈদেশিক বাণিজ্যের এলসি পদ্ধতি।

### ২. খাতায় উত্তর লেখার আদর্শ কাঠামো
- **ভূমিকা ও পারিভাষিক অর্থ:** প্রথমে ২-৩ লাইনে পরিচ্ছন্ন সংজ্ঞা।
- **কুরআন ও হাদিসের রেফারেন্স:** প্রাসঙ্গিক আয়াত বা হাদিসের ভাবানুবাদ উল্লেখ করুন।
- **অপারেশনাল ফ্লো-চার্ট:** লেখা বড় না করে একটি স্পষ্ট তীরচিহ্ন সংবলিত চার্ট দিন।
- **বাংলাদেশ ব্যাংকের সার্কুলার:** সাম্প্রতিক সার্কুলারের উল্লেখ পরীক্ষককে আশ্বস্ত করে যে আপনি সমকালীন বাস্তবতায় সচেতন।`,
    tags: ['DIB Preparation', 'Exam Tips', 'IBB Guidelines', 'Study Routine'],
    coverImage: '/images/category_quran_hadith_1793322326327.webp',
    featured: false,
    relatedResourceIds: ['dib-study-guide-complete'],
    menuCategory: 'miscellaneous',
    publishedAt: '2024-03-02',
    pdfId: null
  },
  {
    id: 'art-bfiu-26',
    title: 'BFIU Circular 26: AML & CFT Compliance Framework for Islamic Banks in Bangladesh',
    titleBn: 'বিএফআইইউ সার্কুলার ২৬: মানি লন্ডারিং ও সন্ত্রাসী অর্থায়ন প্রতিরোধে ইসলামী ব্যাংকিং কমপ্লায়েন্স ও আইনি গাইডলাইন',
    slug: 'bfiu-circuler-26',
    author: 'মুহাম্মদ আরিফুর রহমান',
    authorDesignation: 'সিনিয়র ইসলামী ব্যাংকিং স্পেশালিস্ট ও এএমএল কমপ্লায়েন্স ট্রেইনার',
    publishedDate: '2026-11-01',
    readTime: '৭ মিনিট পাঠ',
    category: 'Diploma in Islamic Banking (Part 2)',
    categoryBn: 'ডিআইবি পার্ট-২ ও আইন',
    summary: 'Detailed operational and regulatory analysis of BFIU Circular 26 covering Customer Due Diligence (CDD), Enhanced Due Diligence (EDD), Beneficial Ownership identification, and Suspicious Transaction Reporting (STR/SAR) in Islamic financial institutions.',
    summaryBn: 'বাংলাদেশ ফাইন্যান্সিয়াল ইন্টেলিজেন্স ইউনিট (BFIU) সার্কুলার ২৬-এর আলোকে গ্রাহক পরিচিতি (KYC/CDD), বেনিফিসিয়াল ওনারশিপ যাচাই, সন্দেহজনক লেনদেন (STR) রিপোর্টিং এবং ডিআইবি পার্ট-২ পরীক্ষার জন্য পূর্ণাঙ্গ বিশ্লেষণী প্রস্তুতি ও মডেল উত্তর।',
    contentMarkdownEn: `## Overview of BFIU Circular 26 for Banking Professionals

BFIU Circular No. 26 is a cornerstone regulatory directive issued by the Bangladesh Financial Intelligence Unit under the Money Laundering Prevention Act, 2012 and Anti-Terrorism Act, 2009. It establishes mandatory compliance baselines for all scheduled commercial banks, with specialized risk assessment frameworks for Islamic banks.

### 1. Core Objectives and Statutory Mandates
- **Preventing Illicit Fund Flows:** Safeguarding the integrity of the financial system against money laundering and terrorism financing.
- **Uniform CDD/EDD Standards:** Standardizing Know Your Customer (KYC) through Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD) for high-risk accounts.
- **Trade-Based Money Laundering (TBML) Screening:** Rigorous scrutiny of Murabaha import/export letters of credit, price benchmarking, and physical goods verification.

### 2. Special Implications for Islamic Banking Modes
1. **Asset-Backed Verification in Murabaha:** Unlike conventional loans where funds can be misused, Islamic banks must ensure real physical procurement and genuine invoices.
2. **Partnership Modes (Mudaraba & Musharaka):** Continuous oversight of project accounts to prevent layering of illicit capital into commercial equity.
3. **Charity Account Audits:** Strict screening of non-compliant income allocated to CSR/Charity accounts to prevent unauthorized diversions.

### 3. Suspicious Transaction Reporting (STR / SAR)
Branch officials must identify red flags (unusual transaction velocity, structuring below reporting thresholds, mismatch with stated customer profile) and escalate STR reports to the Central Compliance Unit (CCU) without tipping off the customer.`,
    contentMarkdownBn: `## ১. বিএফআইইউ সার্কুলার ২৬-এর পটভূমি ও আইনি ভিত্তি

মানি লন্ডারিং প্রতিরোধ আইন, ২০১২ (সংশোধিত ২০১৫) এবং সন্ত্রাস বিরোধী আইন, ২০০৯-এর ক্ষমতাবলে বাংলাদেশ ফাইন্যান্সিয়াল ইন্টেলিজেন্স ইউনিট (BFIU) কর্তৃক জারিকৃত সার্কুলার নম্বর ২৬ দেশের ব্যাংকিং খাতের জন্য একটি অত্যন্ত গুরুত্বপূর্ণ আইনি দলিল। ডিআইবি পার্ট-২-এর 'কমার্শিয়াল ব্যাংকিং অ্যান্ড লজ' বিষয়ে প্রতি বছরই এই সার্কুলার ও এএমএল কমপ্লায়েন্স সংক্রান্ত প্রশ্ন এসে থাকে।

---

### ২. সার্কুলার ২৬-এর মূল নির্দেশনাসমূহ ও ব্যাংকারদের দায়িত্ব

১. **যথাযথ গ্রাহক পরিচিতি নিশ্চিতকরণ (Customer Due Diligence - CDD):**
- হিসাব খোলার পূর্বেই গ্রাহকের জাতীয় পরিচয়পত্র (NID) নির্বাচন কমিশনের ডাটাবেজ থেকে স্বয়ংক্রিয় যাচাই বাধ্যতামূলক।
- আয়ের বৈধ উৎস ও তহবিলের প্রকৃত মালিক (Beneficial Owner) যথাযথ নথিপত্র দ্বারা প্রমাণ করতে হবে।

২. **বর্ধিত গ্রাহক যাচাই (Enhanced Due Diligence - EDD):**
- রাজনৈতিকভাবে প্রভাবশালী ব্যক্তি (PEPs), তাদের পরিবারের সদস্য এবং আন্তর্জাতিক সংবেদনশীল সংস্থার কর্মকর্তাদের হিসাব উচ্চ-ঝুঁকিপূর্ণ হিসেবে শ্রেণিবদ্ধ করে জ্যেষ্ঠ ব্যবস্থাপনা কর্তৃপক্ষের অনুমোদনক্রমে পরিচালনা করতে হবে।

৩. **বাণিজ্যভিত্তিক মানি লন্ডারিং (Trade-Based Money Laundering - TBML) প্রতিরোধ:**
- আমদানি-রপ্তানি ও ব্যাক-টু-ব্যাক এলসি খোলার ক্ষেত্রে পণ্যের আন্তর্জাতিক বাজারদর, ইনভয়েসের সত্যতা ও শিপিং ডকুমেন্টস পুঙ্খানুপুঙ্খভাবে যাচাই করতে হবে।

---

### ৩. ইসলামী ব্যাংকিংয়ের ক্ষেত্রে সার্কুলার ২৬-এর বিশেষ তাৎপর্য

- **মুরাবাহা ও পণ্যের ভৌত অস্তিত্ব:** প্রচলিত ব্যাংকে নগদ অর্থ ছাড় করা হয় যা মানি লন্ডারিংয়ের ঝুঁকি বাড়ায়। কিন্তু ইসলামী ব্যাংকে মুরাবাহায় সরাসরি পণ্য ক্রয় করতে হয়। সার্কুলার ২৬ অনুযায়ী ভেন্ডরের সত্যতা ও ক্রয়াদেশের সত্যতা যাচাই করা আবশ্যক।
- **মুদারাবা ও মুশারাকা প্রকল্প তদারকি:** ইকুইটি পার্টনারশিপের নামে অবৈধ অর্থ বৈধ করার চেষ্টা (Layering) রোধে ব্যাংকের নিয়মিত অডিট দল নিয়োগ করতে হয়।
- **চ্যারিটি ফান্ড ও সন্দেহজনক মুনাফা ব্যবস্হাপনা:** শরীয়াহ নন-কমপ্লায়েন্সের কারণে বাতিলকৃত মুনাফা চ্যারিটি ফান্ডে নেওয়ার সময় সেই ফান্ডের বিতরণ কোনো বিতর্কিত বা নিষিদ্ধ সংস্থায় যেন না যায়, তা নিশ্চিত করা আবশ্যক।

---

### ৪. ডিআইবি পরীক্ষার বিগত বছরের মডেল প্রশ্ন ও উত্তর

**প্রশ্ন:** বিএফআইইউ সার্কুলার ২৬ অনুযায়ী শাখা পর্যায়ে 'রেড ফ্ল্যাগ' (Red Flags) বা সন্দেহজনক লেনদেনের সূচকগুলো কী কী?
**উত্তর:**
১. গ্রাহকের ঘোষিত পেশা ও নিয়মিত লেনদেন প্রোফাইলের সাথে হঠাৎ করে অস্বাভাবিক বড় অঙ্কের লেনদেন।
২. ক্যাশ ট্রানজেকশন রিপোর্টিং (CTR) সীমা (১০ লাখ টাকা) এড়ানোর জন্য একই দিনে একাধিক দফায় ৯ লাখ টাকার লেনদেন করা (Structuring)।
৩. নিষ্ক্রিয় বা ডরম্যান্ট একাউন্টে হঠাৎ করে বিপুল পরিমাণ বৈদেশিক রেমিট্যান্স আসা এবং দ্রুত তা অন্য ব্যাংকে স্থানান্তর।

পরীক্ষায় উত্তর লেখার সময় "মানি লন্ডারিং প্রতিরোধ আইন ২০১২"-এর ধারা এবং বিএফআইইউ সার্কুলার ২৬-এর সুস্পষ্ট উল্লেখ পরীক্ষককে সর্বোচ্চ নম্বর দিতে উদ্বুদ্ধ করে।`,
    tags: ['BFIU Circular 26', 'AML', 'CFT', 'Compliance', 'DIB Part 2', 'Islamic Banking Law'],
    keywords: ['BFIU Circular 26', 'বিএফআইইউ সার্কুলার ২৬', 'মানি লন্ডারিং প্রতিরোধ', 'KYC', 'CDD', 'STR', 'DIB Part 2', 'ইসলামী ব্যাংকিং আইন'],
    coverImage: '/images/banner_bangladesh_banking_1793322325377.webp',
    featured: false,
    relatedResourceIds: ['dib-2023-may-law', 'dib-2024-may-q1'],
    menuCategory: 'dib-part-2',
    publishedAt: '2026-11-01',
    pdfId: null
  }
];

export const categoriesList: CategoryInfo[] = [
  {
    id: 'cat-dib',
    name: 'Diploma in Islamic Banking (DIB)',
    nameBn: 'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB)',
    slug: 'diploma-islamic-banking',
    courseType: 'DIB-General',
    description: 'Past examination question papers, solved model answers, and syllabus guides for IBB DIB Part 1 & Part 2.',
    descriptionBn: 'আইবিবি ডিআইবি পার্ট-১ ও পার্ট-২ এর বিগত বছরের প্রশ্ন, সমাধানকৃত মডেল উত্তর এবং সিলেবাস সহায়িকা।',
    iconName: 'GraduationCap',
    image: '/images/category_diploma_banking_1793322326189.webp',
    itemCount: 42
  },
  {
    id: 'cat-banking',
    name: 'Islamic Banking & Finance',
    nameBn: 'ইসলামিক ব্যাংকিং ও অর্থনীতি',
    slug: 'islamic-banking-finance',
    courseType: 'Islamic-Banking',
    description: 'Principles of Mudaraba, Musharaka, Murabaha, Sukuk bonds, and central banking Shariah governance.',
    descriptionBn: 'মুদারাবা, মুশারাকা, মুরাবাহা, সুকুক এবং কেন্দ্রীয় ব্যাংকের শরীয়াহ গভর্ন্যান্স বিষয়ক প্রামাণ্য বই ও নোটস।',
    iconName: 'Building2',
    image: '/images/banner_bangladesh_banking_1793322325377.webp',
    itemCount: 38
  },
  {
    id: 'cat-quran',
    name: 'Quran & Hadith on Finance',
    nameBn: 'কুরআন ও হাদিসে অর্থনৈতিক বিধান',
    slug: 'quran-hadith-finance',
    courseType: 'Quran-Hadith',
    description: 'Authentic Ayats, Hadith compilations, and classical commentaries on commercial integrity, wealth distribution, and prohibition of Riba.',
    descriptionBn: 'বাণিজ্যিক সততা, সম্পদ বণ্টন এবং রিবা বর্জনের ওপর প্রামাণ্য আয়াত ও হাদিসের অনুবাদসহ ব্যাখ্যা।',
    iconName: 'BookOpen',
    image: '/images/category_quran_hadith_1793322326327.webp',
    itemCount: 26
  },
  {
    id: 'cat-fiqh',
    name: 'Fiqh al-Muamalat & Fatwa',
    nameBn: 'ফিকহুল মুআমালাত ও ফতোয়া',
    slug: 'fiqh-fatwa',
    courseType: 'Fiqh-Fatwa',
    description: 'Jurisprudential resolutions, Islamic commercial contracts, and official fatwas of Central Shariah Board for Islamic Banks of Bangladesh.',
    descriptionBn: 'মুআমালাতের মাসআলা, শরয়ী চুক্তি এবং বাংলাদেশের সেন্ট্রাল শরীয়াহ বোর্ডের ফতোয়া সংকলন।',
    iconName: 'Scale',
    image: '/images/hero_islamic_library_1793322325013.webp',
    itemCount: 19
  }
];

export const examYearsList = ['2024', '2023', '2022', '2021', '2020', '2019', '2018'];
export const subjectsList = [
  'All Subjects',
  'Islamic Economics & Banking Principles',
  'Investment Modes & Asset Financing',
  'Banking Laws & Regulations',
  'Accounting & Auditing (AAOIFI)',
  'Commercial Law & Shariah Governance',
  'Foreign Exchange & Sukuk',
  'Quran, Hadith & Economic Ethics',
  'Fiqh al-Muamalat & Fatwas'
];
