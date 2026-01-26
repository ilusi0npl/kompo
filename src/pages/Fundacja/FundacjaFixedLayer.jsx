import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageText from '../../components/LanguageText/LanguageText';
import ContrastToggle from '../../components/ContrastToggle/ContrastToggle';
import FixedPortal from '../../components/FixedPortal/FixedPortal';
import LinesPortal from '../../components/LinesPortal/LinesPortal';

const DESKTOP_WIDTH = 1440;
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#01936F';
const BACKGROUND_COLOR = '#34B898';
const TEXT_COLOR = '#131313';

export default function FundacjaFixedLayer({ scale = 1, viewportHeight = 700 }) {
  const [documentHeight, setDocumentHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      setDocumentHeight(Math.max(document.documentElement.scrollHeight, window.innerHeight));
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    // Update on content changes
    const observer = new MutationObserver(updateHeight);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('resize', updateHeight);
      observer.disconnect();
    };
  }, []);

  const { t } = useTranslation();

  return (
    <>
      {/* Full-page background - BELOW content */}
      <LinesPortal>
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
      </LinesPortal>

      {/* Full-page decorative lines - ABOVE content via FixedPortal */}
      <FixedPortal>
        {LINE_POSITIONS.map((x) => (
          <div
            key={x}
            className="decorative-line"
            style={{
              position: 'fixed',
              top: 0,
              left: `${x * scale}px`,
              width: '1px',
              height: '100vh',
              backgroundColor: LINE_COLOR,
              pointerEvents: 'none',
              zIndex: 50,
            }}
          />
        ))}
      </FixedPortal>

      {/* FIXED LAYER - Logo, Side Title, Menu - ABOVE content */}
      <FixedPortal>
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

        {/* Fundacja - pionowy tekst po lewej (rotacja 90 stopni) */}
        <div
          style={{
            position: 'absolute',
            left: `${94 * scale}px`,
            top: `${180 * scale}px`,
            width: `${45 * scale}px`,
            height: `${307 * scale}px`,
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
            {t('fundacja.sideTitle')}
          </p>
        </div>

        {/* Language & Contrast Controls - top right */}
        <div
          className="controls-container"
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
            { key: 'kalendarz', href: '/kalendarz', active: false },
            { key: 'repertuar', href: '/repertuar', active: false },
            { key: 'fundacja', href: '/fundacja', active: true },
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
      </FixedPortal>
    </>
  );
}
