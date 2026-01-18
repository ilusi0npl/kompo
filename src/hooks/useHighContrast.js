import { useState, useEffect } from 'react';

/**
 * Hook for managing high contrast mode
 * - Persists state in localStorage
 * - Applies/removes data-contrast attribute on document root
 * - Respects prefers-contrast media query on initial load
 *
 * @returns {Object} { isHighContrast: boolean, toggleHighContrast: Function }
 */
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('highContrast');
    if (saved !== null) {
      return saved === 'true';
    }

    // Fallback to system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-contrast: more)').matches;
    }

    return false;
  });

  useEffect(() => {
    // Apply data-contrast attribute to document root
    if (isHighContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }

    // Persist to localStorage
    localStorage.setItem('highContrast', isHighContrast);
  }, [isHighContrast]);

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  return { isHighContrast, toggleHighContrast };
}
