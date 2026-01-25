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

// Grid layout constants (like Media page pattern)
const CARD_HEIGHT = 420; // Image height
const TEXT_HEIGHT = 120; // Text content below image (date + title + performers)
const ITEM_HEIGHT = CARD_HEIGHT + 16 + TEXT_HEIGHT; // Card + gap + text
const ROW_SPACING = 674; // Distance between row starts
const FOOTER_SPACING = 113; // Space between last item and footer (same as Media)
const GRID_START_TOP = 275;
const GRID_COLUMNS = [185, 515, 845]; // Column X positions

// Generate grid position for event at given index
function getGridPosition(index) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return {
    left: GRID_COLUMNS[col],
    top: GRID_START_TOP + (row * ROW_SPACING),
    hasBorder: col === 0, // First column has border
  };
}

// Calculate footer position and total height (like Media page)
function calculateLayout(eventCount) {
  if (eventCount === 0) return { footerTop: 400, totalHeight: 500 };

  const numRows = Math.ceil(eventCount / 3);
  const lastRowTop = GRID_START_TOP + ((numRows - 1) * ROW_SPACING);
  const lastItemBottom = lastRowTop + ITEM_HEIGHT;
  const footerTop = lastItemBottom + FOOTER_SPACING;
  const totalHeight = footerTop + 70; // footer + bottom margin (same as Media)

  return { footerTop, totalHeight };
}

// Transform Sanity archived events to match config structure with grid layout
function transformSanityEvents(sanityEvents) {
  return sanityEvents.map((event, index) => {
    const position = getGridPosition(index);
    return {
      id: event._id,
      date: new Date(event.date).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\./g, '.').replace(/(\d{2})\.(\d{2})\.(\d{2})/, '$1.$2.$3 '),
      title: event.title,
      performers: event.performers,
      image: event.imageUrl,
      position,
      hasBorder: position.hasBorder,
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

  // Calculate layout (footer position and total height)
  const { footerTop, totalHeight } = calculateLayout(archivedEvents.length);

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="archiwalne"
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          height: `${totalHeight}px`,
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
          height: `${totalHeight}px`,
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
        height: `${totalHeight}px`,
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

      {/* Stopka - absolute position like Media page */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: `${footerTop}px`,
          width: '520px',
        }}
      />
    </section>
  );
}
