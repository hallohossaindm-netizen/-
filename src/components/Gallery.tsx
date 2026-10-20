import React, { useState } from 'react';
import { Camera, ZoomIn, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/madrasahData';
import { GalleryItem } from '../types';

export const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'campus' | 'classroom' | 'library'>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-[#FAF9F5] dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="text-xs uppercase tracking-widest text-[#064E3B] dark:text-emerald-400 font-semibold">
            চিত্রপ্রদর্শনী ও মনোরম পরিবেশ
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bangla text-stone-900 dark:text-stone-100 mt-2">
            ক্যাম্পাস ও শিক্ষা কার্যক্রম গ্যালারি
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm font-bangla mt-3">
            পবিত্র কুরআন অধ্যয়নের স্নিগ্ধ শ্রেণিকক্ষ, কিতাবখানা এবং শালীন ইসলামিক ক্যাম্পাস পরিবেশের খণ্ডচিত্র।
          </p>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4" />
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center justify-center gap-1.5 mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors font-bangla cursor-pointer ${
              filter === 'all'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
            }`}
          >
            সব ছবি ({GALLERY_ITEMS.length})
          </button>
          <button
            onClick={() => setFilter('campus')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors font-bangla cursor-pointer ${
              filter === 'campus'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
            }`}
          >
            ক্যাম্পাস ও ভবন
          </button>
          <button
            onClick={() => setFilter('classroom')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors font-bangla cursor-pointer ${
              filter === 'classroom'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
            }`}
          >
            শ্রেণিকক্ষ ও পাঠদান
          </button>
          <button
            onClick={() => setFilter('library')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors font-bangla cursor-pointer ${
              filter === 'library'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
            }`}
          >
            কিতাবখানা ও লাইব্রেরি
          </button>
        </div>

        {/* Responsive Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <picture>
                  {item.srcSet && (
                    <source
                      type="image/webp"
                      srcSet={item.srcSet}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                    />
                  )}
                  <img
                    src={item.webpUrl || item.imageUrl}
                    alt={item.title}
                    width={item.width || 600}
                    height={item.height || 450}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (item.imageUrl && target.src !== item.imageUrl) {
                        target.src = item.imageUrl;
                      }
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </picture>
                <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-md">
                    <ZoomIn className="w-5 h-5 text-[#064E3B]" />
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 font-bangla uppercase tracking-wider mb-1">
                    {item.categoryLabel}
                  </div>
                  <h3 className="text-sm font-bold font-bangla text-stone-900 dark:text-stone-100 group-hover:text-[#064E3B] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-bangla mt-1 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-stone-950 rounded-lg overflow-hidden border border-stone-800 shadow-2xl">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 text-stone-300 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors"
              aria-label="বন্ধ করুন"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[70vh] flex items-center justify-center bg-black p-2 sm:p-4">
              <picture className="flex items-center justify-center w-full h-full">
                {activeItem.srcSet && (
                  <source
                    type="image/webp"
                    srcSet={activeItem.srcSet}
                    sizes="(max-width: 1024px) 95vw, 896px"
                  />
                )}
                <img
                  src={activeItem.webpUrl || activeItem.imageUrl}
                  alt={activeItem.title}
                  width={activeItem.width || 1200}
                  height={activeItem.height || 896}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (activeItem.imageUrl && target.src !== activeItem.imageUrl) {
                      target.src = activeItem.imageUrl;
                    }
                  }}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded"
                />
              </picture>
            </div>

            <div className="p-5 bg-stone-900 text-white font-bangla">
              <div className="text-xs text-amber-400 font-semibold mb-1">
                {activeItem.categoryLabel} · তালিমুল কুরআন মহিলা মাদ্রাসা
              </div>
              <h3 className="text-lg font-bold text-stone-100">
                {activeItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                {activeItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
