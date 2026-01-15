import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  archivedEvents,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './archiwalne-config';

export default function DesktopArchiwalne() {
  const { t } = useTranslation();

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
