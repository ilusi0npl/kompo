import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  photos,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
  BACKGROUND_COLOR,
  ACTIVE_TAB_COLOR,
} from './media-config';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#01936F';

export default function DesktopMedia() {
  const { t } = useTranslation();

  // Grid positions for 3 columns x 2 rows
  const gridPositions = [
    { left: 185, top: 276 },  // Row 1, Col 1
    { left: 515, top: 276 },  // Row 1, Col 2
    { left: 845, top: 276 },  // Row 1, Col 3
    { left: 185, top: 613 },  // Row 2, Col 1
    { left: 515, top: 613 },  // Row 2, Col 2
    { left: 845, top: 613 },  // Row 2, Col 3
  ];

  return (
    <section
      data-section="media"
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
          top: '276px',
          width: '49px',
          height: '187px',
        }}
      />

      {/* Nawigacja Zdjęcia / Wideo */}
      <span
        className="absolute"
        style={{
          left: '185px',
          top: '190px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.48,
          color: ACTIVE_TAB_COLOR,
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        {t('common.tabs.photos')}
      </span>
      <Link
        to="/media/wideo"
        className="absolute"
        style={{
          left: '405px',
          top: '190px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.48,
          color: '#131313',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        {t('common.tabs.video')}
      </Link>

      {/* Photo Grid */}
      {photos.map((photo, index) => (
        <Link
          key={photo.id}
          to={`/media/galeria/${photo.id}`}
          className="absolute flex flex-col"
          style={{
            left: `${gridPositions[index].left}px`,
            top: `${gridPositions[index].top}px`,
            width: '300px',
            gap: '16px',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          {/* Photo z smooth loading */}
          <SmoothImage
            src={photo.image}
            alt={photo.title}
            containerStyle={{
              width: '300px',
              height: '214px',
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

          {/* Photo info */}
          <div className="flex flex-col" style={{ gap: '8px' }}>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: 1.45,
                color: '#131313',
                textDecoration: 'underline',
                textTransform: 'uppercase',
              }}
            >
              {photo.title}
            </p>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: 1.48,
                color: '#131313',
              }}
            >
              fot. {photo.photographer}
            </p>
          </div>
        </Link>
      ))}

      {/* Stopka */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: '1016px',
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
