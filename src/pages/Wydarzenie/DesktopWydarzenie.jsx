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
import { events as kalendarzEvents } from '../Kalendarz/kalendarz-config';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#A0E38A';

// Calculate dynamic page height based on program items
function calculatePageHeight(programLength, hasTicketButton) {
  const BASE_HEIGHT = DESKTOP_HEIGHT; // 1941
  const CONTENT_START = hasTicketButton ? 1087 : 990;
  const DESCRIPTION_HEIGHT = 150; // Approximate
  const ARTISTS_HEIGHT = 100;
  const PROGRAM_HEADER_HEIGHT = 50;
  const PROGRAM_ITEM_HEIGHT = 32; // Per item
  const PARTNERS_HEIGHT = 150;
  const FOOTER_HEIGHT = 64;
  const FOOTER_MARGIN = 80;

  const programHeight = PROGRAM_HEADER_HEIGHT + (programLength * PROGRAM_ITEM_HEIGHT);
  const contentHeight = CONTENT_START + DESCRIPTION_HEIGHT + ARTISTS_HEIGHT + programHeight + PARTNERS_HEIGHT + FOOTER_HEIGHT + FOOTER_MARGIN;

  return Math.max(BASE_HEIGHT, contentHeight);
}

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
  // Or look up event from kalendarz events when not using Sanity
  let event;
  if (USE_SANITY && sanityEvent) {
    event = {
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
    };
  } else {
    // Look up event by ID from kalendarz events
    const kalendarzEvent = id
      ? kalendarzEvents.find(e => String(e.id) === String(id) || e._id === id)
      : null;

    if (kalendarzEvent) {
      // Merge kalendarz event data with static eventData (for partners, etc.)
      event = {
        ...eventData,
        title: kalendarzEvent.title || 'ENSEMBLE KOMPOPOLEX',
        date: kalendarzEvent.date || eventData.date,
        time: kalendarzEvent.time || '18:00 ',
        location: kalendarzEvent.location || eventData.location,
        image: kalendarzEvent.image || eventData.image,
        description: kalendarzEvent.description || eventData.description,
        artists: kalendarzEvent.performers || eventData.artists,
        program: kalendarzEvent.program || eventData.program,
      };
    } else {
      // Fallback to static event data
      event = eventData;
    }
  }

  // Calculate dynamic height based on program length
  const hasTicketButton = event.showTicketButton && event.ticketUrl;
  const pageHeight = calculatePageHeight(event.program?.length || 0, hasTicketButton);

  return (
    <section
      data-section="wydarzenie"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        minHeight: `${pageHeight}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
      {/* Pionowe linie dekoracyjne */}
      {LINE_POSITIONS.map((x) => (
        <div
          key={x}
          className="absolute top-0 decorative-line"
          style={{
            left: `${x}px`,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

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
              color: '#131313',
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
            backgroundColor: '#761FE0',
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
            color: '#131313',
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
            {event.artists}
          </p>
        </div>

        {/* Program frame - only show if event has program */}
        {event.program && event.program.length > 0 && (
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
              {event.program.map((item, idx) => (
                <li key={idx} style={{ marginBottom: idx < event.program.length - 1 ? '8px' : '0' }}>
                  <span style={{ fontWeight: 700 }}>{item.composer}</span>
                  <span style={{ fontWeight: 500 }}>- {item.piece}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

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

        {/* Stopka - flows after partners */}
        <Footer
          style={{
            marginTop: '30px',
            marginBottom: '40px',
            width: '520px',
          }}
        />
      </div>
    </section>
  );
}
