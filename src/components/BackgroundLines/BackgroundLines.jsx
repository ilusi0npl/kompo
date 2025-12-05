export default function BackgroundLines() {
  // Pozycje pionowych linii z Figma (dla 1440px szerokości)
  const linePositions = [155, 375, 595, 815, 1035, 1255];

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {linePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0 h-full"
          style={{
            left: `${left}px`,
            width: '1px',
            backgroundColor: '#A0E38A'
          }}
        />
      ))}
    </div>
  );
}
