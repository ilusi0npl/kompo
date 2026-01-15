import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopBio from './DesktopBio';
import MobileBio from './MobileBio';
import { DESKTOP_HEIGHT, desktopBioSlides } from './bio-config';
import BioFixedLayer from './BioFixedLayer';

const DESKTOP_WIDTH = 1440;
const BREAKPOINT = 768;

export default function Bio() {
  // Total height: 4 sections × 700px each
  const totalDesktopHeight = desktopBioSlides.length * DESKTOP_HEIGHT;

  // Track current colors for fixed elements
  const [currentColors, setCurrentColors] = useState(desktopBioSlides[0]);

  // Track viewport width for scale calculation
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
      {/* Fixed layer - outside ResponsiveWrapper so position:fixed works */}
      {!isMobile && <BioFixedLayer currentColors={currentColors} scale={scale} />}

      <ResponsiveWrapper
        desktopContent={<DesktopBio setCurrentColors={setCurrentColors} />}
        mobileContent={<MobileBio />}
        desktopHeight={totalDesktopHeight}
        mobileHeight="auto"
        hideLines={true}
      />
    </>
  );
}
