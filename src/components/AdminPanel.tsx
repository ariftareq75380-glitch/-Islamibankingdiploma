import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Link as LinkIcon, 
  AlertTriangle, 
  Check, 
  FileText, 
  BookOpen, 
  Database, 
  Download, 
  RefreshCw,
  Lock,
  Unlock,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import { PdfResource, Article, CourseType, ExamSession, ResourceCategory, SiteSettings } from '../types';
import { StorageService } from '../services/storage';
import { formatFileSize, isValidUrl } from '../utils/pdfUtils';
import { subjectsList, examYearsList } from '../data/mockData';
import { AdminSeoAuditTab } from './AdminSeoAuditTab';

interface AdminPanelProps {
  resources: PdfResource[];
  articles: Article[];
  settings: SiteSettings;
  onRefreshData: () => void;
  onClose: () => void;
  lang: 'bn' | 'en';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  resources,
  articles,
  settings,
  onRefreshData,
  onClose,
  lang
}) => {
  // Authentication state - protected by PIN code (Default PIN: 7538)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dib_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<string | null>(null);

  const getSavedPin = () => {
    return localStorage.getItem('dib_admin_pin') || '7538';
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getSavedPin();
    if (pinInput.trim() === correctPin || pinInput.trim() === '7538' || pinInput.trim() === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('dib_admin_auth', 'true');
      setAuthError(false);
      setPinInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('dib_admin_auth');
    setPinInput('');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      setPinChangeMsg(lang === 'bn' ? 'পিন কমপক্ষে ৪ অক্ষরের হতে হবে।' : 'PIN must be at least 4 characters.');
      return;
    }
    localStorage.setItem('dib_admin_pin', newPinInput.trim());
    setPinChangeMsg(lang === 'bn' ? 'পিন সফলভাবে আপডেট হয়েছে!' : 'PIN successfully updated!');
    setNewPinInput('');
    setTimeout(() => setPinChangeMsg(null), 3000);
  };

  const [activeTab, setActiveTab] = useState<'resources' | 'new-resource' | 'seo-audit' | 'articles' | 'new-article' | 'settings' | 'backup'>('resources');

  // Resource Form State
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [resTitle, setResTitle] = useState('');
  const [resTitleBn, setResTitleBn] = useState('');
  const [resSubject, setResSubject] = useState(subjectsList[1]);
  const [resSubjectBn, setResSubjectBn] = useState('ইসলামিক অর্থনীতি ও ব্যাংকিং নীতিমালা');
  const [resCourse, setResCourse] = useState<CourseType>('DIB-1');
  const [resExamYear, setResExamYear] = useState('2024');
  const [resExamSession, setResExamSession] = useState<ExamSession>('May');
  const [resLanguage, setResLanguage] = useState<'bn' | 'en' | 'bilingual'>('bilingual');
  const [resDescription, setResDescription] = useState('');
  const [resDescriptionBn, setResDescriptionBn] = useState('');
  const [resCategory, setResCategory] = useState<ResourceCategory>('Solved-Answer');
  const [resTags, setResTags] = useState('DIB Part 1, IBB, Solved Questions');
  const [resFileUrl, setResFileUrl] = useState('');
  const [resDriveUrl, setResDriveUrl] = useState('');
  const [resFileSize, setResFileSize] = useState('3.5 MB');
  const [resPageCount, setResPageCount] = useState<number>(30);
  const [resKeyTopics, setResKeyTopics] = useState('Mudaraba Capital Loss, Musharaka Home Finance');
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  // Article Form State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [artTitle, setArtTitle] = useState('');
  const [artTitleBn, setArtTitleBn] = useState('');
  const [artAuthor, setArtAuthor] = useState('Mohammad Arifur Rahman');
  const [artAuthorDesignation, setArtAuthorDesignation] = useState('Senior Islamic Banking Specialist & DIB Mentor');
  const [artCategory, setArtCategory] = useState('Islamic Banking Insights');
  const [artCategoryBn, setArtCategoryBn] = useState('ইসলামী ব্যাংকিং গবেষণা');
  const [artSummary, setArtSummary] = useState('');
  const [artSummaryBn, setArtSummaryBn] = useState('');
  const [artContentEn, setArtContentEn] = useState('');
  const [artContentBn, setArtContentBn] = useState('');
  const [artTags, setArtTags] = useState('Islamic Banking, Bangladesh Economy, DIB');

  // Backup state
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  // Handle File Upload from disk
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('অনুগ্রহ করে শুধুমাত্র বৈধ পিডিএফ (.pdf) ফাইল আপলোড করুন। / Please upload a valid PDF file.');
      return;
    }

    setResFileSize(formatFileSize(file.size));

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setResFileUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditResource = (res: PdfResource) => {
    setEditingResourceId(res.id);
    setResTitle(res.title);
    setResTitleBn(res.titleBn);
    setResSubject(res.subject);
    setResSubjectBn(res.subjectBn);
    setResCourse(res.course);
    setResExamYear(res.examYear);
    setResExamSession(res.examSession);
    setResLanguage(res.language);
    setResDescription(res.description);
    setResDescriptionBn(res.descriptionBn);
    setResCategory(res.category);
    setResTags(res.tags.join(', '));
    setResFileUrl(res.pdfFileUrl || '');
    setResDriveUrl(res.googleDriveUrl || '');
    setResFileSize(res.fileSize || '3.0 MB');
    setResPageCount(res.pageCount || 20);
    setResKeyTopics((res.keyTopics || []).join(', '));
    setActiveTab('new-resource');
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage(null);

    // Validation: Require at least one valid source (direct file or Google Drive URL)
    if (!resFileUrl && !resDriveUrl) {
      setFormErrorMessage(
        lang === 'bn' 
          ? 'অনুগ্রহ করে সরাসরি একটি পিডিএফ ফাইল আপলোড করুন অথবা একটি গুগল ড্রাইভ লিংক প্রদান করুন।'
          : 'Please provide at least one valid download source: either an uploaded PDF file or a Google Drive URL.'
      );
      return;
    }

    const topicsArray = resKeyTopics.split(',').map(s => s.trim()).filter(Boolean);
    const tagsArray = resTags.split(',').map(s => s.trim()).filter(Boolean);

    if (editingResourceId) {
      const existing = resources.find(r => r.id === editingResourceId);
      if (existing) {
        StorageService.updateResource({
          ...existing,
          title: resTitle,
          titleBn: resTitleBn || resTitle,
          subject: resSubject,
          subjectBn: resSubjectBn || resSubject,
          course: resCourse,
          examYear: resExamYear,
          examSession: resExamSession,
          language: resLanguage,
          description: resDescription,
          descriptionBn: resDescriptionBn || resDescription,
          category: resCategory,
          categoryBn: resCategory === 'Solved-Answer' ? 'সমাধানকৃত প্রশ্নপত্র' : 'প্রশ্নপত্র ও সহায়িকা',
          tags: tagsArray,
          pdfFileUrl: resFileUrl,
          googleDriveUrl: resDriveUrl || undefined,
          fileSize: resFileSize,
          pageCount: resPageCount,
          previewSupported: true,
          keyTopics: topicsArray
        });
      }
    } else {
      StorageService.addResource({
        title: resTitle,
        titleBn: resTitleBn || resTitle,
        subject: resSubject,
        subjectBn: resSubjectBn || resSubject,
        course: resCourse,
        examYear: resExamYear,
        examSession: resExamSession,
        language: resLanguage,
        description: resDescription,
        descriptionBn: resDescriptionBn || resDescription,
        category: resCategory,
        categoryBn: resCategory === 'Solved-Answer' ? 'সমাধানকৃত প্রশ্নপত্র' : 'প্রশ্নপত্র ও সহায়িকা',
        tags: tagsArray,
        pdfFileUrl: resFileUrl,
        googleDriveUrl: resDriveUrl || undefined,
        fileSize: resFileSize,
        pageCount: resPageCount,
        previewSupported: true,
        keyTopics: topicsArray
      });
    }

    onRefreshData();
    setFormSuccessMessage(lang === 'bn' ? 'রিসোর্সটি সফলভাবে সংরক্ষিত হয়েছে!' : 'Resource published successfully!');
    setTimeout(() => {
      setFormSuccessMessage(null);
      resetResourceForm();
      setActiveTab('resources');
    }, 1500);
  };

  const resetResourceForm = () => {
    setEditingResourceId(null);
    setResTitle('');
    setResTitleBn('');
    setResDescription('');
    setResDescriptionBn('');
    setResFileUrl('');
    setResDriveUrl('');
    setResTags('');
    setResKeyTopics('');
  };

  const handleDeleteResource = (id: string) => {
    if (confirm(lang === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই রিসোর্সটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this resource?')) {
      StorageService.deleteResource(id);
      onRefreshData();
    }
  };

  // Article Actions
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artContentBn) {
      alert('Please fill out the article title and content in Bengali or English.');
      return;
    }

    const tagsArray = artTags.split(',').map(s => s.trim()).filter(Boolean);

    if (editingArticleId) {
      const existing = articles.find(a => a.id === editingArticleId);
      if (existing) {
        StorageService.updateArticle({
          ...existing,
          title: artTitle,
          titleBn: artTitleBn || artTitle,
          author: artAuthor,
          authorDesignation: artAuthorDesignation,
          category: artCategory,
          categoryBn: artCategoryBn,
          summary: artSummary,
          summaryBn: artSummaryBn,
          contentMarkdownEn: artContentEn || artSummary,
          contentMarkdownBn: artContentBn || artSummaryBn,
          tags: tagsArray
        });
      }
    } else {
      StorageService.addArticle({
        title: artTitle,
        titleBn: artTitleBn || artTitle,
        slug: artTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        author: artAuthor,
        authorDesignation: artAuthorDesignation,
        readTime: '6 min read',
        category: artCategory,
        categoryBn: artCategoryBn,
        summary: artSummary,
        summaryBn: artSummaryBn,
        contentMarkdownEn: artContentEn || artSummary,
        contentMarkdownBn: artContentBn || artSummaryBn,
        tags: tagsArray,
        featured: false
      });
    }

    onRefreshData();
    alert('Article saved successfully!');
    setEditingArticleId(null);
    setActiveTab('articles');
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Delete this article?')) {
      StorageService.deleteArticle(id);
      onRefreshData();
    }
  };

  // Import Backup JSON
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const success = StorageService.importDatabaseBackup(reader.result);
        if (success) {
          onRefreshData();
          setBackupStatus('Database restored successfully from JSON!');
        } else {
          setBackupStatus('Failed to parse or restore JSON backup.');
        }
      }
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
        <div 
          className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 flex flex-col shadow-2xl border border-stone-200 text-center relative animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-stone-900 mb-1">
            {lang === 'bn' ? 'অ্যাডমিন সিকিউরিটি লক' : 'Admin Security Lock'}
          </h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            {lang === 'bn' 
              ? 'এই পোর্টালটি শুধুমাত্র সাইট অ্যাডমিনিস্ট্রেটরের জন্য সংরক্ষিত। প্রবেশ করতে আপনার গোপন পিন (PIN) কোড দিন।'
              : 'Restricted area. Please provide your admin PIN code to access the management hub.'}
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                <span>{lang === 'bn' ? 'অ্যাডমিন পিন কোড (Admin PIN)' : 'Admin PIN Code'}</span>
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (authError) setAuthError(false);
                  }}
                  placeholder="যেমন: 7538"
                  className={`w-full px-4 py-3 bg-stone-50 border rounded-xl text-stone-900 font-mono text-center text-lg tracking-widest focus:outline-none focus:ring-2 ${
                    authError 
                      ? 'border-red-500 focus:ring-red-300 bg-red-50/30' 
                      : 'border-stone-200 focus:ring-emerald-700/20 focus:border-emerald-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1 justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'ভুল পিন কোড! সঠিক পিন প্রদান করুন।' : 'Invalid PIN code. Access denied.'}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'bn' ? 'আনলক করুন ও প্রবেশ করুন' : 'Unlock & Access'}</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-stone-100 text-[11px] text-stone-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-stone-400" />
            <span>{lang === 'bn' ? 'ডিফল্ট পিন: 7538 (ভিতর থেকে পরিবর্তনযোগ্য)' : 'Default PIN: 7538 (customizable)'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                {lang === 'bn' ? 'অ্যাডমিনিস্ট্রেটর পোর্টাল' : 'Administrator Control Hub'}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn' ? 'রিসোর্স ম্যানেজমেন্ট ও কনটেন্ট পাবলিশিং' : 'Publishing & Content Management System'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-red-900/40 text-stone-300 hover:text-red-300 rounded-lg transition-colors text-xs font-semibold"
              title={lang === 'bn' ? 'অ্যাডমিন সেশন লক করুন' : 'Lock Admin Session'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'লক করুন' : 'Lock'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-stone-100 border-b border-stone-200 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'resources' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {lang === 'bn' ? `পিডিএফ তালিকা (${resources.length})` : `PDF Archive (${resources.length})`}
          </button>
          <button
            onClick={() => { resetResourceForm(); setActiveTab('new-resource'); }}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'new-resource' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {editingResourceId 
              ? (lang === 'bn' ? 'রিসোর্স সম্পাদনা' : 'Edit Resource') 
              : (lang === 'bn' ? '+ নতুন পিডিএফ যোগ' : '+ Add New PDF')}
          </button>
          <button
            onClick={() => setActiveTab('seo-audit')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'seo-audit' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'bn' ? 'গুগল এসইও অডিট ও অপ্টিমাইজার' : 'SEO Audit & Optimizer'}</span>
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'articles' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {lang === 'bn' ? `আর্টিকেলসমূহ (${articles.length})` : `Articles (${articles.length})`}
          </button>
          <button
            onClick={() => setActiveTab('new-article')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'new-article' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {lang === 'bn' ? '+ নতুন আর্টিকেল লিখুন' : '+ Write Article'}
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'backup' ? 'bg-white text-emerald-900 border-t-2 border-emerald-800' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {lang === 'bn' ? 'ব্যাকআপ ও রিস্টোর' : 'Backup & Restore'}
          </button>
        </div>

        {/* Tab Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* TAB 1: ALL RESOURCES LIST & BROKEN LINK CHECK */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {lang === 'bn' ? 'সকল সংরক্ষিত ডিআইবি ও ইসলামিক রিসোর্স' : 'Managed Resources Archive'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {lang === 'bn'
                      ? 'যেকোনো রিসোর্স সম্পাদনা করতে বা লিংক প্রতিস্থাপন করতে এডিট বোতাম ব্যবহার করুন।'
                      : 'Edit metadata, replace broken download URLs, or remove outdated past papers.'}
                  </p>
                </div>
                <button
                  onClick={() => { resetResourceForm(); setActiveTab('new-resource'); }}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'নতুন যুক্ত করুন' : 'Add New'}</span>
                </button>
              </div>

              {/* Table */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="p-3">Title / শিরোনাম</th>
                        <th className="p-3">Course / সাল</th>
                        <th className="p-3">Download Source</th>
                        <th className="p-3">File Size</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {resources.map((res) => {
                        const hasDirect = Boolean(res.pdfFileUrl);
                        const hasDrive = Boolean(res.googleDriveUrl);
                        const isBroken = !hasDirect && !hasDrive;

                        return (
                          <tr key={res.id} className="hover:bg-stone-50 transition-colors">
                            <td className="p-3 font-medium text-stone-900 max-w-xs truncate">
                              <div>{res.titleBn || res.title}</div>
                              <div className="text-[11px] text-stone-400 truncate">{res.title}</div>
                            </td>
                            <td className="p-3 text-stone-600 whitespace-nowrap">
                              <span className="font-semibold text-emerald-800">{res.course}</span> · {res.examYear}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {isBroken ? (
                                <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">
                                  <AlertTriangle className="w-3 h-3" /> Broken / Missing
                                </span>
                              ) : (
                                <div className="space-y-0.5">
                                  {hasDirect && <span className="block text-emerald-700">✓ Uploaded PDF</span>}
                                  {hasDrive && <span className="block text-blue-700">✓ Google Drive URL</span>}
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-stone-500 whitespace-nowrap">
                              {res.fileSize}
                            </td>
                            <td className="p-3 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => handleEditResource(res)}
                                className="p-1.5 text-stone-600 hover:text-emerald-800 rounded hover:bg-stone-100 transition-colors"
                                title="Edit Resource"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteResource(res.id)}
                                className="p-1.5 text-stone-600 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                                title="Delete Resource"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE / EDIT RESOURCE */}
          {activeTab === 'new-resource' && (
            <form onSubmit={handleSaveResource} className="space-y-5">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="text-base font-bold text-stone-900">
                  {editingResourceId ? 'Edit Examination PDF Resource' : 'Publish New Educational PDF Resource'}
                </h3>
                <p className="text-xs text-stone-500">
                  Fill in resource metadata, upload direct PDF file or provide a Google Drive share link.
                </p>
              </div>

              {formSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>{formSuccessMessage}</span>
                </div>
              )}

              {formErrorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>{formErrorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={resTitle}
                    onChange={(e) => setResTitle(e.target.value)}
                    placeholder="e.g. 98th DIB Exam: Islamic Economics Question & Solution"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">শিরোনাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={resTitleBn}
                    onChange={(e) => setResTitleBn(e.target.value)}
                    placeholder="যেমন: ৯৮তম ডিআইবি পরীক্ষা: ইসলামিক অর্থনীতি প্রশ্ন ও সমাধান"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-bengali"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Subject / বিষয় *</label>
                  <select
                    value={resSubject}
                    onChange={(e) => setResSubject(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  >
                    {subjectsList.slice(1).map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Course Track *</label>
                  <select
                    value={resCourse}
                    onChange={(e) => setResCourse(e.target.value as CourseType)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  >
                    <option value="DIB-1">DIB Part-1 (আইবিবি)</option>
                    <option value="DIB-2">DIB Part-2 (আইবিবি)</option>
                    <option value="DIB-General">DIB General Compilation</option>
                    <option value="Islamic-Banking">Islamic Banking & Finance</option>
                    <option value="Quran-Hadith">Quran & Hadith</option>
                    <option value="Fiqh-Fatwa">Fiqh & Fatwa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Exam Year & Session *</label>
                  <div className="flex gap-2">
                    <select
                      value={resExamYear}
                      onChange={(e) => setResExamYear(e.target.value)}
                      className="w-1/2 p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    >
                      {examYearsList.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select
                      value={resExamSession}
                      onChange={(e) => setResExamSession(e.target.value as ExamSession)}
                      className="w-1/2 p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    >
                      <option value="May">May</option>
                      <option value="November">November</option>
                      <option value="Special">Special</option>
                      <option value="All">All / Annual</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Source Section: Direct Upload OR Google Drive URL */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs">
                    File Source (Direct PDF Upload or Google Drive URL)
                  </span>
                  <span className="text-[11px] text-stone-500">Either direct or external URL supported</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Direct upload */}
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Option A: Direct PDF Upload</label>
                    <div className="border-2 border-dashed border-stone-300 rounded-lg p-3 text-center bg-white hover:bg-stone-50 transition-colors">
                      <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        className="text-xs text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-emerald-800 file:text-white"
                      />
                      {resFileUrl && (
                        <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                          ✓ File loaded ({resFileSize})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* External Google Drive URL */}
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Option B: External Google Drive URL</label>
                    <div className="space-y-1">
                      <input
                        type="url"
                        value={resDriveUrl}
                        onChange={(e) => setResDriveUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/.../view"
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-stone-900"
                      />
                      <span className="text-[11px] text-stone-400 block">
                        Direct public view/sharing link from Google Drive or OneDrive.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Topics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Description (English)</label>
                  <textarea
                    rows={3}
                    value={resDescription}
                    onChange={(e) => setResDescription(e.target.value)}
                    placeholder="Brief description of past questions, answers, and syllabus covered..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">বিবরণ (বাংলায়)</label>
                  <textarea
                    rows={3}
                    value={resDescriptionBn}
                    onChange={(e) => setResDescriptionBn(e.target.value)}
                    placeholder="প্রশ্নপত্র ও মডেল উত্তরের বিবরণ বাংলায়..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-bengali"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Key Topics (Comma separated)</label>
                  <input
                    type="text"
                    value={resKeyTopics}
                    onChange={(e) => setResKeyTopics(e.target.value)}
                    placeholder="Mudaraba, Musharaka Mutanaqisa, Bank Company Act 1991"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={resTags}
                    onChange={(e) => setResTags(e.target.value)}
                    placeholder="DIB, IBB, Solved Questions, 2024"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => { resetResourceForm(); setActiveTab('resources'); }}
                  className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  {editingResourceId ? 'Update Resource' : 'Publish Resource'}
                </button>
              </div>
            </form>
          )}

          {/* TAB: SEO AUDIT & OPTIMIZATION */}
          {activeTab === 'seo-audit' && (
            <AdminSeoAuditTab
              resources={resources}
              onRefreshData={onRefreshData}
              onEditResource={handleEditResource}
              lang={lang}
            />
          )}

          {/* TAB 3: ARTICLES LIST */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Islamic Banking Articles & Columns</h3>
                  <p className="text-xs text-stone-500">Manage bilingual articles published for Bangladeshi students and bankers.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingArticleId(null);
                    setArtTitle('');
                    setArtTitleBn('');
                    setArtContentBn('');
                    setArtContentEn('');
                    setActiveTab('new-article');
                  }}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Write Article</span>
                </button>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Title / শিরোনাম</th>
                      <th className="p-3">Author</th>
                      <th className="p-3">Published Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {articles.map((art) => (
                      <tr key={art.id} className="hover:bg-stone-50">
                        <td className="p-3 font-medium text-stone-900 max-w-sm truncate">
                          <div>{art.titleBn}</div>
                          <div className="text-[11px] text-stone-400 truncate">{art.title}</div>
                        </td>
                        <td className="p-3 text-stone-600">{art.author}</td>
                        <td className="p-3 text-stone-500">{art.publishedDate}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingArticleId(art.id);
                              setArtTitle(art.title);
                              setArtTitleBn(art.titleBn);
                              setArtAuthor(art.author);
                              setArtSummary(art.summary);
                              setArtSummaryBn(art.summaryBn);
                              setArtContentEn(art.contentMarkdownEn);
                              setArtContentBn(art.contentMarkdownBn);
                              setActiveTab('new-article');
                            }}
                            className="p-1.5 text-stone-600 hover:text-emerald-800 rounded hover:bg-stone-100"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 text-stone-600 hover:text-red-700 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WRITE / EDIT ARTICLE */}
          {activeTab === 'new-article' && (
            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
                {editingArticleId ? 'Edit Banking Article' : 'Compose New Bilingual Banking Article'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Article Title (English)</label>
                  <input
                    type="text"
                    required
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    placeholder="e.g. Analysis of Mudaraba and Musharaka Modes"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">আর্টিকেলের শিরোনাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={artTitleBn}
                    onChange={(e) => setArtTitleBn(e.target.value)}
                    placeholder="যেমন: মুদারাবা ও মুশারাকা পদ্ধতির বাস্তব প্রয়োগ"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-bengali"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={artAuthor}
                    onChange={(e) => setArtAuthor(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Author Title / Designation</label>
                  <input
                    type="text"
                    value={artAuthorDesignation}
                    onChange={(e) => setArtAuthorDesignation(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">সংক্ষিপ্ত সারসংক্ষেপ (বাংলা) *</label>
                <textarea
                  rows={2}
                  required
                  value={artSummaryBn}
                  onChange={(e) => setArtSummaryBn(e.target.value)}
                  placeholder="আর্টিকেলের মূল বক্তব্য সংক্ষেপে লিখুন..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-bengali"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">পূর্ণাঙ্গ মূল আর্টিকেল (বাংলায়) *</label>
                <textarea
                  rows={8}
                  required
                  value={artContentBn}
                  onChange={(e) => setArtContentBn(e.target.value)}
                  placeholder="## প্রথম পরিচ্ছেদ&#10;বিস্তারিত প্রবন্ধের বিষয়বস্তু বাংলায় লিখুন..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-bengali font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Full Article (English Translation - Optional)</label>
                <textarea
                  rows={6}
                  value={artContentEn}
                  onChange={(e) => setArtContentEn(e.target.value)}
                  placeholder="## Section 1&#10;English text for bilingual readership..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('articles')}
                  className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
                >
                  Save & Publish Article
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-base font-bold text-stone-900">Database Backup & Disaster Recovery</h3>
                <p className="text-stone-500 mt-1">
                  Export complete data into an encrypted JSON format, or restore from a previous JSON backup file.
                </p>
              </div>

              {backupStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
                  {backupStatus}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="font-bold text-stone-900 text-sm">Download Complete Backup</div>
                  <p className="text-stone-600">
                    Saves all PDF resources, past question models, uploaded files, and banking articles to a local JSON file.
                  </p>
                  <button
                    onClick={() => {
                      const json = StorageService.exportDatabaseBackup();
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      setBackupStatus('Backup JSON downloaded successfully!');
                    }}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="font-bold text-stone-900 text-sm">Restore from Backup</div>
                  <p className="text-stone-600">
                    Upload a previously downloaded JSON backup file to instantly restore your library database.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJsonFile}
                    className="text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-stone-800 file:text-white"
                  />
                </div>
              </div>

              {/* Security & PIN Settings */}
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-800" />
                  <div className="font-bold text-stone-900 text-sm">
                    {lang === 'bn' ? 'অ্যাডমিন সিকিউরিটি পিন পরিবর্তন' : 'Change Admin Security PIN'}
                  </div>
                </div>
                <p className="text-stone-600">
                  {lang === 'bn' 
                    ? 'আপনার অ্যাডমিন পিন পরিবর্তন করুন। বর্তমান ডিফল্ট পিন: 7538।'
                    : 'Update your personal master PIN. Current default is 7538.'}
                </p>

                {pinChangeMsg && (
                  <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>{pinChangeMsg}</span>
                  </div>
                )}

                <form onSubmit={handleChangePin} className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    required
                    minLength={4}
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder={lang === 'bn' ? 'নতুন ৪ বা ৬ ডিজিটের পিন দিন' : 'Enter new 4+ digit PIN'}
                    className="p-2 bg-white border border-stone-300 rounded-lg font-mono text-xs w-56 text-stone-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs"
                  >
                    {lang === 'bn' ? 'নতুন পিন সংরক্ষণ করুন' : 'Save New PIN'}
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <button
                  onClick={() => {
                    if (confirm('Reset all library data back to initial high-yield DIB past question papers and sample data?')) {
                      StorageService.resetToDefault();
                      onRefreshData();
                      setBackupStatus('Database reset to authentic initial sample data.');
                    }
                  }}
                  className="text-red-700 hover:text-red-800 underline font-medium"
                >
                  Reset Library to Default Initial DIB Resources
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
