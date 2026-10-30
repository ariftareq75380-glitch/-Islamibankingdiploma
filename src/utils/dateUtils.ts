/**
 * Cultural & Financial Date Utilities for Islamic Banking in Bangladesh.
 * Supports:
 * 1. Gregorian (Standard English & Bengali)
 * 2. Bengali Solar Calendar (বঙ্গাব্দ - Revised Bangla Academy Standard)
 * 3. Hijri / Islamic Lunar Calendar (হিজরি - Umm al-Qura Standard)
 */

export const BENGALI_NUMERALS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumerals(input: string | number): string {
  return String(input).replace(/[0-9]/g, (digit) => BENGALI_NUMERALS[parseInt(digit, 10)]);
}

export const BENGALI_MONTHS = [
  'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
  'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
];

export const BENGALI_MONTHS_EN = [
  'Boishakh', 'Jaishtha', 'Ashar', 'Srabon', 'Bhadra', 'Ashwin',
  'Kartik', 'Agrahayan', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

export const GREGORIAN_MONTHS_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export const BENGALI_DAYS = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

export const HIJRI_MONTHS_BN = [
  'মুহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি',
  'জুমাদাল উলা', 'জুমাদাস সানি', 'রজব', 'শাবান',
  'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'
];

export const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
];

export interface TriDateInfo {
  gregorian: {
    day: number;
    month: number;
    year: number;
    dayNameEn: string;
    dayNameBn: string;
    monthNameEn: string;
    monthNameBn: string;
    formattedEn: string;
    formattedBn: string;
  };
  bengali: {
    day: number;
    monthIndex: number;
    monthNameBn: string;
    monthNameEn: string;
    year: number;
    formattedBn: string;
    formattedEn: string;
  };
  hijri: {
    day: number;
    monthIndex: number;
    monthNameBn: string;
    monthNameEn: string;
    year: number;
    formattedBn: string;
    formattedEn: string;
  };
}

/**
 * Checks if a Gregorian year is a leap year.
 */
function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Converts Gregorian date to Revised Bangladeshi Bengali Calendar (Bangla Academy 2019 standard):
 * - Boishakh 1 is on April 14.
 * - Boishakh to Ashwin (first 6 months): 31 days each.
 * - Kartik to Magh (next 4 months): 30 days each.
 * - Falgun: 29 days (30 in leap year).
 * - Chaitra: 30 days.
 */
export function getBengaliDate(date: Date) {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth(); // 0-indexed (0 = Jan)
  const gDay = date.getDate();

  // Days in Gregorian months for the given year
  const gDaysInMonth = [
    31,
    isGregorianLeapYear(gYear) ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ];

  // Month lengths in Revised Bangladesh Bengali calendar
  const bMonthDays = [
    31, 31, 31, 31, 31, 31, // Boishakh - Ashwin
    30, 30, 30, 30,         // Kartik - Magh
    isGregorianLeapYear(gYear) ? 30 : 29, // Falgun
    30                      // Chaitra
  ];

  // Calculate day of year (0-indexed) for current date
  let dayOfYear = 0;
  for (let m = 0; m < gMonth; m++) {
    dayOfYear += gDaysInMonth[m];
  }
  dayOfYear += gDay;

  // Day of year for April 14 (Pohela Boishakh)
  // Jan(31) + Feb(28/29) + Mar(31) + 14 = 76 or 77 + 14 = 90 or 91
  const daysBeforeApril = 31 + (isGregorianLeapYear(gYear) ? 29 : 28) + 31;
  const pohelaBoishakhDayOfYear = daysBeforeApril + 14;

  let bYear: number;
  let bDayIndex: number;

  if (dayOfYear >= pohelaBoishakhDayOfYear) {
    // Current Bengali year started this April
    bYear = gYear - 593;
    bDayIndex = dayOfYear - pohelaBoishakhDayOfYear; // 0 for 1st Boishakh
  } else {
    // Current Bengali year started previous April
    bYear = gYear - 594;
    const prevYearLeap = isGregorianLeapYear(gYear - 1);
    const prevDaysBeforeApril = 31 + (prevYearLeap ? 29 : 28) + 31;
    const prevPohela = prevDaysBeforeApril + 14;
    const totalDaysInPrevYear = prevYearLeap ? 366 : 365;
    bDayIndex = (totalDaysInPrevYear - prevPohela) + dayOfYear;
  }

  // Determine month and day
  let bMonthIndex = 0;
  let remainingDays = bDayIndex;

  for (let i = 0; i < 12; i++) {
    if (remainingDays < bMonthDays[i]) {
      bMonthIndex = i;
      break;
    }
    remainingDays -= bMonthDays[i];
  }

  const bDay = remainingDays + 1;

  const formattedBn = `${toBengaliNumerals(bDay)} ${BENGALI_MONTHS[bMonthIndex]} ${toBengaliNumerals(bYear)} বঙ্গাব্দ`;
  const formattedEn = `${bDay} ${BENGALI_MONTHS_EN[bMonthIndex]} ${bYear} BS`;

  return {
    day: bDay,
    monthIndex: bMonthIndex,
    monthNameBn: BENGALI_MONTHS[bMonthIndex],
    monthNameEn: BENGALI_MONTHS_EN[bMonthIndex],
    year: bYear,
    formattedBn,
    formattedEn
  };
}

/**
 * Calculates Hijri Date using native Intl islamic calendar with accurate fallback.
 */
