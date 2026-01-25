export default function BackgroundLines({
  isMobile = false,
  lineColor = '#A0E38A',
  scale = 1
}) {
  // Pozycje pionowych linii z Figma
  // Desktop (1440px): 6 linii
  // Mobile (390px): 3 linie
  const desktopPositions = [155, 375, 595, 815, 1035, 1255];
  const mobilePositions = [97, 195, 292];

  const linePositions = isMobile ? mobilePositions : desktopPositions;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {linePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0 h-full decorative-line"
          style={{
            left: `${left * scale}px`,
            width: '1px',
            backgroundColor: lineColor
          }}
        />
      ))}
    </div>
  );
}
