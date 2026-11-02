import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  PdfResource, 
  Article, 
  ActiveTab, 
  CourseType, 
  SiteSettings 
} from './types';
import { StorageService } from './services/storage';
import { categoriesList } from './data/mockData';

// Components
import { Navbar } from './components/Navbar';
import { PrayerAndDateStrip } from './components/PrayerAndDateStrip';
import { HeroSection } from './components/HeroSection';
import { ResumeStudyBanner } from './components/ResumeStudyBanner';
import { FeaturedCategories } from './components/FeaturedCategories';
import { DiplomaExamSection } from './components/DiplomaExamSection';
import { HighlightedArticlesSection, RecentArticlesSection } from './components/HomeArticleSections';
import { ZakatCalculator } from './components/ZakatCalculator';
import { PracticeMockTest } from './components/PracticeMockTest';
import { BookmarksView } from './components/BookmarksView';
import { FaqSection } from './components/FaqSection';
import { ResourceFilters } from './components/ResourceFilters';
import { PdfCard } from './components/PdfCard';
import { PdfViewerModal } from './components/PdfViewerModal';
import { ArticlesSection } from './components/ArticlesSection';
import { ArticleModal } from './components/ArticleModal';
import { ArticleDetailView } from './components/ArticleDetailView';
import { ContentEditorModal } from './components/ContentEditorModal';
import { AdminPanel } from './components/AdminPanel';
import { WordPressArchitectureModal } from './components/WordPressArchitectureModal';
import { InformationalPages } from './components/InformationalPages';
import { AdPlacement } from './components/AdPlacement';
import { Footer } from './components/Footer';
import { IslamicCalendarModal } from './components/IslamicCalendarModal';
import { PrayerTimesModal } from './components/PrayerTimesModal';
import { updateSEOMetadata } from './utils/seo';

