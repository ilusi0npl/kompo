import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageText from '../../components/LanguageText/LanguageText';
import ContrastToggle from '../../components/ContrastToggle/ContrastToggle';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#A0E38A';
const BACKGROUND_COLOR = '#FDFDFD';
const TEXT_COLOR = '#131313';

export default function WydarzenieFixedLayer({ scale = 1, pageHeight = 1941 }) {
  const { t } = useTranslation();

  return (
    <>
      {/* Pionowe linie dekoracyjne - full page height */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${pageHeight * scale}px`,
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
          top: 0,
          left: 0,
          zIndex: 100,
          pointerEvents: 'none',
          width: `${1440 * scale}px`,
          height: `${documentHeight}px`,
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

        {/* Wydarzenie - pionowy tekst po lewej (rotacja 90 stopni) */}
        <div
          style={{
            position: 'absolute',
            left: `${94 * scale}px`,
            top: `${220 * scale}px`,
            width: `${45 * scale}px`,
            height: `${384 * scale}px`,
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
              transform: 'rotate(90deg)',
              whiteSpace: 'nowrap',
            }}
          >
            {t('wydarzenie.sideTitle')}
          </p>
        </div>

        {/* Language & Contrast Controls - top right */}
        <div
          style={{
            position: 'absolute',
            left: `${1265 * scale}px`,
            top: `${60 * scale}px`,
            pointerEvents: 'auto',
            zIndex: 101,
            display: 'flex',
            alignItems: 'center',
            gap: `${20 * scale}px`,
          }}
        >
          <LanguageText textColor={TEXT_COLOR} scale={scale} />
          <ContrastToggle iconColor={TEXT_COLOR} scale={scale} />
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
            { key: 'kalendarz', href: '/kalendarz', active: true },
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
