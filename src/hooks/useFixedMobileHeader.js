import { useState, useEffect } from 'react';

const MOBILE_WIDTH = 390;
const BREAKPOINT = 768;

/**
 * Hook for fixed mobile headers with proper scaling.
 * Calculates scale factor to match ResponsiveWrapper.
 */
export function useFixedMobileHeader() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth <= BREAKPOINT) {
        setScale(viewportWidth / MOBILE_WIDTH);
      } else {
        setScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return { scale, MOBILE_WIDTH, BREAKPOINT };
}

export default useFixedMobileHeader;
