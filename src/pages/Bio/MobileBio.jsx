import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import {
  mobileBioSlides,
  mobileLinePositions,
  MOBILE_WIDTH,
} from './bio-config';

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

export default function MobileBio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [linesVisible, setLinesVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);
  const lastScrollTop = useRef(0);
  const scrollAccumulator = useRef(0);

  const currentData = mobileBioSlides[currentSlide];
  const totalSlides = mobileBioSlides.length;

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

  const goToSlide = useCallback((toSlide) => {
    if (isAnimating.current) return;
    if (toSlide < 0 || toSlide >= totalSlides) return;

    isAnimating.current = true;
    setCurrentSlide(toSlide);

    // Scroll window to top
    window.scrollTo({ top: 0, behavior: 'instant' });
    scrollAccumulator.current = 0;

    setTimeout(() => {
      isAnimating.current = false;
    }, 600);
  }, [totalSlides]);

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
    document.documentElement.style.setProperty('--page-bg', currentData.backgroundColor);
    document.documentElement.style.setProperty('--line-color', currentData.lineColor);
  }, [currentData.backgroundColor, currentData.lineColor]);

  // Touch handlers for slide transitions at boundaries
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (isAnimating.current) return;
      touchStartY.current = e.touches[0].clientY;
      lastScrollTop.current = window.scrollY;
    };

    const handleTouchMove = (e) => {
      if (isAnimating.current) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      const isAtTop = scrollTop <= 5;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      // At bottom, swiping up → accumulate for next slide
      if (isAtBottom && deltaY > 0 && currentSlide < totalSlides - 1) {
        scrollAccumulator.current += Math.abs(deltaY - (lastScrollTop.current - scrollTop));
      }
      // At top, swiping down → accumulate for previous slide
      else if (isAtTop && deltaY < 0 && currentSlide > 0) {
        scrollAccumulator.current += Math.abs(deltaY);
      }
      else {
        scrollAccumulator.current = 0;
      }

      lastScrollTop.current = scrollTop;
    };

    const handleTouchEnd = (e) => {
      if (isAnimating.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      const isAtTop = scrollTop <= 5;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      const SWIPE_THRESHOLD = 80;

      // Swipe up at bottom → next slide
      if (isAtBottom && deltaY > SWIPE_THRESHOLD && currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      }
      // Swipe down at top → previous slide
      else if (isAtTop && deltaY < -SWIPE_THRESHOLD && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }

      scrollAccumulator.current = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSlide, totalSlides, goToSlide]);

  return (
    <section
      data-section="bio-mobile"
      className="relative"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: '100vh',
        backgroundColor: currentData.backgroundColor,
        transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
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
            backgroundColor: currentData.lineColor,
            opacity: linesVisible ? 1 : 0,
            transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}, opacity 0.8s ${TRANSITION_EASING} ${index * 0.15}s`,
          }}
        />
      ))}

      {/* Spacer for fixed header */}
      <div style={{ height: '281px' }} />

      {/* Header z logo i menu - FIXED via portal */}
      {typeof document !== 'undefined' && createPortal(
        <div
          className="fixed top-0 left-0 z-50"
          style={{
            width: `${MOBILE_WIDTH}px`,
            height: '281px',
            backgroundColor: currentData.backgroundColor,
            transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
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
                backgroundColor: currentData.lineColor,
                opacity: linesVisible ? 1 : 0,
                transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}, opacity 0.8s ${TRANSITION_EASING} ${index * 0.15}s`,
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
              color: currentData.textColor,
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
        </div>,
        document.body
      )}

      {/* Content area */}
      <div style={{ paddingBottom: '60px' }}>
        {/* Zdjęcie - 300x460px centered z smooth loading */}
        <div
          className="relative mx-auto"
          style={{
            width: '300px',
            height: '460px',
            overflow: 'hidden',
            backgroundColor: currentData.backgroundColor,
          }}
        >
          {mobileBioSlides.map((slide, index) => (
            <img
              key={slide.id}
              src={slide.image}
              alt={slide.name}
              className="absolute"
              style={{
                ...mobileImageStyles[index],
                opacity: index === currentSlide && loadedImages.has(index) ? 1 : 0,
                transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
              }}
            />
          ))}
        </div>

        {/* Tytuł (imię) - 40px SemiBold */}
        <div className="relative" style={{ marginTop: '60px', minHeight: '96px' }}>
          {mobileBioSlides.map((slide, index) => (
            <p
              key={slide.id}
              className="absolute"
              style={{
                left: '20px',
                top: 0,
                width: '350px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '40px',
                lineHeight: 1.2,
                color: slide.textColor,
                opacity: index === currentSlide ? 1 : 0,
                transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
                pointerEvents: index === currentSlide ? 'auto' : 'none',
              }}
            >
              {slide.name}
            </p>
          ))}
        </div>

        {/* Paragrafy tekstu */}
        <div className="relative" style={{ marginTop: '20px' }}>
          {mobileBioSlides.map((slide, index) => (
            <div
              key={slide.id}
              style={{
                opacity: index === currentSlide ? 1 : 0,
                transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
                pointerEvents: index === currentSlide ? 'auto' : 'none',
                position: index === currentSlide ? 'relative' : 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {slide.paragraphs.map((text, pIndex) => (
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
            </div>
          ))}
        </div>

        {/* Stopka (tylko dla ostatniego slide) */}
        {currentData.hasFooter && (
          <MobileFooter
            style={{
              marginLeft: '20px',
              marginTop: '40px',
              width: '350px',
            }}
            textColor={currentData.textColor}
          />
        )}

        {/* Slide indicator */}
        <div
          className="flex justify-center gap-2"
          style={{ marginTop: '40px', paddingBottom: '20px' }}
        >
          {mobileBioSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index === currentSlide ? currentData.textColor : 'transparent',
                border: `1px solid ${currentData.textColor}`,
                padding: 0,
                cursor: 'pointer',
                transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* MobileMenu overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </section>
  );
}
