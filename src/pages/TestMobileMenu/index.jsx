import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import {
  mobileSlides,
  mobileLinePositions,
  MOBILE_WIDTH,
  MOBILE_HEIGHT,
} from '../Homepage/slides-config';

const TRANSITION_DURATION = '0s'; // No transition for testing

export default function TestMobileMenu() {
  const [searchParams] = useSearchParams();
  const menuParam = searchParams.get('menu');
  const [isMenuOpen, setIsMenuOpen] = useState(menuParam === 'open');

  useEffect(() => {
    if (menuParam === 'open') {
      setIsMenuOpen(true);
    }
  }, [menuParam]);

  const currentData = mobileSlides[0]; // Use first slide for testing

  return (
    <section
      data-section="hero-mobile"
      className="relative overflow-hidden"
      style={{
        width: `${MOBILE_WIDTH}px`,
        height: `${MOBILE_HEIGHT}px`,
        backgroundColor: currentData.backgroundColor,
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

      {/* Logo */}
      <Link to="/">
        <img
          src={currentData.logoSrc}
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
        }}
      >
        MENU
      </button>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Główne zdjęcie - używamy mobile hero photo */}
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
        <img
          src="/assets/mobile/hero-photo.jpg"
          alt="Slide"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Słowo (Trio) - SVG */}
      <img
        src="/assets/mobile/trio-text.svg"
        alt="Trio"
        className="absolute"
        style={{
          left: '30px',
          top: '460px',
          width: '49px',
          height: '149px',
        }}
      />

      {/* Tekst tagline */}
      <p
        className="absolute"
        style={{
          left: '185px',
          top: '460px',
          width: '185px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: 1.48,
          color: currentData.textColor,
        }}
      >
        {currentData.tagline}
      </p>
    </section>
  );
}
