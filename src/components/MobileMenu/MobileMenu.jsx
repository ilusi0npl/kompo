import { Link } from 'react-router';

export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Bio', to: '/bio' },
    { label: 'Media', to: '/media' },
    { label: 'Kalendarz', to: '/kalendarz' },
    { label: 'Repertuar', to: '/repertuar' },
    { label: 'Kontakt', to: '/kontakt' },
  ];

  // Panel pozycjonowany absolutnie w sekcji 390x683
  // left: 50% - 10px = 185px
  // top: calc(50% - 67.5px) z translateY(-50%) = (341.5 - 67.5) - 274 = 0px
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: '185px',
        top: '50%',
        transform: 'translateY(calc(-50% - 67.5px))',
        width: '205px',
        height: '548px',
        backgroundColor: '#FDFDFD',
        borderLeft: '1px solid #131313',
        borderBottom: '1px solid #131313',
        zIndex: 50,
      }}
    >
      {/* Close icon - pozycja: left + 50% + 40.5 = 185 + 102.5 + 40.5 = w panelu: 143px from panel left */}
      <button
        onClick={onClose}
        className="absolute"
        style={{
          left: '143px',
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

      {/* Menu items - z Figma: top: calc(50% + 64px) z translateY(-50%) */}
      <nav
        className="absolute flex flex-col"
        style={{
          left: '39px',
          top: '50%',
          transform: 'translateY(calc(-50% + 64px))',
          gap: '40px',
          width: '100px',
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
            width: '100px',
          }}
        >
          ENG
        </span>
      </nav>
    </div>
  );
}
