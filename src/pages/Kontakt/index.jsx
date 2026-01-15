import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopKontakt from './DesktopKontakt';
import MobileKontakt from './MobileKontakt';
import KontaktFixedLayer from './KontaktFixedLayer';

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 847;
const BREAKPOINT = 768;

export default function Kontakt() {
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
        <KontaktFixedLayer
          scale={scale}
          viewportHeight={window.innerHeight}
        />
      )}

      <ResponsiveWrapper
        desktopContent={<DesktopKontakt />}
        mobileContent={<MobileKontakt />}
        desktopHeight={DESKTOP_HEIGHT}
        mobileHeight={1071}
        backgroundColor="#FF734C"
        lineColor="#FFBD19"
        hideLines={!isMobile}
      />
    </>
  );
}
