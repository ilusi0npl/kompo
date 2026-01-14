import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  archivedEvents,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './archiwalne-config';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#A0E38A';

export default function DesktopArchiwalne() {
  const { t, language } = useTranslation();

  return (
    <section
      data-section="archiwalne"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: '#FDFDFD',
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
            transform: 'rotate(90deg)',
            whiteSpace: 'nowrap',
          }}
        >
          {t('kalendarz.sideTitle')}
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
        {t('common.tabs.upcoming')}
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
        {t('common.tabs.archived')}
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
          {/* Image z smooth loading */}
          <SmoothImage
            src={event.image}
            alt={event.title}
            containerStyle={{
              width: '300px',
              height: '420px',
              border: event.hasBorder ? '1px solid #131313' : 'none',
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '50% 50%',
            }}
            placeholderColor="#e5e5e5"
          />

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
        {/* Language Toggle */}
        <LanguageToggle textColor="#131313" />

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
            { key: 'bio', href: '/bio', active: false },
            { key: 'media', href: '/media', active: false },
            { key: 'kalendarz', href: '/kalendarz', active: true },
            { key: 'repertuar', href: '/repertuar', active: false },
            { key: 'fundacja', href: '/fundacja', active: false },
            { key: 'kontakt', href: '/kontakt', active: false },
          ].map((item) =>
            item.href.startsWith('/') && !item.href.includes('#') ? (
              <Link
                key={item.key}
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
                {t(`common.nav.${item.key}`)}
              </Link>
            ) : (
              <a
                key={item.key}
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
                {t(`common.nav.${item.key}`)}
              </a>
            )
          )}
        </nav>
      </div>
    </section>
  );
}
