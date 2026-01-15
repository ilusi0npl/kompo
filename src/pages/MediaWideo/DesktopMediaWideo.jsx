import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  videos,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
  BACKGROUND_COLOR,
  ACTIVE_TAB_COLOR,
} from './media-wideo-config';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#3478FF';

export default function DesktopMediaWideo() {
  const { t } = useTranslation();

  // Grid positions for 2 columns x 2 rows
  const gridPositions = [
    { left: 185, top: 275 },  // Row 1, Col 1
    { left: 690, top: 275 },  // Row 1, Col 2
    { left: 185, top: 655 },  // Row 2, Col 1
    { left: 690, top: 655 },  // Row 2, Col 2
  ];

  return (
    <section
      data-section="media-wideo"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: BACKGROUND_COLOR,
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

      {/* Media - pionowy tekst po lewej */}
      <img
        src="/assets/media/media-text.svg"
        alt="Media"
        className="absolute"
        style={{
          left: '94px',
          top: '275px',
          width: '49px',
          height: '187px',
        }}
      />

      {/* Nawigacja Zdjęcia / Wideo */}
      <Link
        to="/media"
        className="absolute nav-link"
        style={{
          left: '185px',
          top: '190px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.44,
          color: '#131313',
        }}
      >
        {t('common.tabs.photos')}
      </Link>
      <span
        className="absolute nav-link--active"
        style={{
          left: '405px',
          top: '190px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.44,
          color: ACTIVE_TAB_COLOR,
        }}
      >
        {t('common.tabs.video')}
      </span>

      {/* Video Grid */}
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="absolute flex flex-col"
          style={{
            left: `${gridPositions[index].left}px`,
            top: `${gridPositions[index].top}px`,
            width: '455px',
            gap: '16px',
          }}
        >
          {/* Video Thumbnail with Play Button - smooth loading */}
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block"
            style={{
              width: '455px',
              height: '256px',
            }}
          >
            <SmoothImage
              src={video.thumbnail}
              alt={video.title}
              containerStyle={{
                width: '455px',
                height: '256px',
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
            {/* Play Icon */}
            <div
              className="absolute"
              style={{
                left: '198px',
                top: '98px',
                width: '60px',
                height: '60px',
                zIndex: 10,
              }}
            >
              <img
                src="/assets/media-wideo/play-icon.svg"
                alt="Play"
                className="w-full h-full"
              />
            </div>
          </a>

          {/* Video Title */}
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: 1.44,
              color: '#131313',
              textTransform: 'uppercase',
            }}
          >
            {video.title}
          </p>
        </div>
      ))}

      {/* Stopka */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: '1111px',
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
            { key: 'media', href: '/media', active: true },
            { key: 'kalendarz', href: '/kalendarz', active: false },
            { key: 'repertuar', href: '/repertuar', active: false },
            { key: 'fundacja', href: '/fundacja', active: false },
            { key: 'kontakt', href: '/kontakt', active: false },
          ].map((item) => (
            item.href.startsWith('/') && !item.href.includes('#') ? (
              <Link
                key={item.key}
                to={item.href}
                className={`nav-link ${item.active ? 'nav-link--active' : ''}`}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.48,
                  color: '#131313',
                }}
              >
                {t(`common.nav.${item.key}`)}
              </Link>
            ) : (
              <a
                key={item.key}
                href={item.href}
                className={`nav-link ${item.active ? 'nav-link--active' : ''}`}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.48,
                  color: '#131313',
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
