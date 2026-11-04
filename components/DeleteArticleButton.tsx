'use client';

import React, { useState, useTransition } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { deleteArticle } from '@/app/actions/article-actions';

interface DeleteArticleButtonProps {
  articleId: string;
  pdfUrl?: string;
  title?: string;
  showLabel?: boolean;
  onDeleteSuccess?: () => void;
  className?: string;
}

export const DeleteArticleButton: React.FC<DeleteArticleButtonProps> = ({
  articleId,
  pdfUrl,
  title,
  showLabel = false,
  onDeleteSuccess,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await deleteArticle(articleId, pdfUrl);
      if (result.success) {
        setIsOpen(false);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          alert('আর্টিকেল সফলভাবে মুছে ফেলা হয়েছে!');
        }
      } else {
        const err = result.error || 'Failed to delete article';
        setErrorMessage(err);
        alert(`ত্রুটি: ${err}`);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className || (showLabel
            ? 'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer'
            : 'inline-flex items-center justify-center p-1.5 text-stone-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors cursor-pointer')
        }
        title="Delete Article / আর্টিকেল মুছুন"
      >
        <Trash2 className={showLabel ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        {showLabel && <span>মুছুন</span>}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 text-red-700 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Delete Article / ডিলিট কনফার্মেশন</h3>
                <p className="text-xs text-stone-500 font-mono">ID: {articleId}</p>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed font-bengali">
              Are you sure you want to delete this article{title ? ` "${title}"` : ''}? This action cannot be undone.
              <br />
              <span className="text-stone-500 mt-1 block">
                (আপনি কি নিশ্চিতভাবে এই আর্টিকেলটি মুছে ফেলতে চান? এটি Supabase ডাটাবেজ এবং ক্লাউড স্টোরেজ থেকে স্থায়ীভাবে মুছে যাবে।)
              </span>
            </p>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Article</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteArticleButton;
