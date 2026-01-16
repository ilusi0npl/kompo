// Hook for scroll-based color detection
// Detects which section is in viewport center and returns its color data
import { useState, useEffect } from 'react';

export function useScrollColorChange(sectionsRef, sectionData) {
  const [currentColors, setCurrentColors] = useState(sectionData[0]);

  useEffect(() => {
    const handleScroll = () => {
      // Color change point: middle of viewport
      const scrollPoint = window.scrollY + window.innerHeight / 2;

      // Find which section is at scroll point
      const sections = sectionsRef.current;
      if (!sections || sections.length === 0) return;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section) continue;

        if (
          section.offsetTop <= scrollPoint &&
          section.offsetTop + section.offsetHeight > scrollPoint
        ) {
          // Only update if colors actually changed (prevent infinite loop)
          const newColors = sectionData[i];
          setCurrentColors((prevColors) => {
            if (
              prevColors.backgroundColor === newColors.backgroundColor &&
              prevColors.lineColor === newColors.lineColor &&
              prevColors.textColor === newColors.textColor
            ) {
              return prevColors; // No change, keep previous state
            }
            return newColors;
          });
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionsRef, sectionData]);

  return currentColors;
}

export default useScrollColorChange;
