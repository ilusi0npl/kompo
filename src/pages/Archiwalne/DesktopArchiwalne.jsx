import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import {
  archivedEvents,
  desktopLinePositions,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './archiwalne-config';

export default function DesktopArchiwalne() {
  return (
    <section
      data-section="archiwalne"
      className="relative overflow-hidden"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: '#FDFDFD',
      }}
    >
      {/* Pionowe linie w tle */}
      {desktopLinePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0"
          style={{
            left: `${left}px`,
            width: '1px',
            height: '100%',
            backgroundColor: '#A0E38A',
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

      {/* Kalendarz - pionowy tekst po lewej (rotacja 90 stopni) */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '94px',
          top: '275px',
          width: '45px',
          height: '346px',
        }}
      >
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '64px',
            lineHeight: 1.1,
            color: '#131313',
            transform: 'rotate(-90deg)',
            whiteSpace: 'nowrap',
          }}
        >
          Kalendarz
        </p>
      </div>

      {/* Nawigacja Nadchodzące / Archiwalne */}
      <Link
        to="/kalendarz"
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
        Nadchodzące
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
          color: '#761FE0',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        Archiwalne
      </span>

      {/* Event cards - 3x2 grid */}
      {archivedEvents.map((event) => (
        <div
          key={event.id}
          className="absolute flex flex-col"
          style={{
            left: `${event.position.left}px`,
            top: `${event.position.top}px`,
            width: '300px',
            gap: '16px',
          }}
        >
          {/* Image */}
          <div
            className="relative"
            style={{
              width: '300px',
              height: '420px',
              border: event.hasBorder ? '1px solid #131313' : 'none',
              overflow: 'hidden',
            }}
          >
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: 'cover',
                objectPosition: '50% 50%',
              }}
            />
          </div>

          {/* Text content */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            {/* Date */}
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: 1.48,
                color: '#131313',
              }}
            >
              {event.date}
            </p>

            {/* Title and performers */}
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <Link
                to={`/wydarzenie/${event.id}`}
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
                {event.title}
              </Link>
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: 1.48,
                  color: '#131313',
                }}
              >
                {event.performers}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Stopka */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: '1728px',
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
            { name: 'Media', href: '#media', active: false },
            { name: 'Kalendarz', href: '/kalendarz', active: true },
            { name: 'Repertuar', href: '#repertuar', active: false },
            { name: 'Fundacja', href: '#fundacja', active: false },
            { name: 'Kontakt', href: '#kontakt', active: false },
          ].map((item) =>
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
          )}
        </nav>
      </div>
    </section>
  );
}
