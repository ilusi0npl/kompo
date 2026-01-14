import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import { eventData } from './wydarzenie-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#FDFDFD';
const LINE_COLOR = '#A0E38A';
const TEXT_COLOR = '#131313';

export default function MobileWydarzenie2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <section
      data-section="wydarzenie-mobile"
      className="relative"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: '3000px',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Pionowe linie - 3 linie at x = 97, 195, 292 */}
      {mobileLinePositions.map((left, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${left}px`,
            top: '-38px',
            width: '1px',
            height: '3863px',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Header - 326px height */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '390px',
          height: '326px',
          backgroundColor: BACKGROUND_COLOR,
          overflow: 'clip',
        }}
      >
        {/* MENU button - top right */}
        <button
          onClick={() => setIsMenuOpen(true)}
          style={{
            position: 'absolute',
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

        {/* "Wydarzenie" title - horizontal, 48px font */}
        <p
          style={{
            position: 'absolute',
            left: '20px',
            top: '152px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '48px',
            lineHeight: 1.35,
            color: TEXT_COLOR,
          }}
        >
          {t('wydarzenie.sideTitle')}
        </p>
      </div>

      {/* Main content - top: 326px, left: 20px, width: 350px */}
      <div
        className="absolute flex flex-col"
        style={{
          left: '20px',
          top: '326px',
          width: '350px',
          gap: '40px',
        }}
      >
        {/* Poster - 330x462px centered */}
        <div
          style={{
            width: '350px',
            display: 'flex',
            justifyContent: 'center',
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
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '50% 50%',
            }}
            placeholderColor="#e5e5e5"
          />
        </div>

        {/* Content section - gap: 20px */}
        <div
          className="flex flex-col"
          style={{
            width: '100%',
            gap: '20px',
          }}
        >
          {/* Date - 20px SemiBold */}
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: 1.44,
              color: TEXT_COLOR,
            }}
          >
            {eventData.date}| {eventData.time}
          </p>

          {/* Title + Artists + Description + Location - gap: 24px */}
          <div
            className="flex flex-col"
            style={{
              width: '100%',
              gap: '24px',
            }}
          >
            {/* Title + Artists - gap: 16px */}
            <div
              className="flex flex-col"
              style={{
                width: '100%',
                gap: '16px',
              }}
            >
              {/* Title - 32px, purple, underlined, uppercase */}
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: '32px',
                  lineHeight: 1.4,
                  color: '#761FE0',
                  textDecoration: 'underline',
                  textTransform: 'uppercase',
                }}
              >
                {eventData.title}
              </p>

              {/* Artists - 16px Bold */}
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: 1.48,
                  color: TEXT_COLOR,
                }}
              >
                {eventData.artists}
              </p>
            </div>

            {/* Description - 16px Medium */}
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

            {/* Location - 20px Bold + icon 30x30 */}
            <div
              className="flex"
              style={{
                width: '100%',
                gap: '10px',
                alignItems: 'flex-start',
              }}
            >
              <img
                src="/assets/wydarzenie/place-icon.svg"
                alt="Location"
                style={{ width: '30px', height: '30px', flexShrink: 0 }}
              />
              <p
                style={{
                  flex: '1 0 0',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: 1.44,
                  color: TEXT_COLOR,
                  textTransform: 'uppercase',
                }}
              >
                {eventData.location}
              </p>
            </div>
          </div>
        </div>

        {/* Button "KUP BILET" */}
        <a
          href={eventData.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
          style={{
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
      </div>

      {/* Stopka - bottom: 41px, left: calc(25% + 18.5px) */}
      <div
        className="absolute flex flex-col"
        style={{
          bottom: '41px',
          left: 'calc(25% + 18.5px)',
          transform: 'translateX(-50%)',
          gap: '20px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: 1.48,
          color: TEXT_COLOR,
          textTransform: 'uppercase',
        }}
      >
        <p>KOMPOPOLEX@GMAIL.COM</p>
        <a
          href="https://www.facebook.com/ensemblekompopolex/?locale=pl_PL"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', color: TEXT_COLOR }}
        >
          FACEBOOK
        </a>
        <a
          href="https://www.instagram.com/kompopolex/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', color: TEXT_COLOR }}
        >
          INSTAGRAM
        </a>
      </div>

      {/* MobileMenu overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </section>
  );
}
