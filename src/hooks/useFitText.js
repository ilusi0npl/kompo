import { useRef, useState, useLayoutEffect } from 'react';

/**
 * Hook that auto-fits text to a single line by shrinking font size.
 * Uses a single ratio calculation (no iterative loop) to compute the ideal size.
 *
 * The element must have a constrained width (maxWidth, width, or flex constraints)
 * and whiteSpace: 'nowrap' in its JSX styles for this to work correctly.
 *
 * @param {number} maxFontSize - The default font size when text fits naturally
 * @returns {[React.RefObject, number]} - [ref to attach to the text element, computed font size]
 */
export default function useFitText(maxFontSize) {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !el.textContent) {
      setFontSize(maxFontSize);
      return;
    }

    // Measure at max size to determine if shrinking is needed
    el.style.fontSize = maxFontSize + 'px';
    el.style.whiteSpace = 'nowrap';

    const scrollW = el.scrollWidth;
    const clientW = el.clientWidth;

    let fitted = maxFontSize;
    if (scrollW > clientW && clientW > 0) {
      fitted = Math.max(Math.floor(maxFontSize * (clientW / scrollW)), 8);
    }

    // Apply final font size directly — React will reconcile on next render
    el.style.fontSize = fitted + 'px';

    setFontSize(fitted);
  });

  return [ref, fontSize];
}
