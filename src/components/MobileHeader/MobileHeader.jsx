import { useState } from 'react';
import { Link } from 'react-router';
import MobileMenu from '../MobileMenu/MobileMenu';

const MOBILE_WIDTH = 390;

/**
 * Generyczny nagłówek mobilny z logo, MENU i tytułem strony
 *
 * @param {string} title - Tytuł strony
 * @param {string} textColor - Kolor tekstu (domyślnie #131313)
 * @param {string} backgroundColor - Kolor tła (opcjonalny, domyślnie transparent)
 * @param {Array} navLinks - Opcjonalne linki nawigacyjne [{label, to, isActive}]
 * @param {string} activeColor - Kolor aktywnego linku (domyślnie #761FE0)
 */
export default function MobileHeader({
  title,
  textColor = '#131313',
  backgroundColor = 'transparent',
  navLinks = null,
  activeColor = '#761FE0',
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="relative"
      style={{
        width: `${MOBILE_WIDTH}px`,
        height: '281px',
        backgroundColor,
      }}
    >
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
            top: '120px',
            gap: '20px',
          }}
        >
          {navLinks.map((link, index) => (
            link.isActive ? (
              <span
                key={index}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: '16px',
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
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: 1.44,
                  color: textColor,
                  textDecoration: 'none',
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
          top: '192px',
        }}
      >
        <span
          style={{
            display: 'block',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '40px',
            lineHeight: 1.2,
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
}
