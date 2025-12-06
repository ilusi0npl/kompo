import { useState } from 'react';
import { Link } from 'react-router';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { archivedEvents } from './archiwalne-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#FDFDFD';
const LINE_COLOR = '#A0E38A';
const TEXT_COLOR = '#131313';

export default function MobileArchiwalne() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useTranslation();

  return (
    <section
      data-section="archiwalne-mobile"
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

      {/* Header */}
      <div className="relative" style={{ height: '281px' }}>
        {/* Logo */}
        <Link to="/">
          <img
            src="/assets/logo.svg"
            alt="Kompopolex"
            className="absolute"
            style={{
              left: '20px',
              top: '40px',
              width: '104px',
              height: '42px',
            }}
          />
        </Link>

        {/* MENU button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="absolute"
          style={{
            left: '312px',
            top: '43px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '24px',
            color: TEXT_COLOR,
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          MENU
        </button>

        {/* Tytuł strony rotowany - Kalendarz (ta sama nazwa) */}
        <div
          className="absolute"
          style={{
            left: '45px',
            top: '240px',
            width: '107px',
            height: '49px',
          }}
        >
          <img
            src={language === 'pl' ? '/assets/kalendarz/kalendarz-text.svg' : '/assets/kalendarz/calendar-text.svg'}
            alt={language === 'pl' ? 'Kalendarz' : 'Calendar'}
            style={{
              height: '107px',
              transform: 'rotate(-90deg)',
              transformOrigin: 'left top',
            }}
          />
        </div>

        {/* Nawigacja Nadchodzące / Archiwalne */}
        <div
          className="absolute flex"
          style={{
            left: '20px',
            top: '190px',
            gap: '20px',
          }}
        >
          <Link
            to="/kalendarz"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: 1.44,
              color: TEXT_COLOR,
              textDecoration: 'none',
            }}
          >
            {t('common.tabs.upcoming')}
          </Link>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: 1.44,
              color: '#761FE0',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {t('common.tabs.archived')}
          </span>
        </div>
      </div>

      {/* Lista eventów */}
      <div
        className="flex flex-col"
        style={{
          padding: '0 20px',
          gap: '40px',
        }}
      >
        {archivedEvents.map((event) => (
          <div key={event.id} className="flex flex-col" style={{ gap: '16px' }}>
            {/* Zdjęcie z smooth loading */}
            <SmoothImage
              src={event.image}
              alt={event.title}
              containerStyle={{
                width: '300px',
                height: '420px',
                alignSelf: 'center',
                border: event.hasBorder ? '1px solid #131313' : 'none',
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '50% 50%',
              }}
              placeholderColor="#e5e5e5"
            />

            {/* Data */}
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: 1.48,
                color: TEXT_COLOR,
              }}
            >
              {event.date}
            </p>

            {/* Tytuł (link) */}
            <Link
              to={`/wydarzenie/${event.id}`}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: 1.45,
                color: TEXT_COLOR,
                textDecoration: 'underline',
                textTransform: 'uppercase',
              }}
            >
              {event.title}
            </Link>

            {/* Wykonawcy */}
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: 1.48,
                color: TEXT_COLOR,
              }}
            >
              {event.performers}
            </p>
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

      {/* MobileMenu overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </section>
  );
}
