import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import { useTranslation } from '../../hooks/useTranslation';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#34B898';
const LINE_COLOR = '#01936F';
const TEXT_COLOR = '#131313';

export default function MobileMediaGaleria({ album }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      className="relative"
      style={{
        width: `${MOBILE_WIDTH}px`,
        height: '1000px',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Vertical lines */}
      {mobileLinePositions.map((x) => (
        <div
          key={x}
          className="absolute"
          style={{
            left: `${x}px`,
            top: '-38px',
            width: '1px',
            height: '3863px',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Header */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '390px',
          height: '240px',
          backgroundColor: BACKGROUND_COLOR,
          overflow: 'clip',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            position: 'absolute',
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
          style={{
            position: 'absolute',
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

        {/* "Zdjęcia" title - horizontal, NOT rotated */}
        <p
          style={{
            position: 'absolute',
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
      </div>

      {/* Title + Photo section */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '260px',
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
          position: 'absolute',
          left: '20px',
          top: '625px',
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
          <img
            src="/assets/media/arrow-right.svg"
            alt="Previous"
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
          <img
            src="/assets/media/arrow-right.svg"
            alt="Next"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '39px',
          left: 'calc(25% + 18.5px)',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: 1.48,
          color: TEXT_COLOR,
          textTransform: 'uppercase',
        }}
      >
        <p>KOMPOPOLEX@GMAIL.COM</p>
        <a
          href="https://www.facebook.com/ensemblekompopolex/?locale=pl_PL"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', color: TEXT_COLOR }}
        >
          FACEBOOK
        </a>
        <a
          href="https://www.instagram.com/kompopolex/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', color: TEXT_COLOR }}
        >
          INSTAGRAM
        </a>
      </div>

      {/* MobileMenu overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </section>
  );
}
