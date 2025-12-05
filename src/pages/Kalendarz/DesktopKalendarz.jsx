import { Link } from 'react-router';
import {
  events,
  desktopLinePositions,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './kalendarz-config';

export default function DesktopKalendarz() {
  return (
    <section
      data-section="kalendarz"
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
      <span
        className="absolute"
        style={{
          left: '185px',
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
        Nadchodzące
      </span>
      <Link
        to="/archiwalne"
        className="absolute"
        style={{
          left: '405px',
          top: '190px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.44,
          color: '#131313',
          cursor: 'pointer',
          textDecoration: 'none',
        }}
      >
        Archiwalne
      </Link>

      {/* Event 1 */}
      <div className="absolute" style={{ left: '185px', top: '275px', width: '330px', height: '462px' }}>
        <img
          src={events[0].image}
          alt={events[0].title}
          className="absolute inset-0 w-full h-full"
          style={events[0].imageStyle}
        />
      </div>
      <div className="absolute flex flex-col" style={{ left: '625px', top: '275px', width: '519px', gap: '20px' }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: '20px', lineHeight: 1.44, color: '#131313' }}>
          {events[0].date}
        </p>
        <div className="flex flex-col" style={{ gap: '32px' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: '32px', lineHeight: 1.4, color: '#131313', textDecoration: 'underline', textTransform: 'uppercase' }}>
              {events[0].title}
            </p>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '16px', lineHeight: 1.48, color: '#131313' }}>
              {events[0].performers}
            </p>
          </div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, fontSize: '16px', lineHeight: 1.48, color: '#131313' }}>
            {events[0].description}
          </p>
          <div className="flex items-center" style={{ gap: '10px' }}>
            <img src="/assets/kalendarz/place-icon.svg" alt="Location" style={{ width: '30px', height: '30px' }} />
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '20px', lineHeight: 1.44, color: '#131313', textTransform: 'uppercase' }}>
              {events[0].location}
            </p>
          </div>
        </div>
      </div>

      {/* Event 2 */}
      <div className="absolute overflow-hidden" style={{ left: '185px', top: '807px', width: '330px', height: '462px' }}>
        <img
          src={events[1].image}
          alt={events[1].title}
          style={events[1].imageStyle}
        />
      </div>
      <div className="absolute flex flex-col" style={{ left: '625px', top: '807px', width: '519px', gap: '20px' }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: '20px', lineHeight: 1.44, color: '#131313' }}>
          {events[1].date}
        </p>
        <div className="flex flex-col" style={{ gap: '32px' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: '32px', lineHeight: 1.4, color: '#131313', textDecoration: 'underline', textTransform: 'uppercase' }}>
              {events[1].title}
            </p>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '16px', lineHeight: 1.48, color: '#131313' }}>
              {events[1].performers}
            </p>
          </div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, fontSize: '16px', lineHeight: 1.48, color: '#131313' }}>
            {events[1].description}
          </p>
          <div className="flex items-start" style={{ gap: '10px' }}>
            <img src="/assets/kalendarz/place-icon.svg" alt="Location" style={{ width: '30px', height: '30px' }} />
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '20px', lineHeight: 1.44, color: '#131313', textTransform: 'uppercase', width: '479px', whiteSpace: 'pre-wrap' }}>
              {events[1].location}
            </p>
          </div>
        </div>
      </div>

      {/* Event 3 */}
      <div className="absolute" style={{ left: '185px', top: '1339px', width: '330px', height: '462px' }}>
        <img
          src={events[2].image}
          alt={events[2].title}
          className="absolute inset-0 w-full h-full"
          style={events[2].imageStyle}
        />
      </div>
      <div className="absolute flex flex-col" style={{ left: '625px', top: '1339px', width: '519px', gap: '20px' }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: '20px', lineHeight: 1.44, color: '#131313' }}>
          {events[2].date}
        </p>
        <div className="flex flex-col" style={{ gap: '32px' }}>
          <div className="flex flex-col">
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: '32px', lineHeight: 1.4, color: '#131313', textDecoration: 'underline', textTransform: 'uppercase' }}>
              {events[2].title}
            </p>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '16px', lineHeight: 1.48, color: '#131313', width: '519px' }}>
            {events[2].program.map((item, idx) => (
              <p key={idx} style={{ marginBottom: idx < events[2].program.length - 1 ? '8px' : '0' }}>
                <span style={{ fontWeight: 700 }}>• {item.composer}</span>
                <span style={{ fontWeight: 500 }}> - {item.piece}</span>
              </p>
            ))}
          </div>
          <div className="flex items-start" style={{ gap: '10px' }}>
            <img src="/assets/kalendarz/place-icon.svg" alt="Location" style={{ width: '30px', height: '30px' }} />
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '20px', lineHeight: 1.44, color: '#131313', textTransform: 'uppercase', width: '479px' }}>
              {events[2].location}
            </p>
          </div>
        </div>
      </div>

      {/* Stopka */}
      <div
        className="absolute flex items-center justify-between"
        style={{
          left: '185px',
          top: '1944px',
          width: '520px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: 1.48,
          color: '#131313',
          textTransform: 'uppercase',
        }}
      >
        <p>KOMPOPOLEX@GMAIL.COM</p>
        <a href="https://facebook.com" style={{ textDecoration: 'underline' }}>
          FACEBOOK
        </a>
        <a href="https://instagram.com" style={{ textDecoration: 'underline' }}>
          INSTAGRAM
        </a>
      </div>

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
