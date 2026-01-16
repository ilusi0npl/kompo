import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopBioEnsemble from './DesktopBioEnsemble';
import MobileBioEnsemble from './MobileBioEnsemble';
import BioFixedLayer from '../Bio/BioFixedLayer';

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 1599;
const BREAKPOINT = 768;

const COLORS = {
  backgroundColor: '#FFBD19',
  lineColor: '#FF734C',
  textColor: '#131313',
  logoSrc: '/assets/logo.svg',
};

export default function BioEnsemble() {
  const [currentColors] = useState(COLORS);

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

      {/* Fixed layer - lines and UI */}
      {!isMobile && <BioFixedLayer currentColors={currentColors} scale={scale} height={DESKTOP_HEIGHT} />}

      <ResponsiveWrapper
        desktopContent={<DesktopBioEnsemble />}
        mobileContent={<MobileBioEnsemble />}
        desktopHeight={DESKTOP_HEIGHT}
        mobileHeight="auto"
        hideLines={true}
        backgroundColor="transparent"
      />
    </>
  );
}
