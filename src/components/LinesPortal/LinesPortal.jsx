import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

/**
 * Renders children to #lines-root portal.
 * This keeps decorative elements (full-page backgrounds and lines) BELOW content,
 * while still being outside the high-contrast filtered #root.
 *
 * Applies high-contrast filter via JavaScript for cross-browser compatibility.
 */
export default function LinesPortal({ children }) {
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Watch for high-contrast class changes on body
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Check initial state
    setIsHighContrast(document.body.classList.contains('high-contrast'));

    // Watch for class changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsHighContrast(document.body.classList.contains('high-contrast'));
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Apply filter directly to #lines-root element when high-contrast is active
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const linesRoot = document.getElementById('lines-root');
    if (linesRoot) {
      linesRoot.style.filter = isHighContrast ? 'contrast(1.5) grayscale(1)' : 'none';
    }
  }, [isHighContrast]);

  if (typeof document === 'undefined') {
    return null;
  }

  const linesRoot = document.getElementById('lines-root');
  if (!linesRoot) {
    // Fallback: render inline if portal root doesn't exist
    return children;
  }

  // Render children directly without wrapper
  return createPortal(children, linesRoot);
}
