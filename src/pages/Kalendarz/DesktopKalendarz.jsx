import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  events,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './kalendarz-config';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#A0E38A';

// Helper to make title a link
const EventTitle = ({ event, t }) => (
  <Link
    to={`/wydarzenie/${event.id}`}
    style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontWeight: 600,
      fontSize: '32px',
      lineHeight: 1.4,
      color: '#131313',
      textDecoration: 'underline',
      textTransform: 'uppercase',
    }}
  >
    {t(`kalendarz.events.event${event.id}.title`)}
  </Link>
);

export default function DesktopKalendarz() {
  const { t, language } = useTranslation();

  return (
    <section
      data-section="kalendarz"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: '#FDFDFD',
      }}
    >
      {/* Pionowe linie dekoracyjne */}
      {LINE_POSITIONS.map((x) => (
        <div
          key={x}
          className="absolute top-0"
          style={{
            left: `${x}px`,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Logo */}
      <Link to="/">
        <img
          src="/assets/logo.svg"
          alt="Kompopolex"
          className="absolute"
          style={{
            left: '185px',
            top: '60px',
            width: '149px',
            height: '60px',
          }}
        />
      </Link>

      {/* Kalendarz - pionowy tekst po lewej (rotacja 90 stopni) */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '94px',
          top: '275px',
          width: '45px',
          height: '346px',
        }}
      >
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '64px',
            lineHeight: 1.1,
            color: '#131313',
            transform: 'rotate(90deg)',
            whiteSpace: 'nowrap',
          }}
        >
          {t('kalendarz.sideTitle')}
        </p>
      </div>

      {/* Nawigacja Nadchodzące / Archiwalne */}
      <span
        className="absolute"
        style={{
          left: '185px',
          top: '190px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.44,
          color: '#761FE0',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        {t('common.tabs.upcoming')}
      </span>
      <Link
        to="/archiwalne"
        className="absolute"
        style={{
          left: '405px',
          top: '190px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.44,
          color: '#131313',
          cursor: 'pointer',
          textDecoration: 'none',
        }}
      >
        {t('common.tabs.archived')}
      </Link>

      {/* Event 1 */}
      <SmoothImage
        src={events[0].image}
        alt={events[0].title}
        className="absolute"
        containerStyle={{
          left: '185px',
          top: '275px',
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
      <SmoothImage
        src={events[1].image}
        alt={events[1].title}
        className="absolute"
        containerStyle={{
          left: '185px',
          top: '807px',
          width: '330px',
          height: '462px',
        }}
        style={events[1].imageStyle}
        placeholderColor="#e5e5e5"
      />
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
      <SmoothImage
        src={events[2].image}
        alt={events[2].title}
        className="absolute"
        containerStyle={{
          left: '185px',
          top: '1339px',
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
          left: '185px',
          top: '1944px',
          width: '520px',
        }}
      />

      {/* Prawa nawigacja */}
      <div
        className="absolute"
        style={{
          left: '1265px',
          top: '60px',
          width: '100px',
        }}
      >
        {/* Language Toggle */}
        <LanguageToggle textColor="#131313" />

        {/* Menu items */}
        <nav
          className="absolute flex flex-col"
          style={{
            top: '308px',
            left: '0',
            gap: '22px',
          }}
        >
          {[
            { key: 'bio', href: '/bio', active: false },
            { key: 'media', href: '/media', active: false },
            { key: 'kalendarz', href: '/kalendarz', active: true },
            { key: 'repertuar', href: '#repertuar', active: false },
            { key: 'fundacja', href: '#fundacja', active: false },
            { key: 'kontakt', href: '/kontakt', active: false },
          ].map((item) => (
            item.href.startsWith('/') ? (
              <Link
                key={item.key}
                to={item.href}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.48,
                  color: '#131313',
                  textDecoration: item.active ? 'underline' : 'none',
                }}
              >
                {t(`common.nav.${item.key}`)}
              </Link>
            ) : (
              <a
                key={item.key}
                href={item.href}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.48,
                  color: '#131313',
                  textDecoration: item.active ? 'underline' : 'none',
                }}
              >
                {t(`common.nav.${item.key}`)}
              </a>
            )
          ))}
        </nav>
      </div>
    </section>
  );
}
