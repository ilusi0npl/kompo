import { Link } from 'react-router';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import {
  composers,
  MOBILE_WIDTH,
  mobileLinePositions,
} from './specialne-config';

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
          key={idx}
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

export default function MobileSpecjalne() {
  const { t } = useTranslation();

  // Calculate total height based on content
  // Footnote at 996px + footnote height (~48px for 2 lines) + margin (50px) + footer height (~120px) + bottom margin (50px)
  const footnoteTop = 996;
  const footnoteHeight = 48; // Approximate height for 2-line text
  const marginToFooter = 50;
  const footerHeight = 120; // Approximate footer height
  const bottomMargin = 50;
  const totalHeight = footnoteTop + footnoteHeight + marginToFooter + footerHeight + bottomMargin;

  return (
    <section
      data-section="specialne-mobile"
      style={{
        width: `${MOBILE_WIDTH}px`,
        height: `${totalHeight}px`,
        backgroundColor: '#FDFDFD',
        position: 'relative',
      }}
    >
      {/* Pionowe linie dekoracyjne - renderowane ręcznie */}
      {mobileLinePositions.map((x) => (
        <div
          key={x}
          className="absolute"
          style={{
            left: `${x}px`,
            top: 0,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Header z logo, MENU button, tytułem */}
      <MobileHeader
        title={t('repertuar.sideTitle')}
        navLinks={null}
      />

      {/* Navigation Tabs */}
      <div
        className="absolute"
        style={{
          left: '20px',
          top: '237px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Link
          to="/repertuar"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: 1.44,
            color: '#131313',
            textDecoration: 'none',
            margin: 0,
          }}
        >
          {t('repertuar.tabs.full')}
        </Link>
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: 1.44,
            color: '#761FE0',
            textDecoration: 'underline',
            textUnderlinePosition: 'from-font',
            margin: 0,
          }}
        >
          {t('repertuar.tabs.special')}
        </p>
      </div>

      {/* Header text */}
      <p
        className="absolute"
        style={{
          left: '20px',
          top: '355px',
          width: '350px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: 1.48,
          color: '#131313',
          margin: 0,
        }}
      >
        {t('repertuar.specialHeader')}
      </p>

      {/* Composers List - Single column */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '476px',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {composers.map((composer, idx) => (
          <ComposerEntry key={idx} composer={composer} />
        ))}
      </div>

      {/* Footnote */}
      <p
        className="absolute"
        style={{
          left: '20px',
          top: '996px',
          width: '350px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: 1.48,
          color: '#761FE0',
          margin: 0,
        }}
      >
        {t('repertuar.footnote')}
      </p>

      {/* Footer */}
      <MobileFooter
        style={{
          position: 'absolute',
          left: 'calc(25% + 18.5px)',
          transform: 'translateX(-50%)',
          top: `${footnoteTop + footnoteHeight + marginToFooter}px`,
        }}
        textColor="#131313"
      />
    </section>
  );
}
