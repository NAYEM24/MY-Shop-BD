import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Pause, Play } from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { BannerSlide } from '../../types/index.ts';
import { getActiveSortedBanners, resolveBannerDestination } from '../../utils/bannerRules.ts';

export const BannerSlider: React.FC = () => {
  const {
    banners,
    language,
    setCurrentView,
    setSelectedCategorySlug,
  } = useShop();

  // Filter active banners and sort by order
  const activeBanners = React.useMemo(() => {
    return getActiveSortedBanners(banners);
  }, [banners]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-play interval
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused]);

  // Adjust index if count changes
  useEffect(() => {
    if (currentIndex >= activeBanners.length && activeBanners.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeBanners.length, currentIndex]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> next
      goToNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      goToPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleBannerClick = (slide: BannerSlide) => {
    const dest = resolveBannerDestination(slide);
    if (dest.categorySlug) {
      setSelectedCategorySlug(dest.categorySlug);
    }
    setCurrentView(dest.view as any);
  };

  if (activeBanners.length === 0) {
    return null;
  }

  const currentSlide = activeBanners[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl group select-none bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional Banners"
    >
      {/* Aspect Ratio Container */}
      <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[380px] md:h-[440px] lg:h-[480px]">
        {activeBanners.map((slide, index) => {
          const isActive = index === currentIndex;
          const title = language === 'bn' && slide.titleBn ? slide.titleBn : slide.title;
          const subtitle = language === 'bn' && slide.subtitleBn ? slide.subtitleBn : slide.subtitle;
          const badge = language === 'bn' && slide.badgeBn ? slide.badgeBn : slide.badge;
          const btnText =
            language === 'bn' && slide.buttonTextBn
              ? slide.buttonTextBn
              : slide.buttonText || (language === 'bn' ? 'এখনই দেখুন' : 'Shop Now');

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image */}
              <img
                src={slide.imageUrl}
                alt={title}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Gradient Overlays for High Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/20 sm:bg-gradient-to-r sm:from-slate-950/90 sm:via-slate-950/60 sm:to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-5 sm:p-10 lg:p-14 max-w-2xl text-left">
                {badge && (
                  <div className="inline-flex items-center space-x-1.5 self-start bg-teal-500/25 border border-teal-400/40 text-teal-300 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2 sm:mb-3 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                    <span>{badge}</span>
                  </div>
                )}

                <h2 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug drop-shadow-md">
                  {title}
                </h2>

                {subtitle && (
                  <p className="mt-2 text-xs sm:text-base text-slate-200 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-sm font-medium max-w-xl">
                    {subtitle}
                  </p>
                )}

                {/* Call To Action Button */}
                <div className="mt-3.5 sm:mt-6">
                  <button
                    type="button"
                    onClick={() => handleBannerClick(slide)}
                    className="inline-flex items-center space-x-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{btnText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Desktop Side Buttons) */}
      {activeBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slide Indicators, Auto-Play Pause & Mobile Arrow Controls */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 right-3.5 sm:right-8 z-20 flex items-center space-x-1.5 sm:space-x-2 bg-slate-950/70 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          {/* Mobile prev button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Previous Slide"
            className="sm:hidden text-slate-300 hover:text-white p-0.5 active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-5 sm:w-8 h-1.5 sm:h-2 bg-teal-400'
                  : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}

          {/* Mobile next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next Slide"
            className="sm:hidden text-slate-300 hover:text-white p-0.5 active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Pause / Play Button */}
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            className="text-slate-300 hover:text-white ml-0.5 sm:ml-1 p-0.5"
            title={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? <Play className="w-3 h-3 text-teal-400" /> : <Pause className="w-3 h-3 text-slate-300" />}
          </button>
        </div>
      )}
    </div>
  );
};
