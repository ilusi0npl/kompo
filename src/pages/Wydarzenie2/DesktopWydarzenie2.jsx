import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageText from '../../components/LanguageText/LanguageText';
import ContrastToggle from '../../components/ContrastToggle/ContrastToggle';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  eventData,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './wydarzenie-config';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#A0E38A';
const TEXT_COLOR = '#131313';

export default function DesktopWydarzenie2() {
  const { t } = useTranslation();

  return (
    <section
      data-section="wydarzenie"
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

      {/* Wydarzenie - pionowy tekst po lewej (rotacja 90 stopni) - Figma: left=94px */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '94px',
          top: '220px',
          width: '45px',
          height: '384px',
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
          {t('wydarzenie.sideTitle')}
        </p>
      </div>

      {/* Tytuł wydarzenia - centered in 850px frame */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '295px',
          top: '220px',
          width: '850px',
        }}
      >
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '40px',
            lineHeight: 1.35,
            color: '#761FE0',
            textDecoration: 'underline',
            textTransform: 'uppercase',
          }}
        >
          {eventData.title}
        </p>
      </div>

      {/* Obraz wydarzenia - centered at 555px (1440/2 - 330/2 = 555) z smooth loading */}
      <SmoothImage
        src={eventData.image}
        alt={eventData.title}
        className="absolute"
        containerStyle={{
          left: '555px',
          top: '334px',
          width: '330px',
          height: '462px',
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

      {/* Data i godzina frame - centered at 297px (1440/2 - 847/2 ≈ 297) */}
      <div
        className="absolute flex flex-col items-start"
        style={{
          left: '297px',
          top: '846px',
          width: '847px',
          gap: '10px',
        }}
      >
        {/* Date row */}
        <div
          className="flex items-center justify-center w-full"
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '32px',
              lineHeight: 1.48,
              color: '#131313',
            }}
          >
            {eventData.date}| {eventData.time}
          </p>
        </div>

        {/* Location row */}
        <div
          className="flex items-center justify-center w-full"
          style={{
            gap: '10px',
          }}
        >
          <img
            src="/assets/wydarzenie/place-icon.svg"
            alt="Location"
            style={{ width: '42px', height: '42px' }}
          />
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '32px',
              lineHeight: 1.48,
              color: '#131313',
            }}
          >
            {eventData.location}
          </p>
        </div>
      </div>

      {/* Przycisk KUP BILET - nowy element */}
      <a
        href={eventData.ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute flex items-center justify-center ticket-btn"
        style={{
          left: '624px',
          top: '990px',
          backgroundColor: '#761FE0',
          paddingLeft: '24px',
          paddingRight: '22px',
          paddingTop: '14px',
          paddingBottom: '14px',
          gap: '10px',
          cursor: 'pointer',
          textDecoration: 'none',
          border: '3px solid transparent',
        }}
      >
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: 1.44,
            color: '#FDFDFD',
            textTransform: 'uppercase',
          }}
        >
          kup bilet
        </p>
        <img
          src="/assets/wydarzenie/arrow-up-right.svg"
          alt="Arrow"
          style={{ width: '28px', height: '28px' }}
        />
      </a>

      {/* Główna treść - flex column with gap 50px */}
      <div
        className="absolute flex flex-col"
        style={{
          left: '295px',
          top: '1087px',
          width: '850px',
          gap: '50px',
        }}
      >
        {/* Opis */}
        <p
          style={{
            width: '100%',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: 1.48,
            color: '#131313',
            whiteSpace: 'pre-wrap',
          }}
        >
          {eventData.description}
        </p>

        {/* Artyści frame */}
        <div
          className="flex flex-col items-center w-full"
          style={{
            gap: '20px',
          }}
        >
          <p
            style={{
              width: '100%',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: 1.45,
              color: '#131313',
              textDecoration: 'underline',
              textTransform: 'uppercase',
            }}
          >
            {t('common.labels.artists')}
          </p>
          <p
            style={{
              width: '100%',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: 1.48,
              color: '#131313',
            }}
          >
            {eventData.artists}
          </p>
        </div>

        {/* Program frame */}
        <div
          className="flex flex-col items-start w-full"
          style={{
            gap: '20px',
          }}
        >
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
            {t('common.labels.program')}
          </p>
          <ul
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '16px',
              lineHeight: 1.48,
              color: '#131313',
              width: '519px',
              listStyleType: 'disc',
              paddingLeft: '24px',
            }}
          >
            {eventData.program.map((item, idx) => (
              <li key={idx} style={{ marginBottom: idx < eventData.program.length - 1 ? '8px' : '0' }}>
                <span style={{ fontWeight: 700 }}>{item.composer}</span>
                <span style={{ fontWeight: 500 }}>- {item.piece}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Partnerzy frame */}
        <div
          className="flex flex-col items-center w-full"
          style={{
            gap: '32px',
          }}
        >
          <p
            style={{
              width: '100%',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: 1.45,
              color: '#131313',
              textDecoration: 'underline',
              textTransform: 'uppercase',
            }}
          >
            {t('common.labels.partners')}
          </p>
          {/* Partner logos with justify-between */}
          <div
            className="flex items-center justify-between w-full"
          >
            {/* Logo Wrocław */}
            <div
              className="relative"
              style={{
                width: '323px',
                height: '42px',
              }}
            >
              <img
                src={eventData.partners[0].logo}
                alt={eventData.partners[0].name}
                className="absolute"
                style={{
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 50%',
                }}
              />
            </div>

            {/* Logo ZAIKS */}
            <div
              className="relative"
              style={{
                width: '93px',
                height: '42px',
              }}
            >
              <img
                src={eventData.partners[1].logo}
                alt={eventData.partners[1].name}
                className="absolute"
                style={{
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 50%',
                }}
              />
            </div>

            {/* Logo Recepcja - special positioning from Figma */}
            <div
              className="relative"
              style={{
                width: '122px',
                height: '42px',
              }}
            >
              <div
                className="absolute"
                style={{
                  inset: 0,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={eventData.partners[2].logo}
                  alt={eventData.partners[2].name}
                  className="absolute"
                  style={{
                    height: '61.54%',
                    left: '-0.06%',
                    top: '25.96%',
                    width: '100.12%',
                    maxWidth: 'none',
                  }}
                />
              </div>
            </div>

            {/* Logo Polmic */}
            <div
              className="relative"
              style={{
                width: '129px',
                height: '42px',
              }}
            >
              <img
                src={eventData.partners[3].logo}
                alt={eventData.partners[3].name}
                className="absolute"
                style={{
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 50%',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stopka - at y=2113 (DESKTOP_HEIGHT - 40 - 24 = 2113) */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: '2113px',
          width: '520px',
        }}
      />

      {/* Prawa nawigacja - Frame 8 at x=1265, y=60, h=580 */}
      <div
        className="absolute"
        style={{
          left: '1265px',
          top: '60px',
          width: '100px',
          height: '580px',
        }}
      >
        {/* Language Toggle */}
        <LanguageText textColor={TEXT_COLOR} />
          <ContrastToggle iconColor={TEXT_COLOR} />

        {/* Frame 7 - Menu items at y=308 */}
        <nav
          className="absolute"
          style={{
            left: '0',
            top: '308px',
            width: '100px',
            height: '272px',
          }}
        >
          {[
            { key: 'bio', href: '/bio', active: false, top: 0 },
            { key: 'media', href: '/media', active: false, top: 49 },
            { key: 'kalendarz', href: '/kalendarz', active: true, top: 98 },
            { key: 'repertuar', href: '/repertuar', active: false, top: 147 },
            { key: 'fundacja', href: '/fundacja', active: false, top: 196 },
            { key: 'kontakt', href: '/kontakt', active: false, top: 245 },
          ].map((item) =>
            item.href.startsWith('/') && !item.href.includes('#') ? (
              <Link
                key={item.key}
                to={item.href}
                className={`absolute nav-link ${item.active ? 'nav-link--active' : ''}`}
                style={{
                  left: '0',
                  top: `${item.top}px`,
                  width: '100px',
                  height: '27px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.48,
                  color: '#131313',
                }}
              >
                {t(`common.nav.${item.key}`)}
              </Link>
            ) : (
              <a
                key={item.key}
                href={item.href}
                className={`absolute nav-link ${item.active ? 'nav-link--active' : ''}`}
                style={{
                  left: '0',
                  top: `${item.top}px`,
                  width: '100px',
                  height: '27px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.48,
                  color: '#131313',
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
