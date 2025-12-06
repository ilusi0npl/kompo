import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import {
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
  BACKGROUND_COLOR,
  fundacjaData,
} from './kontakt-config';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#FFBD19';

export default function DesktopKontakt() {
  return (
    <section
      data-section="kontakt"
      className="relative overflow-hidden"
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

      {/* Kontakt - pionowy tekst po lewej */}
      <img
        src="/assets/kontakt/kontakt-text.svg"
        alt="Kontakt"
        className="absolute"
        style={{
          left: '94px',
          top: '371px',
          width: '49px',
          height: '260px',
        }}
      />

      {/* Zdjęcie zespołu */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: '185px',
          top: '180px',
          width: '300px',
          height: '460px',
        }}
      >
        <img
          src="/assets/kontakt/team-photo.jpg"
          alt="Zespół Kompopolex"
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 50%' }}
        />
      </div>

      {/* Dane fundacji */}
      <div
        className="absolute flex flex-col"
        style={{
          left: '618px',
          top: '180px',
          width: '480px',
          gap: '32px',
        }}
      >
        {/* Tytuł */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '32px',
            lineHeight: 1.4,
            color: '#131313',
            textDecoration: 'underline',
            textTransform: 'uppercase',
          }}
        >
          dane fundacji kompopolex:
        </p>

        {/* Dane */}
        <div
          className="flex flex-col"
          style={{
            gap: '32px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: 1.44,
            color: '#131313',
          }}
        >
          <p>KRS: {fundacjaData.krs}</p>
          <p>REGON: {fundacjaData.regon}</p>
          <p>NIP: {fundacjaData.nip}</p>
          <div>
            <p>NR KONTA:</p>
            <p>{fundacjaData.bankAccount}</p>
          </div>
        </div>

        {/* Email */}
        <a
          href={`mailto:${fundacjaData.email}`}
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
          {fundacjaData.email}
        </a>
      </div>

      {/* Stopka */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: '776px',
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
            { name: 'Media', href: '/media', active: false },
            { name: 'Kalendarz', href: '/kalendarz', active: false },
            { name: 'Repertuar', href: '#repertuar', active: false },
            { name: 'Fundacja', href: '#fundacja', active: false },
            { name: 'Kontakt', href: '/kontakt', active: true },
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
