export default function MobileHomepage() {
  // Pozycje pionowych linii z Figma mobile (dla 390px szerokości)
  // x=97, x=195, x=292
  const linePositions = [97, 195, 292];

  return (
    <section
      data-section="hero-mobile"
      className="relative overflow-hidden"
      style={{
        width: '390px',
        height: '683px',
        backgroundColor: '#FDFDFD'
      }}
    >
      {/* Zielone pionowe linie w tle */}
      {linePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0"
          style={{
            left: `${left}px`,
            width: '1px',
            height: '100%',
            backgroundColor: '#A0E38A'
          }}
        />
      ))}

      {/* Logo - pozycja z Figma: x=20, y=40, w=104, h=42 */}
      <img
        src="/assets/mobile/logo.svg"
        alt="Kompopolex"
        className="absolute"
        style={{
          left: '20px',
          top: '40px',
          width: '104px',
          height: '42px'
        }}
      />

      {/* MENU - pozycja z Figma: x=312, y=43 */}
      <p
        className="absolute"
        style={{
          left: '312px',
          top: '43px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: 'normal',
          color: '#131313'
        }}
      >
        MENU
      </p>

      {/* Glowne zdjecie - pozycja z Figma: x=20, y=152, w=350, h=288 */}
      <img
        src="/assets/mobile/hero-photo.jpg"
        alt="Trio Kompopolex"
        className="absolute object-cover"
        style={{
          left: '20px',
          top: '152px',
          width: '350px',
          height: '288px'
        }}
      />

      {/* Trio SVG - pozycja z Figma: x=30, y=460, w=49, h=149 */}
      <img
        src="/assets/mobile/trio.svg"
        alt="Trio"
        className="absolute"
        style={{
          left: '30px',
          top: '460px',
          width: '49px',
          height: '149px'
        }}
      />

      {/* Tekst - x=185, y=460, w=185 */}
      <p
        className="absolute"
        style={{
          left: '185px',
          top: '460px',
          width: '185px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: 1.48,
          color: '#131313'
        }}
      >
        specjalizuj&#261;ce si&#281; w muzyce najnowszej
      </p>
    </section>
  );
}
