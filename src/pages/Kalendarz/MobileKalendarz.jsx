import { Link } from 'react-router';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { events } from './kalendarz-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#FDFDFD';
const LINE_COLOR = '#A0E38A';
const TEXT_COLOR = '#131313';

export default function MobileKalendarz() {
  const { t } = useTranslation();

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

      {/* Header z nawigacją */}
      <MobileHeader
        title={t('kalendarz.sideTitle')}
        textColor={TEXT_COLOR}
        navLinks={[
          { label: t('common.tabs.upcoming'), to: '/kalendarz', isActive: true },
          { label: t('common.tabs.archived'), to: '/archiwalne', isActive: false },
        ]}
      />

      {/* Lista eventów */}
      <div
        className="flex flex-col"
        style={{
          padding: '0 20px',
          gap: '60px',
        }}
      >
        {events.map((event, index) => (
          <div key={event.id} className="flex flex-col" style={{ gap: '16px' }}>
            {/* Zdjęcie z smooth loading - klikalny plakat */}
            <Link
              to={`/wydarzenie/${event.id}`}
              className="event-poster-link"
              style={{
                width: '300px',
                height: '420px',
                alignSelf: 'center',
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
              {event.date}
            </p>

            {/* Tytuł (link) z hover na fiolet */}
            <Link
              to={`/wydarzenie/${event.id}`}
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
              {t(`kalendarz.events.event${event.id}.title`)}
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
                  <p key={idx} style={{ marginBottom: idx < event.program.length - 1 ? '4px' : '0' }}>
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
