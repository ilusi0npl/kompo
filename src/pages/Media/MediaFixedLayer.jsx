import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';

const DESKTOP_WIDTH = 1440;
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#01936F';
const BACKGROUND_COLOR = '#34B898';
const TEXT_COLOR = '#131313';
const ACTIVE_COLOR = '#761FE0';

export default function MediaFixedLayer({ scale = 1, viewportHeight = 700, isPhotosActive = true }) {
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

      {/* Pionowe linie dekoracyjne - scrollable full height */}
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
          top: 0,
          left: 0,
          zIndex: 100,
          pointerEvents: 'none',
          width: `${DESKTOP_WIDTH * scale}px`,
          height: `${250 * scale}px`,
          backgroundColor: BACKGROUND_COLOR,
        }}
      >
        {/* Pionowe linie w fixed header */}
        {LINE_POSITIONS.map((x) => (
          <div
            key={`header-${x}`}
            style={{
              position: 'absolute',
              left: `${x * scale}px`,
              top: 0,
              width: `${1 * scale}px`,
              height: '100%',
              backgroundColor: LINE_COLOR,
              zIndex: 101,
            }}
          />
        ))}

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

        {/* Media - pionowy tekst po lewej (SVG) */}
        <img
          src="/assets/media/media-text.svg"
          alt="Media"
          style={{
            position: 'absolute',
            left: `${94 * scale}px`,
            top: `${276 * scale}px`,
            width: `${49 * scale}px`,
            height: `${187 * scale}px`,
            zIndex: 101,
          }}
        />

        {/* Nawigacja Zdjęcia / Wideo */}
        {isPhotosActive ? (
          <>
            <span
              className="filter-tab filter-tab--active"
              style={{
                position: 'absolute',
                left: `${185 * scale}px`,
                top: `${190 * scale}px`,
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: `${24 * scale}px`,
                lineHeight: 1.48,
                color: ACTIVE_COLOR,
                pointerEvents: 'auto',
                zIndex: 101,
              }}
            >
              {t('common.tabs.photos')}
            </span>
            <Link
              to="/media/wideo"
              className="filter-tab"
              style={{
                position: 'absolute',
                left: `${405 * scale}px`,
                top: `${190 * scale}px`,
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: `${24 * scale}px`,
                lineHeight: 1.48,
                color: TEXT_COLOR,
                pointerEvents: 'auto',
                zIndex: 101,
              }}
            >
              {t('common.tabs.video')}
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/media"
              className="filter-tab"
              style={{
                position: 'absolute',
                left: `${185 * scale}px`,
                top: `${190 * scale}px`,
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: `${24 * scale}px`,
                lineHeight: 1.48,
                color: TEXT_COLOR,
                pointerEvents: 'auto',
                zIndex: 101,
              }}
            >
              {t('common.tabs.photos')}
            </Link>
            <span
              className="filter-tab filter-tab--active"
              style={{
                position: 'absolute',
                left: `${405 * scale}px`,
                top: `${190 * scale}px`,
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: `${24 * scale}px`,
                lineHeight: 1.48,
                color: ACTIVE_COLOR,
                pointerEvents: 'auto',
                zIndex: 101,
              }}
            >
              {t('common.tabs.video')}
            </span>
          </>
        )}

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
            { key: 'media', href: '/media', active: true },
            { key: 'kalendarz', href: '/kalendarz', active: false },
            { key: 'repertuar', href: '/repertuar', active: false },
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
