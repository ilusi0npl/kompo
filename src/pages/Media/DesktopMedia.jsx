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
        _id: album._id,
        id: album._id,
        image: album.thumbnailUrl,
        title: album.title,
        photographer: album.photographer,
        images: album.imageUrls || [],
      }))
    : photos;

  // Dynamic grid calculation (3 columns, unlimited rows)
  const GRID_START_LEFT = 185;
  const GRID_START_TOP = 276;
  const COL_SPACING = 330; // 515 - 185
  const ROW_SPACING = 337; // 613 - 276
  const ALBUM_HEIGHT = 290; // thumbnail (214) + gap (16) + text (~60)
  const FOOTER_SPACING = 113; // space between last album and footer

  const calculatePosition = (index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return {
      left: GRID_START_LEFT + (col * COL_SPACING),
      top: GRID_START_TOP + (row * ROW_SPACING),
    };
  };

  // Calculate dynamic height based on number of albums
  const numRows = Math.ceil(transformedAlbums.length / 3);
  const lastRowTop = GRID_START_TOP + ((numRows - 1) * ROW_SPACING);
  const lastAlbumBottom = lastRowTop + ALBUM_HEIGHT;
  const footerTop = lastAlbumBottom + FOOTER_SPACING;
  const totalHeight = footerTop + 70; // footer height (~30px) + bottom margin (40px)

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
        height: `${totalHeight}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
      {/* Photo Grid */}
      {transformedAlbums.map((photo, index) => {
        const position = calculatePosition(index);
        return (
          <Link
            key={photo._id || photo.id}
            to={`/media/galeria/${photo._id || photo.id}`}
            className="absolute flex flex-col"
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
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
        );
      })}

      {/* Stopka - dynamic position */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: `${footerTop}px`,
          width: '520px',
        }}
      />
    </section>
  );
}
