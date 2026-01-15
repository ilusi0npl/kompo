import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import MobileMenu from '../MobileMenu/MobileMenu';
import { useFixedMobileHeader } from '../../hooks/useFixedMobileHeader';

const MOBILE_WIDTH = 390;
const DEFAULT_HEADER_HEIGHT = 257;
const DEFAULT_LINE_POSITIONS = [97, 195, 292];

/**
 * Generyczny nagłówek mobilny z logo, MENU i tytułem strony
 *
 * @param {string} title - Tytuł strony
 * @param {string} textColor - Kolor tekstu (domyślnie #131313)
 * @param {string} backgroundColor - Kolor tła (opcjonalny, domyślnie transparent)
 * @param {Array} navLinks - Opcjonalne linki nawigacyjne [{label, to, isActive}]
 * @param {string} activeColor - Kolor aktywnego linku (domyślnie #761FE0)
 * @param {boolean} isFixed - Czy nagłówek ma być fixed (portal) - domyślnie false
 * @param {number} headerHeight - Wysokość nagłówka dla fixed mode (domyślnie 257)
 * @param {string} lineColor - Kolor pionowych linii w nagłówku (opcjonalny)
 * @param {Array} linePositions - Pozycje X linii (domyślnie [97, 195, 292])
 * @param {number} navLinksTop - Pozycja Y linków nawigacyjnych (domyślnie 120)
 * @param {number} navLinksGap - Odstęp między linkami (domyślnie 20)
 * @param {number} navLinksFontSize - Rozmiar fontu linków nawigacyjnych (domyślnie 16)
 */
export default function MobileHeader({
  title,
  textColor = '#131313',
  backgroundColor = 'transparent',
  navLinks = null,
  activeColor = '#761FE0',
  isFixed = false,
  headerHeight = DEFAULT_HEADER_HEIGHT,
  lineColor = null,
  linePositions = DEFAULT_LINE_POSITIONS,
  navLinksTop = 120,
  navLinksGap = 20,
  navLinksFontSize = 16,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scale } = useFixedMobileHeader();

  const headerContent = (
    <div
      className={isFixed ? 'fixed top-0 left-0' : 'relative'}
      style={{
        width: `${MOBILE_WIDTH}px`,
        height: `${headerHeight}px`,
        backgroundColor,
        ...(isFixed && {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          zIndex: 100,
        }),
      }}
    >
      {/* Pionowe linie w nagłówku (tylko gdy isFixed i lineColor) */}
      {isFixed && lineColor && linePositions.map((left, index) => (
        <div
          key={`header-line-${index}`}
          className="absolute top-0"
          style={{
            left: `${left}px`,
            width: '1px',
            height: `${headerHeight}px`,
            backgroundColor: lineColor,
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
            left: '20px',
            top: '40px',
            width: '104px',
            height: '42px',
          }}
        />
      </Link>

      {/* MENU button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="absolute"
        style={{
          left: '312px',
          top: '43px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: 'normal',
          color: textColor,
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        MENU
      </button>

      {/* Nawigacja (opcjonalna) */}
      {navLinks && navLinks.length > 0 && (
        <div
          className="absolute flex"
          style={{
            left: '20px',
            top: `${navLinksTop}px`,
            gap: `${navLinksGap}px`,
          }}
        >
          {navLinks.map((link, index) => (
            link.isActive ? (
              <span
                key={index}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: `${navLinksFontSize}px`,
                  lineHeight: 1.44,
                  color: activeColor,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                {link.label}
              </span>
            ) : (
              <Link
                key={index}
                to={link.to}
                className="nav-link"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: `${navLinksFontSize}px`,
                  lineHeight: 1.44,
                  color: textColor,
                }}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>
      )}

      {/* Tytuł strony */}
      <div
        className="absolute"
        style={{
          left: '20px',
          top: '152px',
        }}
      >
        <span
          style={{
            display: 'block',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '48px',
            lineHeight: 1.35,
            color: textColor,
          }}
        >
          {title}
        </span>
      </div>

      {/* MobileMenu overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );

  // When fixed, render via portal to document.body
  if (isFixed && typeof document !== 'undefined') {
    return createPortal(headerContent, document.body);
  }

  return headerContent;
}

/**
 * Spacer component to offset content below fixed header
 */
export function MobileHeaderSpacer({ height = DEFAULT_HEADER_HEIGHT }) {
  return <div style={{ height: `${height}px` }} />;
}
