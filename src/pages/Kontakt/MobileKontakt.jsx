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
  const { t, language } = useTranslation();

  return (
    <section
      data-section="kontakt-mobile"
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

        {/* Tytuł strony rotowany */}
        <div
          className="absolute"
          style={{
            left: '45px',
            top: '192px',
            transform: 'rotate(-90deg)',
            transformOrigin: 'left top',
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '44px',
              color: TEXT_COLOR,
            }}
          >
            {t('kontakt.sideTitle')}
          </span>
        </div>
      </div>

      {/* Zdjęcie zespołu - 300x460px wycentrowane */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          top: '281px',
          width: '300px',
          height: '460px',
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
        className="absolute flex flex-col"
        style={{
          left: '20px',
          top: '761px',
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

      {/* Stopka */}
      <MobileFooter
        className="absolute"
        style={{
          left: '20px',
          top: '1100px',
          width: '350px',
        }}
        textColor={TEXT_COLOR}
      />

      {/* MobileMenu overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </section>
  );
}
