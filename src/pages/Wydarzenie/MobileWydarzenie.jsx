import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams } from 'react-router';
import { PortableText } from '@portabletext/react';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useFixedMobileHeader } from '../../hooks/useFixedMobileHeader';
import { useSanityEvent } from '../../hooks/useSanityEvent';
import { eventData } from './wydarzenie-config';
import { events as kalendarzEvents } from '../Kalendarz/kalendarz-config';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#FDFDFD';
const LINE_COLOR = '#A0E38A';
const TEXT_COLOR = '#131313';
const HEADER_HEIGHT = 240;

export default function MobileWydarzenie() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { scale } = useFixedMobileHeader();
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

  return (
    <section
      data-section="wydarzenie-mobile"
      className="relative"
      style={{
        width: `${MOBILE_WIDTH}px`,
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Pionowe linie */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{
          height: '100%',
        }}
      >
        {mobileLinePositions.map((left, index) => (
          <div
            key={index}
            className="absolute top-0 decorative-line"
            style={{
              left: `${left}px`,
              width: '1px',
              height: '100%',
              backgroundColor: LINE_COLOR,
            }}
          />
        ))}
      </div>

      {/* Fixed header via portal to #mobile-header-root for high contrast filter support */}
      {typeof document !== 'undefined' && document.getElementById('mobile-header-root') && createPortal(
        <div
          className="fixed top-0 left-0"
          style={{
            width: `${MOBILE_WIDTH}px`,
            height: `${HEADER_HEIGHT}px`,
            backgroundColor: BACKGROUND_COLOR,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            zIndex: 100,
            pointerEvents: 'auto',
          }}
        >
          {/* Pionowe linie w fixed headerze */}
          {mobileLinePositions.map((left, index) => (
            <div
              key={`header-line-${index}`}
              className="absolute top-0 decorative-line"
              style={{
                left: `${left}px`,
                width: '1px',
                height: `${HEADER_HEIGHT}px`,
                backgroundColor: LINE_COLOR,
              }}
            />
          ))}

          {/* MENU button - top right */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="absolute"
            style={{
              left: '312px',
              top: '43px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: 'normal',
              color: TEXT_COLOR,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            MENU
          </button>

          {/* Logo - top left */}
          <Link
            to="/"
            className="absolute"
            style={{
              left: '20px',
              top: '40px',
              width: '104px',
              height: '42px',
            }}
          >
            <img
              src="/assets/logo.svg"
              alt="Kompopolex"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </Link>

          {/* Wydarzenie title */}
          <p
            className="absolute"
            style={{
              left: '20px',
              top: '166px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '48px',
              lineHeight: 1.1,
              color: TEXT_COLOR,
            }}
          >
            {t('wydarzenie.sideTitle')}
          </p>

          {/* MobileMenu inside portal */}
          <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>,
        document.getElementById('mobile-header-root')
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: `${HEADER_HEIGHT}px` }} />

      {/* Tytuł wydarzenia */}
      <p
        style={{
          position: 'relative',
          zIndex: 10,
          marginLeft: '20px',
          marginTop: '20px',
          width: '350px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '32px',
          lineHeight: 1.4,
          color: '#761FE0',
          textDecoration: 'underline',
          textTransform: 'uppercase',
          whiteSpace: 'pre-wrap',
        }}
      >
        {event.title}
      </p>

      {/* Zdjęcie */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          marginTop: '50px',
        }}
      >
        <SmoothImage
          src={event.image}
          alt={event.title}
          containerStyle={{
            width: '330px',
            height: '462px',
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '50% 50%',
          }}
          placeholderColor="#e5e5e5"
        />
      </div>

      {/* Data i lokalizacja */}
      <div
        className="flex flex-col items-start"
        style={{
          position: 'relative',
          zIndex: 10,
          marginLeft: '20px',
          marginTop: '50px',
          width: '350px',
          gap: '24px',
        }}
      >
        {/* Data */}
        <div className="flex items-center justify-start w-full">
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: 1.45,
              color: TEXT_COLOR,
              textTransform: 'uppercase',
            }}
          >
            {event.date}| {event.time}
          </p>
        </div>

        {/* Lokalizacja - 2 linie z ikoną */}
        <div className="flex items-start w-full" style={{ gap: '10px' }}>
          <div
            className="flex items-center"
            style={{
              paddingTop: '4px',
            }}
          >
            <img
              src="/assets/wydarzenie/place-icon.svg"
              alt="Location"
              style={{ width: '32px', height: '32px' }}
            />
          </div>
          <div
            style={{
              flex: '1 0 0',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: 1.45,
              color: TEXT_COLOR,
              textTransform: 'uppercase',
              whiteSpace: 'pre-wrap',
            }}
          >
            <p>{event.location}</p>
          </div>
        </div>

        {/* Przycisk KUP BILET */}
        {event.showTicketButton && event.ticketUrl && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center ticket-btn"
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
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
      </div>

      {/* Info section */}
      <div
        className="flex flex-col"
        style={{
          position: 'relative',
          zIndex: 10,
          marginLeft: '20px',
          marginTop: '50px',
          width: '350px',
          gap: '50px',
        }}
      >
        {/* Opis */}
        {event.description?.length > 0 && (
          Array.isArray(event.description) ? (
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: 1.48,
                color: TEXT_COLOR,
              }}
            >
              <PortableText value={event.description} />
            </div>
          ) : (
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: 1.48,
                color: TEXT_COLOR,
                whiteSpace: 'pre-wrap',
              }}
            >
              {event.description}
            </p>
          )
        )}

        {/* Artyści */}
        <div
          className="flex flex-col items-center"
          style={{ gap: '20px' }}
        >
          <p
            style={{
              width: '100%',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: 1.45,
              color: TEXT_COLOR,
              textDecoration: 'underline',
              textTransform: 'uppercase',
              whiteSpace: 'pre-wrap',
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
              color: TEXT_COLOR,
              whiteSpace: 'pre-wrap',
            }}
          >
            {event.artists}
          </p>
        </div>

        {/* Program - only show if event has program */}
        {event.program && event.program.length > 0 && (
          <div
            className="flex flex-col items-start"
            style={{ gap: '20px' }}
          >
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: 1.45,
                color: TEXT_COLOR,
                textDecoration: 'underline',
                textTransform: 'uppercase',
                whiteSpace: 'pre-wrap',
              }}
            >
              {t('common.labels.program')}
            </p>
            <ul
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '16px',
                lineHeight: 1.48,
                color: TEXT_COLOR,
                listStyleType: 'disc',
                paddingLeft: '24px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {event.program.map((item, idx) => (
                <li key={idx} style={{ marginBottom: idx < event.program.length - 1 ? '8px' : '0' }}>
                  <span style={{ fontWeight: 700 }}>{item.composer}</span>
                  <span style={{ fontWeight: 500 }}> – {item.piece}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Partnerzy */}
        {event.partners && event.partners.length > 0 && (
          <div
            className="flex flex-col items-start"
            style={{ gap: '32px' }}
          >
            <p
              style={{
                width: '100%',
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: 1.45,
                color: TEXT_COLOR,
                textDecoration: 'underline',
                textTransform: 'uppercase',
                whiteSpace: 'pre-wrap',
              }}
            >
              {t('common.labels.partners')}
            </p>

            {/* Partner logos */}
            <div
              className="flex flex-col"
              style={{ gap: '20px' }}
            >
              {event.partners.map((partner, idx) => (
                <div
                  key={partner.name || idx}
                  className="relative"
                  style={{
                    height: '42px',
                  }}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={{
                      height: '100%',
                      width: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stopka */}
      <div style={{ marginTop: '64px', marginBottom: '40px' }}>
        <MobileFooter
          style={{
            position: 'relative',
            zIndex: 10,
            marginLeft: '20px',
            marginRight: '20px',
            width: '350px',
          }}
          textColor={TEXT_COLOR}
        />
      </div>
    </section>
  );
}
