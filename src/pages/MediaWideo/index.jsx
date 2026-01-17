import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopMediaWideo from './DesktopMediaWideo';
import MobileMediaWideo from './MobileMediaWideo';
import MediaWideoFixedLayer from './MediaWideoFixedLayer';

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 1175;
const BREAKPOINT = 768;

export default function MediaWideo() {
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
        <MediaWideoFixedLayer
          scale={scale}
          viewportHeight={window.innerHeight}
        />
      )}

      <ResponsiveWrapper
        desktopContent={<DesktopMediaWideo />}
        mobileContent={<MobileMediaWideo />}
        desktopHeight="auto"
        mobileHeight="auto"
        backgroundColor="#73A1FE"
        lineColor="#3478FF"
        hideLines={!isMobile}
      />
    </>
  );
}
