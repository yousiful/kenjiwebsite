import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProgressivelyEnhancedInfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  error?: string;
  itemsPerPage?: number;
  loadMoreLabel?: string;
  ariaLabel?: string;
}

function ProgressivelyEnhancedInfiniteScroll<T extends { id: string | number }>({
  items,
  renderItem,
  loadMore,
  hasMore,
  isLoading,
  error,
  itemsPerPage = 10,
  loadMoreLabel = 'Load more items',
  ariaLabel = 'Content list'
}: ProgressivelyEnhancedInfiniteScrollProps<T>) {
  const [manualMode, setManualMode] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(itemsPerPage);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const announceRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const announceNewItems = (count: number) => {
    if (announceRef.current) {
      announceRef.current.textContent = `${count} new items loaded. Total items: ${items.length}`;
    }
  };

  const handleManualLoadMore = useCallback(async () => {
    const previousLength = items.length;
    await loadMore();
    const newItemsCount = items.length - previousLength;
    if (newItemsCount > 0) {
      announceNewItems(newItemsCount);
    }
  }, [loadMore, items.length]);

  useEffect(() => {
    if (manualMode || prefersReducedMotion || !loadMoreRef.current || !hasMore) {
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          handleManualLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [manualMode, hasMore, isLoading, prefersReducedMotion, handleManualLoadMore]);

  const showMoreItems = () => {
    setDisplayedItems(prev => Math.min(prev + itemsPerPage, items.length));
  };

  const currentItems = manualMode ? items.slice(0, displayedItems) : items;
  const canShowMore = manualMode && displayedItems < items.length;

  return (
    <div className="w-full">
      <div
        ref={announceRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">
          {items.length} items
        </h2>

        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={manualMode}
            onChange={(e) => setManualMode(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          />
          <span>Manual loading mode</span>
        </label>
      </div>

      <ul
        className="space-y-4"
        role="list"
        aria-label={ariaLabel}
        aria-busy={isLoading}
      >
        {currentItems.map((item, index) => (
          <li key={item.id} role="listitem">
            {renderItem(item, index)}
          </li>
        ))}
      </ul>

      {error && (
        <div
          role="alert"
          className="mt-6 bg-red-900/50 border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="text-red-300 font-semibold mb-1">Error loading items</h3>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {canShowMore && (
        <div className="mt-6 text-center">
          <button
            onClick={showMoreItems}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Show more items ({Math.min(itemsPerPage, items.length - displayedItems)} more)
          </button>
        </div>
      )}

      {hasMore && !manualMode && (
        <div ref={loadMoreRef} className="mt-6 text-center">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>Loading more items...</span>
            </div>
          ) : (
            <button
              onClick={handleManualLoadMore}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label={loadMoreLabel}
            >
              {loadMoreLabel}
            </button>
          )}
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            No more items to load. Showing all {items.length} items.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProgressivelyEnhancedInfiniteScroll;
