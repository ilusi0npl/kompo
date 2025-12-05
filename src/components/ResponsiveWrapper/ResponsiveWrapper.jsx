import { useState, useEffect } from 'react';

// Wymiary z Figma
const DESKTOP_WIDTH = 1440;
const MOBILE_WIDTH = 390;
const BREAKPOINT = 768;

export default function ResponsiveWrapper({
  desktopContent,
  mobileContent,
  desktopHeight = 700,
  mobileHeight = 683,
}) {
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

  // Calculate scale factor
  const baseWidth = isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;
  const baseHeight = isMobile ? mobileHeight : desktopHeight;
  const scale = viewportWidth / baseWidth;

  // Calculate scaled height for container
  const scaledHeight = baseHeight * scale;

  return (
    <div
      style={{
        width: '100%',
        height: `${scaledHeight}px`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        {isMobile ? mobileContent : desktopContent}
      </div>
    </div>
  );
}
