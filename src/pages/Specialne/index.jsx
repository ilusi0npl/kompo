import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopSpecjalne from './DesktopSpecjalne';
import MobileSpecjalne from './MobileSpecjalne';
import SpecjalneFixedLayer from './SpecjalneFixedLayer';

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 827;
const BREAKPOINT = 768;

export default function Specialne() {
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
        <SpecjalneFixedLayer
          scale={scale}
          viewportHeight={window.innerHeight}
        />
      )}

      <ResponsiveWrapper
        desktopContent={<DesktopSpecjalne />}
        mobileContent={<MobileSpecjalne />}
        desktopHeight={DESKTOP_HEIGHT}
        mobileHeight={1264}
        backgroundColor="#FDFDFD"
        lineColor="#A0E38A"
        hideLines={!isMobile}
      />
    </>
  );
}
