import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';

const MOBILE_WIDTH = 390;
const MOBILE_HEIGHT = 2290;
const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

const COLORS = {
  backgroundColor: '#FFBD19',
  lineColor: '#FF734C',
  textColor: '#131313',
  linkColor: '#761FE0',
};

// Mobile line positions
const LINE_POSITIONS = [97, 195, 292];

export default function MobileBioEnsemble() {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = '/assets/bio/bio-ensemble-large.jpg';
  }, []);

  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      data-section="bio-ensemble-mobile"
      style={{
        backgroundColor: COLORS.backgroundColor,
        width: `${MOBILE_WIDTH}px`,
        minHeight: `${MOBILE_HEIGHT}px`,
        position: 'relative',
      }}
    >
      {/* Pionowe linie */}
      {LINE_POSITIONS.map((x) => (
        <div
          key={x}
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: 0,
            width: '1px',
            height: `${MOBILE_HEIGHT}px`,
            backgroundColor: COLORS.lineColor,
            zIndex: 1,
          }}
        />
      ))}

      {/* Fixed header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${MOBILE_WIDTH}px`,
          height: '218px',
          backgroundColor: COLORS.backgroundColor,
          overflow: 'hidden',
          zIndex: 100,
        }}
      >
        {/* Pionowe linie w fixed headerze */}
        {LINE_POSITIONS.map((x) => (
          <div
            key={`header-line-${x}`}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: 0,
              width: '1px',
              height: '218px',
              backgroundColor: COLORS.lineColor,
              zIndex: 1,
            }}
          />
        ))}

        {/* Logo */}
        <Link
          to="/"
          style={{
            position: 'absolute',
            left: '20px',
            top: '35.85px',
            zIndex: 101,
          }}
        >
          <img
            src="/assets/logo.svg"
            alt="Kompopolex"
            style={{
              width: '104.31px',
              height: '37.64px',
            }}
          />
        </Link>

        {/* MENU button */}
        <Link
          to="/bio"
          className="nav-link"
          style={{
            position: 'absolute',
            left: '312px',
            top: '43px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: 'normal',
            color: COLORS.textColor,
            zIndex: 101,
          }}
        >
          MENU
        </Link>

        {/* "Bio" text */}
        <p
          style={{
            position: 'absolute',
            left: '20px',
            top: '144px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '48px',
            lineHeight: 1.1,
            color: COLORS.textColor,
            zIndex: 101,
          }}
        >
          Bio
        </p>
      </div>

      {/* Zdjęcie - 350x350px */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '217px',
          width: '350px',
          height: '350px',
          overflow: 'hidden',
          zIndex: 60,
        }}
      >
        <img
          src="/assets/bio/bio-ensemble-large.jpg"
          alt="Ensemble KOMPOPOLEX"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        />
      </div>

      {/* Tytuł */}
      <p
        style={{
          position: 'absolute',
          left: '20px',
          top: '607px',
          width: '258px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '40px',
          lineHeight: 1.35,
          color: COLORS.textColor,
          whiteSpace: 'pre-wrap',
          zIndex: 60,
        }}
      >
        {t('bio.ensemble.title')}
      </p>

      {/* Treść - 5 paragrafów z gap 12px */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '737px',
          width: '350px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 60,
        }}
      >
        {Array.isArray(t('bio.ensemble.extendedParagraphs')) &&
          t('bio.ensemble.extendedParagraphs').map((text, index) => (
            <p
              key={index}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: 1.48,
                color: COLORS.textColor,
                whiteSpace: 'pre-wrap',
              }}
            >
              {text}
            </p>
          ))}
      </div>

      {/* Link "NAJBLIŻSZE WYDARZENIA" */}
      <Link
        to="/kalendarz"
        className="text-link-btn"
        style={{
          position: 'absolute',
          left: '20px',
          top: '2025px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: 1.48,
          color: COLORS.linkColor,
          textTransform: 'uppercase',
          zIndex: 60,
        }}
      >
        {t('bio.ensemble.upcomingEvents')}
        <img
          src="/assets/media/arrow-right.svg"
          alt=""
          className="text-link-btn__arrow"
          style={{ width: '24px', height: '24px' }}
        />
      </Link>

      {/* Stopka - kolumna */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '2135px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          zIndex: 60,
        }}
      >
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: 1.48,
            color: COLORS.textColor,
            textTransform: 'uppercase',
          }}
        >
          KOMPOPOLEX@GMAIL.COM
        </p>
        <a
          href="https://facebook.com"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: 1.48,
            color: COLORS.textColor,
            textDecoration: 'underline',
            textTransform: 'uppercase',
          }}
        >
          FACEBOOK
        </a>
        <a
          href="https://instagram.com"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: 1.48,
            color: COLORS.textColor,
            textDecoration: 'underline',
            textTransform: 'uppercase',
          }}
        >
          INSTAGRAM
        </a>
      </div>
    </div>
  );
}
