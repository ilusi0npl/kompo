import { Link } from 'react-router';
import MobileHeader, { MobileHeaderSpacer } from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useSanityEvents } from '../../hooks/useSanityEvents';
import { events as configEvents } from './kalendarz-config';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#FDFDFD';
const LINE_COLOR = '#A0E38A';
const TEXT_COLOR = '#131313';

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

export default function MobileKalendarz() {
  const { t } = useTranslation();

  // Fetch from Sanity if enabled
  const { events: sanityEvents, loading, error } = useSanityEvents('upcoming');

  // Use Sanity data if enabled, otherwise use config
  const events = USE_SANITY ? sanityEvents : configEvents;

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <div
        style={{
          width: `${MOBILE_WIDTH}px`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{fontSize: '16px', fontFamily: "'IBM Plex Mono', monospace"}}>
          {t('common.loading.events')}
        </div>
      </div>
    );
  }

  // Show error state only when using Sanity
  if (USE_SANITY && error) {
    return (
      <div
        style={{
          width: `${MOBILE_WIDTH}px`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{fontSize: '16px', fontFamily: "'IBM Plex Mono', monospace", color: '#FF0000'}}>
          Błąd ładowania wydarzeń
        </div>
      </div>
    );
  }

  return (
    <section
      data-section="kalendarz-mobile"
      className="relative overflow-hidden"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: '100vh',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Pionowe linie */}
      {mobileLinePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0"
          style={{
            left: `${left}px`,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Header z nawigacją - fixed */}
      <MobileHeader
        title={t('kalendarz.sideTitle')}
        textColor={TEXT_COLOR}
        backgroundColor={BACKGROUND_COLOR}
        lineColor={LINE_COLOR}
        isFixed={true}
        headerHeight={326}
        navLinksTop={257}
        navLinksGap={55}
        navLinksFontSize={20}
        navLinks={[
          { label: t('common.tabs.upcoming'), to: '/kalendarz', isActive: true },
          { label: t('common.tabs.archived'), to: '/archiwalne', isActive: false },
        ]}
      />
      <MobileHeaderSpacer height={326} />

      {/* Lista eventów */}
      <div
        className="flex flex-col"
        style={{
          padding: '0 20px',
          gap: '60px',
        }}
      >
        {events.map((event, index) => (
          <div key={event._id || event.id} className="flex flex-col" style={{ gap: '16px' }}>
            {/* Zdjęcie z smooth loading - klikalny plakat */}
            <Link
              to={`/wydarzenie/${event._id || event.id}`}
              className="event-poster-link"
              style={{
                width: '300px',
                height: '420px',
                alignSelf: 'center',
              }}
            >
              <SmoothImage
                src={event.image || event.imageUrl}
                alt={USE_SANITY ? event.title : t(`kalendarz.events.event${event.id}.title`)}
                containerStyle={{
                  width: '300px',
                  height: '420px',
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 50%',
                }}
                placeholderColor="#e5e5e5"
              />
            </Link>

            {/* Data */}
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: 1.44,
                color: TEXT_COLOR,
              }}
            >
              {formatEventDate(event.date)}
            </p>

            {/* Tytuł (link) z hover na fiolet */}
            <Link
              to={`/wydarzenie/${event._id || event.id}`}
              className="event-title-link"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: 1.4,
                color: TEXT_COLOR,
                textTransform: 'uppercase',
              }}
            >
              {USE_SANITY ? event.title : t(`kalendarz.events.event${event.id}.title`)}
            </Link>

            {/* Wykonawcy lub Program */}
            {event.performers && (
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: 1.48,
                  color: TEXT_COLOR,
                }}
              >
                {event.performers}
              </p>
            )}

            {event.program && (
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '14px',
                  lineHeight: 1.48,
                  color: TEXT_COLOR,
                }}
              >
                {event.program.map((item, idx) => (
                  <p key={item._key || idx} style={{ marginBottom: idx < event.program.length - 1 ? '4px' : '0' }}>
                    <span style={{ fontWeight: 700 }}>• {item.composer}</span>
                    <span style={{ fontWeight: 500 }}> - {item.piece}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Opis */}
            {event.description && (
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: 1.48,
                  color: TEXT_COLOR,
                }}
              >
                {event.description}
              </p>
            )}

            {/* Lokalizacja */}
            <div className="flex items-start" style={{ gap: '8px' }}>
              <img
                src="/assets/kalendarz/place-icon.svg"
                alt="Location"
                style={{ width: '24px', height: '24px', flexShrink: 0 }}
              />
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: 1.44,
                  color: TEXT_COLOR,
                  textTransform: 'uppercase',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stopka */}
      <MobileFooter
        className="mt-16"
        style={{
          marginLeft: '20px',
          marginRight: '20px',
          marginBottom: '40px',
          width: '350px',
        }}
        textColor={TEXT_COLOR}
      />
    </section>
  );
}
