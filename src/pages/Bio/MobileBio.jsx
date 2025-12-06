import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import {
  mobileBioSlides,
  mobileLinePositions,
  MOBILE_WIDTH,
} from './bio-config';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const containerRef = useRef(null);
  const lastScrollTime = useRef(0);
  const scrollAccumulator = useRef(0);

  const currentData = mobileBioSlides[currentSlide];

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

  const goToSlide = useCallback((newSlide) => {
    if (newSlide < 0 || newSlide >= mobileBioSlides.length) return;
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentSlide(newSlide);
    scrollAccumulator.current = 0;

    // Scroll to top of new slide
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning]);

  // Handle wheel events for slide transitions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (isTransitioning) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      // Reset accumulator if changing direction or after timeout
      const now = Date.now();
      if (now - lastScrollTime.current > 200) {
        scrollAccumulator.current = 0;
      }
      lastScrollTime.current = now;

      // Scrolling down at bottom - go to next slide
      if (isAtBottom && e.deltaY > 0 && currentSlide < mobileBioSlides.length - 1) {
        e.preventDefault();
        scrollAccumulator.current += e.deltaY;
        if (scrollAccumulator.current > 100) {
          goToSlide(currentSlide + 1);
        }
      }
      // Scrolling up at top - go to previous slide
      else if (isAtTop && e.deltaY < 0 && currentSlide > 0) {
        e.preventDefault();
        scrollAccumulator.current += Math.abs(e.deltaY);
        if (scrollAccumulator.current > 100) {
          goToSlide(currentSlide - 1);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentSlide, isTransitioning, goToSlide]);

  // Handle touch events for mobile swipe
  const touchStart = useRef({ y: 0, time: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      touchStart.current = {
        y: e.touches[0].clientY,
        time: Date.now()
      };
    };

    const handleTouchEnd = (e) => {
      if (isTransitioning) return;

      const deltaY = touchStart.current.y - e.changedTouches[0].clientY;
      const deltaTime = Date.now() - touchStart.current.time;

      // Must be a quick swipe (< 300ms) with enough distance (> 50px)
      if (deltaTime > 300 || Math.abs(deltaY) < 50) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop <= 5;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      // Swipe up at bottom - go to next slide
      if (isAtBottom && deltaY > 50 && currentSlide < mobileBioSlides.length - 1) {
        goToSlide(currentSlide + 1);
      }
      // Swipe down at top - go to previous slide
      else if (isAtTop && deltaY < -50 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSlide, isTransitioning, goToSlide]);

  return (
    <section
      data-section="bio-mobile"
      className="relative"
      style={{
        width: `${MOBILE_WIDTH}px`,
        height: '100%',
        backgroundColor: currentData.backgroundColor,
        transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
      }}
    >
      {/* Pionowe linie w tle */}
      {mobileLinePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0"
          style={{
            left: `${left}px`,
            width: '1px',
            height: '100%',
            backgroundColor: currentData.lineColor,
            transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
          }}
        />
      ))}

      {/* Scrollable content container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        {/* Header z logo i menu - sticky */}
        <div
          className="sticky top-0 left-0 z-10"
          style={{
            width: `${MOBILE_WIDTH}px`,
            height: '281px',
            backgroundColor: currentData.backgroundColor,
            transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
          }}
        >
          {/* Pionowe linie w headerze */}
          {mobileLinePositions.map((left, index) => (
            <div
              key={`header-line-${index}`}
              className="absolute top-0"
              style={{
                left: `${left}px`,
                width: '1px',
                height: '100%',
                backgroundColor: currentData.lineColor,
                transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
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
        </div>

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
      </div>

      {/* MobileMenu overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </section>
  );
}
