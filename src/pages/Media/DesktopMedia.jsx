import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import {
  photos,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
  BACKGROUND_COLOR,
  ACTIVE_TAB_COLOR,
} from './media-config';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#01936F';

export default function DesktopMedia() {
  // Grid positions for 3 columns x 2 rows
  const gridPositions = [
    { left: 185, top: 276 },  // Row 1, Col 1
    { left: 515, top: 276 },  // Row 1, Col 2
    { left: 845, top: 276 },  // Row 1, Col 3
    { left: 185, top: 613 },  // Row 2, Col 1
    { left: 515, top: 613 },  // Row 2, Col 2
    { left: 845, top: 613 },  // Row 2, Col 3
  ];

  return (
    <section
      data-section="media"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Pionowe linie dekoracyjne */}
      {LINE_POSITIONS.map((x) => (
        <div
          key={x}
          className="absolute top-0"
          style={{
            left: `${x}px`,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
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
            left: '185px',
            top: '60px',
            width: '149px',
            height: '60px',
          }}
        />
      </Link>

      {/* Media - pionowy tekst po lewej */}
      <img
        src="/assets/media/media-text.svg"
        alt="Media"
        className="absolute"
        style={{
          left: '94px',
          top: '276px',
          width: '49px',
          height: '187px',
        }}
      />

      {/* Nawigacja Zdjęcia / Wideo */}
      <span
        className="absolute"
        style={{
          left: '185px',
          top: '190px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.48,
          color: ACTIVE_TAB_COLOR,
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        Zdjęcia
      </span>
      <Link
        to="/media/wideo"
        className="absolute"
        style={{
          left: '405px',
          top: '190px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.48,
          color: '#131313',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        Wideo
      </Link>

      {/* Photo Grid */}
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className="absolute flex flex-col"
          style={{
            left: `${gridPositions[index].left}px`,
            top: `${gridPositions[index].top}px`,
            width: '300px',
            gap: '16px',
          }}
        >
          {/* Photo */}
          <div
            className="relative overflow-hidden"
            style={{
              width: '300px',
              height: '214px',
            }}
          >
            <img
              src={photo.image}
              alt={photo.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '50% 50%' }}
            />
          </div>

          {/* Photo info */}
          <div className="flex flex-col" style={{ gap: '8px' }}>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: 1.45,
                color: '#131313',
                textDecoration: 'underline',
                textTransform: 'uppercase',
              }}
            >
              {photo.title}
            </p>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: 1.48,
                color: '#131313',
              }}
            >
              fot. {photo.photographer}
            </p>
          </div>
        </div>
      ))}

      {/* Stopka */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: '1016px',
          width: '520px',
        }}
      />

      {/* Prawa nawigacja */}
      <div
        className="absolute"
        style={{
          left: '1265px',
          top: '60px',
          width: '100px',
        }}
      >
        {/* ENG */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: 1.44,
            color: '#131313',
            textTransform: 'uppercase',
          }}
        >
          ENG
        </p>

        {/* Menu items */}
        <nav
          className="absolute flex flex-col"
          style={{
            top: '308px',
            left: '0',
            gap: '22px',
          }}
        >
          {[
            { name: 'Bio', href: '/bio', active: false },
            { name: 'Media', href: '/media', active: true },
            { name: 'Kalendarz', href: '/kalendarz', active: false },
            { name: 'Repertuar', href: '#repertuar', active: false },
            { name: 'Fundacja', href: '#fundacja', active: false },
            { name: 'Kontakt', href: '/kontakt', active: false },
          ].map((item) => (
            item.href.startsWith('/') ? (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.48,
                  color: '#131313',
                  textDecoration: item.active ? 'underline' : 'none',
                }}
              >
                {item.name}
              </Link>
            ) : (
              <a
                key={item.name}
                href={item.href}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.48,
                  color: '#131313',
                  textDecoration: item.active ? 'underline' : 'none',
                }}
              >
                {item.name}
              </a>
            )
          ))}
        </nav>
      </div>
    </section>
  );
}
