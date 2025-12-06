import { Link } from 'react-router';
import { createPortal } from 'react-dom';

export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Bio', to: '/bio' },
    { label: 'Media', to: '/media' },
    { label: 'Kalendarz', to: '/kalendarz' },
    { label: 'Repertuar', to: '#' },
    { label: 'Kontakt', to: '/kontakt' },
  ];

  // Use portal to render menu outside of scaled wrapper
  // Position fixed relative to viewport
  const menuContent = (
    <div
      className="fixed overflow-hidden"
      style={{
        right: 0,
        top: 0,
        width: '52.6%', // ~205px on 390px = 52.6%
        height: '100vh',
        backgroundColor: '#FDFDFD',
        borderLeft: '1px solid #131313',
        zIndex: 9999,
      }}
    >
      {/* Close icon - positioned relative to panel width */}
      <button
        onClick={onClose}
        className="absolute"
        style={{
          right: '20px',
          top: '44px',
          width: '24px',
          height: '24px',
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <img
          src="/assets/mobile/close-icon.svg"
          alt="Close menu"
          style={{ width: '24px', height: '24px' }}
        />
      </button>

      {/* Menu items - centered vertically */}
      <nav
        className="absolute flex flex-col"
        style={{
          left: '20%',
          top: '50%',
          transform: 'translateY(-50%)',
          gap: '40px',
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
              fontSize: '18px',
              lineHeight: 'normal',
              color: '#131313',
              textDecoration: 'none',
            }}
          >
            {item.label}
          </Link>
        ))}
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: 'normal',
            color: '#131313',
            cursor: 'pointer',
          }}
        >
          ENG
        </span>
      </nav>
    </div>
  );

  // Render using portal to escape the scaled wrapper
  return createPortal(menuContent, document.body);
}
