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
  const scaledLangFontSize = 18 * scale; // Same as menu items from Figma
  const scaledGap = 22 * scale; // Figma: gap-[22px]
  const scaledCloseSize = 24 * scale;
  // Figma: left-[calc(50%+40.5px)] = 102.5 + 40.5 = 143px from left
  // So right = 205 - 143 - 24 = 38px
  const scaledCloseLeft = 143 * scale;
  const scaledCloseTop = 44 * scale;
  const scaledNavLeft = 39 * scale;
  const scaledNavOffset = 59 * scale; // Figma: top-[calc(50%+59px)]
  const scaledEyeSize = 28 * scale; // Eye icon size from Figma

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
            lineHeight: 1.48,
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
        {/* Eye icon - accessibility/contrast toggle placeholder */}
        <button
          onClick={() => {
            // TODO: Implement contrast toggle
          }}
          style={{
            width: `${scaledEyeSize}px`,
            height: `${scaledEyeSize}px`,
            padding: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <svg
            width={scaledEyeSize}
            height={scaledEyeSize}
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 21.0001C8.11767 21.0083 2.33333 17.8664 2.33333 14.0001C2.33333 10.1338 8.148 6.98026 14 7.00009C19.852 7.01993 25.6667 10.1338 25.6667 14.0001C25.6667 17.8664 19.8823 20.9919 14 21.0001ZM14 18.6668C15.2377 18.6668 16.4247 18.1751 17.2998 17.2999C18.175 16.4248 18.6667 15.2378 18.6667 14.0001C18.6667 12.7624 18.175 11.5754 17.2998 10.7003C16.4247 9.82509 15.2377 9.33343 14 9.33343C12.7623 9.33343 11.5753 9.82509 10.7002 10.7003C9.825 11.5754 9.33333 12.7624 9.33333 14.0001C9.33333 15.2378 9.825 16.4248 10.7002 17.2999C11.5753 18.1751 12.7623 18.6668 14 18.6668ZM14 16.3334C13.3812 16.3334 12.7877 16.0876 12.3501 15.65C11.9125 15.2124 11.6667 14.6189 11.6667 14.0001C11.6667 13.3813 11.9125 12.7878 12.3501 12.3502C12.7877 11.9126 13.3812 11.6668 14 11.6668C14.6188 11.6668 15.2123 11.9126 15.6499 12.3502C16.0875 12.7878 16.3333 13.3813 16.3333 14.0001C16.3333 14.6189 16.0875 15.2124 15.6499 15.65C15.2123 16.0876 14.6188 16.3334 14 16.3334Z"
              fill="#131313"
            />
          </svg>
        </button>
      </nav>
    </div>
  );

  return createPortal(menuContent, portalRoot);
}
