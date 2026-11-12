import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  archivedEvents as configEvents,
  DESKTOP_WIDTH,
} from './archiwalne-config';
import { useSanityEvents } from '../../hooks/useSanityEvents';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#A0E38A';

// Grid layout: 3 columns from Figma; rows flow so long text never runs under the next row
const CONTENT_LEFT = 185;
const GRID_START_TOP = 275;
const CARD_WIDTH = 300;
const COLUMN_GAP = 30;
const ROW_GAP = 80; // Constant gap between the longest text in a row and the next row's posters

// Transform Sanity archived events to match config structure with grid layout
function transformSanityEvents(sanityEvents) {
  return sanityEvents.map((event) => {
    return {
      id: event._id,
      date: event.date ? new Date(event.date).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\./g, '.').replace(/(\d{2})\.(\d{2})\.(\d{2})/, '$1.$2.$3 ') : event.dateText,
      title: event.title,
      performers: event.performers,
      image: event.imageUrl,
    };
  });
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
          height: '500px',
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
          height: '500px',
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
        paddingLeft: `${CONTENT_LEFT}px`,
        paddingTop: `${GRID_START_TOP}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
      {/* Event cards - 3 column grid, rows sized by their content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(3, ${CARD_WIDTH}px)`,
          columnGap: `${COLUMN_GAP}px`,
          rowGap: `${ROW_GAP}px`,
          alignItems: 'start',
        }}
      >
      {archivedEvents.map((event, index) => (
        <div
          key={event.id}
          className="flex flex-col"
          style={{
            width: `${CARD_WIDTH}px`,
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
              border: index % 3 === 0 ? '1px solid #131313' : 'none', // First column has border
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
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
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
      </div>

      <Footer style={{ width: '520px', marginTop: '113px', marginBottom: '40px' }} />
    </section>
  );
}
