import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './kontakt-config';

export default function DesktopKontakt() {
  const { t } = useTranslation();

  return (
    <section
      data-section="kontakt"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
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
    </section>
  );
}
