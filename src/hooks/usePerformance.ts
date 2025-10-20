import { useEffect, useRef } from 'react';

// Custom hook for performance monitoring
export const usePerformance = (componentName: string) => {
  const mountTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    
    // Mark component mount
    if ('performance' in window && 'mark' in window.performance) {
      window.performance.mark(`${componentName}-mount`);
    }
    
    return () => {
      // Calculate mount duration
      const mountDuration = Date.now() - mountTime.current;
      
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} Performance:`, {
          mountDuration: `${mountDuration}ms`,
          renderCount: renderCount.current,
        });
      }
      
      // Mark component unmount
      if ('performance' in window && 'mark' in window.performance) {
        window.performance.mark(`${componentName}-unmount`);
        window.performance.measure(
          `${componentName}-lifecycle`,
          `${componentName}-mount`,
          `${componentName}-unmount`
        );
      }
    };
  }, [componentName]);

  return {
    renderCount: renderCount.current,
    mountTime: mountTime.current,
  };
};

// Hook for lazy loading
export const useLazyLoad = (callback: () => void, options?: IntersectionObserverInit) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback();
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px', ...options }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return elementRef;
};

// Hook for debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for viewport size
export const useViewport = () => {
  const [viewport, setViewport] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...viewport,
    isMobile: viewport.width <= 768,
    isTablet: viewport.width > 768 && viewport.width <= 1024,
    isDesktop: viewport.width > 1024,
  };
};

// Hook for local storage
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};