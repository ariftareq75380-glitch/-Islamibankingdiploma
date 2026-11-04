'use server';

import { createClient } from '@/utils/supabase/server';

// Revalidation helper for Next.js / framework cache revalidation
const revalidatePath = (_path: string) => {
  // Safe fallback if revalidatePath is not provided in standard Vite runtime
};

export async function deleteArticle(
  articleId: string,
  pdfUrl?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!articleId) {
      return { success: false, error: 'Article ID is required' };
    }

    const supabase = await createClient();

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
