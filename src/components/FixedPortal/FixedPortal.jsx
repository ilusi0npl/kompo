import { createPortal } from 'react-dom';

/**
 * Renders children to #fixed-root portal.
 * This keeps fixed positioned elements outside the high-contrast filtered #root,
 * ensuring position: fixed works correctly relative to viewport.
 */
export default function FixedPortal({ children }) {
  if (typeof document === 'undefined') {
    return null;
  }

  const fixedRoot = document.getElementById('fixed-root');
  if (!fixedRoot) {
    // Fallback: render inline if portal root doesn't exist
    return children;
  }

  return createPortal(children, fixedRoot);
}
