import { PdfResource, Article, SiteSettings } from '../types';
import { samplePdfResources, sampleArticles, initialSiteSettings } from '../data/mockData';

const STORAGE_KEYS = {
  RESOURCES: 'ikl_pdf_resources_v1',
  ARTICLES: 'ikl_articles_v1',
  SETTINGS: 'ikl_site_settings_v1',
  BOOKMARKS: 'ikl_bookmarked_ids_v1'
};

export const StorageService = {
  getResources(): PdfResource[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      if (stored) {
        const parsed: PdfResource[] = JSON.parse(stored);
        // Merge missing sample items (by id) and preserve user items
        const existingIds = new Set(parsed.map(r => r.id));
        const missingSamples = samplePdfResources.filter(s => !existingIds.has(s.id));
        if (missingSamples.length > 0) {
          const merged = [...parsed, ...missingSamples];
          this.saveResources(merged);
          return merged;
        }
        return parsed;
      }
    } catch {
      // Fallback to sample data
    }
    this.saveResources(samplePdfResources);
    return samplePdfResources;
  },

  saveResources(resources: PdfResource[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },

  addResource(newResource: Omit<PdfResource, 'id' | 'publicationDate' | 'downloadsCount' | 'viewsCount'>): PdfResource {
    const resources = this.getResources();
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
    const resources = this.getResources();
    const index = resources.findIndex(r => r.id === updatedResource.id);
    if (index !== -1) {
      resources[index] = updatedResource;
      this.saveResources(resources);
    }
  },

  deleteResource(id: string): void {
    const resources = this.getResources().filter(r => r.id !== id);
    this.saveResources(resources);
  },

  incrementView(id: string): void {
    const resources = this.getResources();
    const target = resources.find(r => r.id === id);
    if (target) {
      target.viewsCount = (target.viewsCount || 0) + 1;
      this.saveResources(resources);
    }
  },

  incrementDownload(id: string): void {
    const resources = this.getResources();
    const target = resources.find(r => r.id === id);
    if (target) {
      target.downloadsCount = (target.downloadsCount || 0) + 1;
      this.saveResources(resources);
    }
  },

  getArticles(): Article[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (stored) {
        const parsed: Article[] = JSON.parse(stored);
        const existingIds = new Set(parsed.map(a => a.id));
        const missingSamples = sampleArticles.filter(s => !existingIds.has(s.id));
        let needSave = false;
        let result = parsed;
        if (missingSamples.length > 0) {
          result = [...missingSamples, ...result];
          needSave = true;
        }
        // Ensure standard sample articles receive updated metadata if cached
        result = result.map(art => {
          const sample = sampleArticles.find(s => s.id === art.id);
          if (sample) {
            let updated = false;
            const patched = { ...art };
            if (!patched.menuCategory && sample.menuCategory) {
              patched.menuCategory = sample.menuCategory;
              updated = true;
            }
            if (patched.publishedAt === undefined && sample.publishedAt !== undefined) {
              patched.publishedAt = sample.publishedAt;
              updated = true;
            }
            if (patched.pdfId === undefined && sample.pdfId !== undefined) {
              patched.pdfId = sample.pdfId;
              updated = true;
            }
            if (patched.featured === undefined && sample.featured !== undefined) {
              patched.featured = sample.featured;
              updated = true;
            }
            if (updated) {
              needSave = true;
              return patched;
            }
          }
          return art;
        });
        if (needSave) {
          this.saveArticles(result);
        }
        return result;
      }
    } catch {
      // Fallback
    }
    this.saveArticles(sampleArticles);
    return sampleArticles;
  },

  saveArticles(articles: Article[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.warn('Failed to save articles:', e);
    }
  },

  addArticle(newArticle: Omit<Article, 'id' | 'publishedDate'>): Article {
    const articles = this.getArticles();
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
    const articles = this.getArticles();
    const index = articles.findIndex(a => a.id === updatedArticle.id);
    if (index !== -1) {
      articles[index] = updatedArticle;
      this.saveArticles(articles);
    }
  },

  deleteArticle(id: string): void {
    const articles = this.getArticles().filter(a => a.id !== id);
    this.saveArticles(articles);
  },

  getSettings(): SiteSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.siteName !== 'Islami Banking Diploma' || !parsed.siteName) {
          parsed.siteName = initialSiteSettings.siteName;
          parsed.siteNameBn = initialSiteSettings.siteNameBn;
          parsed.subtitle = initialSiteSettings.subtitle;
          parsed.subtitleBn = initialSiteSettings.subtitleBn;
          parsed.contactEmail = initialSiteSettings.contactEmail;
          this.saveSettings(parsed);
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return initialSiteSettings;
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

  // Reading Progress: Marked as Completed/Read
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

  // Last Read Resource Tracker for "Resume Where You Left Off"
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

  // Reader Preferences: Theme & Font Size
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
      siteSettings: this.getSettings(),
      resources: this.getResources(),
      articles: this.getArticles()
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
    this.saveResources(samplePdfResources);
    this.saveArticles(sampleArticles);
    this.saveSettings(initialSiteSettings);
  }
};
