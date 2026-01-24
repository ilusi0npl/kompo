import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import { useSanitySpecjalneComposers } from '../../hooks/useSanitySpecjalneComposers';
import {
  composers as configComposers,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './specialne-config';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Helper component to render a single composer entry
const ComposerEntry = ({ composer }) => {
  return (
    <div style={{ width: '300px' }}>
      <p style={{ marginBottom: 0, lineHeight: 1.48 }}>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '16px',
            color: '#131313',
          }}
        >
          {composer.name}{' '}
        </span>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '16px',
            color: '#131313',
          }}
        >
          {composer.year}
        </span>
      </p>
      {composer.works.map((work, idx) => (
        <p
          key={work._key || work.title || idx}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '16px',
            color: '#131313',
            lineHeight: 1.48,
            marginBottom: idx === composer.works.length - 1 ? 0 : '8px',
          }}
        >
          {work.title}
          {work.isSpecial && (
            <span style={{ color: '#761FE0' }}>*</span>
          )}
        </p>
      ))}
    </div>
  );
};

export default function DesktopSpecjalne() {
  const { t } = useTranslation();

  // Fetch from Sanity if enabled
  const { composers: sanityComposers, loading, error } = useSanitySpecjalneComposers();

  // Use Sanity data if enabled, otherwise use config
  const composers = USE_SANITY ? sanityComposers : configComposers;

  // Loading state
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="specialne"
        className="relative flex items-center justify-center"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          minHeight: `${DESKTOP_HEIGHT}px`,
          backgroundColor: 'transparent',
        }}
      >
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px' }}>
          {t('common.loading.special')}
        </p>
      </section>
    );
  }

  // Error state
  if (USE_SANITY && error) {
    console.error('Failed to load specialne composers from Sanity:', error);
    return (
      <section
        data-section="specialne"
        className="relative flex items-center justify-center"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          minHeight: `${DESKTOP_HEIGHT}px`,
          backgroundColor: 'transparent',
        }}
      >
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px', color: '#ff0000' }}>
          Błąd ładowania projektów specjalnych
        </p>
      </section>
    );
  }

  // Distribute composers into 3 columns (modulo 3)
  const columns = [[], [], []];
  composers.forEach((composer, index) => {
    columns[index % 3].push(composer);
  });

  // Calculate dynamic height based on content
  // Find the tallest column - each composer has name (may wrap) + 2 works + gap
  const maxComposersInColumn = Math.max(...columns.map(col => col.length));
  // Each composer: ~48px name (can wrap) + ~72px for 2 works (can wrap) + 30px gap = ~150px
  const composerHeight = 150;
  const contentTop = 352;
  const composersHeight = maxComposersInColumn * composerHeight;
  const footnoteHeight = 50 + 24; // margin + text
  const footerSpace = 40 + 64; // bottom margin (40px) + footer height
  const contentHeight = contentTop + composersHeight + footnoteHeight + footerSpace;
  const pageHeight = Math.max(DESKTOP_HEIGHT, contentHeight);

  return (
    <section
      data-section="specialne"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        minHeight: `${pageHeight}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
      {/* Header text */}
      <p
        className="absolute"
        style={{
          left: '185px',
          top: '285px',
          width: '960px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: 1.48,
          color: '#131313',
          margin: 0,
          marginBottom: '30px',
        }}
      >
        {t('repertuar.specialHeader')}
      </p>

      {/* Composers Grid and Footnote - flex container for dynamic spacing */}
      <div
        className="absolute"
        style={{
          left: '185px',
          top: '352px',
          width: '960px',
        }}
      >
        {/* Composers Grid - 3 columns */}
        <div
          style={{
            width: '960px',
            display: 'flex',
            gap: '30px',
          }}
        >
          {columns.map((columnComposers, colIndex) => (
            <div
              key={colIndex}
              style={{
                width: '300px',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px',
              }}
            >
              {columnComposers.map((composer, idx) => (
                <ComposerEntry key={composer._id || composer.name || idx} composer={composer} />
              ))}
            </div>
          ))}
        </div>

        {/* Footnote - 50px margin from composers (from Figma) */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: 1.48,
            color: '#761FE0',
            margin: 0,
            marginTop: '50px',
          }}
        >
          {t('repertuar.footnote')}
        </p>

        {/* Footer - flows after footnote */}
        <Footer
          style={{
            marginTop: '80px',
            marginBottom: '40px',
            width: '520px',
          }}
          textColor="#131313"
        />
      </div>
    </section>
  );
}
