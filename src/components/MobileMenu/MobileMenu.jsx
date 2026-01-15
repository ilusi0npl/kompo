import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';

const MOBILE_WIDTH = 390;
const MENU_WIDTH = 205;
const MENU_HEIGHT = 548;

export default function MobileMenu({ isOpen, onClose }) {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const [scale, setScale] = useState(1);
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    // Create or find portal root inside React tree
    let root = document.getElementById('mobile-menu-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'mobile-menu-root';
      document.body.appendChild(root);
    }
    setPortalRoot(root);
  }, []);

  useEffect(() => {
    const updateScale = () => {
      // Menu is for mobile view, scale proportionally to viewport
      setScale(window.innerWidth / MOBILE_WIDTH);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  if (!isOpen || !portalRoot) return null;

  const menuItems = [
    { labelKey: 'common.nav.bio', to: '/bio' },
    { labelKey: 'common.nav.media', to: '/media' },
    { labelKey: 'common.nav.kalendarz', to: '/kalendarz' },
    { labelKey: 'common.nav.repertuar', to: '/repertuar' },
    { labelKey: 'common.nav.fundacja', to: '/fundacja' },
    { labelKey: 'common.nav.kontakt', to: '/kontakt' },
  ];

  // Scaled dimensions - all from Figma 205x548 frame
  const scaledMenuWidth = MENU_WIDTH * scale;
  const scaledMenuHeight = MENU_HEIGHT * scale;
  const scaledFontSize = 18 * scale;
  const scaledLangFontSize = 20 * scale;
  const scaledGap = 40 * scale;
  const scaledCloseSize = 24 * scale;
  // Figma: left-[calc(50%+40.5px)] = 102.5 + 40.5 = 143px from left
  // So right = 205 - 143 - 24 = 38px
  const scaledCloseLeft = 143 * scale;
  const scaledCloseTop = 44 * scale;
  const scaledNavLeft = 39 * scale;
  const scaledNavOffset = 64 * scale;

  const handleToggleLanguage = () => {
    toggleLanguage();
    // Close menu after a small delay to allow language change to propagate
    setTimeout(() => {
      onClose();
    }, 50);
  };

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
      {/* Close icon - position from Figma: left-[calc(50%+40.5px)] top-[44px] */}
      <button
        onClick={onClose}
        className="absolute"
        style={{
          left: `${scaledCloseLeft}px`,
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
            key={item.labelKey}
            to={item.to}
            onClick={onClose}
            className="nav-link"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: `${scaledFontSize}px`,
              lineHeight: 'normal',
              color: '#131313',
            }}
          >
            {t(item.labelKey)}
          </Link>
        ))}
        <button
          onClick={handleToggleLanguage}
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

  return createPortal(menuContent, portalRoot);
}
