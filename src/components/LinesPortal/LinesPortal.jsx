import { createPortal } from 'react-dom';

/**
 * Renders children to #lines-root portal.
 * This keeps decorative elements (full-page backgrounds and lines) BELOW content,
 * while still being outside the high-contrast filtered #root.
 *
 * Lines do NOT get the high-contrast filter applied - they maintain their original
 * colors to remain visible against the filtered background.
 */
export default function LinesPortal({ children }) {
  if (typeof document === 'undefined') {
    return null;
  }

  const linesRoot = document.getElementById('lines-root');
  if (!linesRoot) {
    // Fallback: render inline if portal root doesn't exist
    return children;
  }

  // Render children directly without wrapper - no filter applied
  return createPortal(children, linesRoot);
}
