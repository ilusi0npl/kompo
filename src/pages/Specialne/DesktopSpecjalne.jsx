import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import { useSanitySpecjalneComposers } from '../../hooks/useSanitySpecjalneComposers';
import {
  composers as configComposers,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './specialne-config';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#A0E38A';

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

  // Calculate dynamic height based on ACTUAL content (not estimates)
  // Font: 16px, lineHeight: 1.48 = ~24px per line
  // Each composer: name line (24px) + works (24px each + 8px margin between, except last)
  // IMPORTANT: Work titles may wrap to multiple lines at 300px width (~35 chars per line)
  const LINE_HEIGHT = 24; // 16px * 1.48 ≈ 24px
  const WORK_MARGIN = 8; // 8px margin between works
  const CONTENT_TOP = 352;
  const ENTRY_GAP = 30; // Gap between entries in column (from CSS)
  const FOOTNOTE_SPACE = 74; // 50px margin + 24px text
  const FOOTER_SPACING = 113; // Same as Media page
  const CHARS_PER_LINE = 35; // Approximate chars that fit in 300px at 16px font

  // Estimate number of lines needed for a text at 300px width
  const estimateLines = (text) => Math.ceil((text?.length || 0) / CHARS_PER_LINE) || 1;

  // Calculate height of each composer: name + works + margins between works
  const getComposerHeight = (composer) => {
    const nameHeight = LINE_HEIGHT; // Name line (usually fits on one line)
    // Each work may wrap to multiple lines
    const worksHeight = composer.works.reduce((sum, work) => {
      const lines = estimateLines(work.title);
      return sum + (lines * LINE_HEIGHT);
    }, 0);
    const workMargins = Math.max(0, composer.works.length - 1) * WORK_MARGIN;
    return nameHeight + worksHeight + workMargins;
  };

  // Calculate height of each column (sum of composer heights + gaps between them)
  const columnHeights = columns.map(colComposers => {
    if (colComposers.length === 0) return 0;
    const composerHeights = colComposers.reduce((sum, c) => sum + getComposerHeight(c), 0);
    const gaps = (colComposers.length - 1) * ENTRY_GAP;
    return composerHeights + gaps;
  });

  // Total grid height: tallest column
  const gridHeight = Math.max(...columnHeights);
  const gridBottom = CONTENT_TOP + gridHeight;
  const footnoteBottom = gridBottom + FOOTNOTE_SPACE;
  const footerTop = footnoteBottom + FOOTER_SPACING;
  const totalHeight = footerTop + 70; // footer + bottom margin (like Media)

  return (
    <section
      data-section="specialne"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${totalHeight}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
      {/* Pionowe linie dekoracyjne */}
      {LINE_POSITIONS.map((x) => (
        <div
          key={x}
          className="absolute top-0 decorative-line"
          style={{
            left: `${x}px`,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

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
      </div>

      {/* Footer - absolute position like Media page */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: `${footerTop}px`,
          width: '520px',
        }}
        textColor="#131313"
      />
    </section>
  );
}
