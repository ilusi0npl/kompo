import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  archivedEvents as configEvents,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './archiwalne-config';
import { useSanityEvents } from '../../hooks/useSanityEvents';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Grid layout positions (3 columns x 1 row for CMS data)
const GRID_LAYOUT = [
  { left: 185, top: 275, hasBorder: true },   // Column 1
  { left: 515, top: 275, hasBorder: false },  // Column 2
  { left: 845, top: 275, hasBorder: false },  // Column 3
];

// Transform Sanity archived events to match config structure with grid layout
function transformSanityEvents(sanityEvents) {
  return sanityEvents.map((event, index) => ({
    id: event._id,
    date: new Date(event.date).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).replace(/\./g, '.').replace(/(\d{2})\.(\d{2})\.(\d{2})/, '$1.$2.$3 '),
    title: event.title,
    performers: event.performers,
    image: event.imageUrl,
    position: GRID_LAYOUT[index] || GRID_LAYOUT[0], // Fallback to first position
    hasBorder: GRID_LAYOUT[index]?.hasBorder || false,
  }));
}

export default function DesktopArchiwalne() {
  const { t } = useTranslation();

  // Fetch from Sanity if enabled
  const { events: sanityEvents, loading, error } = useSanityEvents('archived');

  // Transform and use Sanity data if enabled, otherwise use config
  const archivedEvents = USE_SANITY && sanityEvents && sanityEvents.length > 0
    ? transformSanityEvents(sanityEvents)
    : configEvents;

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="archiwalne"
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          height: `${DESKTOP_HEIGHT}px`,
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '16px',
            color: '#131313',
          }}
        >
          {t('common.loading.events')}
        </div>
      </section>
    );
  }

  // Show error state only when using Sanity
  if (USE_SANITY && error) {
    return (
      <section
        data-section="archiwalne"
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          height: `${DESKTOP_HEIGHT}px`,
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '16px',
            color: '#FF0000',
          }}
        >
          {t('common.error.loadEvents')}
        </div>
      </section>
    );
  }

  return (
    <section
      data-section="archiwalne"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
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
          {/* Image z smooth loading - klikalny plakat */}
          <Link
            to={`/wydarzenie/${event.id}`}
            className="event-poster-link"
            style={{
              width: '300px',
              height: '420px',
              border: event.hasBorder ? '1px solid #131313' : 'none',
            }}
          >
            <SmoothImage
              src={event.image}
              alt={event.title}
              containerStyle={{
                width: '300px',
                height: '420px',
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
          </Link>

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
                className="event-title-link"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: '24px',
                  lineHeight: 1.45,
                  color: '#131313',
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
    </section>
  );
}
