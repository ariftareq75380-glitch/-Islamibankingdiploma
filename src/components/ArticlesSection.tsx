import React, { useState } from 'react';
import { Article, PdfResource } from '../types';
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight, 
  Languages, 
  Bookmark,
  Share2,
  Calendar,
  FileText
} from 'lucide-react';

interface ArticlesSectionProps {
  articles: Article[];
  resources: PdfResource[];
  onOpenArticle: (article: Article) => void;
  lang: 'bn' | 'en';
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  articles,
  resources,
  onOpenArticle,
  lang
}) => {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ইসলামী ব্যাংকিং ও অর্থনীতি কলাম' : 'Islamic Banking Research & Articles'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              {lang === 'bn' ? 'প্রবন্ধ ও ব্যাংকিং বিশ্লেষণ (বাংলা ও ইংরেজি)' : 'Bilingual Banking Insights & Articles'}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl font-bengali">
              {lang === 'bn'
                ? 'বাংলাদেশের ব্যাংকিং বাস্তবতা, মুদারাবা-মুশারাকা চুক্তি, রিবা বনাম মুনাফা এবং সমসাময়িক ফিনটেক ও সুকুক ব্যবস্থার ওপর বিশেষ নিবন্ধ।'
                : 'Scholarly yet practical analyses on Islamic banking evolution, contract structuring, risk frameworks, and DIB examination strategies.'}
            </p>
          </div>
          <div className="text-xs text-stone-500 font-medium">
            {lang === 'bn' ? 'বাংলা ও ইংরেজি উভয় ভাষায় পড়ার সুবিধা' : 'Available in both Bengali & English'}
          </div>
        </div>

        {/* Articles List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article
              key={art.id}
              onClick={() => onOpenArticle(art)}
              className="group cursor-pointer rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-emerald-600/70 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Cover Image if present */}
                {art.coverImage && (
                  <div className="relative h-44 overflow-hidden bg-stone-200">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[11px] font-semibold bg-stone-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded">
                        {art.readTime}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  {/* Clean unboxed metadata (anti-slop) */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                    <span className="font-semibold text-emerald-800">
                      {lang === 'bn' ? art.categoryBn : art.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{art.publishedDate}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-stone-900 text-base sm:text-lg group-hover:text-emerald-800 transition-colors leading-snug mb-2 font-bengali">
                    {lang === 'bn' ? art.titleBn : art.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed mb-4 font-bengali">
                    {lang === 'bn' ? art.summaryBn : art.summary}
                  </p>
                </div>
              </div>

              {/* Author & Read More Bar */}
              <div className="px-5 py-3 border-t border-stone-200/80 bg-stone-100/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-stone-600 truncate max-w-[70%]">
                  <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate font-medium">{art.author}</span>
                </div>

                <div className="flex items-center gap-1 font-semibold text-emerald-800 group-hover:text-emerald-950">
                  <span>{lang === 'bn' ? 'সম্পূর্ণ পড়ুন' : 'Read Article'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
