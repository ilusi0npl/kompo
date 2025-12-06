import { useState } from 'react';
import { Link } from 'react-router';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import { videos, ACTIVE_TAB_COLOR } from './media-wideo-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#73A1FE';
const LINE_COLOR = '#3478FF';
const TEXT_COLOR = '#131313';

export default function MobileMediaWideo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <section
      data-section="media-wideo-mobile"
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
          <Link
            to="/media"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: 1.44,
              color: TEXT_COLOR,
              textDecoration: 'none',
            }}
          >
            {t('common.tabs.photos')}
          </Link>
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
            {t('common.tabs.video')}
          </span>
        </div>
      </div>

      {/* Lista wideo */}
      <div
        className="flex flex-col"
        style={{
          padding: '0 20px',
          gap: '40px',
        }}
      >
        {videos.map((video) => (
          <div key={video.id} className="flex flex-col" style={{ gap: '16px' }}>
            {/* Miniaturka wideo z przyciskiem play */}
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block overflow-hidden"
              style={{
                width: '350px',
                height: '197px',
              }}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 50%' }}
              />
              {/* Play Icon */}
              <div
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '50px',
                  height: '50px',
                }}
              >
                <img
                  src="/assets/media-wideo/play-icon.svg"
                  alt="Play"
                  className="w-full h-full"
                />
              </div>
            </a>

            {/* Tytuł wideo */}
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: 1.44,
                color: TEXT_COLOR,
                textTransform: 'uppercase',
              }}
            >
              {video.title}
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
