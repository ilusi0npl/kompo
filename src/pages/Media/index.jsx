import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopMedia from './DesktopMedia';
import MobileMedia from './MobileMedia';
import MediaFixedLayer from './MediaFixedLayer';

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 1043;
const BREAKPOINT = 768;

export default function Media() {
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
        <MediaFixedLayer
          scale={scale}
          viewportHeight={window.innerHeight}
          isPhotosActive={true}
        />
      )}

      <ResponsiveWrapper
        desktopContent={<DesktopMedia />}
        mobileContent={<MobileMedia />}
        desktopHeight={DESKTOP_HEIGHT}
        mobileHeight="auto"
        backgroundColor="#34B898"
        lineColor="#01936F"
        hideLines={!isMobile}
      />
    </>
  );
}
