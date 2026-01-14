import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import {
  composers,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
  desktopLinePositions,
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

export default function DesktopSpecjalne() {
  const { t } = useTranslation();

  // Distribute composers into 3 columns (modulo 3)
  const columns = [[], [], []];
  composers.forEach((composer, index) => {
    columns[index % 3].push(composer);
  });

  return (
    <section
      data-section="specialne"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: '#FDFDFD',
      }}
    >
      {/* Pionowe linie dekoracyjne - renderowane ręcznie */}
      {desktopLinePositions.map((x) => (
        <div
          key={x}
          className="absolute top-0"
          style={{
            left: `${x}px`,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Logo */}
      <Link to="/">
        <img
          src="/assets/logo.svg"
          alt="Kompopolex"
          className="absolute"
          style={{
            left: '185px',
            top: '60px',
            width: '149px',
            height: '60px',
          }}
        />
      </Link>

      {/* Repertuar - pionowy tekst po lewej (rotacja 90 stopni) */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '94px',
          top: '275px',
          width: '45px',
          height: '346px',
        }}
      >
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '64px',
            lineHeight: 1.1,
            color: '#131313',
            whiteSpace: 'nowrap',
            transform: 'rotate(90deg)',
            transformOrigin: 'center',
          }}
        >
          {t('repertuar.sideTitle')}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div
        className="absolute"
        style={{
          left: '185px',
          top: '190px',
          display: 'flex',
          gap: '330px',
        }}
      >
        <Link
          to="/repertuar"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '24px',
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
            fontSize: '24px',
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

      {/* Right Navigation Menu */}
      <div
        className="absolute"
        style={{
          left: '1265px',
          top: '60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '279px',
        }}
      >
        {/* Language Toggle */}
        <LanguageToggle
          textColor="#131313"
          transition="1s cubic-bezier(0.4, 0, 0.2, 1)"
        />

        {/* Navigation Links */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          }}
        >
          {[
            { key: 'bio', href: '/bio', active: false },
            { key: 'media', href: '/media', active: false },
            { key: 'kalendarz', href: '/kalendarz', active: false },
            { key: 'repertuar', href: '/repertuar', active: true },
            { key: 'fundacja', href: '/fundacja', active: false },
            { key: 'kontakt', href: '/kontakt', active: false },
          ].map((item) =>
            item.href.startsWith('/') && !item.href.includes('#') ? (
              <Link
                key={item.key}
                to={item.href}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.48,
                  color: '#131313',
                  textDecoration: item.active ? 'underline' : 'none',
                  textUnderlinePosition: item.active ? 'from-font' : undefined,
                }}
              >
                {t(`common.nav.${item.key}`)}
              </Link>
            ) : (
              <a
                key={item.key}
                href={item.href}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.48,
                  color: '#131313',
                  textDecoration: item.active ? 'underline' : 'none',
                  textUnderlinePosition: item.active ? 'from-font' : undefined,
                }}
              >
                {t(`common.nav.${item.key}`)}
              </a>
            )
          )}
        </nav>
      </div>
    </section>
  );
}
