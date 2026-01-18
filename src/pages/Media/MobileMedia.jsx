import { Link } from 'react-router';
import MobileHeader, { MobileHeaderSpacer } from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { photos, ACTIVE_TAB_COLOR } from './media-config';
import { useSanityPhotoAlbums } from '../../hooks/useSanityPhotoAlbums';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = 'var(--contrast-line)';
const LINE_COLOR = 'var(--contrast-line-alt)';
const TEXT_COLOR = 'var(--contrast-text)';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

export default function MobileMedia() {
  const { t } = useTranslation();

  // Fetch from Sanity if enabled
  const { albums: sanityAlbums, loading, error } = useSanityPhotoAlbums();

  // Transform Sanity albums to match config structure
  const albums = USE_SANITY && sanityAlbums && Array.isArray(sanityAlbums)
    ? sanityAlbums.map((album) => ({
        _id: album._id,
        id: album._id,
        image: album.thumbnailUrl || '',
        title: album.title || 'Untitled',
        photographer: album.photographer || '',
        images: album.imageUrls || [],
      }))
    : photos;

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="media-mobile"
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          width: `${MOBILE_WIDTH}px`,
          minHeight: '100vh',
          backgroundColor: BACKGROUND_COLOR,
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '16px',
            color: TEXT_COLOR,
          }}
        >
          {t('common.loading.albums')}
        </div>
      </section>
    );
  }

  // Show error state only when using Sanity
  if (USE_SANITY && error) {
    return (
      <section
        data-section="media-mobile"
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          width: `${MOBILE_WIDTH}px`,
          minHeight: '100vh',
          backgroundColor: BACKGROUND_COLOR,
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '16px',
            color: 'var(--contrast-error)',
          }}
        >
          Błąd ładowania galerii
        </div>
      </section>
    );
  }

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

      {/* Header z nawigacją - fixed */}
      <MobileHeader
        title={t('media.sideTitle')}
        textColor={TEXT_COLOR}
        backgroundColor={BACKGROUND_COLOR}
        lineColor={LINE_COLOR}
        isFixed={true}
        headerHeight={326}
        activeColor={ACTIVE_TAB_COLOR}
        navLinksTop={257}
        navLinksGap={101}
        navLinksFontSize={20}
        navLinks={[
          { label: t('common.tabs.photos'), to: '/media', isActive: true },
          { label: t('common.tabs.video'), to: '/media/wideo', isActive: false },
        ]}
      />
      <MobileHeaderSpacer height={326} />

      {/* Lista zdjęć */}
      <div
        className="flex flex-col"
        style={{
          padding: '0 20px',
          gap: '40px',
        }}
      >
        {albums.map((album) => (
          <Link
            key={album._id || album.id}
            to={`/media/galeria/${album._id || album.id}`}
            className="flex flex-col"
            style={{
              gap: '16px',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            {/* Zdjęcie z smooth loading */}
            <SmoothImage
              src={album.image}
              alt={album.title}
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
              placeholderColor="var(--contrast-placeholder)"
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
              {album.title}
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
              fot. {album.photographer}
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
