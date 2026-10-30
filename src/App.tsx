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
import { HeroSection } from './components/HeroSection';
import { FeaturedCategories } from './components/FeaturedCategories';
import { DiplomaExamSection } from './components/DiplomaExamSection';
import { ResourceFilters } from './components/ResourceFilters';
import { PdfCard } from './components/PdfCard';
import { PdfViewerModal } from './components/PdfViewerModal';
import { ArticlesSection } from './components/ArticlesSection';
import { ArticleModal } from './components/ArticleModal';
import { AdminPanel } from './components/AdminPanel';
import { WordPressArchitectureModal } from './components/WordPressArchitectureModal';
import { InformationalPages } from './components/InformationalPages';
import { AdPlacement } from './components/AdPlacement';
import { Footer } from './components/Footer';
import { IslamicDateBar } from './components/IslamicDateBar';
import { IslamicCalendarModal } from './components/IslamicCalendarModal';
import { PrayerTimesModal } from './components/PrayerTimesModal';

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
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isBookmarksDrawerOpen, setIsBookmarksDrawerOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);

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

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setResources(StorageService.getResources());
    setArticles(StorageService.getArticles());
    setSettings(StorageService.getSettings());
    setBookmarks(StorageService.getBookmarks());
  };

  const handleDownloadIncrement = (id: string) => {
    StorageService.incrementDownload(id);
    loadAllData();
  };

  const handleToggleBookmark = (id: string) => {
    StorageService.toggleBookmark(id);
    setBookmarks(StorageService.getBookmarks());
  };

  // Scroll helper
  const scrollToLibrary = () => {
    if (activeTab !== 'home') {
      setActiveTab('pdf-library');
    }
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

  // Handle Tab changes that map to courses
  const handleSelectTabWithFilter = (tab: ActiveTab) => {
    setActiveTab(tab);
    handleResetFilters();

    if (tab === 'diploma') {
      setSelectedCourse('DIB-1');
    } else if (tab === 'banking') {
      setSelectedCourse('Islamic-Banking');
    } else if (tab === 'islamic-studies') {
      setSelectedCourse('Islamic-Studies');
    } else if (tab === 'quran-hadith') {
      setSelectedCourse('Quran-Hadith');
    } else if (tab === 'fiqh-fatwa') {
      setSelectedCourse('Fiqh-Fatwa');
    }
  };

  // Filtering Resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // 1. Text Search across Title, Description, Subject, Tags & Key Topics
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = res.title.toLowerCase().includes(q) || res.titleBn.toLowerCase().includes(q);
        const matchesSubject = res.subject.toLowerCase().includes(q) || res.subjectBn.toLowerCase().includes(q);
        const matchesDesc = res.description.toLowerCase().includes(q) || res.descriptionBn.toLowerCase().includes(q);
        const matchesYear = res.examYear.includes(q);
        const matchesTags = res.tags.some(t => t.toLowerCase().includes(q));
        const matchesTopics = (res.keyTopics || []).some(t => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesSubject && !matchesDesc && !matchesYear && !matchesTags && !matchesTopics) {
          return false;
        }
      }

      // 2. Course
      if (selectedCourse !== 'ALL' && res.course !== selectedCourse) {
        return false;
      }

      // 3. Subject
      if (selectedSubject !== 'ALL' && res.subject !== selectedSubject) {
        return false;
      }

      // 4. Exam Year
      if (selectedYear !== 'ALL' && res.examYear !== selectedYear) {
        return false;
      }

      // 5. Session
      if (selectedSession !== 'ALL' && res.examSession !== selectedSession) {
        return false;
      }

      // 6. Category
      if (selectedCategory !== 'ALL' && res.category !== selectedCategory) {
        return false;
      }

      // 7. Language
      if (selectedLanguage !== 'ALL') {
        if (selectedLanguage === 'bilingual' && res.language !== 'bilingual') return false;
        if (selectedLanguage === 'bn' && res.language === 'en') return false;
        if (selectedLanguage === 'en' && res.language === 'bn') return false;
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

  // Bookmarked Resources
  const bookmarkedResources = useMemo(() => {
    return resources.filter(r => bookmarks.includes(r.id));
  }, [resources, bookmarks]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTabWithFilter}
        lang={lang}
        setLang={setLang}
        openAdminModal={() => setIsAdminOpen(true)}
        openBlueprintModal={() => setIsBlueprintOpen(true)}
        openCalendarModal={() => setIsCalendarModalOpen(true)}
        openPrayerModal={() => setIsPrayerModalOpen(true)}
        bookmarkedCount={bookmarks.length}
        openBookmarks={() => setIsBookmarksDrawerOpen(true)}
        siteName={settings.siteName}
        siteNameBn={settings.siteNameBn}
        isAdminVisible={isAdminVisible}
        onHideAdmin={handleHideAdmin}
      />

      {/* Islamic & Bengali Date Bar (Cultural & Banking Utility) */}
      <IslamicDateBar
        onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
        onOpenPrayerTimesModal={() => setIsPrayerModalOpen(true)}
        lang={lang}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* HOMEPAGE VIEW */}
        {activeTab === 'home' && (
          <>
            {/* Hero Section with prominent search */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              onExploreClick={scrollToLibrary}
              totalResourcesCount={resources.length}
              totalArticlesCount={articles.length}
              lang={lang}
            />

            {/* Ad Placement: Safe Header Leaderboard */}
            {settings.enableAdPlacements && (
              <AdPlacement slotType="header-banner" lang={lang} />
            )}

            {/* Featured Categories Division */}
            <FeaturedCategories
              categories={categoriesList}
              onSelectCategory={(courseType) => {
                if (courseType) setSelectedCourse(courseType);
                scrollToLibrary();
              }}
              lang={lang}
            />

            {/* Dedicated DIB Exam Papers organized by year */}
            <DiplomaExamSection
              resources={resources}
              onPreview={(res) => setSelectedPdfForPreview(res)}
              onDownloadIncrement={handleDownloadIncrement}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              lang={lang}
            />

            {/* Bilingual Banking Articles Section */}
            <ArticlesSection
              articles={articles}
              resources={resources}
              onOpenArticle={(art) => setSelectedArticleForRead(art)}
              lang={lang}
            />

            {/* Complete Interactive PDF Library Section */}
            <div ref={librarySectionRef} className="py-12 sm:py-16 bg-stone-50 border-t border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                  <div>
                    <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
                      {lang === 'bn' ? 'সম্পূর্ণ আর্কাইভ অনুসন্ধান' : 'Master PDF Archive'}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                      {lang === 'bn' ? 'সকল শিক্ষামূলক পিডিএফ ও স্টাডি ডকুমেন্টস' : 'All Islamic Banking & DIB PDF Resources'}
                    </h2>
                  </div>
                  <div className="text-xs text-stone-500 font-medium">
                    {lang === 'bn'
                      ? `মোট ${filteredResources.length} টি রিসোর্স প্রদর্শিত`
                      : `Displaying ${filteredResources.length} educational documents`}
                  </div>
                </div>

                {/* Resource Multi-filter Component */}
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

                {/* Resource Cards Grid */}
                {filteredResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((res) => (
                      <PdfCard
                        key={res.id}
                        resource={res}
                        onPreview={(item) => setSelectedPdfForPreview(item)}
                        onDownloadIncrement={handleDownloadIncrement}
                        isBookmarked={bookmarks.includes(res.id)}
                        onToggleBookmark={handleToggleBookmark}
                        lang={lang}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
                    <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-stone-900 mb-1">
                      {lang === 'bn' ? 'কোনো রিসোর্স পাওয়া যায়নি' : 'No Matching Resources Found'}
                    </h3>
                    <p className="text-xs text-stone-500 mb-4 leading-relaxed font-bengali">
                      {lang === 'bn'
                        ? 'আপনার দেওয়া সার্চ কি-ওয়ার্ড বা ফিল্টারের সাথে কোনো নথি মেলেনি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।'
                        : 'No PDF documents match your search criteria. Try clearing some filters or searching with a different term.'}
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'সকল ফিল্টার রিসেট করুন' : 'Reset All Filters'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Ad Placement: Bottom Wide */}
            {settings.enableAdPlacements && (
              <AdPlacement slotType="bottom-wide" lang={lang} />
            )}
          </>
        )}

        {/* PDF LIBRARY / SPECIFIC CATEGORY TAB VIEWS */}
        {(activeTab === 'diploma' || 
          activeTab === 'banking' || 
          activeTab === 'previous-questions' || 
          activeTab === 'islamic-studies' || 
          activeTab === 'quran-hadith' || 
          activeTab === 'fiqh-fatwa' || 
          activeTab === 'pdf-library') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
                    onPreview={(item) => setSelectedPdfForPreview(item)}
                    onDownloadIncrement={handleDownloadIncrement}
                    isBookmarked={bookmarks.includes(res.id)}
                    onToggleBookmark={handleToggleBookmark}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
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
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
                >
                  {lang === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ARTICLES STANDALONE VIEW */}
        {activeTab === 'articles' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ArticlesSection
              articles={articles}
              resources={resources}
              onOpenArticle={(art) => setSelectedArticleForRead(art)}
              lang={lang}
            />
          </div>
        )}

        {/* INFORMATIONAL & LEGAL PAGES */}
        {(activeTab === 'about' || activeTab === 'contact' || activeTab === 'privacy' || activeTab === 'disclaimer') && (
          <InformationalPages
            page={activeTab}
            settings={settings}
            lang={lang}
          />
        )}
      </main>

      {/* Bookmarks Drawer Modal */}
      {isBookmarksDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-end">
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
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookmarkedResources.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-y-auto">
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
                          setSelectedPdfForPreview(res);
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
              <div className="text-center py-12 text-stone-400 text-xs">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
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
          onSelectRelated={(r) => setSelectedPdfForPreview(r)}
          lang={lang}
        />
      )}

      {/* 2. Article Reader Modal */}
      {selectedArticleForRead && (
        <ArticleModal
          article={selectedArticleForRead}
          onClose={() => setSelectedArticleForRead(null)}
          allResources={resources}
          onOpenResource={(r) => setSelectedPdfForPreview(r)}
          initialLang={lang}
        />
      )}

      {/* 3. Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanel
          resources={resources}
          articles={articles}
          settings={settings}
          onRefreshData={loadAllData}
          onClose={() => setIsAdminOpen(false)}
          lang={lang}
          onHideAdmin={handleHideAdmin}
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
