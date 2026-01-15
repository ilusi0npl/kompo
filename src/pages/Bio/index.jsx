import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopBio from './DesktopBio';
import MobileBio from './MobileBio';
import { DESKTOP_HEIGHT, desktopBioSlides } from './bio-config';
import BioFixedLayer from './BioFixedLayer';

const DESKTOP_WIDTH = 1440;
const BREAKPOINT = 768;

export default function Bio() {
  // Total height: sum of all section heights (3×700px + 1×850px)
  const totalDesktopHeight = desktopBioSlides.reduce((sum, slide) => sum + (slide.height || DESKTOP_HEIGHT), 0);

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
      {/* Fixed background - behind lines */}
      {!isMobile && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: currentColors.backgroundColor,
            transition: 'background-color 1s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 0,
          }}
        />
      )}

      {/* Fixed layer - lines and UI - outside ResponsiveWrapper so position:fixed works */}
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
