import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import { useScrollColorChange } from '../../hooks/useScrollColorChange';
import {
  mobileBioSlides,
  mobileLinePositions,
  MOBILE_WIDTH,
} from './bio-config';

// Mapowanie indeksu slajdu na klucz tłumaczenia
const slideTranslationKeys = ['ensemble', 'aleksandra', 'rafal', 'jacek'];

const BREAKPOINT = 768;

const TRANSITION_DURATION = '0.6s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Image styles for each slide (matching desktop cropping)
const mobileImageStyles = [
  // Ensemble - object-cover centered
  { width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' },
  // Aleksandra - from Figma
  { position: 'absolute', width: '342.5%', height: '159.57%', left: '0.75%', top: '-28.91%', maxWidth: 'none' },
  // Rafał - from Figma
  { position: 'absolute', width: '330.37%', height: '153.91%', left: '-101.18%', top: '-13.7%', maxWidth: 'none' },
  // Jacek - from Figma
  { position: 'absolute', width: '301.44%', height: '140.43%', left: '-198.05%', top: '-0.22%', maxWidth: 'none' },
];

// Heights for each mobile slide section
const MOBILE_SLIDE_HEIGHTS = [950, 850, 750, 950];

export default function MobileBio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [linesVisible, setLinesVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const sectionsRef = useRef([]);
  const { t } = useTranslation();

  // Use scroll-based color detection (same as desktop)
  const currentColors = useScrollColorChange(sectionsRef, mobileBioSlides);

  // Calculate scale factor for fixed header (must match ResponsiveWrapper)
  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth <= BREAKPOINT;
      if (isMobile) {
        setScale(viewportWidth / MOBILE_WIDTH);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Animate lines on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLinesVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Preload wszystkich obrazów Bio
  useEffect(() => {
    mobileBioSlides.forEach((slide, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(index));
      };
      img.src = slide.image;
    });
  }, []);

  // Sync background and line colors with CSS variables for ResponsiveWrapper
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', currentColors.backgroundColor);
    document.documentElement.style.setProperty('--line-color', currentColors.lineColor);
  }, [currentColors.backgroundColor, currentColors.lineColor]);

  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Total height: sum of all section heights
  const totalHeight = MOBILE_SLIDE_HEIGHTS.reduce((sum, h) => sum + h, 0);

  return (
    <section
      data-section="bio-mobile"
      className="relative"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: `${totalHeight}px`,
      }}
    >
      {/* Pionowe linie w tle - absolute, pełna wysokość sekcji */}
      {mobileLinePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0"
          style={{
            left: `${left}px`,
            width: '1px',
            height: '100%',
            backgroundColor: currentColors.lineColor,
            opacity: linesVisible ? 1 : 0,
            transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}, opacity 0.8s ${TRANSITION_EASING}`,
          }}
        />
      ))}

      {/* Header z logo i menu - FIXED via portal */}
      {typeof document !== 'undefined' && createPortal(
        <div
          className="fixed top-0 left-0"
          style={{
            width: `${MOBILE_WIDTH}px`,
            height: '281px',
            backgroundColor: currentColors.backgroundColor,
            transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            zIndex: 100,
          }}
        >
          {/* Pionowe linie w FIXED headerze */}
          {mobileLinePositions.map((left, index) => (
            <div
              key={`header-line-${index}`}
              className="absolute top-0"
              style={{
                left: `${left}px`,
                width: '1px',
                height: '281px',
                backgroundColor: currentColors.lineColor,
                opacity: linesVisible ? 1 : 0,
                transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}, opacity 0.8s ${TRANSITION_EASING}`,
              }}
            />
          ))}

          {/* Logo */}
          <Link to="/">
            <img
              src="/assets/logo.svg"
              alt="Kompopolex"
              className="absolute"
              style={{
                left: '20px',
                top: '40px',
                width: '104px',
                height: '42px',
              }}
            />
          </Link>

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
              color: currentColors.textColor,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: `color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            }}
          >
            MENU
          </button>

          {/* Bio - obrócony tekst */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: '45px',
              top: '192px',
              width: '107px',
              height: '49px',
            }}
          >
            <img
              src="/assets/bio/bio-text.svg"
              alt="Bio"
              style={{
                height: '107px',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center center',
              }}
            />
          </div>

          {/* MobileMenu wewnątrz portalu */}
          <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>,
        document.body
      )}

      {/* SCROLLABLE CONTENT - All slides stacked vertically */}
      <div style={{ position: 'relative' }}>
        {mobileBioSlides.map((slide, index) => {
          const translationKey = slideTranslationKeys[index];
          const paragraphs = t(`bio.slides.${translationKey}.paragraphs`);

          return (
            <section
              key={slide.id}
              ref={(el) => (sectionsRef.current[index] = el)}
              data-color={slide.id}
              style={{
                minHeight: `${MOBILE_SLIDE_HEIGHTS[index]}px`,
                position: 'relative',
                width: `${MOBILE_WIDTH}px`,
                backgroundColor: slide.backgroundColor,
                overflow: 'hidden',
              }}
            >
              {/* Spacer for fixed header (only first slide) */}
              {index === 0 && <div style={{ height: '281px' }} />}

              {/* Zdjęcie - 300x460px centered */}
              <div
                className="relative mx-auto"
                style={{
                  width: '300px',
                  height: '460px',
                  overflow: 'hidden',
                  marginTop: index === 0 ? '0' : '60px',
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.name}
                  style={{
                    ...mobileImageStyles[index],
                    opacity: loadedImages.has(index) ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                  }}
                />
              </div>

              {/* Tytuł (imię) */}
              <p
                style={{
                  marginTop: '40px',
                  marginLeft: '20px',
                  width: '350px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: '40px',
                  lineHeight: 1.2,
                  color: slide.textColor,
                }}
              >
                {t(`bio.slides.${translationKey}.name`)}
              </p>

              {/* Paragrafy tekstu */}
              <div style={{ marginTop: '20px' }}>
                {Array.isArray(paragraphs) && paragraphs.map((text, pIndex) => (
                  <p
                    key={pIndex}
                    style={{
                      marginLeft: '20px',
                      marginRight: '20px',
                      marginBottom: '24px',
                      width: '350px',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: 1.48,
                      color: slide.textColor,
                    }}
                  >
                    {text}
                  </p>
                ))}

                {/* Link "WIĘCEJ" - tylko dla pierwszego slajdu (ensemble) */}
                {index === 0 && (
                  <Link
                    to="/bio/ensemble"
                    style={{
                      marginLeft: '20px',
                      display: 'inline-block',
                      marginTop: '18px',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontWeight: 600,
                      fontSize: '16px',
                      lineHeight: 1.48,
                      color: '#761FE0',
                      textDecoration: 'underline',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t('bio.ensemble.more')}
                  </Link>
                )}
              </div>

              {/* Stopka (tylko dla ostatniego slide) */}
              {slide.hasFooter && (
                <MobileFooter
                  style={{
                    marginTop: '40px',
                    marginLeft: '20px',
                    marginRight: '20px',
                    width: '350px',
                  }}
                  textColor={slide.textColor}
                />
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}
