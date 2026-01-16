import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopRepertuar from './DesktopRepertuar';
import MobileRepertuar from './MobileRepertuar';
import RepertuarFixedLayer from './RepertuarFixedLayer';

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 1285;
const BREAKPOINT = 768;

export default function Repertuar() {
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
        <RepertuarFixedLayer
          scale={scale}
          viewportHeight={window.innerHeight}
        />
      )}

      <ResponsiveWrapper
        desktopContent={<DesktopRepertuar />}
        mobileContent={<MobileRepertuar />}
        desktopHeight={DESKTOP_HEIGHT}
        mobileHeight={2507}
        backgroundColor="#FDFDFD"
        lineColor="#A0E38A"
        hideLines={!isMobile}
      />
    </>
  );
}
