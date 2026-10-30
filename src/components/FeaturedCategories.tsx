import React from 'react';
import { ArrowRight, GraduationCap, Building2, BookOpen, Scale, Sparkles } from 'lucide-react';
import { CategoryInfo, CourseType } from '../types';

interface FeaturedCategoriesProps {
  categories: CategoryInfo[];
  onSelectCategory: (courseType?: CourseType, categorySlug?: string) => void;
  lang: 'bn' | 'en';
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  categories,
  onSelectCategory,
  lang
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-emerald-700" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-emerald-700" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-emerald-700" />;
      case 'Scale': return <Scale className="w-5 h-5 text-emerald-700" />;
      default: return <BookOpen className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              {lang === 'bn' ? 'বিষয়ভিত্তিক বিভাগসমূহ' : 'Subject Divisions'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              {lang === 'bn' ? 'প্রধান শিক্ষামূলক বিভাগ' : 'Featured Knowledge Categories'}
            </h2>
          </div>
          <p className="text-sm text-stone-500 max-w-md">
            {lang === 'bn' 
              ? 'ডিপ্লোমা ইন ইসলামিক ব্যাংকিং, আন্তর্জাতিক শরীয়াহ স্ট্যান্ডার্ড এবং প্রামাণ্য ইসলামিক ফিকহ সংকলন।'
              : 'Direct access to structured study modules, past question papers, and authentic financial jurisprudential treatises.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.courseType, cat.slug)}
              className="group cursor-pointer rounded-xl border border-stone-200 overflow-hidden bg-stone-50 hover:bg-white hover:border-emerald-600/60 hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              {/* Category Image with zero broken image fallback */}
              <div className="relative h-44 overflow-hidden bg-stone-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="font-semibold px-2 py-0.5 rounded bg-stone-900/80 backdrop-blur-xs">
                    {cat.itemCount} {lang === 'bn' ? 'টি রিসোর্স' : 'Resources'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100/70">
                      {getIcon(cat.iconName)}
                    </div>
                    <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-800 transition-colors">
                      {lang === 'bn' ? cat.nameBn : cat.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                    {lang === 'bn' ? cat.descriptionBn : cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-900">
                  <span>{lang === 'bn' ? 'ফাইলগুলো দেখুন' : 'Explore Archive'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
