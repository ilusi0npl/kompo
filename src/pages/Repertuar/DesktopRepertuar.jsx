import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import { useSanityRepertuarComposers } from '../../hooks/useSanityRepertuarComposers';
import {
  composers as configComposers,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './repertuar-config';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#A0E38A';

// Helper component to render a single composer entry
const ComposerEntry = ({ composer }) => {
  return (
    <div style={{ width: '300px' }}>
      <p style={{ margin: 0, lineHeight: 1.48 }}>
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
            margin: 0,
            marginTop: idx === 0 ? '0' : '0',
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

export default function DesktopRepertuar() {
  const { t } = useTranslation();

  // Fetch from Sanity if enabled
  const { composers: sanityComposers, loading, error } = useSanityRepertuarComposers();

  // Use Sanity data if enabled, otherwise use config
  const composers = USE_SANITY ? sanityComposers : configComposers;

  // Loading state
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="repertuar"
        className="relative flex items-center justify-center"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          minHeight: `${DESKTOP_HEIGHT}px`,
          backgroundColor: 'transparent',
        }}
      >
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px' }}>
          {t('common.loading.repertoire')}
        </p>
      </section>
    );
  }

  // Error state
  if (USE_SANITY && error) {
    console.error('Failed to load repertuar composers from Sanity:', error);
    return (
      <section
        data-section="repertuar"
        className="relative flex items-center justify-center"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          minHeight: `${DESKTOP_HEIGHT}px`,
          backgroundColor: 'transparent',
        }}
      >
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px', color: '#ff0000' }}>
          Błąd ładowania repertuaru
        </p>
      </section>
    );
  }

  // Group composers into rows of 3
  const rows = [];
  for (let i = 0; i < composers.length; i += 3) {
    rows.push(composers.slice(i, i + 3));
  }

  // Calculate dynamic height based on ACTUAL content (not estimates)
  // Font: 16px, lineHeight: 1.48 = ~24px per line
  // Each composer: name line (24px) + works (24px each, no margins between)
  const LINE_HEIGHT = 24; // 16px * 1.48 ≈ 24px
  const CONTENT_TOP = 285;
  const ROW_GAP = 30; // Gap between rows (from CSS)
  const FOOTNOTE_SPACE = 74; // 50px margin + 24px text
  const FOOTER_SPACING = 113; // Same as Media page

  // Calculate height of each composer: name line + work lines
  const getComposerHeight = (composer) => LINE_HEIGHT * (1 + composer.works.length);

  // Calculate height of each row (max height of composers in row)
  const rowHeights = rows.map(rowComposers =>
    Math.max(...rowComposers.map(getComposerHeight))
  );

  // Total grid height: sum of row heights + gaps between rows
  const gridHeight = rowHeights.reduce((sum, h) => sum + h, 0) + (rows.length - 1) * ROW_GAP;
  const gridBottom = CONTENT_TOP + gridHeight;
  const footnoteBottom = gridBottom + FOOTNOTE_SPACE;
  const footerTop = footnoteBottom + FOOTER_SPACING;
  const totalHeight = footerTop + 70; // footer + bottom margin (like Media)

  return (
    <section
      data-section="repertuar"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${totalHeight}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
      {/* Composers Grid and Footnote - flex container for dynamic spacing */}
      <div
        className="absolute"
        style={{
          left: '185px',
          top: '285px',
          width: '960px',
        }}
      >
        {/* Composers Grid - Rows of 3 */}
        <div
          style={{
            width: '960px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          }}
        >
          {rows.map((rowComposers, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: 'flex',
                gap: '30px',
              }}
            >
              {rowComposers.map((composer, idx) => (
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
