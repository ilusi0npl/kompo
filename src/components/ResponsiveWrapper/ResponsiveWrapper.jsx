import { useState, useEffect, useRef } from 'react';

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
  mobileHeight = 'auto',
  backgroundColor = null,
  lineColor = null,
  hideLines = false,
}) {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : DESKTOP_WIDTH,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

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

  // Measure actual content height for auto mode
  useEffect(() => {
    if (contentRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContentHeight(entry.contentRect.height);
        }
      });
      observer.observe(contentRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const viewportWidth = viewport.width;
  const viewportHeight = viewport.height;

  const isMobile = viewportWidth <= BREAKPOINT;

  // Calculate scale factor
  const baseWidth = isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;
  const scale = viewportWidth / baseWidth;

  // Handle height values
  const rawBaseHeight = isMobile ? mobileHeight : desktopHeight;
  const isAuto = rawBaseHeight === 'auto';
  const isFullViewport = rawBaseHeight === '100vh';

  let baseHeight;
  let scaledHeight;

  if (isAuto) {
    // Use measured content height
    baseHeight = contentHeight || viewportHeight / scale;
    scaledHeight = contentHeight * scale || viewportHeight;
  } else if (isFullViewport) {
    baseHeight = viewportHeight / scale;
    scaledHeight = viewportHeight;
  } else {
    baseHeight = rawBaseHeight;
    scaledHeight = baseHeight * scale;
  }

  // Determine background and line colors
  const bgColor = backgroundColor || 'var(--page-bg, transparent)';
  const lnColor = lineColor || 'var(--line-color, transparent)';

  // Get line positions for current mode
  const linePositions = isMobile ? MOBILE_LINE_POSITIONS : DESKTOP_LINE_POSITIONS;

  // Generuj CSS gradient dla linii - linie są częścią tła, więc są idealnie wyrównane
  const lineGradients = hideLines ? '' : linePositions.map(pos => {
    const scaledPos = pos * scale;
    return `linear-gradient(to right, transparent ${scaledPos}px, ${lnColor} ${scaledPos}px, ${lnColor} ${scaledPos + 1}px, transparent ${scaledPos + 1}px)`;
  }).join(', ');

  return (
    <div
      style={{
        width: '100%',
        minHeight: `${Math.max(scaledHeight, viewportHeight)}px`,
        height: isAuto ? 'auto' : `${Math.max(scaledHeight, viewportHeight)}px`,
        background: hideLines ? bgColor : `${lineGradients}, ${bgColor}`,
        transition: 'background-color 1s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: isAuto ? 'visible' : 'hidden',
      }}
    >
      {/* Skalowana treść */}
      <div
        ref={contentRef}
        style={{
          width: `${baseWidth}px`,
          height: isAuto ? 'auto' : (isFullViewport ? `${baseHeight}px` : 'auto'),
          minHeight: isAuto ? undefined : (isFullViewport ? undefined : `${baseHeight}px`),
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 1,
        }}
      >
        {isMobile ? mobileContent : desktopContent}
      </div>
    </div>
  );
}
