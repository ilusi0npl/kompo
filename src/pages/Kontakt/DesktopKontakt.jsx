import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
  BACKGROUND_COLOR,
} from './kontakt-config';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#FFBD19';

export default function DesktopKontakt() {
  const { t, language } = useTranslation();

  return (
    <section
      data-section="kontakt"
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

      {/* Kontakt - pionowy tekst po lewej (rotacja 90 stopni) */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '94px',
          top: '371px',
          width: '45px',
          height: '269px',
        }}
      >
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '64px',
            lineHeight: 1.4,
            color: '#131313',
            transform: 'rotate(90deg)',
            whiteSpace: 'nowrap',
          }}
        >
          {t('kontakt.sideTitle')}
        </p>
      </div>

      {/* Zdjęcie zespołu z smooth loading */}
      <SmoothImage
        src="/assets/kontakt/team-photo.jpg"
        alt="Zespół Kompopolex"
        className="absolute"
        containerStyle={{
          left: '185px',
          top: '180px',
          width: '300px',
          height: '460px',
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

      {/* Email - główny element kontaktowy */}
      <a
        href="mailto:KOMPOPOLEX@GMAIL.COM"
        className="absolute"
        style={{
          left: '618px',
          top: '371px',
          width: '480px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '40px',
          lineHeight: 1.35,
          color: '#131313',
          textDecoration: 'underline',
          textUnderlinePosition: 'from-font',
          textTransform: 'uppercase',
          whiteSpace: 'pre-wrap',
        }}
      >
        KOMPOPOLEX@GMAIL.COM
      </a>

      {/* Stopka */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: '776px',
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
            { key: 'kalendarz', href: '/kalendarz', active: false },
            { key: 'repertuar', href: '/repertuar', active: false },
            { key: 'fundacja', href: '/fundacja', active: false },
            { key: 'kontakt', href: '/kontakt', active: true },
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
