import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopBio from './DesktopBio';
import MobileBio from './MobileBio';
import { DESKTOP_HEIGHT, desktopBioSlides, mobileBioSlides, mobileLinePositions, MOBILE_WIDTH } from './bio-config';
import BioFixedLayer from './BioFixedLayer';

const DESKTOP_WIDTH = 1440;
const BREAKPOINT = 768;

const TRANSITION_DURATION = '0.6s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

export default function Bio() {
  // Total height: sum of all section heights (3×700px + 1×850px)
  const totalDesktopHeight = desktopBioSlides.reduce((sum, slide) => sum + (slide.height || DESKTOP_HEIGHT), 0);

  // Track current colors for fixed elements (desktop uses desktopBioSlides, mobile uses mobileBioSlides)
  const [currentColors, setCurrentColors] = useState(desktopBioSlides[0]);
  const [mobileColors, setMobileColors] = useState(mobileBioSlides[0]);

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
  const desktopScale = viewportWidth / DESKTOP_WIDTH;
  const mobileScale = viewportWidth / MOBILE_WIDTH;

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

      {/* Mobile fixed background with transition */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: mobileColors.backgroundColor,
            transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            zIndex: 0,
          }}
        />
      )}

      {/* Mobile fixed vertical lines */}
      {isMobile && mobileLinePositions.map((left, index) => (
        <div
          key={`mobile-line-${index}`}
          style={{
            position: 'fixed',
            top: 0,
            left: `${left * mobileScale}px`,
            width: '1px',
            height: '100vh',
            backgroundColor: mobileColors.lineColor,
            transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            zIndex: 1,
          }}
        />
      ))}

      {/* Fixed layer - lines and UI - outside ResponsiveWrapper so position:fixed works */}
      {!isMobile && <BioFixedLayer currentColors={currentColors} scale={desktopScale} />}

      <ResponsiveWrapper
        desktopContent={<DesktopBio setCurrentColors={setCurrentColors} />}
        mobileContent={<MobileBio setCurrentColors={setMobileColors} />}
        desktopHeight={totalDesktopHeight}
        mobileHeight="auto"
        hideLines={true}
      />
    </>
  );
}
