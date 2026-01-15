import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  events,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './kalendarz-config';

// Helper to make title a link with hover color change
const EventTitle = ({ event, t }) => (
  <Link
    to={`/wydarzenie/${event.id}`}
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
    {t(`kalendarz.events.event${event.id}.title`)}
  </Link>
);

export default function DesktopKalendarz() {
  const { t } = useTranslation();

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
        to={`/wydarzenie/${events[0].id}`}
        className="absolute event-poster-link"
        style={{
          left: '185px',
          top: '275px',
          width: '330px',
          height: '462px',
        }}
      >
        <SmoothImage
          src={events[0].image}
          alt={events[0].title}
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
          {events[0].date}
        </p>
        <div className="flex flex-col" style={{ gap: '32px' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <EventTitle event={events[0]} t={t} />
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
        to={`/wydarzenie/${events[1].id}`}
        className="absolute event-poster-link"
        style={{
          left: '185px',
          top: '807px',
          width: '330px',
          height: '462px',
        }}
      >
        <SmoothImage
          src={events[1].image}
          alt={events[1].title}
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
          {events[1].date}
        </p>
        <div className="flex flex-col" style={{ gap: '32px' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <EventTitle event={events[1]} t={t} />
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
        to={`/wydarzenie/${events[2].id}`}
        className="absolute event-poster-link"
        style={{
          left: '185px',
          top: '1339px',
          width: '330px',
          height: '462px',
        }}
      >
        <SmoothImage
          src={events[2].image}
          alt={events[2].title}
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
          {events[2].date}
        </p>
        <div className="flex flex-col" style={{ gap: '32px' }}>
          <div className="flex flex-col">
            <EventTitle event={events[2]} t={t} />
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '16px', lineHeight: 1.48, color: '#131313', width: '519px' }}>
            {events[2].program.map((item, idx) => (
              <p key={idx} style={{ marginBottom: idx < events[2].program.length - 1 ? '8px' : '0' }}>
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
