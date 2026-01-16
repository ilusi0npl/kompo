import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import { useFixedMobileHeader } from '../../hooks/useFixedMobileHeader';
import ArrowRight from '../../components/ArrowRight/ArrowRight';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#34B898';
const LINE_COLOR = '#01936F';
const TEXT_COLOR = '#131313';
const HEADER_HEIGHT = 240;

export default function MobileMediaGaleria({ album }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { scale } = useFixedMobileHeader();

  // Navigation handlers
  const handlePrev = () => {
    setCurrentIndex(prev =>
      prev === 0 ? album.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prev =>
      prev === album.images.length - 1 ? 0 : prev + 1
    );
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  // Keyboard navigation (works on mobile browsers with keyboard)
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          navigate('/media');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, navigate]);

  // Preload next and previous images
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % album.images.length;
    const prevIndex = (currentIndex - 1 + album.images.length) % album.images.length;

    const nextImg = new Image();
    nextImg.src = album.images[nextIndex];

    const prevImg = new Image();
    prevImg.src = album.images[prevIndex];
  }, [currentIndex, album.images]);

  const currentImage = album.images[currentIndex];

  return (
    <section
      data-section="media-galeria-mobile"
      className="relative overflow-hidden"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: '100vh',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Vertical lines */}
      {mobileLinePositions.map((x) => (
        <div
          key={x}
          className="absolute top-0"
          style={{
            left: `${x}px`,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Fixed header via portal */}
      {typeof document !== 'undefined' && createPortal(
        <div
          className="fixed top-0 left-0"
          style={{
            width: `${MOBILE_WIDTH}px`,
            height: `${HEADER_HEIGHT}px`,
            backgroundColor: BACKGROUND_COLOR,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            zIndex: 100,
          }}
        >
          {/* Pionowe linie w fixed headerze */}
          {mobileLinePositions.map((x) => (
            <div
              key={`header-line-${x}`}
              className="absolute top-0"
              style={{
                left: `${x}px`,
                width: '1px',
                height: `${HEADER_HEIGHT}px`,
                backgroundColor: LINE_COLOR,
              }}
            />
          ))}

          {/* Logo */}
          <Link
            to="/"
            className="absolute"
            style={{
              left: '20px',
              top: '40px',
              width: '104px',
              height: '42px',
            }}
          >
            <img
              src="/assets/logo.svg"
              alt="Kompopolex"
              style={{ width: '100%', height: '100%' }}
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
              color: TEXT_COLOR,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            MENU
          </button>

          {/* "Zdjęcia" title */}
          <p
            className="absolute"
            style={{
              left: '20px',
              top: '166px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '48px',
              lineHeight: 1.1,
              color: TEXT_COLOR,
            }}
          >
            Zdjęcia
          </p>

          {/* MobileMenu inside portal */}
          <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>,
        document.body
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: `${HEADER_HEIGHT}px` }} />

      {/* Title + Photo section */}
      <div
        style={{
          marginLeft: '20px',
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Title and credit (before photo on mobile) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            color: TEXT_COLOR,
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: 1.45,
              textDecoration: 'underline',
              textTransform: 'uppercase',
            }}
          >
            {album.title}
          </p>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: 1.48,
            }}
          >
            fot. {album.photographer}
          </p>
        </div>

        {/* Photo with swipe */}
        <div
          {...swipeHandlers}
          style={{
            width: '350px',
            height: '250px',
          }}
        >
          <SmoothImage
            src={currentImage}
            alt={album.title}
            containerStyle={{ width: '100%', height: '100%' }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            placeholderColor="#e5e5e5"
          />
        </div>
      </div>

      {/* Navigation arrows */}
      <div
        style={{
          marginLeft: '20px',
          marginTop: '40px',
          width: '350px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left arrow */}
        <button
          onClick={handlePrev}
          aria-label="Previous photo"
          style={{
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ArrowRight
            style={{
              width: '100%',
              height: '100%',
              transform: 'rotate(180deg)',
            }}
          />
        </button>

        {/* Right arrow */}
        <button
          onClick={handleNext}
          aria-label="Next photo"
          style={{
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ArrowRight
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </button>
      </div>

      {/* Footer */}
      <MobileFooter
        className="mt-16"
        style={{
          marginLeft: '20px',
          marginRight: '20px',
          marginBottom: '40px',
          width: '350px',
        }}
        textColor={TEXT_COLOR}
      />
    </section>
  );
}
