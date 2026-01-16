import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import Footer from '../../components/Footer/Footer';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import { useTranslation } from '../../hooks/useTranslation';

const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#01936F';
const BACKGROUND_COLOR = '#34B898';
const TEXT_COLOR = '#131313';

export default function DesktopMediaGaleria({ album }) {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Keyboard navigation
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
      data-section="media-galeria"
      className="relative"
      style={{
        width: '1440px',
        height: '856px',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Vertical lines */}
      {LINE_POSITIONS.map((x) => (
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

      {/* Logo */}
      <Link
        to="/"
        className="absolute"
        style={{
          left: '185px',
          top: '76px',
          width: '149px',
          height: '60px',
        }}
      >
        <img
          src="/assets/logo.svg"
          alt="Kompopolex"
          style={{ width: '100%', height: '100%' }}
        />
      </Link>

      {/* "Zdjęcia" vertical text */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '94px',
          top: '180px',
          width: '45px',
          height: '269px',
        }}
      >
        <p
          style={{
            transform: 'rotate(90deg)',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '64px',
            lineHeight: 1.4,
            color: TEXT_COLOR,
          }}
        >
          Zdjęcia
        </p>
      </div>

      {/* Main photo */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(50% + 0.5px)',
          top: '180px',
          transform: 'translateX(-50%)',
          width: '631px',
          height: '447px',
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

      {/* Left arrow */}
      <button
        onClick={handlePrev}
        aria-label="Previous photo"
        style={{
          position: 'absolute',
          left: '315px',
          top: '374px',
          width: '60px',
          height: '60px',
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
          position: 'absolute',
          left: '1066px',
          top: '374px',
          width: '60px',
          height: '60px',
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

      {/* Title and credit */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(50% - 165px)',
          top: '643px',
          transform: 'translateX(-50%)',
          width: '300px',
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

      {/* Footer */}
      <Footer
        className="absolute"
        style={{
          top: '792px',
          left: 'calc(50% - 275px)',
          transform: 'translateX(-50%)',
          width: '520px',
        }}
      />

      {/* Right navigation menu */}
      <div
        className="absolute flex flex-col"
        style={{
          left: '1265px',
          top: '60px',
          width: '100px',
          gap: '279px',
        }}
      >
        <LanguageToggle />

        <nav
          className="flex flex-col"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: 1.48,
            color: TEXT_COLOR,
            gap: '22px',
          }}
        >
          <Link to="/bio" className="nav-link" style={{ color: TEXT_COLOR }}>Bio</Link>
          <Link to="/media" className="nav-link nav-link--active" style={{ color: TEXT_COLOR }}>Media</Link>
          <Link to="/kalendarz" className="nav-link" style={{ color: TEXT_COLOR }}>Kalendarz</Link>
          <Link to="/repertuar" className="nav-link" style={{ color: TEXT_COLOR }}>Repertuar</Link>
          <Link to="/fundacja" className="nav-link" style={{ color: TEXT_COLOR }}>Fundacja</Link>
          <Link to="/kontakt" className="nav-link" style={{ color: TEXT_COLOR }}>Kontakt</Link>
        </nav>
      </div>
    </section>
  );
}
