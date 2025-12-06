import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import {
  videos,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
  BACKGROUND_COLOR,
  ACTIVE_TAB_COLOR,
} from './media-wideo-config';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#3478FF';

export default function DesktopMediaWideo() {
  // Grid positions for 2 columns x 2 rows
  const gridPositions = [
    { left: 185, top: 275 },  // Row 1, Col 1
    { left: 690, top: 275 },  // Row 1, Col 2
    { left: 185, top: 655 },  // Row 2, Col 1
    { left: 690, top: 655 },  // Row 2, Col 2
  ];

  return (
    <section
      data-section="media-wideo"
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
          top: '275px',
          width: '49px',
          height: '187px',
        }}
      />

      {/* Nawigacja Zdjęcia / Wideo */}
      <Link
        to="/media"
        className="absolute"
        style={{
          left: '185px',
          top: '190px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.44,
          color: '#131313',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        Zdjęcia
      </Link>
      <span
        className="absolute"
        style={{
          left: '405px',
          top: '190px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.44,
          color: ACTIVE_TAB_COLOR,
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        Wideo
      </span>

      {/* Video Grid */}
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="absolute flex flex-col"
          style={{
            left: `${gridPositions[index].left}px`,
            top: `${gridPositions[index].top}px`,
            width: '455px',
            gap: '16px',
          }}
        >
          {/* Video Thumbnail with Play Button */}
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block overflow-hidden"
            style={{
              width: '455px',
              height: '256px',
            }}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '50% 50%' }}
            />
            {/* Play Icon */}
            <div
              className="absolute"
              style={{
                left: '198px',
                top: '98px',
                width: '60px',
                height: '60px',
              }}
            >
              <img
                src="/assets/media-wideo/play-icon.svg"
                alt="Play"
                className="w-full h-full"
              />
            </div>
          </a>

          {/* Video Title */}
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
            {video.title}
          </p>
        </div>
      ))}

      {/* Stopka */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: '1111px',
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
