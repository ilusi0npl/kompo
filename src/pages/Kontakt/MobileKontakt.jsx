import { useState } from 'react';
import { Link } from 'react-router';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import { fundacjaData } from './kontakt-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#FF734C';
const LINE_COLOR = '#FFBD19';
const TEXT_COLOR = '#131313';

export default function MobileKontakt() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <section
      data-section="kontakt-mobile"
      className="relative flex flex-col"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: '100vh',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Pionowe linie w tle - na całą wysokość */}
      {mobileLinePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0 bottom-0"
          style={{
            left: `${left}px`,
            width: '1px',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Header z logo i menu */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: `${MOBILE_WIDTH}px`,
          backgroundColor: BACKGROUND_COLOR,
          paddingTop: '40px',
          paddingBottom: '20px',
        }}
      >
        {/* Logo */}
        <Link to="/">
          <img
            src="/assets/logo.svg"
            alt="Kompopolex"
            style={{
              marginLeft: '20px',
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

        {/* Tytuł strony - poziomy tekst */}
        <p
          style={{
            marginLeft: '20px',
            marginTop: '38px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '40px',
            lineHeight: 1.2,
            color: TEXT_COLOR,
          }}
        >
          {t('kontakt.sideTitle')}
        </p>
      </div>

      {/* Content area - flexbox grow */}
      <div className="relative flex-grow flex flex-col">
        {/* Zdjęcie zespołu - 300x460px centered */}
        <div
          className="relative mx-auto flex-shrink-0"
          style={{
            width: '300px',
            height: '460px',
            overflow: 'hidden',
          }}
        >
          <img
            src="/assets/kontakt/team-photo.jpg"
            alt="Zespół Kompopolex"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 50%' }}
          />
        </div>

        {/* Dane fundacji */}
        <div
          className="flex flex-col flex-shrink-0"
          style={{
            marginTop: '40px',
            marginLeft: '20px',
            width: '350px',
            gap: '16px',
          }}
        >
          {/* Tytuł */}
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: 1.4,
              color: TEXT_COLOR,
              textDecoration: 'underline',
              textTransform: 'uppercase',
            }}
          >
            {t('kontakt.title')}
          </p>

          {/* Dane */}
          <div
            className="flex flex-col"
            style={{
              gap: '16px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: 1.48,
              color: TEXT_COLOR,
            }}
          >
            <p>{t('kontakt.krs')} {fundacjaData.krs}</p>
            <p>{t('kontakt.regon')} {fundacjaData.regon}</p>
            <p>{t('kontakt.nip')} {fundacjaData.nip}</p>
            <div>
              <p>{t('kontakt.bankAccount')}</p>
              <p>{fundacjaData.bankAccount}</p>
            </div>
          </div>

          {/* Email */}
          <a
            href={`mailto:${fundacjaData.email}`}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: 1.48,
              color: TEXT_COLOR,
              textDecoration: 'underline',
              textTransform: 'uppercase',
            }}
          >
            {fundacjaData.email}
          </a>
        </div>

        {/* Stopka - dynamiczny margines */}
        <div className="flex-shrink-0 mt-auto" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
          <MobileFooter
            style={{
              marginLeft: '20px',
              width: '350px',
            }}
            textColor={TEXT_COLOR}
          />
        </div>
      </div>

      {/* MobileMenu overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </section>
  );
}
