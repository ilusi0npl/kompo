import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';
import Footer from '../../components/Footer/Footer';
import ArrowRight from '../../components/ArrowRight/ArrowRight';

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 1599;
const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

const COLORS = {
  backgroundColor: '#FFBD19',
  lineColor: '#FFBD19',
  textColor: 'var(--contrast-text)',
  linkColor: 'var(--contrast-accent)',
};

export default function DesktopBioEnsemble() {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);

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
        minHeight: `${DESKTOP_HEIGHT}px`,
      }}
    >
      {/* Tytuł */}
      <p
        className="absolute"
        style={{
          left: 'calc(50% - 228px)',
          top: '179px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '40px',
          lineHeight: 1.35,
          color: COLORS.textColor,
          zIndex: 60,
        }}
      >
        {t('bio.ensemble.title')}
      </p>

      {/* Zdjęcie - 850x406px, wycentrowane */}
      <div
        className="absolute"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          top: '273px',
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

      {/* Treść - 5 paragrafów */}
      <div
        className="absolute flex flex-col"
        style={{
          left: '295px',
          top: '719px',
          width: '850px',
          gap: '20px',
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
        className="absolute text-link-btn"
        style={{
          left: '295px',
          top: '1367px',
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
        <ArrowRight
          className="text-link-btn__arrow"
          style={{ width: '24px', height: '24px' }}
        />
      </Link>

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
