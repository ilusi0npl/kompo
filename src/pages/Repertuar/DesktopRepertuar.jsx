import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import {
  composers,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './repertuar-config';

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
          key={idx}
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

  // Group composers into rows of 3
  const rows = [];
  for (let i = 0; i < composers.length; i += 3) {
    rows.push(composers.slice(i, i + 3));
  }

  return (
    <section
      data-section="repertuar"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
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
                <ComposerEntry key={idx} composer={composer} />
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

      {/* Footer */}
      <Footer
        style={{
          position: 'absolute',
          left: '185px',
          bottom: '40px',
          width: '520px',
        }}
        textColor="#131313"
      />
    </section>
  );
}
