import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopFundacja from './DesktopFundacja';
import MobileFundacja from './MobileFundacja';
import FundacjaFixedLayer from './FundacjaFixedLayer';

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 1379;
const BREAKPOINT = 768;

export default function Fundacja() {
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
        <FundacjaFixedLayer
          scale={scale}
          viewportHeight={window.innerHeight}
        />
      )}

      <ResponsiveWrapper
        desktopContent={<DesktopFundacja />}
        mobileContent={<MobileFundacja />}
        desktopHeight={DESKTOP_HEIGHT}
        mobileHeight="auto"
        backgroundColor="#34B898"
        lineColor="#01936F"
        hideLines={!isMobile}
      />
    </>
  );
}
