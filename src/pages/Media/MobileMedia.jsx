import { Link } from 'react-router';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { photos, ACTIVE_TAB_COLOR } from './media-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#34B898';
const LINE_COLOR = '#01936F';
const TEXT_COLOR = '#131313';

export default function MobileMedia() {
  const { t } = useTranslation();

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

      {/* Header z nawigacją */}
      <MobileHeader
        title={t('media.sideTitle')}
        textColor={TEXT_COLOR}
        activeColor={ACTIVE_TAB_COLOR}
        navLinks={[
          { label: t('common.tabs.photos'), to: '/media', isActive: true },
          { label: t('common.tabs.video'), to: '/media/wideo', isActive: false },
        ]}
      />

      {/* Lista zdjęć */}
      <div
        className="flex flex-col"
        style={{
          padding: '0 20px',
          gap: '40px',
        }}
      >
        {photos.map((photo) => (
          <Link
            key={photo.id}
            to={`/media/galeria/${photo.id}`}
            className="flex flex-col"
            style={{
              gap: '16px',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            {/* Zdjęcie z smooth loading */}
            <SmoothImage
              src={photo.image}
              alt={photo.title}
              containerStyle={{
                width: '300px',
                height: '214px',
                alignSelf: 'center',
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '50% 50%',
              }}
              placeholderColor="#e5e5e5"
            />

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
          </Link>
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
    </section>
  );
}
