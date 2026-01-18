import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useParams } from 'react-router';
import { useSanityEvent } from '../../hooks/useSanityEvent';
import {
  eventData,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './wydarzenie-config';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

export default function DesktopWydarzenie() {
  const { t } = useTranslation();
  const { id } = useParams();

  // Fetch from Sanity if enabled
  const { event: sanityEvent, loading, error } = useSanityEvent(id);

  // Format date from ISO to display format
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date
      .toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
      .replace(/\./g, '.') + ' ';
  };

  const formatTime = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' ';
  };

  // Transform Sanity data to match config structure
  const event = USE_SANITY && sanityEvent
    ? {
        ...sanityEvent,
        date: formatDate(sanityEvent.date),
        time: formatTime(sanityEvent.date),
        image: sanityEvent.imageUrl,
        artists: sanityEvent.performers || '',
        program: sanityEvent.program || [],
        // Transform partners from Sanity format to UI format
        partners: sanityEvent.partners && sanityEvent.partners.length > 0
          ? sanityEvent.partners.map(p => ({
              name: p.name,
              logo: p.logoUrl,
            }))
          : eventData.partners, // Fallback to hardcoded if no partners in CMS
      }
    : eventData;

  return (
    <section
      data-section="wydarzenie"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
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
            color: 'var(--contrast-accent)',
            textDecoration: 'underline',
            textTransform: 'uppercase',
          }}
        >
          {event.title}
        </p>
      </div>

      {/* Obraz wydarzenia - centered at 555px (1440/2 - 330/2 = 555) z smooth loading */}
      <SmoothImage
        src={event.image}
        alt={event.title}
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
        placeholderColor="var(--contrast-placeholder)"
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
              color: 'var(--contrast-text)',
            }}
          >
            {event.date}| {event.time}
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
              color: 'var(--contrast-text)',
            }}
          >
            {event.location}
          </p>
        </div>
      </div>

      {/* Przycisk KUP BILET */}
      {event.showTicketButton && event.ticketUrl && (
        <a
          href={event.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute flex items-center justify-center ticket-btn"
          style={{
            left: '624px',
            top: '990px',
            backgroundColor: 'var(--contrast-accent)',
            paddingLeft: '24px',
            paddingRight: '22px',
            paddingTop: '14px',
            paddingBottom: '14px',
            gap: '10px',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: 1.44,
              color: 'var(--contrast-bg)',
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
      )}

      {/* Główna treść - flex column with gap 50px */}
      <div
        className="absolute flex flex-col"
        style={{
          left: '295px',
          top: event.showTicketButton && event.ticketUrl ? '1087px' : '990px',
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
            color: 'var(--contrast-text)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {event.description}
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
              color: 'var(--contrast-text)',
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
              color: 'var(--contrast-text)',
            }}
          >
            {event.artists}
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
              color: 'var(--contrast-text)',
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
              color: 'var(--contrast-text)',
              width: '519px',
              listStyleType: 'disc',
              paddingLeft: '24px',
            }}
          >
            {event.program.map((item, idx) => (
              <li key={idx} style={{ marginBottom: idx < event.program.length - 1 ? '8px' : '0' }}>
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
              color: 'var(--contrast-text)',
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
                src={event.partners[0].logo}
                alt={event.partners[0].name}
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
                src={event.partners[1].logo}
                alt={event.partners[1].name}
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
                  src={event.partners[2].logo}
                  alt={event.partners[2].name}
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
                src={event.partners[3].logo}
                alt={event.partners[3].name}
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

      {/* Stopka - at y=1877 (DESKTOP_HEIGHT - 40 - 24 = 1877) */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: '1877px',
          width: '520px',
        }}
      />
    </section>
  );
}
