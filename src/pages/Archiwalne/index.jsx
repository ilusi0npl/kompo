import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopArchiwalne from './DesktopArchiwalne';
import MobileArchiwalne from './MobileArchiwalne';
import ArchiwalneFixedLayer from './ArchiwalneFixedLayer';

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 1792;
const BREAKPOINT = 768;

export default function Archiwalne() {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : DESKTOP_WIDTH
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = viewportWidth <= BREAKPOINT;
  const scale = viewportWidth / DESKTOP_WIDTH;

  return (
    <>
      {/* Fixed layer - background, lines, and UI */}
      {!isMobile && (
        <ArchiwalneFixedLayer
          scale={scale}
          viewportHeight={window.innerHeight}
        />
      )}

      <ResponsiveWrapper
        desktopContent={<DesktopArchiwalne />}
        mobileContent={<MobileArchiwalne />}
        desktopHeight="auto"
        mobileHeight="auto"
        backgroundColor="var(--contrast-bg)"
        lineColor="var(--contrast-line)"
        hideLines={!isMobile}
      />
    </>
  );
}
