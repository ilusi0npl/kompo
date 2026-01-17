import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopWydarzenie from './DesktopWydarzenie';
import MobileWydarzenie from './MobileWydarzenie';
import WydarzenieFixedLayer from './WydarzenieFixedLayer';
import { DESKTOP_HEIGHT } from './wydarzenie-config';

const DESKTOP_WIDTH = 1440;
const BREAKPOINT = 768;
const BACKGROUND_COLOR = '#FDFDFD';

export default function Wydarzenie() {
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
      {/* Fixed background */}
      {!isMobile && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: BACKGROUND_COLOR,
            zIndex: 0,
          }}
        />
      )}

      {/* Fixed layer - lines and UI */}
      {!isMobile && <WydarzenieFixedLayer scale={scale} pageHeight={DESKTOP_HEIGHT} />}

      <ResponsiveWrapper
        desktopContent={<DesktopWydarzenie />}
        mobileContent={<MobileWydarzenie />}
        desktopHeight={DESKTOP_HEIGHT}
        mobileHeight={2500}
        backgroundColor="#FDFDFD"
        lineColor="#A0E38A"
        hideLines={true}
      />
    </>
  );
}
