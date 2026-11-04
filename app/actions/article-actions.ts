'use server';

import { createClient } from '@/utils/supabase/server';

// Revalidation helper for Next.js / framework cache revalidation
const revalidatePath = (_path: string) => {
  // Safe fallback if revalidatePath is not provided in standard Vite runtime
};

export interface BatchDeleteArticleItem {
  id: string;
  pdfUrl?: string;
}

export async function deleteArticle(
  articleId: string,
  pdfUrl?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!articleId) {
      return { success: false, error: 'Article ID is required' };
    }

    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, error: 'প্রথমে এডমিন অ্যাকাউন্টে লগইন করুন (Please log in first)' };
    }

    // 1. Delete associated PDF file from 'pdfs' storage bucket using pdfUrl (if provided)
    if (pdfUrl && pdfUrl.trim() !== '') {
      try {
        let filePath: string | null = null;
        const bucketMarker = '/pdfs/';
        const idx = pdfUrl.indexOf(bucketMarker);

        if (idx !== -1) {
          filePath = pdfUrl.substring(idx + bucketMarker.length);
        } else if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://')) {
          filePath = pdfUrl;
        }

        if (filePath) {
          // Remove URL query parameters if present
          filePath = filePath.split('?')[0];

          const { error: storageError } = await supabase.storage
            .from('pdfs')
            .remove([filePath]);

          if (storageError) {
            console.warn('[Supabase Storage] Notice deleting PDF file:', storageError.message);
          } else {
            console.log('[Supabase Storage] PDF file removed successfully:', filePath);
          }
        }
      } catch (storageException: any) {
        console.warn('[Supabase Storage] Exception deleting PDF file:', storageException?.message);
      }
    }

    // 2. Delete article row from 'articles' table using articleId
    const { error: dbError } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // 3. Clear cache / revalidate paths
    try {
      revalidatePath('/dashboard');
      revalidatePath('/articles');
    } catch {
      // Ignore if revalidatePath is unavailable
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred while deleting the article.'
    };
  }
}

export async function deleteSelectedArticles(
  articles: BatchDeleteArticleItem[]
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    if (!articles || articles.length === 0) {
      return { success: false, count: 0, error: 'No articles selected for deletion' };
    }

    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, count: 0, error: 'প্রথমে এডমিন অ্যাকাউন্টে লগইন করুন (Please log in first)' };
    }

    const articleIds = articles.map(a => a.id).filter(Boolean);
    const pdfPaths: string[] = [];

    // 1. Collect all associated PDF file paths to remove from 'pdfs' storage bucket
    for (const item of articles) {
      if (item.pdfUrl && item.pdfUrl.trim() !== '') {
        const bucketMarker = '/pdfs/';
        const idx = item.pdfUrl.indexOf(bucketMarker);
        let path: string | null = null;
        if (idx !== -1) {
          path = item.pdfUrl.substring(idx + bucketMarker.length);
        } else if (!item.pdfUrl.startsWith('http://') && !item.pdfUrl.startsWith('https://')) {
          path = item.pdfUrl;
        }
        if (path) {
          pdfPaths.push(path.split('?')[0]);
        }
      }
    }

    if (pdfPaths.length > 0) {
      try {
        const { error: storageError } = await supabase.storage
          .from('pdfs')
          .remove(pdfPaths);

        if (storageError) {
          console.warn('[Supabase Storage] Notice during batch PDF removal:', storageError.message);
        } else {
          console.log(`[Supabase Storage] Batch removed ${pdfPaths.length} PDF files from pdfs bucket.`);
        }
      } catch (stErr: any) {
        console.warn('[Supabase Storage] Exception in batch PDF removal:', stErr?.message);
      }
    }

    // 2. Batch delete article rows from 'articles' database table
    const { error: dbError } = await supabase
      .from('articles')
      .delete()
      .in('id', articleIds);

    if (dbError) {
      return { success: false, count: 0, error: dbError.message };
    }

    // 3. Clear cache / revalidate paths
    try {
      revalidatePath('/dashboard');
      revalidatePath('/articles');
    } catch {
      // Safe fallback
    }

    return { success: true, count: articleIds.length };
  } catch (err: any) {
    return {
      success: false,
      count: 0,
      error: err?.message || 'An unexpected error occurred during batch article deletion.'
    };
  }
}
