import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
  CONTACT_EMAIL,
} from './kontakt-config';
import { useSanityKontaktPage } from '../../hooks/useSanityKontaktPage';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#FFBD19';

export default function DesktopKontakt() {
  const { t } = useTranslation();

  // Fetch from Sanity if enabled
  const { data: sanityData, loading, error } = useSanityKontaktPage();

  // Use Sanity data if enabled, otherwise use config
  const email = USE_SANITY && sanityData ? sanityData.email : CONTACT_EMAIL;
  const teamImageSrc = USE_SANITY && sanityData
    ? sanityData.teamImageUrl
    : '/assets/kontakt/team-photo.jpg';

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="kontakt"
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          height: `${DESKTOP_HEIGHT}px`,
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '16px',
            color: '#131313',
          }}
        >
          {t('common.loading.contact')}
        </div>
      </section>
    );
  }

  // Show error state only when using Sanity
  if (USE_SANITY && error) {
    return (
      <section
        data-section="kontakt"
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          height: `${DESKTOP_HEIGHT}px`,
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '16px',
            color: '#FF0000',
          }}
        >
          Błąd ładowania strony kontakt. Spróbuj ponownie później.
        </div>
      </section>
    );
  }

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
      {/* Pionowe linie dekoracyjne */}
      {LINE_POSITIONS.map((x) => (
        <div
          key={x}
          className="absolute top-0 decorative-line"
          style={{
            left: `${x}px`,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Zdjęcie zespołu z smooth loading */}
      <SmoothImage
        src={teamImageSrc}
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
        href={`mailto:${email}`}
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
        {email}
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
