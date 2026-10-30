/**
 * District-wise Hanafi Prayer Time Engine for Bangladesh.
 * Calibrated to Islamic Foundation Bangladesh (IFB) parameters:
 * - Fajr angle: 18.0° (Islamic Foundation Bangladesh standard)
 * - Isha angle: 18.0°
 * - Asr calculation: Hanafi school (Shadow factor = 2, আসর হানাফী সময়)
 * - Timezone: UTC+6 (Bangladesh Standard Time, BST)
 */

import { toBengaliNumerals } from './dateUtils';

export interface DistrictLocation {
  id: string;
  nameEn: string;
  nameBn: string;
  divisionEn: string;
  divisionBn: string;
  lat: number;
  lng: number;
  dhakaOffsetMin: number; // Official Islamic Foundation minute adjustment relative to Dhaka (+ or -)
}

export const BANGLADESH_DISTRICTS: DistrictLocation[] = [
  // Dhaka Division
  { id: 'dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', lat: 23.8103, lng: 90.4125, dhakaOffsetMin: 0 },
  { id: 'gazipur', nameEn: 'Gazipur', nameBn: 'গাজীপুর', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', lat: 24.0023, lng: 90.4264, dhakaOffsetMin: 0 },
  { id: 'narayanganj', nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', lat: 23.6238, lng: 90.5000, dhakaOffsetMin: -1 },
  { id: 'tangail', nameEn: 'Tangail', nameBn: 'টাঙ্গাইল', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', lat: 24.2513, lng: 89.9167, dhakaOffsetMin: 2 },
  { id: 'faridpur', nameEn: 'Faridpur', nameBn: 'ফরিদপুর', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', lat: 23.6071, lng: 89.8429, dhakaOffsetMin: 2 },
  { id: 'narsingdi', nameEn: 'Narsingdi', nameBn: 'নরসিংদী', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', lat: 23.9322, lng: 90.7154, dhakaOffsetMin: -1 },
  { id: 'manikganj', nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', lat: 23.8644, lng: 90.0047, dhakaOffsetMin: 1 },
  { id: 'munshiganj', nameEn: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', lat: 23.5422, lng: 90.5305, dhakaOffsetMin: 0 },
  { id: 'kishoreganj', nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', lat: 24.4449, lng: 90.7766, dhakaOffsetMin: -2 },
  { id: 'gopalganj', nameEn: 'Gopalganj', nameBn: 'গোপালগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', lat: 23.0051, lng: 89.8266, dhakaOffsetMin: 2 },

  // Chattogram Division
  { id: 'chattogram', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', lat: 22.3569, lng: 91.7832, dhakaOffsetMin: -5 },
  { id: 'coxsbazar', nameEn: "Cox's Bazar", nameBn: 'কক্সবাজার', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', lat: 21.4272, lng: 92.0058, dhakaOffsetMin: -6 },
  { id: 'cumilla', nameEn: 'Cumilla', nameBn: 'কুমিল্লা', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', lat: 23.4607, lng: 91.1809, dhakaOffsetMin: -3 },
  { id: 'feni', nameEn: 'Feni', nameBn: 'ফেনী', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', lat: 23.0186, lng: 91.3966, dhakaOffsetMin: -4 },
  { id: 'brahmanbaria', nameEn: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', lat: 23.9571, lng: 91.1119, dhakaOffsetMin: -3 },
  { id: 'noakhali', nameEn: 'Noakhali', nameBn: 'নোয়াখালী', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', lat: 22.8696, lng: 91.0993, dhakaOffsetMin: -3 },
  { id: 'chandpur', nameEn: 'Chandpur', nameBn: 'চাঁদপুর', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', lat: 23.2333, lng: 90.6667, dhakaOffsetMin: -1 },
  { id: 'rangamati', nameEn: 'Rangamati', nameBn: 'রাঙ্গামাটি', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', lat: 22.6533, lng: 92.1753, dhakaOffsetMin: -6 },

  // Sylhet Division
  { id: 'sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট', divisionEn: 'Sylhet', divisionBn: 'সিলেট', lat: 24.8949, lng: 91.8687, dhakaOffsetMin: -6 },
  { id: 'moulvibazar', nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার', divisionEn: 'Sylhet', divisionBn: 'সিলেট', lat: 24.4829, lng: 91.7774, dhakaOffsetMin: -5 },
  { id: 'habiganj', nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ', divisionEn: 'Sylhet', divisionBn: 'সিলেট', lat: 24.3749, lng: 91.4155, dhakaOffsetMin: -4 },
  { id: 'sunamganj', nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ', divisionEn: 'Sylhet', divisionBn: 'সিলেট', lat: 25.0658, lng: 91.3950, dhakaOffsetMin: -5 },

  // Rajshahi Division
  { id: 'rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', lat: 24.3745, lng: 88.6042, dhakaOffsetMin: 7 },
  { id: 'bogura', nameEn: 'Bogura', nameBn: 'বগুড়া', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', lat: 24.8465, lng: 89.3777, dhakaOffsetMin: 4 },
  { id: 'pabna', nameEn: 'Pabna', nameBn: 'পাবনা', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', lat: 24.0064, lng: 89.2372, dhakaOffsetMin: 5 },
  { id: 'sirajganj', nameEn: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', lat: 24.4534, lng: 89.7008, dhakaOffsetMin: 3 },
  { id: 'naogaon', nameEn: 'Naogaon', nameBn: 'নওগাঁ', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', lat: 24.7936, lng: 88.9318, dhakaOffsetMin: 6 },
  { id: 'chapai', nameEn: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', lat: 24.5965, lng: 88.2776, dhakaOffsetMin: 8 },

  // Khulna Division
  { id: 'khulna', nameEn: 'Khulna', nameBn: 'খুলনা', divisionEn: 'Khulna', divisionBn: 'খুলনা', lat: 22.8456, lng: 89.5403, dhakaOffsetMin: 3 },
  { id: 'jashore', nameEn: 'Jashore', nameBn: 'যশোর', divisionEn: 'Khulna', divisionBn: 'খুলনা', lat: 23.1664, lng: 89.2081, dhakaOffsetMin: 5 },
  { id: 'kushtia', nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া', divisionEn: 'Khulna', divisionBn: 'খুলনা', lat: 23.9013, lng: 89.1205, dhakaOffsetMin: 5 },
  { id: 'satkhira', nameEn: 'Satkhira', nameBn: 'সাতক্ষীরা', divisionEn: 'Khulna', divisionBn: 'খুলনা', lat: 22.7185, lng: 89.0705, dhakaOffsetMin: 5 },
  { id: 'bagerhat', nameEn: 'Bagerhat', nameBn: 'বাগেরহাট', divisionEn: 'Khulna', divisionBn: 'খুলনা', lat: 22.6516, lng: 89.7859, dhakaOffsetMin: 2 },
  { id: 'chuadanga', nameEn: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', divisionEn: 'Khulna', divisionBn: 'খুলনা', lat: 23.6402, lng: 88.8418, dhakaOffsetMin: 6 },

  // Barishal Division
  { id: 'barishal', nameEn: 'Barishal', nameBn: 'বরিশাল', divisionEn: 'Barishal', divisionBn: 'বরিশাল', lat: 22.7010, lng: 90.3535, dhakaOffsetMin: 0 },
  { id: 'patuakhali', nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী', divisionEn: 'Barishal', divisionBn: 'বরিশাল', lat: 22.3596, lng: 90.3299, dhakaOffsetMin: 0 },
  { id: 'bhola', nameEn: 'Bhola', nameBn: 'ভোলা', divisionEn: 'Barishal', divisionBn: 'বরিশাল', lat: 22.6859, lng: 90.6482, dhakaOffsetMin: -1 },
  { id: 'pirojpur', nameEn: 'Pirojpur', nameBn: 'পিরোজপুর', divisionEn: 'Barishal', divisionBn: 'বরিশাল', lat: 22.5841, lng: 89.9720, dhakaOffsetMin: 2 },

  // Rangpur Division
  { id: 'rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর', divisionEn: 'Rangpur', divisionBn: 'রংপুর', lat: 25.7439, lng: 89.2752, dhakaOffsetMin: 4 },
  { id: 'dinajpur', nameEn: 'Dinajpur', nameBn: 'দিনাজপুর', divisionEn: 'Rangpur', divisionBn: 'রংপুর', lat: 25.6217, lng: 88.6355, dhakaOffsetMin: 7 },
  { id: 'gaibandha', nameEn: 'Gaibandha', nameBn: 'গাইবান্ধা', divisionEn: 'Rangpur', divisionBn: 'রংপুর', lat: 25.3288, lng: 89.5408, dhakaOffsetMin: 3 },
  { id: 'kurigram', nameEn: 'Kurigram', nameBn: 'কুড়িগ্রাম', divisionEn: 'Rangpur', divisionBn: 'রংপুর', lat: 25.8054, lng: 89.6362, dhakaOffsetMin: 3 },
  { id: 'panchagarh', nameEn: 'Panchagarh', nameBn: 'পঞ্চগড়', divisionEn: 'Rangpur', divisionBn: 'রংপুর', lat: 26.3411, lng: 88.5542, dhakaOffsetMin: 8 },

  // Mymensingh Division
  { id: 'mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ', lat: 24.7471, lng: 90.4203, dhakaOffsetMin: 0 },
  { id: 'jamalpur', nameEn: 'Jamalpur', nameBn: 'জামালপুর', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ', lat: 24.9375, lng: 89.9378, dhakaOffsetMin: 2 },
  { id: 'sherpur', nameEn: 'Sherpur', nameBn: 'শেরপুর', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ', lat: 25.0205, lng: 90.0153, dhakaOffsetMin: 2 },
  { id: 'netrokona', nameEn: 'Netrokona', nameBn: 'নেত্রকোণা', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ', lat: 24.8709, lng: 90.7279, dhakaOffsetMin: -1 }
];

export interface PrayerTimeData {
  district: DistrictLocation;
  date: Date;
  times: {
    fajr: string;
    sunrise: string;
    ishraq: string;
    dhuhr: string;
    asr: string; // Hanafi
    maghrib: string; // Iftar
    isha: string;
    tahajjudEnd: string; // Sahri End
  };
  forbiddenTimes: {
    sunrise: string;
    noon: string;
    sunset: string;
  };
  nextPrayer: {
    nameEn: string;
    nameBn: string;
    timeStr: string;
    remainingMinutes: number;
  };
}

// Math helper functions for solar positions
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Calculates Solar times for a given day and latitude/longitude.
 */
export function calculatePrayerTimes(
  district: DistrictLocation,
  date: Date = new Date()
): PrayerTimeData {
  const lat = district.lat;
  const lng = district.lng;
  const timezone = 6; // BST is UTC+6

  // Day of year
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Solar parameters approximations (Astronomical Algorithms)
  // Fractional year in radians
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + ((date.getHours() - 12) / 24));

  // Equation of time in minutes
  const eqtime = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );

  // Solar declination angle in radians
  const decl = 0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Solar Noon (Dhuhr) in local hours
  const solarNoonHours = 12 + timezone - (lng / 15) - (eqtime / 60);

  // Helper to compute hour angle for a specific altitude
  const getHourAngle = (altitudeDeg: number): number => {
    const sinAlt = Math.sin(toRad(altitudeDeg));
    const cosLat = Math.cos(toRad(lat));
    const sinLat = Math.sin(toRad(lat));
    const cosDecl = Math.cos(decl);
    const sinDecl = Math.sin(decl);

    const cosH = (sinAlt - (sinLat * sinDecl)) / (cosLat * cosDecl);
    if (cosH > 1) return 0; // Sun never rises
    if (cosH < -1) return Math.PI; // Sun never sets
    return Math.acos(cosH);
  };

  // 1. Sunrise & Sunset (center of sun is -0.833° below horizon)
  const sunriseH = getHourAngle(-0.833);
  const sunriseHours = solarNoonHours - toDeg(sunriseH) / 15;
  const sunsetHours = solarNoonHours + toDeg(sunriseH) / 15;

  // 2. Fajr: Islamic Foundation Bangladesh uses 18.0° angle
  const fajrH = getHourAngle(-18.0);
  const fajrHours = solarNoonHours - toDeg(fajrH) / 15;

  // 3. Isha: Islamic Foundation Bangladesh uses 18.0° angle
  const ishaH = getHourAngle(-18.0);
  const ishaHours = solarNoonHours + toDeg(ishaH) / 15;

  // 4. Asr Hanafi: Shadow length = 2 * object + noon shadow
  // Noon shadow = tan(|lat - decl|)
  const noonShadow = Math.tan(Math.abs(toRad(lat) - decl));
  const hanafiAsrAltRad = Math.atan(1 / (2 + noonShadow)); // Shadow factor = 2 (Hanafi)
  const asrH = getHourAngle(toDeg(hanafiAsrAltRad));
  const asrHours = solarNoonHours + toDeg(asrH) / 15;

  // Format decimal hours to 12-hour AM/PM string
  const formatTime = (decimalHours: number): string => {
    let totalMinutes = Math.round(decimalHours * 60);
    // Wrap around 24 hours
    totalMinutes = (totalMinutes + 1440) % 1440;

    let h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;

    const mStr = m < 10 ? `0${m}` : `${m}`;
    const hStr = h < 10 ? `0${h}` : `${h}`;
    return `${hStr}:${mStr} ${period}`;
  };

  // Safe buffer additions standard in Bangladesh:
  // - Dhuhr: +4 minutes buffer after zenith
  // - Maghrib: +2 minutes buffer for complete disc disappearance
  // - Sahri End: 5 minutes before Fajr
  // - Ishraq: 15 minutes after sunrise
  const fajrStr = formatTime(fajrHours);
  const sunriseStr = formatTime(sunriseHours);
  const ishraqStr = formatTime(sunriseHours + (15 / 60));
  const dhuhrStr = formatTime(solarNoonHours + (4 / 60));
  const asrStr = formatTime(asrHours + (2 / 60));
  const maghribStr = formatTime(sunsetHours + (2 / 60));
  const ishaStr = formatTime(ishaHours + (3 / 60));
  const sahriEndStr = formatTime(fajrHours - (5 / 60));

  // Forbidden prayer periods
  // 1. From Sunrise to 15 mins later
  // 2. Exactly at Zawal noon (about 10 mins before Dhuhr)
  // 3. Sunset (about 15 mins before Maghrib, except current Asr)
  const forbiddenSunrise = `${sunriseStr} - ${ishraqStr}`;
  const forbiddenNoon = `${formatTime(solarNoonHours - 8/60)} - ${formatTime(solarNoonHours + 2/60)}`;
  const forbiddenSunset = `${formatTime(sunsetHours - 15/60)} - ${maghribStr}`;

  // Find Next Prayer based on current time
  const currentTotalMins = date.getHours() * 60 + date.getMinutes();

  const parseToTotalMins = (decHours: number) => {
    return (Math.round(decHours * 60) + 1440) % 1440;
  };

  const prayers = [
    { nameEn: 'Fajr', nameBn: 'ফজর', mins: parseToTotalMins(fajrHours), str: fajrStr },
    { nameEn: 'Dhuhr', nameBn: 'যোহর', mins: parseToTotalMins(solarNoonHours + 4/60), str: dhuhrStr },
    { nameEn: 'Asr (Hanafi)', nameBn: 'আসর (হানাফী)', mins: parseToTotalMins(asrHours + 2/60), str: asrStr },
    { nameEn: 'Maghrib', nameBn: 'মাগরিব', mins: parseToTotalMins(sunsetHours + 2/60), str: maghribStr },
    { nameEn: 'Isha', nameBn: 'এশা', mins: parseToTotalMins(ishaHours + 3/60), str: ishaStr }
  ];

  let nextPrayer = prayers[0];
  let remainingMinutes = 0;

  const upcoming = prayers.find(p => p.mins > currentTotalMins);
  if (upcoming) {
    nextPrayer = upcoming;
    remainingMinutes = upcoming.mins - currentTotalMins;
  } else {
    // Next prayer is tomorrow's Fajr
    nextPrayer = prayers[0];
    remainingMinutes = (1440 - currentTotalMins) + prayers[0].mins;
  }

  return {
    district,
    date,
    times: {
      fajr: fajrStr,
      sunrise: sunriseStr,
      ishraq: ishraqStr,
      dhuhr: dhuhrStr,
      asr: asrStr,
      maghrib: maghribStr,
      isha: ishaStr,
      tahajjudEnd: sahriEndStr
    },
    forbiddenTimes: {
      sunrise: forbiddenSunrise,
      noon: forbiddenNoon,
      sunset: forbiddenSunset
    },
    nextPrayer: {
      nameEn: nextPrayer.nameEn,
      nameBn: nextPrayer.nameBn,
      timeStr: nextPrayer.str,
      remainingMinutes
    }
  };
}

/**
 * Formats time string into Bengali numerals.
 * Example: "04:45 AM" -> "০৪:৪৫ AM"
 */
export function formatTimeInBengali(timeStr: string): string {
  const parts = timeStr.split(' ');
  const digits = toBengaliNumerals(parts[0]);
  const period = parts[1] === 'AM' ? 'ভোর/সকাল' : 'দুপুর/সন্ধ্যা';
  return `${digits} ${parts[1]}`;
}
