import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  photos,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './media-config';
import { useSanityPhotoAlbums } from '../../hooks/useSanityPhotoAlbums';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

export default function DesktopMedia() {
  const { t } = useTranslation();

  // Fetch from Sanity if enabled
  const { albums: sanityAlbums, loading, error } = useSanityPhotoAlbums();

  // Transform Sanity albums to match config structure
  const transformedAlbums = USE_SANITY && sanityAlbums
    ? sanityAlbums.map((album) => ({
        id: album.order,
        image: album.thumbnailUrl,
        title: album.title,
        photographer: album.photographer,
        images: album.imageUrls || [],
      }))
    : photos;

  // Grid positions for 3 columns x 2 rows
  const gridPositions = [
    { left: 185, top: 276 },  // Row 1, Col 1
    { left: 515, top: 276 },  // Row 1, Col 2
    { left: 845, top: 276 },  // Row 1, Col 3
    { left: 185, top: 613 },  // Row 2, Col 1
    { left: 515, top: 613 },  // Row 2, Col 2
    { left: 845, top: 613 },  // Row 2, Col 3
  ];

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="media"
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
          Ładowanie albumów...
        </div>
      </section>
    );
  }

  // Show error state only when using Sanity
  if (USE_SANITY && error) {
    return (
      <section
        data-section="media"
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
          Błąd ładowania albumów. Spróbuj ponownie później.
        </div>
      </section>
    );
  }

  return (
    <section
      data-section="media"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
      {/* Photo Grid */}
      {transformedAlbums.map((photo, index) => (
        <Link
          key={photo._id || photo.id}
          to={`/media/galeria/${photo._id || photo.id}`}
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
    </section>
  );
}
