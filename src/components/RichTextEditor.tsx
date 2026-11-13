import React, { useEffect, useRef, useState } from 'react';
import { useEditor, useEditorState, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  Minus,
  Undo2,
  Redo2,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { ensureHtmlContent } from '../utils/richText';

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeightClass?: string;
  className?: string;
  id?: string;
}

interface SavedSelection {
  from: number;
  to: number;
  empty: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'এখানে আর্টিকেলের বিস্তারিত বিষয়বস্তু লিখুন...',
  minHeightClass = 'min-h-[260px]',
  className = '',
  id
}) => {
  // Track the latest HTML emitted from user typing so external prop sync doesn't reset cursor
  const lastEmittedHtmlRef = useRef<string>('');
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Link popover state
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);
  const savedSelectionRef = useRef<SavedSelection | null>(null);
  const linkUrlInputRef = useRef<HTMLInputElement>(null);

  const initialHtml = ensureHtmlContent(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        // Disable StarterKit's bundled Link and Underline so we configure our own cleanly
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'text-emerald-700 underline decoration-emerald-500 underline-offset-2 hover:text-emerald-900 font-medium',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class: `tiptap-editor-content focus:outline-none px-4 py-3 text-sm text-stone-900 font-bengali leading-relaxed ${minHeightClass}`,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.isEmpty ? '' : currentEditor.getHTML();
      lastEmittedHtmlRef.current = html;
      onChangeRef.current(html);
    },
  });

  // Sync external value changes (e.g., opening an article in Edit mode or resetting form)
  useEffect(() => {
    if (!editor) return;

    const normalizedIncoming = ensureHtmlContent(value);
    const currentEditorHtml = editor.isEmpty ? '' : editor.getHTML();

    // Skip if this value came from our own onUpdate callback
    if (value === lastEmittedHtmlRef.current || normalizedIncoming === currentEditorHtml) {
      return;
    }

    lastEmittedHtmlRef.current = normalizedIncoming;
    editor.commands.setContent(normalizedIncoming || '', { emitUpdate: false });
  }, [value, editor]);

  // Reactive active formatting states (React 19 safe via useEditorState)
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return {
          isBold: false,
          isItalic: false,
          isUnderline: false,
          isH2: false,
          isH3: false,
          isBulletList: false,
          isOrderedList: false,
          isBlockquote: false,
          isLink: false,
          canUndo: false,
          canRedo: false,
        };
      }
      return {
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isUnderline: ctx.editor.isActive('underline'),
        isH2: ctx.editor.isActive('heading', { level: 2 }),
        isH3: ctx.editor.isActive('heading', { level: 3 }),
        isBulletList: ctx.editor.isActive('bulletList'),
        isOrderedList: ctx.editor.isActive('orderedList'),
        isBlockquote: ctx.editor.isActive('blockquote'),
        isLink: ctx.editor.isActive('link'),
        canUndo: ctx.editor.can().undo(),
        canRedo: ctx.editor.can().redo(),
      };
    },
  });

  const openLinkModal = () => {
    if (!editor) return;

    // Save current cursor/selection before focusing the link input
    const { from, to, empty } = editor.state.selection;
    savedSelectionRef.current = { from, to, empty };

    const previousUrl = (editor.getAttributes('link').href as string) || '';
    const selectedText = empty ? '' : editor.state.doc.textBetween(from, to, ' ');

    setLinkUrl(previousUrl || 'https://');
    setLinkText(selectedText);
    setLinkError(null);
    setIsLinkMenuOpen(true);

    setTimeout(() => {
      linkUrlInputRef.current?.focus();
      linkUrlInputRef.current?.select();
    }, 20);
  };

  const normalizeUrl = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const applyLink = () => {
    if (!editor) return;

    const rawTrimmed = linkUrl.trim();
    if (!rawTrimmed || rawTrimmed === 'https://' || rawTrimmed === 'http://') {
      setLinkError('অনুগ্রহ করে একটি বৈধ URL লিখুন (যেমন: https://example.com)');
      return;
    }

    const finalHref = normalizeUrl(rawTrimmed);
    const saved = savedSelectionRef.current;

    if (saved) {
      if (saved.empty && !editor.isActive('link')) {
        // No text was selected: insert clickable HTML link using provided label or URL
        const displayLabel = linkText.trim() || finalHref;
        const safeLabel = displayLabel
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        const safeHref = finalHref.replace(/"/g, '&quot;');

        editor
          .chain()
          .focus()
          .setTextSelection(saved.from)
          .insertContent(
            `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeLabel}</a> `
          )
          .run();
      } else {
        // Text was selected (or cursor is inside an existing link)
        const chain = editor.chain().focus().setTextSelection({ from: saved.from, to: saved.to });
        if (editor.isActive('link') && saved.empty) {
          chain.extendMarkRange('link').setLink({ href: finalHref }).run();
        } else {
          chain.setLink({ href: finalHref }).run();
        }
      }
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: finalHref }).run();
    }

    setIsLinkMenuOpen(false);
    setLinkError(null);
  };

  const removeLink = () => {
    if (!editor) return;
    const saved = savedSelectionRef.current;
    if (saved) {
      editor
        .chain()
        .focus()
        .setTextSelection({ from: saved.from, to: saved.to })
        .extendMarkRange('link')
        .unsetLink()
        .run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setIsLinkMenuOpen(false);
    setLinkError(null);
  };

  const cancelLinkMenu = () => {
    setIsLinkMenuOpen(false);
    setLinkError(null);
    if (editor && savedSelectionRef.current) {
      editor
        .chain()
        .focus()
        .setTextSelection({
          from: savedSelectionRef.current.from,
          to: savedSelectionRef.current.to,
        })
        .run();
    }
  };

  // Prevent toolbar button clicks from stealing editor focus or losing text selection
  const preventFocusLoss = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const getBtnClass = (isActive?: boolean, disabled?: boolean) =>
    `inline-flex items-center justify-center h-8 min-w-[32px] px-2 rounded-md border text-xs font-semibold transition-all cursor-pointer select-none ${
      disabled
        ? 'opacity-40 cursor-not-allowed bg-stone-50 text-stone-400 border-stone-200'
        : isActive
        ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
        : 'bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border-stone-200'
    }`;

  if (!editor) {
    return (
      <div className={`border border-stone-300 rounded-xl bg-stone-50 p-4 text-xs text-stone-500 ${minHeightClass}`}>
        এডিটর লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className={`border border-stone-300 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-700/30 focus-within:border-emerald-700 transition-all ${className}`}>
      {/* WYSIWYG Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-stone-100/90 px-2.5 py-2 border-b border-stone-200">
        {/* Bold */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={getBtnClass(editorState.isBold)}
          title="বোল্ড (Ctrl+B)"
          aria-label="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={getBtnClass(editorState.isItalic)}
          title="ইটালিক (Ctrl+I)"
          aria-label="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        {/* Underline */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={getBtnClass(editorState.isUnderline)}
          title="আন্ডারলাইন (Ctrl+U)"
          aria-label="Underline"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-5 bg-stone-300 mx-1" />

        {/* Heading 2 */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={getBtnClass(editorState.isH2)}
          title="বড় শিরোনাম (Heading 2)"
          aria-label="Heading 2"
        >
          H2
        </button>

        {/* Heading 3 */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={getBtnClass(editorState.isH3)}
          title="উপ-শিরোনাম (Heading 3)"
          aria-label="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-5 bg-stone-300 mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getBtnClass(editorState.isBulletList)}
          title="বুলেট তালিকা (Bullet List)"
          aria-label="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={getBtnClass(editorState.isOrderedList)}
          title="নম্বরযুক্ত তালিকা (Ordered List)"
          aria-label="Ordered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={getBtnClass(editorState.isBlockquote)}
          title="উদ্ধৃতি (Blockquote)"
          aria-label="Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={getBtnClass(false)}
          title="ডিভাইডার লাইন (Horizontal Rule)"
          aria-label="Horizontal Rule"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-5 bg-stone-300 mx-1" />

        {/* Link Button */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={openLinkModal}
          className={getBtnClass(editorState.isLink || isLinkMenuOpen)}
          title="হাইপারলিংক যুক্ত বা সম্পাদনা করুন (Insert Link)"
          aria-label="Insert Link"
        >
          <LinkIcon className="w-3.5 h-3.5 mr-1" />
          <span className="text-[11px]">লিংক</span>
        </button>

        {/* Unlink Button (shown when cursor is inside a link) */}
        {editorState.isLink && (
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
            className="inline-flex items-center justify-center h-8 px-2 rounded-md border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold cursor-pointer"
            title="লিংক সরান (Remove Link)"
            aria-label="Remove Link"
          >
            <Unlink className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          disabled={!editorState.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
          className={getBtnClass(false, !editorState.canUndo)}
          title="পূর্বাবস্থায় ফিরুন (Undo)"
          aria-label="Undo"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          disabled={!editorState.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
          className={getBtnClass(false, !editorState.canRedo)}
          title="পুনরায় করুন (Redo)"
          aria-label="Redo"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inline Link Insertion / Editing Bar */}
      {isLinkMenuOpen && (
        <div className="bg-emerald-50/90 border-b border-emerald-200 px-3 py-2.5 space-y-2 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-emerald-900 font-semibold text-xs">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              <span>হাইপারলিংক যুক্ত করুন:</span>
            </div>

            {savedSelectionRef.current?.empty && !editorState.isLink && (
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    applyLink();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelLinkMenu();
                  }
                }}
                placeholder="লিংকের লেখা (যেমন: বিস্তারিত দেখুন)"
                className="flex-1 min-w-[160px] px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            )}

            <input
              ref={linkUrlInputRef}
              type="url"
              value={linkUrl}
              onChange={(e) => {
                setLinkUrl(e.target.value);
                if (linkError) setLinkError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  applyLink();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  cancelLinkMenu();
                }
              }}
              placeholder="https://example.com"
              className="flex-[2] min-w-[200px] px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={applyLink}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>যুক্ত করুন</span>
              </button>

              {editorState.isLink && (
                <button
                  type="button"
                  onClick={removeLink}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>মুছুন</span>
                </button>
              )}

              <button
                type="button"
                onClick={cancelLinkMenu}
                className="p-1.5 bg-white hover:bg-stone-100 text-stone-600 rounded-lg border border-stone-300 cursor-pointer"
                title="বাতিল করুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {linkError && (
            <p className="text-[11px] text-red-700 font-medium">{linkError}</p>
          )}
        </div>
      )}

      {/* TipTap WYSIWYG Editable Canvas */}
      <EditorContent editor={editor} />

      {/* Subtle Footer Bar */}
      <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
        <span>WYSIWYG রিচ টেক্সট এডিটর (HTML আউটপুট)</span>
        <span>
          শব্দ সংখ্যা: {editor.state.doc.textContent.trim() ? editor.state.doc.textContent.trim().split(/\s+/).length : 0}
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;
