import { useScrollSlides } from './useScrollSlides';
import {
  desktopSlides,
  desktopLinePositions,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './slides-config';

const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

export default function DesktopHomepage() {
  const { currentSlide } = useScrollSlides(desktopSlides.length);
  const currentData = desktopSlides[currentSlide];

  return (
    <section
      data-section="hero"
      className="relative overflow-hidden"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: currentData.backgroundColor,
        transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
      }}
    >
      {/* Zielone pionowe linie w tle */}
      {desktopLinePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0"
          style={{
            left: `${left}px`,
            width: '1px',
            height: '100%',
            backgroundColor: currentData.lineColor,
          }}
        />
      ))}

      {/* Logo - wszystkie renderowane, CSS transition na opacity */}
      {desktopSlides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.logoSrc}
          alt="Kompopolex"
          className="absolute"
          style={{
            left: '185px',
            top: '60px',
            width: '149px',
            height: '60px',
            opacity: index === currentSlide ? 1 : 0,
            transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            pointerEvents: index === currentSlide ? 'auto' : 'none',
          }}
        />
      ))}

      {/* Główne zdjęcie - crossfade */}
      <div
        className="absolute"
        style={{
          left: '185px',
          top: '180px',
          width: '740px',
          height: '420px',
          overflow: 'hidden',
        }}
      >
        {desktopSlides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            }}
          />
        ))}
      </div>

      {/* Tekst tagline */}
      {desktopSlides.map((slide, index) => (
        <p
          key={slide.id}
          className="absolute"
          style={{
            left: `${slide.taglineX}px`,
            top: '613px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: 1.48,
            color: slide.textColor,
            opacity: index === currentSlide ? 1 : 0,
            transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            pointerEvents: index === currentSlide ? 'auto' : 'none',
          }}
        >
          {slide.tagline}
        </p>
      ))}

      {/* Tekst słowa (Trio/Kompo/Polex/Ensemble) - SVG z Figma */}
      {desktopSlides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.wordSvg}
          alt={slide.word}
          className="absolute"
          style={{
            left: '94px',
            top: `${slide.wordY}px`,
            width: `${slide.wordWidth}px`,
            height: `${slide.wordHeight}px`,
            opacity: index === currentSlide ? 1 : 0,
            transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            pointerEvents: index === currentSlide ? 'auto' : 'none',
          }}
        />
      ))}

      {/* Prawa nawigacja */}
      <div
        className="absolute"
        style={{
          left: '1265px',
          top: '60px',
          width: '100px',
        }}
      >
        {/* ENG */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: 1.44,
            color: currentData.textColor,
            textTransform: 'uppercase',
            transition: `color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
          }}
        >
          ENG
        </p>

        {/* Menu items */}
        <nav
          className="absolute flex flex-col"
          style={{
            top: '308px',
            left: '0',
            gap: '22px',
          }}
        >
          {['Bio', 'Media', 'Kalendarz', 'Repertuar', 'Fundacja', 'Kontakt'].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.48,
                  color: currentData.textColor,
                  textDecoration: 'none',
                  transition: `color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
                }}
              >
                {item}
              </a>
            )
          )}
        </nav>
      </div>
    </section>
  );
}
