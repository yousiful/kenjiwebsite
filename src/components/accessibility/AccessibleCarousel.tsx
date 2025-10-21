import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface AccessibleCarouselProps {
  items: Array<{
    id: string;
    content: React.ReactNode;
    label: string;
  }>;
  autoPlayInterval?: number;
  ariaLabel?: string;
}

const AccessibleCarousel: React.FC<AccessibleCarouselProps> = ({
  items,
  autoPlayInterval = 5000,
  ariaLabel = 'Content carousel'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    announceSlide(index);
  };

  const announceSlide = (index: number) => {
    const announcement = `Showing item ${index + 1} of ${items.length}: ${items[index].label}`;
    const liveRegion = document.getElementById('carousel-live-region');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  const togglePlayPause = () => {
    setUserPaused(!isPlaying);
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsPlaying(false);
      return;
    }

    if (isPlaying && !userPaused) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentIndex, userPaused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(items.length - 1);
        break;
    }
  };

  return (
    <section
      ref={carouselRef}
      className="relative"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
    >
      <div
        id="carousel-live-region"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="relative bg-gray-800/50 rounded-2xl overflow-hidden">
        <div
          className="relative"
          role="group"
          aria-roledescription="slide"
          aria-label={`${currentIndex + 1} of ${items.length}`}
        >
          {items[currentIndex].content}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/90 to-transparent p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={goToPrevious}
                className="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                onClick={goToNext}
                className="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                onClick={togglePlayPause}
                className="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Play className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="flex gap-2" role="tablist" aria-label="Slide navigation">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    index === currentIndex
                      ? 'bg-blue-500 w-8'
                      : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                  role="tab"
                  aria-label={`Go to slide ${index + 1}: ${item.label}`}
                  aria-selected={index === currentIndex}
                  aria-controls={`slide-${index}`}
                  tabIndex={index === currentIndex ? 0 : -1}
                />
              ))}
            </div>

            <div className="text-white text-sm font-medium" aria-live="polite">
              {currentIndex + 1} / {items.length}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-gray-400 text-sm">
        <p>
          Use arrow keys to navigate, Home/End for first/last slide
        </p>
      </div>
    </section>
  );
};

export default AccessibleCarousel;
