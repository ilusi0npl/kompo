import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useFixedMobileHeader } from '../../hooks/useFixedMobileHeader';
import { eventData } from './wydarzenie-config';

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

  return (
    <section
      data-section="wydarzenie-mobile"
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

      {/* Fixed header via portal */}
      {typeof document !== 'undefined' && createPortal(
        <div
          className="fixed top-0 left-0"
          style={{
            width: `${MOBILE_WIDTH}px`,
            height: `${HEADER_HEIGHT}px`,
            backgroundColor: BACKGROUND_COLOR,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            zIndex: 100,
          }}
        >
          {/* Pionowe linie w fixed headerze */}
          {mobileLinePositions.map((left, index) => (
            <div
              key={`header-line-${index}`}
              className="absolute top-0"
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
        document.body
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: `${HEADER_HEIGHT}px` }} />

      {/* Tytuł wydarzenia */}
      <p
        style={{
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
        {eventData.title}
      </p>

      {/* Zdjęcie */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '50px',
        }}
      >
        <SmoothImage
          src={eventData.image}
          alt={eventData.title}
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
            {eventData.date}| {eventData.time}
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
            <p style={{ marginBottom: 0 }}>ASP WROCŁAW,</p>
            <p>PL. POLSKI 3/4 </p>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div
        className="flex flex-col"
        style={{
          marginLeft: '20px',
          marginTop: '50px',
          width: '350px',
          gap: '50px',
        }}
      >
        {/* Opis */}
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
          {eventData.description}
        </p>

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
            {eventData.artists}
          </p>
        </div>

        {/* Program */}
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
            {eventData.program.map((item, idx) => (
              <li key={idx} style={{ marginBottom: idx < eventData.program.length - 1 ? '8px' : '0' }}>
                <span style={{ fontWeight: 700 }}>{item.composer}</span>
                <span style={{ fontWeight: 500 }}>- {item.piece}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Partnerzy */}
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

          {/* Partner logos - flex-col gap: 20px */}
          <div
            className="flex flex-col"
            style={{ gap: '20px' }}
          >
            {/* Logo Wrocław - 309px x 42px with overflow */}
            <div
              className="relative"
              style={{
                width: '309px',
                height: '42px',
              }}
            >
              <div
                className="absolute"
                style={{
                  inset: 0,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={eventData.partners[0].logo}
                  alt={eventData.partners[0].name}
                  className="absolute"
                  style={{
                    height: '100%',
                    left: '-2.62%',
                    top: 0,
                    width: '104.6%',
                    maxWidth: 'none',
                  }}
                />
              </div>
            </div>

            {/* Logo ZAIKS - 93px x 42px */}
            <div
              className="relative"
              style={{
                width: '93px',
                height: '42px',
              }}
            >
              <img
                src={eventData.partners[1].logo}
                alt={eventData.partners[1].name}
                className="absolute"
                style={{
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 50%',
                }}
              />
            </div>

            {/* Logo Recepcja - 122px x 42px with special positioning */}
            <div
              className="relative"
              style={{
                width: '122px',
                height: '42px',
              }}
            >
              <div
                className="absolute"
                style={{
                  inset: 0,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={eventData.partners[2].logo}
                  alt={eventData.partners[2].name}
                  className="absolute"
                  style={{
                    height: '61.54%',
                    left: '-0.06%',
                    top: '25.96%',
                    width: '100.12%',
                    maxWidth: 'none',
                  }}
                />
              </div>
            </div>

            {/* Logo Polmic - 129px x 42px */}
            <div
              className="relative"
              style={{
                width: '129px',
                height: '42px',
              }}
            >
              <img
                src={eventData.partners[3].logo}
                alt={eventData.partners[3].name}
                className="absolute"
                style={{
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 50%',
                }}
              />
            </div>
          </div>
        </div>
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
