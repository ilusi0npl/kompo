import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useSanityEvents } from '../../hooks/useSanityEvents';
import {
  events as configEvents,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './kalendarz-config';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Format date for display (handle both config string and Sanity datetime)
const formatEventDate = (dateValue) => {
  // If it's already formatted string from config (e.g., "13.12.25 | 18:00"), return as-is
  if (typeof dateValue === 'string' && dateValue.includes('|')) {
    return dateValue;
  }

  // Otherwise parse as datetime and format
  const date = new Date(dateValue);
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ' |');
};

// Helper to make title a link with hover color change
const EventTitle = ({ event, t, useSanity }) => {
  const eventId = event._id || event.id;
  const title = useSanity ? event.title : t(`kalendarz.events.event${event.id}.title`);

  return (
    <Link
      to={`/wydarzenie/${eventId}`}
      className="event-title-link"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 600,
        fontSize: '32px',
        lineHeight: 1.4,
        color: '#131313',
        textTransform: 'uppercase',
      }}
    >
      {title}
    </Link>
  );
};

export default function DesktopKalendarz() {
  const { t } = useTranslation();

  // Fetch from Sanity if enabled
  const { events: sanityEvents, loading, error } = useSanityEvents('upcoming');

  // Use Sanity data if enabled, otherwise use config
  const events = USE_SANITY ? sanityEvents : configEvents;

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <div
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          height: `${DESKTOP_HEIGHT}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{fontSize: '18px', fontFamily: "'IBM Plex Mono', monospace"}}>
          {t('common.loading.events')}
        </div>
      </div>
    );
  }

  // Show error state only when using Sanity
  if (USE_SANITY && error) {
    return (
      <div
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          height: `${DESKTOP_HEIGHT}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{fontSize: '18px', fontFamily: "'IBM Plex Mono', monospace", color: '#FF0000'}}>
          {t('common.error.loadEvents')}
        </div>
      </div>
    );
  }

  return (
    <section
      data-section="kalendarz"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
      {/* Event 1 */}
      <Link
        to={`/wydarzenie/${events[0]._id || events[0].id}`}
        className="absolute event-poster-link"
        style={{
          left: '185px',
          top: '275px',
          width: '330px',
          height: '462px',
        }}
      >
        <SmoothImage
          src={events[0].image || events[0].imageUrl}
          alt={USE_SANITY ? events[0].title : t(`kalendarz.events.event${events[0].id}.title`)}
          containerStyle={{
            width: '330px',
            height: '462px',
          }}
          style={{
            ...events[0].imageStyle,
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
          placeholderColor="#e5e5e5"
        />
      </Link>
      <div className="absolute flex flex-col" style={{ left: '625px', top: '275px', width: '519px', gap: '20px' }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: '20px', lineHeight: 1.44, color: '#131313' }}>
          {formatEventDate(events[0].date)}
        </p>
        <div className="flex flex-col" style={{ gap: '32px' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <EventTitle event={events[0]} t={t} useSanity={USE_SANITY} />
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
      <Link
        to={`/wydarzenie/${events[1]._id || events[1].id}`}
        className="absolute event-poster-link"
        style={{
          left: '185px',
          top: '807px',
          width: '330px',
          height: '462px',
        }}
      >
        <SmoothImage
          src={events[1].image || events[1].imageUrl}
          alt={USE_SANITY ? events[1].title : t(`kalendarz.events.event${events[1].id}.title`)}
          containerStyle={{
            width: '330px',
            height: '462px',
          }}
          style={events[1].imageStyle}
          placeholderColor="#e5e5e5"
        />
      </Link>
      <div className="absolute flex flex-col" style={{ left: '625px', top: '807px', width: '519px', gap: '20px' }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: '20px', lineHeight: 1.44, color: '#131313' }}>
          {formatEventDate(events[1].date)}
        </p>
        <div className="flex flex-col" style={{ gap: '32px' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <EventTitle event={events[1]} t={t} useSanity={USE_SANITY} />
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
      <Link
        to={`/wydarzenie/${events[2]._id || events[2].id}`}
        className="absolute event-poster-link"
        style={{
          left: '185px',
          top: '1339px',
          width: '330px',
          height: '462px',
        }}
      >
        <SmoothImage
          src={events[2].image || events[2].imageUrl}
          alt={USE_SANITY ? events[2].title : t(`kalendarz.events.event${events[2].id}.title`)}
          containerStyle={{
            width: '330px',
            height: '462px',
          }}
          style={{
            ...events[2].imageStyle,
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
          placeholderColor="#e5e5e5"
        />
      </Link>
      <div className="absolute flex flex-col" style={{ left: '625px', top: '1339px', width: '519px', gap: '20px' }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: '20px', lineHeight: 1.44, color: '#131313' }}>
          {formatEventDate(events[2].date)}
        </p>
        <div className="flex flex-col" style={{ gap: '32px' }}>
          <div className="flex flex-col">
            <EventTitle event={events[2]} t={t} useSanity={USE_SANITY} />
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '16px', lineHeight: 1.48, color: '#131313', width: '519px' }}>
            {events[2].program && events[2].program.map((item, idx) => (
              <p key={item._key || idx} style={{ marginBottom: idx < events[2].program.length - 1 ? '8px' : '0' }}>
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
      <Footer
        className="absolute"
        style={{
          left: 'calc(50% - 275px)',
          transform: 'translateX(-50%)',
          bottom: '40px',
          width: '520px',
        }}
      />
    </section>
  );
}
