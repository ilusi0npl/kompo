import { useState } from 'react';
import { Link } from 'react-router';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import { photos, ACTIVE_TAB_COLOR } from './media-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#34B898';
const LINE_COLOR = '#01936F';
const TEXT_COLOR = '#131313';

export default function MobileMedia() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useTranslation();

  return (
    <section
      data-section="media-mobile"
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

        {/* Tytuł strony rotowany - Media */}
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
            src="/assets/media/media-text.svg"
            alt="Media"
            style={{
              height: '107px',
              transform: 'rotate(-90deg)',
              transformOrigin: 'left top',
            }}
          />
        </div>

        {/* Nawigacja Zdjęcia / Wideo */}
        <div
          className="absolute flex"
          style={{
            left: '20px',
            top: '190px',
            gap: '20px',
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: 1.44,
              color: ACTIVE_TAB_COLOR,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {t('common.tabs.photos')}
          </span>
          <Link
            to="/media/wideo"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: 1.44,
              color: TEXT_COLOR,
              textDecoration: 'none',
            }}
          >
            {t('common.tabs.video')}
          </Link>
        </div>
      </div>

      {/* Lista zdjęć */}
      <div
        className="flex flex-col"
        style={{
          padding: '0 20px',
          gap: '40px',
        }}
      >
        {photos.map((photo) => (
          <div key={photo.id} className="flex flex-col" style={{ gap: '16px' }}>
            {/* Zdjęcie */}
            <div
              className="overflow-hidden"
              style={{
                width: '300px',
                height: '214px',
                alignSelf: 'center',
              }}
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 50%' }}
              />
            </div>

            {/* Tytuł */}
            <p
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
              {photo.title}
            </p>

            {/* Fotograf */}
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: 1.48,
                color: TEXT_COLOR,
              }}
            >
              fot. {photo.photographer}
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
