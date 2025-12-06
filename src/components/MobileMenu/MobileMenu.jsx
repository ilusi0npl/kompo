import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../hooks/useTranslation';

const MOBILE_WIDTH = 390;
const MENU_WIDTH = 205;
const MENU_HEIGHT = 548;

export default function MobileMenu({ isOpen, onClose }) {
  const { language, toggleLanguage } = useTranslation();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      // Menu is for mobile view, scale proportionally to viewport
      setScale(window.innerWidth / MOBILE_WIDTH);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  if (!isOpen) return null;

  const menuItems = [
    { label: 'Bio', to: '/bio' },
    { label: 'Media', to: '/media' },
    { label: 'Kalendarz', to: '/kalendarz' },
    { label: 'Repertuar', to: '#' },
    { label: 'Kontakt', to: '/kontakt' },
  ];

  // Scaled dimensions - all from Figma 205x548 frame
  const scaledMenuWidth = MENU_WIDTH * scale;
  const scaledMenuHeight = MENU_HEIGHT * scale;
  const scaledFontSize = 18 * scale;
  const scaledLangFontSize = 20 * scale;
  const scaledGap = 40 * scale;
  const scaledCloseSize = 24 * scale;
  // Close icon position from Figma: x=144, but relative to menu right edge (205-144-24=37 from right, but we use 12 for visual centering)
  const scaledCloseRight = 17 * scale;
  const scaledCloseTop = 44 * scale;
  // Nav left from Figma: 39px from left edge of menu
  const scaledNavLeft = 39 * scale;
  // Nav vertical center with offset (from Figma: top: calc(50% + 64px))
  const scaledNavOffset = 64 * scale;

  // Use portal to render menu outside of scaled wrapper
  const menuContent = (
    <div
      className="fixed overflow-hidden"
      style={{
        right: 0,
        top: 0,
        width: `${scaledMenuWidth}px`,
        height: `${scaledMenuHeight}px`,
        backgroundColor: '#FDFDFD',
        borderLeft: '1px solid #131313',
        borderBottom: '1px solid #131313',
        zIndex: 9999,
      }}
    >
      {/* Close icon - position from Figma */}
      <button
        onClick={onClose}
        className="absolute"
        style={{
          right: `${scaledCloseRight}px`,
          top: `${scaledCloseTop}px`,
          width: `${scaledCloseSize}px`,
          height: `${scaledCloseSize}px`,
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <img
          src="/assets/mobile/close-icon.svg"
          alt="Close menu"
          style={{ width: '100%', height: '100%' }}
        />
      </button>

      {/* Menu items - centered vertically with offset */}
      <nav
        className="absolute flex flex-col"
        style={{
          left: `${scaledNavLeft}px`,
          top: '50%',
          transform: `translateY(calc(-50% + ${scaledNavOffset}px))`,
          gap: `${scaledGap}px`,
        }}
      >
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            onClick={onClose}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: `${scaledFontSize}px`,
              lineHeight: 'normal',
              color: '#131313',
              textDecoration: 'none',
            }}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={() => {
            toggleLanguage();
            onClose();
          }}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: `${scaledLangFontSize}px`,
            lineHeight: 'normal',
            color: '#131313',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            padding: 0,
            textAlign: 'left',
          }}
        >
          {language === 'pl' ? 'ENG' : 'PL'}
        </button>
      </nav>
    </div>
  );

  // Render using portal to escape the scaled wrapper
  return createPortal(menuContent, document.body);
}
