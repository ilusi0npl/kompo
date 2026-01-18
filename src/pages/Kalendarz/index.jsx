import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopKalendarz from './DesktopKalendarz';
import MobileKalendarz from './MobileKalendarz';
import KalendarzFixedLayer from './KalendarzFixedLayer';

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 2008;
const BREAKPOINT = 768;

export default function Kalendarz() {
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
      {/* Fixed layer - background, lines, and UI - outside ResponsiveWrapper */}
      {!isMobile && (
        <KalendarzFixedLayer
          scale={scale}
          viewportHeight={window.innerHeight}
        />
      )}

      <ResponsiveWrapper
        desktopContent={<DesktopKalendarz />}
        mobileContent={<MobileKalendarz />}
        desktopHeight="auto"
        mobileHeight="auto"
        backgroundColor="var(--contrast-bg)"
        lineColor="var(--contrast-line)"
        hideLines={!isMobile}
      />
    </>
  );
}
