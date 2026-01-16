import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';

const DESKTOP_WIDTH = 1440;
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#FFBD19';
const BACKGROUND_COLOR = '#FF734C';
const TEXT_COLOR = '#131313';

export default function KontaktFixedLayer({ scale = 1, viewportHeight = 700 }) {
  const { t } = useTranslation();

  return (
    <>
      {/* Fixed background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: BACKGROUND_COLOR,
          zIndex: 0,
        }}
      />

      {/* Pionowe linie dekoracyjne - fixed */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      >
        {LINE_POSITIONS.map((x) => (
          <div
            key={x}
            style={{
              position: 'absolute',
              left: `${x * scale}px`,
              top: 0,
              width: `${1 * scale}px`,
              height: '100%',
              backgroundColor: LINE_COLOR,
            }}
          />
        ))}
      </div>

      {/* FIXED LAYER - Logo, Side Title, Menu */}
      <div
        style={{
          position: 'fixed',
          zIndex: 100,
          pointerEvents: 'none',
          width: `${DESKTOP_WIDTH * scale}px`,
          height: `${viewportHeight}px`,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            position: 'absolute',
            left: `${185 * scale}px`,
            top: `${60 * scale}px`,
            pointerEvents: 'auto',
            zIndex: 101,
          }}
        >
          <img
            src="/assets/logo.svg"
            alt="Kompopolex"
            style={{
              width: `${149 * scale}px`,
              height: `${60 * scale}px`,
            }}
          />
        </Link>

        {/* Kontakt - pionowy tekst po lewej (rotacja 90 stopni) */}
        <div
          style={{
            position: 'absolute',
            left: `${94 * scale}px`,
            top: `${371 * scale}px`,
            width: `${45 * scale}px`,
            height: `${269 * scale}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 101,
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: `${64 * scale}px`,
              lineHeight: 1.4,
              color: TEXT_COLOR,
              transform: 'rotate(90deg)',
              whiteSpace: 'nowrap',
            }}
          >
            {t('kontakt.sideTitle')}
          </p>
        </div>

        {/* Language Toggle - top right */}
        <div
          style={{
            position: 'absolute',
            left: `${1265 * scale}px`,
            top: `${60 * scale}px`,
            pointerEvents: 'auto',
            zIndex: 101,
          }}
        >
          <LanguageToggle textColor={TEXT_COLOR} scale={scale} />
        </div>

        {/* Prawa nawigacja - menu items */}
        <nav
          style={{
            position: 'absolute',
            left: `${1265 * scale}px`,
            top: `${368 * scale}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: `${22 * scale}px`,
            pointerEvents: 'auto',
            zIndex: 101,
          }}
        >
          {[
            { key: 'bio', href: '/bio', active: false },
            { key: 'media', href: '/media', active: false },
            { key: 'kalendarz', href: '/kalendarz', active: false },
            { key: 'repertuar', href: '/repertuar', active: false },
            { key: 'fundacja', href: '/fundacja', active: false },
            { key: 'kontakt', href: '/kontakt', active: true },
          ].map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className={`nav-link ${item.active ? 'nav-link--active' : ''}`}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
                fontSize: `${18 * scale}px`,
                lineHeight: 1.48,
                color: TEXT_COLOR,
              }}
            >
              {t(`common.nav.${item.key}`)}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
