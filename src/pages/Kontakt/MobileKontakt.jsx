import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useFixedMobileHeader } from '../../hooks/useFixedMobileHeader';

const MOBILE_WIDTH = 390;
const HEADER_HEIGHT = 218;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#FF734C';
const LINE_COLOR = '#FFBD19';
const TEXT_COLOR = '#131313';

export default function MobileKontakt() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scale } = useFixedMobileHeader();

  return (
    <section
      data-section="kontakt-mobile"
      className="relative overflow-hidden"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: '100vh',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Pionowe linie */}
      {mobileLinePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0"
          style={{
            left: `${left}px`,
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
          {/* Pionowe linie w headerze */}
          {mobileLinePositions.map((left, index) => (
            <div
              key={`header-line-${index}`}
              className="absolute top-0"
              style={{
                left: `${left}px`,
                width: '1px',
                height: `${HEADER_HEIGHT}px`,
                backgroundColor: LINE_COLOR,
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
                top: '35.85px',
                width: '104px',
                height: '37.64px',
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
              color: TEXT_COLOR,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            MENU
          </button>

          {/* Tytuł "Kontakt" */}
          <div
            className="absolute"
            style={{
              left: '20px',
              top: '144px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '48px',
              lineHeight: 1.1,
              color: TEXT_COLOR,
            }}
          >
            {t('kontakt.sideTitle')}
          </div>

          {/* MobileMenu inside portal */}
          <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>,
        document.body
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: `${HEADER_HEIGHT}px` }} />

      {/* Email */}
      <a
        href="mailto:KOMPOPOLEX@GMAIL.COM"
        className="block"
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: '60px',
          marginLeft: '51px',
          width: '288px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.45,
          color: TEXT_COLOR,
          textDecoration: 'underline',
          textUnderlinePosition: 'from-font',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        KOMPOPOLEX@GMAIL.COM
      </a>

      {/* Zdjęcie zespołu */}
      <div
        style={{
          marginTop: '60px',
          marginLeft: '45px',
          width: '300px',
          height: '460px',
        }}
      >
        <SmoothImage
          src="/assets/kontakt/team-photo.jpg"
          alt="Zespół Kompopolex"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '50% 50%',
          }}
          placeholderColor="#e5e5e5"
        />
      </div>

      {/* Stopka */}
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