export function getHijriDate(date: Date) {
  try {
    // Intl Umm al-Qura formatting
    const intlFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });

    const parts = intlFormatter.formatToParts(date);
    let hDay = 1;
    let hMonth = 1;
    let hYear = 1448;

    for (const part of parts) {
      if (part.type === 'day') hDay = parseInt(part.value, 10) || 1;
      if (part.type === 'month') hMonth = parseInt(part.value, 10) || 1;
      if (part.type === 'year') hYear = parseInt(part.value, 10) || 1448;
    }

    const monthIndex = Math.max(0, Math.min(11, hMonth - 1));
    const monthNameBn = HIJRI_MONTHS_BN[monthIndex];
    const monthNameEn = HIJRI_MONTHS_EN[monthIndex];

    const formattedBn = `${toBengaliNumerals(hDay)} ${monthNameBn} ${toBengaliNumerals(hYear)} হিজরি`;
    const formattedEn = `${hDay} ${monthNameEn} ${hYear} AH`;

    return {
      day: hDay,
      monthIndex,
      monthNameBn,
      monthNameEn,
      year: hYear,
      formattedBn,
      formattedEn
    };
  } catch {
    // Fallback astronomical approximate calculation
    // Julian Day number
    const time = date.getTime();
    const jd = Math.floor(time / 86400000) + 2440587.5;
    const l = Math.floor(jd - 1948439.5) + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const m = Math.floor((24 * l3) / 709);
    const d = l3 - Math.floor((709 * m) / 24);
    const y = 30 * n + j - 30;

    const monthIndex = Math.max(0, Math.min(11, m - 1));
    return {
      day: d,
      monthIndex,
      monthNameBn: HIJRI_MONTHS_BN[monthIndex],
      monthNameEn: HIJRI_MONTHS_EN[monthIndex],
      year: y,
      formattedBn: `${toBengaliNumerals(d)} ${HIJRI_MONTHS_BN[monthIndex]} ${toBengaliNumerals(y)} হিজরি`,
      formattedEn: `${d} ${HIJRI_MONTHS_EN[monthIndex]} ${y} AH`
    };
  }
}

/**
 * Returns complete tri-date information for any date.
 */
export function getTriDate(date: Date = new Date()): TriDateInfo {
  const gDay = date.getDate();
  const gMonth = date.getMonth();
  const gYear = date.getFullYear();
  const dayOfWeek = date.getDay();

  const dayNameEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  const dayNameBn = BENGALI_DAYS[dayOfWeek];
  const monthNameEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ][gMonth];
  const monthNameBn = GREGORIAN_MONTHS_BN[gMonth];

  const formattedEn = `${dayNameEn}, ${monthNameEn} ${gDay}, ${gYear}`;
  const formattedBn = `${dayNameBn}, ${toBengaliNumerals(gDay)} ${monthNameBn} ${toBengaliNumerals(gYear)}`;

  return {
    gregorian: {
      day: gDay,
      month: gMonth + 1,
      year: gYear,
      dayNameEn,
      dayNameBn,
      monthNameEn,
      monthNameBn,
      formattedEn,
      formattedBn
    },
    bengali: getBengaliDate(date),
    hijri: getHijriDate(date)
  };
}

/**
 * Islamic Banking and Financial Calendar Reference Milestones.
 */
export const ISLAMIC_BANKING_CALENDAR_EVENTS = [
  {
    hijriMonth: 'রমজান (Ramadan)',
    eventBn: 'যাকাত হিসাব ও সিএসআর ফান্ড বিতরণ মাস',
    eventEn: 'Annual Zakat Calculation & CSR Allocation Cycle',
    descriptionBn: 'বেশিরভাগ ইসলামী ব্যাংক রমজান মাসে হিসাব বছর সমাপ্ত করে আমানতকারী ও বিনিয়োগের ওপর যাকাতের নিসাব নির্ধারণ করে।',
    descriptionEn: 'The preferred month for Islamic Financial Institutions in Bangladesh to assess client Zakat obligations and disburse benevolent funds.'
  },
  {
    hijriMonth: 'শাওয়াল (Shawwal)',
    eventBn: 'ঈদুল ফিতর ও অর্ধ-বার্ষিক মুনাফা সমতাকরণ রিজার্ভ (PER) পর্যালোচনা',
    eventEn: 'Eid al-Fitr & Semi-Annual Profit Equalization Reserve (PER) Review',
    descriptionBn: 'মুদারাবা সঞ্চয়ী হিসাবসমূহের আনুমানিক ওয়েটেজ বণ্টন ও রিটার্ন অ্যাডজাস্টমেন্ট।',
    descriptionEn: 'Interim review of Mudaraba weightages and investment yields across commercial branches.'
  },
  {
    hijriMonth: 'জিলহজ (Dhu al-Hijjah)',
    eventBn: 'পবিত্র হজ্জ ও পশু কোরবানি অর্থায়ন (Qurbani Finance Window)',
    eventEn: 'Hajj & Qurbani Asset Financing Settlements',
    descriptionBn: 'হজ্জ ডিপোজিট স্কিম মেয়াদপূর্তি এবং ক্যাটল ফার্ম অর্থায়নের বাই-মুরাবাহা নিষ্পত্তি।',
    descriptionEn: 'Maturity settlements for Hajj deposit accounts and agricultural financing contracts.'
  },
  {
    hijriMonth: 'মুহররম (Muharram)',
    eventBn: 'নতুন হিজরি আর্থিক বছর ও শরীয়াহ অডিট ক্যালেন্ডার শুরু',
    eventEn: 'New Islamic Hijri Year & Annual Shariah Audit Initiation',
    descriptionBn: 'কেন্দ্রীয় শরীয়াহ বোর্ডের দিকনির্দেশনায় ব্যাংকসমূহের বার্ষিক শরীয়াহ কমপ্লায়েন্স ইন্সপেকশন পরিকল্পনা।',
    descriptionEn: 'Commencement of comprehensive Shariah governance audits and compliance reporting.'
  }
];
