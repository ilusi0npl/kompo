import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useFixedMobileHeader } from '../../hooks/useFixedMobileHeader';
import ArrowRight from '../../components/ArrowRight/ArrowRight';
import { isLargeTestMode, generateBioEnsembleData } from '../../test-data/large-data-generator';
import { calculateBioFontSize } from '../../hooks/useResponsiveFontSize';

const MOBILE_WIDTH = 390;
const HEADER_HEIGHT = 218;

// Height calculation constants for mobile
const MOBILE_IMAGE_HEIGHT = 350;
const MOBILE_TITLE_HEIGHT = 120;
const MOBILE_GAP_HEIGHT = 12;
const MOBILE_FOOTER_HEIGHT = 150;
const MOBILE_LINK_HEIGHT = 60;

const COLORS = {
  backgroundColor: '#FFBD19',
  lineColor: '#FF734C',
  textColor: '#131313',
  linkColor: '#761FE0',
};

// Mobile line positions
const LINE_POSITIONS = [97, 195, 292];

// Calculate dynamic page height based on content for mobile
function calculateMobilePageHeight(paragraphs, fontSize) {
  if (!paragraphs || !Array.isArray(paragraphs)) return 1200;

  const paragraphCount = paragraphs.length;
  const totalChars = paragraphs.reduce((sum, p) => sum + (p?.length || 0), 0);

  // Line height is font size * 1.48
  const lineHeight = fontSize * 1.48;
  // Characters per line at 350px width (mobile)
  const charsPerLine = Math.floor(350 / (fontSize * 0.6));
  // Total lines needed for all paragraphs
  const totalLines = Math.ceil(totalChars / charsPerLine);
  // Total paragraph content height
  const paragraphsHeight = totalLines * lineHeight;
  // Add gaps between paragraphs
  const gapsHeight = (paragraphCount - 1) * MOBILE_GAP_HEIGHT;

  const totalContentHeight = HEADER_HEIGHT + MOBILE_IMAGE_HEIGHT + MOBILE_TITLE_HEIGHT +
    paragraphsHeight + gapsHeight + MOBILE_LINK_HEIGHT + MOBILE_FOOTER_HEIGHT;

  return Math.max(1200, totalContentHeight);
}

export default function MobileBioEnsemble() {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scale } = useFixedMobileHeader();

  // Get content based on mode
  const largeData = isLargeTestMode ? generateBioEnsembleData(10) : null;
  const title = isLargeTestMode ? largeData.title : t('bio.ensemble.title');
  const paragraphs = isLargeTestMode ? largeData.extendedParagraphs : t('bio.ensemble.extendedParagraphs');
  const upcomingEventsText = isLargeTestMode ? largeData.upcomingEvents : t('bio.ensemble.upcomingEvents');

  // Calculate responsive font size
  const paragraphFontSize = calculateBioFontSize(paragraphs, {
    baseFontSize: 16,
    minFontSize: 12,
    maxParagraphs: 5,
    maxCharsPerParagraph: 400,
  });

  // Calculate dynamic height
  const pageHeight = calculateMobilePageHeight(paragraphs, paragraphFontSize);

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = '/assets/bio/bio-ensemble-large.webp';
  }, []);

  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      data-section="bio-ensemble-mobile"
      className="relative overflow-hidden"
      style={{
        backgroundColor: COLORS.backgroundColor,
        width: `${MOBILE_WIDTH}px`,
        minHeight: `${pageHeight}px`,
      }}
    >
      {/* Pionowe linie */}
      {LINE_POSITIONS.map((x) => (
        <div
          key={x}
          className="absolute top-0"
          style={{
            left: `${x}px`,
            width: '1px',
            height: '100%',
            backgroundColor: COLORS.lineColor,
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
            backgroundColor: COLORS.backgroundColor,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            zIndex: 100,
          }}
        >
          {/* Pionowe linie w fixed headerze */}
          {LINE_POSITIONS.map((x) => (
            <div
              key={`header-line-${x}`}
              className="absolute top-0"
              style={{
                left: `${x}px`,
                width: '1px',
                height: `${HEADER_HEIGHT}px`,
                backgroundColor: COLORS.lineColor,
              }}
            />
          ))}

          {/* Logo */}
          <Link
            to="/"
            className="absolute"
            style={{
              left: '20px',
              top: '35.85px',
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
              color: COLORS.textColor,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            MENU
          </button>

          {/* "Bio" text */}
          <p
            className="absolute"
            style={{
              left: '20px',
              top: '144px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '48px',
              lineHeight: 1.1,
              color: COLORS.textColor,
            }}
          >
            Bio
          </p>

          {/* MobileMenu inside portal */}
          <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>,
        document.body
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: `${HEADER_HEIGHT}px` }} />

      {/* Zdjęcie - 350x350px */}
      <div
        style={{
          marginLeft: '20px',
          width: '350px',
          height: '350px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <img
          src="/assets/bio/bio-ensemble-large.webp"
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
          marginTop: '40px',
          marginLeft: '20px',
          width: '350px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '40px',
          lineHeight: 1.35,
          color: COLORS.textColor,
          whiteSpace: 'pre-wrap',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {title}
      </p>

      {/* Treść - paragraphs z gap 12px */}
      <div
        style={{
          marginTop: '20px',
          marginLeft: '20px',
          width: '350px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {Array.isArray(paragraphs) &&
          paragraphs.map((text, index) => (
            <p
              key={index}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: `${paragraphFontSize}px`,
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
          display: 'inline-flex',
          marginTop: '40px',
          marginLeft: '20px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: 1.48,
          color: COLORS.linkColor,
          textTransform: 'uppercase',
        }}
      >
        {upcomingEventsText}
        <ArrowRight
          className="text-link-btn__arrow"
          style={{ width: '24px', height: '24px' }}
        />
      </Link>

      {/* Stopka */}
      <MobileFooter
        className="mt-16"
        style={{
          marginLeft: '20px',
          marginRight: '20px',
          marginBottom: '40px',
          width: '350px',
        }}
        textColor={COLORS.textColor}
      />
    </div>
  );
}
