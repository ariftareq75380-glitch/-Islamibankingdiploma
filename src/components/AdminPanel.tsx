import React, { useState, useEffect, useRef } from 'react';
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
  LogOut,
  Search,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  Quote,
  Minus,
  Smartphone
} from 'lucide-react';
import { PdfResource, Article, CourseType, ExamSession, ResourceCategory, SiteSettings } from '../types';
import { StorageService } from '../services/storage';
import { formatFileSize, isValidUrl } from '../utils/pdfUtils';
import { subjectsList, examYearsList } from '../data/mockData';
import { AdminSeoAuditTab } from './AdminSeoAuditTab';
import contentData from '../data/content.json';
import { supabase } from '../utils/supabase';
import type { Session } from '@supabase/supabase-js';

interface AdminPanelProps {
  resources: PdfResource[];
  articles: Article[];
  settings: SiteSettings;
  onRefreshData: () => void;
  onClose: () => void;
  lang: 'bn' | 'en';
  onHideAdmin?: () => void;
  onAuthChange?: (isAuth: boolean) => void;
  onPreviewResource?: (res: PdfResource) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  resources,
  articles,
  settings,
  onRefreshData,
  onClose,
  lang,
  onHideAdmin,
  onAuthChange,
  onPreviewResource
}) => {
  // Supabase Auth Session State
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Monitor Supabase Auth state
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (mounted) {
        setSession(currentSession);
        setIsCheckingSession(false);
        onAuthChange?.(Boolean(currentSession));
      }
    }).catch(() => {
      if (mounted) {
        setIsCheckingSession(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
        onAuthChange?.(Boolean(currentSession));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [onAuthChange]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErrorMsg(null);
    setIsLoggingIn(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput
      });

      // Clear password from state immediately (do not store password anywhere)
      setPasswordInput('');

      if (error) {
        let msg = 'ইমেইল বা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।';
        const raw = error.message.toLowerCase();
        if (raw.includes('invalid login credentials') || raw.includes('invalid credentials')) {
          msg = 'ভুল ইমেইল বা পাসওয়ার্ড! সঠিক তথ্য প্রদান করুন।';
        } else if (raw.includes('email not confirmed')) {
          msg = 'আপনার ইমেইলটি এখনও নিশ্চিত (confirm) করা হয়নি।';
        } else {
          msg = `লগইন ত্রুটি: ${error.message}`;
        }
        setAuthErrorMsg(msg);
        return;
      }

      if (data.session) {
        setSession(data.session);
        onAuthChange?.(true);
      }
    } catch (err: any) {
      setPasswordInput('');
      setAuthErrorMsg(`লগইন করতে সমস্যা হয়েছে: ${err?.message || 'নেটওয়ার্ক ত্রুটি'}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    onAuthChange?.(false);
  };

  // Supabase import states & handler
  const [isSupabaseConfirmOpen, setIsSupabaseConfirmOpen] = useState(false);
  const [isSupabaseImporting, setIsSupabaseImporting] = useState(false);
  const [supabaseResultMsg, setSupabaseResultMsg] = useState<string | null>(null);
  const [supabaseIsError, setSupabaseIsError] = useState(false);

  const handleSupabaseImport = async () => {
    setIsSupabaseConfirmOpen(false);
    setIsSupabaseImporting(true);
    setSupabaseResultMsg(null);
    setSupabaseIsError(false);

    try {
      // Ensure active session exists so auth.uid() matches admin
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      if (!activeSession) {
        setSupabaseResultMsg('ত্রুটি: কোনো সক্রিয় লগইন সেশন পাওয়া যায়নি। অনুগ্রহ করে লগইন করুন।');
        setSupabaseIsError(true);
        setIsSupabaseImporting(false);
        return;
      }
      const importedArticles = (contentData as any)?.articles;
      const importedResources = (contentData as any)?.resources;

      // Validation: verify that articles count is exactly 7 and resources count is exactly 10
      if (
        !Array.isArray(importedArticles) ||
        importedArticles.length !== 7 ||
        !Array.isArray(importedResources) ||
        importedResources.length !== 10
      ) {
        const errorMsg = `ত্রুটি: আর্টিকেলের সংখ্যা ৭ (পাওয়া গেছে ${Array.isArray(importedArticles) ? importedArticles.length : 0}) বা পিডিএফের সংখ্যা ১০ (পাওয়া গেছে ${Array.isArray(importedResources) ? importedResources.length : 0}) নয়। অপারেশন বন্ধ করা হয়েছে।`;
        setSupabaseResultMsg(errorMsg);
        setSupabaseIsError(true);
        setIsSupabaseImporting(false);
        return;
      }

      // Task 1: Slug fix in memory only (do not modify content.json)
      // Change the slug of the article whose id is "art-1793470369985" from "bfiu-circuler-26" to "bfiu-circular-26-summary".
      // Keep the slug of "art-bfiu-26" as "bfiu-circuler-26".
      const processedArticles = importedArticles.map((art: any) => {
        if (art.id === 'art-1793470369985') {
          return {
            ...art,
            slug: 'bfiu-circular-26-summary'
          };
        }
        return art;
      });

      let errorDetail = '';
      let writtenArticles = 0;
      let writtenResources = 0;

      // Write each article to the Supabase table "articles" with columns id (text) and data (the full article object as jsonb), using upsert by id. Set updated_at to now.
      const nowIso = new Date().toISOString();
      const articleRows = processedArticles.map((art: any) => ({
        id: art.id,
        data: art,
        updated_at: nowIso
      }));

      const { error: artError } = await supabase
        .from('articles')
        .upsert(articleRows, { onConflict: 'id' });

      if (artError) {
        errorDetail += `Articles: ${artError.message}`;
      } else {
        writtenArticles = processedArticles.length;
      }

      // Write each resource to the Supabase table "resources" the same way.
      const resourceRows = importedResources.map((res: any) => ({
        id: res.id,
        data: res,
        updated_at: nowIso
      }));

      const { error: resError } = await supabase
        .from('resources')
        .upsert(resourceRows, { onConflict: 'id' });

      if (resError) {
        errorDetail += (errorDetail ? '; ' : '') + `Resources: ${resError.message}`;
      } else {
        writtenResources = importedResources.length;
      }

      const summaryText = `আর্টিকেল: ${writtenArticles} টি, PDF: ${writtenResources} টি লেখা হয়েছে${errorDetail ? ` (ত্রুটি: ${errorDetail})` : ''}`;
      setSupabaseResultMsg(summaryText);
      setSupabaseIsError(Boolean(artError || resError));
    } catch (err: any) {
      const summaryText = `আর্টিকেল: 0 টি, PDF: 0 টি লেখা হয়েছে (ত্রুটি: ${err?.message || 'অজানা ত্রুটি'})`;
      setSupabaseResultMsg(summaryText);
      setSupabaseIsError(true);
    } finally {
      setIsSupabaseImporting(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'resources' | 'new-resource' | 'seo-audit' | 'articles' | 'new-article' | 'settings' | 'backup'>('resources');

  // Search & Filter state for Admin resources archive
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceFilterCourse, setResourceFilterCourse] = useState('ALL');
  const [resourceFilterStatus, setResourceFilterStatus] = useState<'ALL' | 'published' | 'draft'>('ALL');
  const [resourceFilterYear, setResourceFilterYear] = useState('ALL');

  // Search & Filter state for Admin articles archive
  const [articleSearch, setArticleSearch] = useState('');
  const [articleFilterStatus, setArticleFilterStatus] = useState<'ALL' | 'published' | 'draft'>('ALL');

  // File upload state & feedback
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>('');

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
  const [resStatus, setResStatus] = useState<'published' | 'draft'>('published');
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
  const [artKeywords, setArtKeywords] = useState('মুদারাবা সংজ্ঞা, রব্বুল মাল, DIB Part 1, ইসলামিক ব্যাংকিং');
  const [artSlug, setArtSlug] = useState('');
  const [artCoverImage, setArtCoverImage] = useState('/images/banner_bangladesh_banking_1793322325377.webp');
  const [artStatus, setArtStatus] = useState<'published' | 'draft'>('published');

  const artContentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const artImageInputRef = useRef<HTMLInputElement>(null);

  // Phone storage / device upload for article thumbnail
  const handleArtImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormErrorMessage(lang === 'bn' ? 'অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।' : 'Please choose an image file.');
      return;
    }
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 4.5) {
      setFormErrorMessage(lang === 'bn' ? 'ছবির সাইজ অনেক বড়। সর্বোচ্চ ৪.৫ মেগাবাইট ফাইল আপলোড করতে পারবেন।' : 'Image size exceeds 4.5MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setArtCoverImage(reader.result);
        setFormSuccessMessage(lang === 'bn' ? 'ফোন স্টোরেজ থেকে থাম্বনেল যুক্ত হয়েছে!' : 'Device thumbnail attached successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Text formatting tool for Admin Article Content
  const applyArtFormat = (formatType: 'bold' | 'italic' | 'underline' | 'h2' | 'h3' | 'quote' | 'bullet' | 'link' | 'divider') => {
    const textarea = artContentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = artContentBn;
    const selectedText = currentVal.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (formatType) {
      case 'bold':
        replacement = `**${selectedText || 'বোল্ড লেখা'}**`;
        cursorOffset = selectedText ? replacement.length : 2;
        break;
      case 'italic':
        replacement = `*${selectedText || 'ইটালিক লেখা'}*`;
        cursorOffset = selectedText ? replacement.length : 1;
        break;
      case 'underline':
        replacement = `<u>${selectedText || 'আন্ডারলাইন করা লেখা'}</u>`;
        cursorOffset = selectedText ? replacement.length : 3;
        break;
      case 'h2':
        replacement = `\n## ${selectedText || 'নতুন পরিচ্ছেদ শিরোনাম'}\n`;
        cursorOffset = replacement.length;
        break;
      case 'h3':
        replacement = `\n### ${selectedText || 'উপ-শিরোনাম'}\n`;
        cursorOffset = replacement.length;
        break;
      case 'quote':
        replacement = `\n> ${selectedText || 'আরবি বা নির্ভরযোগ্য উদ্ধৃতি'}\n`;
        cursorOffset = replacement.length;
        break;
      case 'bullet':
        replacement = `\n- ${selectedText || 'পয়েন্ট ১'}\n- পয়েন্ট ২\n`;
        cursorOffset = replacement.length;
        break;
      case 'link':
        replacement = `[${selectedText || 'লিংকের শিরোনাম'}](https://)`;
        cursorOffset = replacement.length - 1;
        break;
      case 'divider':
        replacement = `\n\n---\n\n`;
        cursorOffset = replacement.length;
        break;
    }

    const updatedText = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    setArtContentBn(updatedText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 50);
  };

  // Backup state
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  // Handle File Upload from disk with validation & progress
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFormErrorMessage(
        lang === 'bn' 
          ? 'অনুগ্রহ করে শুধুমাত্র বৈধ পিডিএফ (.pdf) ফাইল আপলোড করুন।' 
          : 'Please upload a valid PDF (.pdf) file only.'
      );
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 4.5) {
      setFormErrorMessage(
        lang === 'bn'
          ? `সতর্কতা: ফাইল সাইজ (${formatFileSize(file.size)}) ব্রাউজারের সরাসরি স্টোরেজ সীমা (৪.৫ MB)-এর বেশি। ডাটাবেজে স্থায়ী সুরক্ষার জন্য গুগল ড্রাইভ শেয়ারেবল ব্যাকআপ লিঙ্ক (Option B) যুক্ত করুন।`
          : `Notice: File size (${formatFileSize(file.size)}) exceeds browser direct storage limits (4.5 MB). For persistent access across devices, please provide a Google Drive share link (Option B).`
      );
    } else {
      setFormErrorMessage(null);
    }

    setUploadFileName(file.name);
    setResFileSize(formatFileSize(file.size));
    setUploadProgress(20);

    const reader = new FileReader();
    reader.onprogress = (evt) => {
      if (evt.lengthComputable) {
        setUploadProgress(Math.round((evt.loaded / evt.total) * 90));
      }
    };
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setResFileUrl(reader.result);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(null), 1200);
      }
    };
    reader.onerror = () => {
      setFormErrorMessage(
        lang === 'bn' ? 'ফাইল পড়তে ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।' : 'Error reading file. Please try again.'
      );
      setUploadProgress(null);
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
    setResStatus(res.status || (res.isDraft ? 'draft' : 'published'));
    setUploadFileName(res.pdfFileUrl ? `${res.title.substring(0, 25)}.pdf` : '');
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
          keyTopics: topicsArray,
          status: resStatus,
          isDraft: resStatus === 'draft'
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
        keyTopics: topicsArray,
        status: resStatus,
        isDraft: resStatus === 'draft'
      });
    }

    onRefreshData();
    setFormSuccessMessage(
      lang === 'bn' 
        ? (resStatus === 'published' ? 'রিসোর্সটি সফলভাবে লাইভ সাইটে প্রকাশিত হয়েছে!' : 'রিসোর্সটি ড্রাফট হিসেবে সংরক্ষিত হয়েছে!') 
        : (resStatus === 'published' ? 'Resource published successfully to the public library!' : 'Resource saved as draft!')
    );
    setTimeout(() => {
      setFormSuccessMessage(null);
      resetResourceForm();
      setActiveTab('resources');
    }, 1200);
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
    setResStatus('published');
    setUploadProgress(null);
    setUploadFileName('');
  };

  const handleDeleteResource = (id: string) => {
    if (confirm(lang === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই রিসোর্সটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this resource?')) {
      StorageService.deleteResource(id);
      onRefreshData();
    }
  };

  const handleToggleResourceStatus = (res: PdfResource) => {
    const newStatus: 'published' | 'draft' = (res.status === 'draft' || res.isDraft) ? 'published' : 'draft';
    StorageService.updateResource({
      ...res,
      status: newStatus,
      isDraft: newStatus === 'draft'
    });
    onRefreshData();
  };

  // Article Actions
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artContentBn) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে আর্টিকেল শিরোনাম ও মূল বক্তব্য বাংলায় পূরণ করুন।' : 'Please fill out article title and content.');
      return;
    }

    const tagsArray = artTags.split(',').map(s => s.trim()).filter(Boolean);
    const keywordsArray = artKeywords.split(',').map(s => s.trim()).filter(Boolean);
    const cleanSlug = (artSlug || artTitle.toLowerCase())
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'article-note';

    if (editingArticleId) {
      const existing = articles.find(a => a.id === editingArticleId);
      if (existing) {
        StorageService.updateArticle({
          ...existing,
          title: artTitle,
          titleBn: artTitleBn || artTitle,
          slug: cleanSlug,
          author: artAuthor,
          authorDesignation: artAuthorDesignation,
          category: artCategory,
          categoryBn: artCategoryBn,
          summary: artSummary,
          summaryBn: artSummaryBn,
          contentMarkdownEn: artContentEn || artSummary,
          contentMarkdownBn: artContentBn || artSummaryBn,
          tags: tagsArray,
          keywords: keywordsArray,
          coverImage: artCoverImage,
          status: artStatus,
          isDraft: artStatus === 'draft'
        });
      }
    } else {
      StorageService.addArticle({
        title: artTitle,
        titleBn: artTitleBn || artTitle,
        slug: cleanSlug,
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
        keywords: keywordsArray,
        coverImage: artCoverImage,
        featured: false,
        status: artStatus,
        isDraft: artStatus === 'draft'
      });
    }

    onRefreshData();
    setFormSuccessMessage(lang === 'bn' ? 'আর্টিকেল সফলভাবে সংরক্ষিত হয়েছে!' : 'Article saved successfully!');
    setEditingArticleId(null);
    setActiveTab('articles');
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm(lang === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই আর্টিকেলটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this article?')) {
      StorageService.deleteArticle(id);
      onRefreshData();
    }
  };

  const handleToggleArticleStatus = (art: Article) => {
    const newStatus: 'published' | 'draft' = (art.status === 'draft' || art.isDraft) ? 'published' : 'draft';
    StorageService.updateArticle({
      ...art,
      status: newStatus,
      isDraft: newStatus === 'draft'
    });
    onRefreshData();
  };

  // Filtered resources for Admin view
  const adminFilteredResources = resources.filter(res => {
    if (resourceSearch.trim()) {
      const q = resourceSearch.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q) || res.titleBn.toLowerCase().includes(q);
      const matchSubject = res.subject.toLowerCase().includes(q) || res.subjectBn.toLowerCase().includes(q);
      const matchYear = res.examYear.includes(q);
      const matchTags = res.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSubject && !matchYear && !matchTags) return false;
    }
    if (resourceFilterCourse !== 'ALL' && res.course !== resourceFilterCourse) {
      return false;
    }
    if (resourceFilterYear !== 'ALL' && res.examYear !== resourceFilterYear) {
      return false;
    }
    if (resourceFilterStatus !== 'ALL') {
      const isDraft = res.status === 'draft' || res.isDraft;
      if (resourceFilterStatus === 'draft' && !isDraft) return false;
      if (resourceFilterStatus === 'published' && isDraft) return false;
    }
    return true;
  });

  // Filtered articles for Admin view
  const adminFilteredArticles = articles.filter(art => {
    if (articleSearch.trim()) {
      const q = articleSearch.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(q) || art.titleBn.toLowerCase().includes(q);
      const matchAuthor = art.author.toLowerCase().includes(q);
      const matchCat = art.category.toLowerCase().includes(q) || art.categoryBn.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchCat) return false;
    }
    if (articleFilterStatus !== 'ALL') {
      const isDraft = art.status === 'draft' || art.isDraft;
      if (articleFilterStatus === 'draft' && !isDraft) return false;
      if (articleFilterStatus === 'published' && isDraft) return false;
    }
    return true;
  });

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

  if (isCheckingSession) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 flex flex-col items-center justify-center shadow-2xl border border-stone-200 text-center animate-in fade-in duration-200 font-bengali">
          <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-stone-700">অ্যাডমিন সেশন যাচাই করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-bengali">
        <div 
          className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 flex flex-col shadow-2xl border border-stone-200 text-center relative animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-stone-900 mb-1">
            অ্যাডমিন লগইন
          </h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            সাইট পরিচালনা ও ডেটা নিয়ন্ত্রণের জন্য আপনার অনুমোদিত ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left" autoComplete="off">
            {authErrorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{authErrorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                ইমেইল
              </label>
              <input
                type="email"
                required
                autoFocus
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (authErrorMsg) setAuthErrorMsg(null);
                }}
                placeholder="admin@example.com"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authErrorMsg) setAuthErrorMsg(null);
                  }}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 pr-10 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>{isLoggingIn ? 'যাচাই করা হচ্ছে...' : 'লগইন'}</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>সুরক্ষিত অ্যাডমিনিস্ট্রেটর পোর্টাল</span>
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
            {session?.user?.email && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-stone-800 rounded-lg text-xs text-emerald-400 font-mono border border-stone-700/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{session.user.email}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsSupabaseConfirmOpen(true)}
              disabled={isSupabaseImporting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition-colors text-xs font-semibold cursor-pointer border border-emerald-600 shadow-xs disabled:opacity-50"
              title="src/data/content.json থেকে Supabase-এ ডেটা তুলুন"
            >
              <Database className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isSupabaseImporting ? 'আপলোড হচ্ছে...' : 'Supabase-এ ডেটা তুলুন'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-red-900/60 text-stone-200 hover:text-red-200 rounded-lg transition-colors text-xs font-semibold cursor-pointer border border-stone-700/60"
              title="সেশন থেকে লগআউট করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="বন্ধ করুন"
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
          {/* Supabase Action Result Message */}
          {supabaseResultMsg && (
            <div
              className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 ${
                supabaseIsError
                  ? 'bg-red-50 text-red-900 border border-red-200'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {supabaseIsError ? (
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                )}
                <span>{supabaseResultMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setSupabaseResultMsg(null)}
                className="p-1 hover:bg-black/5 rounded text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Supabase Confirmation Dialog */}
          {isSupabaseConfirmOpen && (
            <div className="fixed inset-0 z-[60] bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 font-bengali space-y-4">
                <div className="flex items-center gap-3 text-amber-800">
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-stone-900">Supabase ডেটা মাইগ্রেশন</h4>
                    <p className="text-xs text-stone-500 font-sans">Database Import Confirmation</p>
                  </div>
                </div>

                <p className="text-stone-800 text-sm leading-relaxed bg-amber-50/70 p-4 rounded-xl border border-amber-200 font-medium">
                  এটি Supabase-এর ডেটা প্রতিস্থাপন করবে। নিশ্চিত হলে 'হ্যাঁ' চাপুন।
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSupabaseConfirmOpen(false)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    onClick={handleSupabaseImport}
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    হ্যাঁ
                  </button>
                </div>
              </div>
            </div>
          )}
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

              {/* Admin Search & Filter Toolbar */}
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl flex flex-wrap items-center gap-2 text-xs">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    placeholder={lang === 'bn' ? 'পিডিএফ শিরোনাম, বিষয় বা সাল দিয়ে খুঁজুন...' : 'Search by title, subject or year...'}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  {resourceSearch && (
                    <button
                      onClick={() => setResourceSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <select
                    value={resourceFilterCourse}
                    onChange={(e) => setResourceFilterCourse(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-700 text-xs"
                  >
                    <option value="ALL">{lang === 'bn' ? 'সকল কোর্স (All)' : 'All Courses'}</option>
                    <option value="DIB-1">DIB Part-1</option>
                    <option value="DIB-2">DIB Part-2</option>
                    <option value="DIB-General">DIB General</option>
                    <option value="Islamic-Banking">Islamic Banking</option>
                  </select>

                  <select
                    value={resourceFilterStatus}
                    onChange={(e) => setResourceFilterStatus(e.target.value as 'ALL' | 'published' | 'draft')}
                    className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-700 text-xs"
                  >
                    <option value="ALL">{lang === 'bn' ? 'সকল স্ট্যাটাস' : 'All Status'}</option>
                    <option value="published">{lang === 'bn' ? 'প্রকাশিত (Published)' : 'Published'}</option>
                    <option value="draft">{lang === 'bn' ? 'ড্রাফট (Draft)' : 'Draft'}</option>
                  </select>

                  <select
                    value={resourceFilterYear}
                    onChange={(e) => setResourceFilterYear(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-700 text-xs"
                  >
                    <option value="ALL">{lang === 'bn' ? 'সকল সাল' : 'All Years'}</option>
                    {examYearsList.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>

                  {(resourceSearch || resourceFilterCourse !== 'ALL' || resourceFilterStatus !== 'ALL' || resourceFilterYear !== 'ALL') && (
                    <button
                      onClick={() => {
                        setResourceSearch('');
                        setResourceFilterCourse('ALL');
                        setResourceFilterStatus('ALL');
                        setResourceFilterYear('ALL');
                      }}
                      className="px-2.5 py-1.5 text-stone-500 hover:text-stone-900 underline text-xs cursor-pointer"
                    >
                      {lang === 'bn' ? 'রিসেট' : 'Reset'}
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="p-3">Title / শিরোনাম</th>
                        <th className="p-3">Course / সাল</th>
                        <th className="p-3">স্ট্যাটাস</th>
                        <th className="p-3">Download Source</th>
                        <th className="p-3">File Size</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {adminFilteredResources.length > 0 ? (
                        adminFilteredResources.map((res) => {
                          const hasDirect = Boolean(res.pdfFileUrl);
                          const hasDrive = Boolean(res.googleDriveUrl);
                          const isBroken = !hasDirect && !hasDrive;
                          const isDraft = res.status === 'draft' || res.isDraft;

                          return (
                            <tr key={res.id} className="hover:bg-stone-50 transition-colors">
                              <td className="p-3 font-medium text-stone-900 max-w-xs truncate">
                                <div className="font-semibold">{res.titleBn || res.title}</div>
                                <div className="text-[11px] text-stone-400 truncate">{res.title}</div>
                              </td>
                              <td className="p-3 text-stone-600 whitespace-nowrap">
                                <span className="font-semibold text-emerald-800">{res.course}</span> · {res.examYear}
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleToggleResourceStatus(res)}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                                    isDraft
                                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  }`}
                                  title={lang === 'bn' ? 'ক্লিক করে স্ট্যাটাস পরিবর্তন করুন' : 'Click to toggle status'}
                                >
                                  {isDraft ? (
                                    <>
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                      {lang === 'bn' ? 'ড্রাফট' : 'Draft'}
                                    </>
                                  ) : (
                                    <>
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                      {lang === 'bn' ? 'প্রকাশিত' : 'Published'}
                                    </>
                                  )}
                                </button>
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
                              <td className="p-3 text-right space-x-1 whitespace-nowrap">
                                {onPreviewResource && (
                                  <button
                                    onClick={() => onPreviewResource(res)}
                                    className="p-1.5 text-stone-600 hover:text-emerald-800 rounded hover:bg-stone-100 transition-colors"
                                    title={lang === 'bn' ? 'পিডিএফ প্রিভিউ দেখুন' : 'Preview PDF'}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
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
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-stone-500">
                            {lang === 'bn' ? 'কোনো রিসোর্স খুঁজে পাওয়া যায়নি।' : 'No resources match your search or filters.'}
                          </td>
                        </tr>
                      )}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Category / রিসোর্স ধরন *</label>
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value as ResourceCategory)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  >
                    <option value="Solved-Answer">{lang === 'bn' ? 'সমাধানকৃত প্রশ্নপত্র (Solved-Answer)' : 'Solved Questions & Answers'}</option>
                    <option value="Question-Paper">{lang === 'bn' ? 'মূল প্রশ্নপত্র (Question Paper)' : 'Official Exam Question'}</option>
                    <option value="Hand-Note">{lang === 'bn' ? 'হ্যান্ডনোট / স্টাডি নোট (Hand-Note)' : 'Study Guide / Notes'}</option>
                    <option value="Syllabus">{lang === 'bn' ? 'সিলেবাস ও আউটলাইন (Syllabus)' : 'Official Syllabus'}</option>
                    <option value="Reference-Book">{lang === 'bn' ? 'রেফারেন্স বই (Reference Book)' : 'Reference Book'}</option>
                    <option value="Guideline">{lang === 'bn' ? 'পরীক্ষা প্রস্তুতি গাইড (Guideline)' : 'Preparation Guideline'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">ভাষা (Language) *</label>
                  <select
                    value={resLanguage}
                    onChange={(e) => setResLanguage(e.target.value as 'bn' | 'en' | 'bilingual')}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  >
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="en">ইংরেজি (English)</option>
                    <option value="bilingual">দ্বিভাষিক (Bilingual)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">পাবলিকেশন স্ট্যাটাস *</label>
                  <div className="flex items-center gap-3 p-2 bg-stone-50 border border-stone-200 rounded-lg h-[38px]">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="resStatusOption"
                        checked={resStatus === 'published'}
                        onChange={() => setResStatus('published')}
                        className="text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                      />
                      <span className="font-semibold text-emerald-800 text-xs">প্রকাশিত (Live)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="resStatusOption"
                        checked={resStatus === 'draft'}
                        onChange={() => setResStatus('draft')}
                        className="text-amber-700 focus:ring-amber-700 cursor-pointer"
                      />
                      <span className="font-semibold text-amber-800 text-xs">ড্রাফট (Draft)</span>
                    </label>
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
                        className="text-xs text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-emerald-800 file:text-white cursor-pointer"
                      />
                      {uploadProgress !== null && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-[11px] text-stone-500">
                            <span>আপলোড হচ্ছে...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-600 h-full transition-all duration-200" 
                              style={{ width: `${uploadProgress}%` }} 
                            />
                          </div>
                        </div>
                      )}
                      {resFileUrl && (
                        <div className="text-[11px] text-emerald-700 font-semibold mt-1.5 flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>ফাইল প্রস্তুত ({resFileSize})</span>
                          {uploadFileName && <span className="text-stone-400 font-normal">· {uploadFileName}</span>}
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
                        গুগল ড্রাইভ বা ওয়ানড্রাইভের শেয়ারেবল পাবলিক লিংক (বড় ফাইলের জন্য বিশেষভাবে সুপারিশকৃত)।
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
                  <h3 className="text-base font-bold text-stone-900">
                    {lang === 'bn' ? 'ইসলামিক ব্যাংকিং আর্টিকেল ও গবেষণাপত্র' : 'Islamic Banking Articles & Columns'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {lang === 'bn'
                      ? 'ডিপ্লোমা শিক্ষার্থী ও ব্যাংক কর্মকর্তাদের জন্য প্রকাশিত গবেষণামূলক নিবন্ধ পরিচালনা করুন।'
                      : 'Manage bilingual articles published for Bangladeshi students and bankers.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingArticleId(null);
                    setArtTitle('');
                    setArtTitleBn('');
                    setArtContentBn('');
                    setArtContentEn('');
                    setArtStatus('published');
                    setActiveTab('new-article');
                  }}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'নতুন আর্টিকেল লিখুন' : 'Write Article'}</span>
                </button>
              </div>

              {/* Articles Search & Filter Toolbar */}
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl flex flex-wrap items-center gap-2 text-xs">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    placeholder={lang === 'bn' ? 'শিরোনাম, লেখক বা কি-ওয়ার্ড দিয়ে খুঁজুন...' : 'Search by title, author, or keyword...'}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  {articleSearch && (
                    <button
                      onClick={() => setArticleSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={articleFilterStatus}
                    onChange={(e) => setArticleFilterStatus(e.target.value as 'ALL' | 'published' | 'draft')}
                    className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-700 text-xs"
                  >
                    <option value="ALL">{lang === 'bn' ? 'সকল স্ট্যাটাস' : 'All Status'}</option>
                    <option value="published">{lang === 'bn' ? 'প্রকাশিত (Published)' : 'Published'}</option>
                    <option value="draft">{lang === 'bn' ? 'ড্রাফট (Draft)' : 'Draft'}</option>
                  </select>

                  {(articleSearch || articleFilterStatus !== 'ALL') && (
                    <button
                      onClick={() => {
                        setArticleSearch('');
                        setArticleFilterStatus('ALL');
                      }}
                      className="px-2.5 py-1.5 text-stone-500 hover:text-stone-900 underline text-xs cursor-pointer"
                    >
                      {lang === 'bn' ? 'রিসেট' : 'Reset'}
                    </button>
                  )}
                </div>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Title / শিরোনাম</th>
                      <th className="p-3">Author / লেখক</th>
                      <th className="p-3">স্ট্যাটাস</th>
                      <th className="p-3">Published Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {adminFilteredArticles.length > 0 ? (
                      adminFilteredArticles.map((art) => {
                        const isDraft = art.status === 'draft' || art.isDraft;

                        return (
                          <tr key={art.id} className="hover:bg-stone-50 transition-colors">
                            <td className="p-3 font-medium text-stone-900 max-w-sm truncate">
                              <div className="font-semibold">{art.titleBn}</div>
                              <div className="text-[11px] text-stone-400 truncate">/{art.slug}</div>
                            </td>
                            <td className="p-3 text-stone-600 whitespace-nowrap">{art.author}</td>
                            <td className="p-3 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleToggleArticleStatus(art)}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                                  isDraft
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                }`}
                                title={lang === 'bn' ? 'ক্লিক করে স্ট্যাটাস পরিবর্তন করুন' : 'Click to toggle status'}
                              >
                                {isDraft ? (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    {lang === 'bn' ? 'ড্রাফট' : 'Draft'}
                                  </>
                                ) : (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                    {lang === 'bn' ? 'প্রকাশিত' : 'Published'}
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="p-3 text-stone-500 whitespace-nowrap">{art.publishedDate}</td>
                            <td className="p-3 text-right space-x-1 whitespace-nowrap">
                              <a
                                href={`/diploma/${art.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block p-1.5 text-stone-600 hover:text-emerald-800 rounded hover:bg-stone-100"
                                title="View Public Article"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => {
                                  setEditingArticleId(art.id);
                                  setArtTitle(art.title);
                                  setArtTitleBn(art.titleBn);
                                  setArtSlug(art.slug || '');
                                  setArtAuthor(art.author);
                                  setArtAuthorDesignation(art.authorDesignation || '');
                                  setArtSummary(art.summary);
                                  setArtSummaryBn(art.summaryBn);
                                  setArtContentEn(art.contentMarkdownEn);
                                  setArtContentBn(art.contentMarkdownBn);
                                  setArtTags((art.tags || []).join(', '));
                                  setArtKeywords((art.keywords || art.tags || []).join(', '));
                                  setArtCoverImage(art.coverImage || '/src/assets/images/banner_bangladesh_banking_1793322325377.jpg');
                                  setArtStatus(art.status || (art.isDraft ? 'draft' : 'published'));
                                  setActiveTab('new-article');
                                }}
                                className="p-1.5 text-stone-600 hover:text-emerald-800 rounded hover:bg-stone-100"
                                title="Edit Article"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.id)}
                                className="p-1.5 text-stone-600 hover:text-red-700 rounded hover:bg-red-50"
                                title="Delete Article"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-stone-500">
                          {lang === 'bn' ? 'কোনো আর্টিকেল পাওয়া যায়নি।' : 'No articles match your search or filter.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WRITE / EDIT ARTICLE */}
          {activeTab === 'new-article' && (
            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h3 className="text-base font-bold text-stone-900">
                  {editingArticleId ? 'Edit Banking Article' : 'Compose New Bilingual Banking Article'}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-stone-600 font-medium">স্ট্যাটাস:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="artStatusRadio"
                      checked={artStatus === 'published'}
                      onChange={() => setArtStatus('published')}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span className="font-semibold text-emerald-800">প্রকাশিত</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="artStatusRadio"
                      checked={artStatus === 'draft'}
                      onChange={() => setArtStatus('draft')}
                      className="text-amber-700 focus:ring-amber-700"
                    />
                    <span className="font-semibold text-amber-800">ড্রাফট</span>
                  </label>
                </div>
              </div>

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

              {/* Distinct URL Slug & Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-stone-700">Permanent URL Slug *</label>
                    <span className="text-[10px] text-emerald-800 font-medium">/{artSlug || 'mudaraba-definition'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-stone-200 text-stone-600 px-2 py-2 rounded-l-lg border border-r-0 border-stone-300 font-mono text-[11px]">
                      /diploma/
                    </span>
                    <input
                      type="text"
                      value={artSlug}
                      onChange={(e) => setArtSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      placeholder="mudaraba-definition"
                      className="w-full p-2 bg-white border border-stone-300 rounded-r-lg text-stone-900 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    এসইও কি-ওয়ার্ড (Keywords - Comma separated)
                  </label>
                  <input
                    type="text"
                    value={artKeywords}
                    onChange={(e) => setArtKeywords(e.target.value)}
                    placeholder="মুদারাবা সংজ্ঞা, রব্বুল মাল, DIB Part 1, AAOIFI"
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs"
                  />
                </div>
              </div>

              {/* Thumbnail / Cover Image with Phone Storage Upload */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-stone-700">
                    কন্টেন্ট থাম্বনেল / কভার ছবি (Thumbnail)
                  </label>
                  <span className="text-[11px] text-stone-500">ফোন বা কম্পিউটার স্টোরেজ থেকে আপলোড সমর্থিত</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={artImageInputRef}
                    accept="image/*"
                    onChange={handleArtImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => artImageInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-all"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>ফোন স্টোরেজ থেকে ছবি আপলোড</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setArtCoverImage('/images/banner_bangladesh_banking_1793322325377.webp')}
                    className="px-2.5 py-1.5 bg-white border border-stone-300 hover:border-emerald-600 rounded-lg text-stone-700 text-xs"
                  >
                    ব্যাংকিং ব্যানার
                  </button>
                  <button
                    type="button"
                    onClick={() => setArtCoverImage('/images/category_diploma_banking_1793322326189.webp')}
                    className="px-2.5 py-1.5 bg-white border border-stone-300 hover:border-emerald-600 rounded-lg text-stone-700 text-xs"
                  >
                    ডিআইবি পাঠাগার
                  </button>
                  <button
                    type="button"
                    onClick={() => setArtCoverImage('/images/category_quran_hadith_1793322326327.webp')}
                    className="px-2.5 py-1.5 bg-white border border-stone-300 hover:border-emerald-600 rounded-lg text-stone-700 text-xs"
                  >
                    কুরআন ও হাদিস
                  </button>
                </div>

                {artCoverImage && (
                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-stone-200">
                    <img
                      src={artCoverImage}
                      alt="Thumbnail Preview"
                      className="w-20 h-14 object-cover rounded border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-emerald-800">থাম্বনেল যুক্ত করা হয়েছে</div>
                      <div className="text-[10px] text-stone-500 font-mono truncate">{artCoverImage.startsWith('data:') ? 'ডিভাইস ফাইল (Base64)' : artCoverImage}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setArtCoverImage('')}
                      className="text-stone-400 hover:text-red-600 p-1"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
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

              {/* Full Article Content with Text Formatting Toolbar */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="font-semibold text-stone-700">পূর্ণাঙ্গ মূল আর্টিকেল (বাংলায়) *</label>
                  
                  {/* Formatting Toolbar */}
                  <div className="flex items-center flex-wrap gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
                    <button
                      type="button"
                      onClick={() => applyArtFormat('bold')}
                      className="p-1.5 bg-white hover:bg-emerald-50 text-stone-800 rounded border border-stone-200 font-bold"
                      title="বোল্ড (**লেখা**)"
                    >
                      <Bold className="w-3 h-3 text-stone-900" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyArtFormat('italic')}
                      className="p-1.5 bg-white hover:bg-emerald-50 text-stone-800 rounded border border-stone-200 italic"
                      title="ইটালিক (*লেখা*)"
                    >
                      <Italic className="w-3 h-3 text-stone-900" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyArtFormat('underline')}
                      className="p-1.5 bg-white hover:bg-emerald-50 text-stone-800 rounded border border-stone-200 underline"
                      title="আন্ডারলাইন (<u>লেখা</u>)"
                    >
                      <UnderlineIcon className="w-3 h-3 text-stone-900" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyArtFormat('h2')}
                      className="px-1.5 py-1 bg-white hover:bg-stone-200 text-stone-800 rounded border border-stone-200 font-bold text-[10px]"
                      title="বড় শিরোনাম (H2)"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => applyArtFormat('h3')}
                      className="px-1.5 py-1 bg-white hover:bg-stone-200 text-stone-800 rounded border border-stone-200 font-bold text-[10px]"
                      title="উপ-শিরোনাম (H3)"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => applyArtFormat('bullet')}
                      className="p-1.5 bg-white hover:bg-stone-200 text-stone-800 rounded border border-stone-200"
                      title="বুলেট পয়েন্ট (- )"
                    >
                      <List className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyArtFormat('quote')}
                      className="p-1.5 bg-white hover:bg-stone-200 text-stone-800 rounded border border-stone-200"
                      title="উদ্ধৃতি (> )"
                    >
                      <Quote className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyArtFormat('link')}
                      className="p-1.5 bg-white hover:bg-stone-200 text-stone-800 rounded border border-stone-200"
                      title="লিংক ([নাম](url))"
                    >
                      <LinkIcon className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyArtFormat('divider')}
                      className="p-1.5 bg-white hover:bg-stone-200 text-stone-800 rounded border border-stone-200"
                      title="ডিভাইডার (---)"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <textarea
                  ref={artContentTextareaRef}
                  rows={10}
                  required
                  value={artContentBn}
                  onChange={(e) => setArtContentBn(e.target.value)}
                  placeholder="## প্রথম পরিচ্ছেদ&#10;বিস্তারিত প্রবন্ধের বিষয়বস্তু বাংলায় লিখুন..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-bengali font-mono text-xs leading-relaxed focus:ring-1 focus:ring-emerald-700"
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

                <div className="p-5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-800" />
                    <div className="font-bold text-stone-900 text-sm">
                      {lang === 'bn' ? 'Supabase ক্লাউড ডাটাবেজ আপলোড (One-Time Import)' : 'Supabase Cloud Database Upsert'}
                    </div>
                  </div>
                  <p className="text-stone-600">
                    {lang === 'bn' 
                      ? 'src/data/content.json থেকে ৭টি আর্টিকেল এবং ১০টি পিডিএফ রিসোর্স Supabase ডাটাবেজের articles ও resources টেবিলে আপসার্ট করুন।'
                      : 'Upsert 7 articles and 10 PDF resources from src/data/content.json directly into Supabase articles and resources tables.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSupabaseConfirmOpen(true)}
                    disabled={isSupabaseImporting}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs text-xs"
                  >
                    <Database className="w-4 h-4" />
                    <span>{isSupabaseImporting ? 'আপলোড হচ্ছে...' : 'Supabase-এ ডেটা তুলুন'}</span>
                  </button>
                </div>
              </div>

              {/* Supabase Admin Account Info */}
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  <div className="font-bold text-stone-900 text-sm">
                    {lang === 'bn' ? 'সক্রিয় অ্যাডমিন অ্যাকাউন্ট' : 'Active Admin Account'}
                  </div>
                </div>
                <div className="text-stone-600 space-y-1">
                  <p>
                    <span className="font-semibold text-stone-700">{lang === 'bn' ? 'ইমেইল: ' : 'Email: '}</span>
                    <span className="font-mono text-emerald-800 font-medium">{session?.user?.email || 'N/A'}</span>
                  </p>
                  <p className="text-[11px] text-stone-500">
                    <span className="font-semibold">{lang === 'bn' ? 'ইউজার আইডি: ' : 'User ID: '}</span>
                    <span className="font-mono">{session?.user?.id || 'N/A'}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 bg-stone-800 hover:bg-red-900 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
                </button>
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
