import { Link } from 'react-router';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '../../components/PortableTextComponents';
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

// Figma geometry: poster column at 185px, text column at 625px, first card at 275px
const CONTENT_LEFT = 185;
const POSTER_WIDTH = 330;
const POSTER_HEIGHT = 462;
const COLUMN_GAP = 110;
const TEXT_WIDTH = 519;
const FIRST_CARD_TOP = 275;
const CARD_GAP = 70;

const TEXT_COLOR = '#131313';
const MONO = "'IBM Plex Mono', monospace";

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

const StateMessage = ({ children, color = TEXT_COLOR }) => (
  <div
    className="relative"
    style={{
      width: `${DESKTOP_WIDTH}px`,
      height: `${DESKTOP_HEIGHT}px`,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '300px',
    }}
  >
    <div style={{ fontSize: '18px', fontFamily: MONO, color }}>{children}</div>
  </div>
);

function EventCard({ event, t }) {
  const eventId = event._id || event.id;
  const title = USE_SANITY ? event.title : t(`kalendarz.events.event${event.id}.title`);

  return (
    <article
      data-event-card
      className="flex"
      style={{ gap: `${COLUMN_GAP}px`, alignItems: 'flex-start' }}
    >
      <Link
        to={`/wydarzenie/${eventId}`}
        className="event-poster-link"
        style={{ width: `${POSTER_WIDTH}px`, height: `${POSTER_HEIGHT}px`, flexShrink: 0 }}
      >
        <SmoothImage
          src={event.image || event.imageUrl}
          alt={title}
          containerStyle={{ width: `${POSTER_WIDTH}px`, height: `${POSTER_HEIGHT}px` }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '50% 50%',
          }}
          placeholderColor="#e5e5e5"
        />
      </Link>

      <div className="flex flex-col" style={{ width: `${TEXT_WIDTH}px`, gap: '20px' }}>
        <p style={{ fontFamily: MONO, fontWeight: 600, fontSize: '20px', lineHeight: 1.44, color: TEXT_COLOR }}>
          {formatEventDate(event.date)}
        </p>

        <div className="flex flex-col" style={{ gap: '32px' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <Link
              to={`/wydarzenie/${eventId}`}
              className="event-title-link"
              style={{
                fontFamily: MONO,
                fontWeight: 600,
                fontSize: '32px',
                lineHeight: 1.4,
                color: TEXT_COLOR,
                textTransform: 'uppercase',
              }}
            >
              {title}
            </Link>
            {event.performers && (
              <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: '16px', lineHeight: 1.48, color: TEXT_COLOR }}>
                {event.performers}
              </p>
            )}
          </div>

          {event.program && (
            <div style={{ fontFamily: MONO, fontSize: '16px', lineHeight: 1.48, color: TEXT_COLOR }}>
              {event.program.map((item, idx) => (
                <p key={item._key || idx} style={{ marginBottom: idx < event.program.length - 1 ? '8px' : '0' }}>
                  <span style={{ fontWeight: 700 }}>• {item.composer}</span>
                  <span style={{ fontWeight: 500 }}> – {item.piece}</span>
                </p>
              ))}
            </div>
          )}

          {event.description && (Array.isArray(event.description) ? (
            <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: '16px', lineHeight: 1.48, color: TEXT_COLOR }}>
              <PortableText components={portableTextComponents} value={event.description} />
            </div>
          ) : (
            <p style={{ fontFamily: MONO, fontWeight: 500, fontSize: '16px', lineHeight: 1.48, color: TEXT_COLOR }}>
              {event.description}
            </p>
          ))}

          <div className="flex items-start" style={{ gap: '10px' }}>
            <img src="/assets/kalendarz/place-icon.svg" alt="Location" style={{ width: '30px', height: '30px', flexShrink: 0 }} />
            <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: '20px', lineHeight: 1.44, color: TEXT_COLOR, textTransform: 'uppercase', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {event.location}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DesktopKalendarz() {
  const { t } = useTranslation();

  // Fetch from Sanity if enabled
  const { events: sanityEvents, loading, error } = useSanityEvents('upcoming');

  // Use Sanity data if enabled, otherwise use config
  const events = USE_SANITY ? sanityEvents : configEvents;

  if (USE_SANITY && loading) {
    return <StateMessage>{t('common.loading.events')}</StateMessage>;
  }

  if (USE_SANITY && error) {
    return <StateMessage color="#FF0000">{t('common.error.loadEvents')}</StateMessage>;
  }

  if (!events || events.length === 0) {
    return <StateMessage>{t('common.empty.events')}</StateMessage>;
  }

  return (
    <section
      data-section="kalendarz"
      className="relative flex flex-col"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        paddingLeft: `${CONTENT_LEFT}px`,
        paddingTop: `${FIRST_CARD_TOP}px`,
        gap: `${CARD_GAP}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
      {events.map((event) => (
        <EventCard key={event._id || event.id} event={event} t={t} />
      ))}

      <Footer style={{ width: '520px', marginTop: '80px', marginBottom: '40px' }} />
    </section>
  );
}
