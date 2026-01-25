import { useEffect } from 'react';

const HIGH_CONTRAST_BG = '#FDFDFD';
const HIGH_CONTRAST_LINE_COLOR = '#131313';

// Store original line colors to restore when disabling high contrast
const originalLineColors = new WeakMap();

/**
 * Force decorative lines to be dark in high contrast mode.
 * This is needed because CSS !important sometimes doesn't override
 * inline styles set by React components.
 *
 * IMPORTANT: We store the original color before overwriting so we can
 * restore it when high contrast is disabled. Using removeProperty()
 * would break React's inline styles.
 */
function forceDecorativeLinesDark() {
  const isHighContrast = document.body.classList.contains('high-contrast');
  const lines = document.querySelectorAll('.decorative-line');

  lines.forEach((line) => {
    if (isHighContrast) {
      // Store original color before overwriting (only if not already stored)
      if (!originalLineColors.has(line)) {
        const originalColor = line.style.backgroundColor ||
          getComputedStyle(line).backgroundColor;
        originalLineColors.set(line, originalColor);
      }
      line.style.setProperty('background-color', HIGH_CONTRAST_LINE_COLOR, 'important');
    } else {
      // Restore original color if we have it stored
      const originalColor = originalLineColors.get(line);
      if (originalColor) {
        line.style.backgroundColor = originalColor;
        originalLineColors.delete(line);
      }
    }
  });
}

/**
 * Force page background to white in high contrast mode.
 * Some pages (like BioEnsemble) set colored backgrounds via --page-bg CSS variable.
 * We need to override this in high contrast mode for proper accessibility.
 */
function forcePageBackgroundWhite() {
  const isHighContrast = document.body.classList.contains('high-contrast');

  if (isHighContrast) {
    // Override the CSS variable on documentElement (html)
    document.documentElement.style.setProperty('--page-bg', HIGH_CONTRAST_BG);
    document.body.style.setProperty('background-color', HIGH_CONTRAST_BG, 'important');
  } else {
    // Remove forced styles - let page components control the background
    document.body.style.removeProperty('background-color');
    // Note: We don't remove --page-bg as pages will set it themselves
  }
}

/**
 * Hook to initialize high contrast mode from localStorage on app load.
 * This ensures high contrast is restored even on mobile where ContrastToggle
 * might not be mounted (e.g., inside closed MobileMenu).
 *
 * Also sets up a MutationObserver to force decorative lines to be dark
 * when high contrast mode is enabled.
 */
export function useHighContrastInit() {
  useEffect(() => {
    const saved = localStorage.getItem('highContrast');
    if (saved === 'true') {
      document.body.classList.add('high-contrast');
    }

    // Initial update
    forceDecorativeLinesDark();
    forcePageBackgroundWhite();

    // Watch for class changes on body (high contrast toggle)
    const bodyObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          forceDecorativeLinesDark();
          forcePageBackgroundWhite();
        }
      }
    });
    bodyObserver.observe(document.body, { attributes: true });

    // Watch for new decorative-line elements being added
    const domObserver = new MutationObserver(() => {
      forceDecorativeLinesDark();
    });
    domObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      bodyObserver.disconnect();
      domObserver.disconnect();
    };
  }, []);
}
