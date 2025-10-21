import { useEffect } from 'react';

/**
 * Custom hook to automatically fix formatting issues, especially on mobile devices
 * @param selector - CSS selector for elements to apply formatting fixes to
 */
export const useAutoFormatting = (selector: string = '.course-content') => {
  useEffect(() => {
    // Function to fix formatting issues
    const fixFormatting = () => {
      const isMobile = window.innerWidth < 768;
      
      // Get the container element
      const container = document.querySelector(selector);
      if (!container) return;
      
      // Fix text elements
      const textElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span, a');
      textElements.forEach(element => {
        (element as HTMLElement).style.maxWidth = '100%';
        (element as HTMLElement).style.wordBreak = 'break-word';
        (element as HTMLElement).style.overflowWrap = 'break-word';
        
        // Add class for CSS fixes
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
      
      // Fix tables
      const tables = container.querySelectorAll('table');
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
      
      // Fix code blocks
      const codeBlocks = container.querySelectorAll('pre, code');
      codeBlocks.forEach(block => {
        (block as HTMLElement).style.whiteSpace = 'pre-wrap';
        (block as HTMLElement).style.wordBreak = 'break-word';
        (block as HTMLElement).style.maxWidth = '100%';
        (block as HTMLElement).style.overflowX = 'auto';
      });
      
      // Fix grid layouts on mobile
      if (isMobile) {
        const gridElements = container.querySelectorAll('.grid');
        gridElements.forEach(grid => {
          (grid as HTMLElement).style.gridTemplateColumns = 'repeat(1, minmax(0, 1fr))';
          (grid as HTMLElement).style.gap = '1rem';
        });
        
        // Adjust padding on containers
        const containers = container.querySelectorAll('.course-header, .learning-objectives, .curriculum-section, .case-study, .certification, .takeaways, .next-steps');
        containers.forEach(element => {
          (element as HTMLElement).style.padding = '1rem';
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
      });
    };
    
    // Run on initial load
    fixFormatting();
    
    // Run on window resize
    window.addEventListener('resize', fixFormatting);
    
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(fixFormatting);
    
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
  }, [selector]);
};

export default useAutoFormatting;