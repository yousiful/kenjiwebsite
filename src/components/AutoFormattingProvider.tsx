import React, { createContext, useContext, useEffect, ReactNode } from 'react';

interface AutoFormattingContextType {
  fixFormatting: () => void;
}

const AutoFormattingContext = createContext<AutoFormattingContextType | undefined>(undefined);

interface AutoFormattingProviderProps {
  children: ReactNode;
}

export const AutoFormattingProvider: React.FC<AutoFormattingProviderProps> = ({ children }) => {
  // Function to fix formatting issues
  const fixFormatting = () => {
    const isMobile = window.innerWidth < 768;
    
    // Fix course content
    const courseContent = document.querySelectorAll('.course-content, .prose');
    courseContent.forEach(container => {
      // Fix text elements
      const textElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span, a');
      textElements.forEach(element => {
        (element as HTMLElement).style.maxWidth = '100%';
        (element as HTMLElement).style.wordBreak = 'break-word';
        (element as HTMLElement).style.overflowWrap = 'break-word';
        element.classList.add('auto-format-fix');
      });
      
      // Fix images
      const images = container.querySelectorAll('img');
      images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '1rem auto';
      });
      
      // Fix code blocks
      const codeBlocks = container.querySelectorAll('pre, code');
      codeBlocks.forEach(block => {
        (block as HTMLElement).style.whiteSpace = 'pre-wrap';
        (block as HTMLElement).style.wordBreak = 'break-word';
        (block as HTMLElement).style.maxWidth = '100%';
        (block as HTMLElement).style.overflowX = 'auto';
      });
    });
    
    // Fix grid layouts on mobile
    if (isMobile) {
      const gridElements = document.querySelectorAll('.grid');
      gridElements.forEach(grid => {
        (grid as HTMLElement).style.gap = '1rem';
        
        // Force single column on mobile for specific grids
        if (grid.closest('.course-content, .curriculum-section, .projects-grid, .takeaways')) {
          (grid as HTMLElement).style.gridTemplateColumns = 'repeat(1, minmax(0, 1fr))';
        }
      });
      
      // Fix card heights
      const cards = document.querySelectorAll('.course-card');
      cards.forEach(card => {
        (card as HTMLElement).style.height = 'auto';
      });
      
      // Adjust padding on containers
      const containers = document.querySelectorAll('.course-header, .learning-objectives, .curriculum-section, .case-study, .certification, .takeaways, .next-steps');
      containers.forEach(container => {
        (container as HTMLElement).style.padding = '1rem';
      });
      
      // Fix heading sizes on mobile
      const headings = document.querySelectorAll('.course-content h2, .course-content h3');
      headings.forEach(heading => {
        if (heading.tagName === 'H2') {
          (heading as HTMLElement).style.fontSize = '1.5rem';
        } else if (heading.tagName === 'H3') {
          (heading as HTMLElement).style.fontSize = '1.25rem';
        }
      });
    }
    
    // Fix line clamping
    const clampedElements = document.querySelectorAll('.line-clamp-2, .line-clamp-3');
    clampedElements.forEach(element => {
      (element as HTMLElement).style.display = '-webkit-box';
      (element as HTMLElement).style.webkitLineClamp = element.classList.contains('line-clamp-3') ? '3' : '2';
      (element as HTMLElement).style.webkitBoxOrient = 'vertical';
      (element as HTMLElement).style.overflow = 'hidden';
      (element as HTMLElement).style.wordBreak = 'break-word';
      (element as HTMLElement).style.overflowWrap = 'break-word';
    });
    
    // Fix blog post content
    const blogContent = document.querySelectorAll('.blog-content');
    blogContent.forEach(container => {
      const paragraphs = container.querySelectorAll('p');
      paragraphs.forEach(p => {
        (p as HTMLElement).style.maxWidth = '100%';
        (p as HTMLElement).style.wordBreak = 'break-word';
      });
    });
    
    // Fix tables
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      table.style.width = '100%';
      table.style.maxWidth = '100%';
      table.style.display = 'block';
      table.style.overflowX = 'auto';
      
      // Add responsive wrapper if not already present
      if (!table.parentElement?.classList.contains('table-responsive')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        wrapper.style.width = '100%';
        wrapper.style.overflowX = 'auto';
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  };

  useEffect(() => {
    // Run on initial load
    fixFormatting();
    
    // Run on window resize
    window.addEventListener('resize', fixFormatting);
    
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      // Use requestAnimationFrame to avoid multiple calls in the same frame
      requestAnimationFrame(fixFormatting);
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', fixFormatting);
      observer.disconnect();
    };
  }, []);

  return (
    <AutoFormattingContext.Provider value={{ fixFormatting }}>
      {children}
    </AutoFormattingContext.Provider>
  );
};

export const useAutoFormatting = () => {
  const context = useContext(AutoFormattingContext);
  if (context === undefined) {
    throw new Error('useAutoFormatting must be used within an AutoFormattingProvider');
  }
  return context;
};

export default AutoFormattingProvider;