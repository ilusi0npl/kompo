import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import {
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
  BACKGROUND_COLOR,
  fundacjaData,
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

      {/* Kontakt - pionowy tekst po lewej */}
      <img
        src={language === 'pl' ? '/assets/kontakt/kontakt-text.svg' : '/assets/kontakt/contact-text.svg'}
        alt={language === 'pl' ? 'Kontakt' : 'Contact'}
        className="absolute"
        style={{
          left: '94px',
          top: '371px',
          width: '49px',
          height: '260px',
        }}
      />

      {/* Zdjęcie zespołu */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: '185px',
          top: '180px',
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
          left: '618px',
          top: '180px',
          width: '480px',
          gap: '32px',
        }}
      >
        {/* Tytuł */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '32px',
            lineHeight: 1.4,
            color: '#131313',
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
            gap: '32px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: 1.44,
            color: '#131313',
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
            fontSize: '24px',
            lineHeight: 1.45,
            color: '#131313',
            textDecoration: 'underline',
            textTransform: 'uppercase',
          }}
        >
          {fundacjaData.email}
        </a>
      </div>

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
            { key: 'repertuar', href: '#repertuar', active: false },
            { key: 'fundacja', href: '#fundacja', active: false },
            { key: 'kontakt', href: '/kontakt', active: true },
          ].map((item) => (
            item.href.startsWith('/') ? (
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
