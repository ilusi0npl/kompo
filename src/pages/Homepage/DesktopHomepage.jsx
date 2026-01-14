import { useEffect } from 'react';
import { Link } from 'react-router';
import { useScrollSlides } from './useScrollSlides';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import SmoothSlideshow from '../../components/SmoothImage/SmoothSlideshow';
import {
  desktopSlides,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './slides-config';

const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Map slide words to translation keys
const slideTranslationKeys = ['trio', 'kompo', 'polex', 'ensemble'];

export default function DesktopHomepage() {
  const { currentSlide } = useScrollSlides(desktopSlides.length);
  const currentData = desktopSlides[currentSlide];
  const { t } = useTranslation();

  // Sync background and line colors with CSS variables for ResponsiveWrapper
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', currentData.backgroundColor);
    document.documentElement.style.setProperty('--line-color', currentData.lineColor);
  }, [currentData.backgroundColor, currentData.lineColor]);

  return (
    <section
      data-section="hero"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: currentData.backgroundColor,
        transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
      }}
    >
      {/* Pionowe linie dekoracyjne - wysokość 200% żeby pokryć cały viewport po skalowaniu */}
      {[155, 375, 595, 815, 1035, 1255].map((x) => (
        <div
          key={x}
          className="absolute top-0"
          style={{
            left: `${x}px`,
            width: '1px',
            height: '200%',
            backgroundColor: currentData.lineColor,
            transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
          }}
        />
      ))}

      {/* Logo - wszystkie renderowane, CSS transition na opacity */}
      {desktopSlides.map((slide, index) => (
        <Link to="/" key={slide.id}>
          <img
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
        </Link>
      ))}

      {/* Główne zdjęcie - crossfade z smooth loading */}
      <SmoothSlideshow
        slides={desktopSlides}
        currentSlide={currentSlide}
        className="absolute"
        containerStyle={{
          left: '185px',
          top: '180px',
          width: '740px',
          height: '420px',
        }}
        placeholderColor={currentData.backgroundColor}
        transitionDuration={TRANSITION_DURATION}
        transitionEasing={TRANSITION_EASING}
        getImageSrc={(slide) => slide.image}
      />

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
          {t(`homepage.slides.${slideTranslationKeys[index]}.tagline`)}
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
        {/* Language Toggle */}
        <LanguageToggle
          textColor={currentData.textColor}
          transition={`${TRANSITION_DURATION} ${TRANSITION_EASING}`}
        />

        {/* Menu items */}
        <nav
          className="absolute flex flex-col"
          style={{
            top: '308px',
            left: '0',
            gap: '22px',
          }}
        >
          {[
            { key: 'bio', href: '/bio', isRoute: true },
            { key: 'media', href: '/media', isRoute: true },
            { key: 'kalendarz', href: '/kalendarz', isRoute: true },
            { key: 'repertuar', href: '/repertuar', isRoute: true },
            { key: 'fundacja', href: '/fundacja', isRoute: true },
            { key: 'kontakt', href: '/kontakt', isRoute: true },
          ].map((item) =>
            item.isRoute ? (
              <Link
                key={item.key}
                to={item.href}
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
                {t(`common.nav.${item.key}`)}
              </Link>
            ) : (
              <a
                key={item.key}
                href={item.href}
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
                {t(`common.nav.${item.key}`)}
              </a>
            )
          )}
        </nav>
      </div>
    </section>
  );
}
