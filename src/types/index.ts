export type CourseType = 
  | 'DIB-1' 
  | 'DIB-2' 
  | 'DIB-General' 
  | 'Islamic-Banking'
  | 'Islamic-Studies' 
  | 'Quran-Hadith' 
  | 'Fiqh-Fatwa';

export type ExamSession = 'May' | 'November' | 'Special' | 'All';

export type ResourceCategory = 
  | 'Question-Paper' 
  | 'Solved-Answer' 
  | 'Study-Notes' 
  | 'Handout' 
  | 'Book-Reference' 
  | 'Fatwa-Resolution'
  | 'Syllabus-Guideline';

export interface PdfResource {
  id: string;
  title: string;
  titleBn: string;
  subject: string;
  subjectBn: string;
  course: CourseType;
  examYear: string;
  examSession: ExamSession;
  sessionBangla?: string;
  language: 'bn' | 'en' | 'bilingual';
  description: string;
  descriptionBn: string;
  category: ResourceCategory;
  categoryBn: string;
  tags: string[];
  pdfFileUrl: string; // Direct PDF data URL or hosted path
  googleDriveUrl?: string; // Optional external Google Drive URL
  fileSize: string;
  pageCount?: number;
  publicationDate: string;
  downloadsCount: number;
  viewsCount: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  previewSupported: boolean;
  curatorNote?: string;
  keyTopics?: string[];
  slug?: string;
  thumbnailUrl?: string;
  keywords?: string[];
}

export interface Article {
  id: string;
  title: string;
  titleBn: string;
  slug: string;
  author: string;
  authorDesignation: string;
  publishedDate: string;
  readTime: string;
  category: string;
  categoryBn: string;
  summary: string;
  summaryBn: string;
  contentMarkdownEn: string;
  contentMarkdownBn: string;
  tags: string[];
  keywords?: string[];
  coverImage?: string;
  featured?: boolean;
  relatedResourceIds?: string[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  courseType?: CourseType;
  description: string;
  descriptionBn: string;
  iconName: string;
  image: string;
  itemCount: number;
}

export interface SiteSettings {
  siteName: string;
  siteNameBn: string;
  subtitle: string;
  subtitleBn: string;
  noticeText: string;
  noticeTextBn: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  enableAdPlacements: boolean;
  adsensePublisherId: string;
}

export type ActiveTab = 
  | 'home' 
  | 'banking' 
  | 'diploma' 
  | 'previous-questions' 
  | 'islamic-studies' 
  | 'quran-hadith' 
  | 'fiqh-fatwa' 
  | 'pdf-library' 
  | 'articles' 
  | 'mock-test'
  | 'faq'
  | 'bookmarks-view'
  | 'about' 
  | 'contact' 
  | 'privacy' 
  | 'disclaimer'
  | 'wp-blueprint';