import { 
  FileText, 
  GraduationCap, 
  Search, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Bookmark, 
  ArrowRight,
  X,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // Primary state
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [lang, setLang] = useState<'bn' | 'en'>('bn'); // Default to Bengali as primary audience is Bangladesh
  const [resources, setResources] = useState<PdfResource[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [lastRead, setLastRead] = useState<{ id: string; title: string; titleBn: string; timestamp: number } | null>(null);

  // Reading Experience: Theme & Font Size
  const [theme, setThemeState] = useState<'light' | 'sepia' | 'dark'>(() => StorageService.getTheme());
  const [fontSize, setFontSizeState] = useState<'sm' | 'base' | 'lg' | 'xl'>(() => StorageService.getFontSize());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedSession, setSelectedSession] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modals & Reader state
  const [selectedPdfForPreview, setSelectedPdfForPreview] = useState<PdfResource | null>(null);
  const [selectedArticleForRead, setSelectedArticleForRead] = useState<Article | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminVisible, setIsAdminVisible] = useState<boolean>(() => {
    return localStorage.getItem('dib_admin_visible') === 'true';
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dib_admin_auth') === 'true';
  });
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isBookmarksDrawerOpen, setIsBookmarksDrawerOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);
  const [editingArticleForEditor, setEditingArticleForEditor] = useState<Article | null>(null);
  const [articleMenuFilter, setArticleMenuFilter] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('menu');
    }
    return null;
  });

  const librarySectionRef = useRef<HTMLDivElement>(null);

  const handleSecretAdminTrigger = () => {
    setIsAdminVisible(true);
    localStorage.setItem('dib_admin_visible', 'true');
    setIsAdminOpen(true);
  };

  const handleHideAdmin = () => {
    setIsAdminVisible(false);
    localStorage.removeItem('dib_admin_visible');
  };

  // Secret admin access triggers (Keyboard: Ctrl+Shift+A or Alt+A, or URL query: ?admin=1 / #admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        handleSecretAdminTrigger();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' || params.get('admin') === 'true' || window.location.hash === '#admin') {
      handleSecretAdminTrigger();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync initial theme
  useEffect(() => {
    StorageService.setTheme(theme);
  }, [theme]);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setResources(StorageService.getResources());
    setArticles(StorageService.getArticles());
    setSettings(StorageService.getSettings());
    setBookmarks(StorageService.getBookmarks());
    setCompletedIds(StorageService.getCompletedResources());
    setLastRead(StorageService.getLastReadResource());
  };

  const handleThemeChange = (newTheme: 'light' | 'sepia' | 'dark') => {
    setThemeState(newTheme);
    StorageService.setTheme(newTheme);
  };

  const handleFontSizeChange = (newSize: 'sm' | 'base' | 'lg' | 'xl') => {
    setFontSizeState(newSize);
    StorageService.setFontSize(newSize);
  };

  const handleDownloadIncrement = (id: string) => {
    StorageService.incrementDownload(id);
    loadAllData();
  };

  const handleToggleBookmark = (id: string) => {
    StorageService.toggleBookmark(id);
    setBookmarks(StorageService.getBookmarks());
  };

  const handleToggleComplete = (id: string) => {
    StorageService.toggleCompletedResource(id);
    setCompletedIds(StorageService.getCompletedResources());
  };

  const handlePreviewResource = (res: PdfResource) => {
    setSelectedPdfForPreview(res);
    StorageService.setLastReadResource(res.id, res.title, res.titleBn);
    setLastRead(StorageService.getLastReadResource());
  };

  const handleResumeLastRead = (resourceId: string) => {
    const target = resources.find(r => r.id === resourceId);
    if (target) {
      setSelectedPdfForPreview(target);
    } else {
      setActiveTab('diploma');
    }
  };

  // Scroll helper
  const scrollToLibrary = () => {
    handleNavigateUrl('/pdf-library');
    setTimeout(() => {
      librarySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Active filter count calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCourse !== 'ALL') count++;
    if (selectedSubject !== 'ALL') count++;
    if (selectedYear !== 'ALL') count++;
    if (selectedSession !== 'ALL') count++;
    if (selectedLanguage !== 'ALL') count++;
    if (selectedCategory !== 'ALL') count++;
    return count;
  }, [selectedCourse, selectedSubject, selectedYear, selectedSession, selectedLanguage, selectedCategory]);

  const handleResetFilters = () => {
    setSelectedCourse('ALL');
    setSelectedSubject('ALL');
    setSelectedYear('ALL');
    setSelectedSession('ALL');
    setSelectedLanguage('ALL');
    setSelectedCategory('ALL');
    setSearchQuery('');
  };

  // URL routing synchronization (HTML5 History API)
  const syncRouteFromLocation = (articlesList: Article[] = articles, resourcesList: PdfResource[] = resources) => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const searchParams = new URLSearchParams(window.location.search);
    setArticleMenuFilter(searchParams.get('menu'));

    if (!pathname || pathname === 'home') {
      setActiveTab('home');
      setSelectedArticleForRead(null);
      updateSEOMetadata({
        title: 'ইসলামী ব্যাংকিং ডিপ্লোমা | Islami Banking Diploma (DIB)',
        canonicalPath: '/'
      });
      return;
    }

    const segments = pathname.split('/');
    if (segments.length >= 2) {
      const [section, slug] = segments;
      if (section === 'diploma' || section === 'articles') {
        const matched = articlesList.find(a => a.slug === slug || a.id === slug);
        if (matched) {
          setSelectedArticleForRead(matched);
          setActiveTab(section === 'articles' ? 'articles' : 'diploma');
          return;
        }
        const matchedRes = resourcesList.find(r => r.slug === slug || r.id === slug);
        if (matchedRes) {
          setSelectedPdfForPreview(matchedRes);
          setActiveTab('diploma');
          return;
        }
      } else if (section === 'questions') {
        const matchedRes = resourcesList.find(r => r.slug === slug || r.id === slug);
        if (matchedRes) {
          setSelectedPdfForPreview(matchedRes);
          setActiveTab('previous-questions');
          return;
        }
      }
    }

    if (pathname === 'zakat-calculator') {
      setActiveTab('zakat-calculator');
      setSelectedArticleForRead(null);
      updateSEOMetadata({
        title: 'যাকাত ক্যালকুলেটর (Zakat Calculator) | ইসলামী ব্যাংকিং ডিপ্লোমা',
        description: 'আপনার সম্পদের পরিমাণ লিখে নিসাব অনুযায়ী যাকাতের আনুমানিক হিসাব জানুন। নিসাবের টাকার মূল্য আপনার দেওয়া দামের ভিত্তিতে হিসাব হয়।',
        canonicalPath: '/zakat-calculator'
      });
      return;
    }

    const validTabs: ActiveTab[] = [
      'home', 'banking', 'diploma', 'previous-questions', 'islamic-studies',
      'quran-hadith', 'fiqh-fatwa', 'pdf-library', 'articles', 'mock-test',
      'faq', 'bookmarks-view', 'about', 'contact', 'privacy', 'disclaimer', 'wp-blueprint',
      'zakat-calculator'
    ];
    if (validTabs.includes(pathname as ActiveTab)) {
      setActiveTab(pathname as ActiveTab);
      setSelectedArticleForRead(null);
      updateSEOMetadata({
        title: `${pathname.toUpperCase()} | ইসলামী ব্যাংকিং ডিপ্লোমা`,
        canonicalPath: `/${pathname}`
      });
    } else {
      setActiveTab('not-found');
      setSelectedArticleForRead(null);
      updateSEOMetadata({
        title: 'পৃষ্ঠাটি পাওয়া যায়নি (৪০৪) | ইসলামী ব্যাংকিং ডিপ্লোমা',
        canonicalPath: `/${pathname}`
      });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      syncRouteFromLocation();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles, resources]);

  useEffect(() => {
    if (articles.length > 0 || resources.length > 0) {
      syncRouteFromLocation(articles, resources);
    }
  }, [articles, resources]);

  const handleOpenArticle = (art: Article) => {
    setSelectedArticleForRead(art);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/diploma/${art.slug}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseArticle = () => {
    setSelectedArticleForRead(null);
    if (typeof window !== 'undefined') {
      const fallbackPath = activeTab === 'articles' ? '/articles' : (activeTab === 'home' ? '/' : `/${activeTab}`);
      window.history.pushState(null, '', fallbackPath);
    }
    updateSEOMetadata({
      title: 'ইসলামী ব্যাংকিং ডিপ্লোমা | Islami Banking Diploma (DIB)',
      canonicalPath: activeTab === 'articles' ? '/articles' : (activeTab === 'home' ? '/' : `/${activeTab}`)
    });
  };

  // Handle Tab changes that map to courses
  const handleSelectTabWithFilter = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSelectedArticleForRead(null);
    setArticleMenuFilter(null);
    if (typeof window !== 'undefined') {
      const targetPath = tab === 'home' ? '/' : `/${tab}`;
      window.history.pushState(null, '', targetPath);
    }
    if (tab === 'zakat-calculator') {
      updateSEOMetadata({
        title: 'যাকাত ক্যালকুলেটর (Zakat Calculator) | ইসলামী ব্যাংকিং ডিপ্লোমা',
        description: 'আপনার সম্পদের পরিমাণ লিখে নিসাব অনুযায়ী যাকাতের আনুমানিক হিসাব জানুন। নিসাবের টাকার মূল্য আপনার দেওয়া দামের ভিত্তিতে হিসাব হয়।',
        canonicalPath: '/zakat-calculator'
      });
    } else {
      updateSEOMetadata({
        title: `${tab.toUpperCase()} | ইসলামী ব্যাংকিং ডিপ্লোমা`,
        canonicalPath: tab === 'home' ? '/' : `/${tab}`
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto preset filters according to top nav tabs
    if (tab === 'banking') {
      setSelectedCourse('Islamic-Banking');
      setSelectedSubject('ALL');
    } else if (tab === 'diploma') {
      setSelectedCourse('DIB-General');
      setSelectedSubject('ALL');
    } else if (tab === 'previous-questions') {
      setSelectedCategory('Question-Paper');
    } else if (tab === 'islamic-studies') {
      setSelectedCourse('Islamic-Studies');
      setSelectedSubject('ALL');
    } else if (tab === 'quran-hadith') {
      setSelectedCourse('Quran-Hadith');
      setSelectedSubject('ALL');
    } else if (tab === 'fiqh-fatwa') {
      setSelectedCourse('Fiqh-Fatwa');
      setSelectedSubject('ALL');
    } else if (tab === 'home' || tab === 'pdf-library') {
      // Keep existing
    }
  };

  // Dedicated URL path navigator supporting query params (e.g., /articles?menu=dib-part-1)
  const handleNavigateUrl = (path: string) => {
    setSelectedArticleForRead(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
    }
    const [pathPart, searchPart] = path.split('?');
    const cleanPath = pathPart.replace(/^\/+|\/+$/g, '');
    const searchParams = new URLSearchParams(searchPart || '');
    const menuVal = searchParams.get('menu');
    setArticleMenuFilter(menuVal);

    if (cleanPath === 'articles') {
      setActiveTab('articles');
      updateSEOMetadata({
        title: 'আর্টিকেল ও কলাম | ইসলামী ব্যাংকিং ডিপ্লোমা',
        canonicalPath: path
      });
    } else if (cleanPath === 'pdf-library') {
      setActiveTab('pdf-library');
      updateSEOMetadata({
        title: 'পাঠাগার | ইসলামী ব্যাংকিং ডিপ্লোমা',
        canonicalPath: '/pdf-library'
      });
    } else {
      handleSelectTabWithFilter((cleanPath || 'home') as ActiveTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Multi-facet filtering engine for all PDF resources
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleBnMatch = item.titleBn.toLowerCase().includes(query);
        const titleEnMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query) || item.descriptionBn.toLowerCase().includes(query);
        const subjectMatch = item.subject.toLowerCase().includes(query) || item.subjectBn.toLowerCase().includes(query);
        const tagMatch = item.tags.some(t => t.toLowerCase().includes(query));
        const keyTopicMatch = item.keyTopics?.some(k => k.toLowerCase().includes(query));
        const yearMatch = item.examYear.includes(query);

        if (!titleBnMatch && !titleEnMatch && !descMatch && !subjectMatch && !tagMatch && !keyTopicMatch && !yearMatch) {
          return false;
        }
      }

      // 2. Course / Level Filter
      if (selectedCourse !== 'ALL') {
        if (selectedCourse === 'DIB-General') {
          if (item.course !== 'DIB-1' && item.course !== 'DIB-2' && item.course !== 'DIB-General') return false;
        } else if (item.course !== selectedCourse) {
          return false;
        }
      }

      // 3. Subject Filter
      if (selectedSubject !== 'ALL' && item.subject !== selectedSubject) {
        return false;
      }

      // 4. Exam Year Filter
      if (selectedYear !== 'ALL' && item.examYear !== selectedYear) {
        return false;
      }

      // 5. Exam Session Filter
      if (selectedSession !== 'ALL' && item.examSession !== selectedSession) {
        return false;
      }

      // 6. Category Type Filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // 7. Language Filter
      if (selectedLanguage !== 'ALL' && item.language !== selectedLanguage && item.language !== 'bilingual') {
        return false;
      }

      // 8. Publication Status: Hide drafts from public visitors
      if (item.status === 'draft' || item.isDraft) {
        return false;
      }

      return true;
    });
  }, [
    resources,
    searchQuery,
    selectedCourse,
    selectedSubject,
    selectedYear,
    selectedSession,
    selectedCategory,
    selectedLanguage
  ]);

  // Published resources & articles (Drafts excluded for public views)
  const publishedResources = useMemo(() => {
    return resources.filter(r => r.status !== 'draft' && !r.isDraft);
  }, [resources]);

  const publishedArticles = useMemo(() => {
    return articles.filter(a => a.status !== 'draft' && !a.isDraft);
  }, [articles]);

  // Computed counts for category cards
  const dibArticlesCount = useMemo(() => {
    return publishedArticles.filter(a => a.menuCategory === 'dib-part-1' || a.menuCategory === 'dib-part-2').length;
  }, [publishedArticles]);

  const dibResourcesCount = useMemo(() => {
    return publishedResources.filter(r => r.course === 'DIB-1' || r.course === 'DIB-2').length;
  }, [publishedResources]);

  const totalDibCount = useMemo(() => {
    return dibArticlesCount + dibResourcesCount;
  }, [dibArticlesCount, dibResourcesCount]);

  // Bookmarked Resources
  const bookmarkedResources = useMemo(() => {
    return resources.filter(r => bookmarks.includes(r.id) && r.status !== 'draft' && !r.isDraft);
  }, [resources, bookmarks]);

  // Font size class mapping
  const fontSizeClass = {
    sm: 'reader-size-sm',
    base: 'reader-size-base',
    lg: 'reader-size-lg',
    xl: 'reader-size-xl'
  }[fontSize];

  return (
    <div className={`min-h-screen flex flex-col bg-[#F8FAF5] text-stone-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans overflow-x-hidden ${fontSizeClass}`}>
      {/* Navigation Header with Reading Mode Tools & Organized Categories */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTabWithFilter}
        onNavigateUrl={handleNavigateUrl}
        lang={lang}
        setLang={setLang}
        openAdminModal={() => setIsAdminOpen(true)}
        openBlueprintModal={() => setIsBlueprintOpen(true)}
        bookmarkedCount={bookmarks.length}
        openBookmarks={() => setIsBookmarksDrawerOpen(true)}
        siteName={settings.siteName}
        siteNameBn={settings.siteNameBn}
        isAdminVisible={isAdminVisible}
        onHideAdmin={handleHideAdmin}
        theme={theme}
        onThemeChange={handleThemeChange}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
      />

      {/* Neat Information Strip below Header: Hijri Date, Bengali Date & District-wise Prayer Times */}
      <PrayerAndDateStrip
        onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
        onOpenPrayerTimesModal={() => setIsPrayerModalOpen(true)}
        lang={lang}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* STANDALONE ARTICLE / STUDY GUIDE VIEW WITH DISTINCT PERMANENT URL */}
        {selectedArticleForRead ? (
          <ArticleDetailView
            article={selectedArticleForRead}
            onBack={handleCloseArticle}
            allResources={publishedResources}
            onOpenResource={handlePreviewResource}
            onEditArticle={(art) => {
              setEditingArticleForEditor(art);
              setIsContentEditorOpen(true);
            }}
            lang={lang}
          />
        ) : (
          <>
            {/* 1. HOMEPAGE VIEW */}
            {activeTab === 'home' && (
              <>
                {/* 1. Compact Hero: Title, short description, search bar */}
                <HeroSection
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                  selectedCourse={selectedCourse}
                  setSelectedCourse={setSelectedCourse}
                  onExploreClick={() => handleNavigateUrl('/pdf-library')}
                  onNavigateTab={(tab) => handleSelectTabWithFilter(tab)}
                  totalResourcesCount={publishedResources.length}
                  totalArticlesCount={publishedArticles.length}
                  lang={lang}
                  resources={publishedResources}
                />

                {/* 2. Highlighted Section: up to two articles where featured is true; hidden if none */}
                <HighlightedArticlesSection
                  articles={publishedArticles}
                  onOpenArticle={handleOpenArticle}
                  onNavigateUrl={handleNavigateUrl}
                  lang={lang}
                />

                {/* 3. Recent Articles Section: 3 newest articles by publishedAt with "সব দেখুন" link to /articles */}
                <RecentArticlesSection
                  articles={publishedArticles}
                  onOpenArticle={handleOpenArticle}
                  onNavigateUrl={handleNavigateUrl}
                  lang={lang}
                />

                {/* 4. Three Category Cards: "ডিআইবি পরীক্ষা", "আর্টিকেলসমূহ", "পিডিএফ কর্নার" */}
                <FeaturedCategories
                  onNavigateUrl={handleNavigateUrl}
                  dibCount={totalDibCount}
                  articlesCount={publishedArticles.length}
                  pdfCount={publishedResources.length}
                  lang={lang}
                />
              </>
            )}

        {/* 2. DEDICATED PRACTICE & MOCK TEST MODE */}
        {activeTab === 'mock-test' && (
          <PracticeMockTest
            lang={lang}
            onBackToLibrary={() => setActiveTab('pdf-library')}
          />
        )}

        {/* 3. DEDICATED BOOKMARKS VIEW */}
        {activeTab === 'bookmarks-view' && (
          <BookmarksView
            resources={resources}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onPreview={handlePreviewResource}
            onDownloadIncrement={handleDownloadIncrement}
            completedIds={completedIds}
            onToggleComplete={handleToggleComplete}
            onBackToLibrary={() => setActiveTab('pdf-library')}
            lang={lang}
          />
        )}

        {/* 4. DEDICATED FAQ SECTION */}
        {activeTab === 'faq' && (
          <FaqSection
            lang={lang}
            onContactClick={() => setActiveTab('contact')}
          />
        )}

        {/* 5. PDF LIBRARY / SPECIFIC CATEGORY TAB VIEWS */}
        {(activeTab === 'diploma' || 
          activeTab === 'banking' || 
          activeTab === 'previous-questions' || 
          activeTab === 'islamic-studies' || 
          activeTab === 'quran-hadith' || 
          activeTab === 'fiqh-fatwa' || 
          activeTab === 'pdf-library') && (
          <div ref={librarySectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-bengali">
            {/* Header info */}
            <div className="mb-6 border-b border-stone-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  {lang === 'bn' ? 'নির্দিষ্ট বিভাগ ব্রাউজ করছেন' : 'Category Archive'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  {activeTab === 'diploma' && (lang === 'bn' ? 'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং (DIB)' : 'Diploma in Islamic Banking')}
                  {activeTab === 'banking' && (lang === 'bn' ? 'ইসলামী ব্যাংকিং ও অর্থায়ন নীতিমালা' : 'Islamic Banking & Finance Principles')}
                  {activeTab === 'previous-questions' && (lang === 'bn' ? 'বিগত বছরের প্রশ্নপত্র ও সমাধান (২০১৮–২০২৪)' : 'Previous Year Questions & Solutions')}
                  {activeTab === 'islamic-studies' && (lang === 'bn' ? 'ইসলামী শিক্ষা ও অর্থনীতি' : 'Islamic Studies & Economics')}
                  {activeTab === 'quran-hadith' && (lang === 'bn' ? 'কুরআন ও হাদিসে অর্থনৈতিক নীতিমালা' : 'Quran & Hadith on Commercial Integrity')}
                  {activeTab === 'fiqh-fatwa' && (lang === 'bn' ? 'ফিকহুল মুআমালাত ও ফতোয়া সংকলন' : 'Fiqh al-Muamalat & Shariah Resolutions')}
                  {activeTab === 'pdf-library' && (lang === 'bn' ? 'সম্পূর্ণ উন্মুক্ত পিডিএফ লাইব্রেরি' : 'Master Digital PDF Archive')}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('home')}
                  className="text-xs text-stone-600 hover:text-emerald-800 font-medium"
                >
                  ← {lang === 'bn' ? 'মূল হোমে ফিরে যান' : 'Back to Home'}
                </button>
              </div>
            </div>

            {/* Dedicated DIB Exam Papers organized by year with Mark as Read for previous questions */}
            {activeTab === 'previous-questions' && (
              <div className="mb-10">
                <DiplomaExamSection
                  resources={publishedResources}
                  onPreview={handlePreviewResource}
                  onDownloadIncrement={handleDownloadIncrement}
                  bookmarks={bookmarks}
                  onToggleBookmark={handleToggleBookmark}
                  lang={lang}
                  completedIds={completedIds}
                  onToggleComplete={handleToggleComplete}
                />
              </div>
            )}

            {/* Filter toolbar */}
            <div className="mb-6">
              <ResourceFilters
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedSession={selectedSession}
                setSelectedSession={setSelectedSession}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onReset={handleResetFilters}
                activeFilterCount={activeFilterCount}
                lang={lang}
              />
            </div>

            {/* Resources Grid */}
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((res) => (
                  <PdfCard
                    key={res.id}
                    resource={res}
                    onPreview={handlePreviewResource}
                    onDownloadIncrement={handleDownloadIncrement}
                    isBookmarked={bookmarks.includes(res.id)}
                    onToggleBookmark={handleToggleBookmark}
                    lang={lang}
                    isCompleted={completedIds.includes(res.id)}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-xs">
                <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  {lang === 'bn' ? 'কোনো রিসোর্স পাওয়া যায়নি' : 'No Resources Found'}
                </h3>
                <p className="text-xs text-stone-500 mb-4 font-bengali">
                  {lang === 'bn'
                    ? 'এই ক্যাটাগরিতে আপনার নির্বাচিত ফিল্টারে কোনো ফাইল পাওয়া যায়নি।'
                    : 'No documents match your active filters in this category.'}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl"
                >
                  {lang === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 6. ARTICLES STANDALONE VIEW */}
        {activeTab === 'articles' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-bengali">
            <ArticlesSection
              articles={publishedArticles}
              resources={publishedResources}
              onOpenArticle={handleOpenArticle}
              onWriteArticle={isAdminAuthenticated ? () => {
                setEditingArticleForEditor(null);
                setIsContentEditorOpen(true);
              } : undefined}
              lang={lang}
              menuFilter={articleMenuFilter}
              onSelectMenuFilter={(m) => {
                const targetUrl = m ? `/articles?menu=${m}` : '/articles';
                handleNavigateUrl(targetUrl);
              }}
            />
          </div>
        )}

        {/* 7. INFORMATIONAL & LEGAL PAGES */}
        {(activeTab === 'about' || activeTab === 'contact' || activeTab === 'privacy' || activeTab === 'disclaimer') && (
          <InformationalPages
            page={activeTab}
            settings={settings}
            lang={lang}
          />
        )}

        {/* 8. ZAKAT CALCULATOR VIEW */}
        {activeTab === 'zakat-calculator' && (
          <ZakatCalculator lang={lang} onNavigateUrl={handleNavigateUrl} />
        )}

        {/* 8. 404 NOT FOUND VIEW */}
        {activeTab === 'not-found' && (
          <div className="max-w-2xl mx-auto px-4 py-16 text-center font-bengali">
            <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 shadow-sm">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#047857] mb-2 tracking-tight">৪০৪</div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-4">
                {lang === 'bn' ? 'পৃষ্ঠাটি পাওয়া যায়নি' : 'Page Not Found'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                {lang === 'bn' ? 'দুঃখিত! এই পেজটি খুঁজে পাওয়া যায়নি' : 'Sorry! This page could not be found'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mb-6 max-w-md mx-auto">
                {lang === 'bn'
                  ? 'আপনি যে লিংকটি অনুসন্ধান করছেন তা পরিবর্তিত হয়েছে অথবা পৃষ্ঠাটির অস্তিত্ব নেই। নিচের লিংকগুলো থেকে কাঙ্ক্ষিত তথ্য খুঁজে নিন।'
                  : 'The link you visited might be broken or removed. Please explore our library using the links below.'}
              </p>

              <button
                onClick={() => {
                  setActiveTab('home');
                  if (typeof window !== 'undefined') window.history.pushState(null, '', '/');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              >
                ← {lang === 'bn' ? 'মূল হোমপেজে ফিরে যান' : 'Back to Home'}
              </button>

              <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                <button
                  onClick={() => {
                    setActiveTab('diploma');
                    if (typeof window !== 'undefined') window.history.pushState(null, '', '/diploma');
                  }}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-xs font-medium text-stone-800 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'ডিআইবি সিলেবাস ও নোট' : 'DIB Syllabus & Notes'}</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('previous-questions');
                    if (typeof window !== 'undefined') window.history.pushState(null, '', '/previous-questions');
                  }}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-xs font-medium text-stone-800 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'বিগত প্রশ্নব্যাংক (২০১৮–২৪)' : 'Past Question Bank'}</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('pdf-library');
                    if (typeof window !== 'undefined') window.history.pushState(null, '', '/pdf-library');
                  }}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-xs font-medium text-stone-800 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'উন্মুক্ত পিডিএফ লাইব্রেরি' : 'Open PDF Library'}</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('banking');
                    if (typeof window !== 'undefined') window.history.pushState(null, '', '/banking');
                  }}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-xs font-medium text-stone-800 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'ইসলামিক ব্যাংকিং ও অর্থায়ন' : 'Islamic Banking & Finance'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </main>

      {/* Bookmarks Quick Drawer Modal */}
      {isBookmarksDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-end font-bengali">
          <div 
            className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-emerald-800 fill-current" />
                <h3 className="font-bold text-stone-900 text-base">
                  {lang === 'bn' ? 'বুকমার্ককৃত রিসোর্সসমূহ' : 'Bookmarked PDF Resources'}
                </h3>
              </div>
              <button
                onClick={() => setIsBookmarksDrawerOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookmarkedResources.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between text-xs text-stone-500 pb-2">
                  <span>{bookmarkedResources.length} {lang === 'bn' ? 'টি আইটেম সংরক্ষিত' : 'items saved'}</span>
                  <button
                    onClick={() => {
                      setIsBookmarksDrawerOpen(false);
                      setActiveTab('bookmarks-view');
                    }}
                    className="text-emerald-800 font-semibold hover:underline"
                  >
                    {lang === 'bn' ? 'পূর্ণাঙ্গ পেজে দেখুন' : 'Open Full Page'} →
                  </button>
                </div>
                {bookmarkedResources.map(res => (
                  <div
                    key={res.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 hover:border-emerald-600 transition-colors"
                  >
                    <div className="text-[11px] text-emerald-800 font-semibold mb-1">
                      {res.examYear} · {res.course}
                    </div>
                    <div className="text-xs font-bold text-stone-900 mb-2">
                      {lang === 'bn' ? res.titleBn : res.title}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                      <button
                        onClick={() => {
                          setIsBookmarksDrawerOpen(false);
                          handlePreviewResource(res);
                        }}
                        className="text-emerald-800 font-semibold hover:underline"
                      >
                        {lang === 'bn' ? 'প্রিভিউ দেখুন' : 'Quick Preview'}
                      </button>
                      <button
                        onClick={() => handleToggleBookmark(res.id)}
                        className="text-red-600 text-[11px] hover:underline"
                      >
                        {lang === 'bn' ? 'মুছে ফেলুন' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-stone-400 text-xs flex-1 flex flex-col items-center justify-center">
                <Bookmark className="w-10 h-10 mb-2 opacity-40 text-stone-400" />
                <p>{lang === 'bn' ? 'আপনার কোনো বুকমার্ক সংরক্ষিত নেই।' : 'No resources bookmarked yet.'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* 1. PDF Viewer Modal */}
      {selectedPdfForPreview && (
        <PdfViewerModal
          resource={selectedPdfForPreview}
          onClose={() => setSelectedPdfForPreview(null)}
          onDownloadIncrement={handleDownloadIncrement}
          isBookmarked={bookmarks.includes(selectedPdfForPreview.id)}
          onToggleBookmark={handleToggleBookmark}
          allResources={resources}
          onSelectRelated={(r) => handlePreviewResource(r)}
          lang={lang}
        />
      )}

      {/* 2. Content Writer / Editor Modal (Keywords, Thumbnails & Distinct Slug URL) */}
      <ContentEditorModal
        isOpen={isContentEditorOpen}
        onClose={() => setIsContentEditorOpen(false)}
        onArticleSaved={(savedArticle) => {
          loadAllData();
          handleOpenArticle(savedArticle);
        }}
        existingArticle={editingArticleForEditor}
        lang={lang}
      />

      {/* 3. Admin Panel Modal (PIN Protected, secret) */}
      {isAdminOpen && (
        <AdminPanel
          resources={resources}
          articles={articles}
          settings={settings}
          onRefreshData={loadAllData}
          onClose={() => setIsAdminOpen(false)}
          lang={lang}
          onHideAdmin={handleHideAdmin}
          onAuthChange={(auth) => setIsAdminAuthenticated(auth)}
          onPreviewResource={handlePreviewResource}
        />
      )}

      {/* 4. WordPress Architecture Blueprint Modal */}
      {isBlueprintOpen && (
        <WordPressArchitectureModal
          onClose={() => setIsBlueprintOpen(false)}
          lang={lang}
        />
      )}

      {/* 5. Islamic & Bengali Calendar Utility Modal */}
      {isCalendarModalOpen && (
        <IslamicCalendarModal
          onClose={() => setIsCalendarModalOpen(false)}
          lang={lang}
        />
      )}

      {/* 6. Bangladesh District-wise Hanafi Prayer Times Modal */}
      {isPrayerModalOpen && (
        <PrayerTimesModal
          onClose={() => setIsPrayerModalOpen(false)}
          lang={lang}
        />
      )}

      {/* Footer */}
      <Footer
        setActiveTab={handleSelectTabWithFilter}
        openBlueprintModal={() => setIsBlueprintOpen(true)}
        settings={settings}
        lang={lang}
        onSecretAdminTrigger={handleSecretAdminTrigger}
      />
    </div>
  );
}
