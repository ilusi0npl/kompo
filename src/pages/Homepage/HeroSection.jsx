export default function HeroSection() {
  // Pozycje pionowych linii z Figma (dla 1440px szerokości)
  const linePositions = [155, 375, 595, 815, 1035, 1255];

  return (
    <section
      data-section="hero"
      className="relative overflow-hidden"
      style={{
        width: '1440px',
        height: '700px',
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

      {/* Logo - pozycja z Figma: x=185, y=60 */}
      <img
        src="/assets/logo.svg"
        alt="Kompopolex"
        className="absolute"
        style={{
          left: '185px',
          top: '60px',
          width: '149px',
          height: '60px'
        }}
      />

      {/* Główne zdjęcie - pozycja z Figma: x=185, y=180, w=740, h=420 */}
      <img
        src="/assets/hero-photo.jpg"
        alt="Trio Kompopolex"
        className="absolute object-cover"
        style={{
          left: '185px',
          top: '180px',
          width: '740px',
          height: '420px'
        }}
      />

      {/* Tekst "specjalizujemy się w muzyce najnowszej" - x=514, y=613 */}
      <p
        className="absolute"
        style={{
          left: '514px',
          top: '613px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: 1.48,
          color: '#131313'
        }}
      >
        specjalizujemy się w muzyce najnowszej
      </p>

      {/* Tekst "Trio" - obrócony, pozycja z Figma: x=139, y=446, w=45, h=154 */}
      {/* Po rotacji -90deg: szerokość staje się wysokością i odwrotnie */}
      {/* Pozycja: left + (width/2) - (height/2) = 139 + 22.5 - 77 = 84.5 */}
      {/* Pozycja: top + (height/2) - (width/2) = 446 + 77 - 22.5 = 500.5 */}
      <p
        className="absolute"
        style={{
          left: '84px',
          top: '523px',
          width: '154px',
          height: '45px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '64px',
          lineHeight: '45px',
          color: '#131313',
          whiteSpace: 'nowrap',
          transform: 'rotate(-90deg)',
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Trio
      </p>

      {/* Prawa nawigacja - x=1265, y=60 */}
      <div
        className="absolute"
        style={{
          left: '1265px',
          top: '60px',
          width: '100px'
        }}
      >
        {/* ENG */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: 1.44,
            color: '#131313',
            textTransform: 'uppercase'
          }}
        >
          ENG
        </p>

        {/* Menu items - start at y=368 relative to nav container (308 from frame top) */}
        <nav
          className="absolute flex flex-col"
          style={{
            top: '308px',
            left: '0',
            gap: '22px'
          }}
        >
          {['Bio', 'Media', 'Kalendarz', 'Repertuar', 'Fundacja', 'Kontakt'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: 1.48,
                color: '#131313',
                textDecoration: 'none'
              }}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
