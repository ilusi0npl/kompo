import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';

const DESKTOP_WIDTH = 1440;
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#A0E38A';
const BACKGROUND_COLOR = '#FDFDFD';
const TEXT_COLOR = '#131313';
const ACTIVE_COLOR = '#761FE0';

export default function SpecjalneFixedLayer({ scale = 1, viewportHeight = 700 }) {
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

      {/* FIXED LAYER - Logo, Side Title, Tabs, Menu */}
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

        {/* Repertuar - pionowy tekst po lewej (rotacja 90 stopni) */}
        <div
          style={{
            position: 'absolute',
            left: `${94 * scale}px`,
            top: `${275 * scale}px`,
            width: `${45 * scale}px`,
            height: `${346 * scale}px`,
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
              lineHeight: 1.1,
              color: TEXT_COLOR,
              whiteSpace: 'nowrap',
              transform: 'rotate(90deg)',
              transformOrigin: 'center',
            }}
          >
            {t('repertuar.sideTitle')}
          </p>
        </div>

        {/* Navigation Tabs - Specjalne active */}
        <Link
          to="/repertuar"
          className="filter-tab"
          style={{
            position: 'absolute',
            left: `${185 * scale}px`,
            top: `${190 * scale}px`,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: `${24 * scale}px`,
            lineHeight: 1.44,
            color: TEXT_COLOR,
            pointerEvents: 'auto',
            zIndex: 101,
          }}
        >
          {t('repertuar.tabs.full')}
        </Link>
        <span
          className="filter-tab filter-tab--active"
          style={{
            position: 'absolute',
            left: `${515 * scale}px`,
            top: `${190 * scale}px`,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: `${24 * scale}px`,
            lineHeight: 1.44,
            color: ACTIVE_COLOR,
            pointerEvents: 'auto',
            zIndex: 101,
          }}
        >
          {t('repertuar.tabs.special')}
        </span>

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
            { key: 'repertuar', href: '/repertuar', active: true },
            { key: 'fundacja', href: '/fundacja', active: false },
            { key: 'kontakt', href: '/kontakt', active: false },
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
