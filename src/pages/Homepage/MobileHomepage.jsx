import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useScrollSlides } from './useScrollSlides';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import {
  mobileSlides,
  mobileLinePositions,
  MOBILE_WIDTH,
  MOBILE_HEIGHT,
} from './slides-config';

const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

export default function MobileHomepage() {
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const menuParam = searchParams.get('menu');
    if (menuParam === 'open') {
      setIsMenuOpen(true);
    }
  }, [searchParams]);
  const { currentSlide } = useScrollSlides(mobileSlides.length);
  const currentData = mobileSlides[currentSlide];

  return (
    <section
      data-section="hero-mobile"
      className="relative overflow-hidden"
      style={{
        width: `${MOBILE_WIDTH}px`,
        height: `${MOBILE_HEIGHT}px`,
        backgroundColor: currentData.backgroundColor,
        transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
      }}
    >
      {/* Zielone pionowe linie w tle */}
      {mobileLinePositions.map((left, index) => (
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

      {/* Logo - wszystkie preloadowane, CSS transition na opacity */}
      {mobileSlides.map((slide, index) => (
        <Link to="/" key={slide.id}>
          <img
            src={slide.logoSrc}
            alt="Kompopolex"
            className="absolute"
            style={{
              left: '20px',
              top: '40px',
              width: '104px',
              height: '42px',
              opacity: index === currentSlide ? 1 : 0,
              transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
              pointerEvents: index === currentSlide ? 'auto' : 'none',
            }}
          />
        </Link>
      ))}

      {/* MENU button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="absolute"
        style={{
          left: '312px',
          top: '43px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: 'normal',
          color: currentData.textColor,
          transition: `color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        MENU
      </button>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Główne zdjęcie - crossfade */}
      <div
        className="absolute"
        style={{
          left: '20px',
          top: '152px',
          width: '350px',
          height: '288px',
          overflow: 'hidden',
        }}
      >
        {mobileSlides.map((slide, index) => (
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

      {/* Słowo (Trio/Kompo/Polex/Ensemble) - obrócone */}
      {mobileSlides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute"
          style={{
            left: '30px',
            top: '460px',
            width: '49px',
            height: '149px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            opacity: index === currentSlide ? 1 : 0,
            transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            pointerEvents: index === currentSlide ? 'auto' : 'none',
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '44px',
              lineHeight: 1,
              color: slide.textColor,
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              whiteSpace: 'nowrap',
            }}
          >
            {slide.word}
          </p>
        </div>
      ))}

      {/* Tekst tagline */}
      {mobileSlides.map((slide, index) => (
        <p
          key={slide.id}
          className="absolute"
          style={{
            left: '185px',
            top: '460px',
            width: '185px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '16px',
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
    </section>
  );
}
