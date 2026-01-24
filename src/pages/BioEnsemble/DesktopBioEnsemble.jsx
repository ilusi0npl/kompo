import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';
import Footer from '../../components/Footer/Footer';
import ArrowRight from '../../components/ArrowRight/ArrowRight';
import { isLargeTestMode, generateBioEnsembleData } from '../../test-data/large-data-generator';
import { calculateBioFontSize } from '../../hooks/useResponsiveFontSize';

const DESKTOP_WIDTH = 1440;
const BASE_HEIGHT = 1599;

// Height calculation constants
const CONTENT_START = 750; // Top position of paragraphs
const GAP_HEIGHT = 20; // Gap between paragraphs
const FOOTER_HEIGHT = 150; // Footer + bottom padding (40px bottom + 24px footer + margins)
const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

const COLORS = {
  backgroundColor: '#FFBD19',
  lineColor: '#FFBD19',
  textColor: '#131313',
  linkColor: '#761FE0',
};

// Calculate dynamic page height based on content
function calculatePageHeight(paragraphs, fontSize) {
  if (!paragraphs || !Array.isArray(paragraphs)) return BASE_HEIGHT;

  const paragraphCount = paragraphs.length;
  const totalChars = paragraphs.reduce((sum, p) => sum + (p?.length || 0), 0);

  // Line height is font size * 1.48
  const lineHeight = fontSize * 1.48;
  // Characters per line at 850px width (approx)
  const charsPerLine = Math.floor(850 / (fontSize * 0.6)); // ~0.6 char width ratio for monospace
  // Total lines needed for all paragraphs
  const totalLines = Math.ceil(totalChars / charsPerLine);
  // Total paragraph content height
  const paragraphsHeight = totalLines * lineHeight;
  // Add gaps between paragraphs
  const gapsHeight = (paragraphCount - 1) * GAP_HEIGHT;
  // Link button height (~60px with margin)
  const linkHeight = 60;

  const totalContentHeight = CONTENT_START + paragraphsHeight + gapsHeight + linkHeight + FOOTER_HEIGHT;

  return Math.max(BASE_HEIGHT, totalContentHeight);
}

export default function DesktopBioEnsemble() {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);

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
    maxCharsPerParagraph: 500,
  });

  // Calculate dynamic height
  const pageHeight = calculatePageHeight(paragraphs, paragraphFontSize);

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

  // Set background color
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', COLORS.backgroundColor);
    document.documentElement.style.setProperty('--line-color', COLORS.lineColor);
  }, []);

  return (
    <section
      data-section="bio-ensemble"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        minHeight: `${pageHeight}px`,
      }}
    >
      {/* Tytuł */}
      <p
        className="absolute"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          top: '120px',
          width: '850px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '40px',
          lineHeight: 1.35,
          color: COLORS.textColor,
          zIndex: 60,
          textAlign: 'center',
        }}
      >
        {title}
      </p>

      {/* Zdjęcie - 850x406px, wycentrowane */}
      <div
        className="absolute"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          top: '300px',
          width: '850px',
          height: '406px',
          overflow: 'hidden',
          backgroundColor: COLORS.backgroundColor,
          zIndex: 60,
        }}
      >
        <img
          src="/assets/bio/bio-ensemble-large.webp"
          alt="Ensemble KOMPOPOLEX"
          style={{
            width: '100%',
            height: '149.51%',
            position: 'absolute',
            left: '0',
            top: '-32.14%',
            maxWidth: 'none',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        />
      </div>

      {/* Treść - paragraphs + link */}
      <div
        className="absolute flex flex-col"
        style={{
          left: '295px',
          top: '750px',
          width: '850px',
          gap: '20px',
          zIndex: 60,
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

        {/* Link "NAJBLIŻSZE WYDARZENIA" */}
        <Link
          to="/kalendarz"
          className="text-link-btn"
          style={{
            display: 'inline-flex',
            marginTop: '20px',
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
      </div>

      {/* Stopka */}
      <Footer
        className="absolute"
        style={{
          left: 'calc(50% - 275px)',
          transform: 'translateX(-50%)',
          bottom: '40px',
          width: '520px',
          zIndex: 60,
        }}
        textColor={COLORS.textColor}
      />
    </section>
  );
}
