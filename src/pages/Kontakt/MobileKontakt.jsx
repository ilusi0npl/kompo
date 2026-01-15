import { useState } from 'react';
import { Link } from 'react-router';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';

const MOBILE_WIDTH = 390;
const MOBILE_HEIGHT = 1071; // Dokładna wysokość z Figma
const TEXT_COLOR = '#131313';

export default function MobileKontakt() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section
      data-section="kontakt-mobile"
      className="relative overflow-hidden"
      style={{
        width: `${MOBILE_WIDTH}px`,
        height: `${MOBILE_HEIGHT}px`,
      }}
    >
      {/* Header Frame (0-218px) - zbudowany inline dla dokładnej wysokości */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: `${MOBILE_WIDTH}px`,
          height: '218px',
        }}
      >
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
      </div>

      {/* Email - y=278, height=35 */}
      <a
        href="mailto:KOMPOPOLEX@GMAIL.COM"
        className="absolute block"
        style={{
          top: '278px',
          left: '51px',
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

      {/* Zdjęcie zespołu - y=373, width=300, height=460 */}
      <div
        className="absolute"
        style={{
          top: '373px',
          left: '45px',
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

      {/* Stopka - y=919, height=112 */}
      <div
        className="absolute"
        style={{
          top: '919px',
          left: '20px',
          width: '192px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: 1.48,
          color: TEXT_COLOR,
          textTransform: 'uppercase',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px',
        }}
      >
        <p>KOMPOPOLEX@GMAIL.COM</p>
        <a
          href="https://www.facebook.com/ensemblekompopolex/?locale=pl_PL"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline' }}
        >
          FACEBOOK
        </a>
        <a
          href="https://www.instagram.com/kompopolex/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline' }}
        >
          INSTAGRAM
        </a>
      </div>

      {/* MobileMenu overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </section>
  );
}
