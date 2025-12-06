import { useState, useEffect } from 'react';

// Wymiary z Figma
const DESKTOP_WIDTH = 1440;
const MOBILE_WIDTH = 390;
const BREAKPOINT = 768;

// Pozycje linii z Figma (te same dla wszystkich stron desktop)
const DESKTOP_LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const MOBILE_LINE_POSITIONS = [97, 195, 292];

export default function ResponsiveWrapper({
  desktopContent,
  mobileContent,
  desktopHeight = 700,
  mobileHeight = 683,
  backgroundColor = null,
  lineColor = null,
}) {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : DESKTOP_WIDTH,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const viewportWidth = viewport.width;
  const viewportHeight = viewport.height;

  const isMobile = viewportWidth <= BREAKPOINT;

  // Calculate scale factor
  const baseWidth = isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;
  const baseHeight = isMobile ? mobileHeight : desktopHeight;
  const scale = viewportWidth / baseWidth;
  const scaledHeight = baseHeight * scale;

  // Determine background and line colors
  const bgColor = backgroundColor || 'var(--page-bg, transparent)';
  const lnColor = lineColor || 'var(--line-color, transparent)';

  // Get line positions for current mode
  const linePositions = isMobile ? MOBILE_LINE_POSITIONS : DESKTOP_LINE_POSITIONS;

  // Generuj CSS gradient dla linii - linie są częścią tła, więc są idealnie wyrównane
  const lineGradients = linePositions.map(pos => {
    const scaledPos = pos * scale;
    return `linear-gradient(to right, transparent ${scaledPos}px, ${lnColor} ${scaledPos}px, ${lnColor} ${scaledPos + 1}px, transparent ${scaledPos + 1}px)`;
  }).join(', ');

  return (
    <div
      style={{
        width: '100%',
        height: `${Math.max(scaledHeight, viewportHeight)}px`,
        background: `${lineGradients}, ${bgColor}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Skalowana treść */}
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
