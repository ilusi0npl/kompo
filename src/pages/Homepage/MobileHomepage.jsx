import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useScrollSlides } from './useScrollSlides';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothSlideshow from '../../components/SmoothImage/SmoothSlideshow';
import {
  mobileSlides,
  mobileLinePositions,
  MOBILE_WIDTH,
  MOBILE_HEIGHT,
} from './slides-config';

const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// High contrast line color for accessibility
const HIGH_CONTRAST_LINE_COLOR = '#131313';

export default function MobileHomepage() {
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  const { t } = useTranslation();

  // Track high contrast mode for line color override
  const [isHighContrast, setIsHighContrast] = useState(() =>
    typeof document !== 'undefined' && document.body.classList.contains('high-contrast')
  );

  useEffect(() => {
    const menuParam = searchParams.get('menu');
    if (menuParam === 'open') {
      setIsMenuOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for high contrast mode changes
  useEffect(() => {
    const checkHighContrast = () => {
      setIsHighContrast(document.body.classList.contains('high-contrast'));
    };

    // Initial check
    checkHighContrast();

    // Watch for class changes on body
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          checkHighContrast();
        }
      }
    });
    observer.observe(document.body, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const { currentSlide } = useScrollSlides(mobileSlides.length);
  const currentData = mobileSlides[currentSlide];

  // Use high contrast line color when enabled, otherwise use slide color
  const lineColor = isHighContrast ? HIGH_CONTRAST_LINE_COLOR : currentData.lineColor;

  // Oblicz skalę i minimalną wysokość żeby pokryć cały viewport
  const scale = typeof window !== 'undefined' ? window.innerWidth / MOBILE_WIDTH : 1;
  const minHeight = Math.max(MOBILE_HEIGHT, viewportHeight / scale);

  return (
    <section
      data-section="hero-mobile"
      className="relative overflow-hidden"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: `${minHeight}px`,
        backgroundColor: currentData.backgroundColor,
        transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
      }}
    >
      {/* Zielone pionowe linie w tle */}
      {mobileLinePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0 decorative-line"
          style={{
            left: `${left}px`,
            width: '1px',
            height: '100%',
            backgroundColor: lineColor,
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

      {/* Główne zdjęcie - crossfade z smooth loading */}
      <SmoothSlideshow
        slides={mobileSlides}
        currentSlide={currentSlide}
        className="absolute"
        containerStyle={{
          left: '20px',
          top: '152px',
          width: '350px',
          height: '288px',
        }}
        placeholderColor={currentData.backgroundColor}
        transitionDuration={TRANSITION_DURATION}
        transitionEasing={TRANSITION_EASING}
        getImageSrc={(slide) => slide.image}
      />

      {/* Słowo (Trio/Kompo/Polex/Ensemble) - SVG z Figma */}
      {mobileSlides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.wordSvg}
          alt={slide.word}
          className="absolute"
          style={{
            left: '30px',
            top: '460px',
            width: `${slide.wordWidth}px`,
            height: `${slide.wordHeight}px`,
            opacity: index === currentSlide ? 1 : 0,
            transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            pointerEvents: index === currentSlide ? 'auto' : 'none',
          }}
        />
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
          {t(`homepage.slides.${slide.word.toLowerCase()}.tagline`)}
        </p>
      ))}
    </section>
  );
}
