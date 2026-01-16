import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useSanityVideos } from '../../hooks/useSanityVideos';
import {
  videos as configVideos,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './media-wideo-config';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

/**
 * Transform Sanity videos to match config structure
 */
function transformSanityVideos(sanityVideos) {
  return sanityVideos.map((video, index) => ({
    id: index + 1,
    thumbnail: video.thumbnailUrl,
    title: video.title,
    youtubeUrl: video.videoUrl,
  }));
}

export default function DesktopMediaWideo() {
  const { t } = useTranslation();

  // Fetch from Sanity if enabled
  const { videos: sanityVideos, loading, error } = useSanityVideos();

  // Use Sanity data if enabled, otherwise use config
  const videos = USE_SANITY ? transformSanityVideos(sanityVideos) : configVideos;

  // Loading state
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="media-wideo"
        className="relative flex items-center justify-center"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          height: `${DESKTOP_HEIGHT}px`,
          backgroundColor: 'transparent',
        }}
      >
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px' }}>
          Ładowanie filmów...
        </p>
      </section>
    );
  }

  // Error state
  if (USE_SANITY && error) {
    console.error('Failed to load videos from Sanity:', error);
    return (
      <section
        data-section="media-wideo"
        className="relative flex items-center justify-center"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          height: `${DESKTOP_HEIGHT}px`,
          backgroundColor: 'transparent',
        }}
      >
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px', color: '#ff0000' }}>
          Błąd ładowania filmów
        </p>
      </section>
    );
  }

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
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
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
    </section>
  );
}
