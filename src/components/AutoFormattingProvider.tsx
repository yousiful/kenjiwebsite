import React, { createContext, useContext, ReactNode } from 'react';

/*
 * Formatting fixes for long-form content (.prose, .course-content, .blog-content,
 * tables, mobile grids) used to be applied here as inline styles from a
 * MutationObserver that watched style/class changes on the whole body. Writing
 * those styles fired the observer again, so on article pages it re-ran every
 * animation frame (Lighthouse measured 89s of script time on one blog post).
 * The same rules now live in src/index.css ("Auto formatting" block), which the
 * browser applies with no JavaScript at all. fixFormatting stays as a stable
 * no-op so existing callers keep working.
 */
interface AutoFormattingContextType {
  fixFormatting: () => void;
}

const noop = () => {};
const value: AutoFormattingContextType = { fixFormatting: noop };
const AutoFormattingContext = createContext<AutoFormattingContextType>(value);

export const AutoFormattingProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AutoFormattingContext.Provider value={value}>{children}</AutoFormattingContext.Provider>
);

// eslint-disable-next-line react-refresh/only-export-components
export const useAutoFormatting = () => useContext(AutoFormattingContext);

export default AutoFormattingProvider;
