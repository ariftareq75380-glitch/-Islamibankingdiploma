import { PdfResource, Article, SiteSettings } from '../types';
import { samplePdfResources, sampleArticles, initialSiteSettings } from '../data/mockData';
import contentData from '../data/content.json';
import { supabase } from '../utils/supabase';

const STORAGE_KEYS = {
  RESOURCES: 'ikl_pdf_resources_v1',
  ARTICLES: 'ikl_articles_v1',
  SETTINGS: 'ikl_site_settings_v1',
  BOOKMARKS: 'ikl_bookmarked_ids_v1'
};

export const StorageService = {
  // --- Task 1 & Task 2: Public Reads from Supabase with content.json Fallback ---

  async getArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('data');

      if (error) {
        console.warn('[Data Source Fallback] Supabase query error reading articles, using fallback content.json:', error.message);
        return this.getFallbackArticles();
      }

      if (!data || data.length === 0) {
        console.warn('[Data Source Fallback] Supabase articles table returned 0 rows, using fallback content.json');
        return this.getFallbackArticles();
      }

      const articles = data.map((row: any) => row.data as Article).filter(Boolean);
      if (articles.length === 0) {
        console.warn('[Data Source Fallback] Mapped articles array from Supabase is empty, using fallback content.json');
        return this.getFallbackArticles();
      }

      // Order by data->>'publishedAt' descending, falling back to data->>'publishedDate'
      articles.sort((a, b) => {
        const dateA = a.publishedAt || a.publishedDate || '';
        const dateB = b.publishedAt || b.publishedDate || '';
        return dateB.localeCompare(dateA);
      });

      console.log(`[Data Source: Supabase] Articles loaded successfully (${articles.length} items)`);
      return articles;
    } catch (err: any) {
      console.warn('[Data Source Fallback] Exception reading articles from Supabase, using fallback content.json:', err?.message);
      return this.getFallbackArticles();
    }
  },

  async getPdfResources(): Promise<PdfResource[]> {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('data');

      if (error) {
        console.warn('[Data Source Fallback] Supabase query error reading resources, using fallback content.json:', error.message);
        return this.getFallbackResources();
      }

      if (!data || data.length === 0) {
        console.warn('[Data Source Fallback] Supabase resources table returned 0 rows, using fallback content.json');
        return this.getFallbackResources();
      }

      const resources = data.map((row: any) => row.data as PdfResource).filter(Boolean);
      if (resources.length === 0) {
        console.warn('[Data Source Fallback] Mapped resources array from Supabase is empty, using fallback content.json');
        return this.getFallbackResources();
      }

      console.log(`[Data Source: Supabase] PDF Resources loaded successfully (${resources.length} items)`);
      return resources;
    } catch (err: any) {
      console.warn('[Data Source Fallback] Exception reading resources from Supabase, using fallback content.json:', err?.message);
      return this.getFallbackResources();
    }
  },

  async getResources(): Promise<PdfResource[]> {
    return this.getPdfResources();
  },

  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('data')
        .maybeSingle();

      if (error || !data || !data.data) {
        if (error) {
          console.warn('[Data Source Fallback] Supabase site_settings query error, using fallback content.json:', error.message);
        } else {
          console.warn('[Data Source Fallback] Supabase site_settings returned 0 rows, using fallback content.json');
        }
        return this.getFallbackSettings();
      }

      console.log('[Data Source: Supabase] Site settings loaded successfully');
      return data.data as SiteSettings;
    } catch (err: any) {
      console.warn('[Data Source Fallback] Exception reading site_settings from Supabase, using fallback content.json:', err?.message);
      return this.getFallbackSettings();
    }
  },

  async getSettings(): Promise<SiteSettings> {
    return this.getSiteSettings();
  },

  // --- Synchronous Fallbacks using static content.json and local storage ---

  getFallbackArticles(): Article[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (stored) {
        const parsed: Article[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => {
            const dateA = a.publishedAt || a.publishedDate || '';
            const dateB = b.publishedAt || b.publishedDate || '';
            return dateB.localeCompare(dateA);
          });
        }
      }
    } catch {
      // Fallback to content.json
    }

    const raw = ((contentData as any)?.articles as Article[]) || sampleArticles;
    const items = raw.map(art => {
      if (art.id === 'art-1793470369985') {
        return {
          ...art,
          slug: 'bfiu-circular-26-summary'
        };
      }
      return art;
    });

    return items.sort((a, b) => {
      const dateA = a.publishedAt || a.publishedDate || '';
      const dateB = b.publishedAt || b.publishedDate || '';
      return dateB.localeCompare(dateA);
    });
  },

  getFallbackResources(): PdfResource[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      if (stored) {
        const parsed: PdfResource[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return ((contentData as any)?.resources as PdfResource[]) || samplePdfResources;
  },

  getFallbackSettings(): SiteSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.siteName) return parsed;
      }
    } catch {
      // Fallback
    }
    return ((contentData as any)?.siteSettings as SiteSettings) || initialSiteSettings;
  },

  getSyncArticles(): Article[] {
    return this.getFallbackArticles();
  },

  getSyncResources(): PdfResource[] {
    return this.getFallbackResources();
  },

  getSyncSettings(): SiteSettings {
    return this.getFallbackSettings();
  },

  // --- Admin Writes & Storage Helpers ---

  saveResources(resources: PdfResource[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },

  addResource(newResource: Omit<PdfResource, 'id' | 'publicationDate' | 'downloadsCount' | 'viewsCount'>): PdfResource {
    const resources = this.getFallbackResources();
    const created: PdfResource = {
      ...newResource,
      id: `resource-${Date.now()}`,
      publicationDate: new Date().toISOString().split('T')[0],
      downloadsCount: 0,
      viewsCount: 1,
      status: newResource.status || 'published',
      isDraft: newResource.status === 'draft' || Boolean(newResource.isDraft)
    };
    const updated = [created, ...resources];
    this.saveResources(updated);
    return created;
  },

  updateResource(updatedResource: PdfResource): void {
    const resources = this.getFallbackResources();
    const index = resources.findIndex(r => r.id === updatedResource.id);
    if (index !== -1) {
      resources[index] = updatedResource;
      this.saveResources(resources);
    }
  },

  deleteResource(id: string): void {
    const resources = this.getFallbackResources().filter(r => r.id !== id);
    this.saveResources(resources);
  },

  incrementView(id: string): void {
    const resources = this.getFallbackResources();
    const target = resources.find(r => r.id === id);
    if (target) {
      target.viewsCount = (target.viewsCount || 0) + 1;
      this.saveResources(resources);
    }
  },

  incrementDownload(id: string): void {
    const resources = this.getFallbackResources();
    const target = resources.find(r => r.id === id);
    if (target) {
      target.downloadsCount = (target.downloadsCount || 0) + 1;
      this.saveResources(resources);
    }
  },

  saveArticles(articles: Article[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.warn('Failed to save articles:', e);
    }
  },

  addArticle(newArticle: Omit<Article, 'id' | 'publishedDate'>): Article {
    const articles = this.getFallbackArticles();
    const created: Article = {
      ...newArticle,
      id: `art-${Date.now()}`,
      publishedDate: new Date().toISOString().split('T')[0],
      publishedAt: newArticle.publishedAt !== undefined ? newArticle.publishedAt : new Date().toISOString().split('T')[0],
      featured: newArticle.featured ?? false,
      pdfId: newArticle.pdfId ?? null,
      status: newArticle.status || 'published',
      isDraft: newArticle.status === 'draft' || Boolean(newArticle.isDraft)
    };
    const updated = [created, ...articles];
    this.saveArticles(updated);
    return created;
  },

  updateArticle(updatedArticle: Article): void {
    const articles = this.getFallbackArticles();
    const index = articles.findIndex(a => a.id === updatedArticle.id);
    if (index !== -1) {
      articles[index] = updatedArticle;
      this.saveArticles(articles);
    }
  },

  deleteArticle(id: string): void {
    const articles = this.getFallbackArticles().filter(a => a.id !== id);
    this.saveArticles(articles);
  },

  saveSettings(settings: SiteSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  },

  getBookmarks(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(id: string): boolean {
    const current = this.getBookmarks();
    let updated: string[];
    let isBookmarked = false;
    if (current.includes(id)) {
      updated = current.filter(item => item !== id);
      isBookmarked = false;
    } else {
      updated = [...current, id];
      isBookmarked = true;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    return isBookmarked;
  },

  getCompletedResources(): string[] {
    try {
      const stored = localStorage.getItem('ikl_completed_resources_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  toggleCompletedResource(id: string): boolean {
    const current = this.getCompletedResources();
    let updated: string[];
    let isCompleted = false;
    if (current.includes(id)) {
      updated = current.filter(item => item !== id);
      isCompleted = false;
    } else {
      updated = [...current, id];
      isCompleted = true;
    }
    try {
      localStorage.setItem('ikl_completed_resources_v1', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    return isCompleted;
  },

  getLastReadResource(): { id: string; title: string; titleBn: string; timestamp: number } | null {
    try {
      const stored = localStorage.getItem('ikl_last_read_v1');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setLastReadResource(id: string, title: string, titleBn: string): void {
    try {
      localStorage.setItem('ikl_last_read_v1', JSON.stringify({
        id,
        title,
        titleBn,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn(e);
    }
  },

  getTheme(): 'light' | 'sepia' | 'dark' {
    try {
      const theme = localStorage.getItem('ikl_reader_theme');
      if (theme === 'sepia' || theme === 'dark' || theme === 'light') return theme;
    } catch {
      // fallback
    }
    return 'light';
  },

  setTheme(theme: 'light' | 'sepia' | 'dark'): void {
    try {
      localStorage.setItem('ikl_reader_theme', theme);
      if (theme === 'sepia') {
        document.documentElement.setAttribute('data-theme', 'sepia');
        document.documentElement.classList.remove('dark');
      } else if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn(e);
    }
  },

  getFontSize(): 'sm' | 'base' | 'lg' | 'xl' {
    try {
      const size = localStorage.getItem('ikl_reader_font_size');
      if (size === 'sm' || size === 'base' || size === 'lg' || size === 'xl') return size;
    } catch {
      // fallback
    }
    return 'base';
  },

  setFontSize(size: 'sm' | 'base' | 'lg' | 'xl'): void {
    try {
      localStorage.setItem('ikl_reader_font_size', size);
    } catch (e) {
      console.warn(e);
    }
  },

  exportDatabaseBackup(): string {
    const data = {
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      siteSettings: this.getSyncSettings(),
      resources: this.getSyncResources(),
      articles: this.getSyncArticles()
    };
    return JSON.stringify(data, null, 2);
  },

  importDatabaseBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.resources && Array.isArray(parsed.resources)) {
        this.saveResources(parsed.resources);
      }
      if (parsed.articles && Array.isArray(parsed.articles)) {
        this.saveArticles(parsed.articles);
      }
      if (parsed.siteSettings) {
        this.saveSettings(parsed.siteSettings);
      }
      return true;
    } catch (e) {
      console.error('Failed to import database backup', e);
      return false;
    }
  },

  resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.ARTICLES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
};
