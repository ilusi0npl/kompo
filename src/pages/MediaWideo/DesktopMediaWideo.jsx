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

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#3478FF';

/**
 * Transform Sanity videos to match config structure
 */
function transformSanityVideos(sanityVideos) {
  if (!sanityVideos || !Array.isArray(sanityVideos)) {
    return [];
  }

  return sanityVideos.map((video, index) => ({
    id: index + 1,
    thumbnail: video.thumbnailUrl || '',
    title: video.title || 'Untitled',
    youtubeUrl: video.videoUrl || '',
  }));
}

export default function DesktopMediaWideo() {
  const { t } = useTranslation();

  // Fetch from Sanity if enabled
  const { videos: sanityVideos, loading, error } = useSanityVideos();

  // Use Sanity data if enabled, otherwise use config
  const videos = USE_SANITY && sanityVideos ? transformSanityVideos(sanityVideos) : configVideos;

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
          {t('common.loading.videos')}
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

  // Dynamic grid calculation (2 columns, unlimited rows)
  const GRID_START_LEFT = 185;
  const GRID_START_TOP = 275;
  const COL_SPACING = 505; // 690 - 185
  const ROW_SPACING = 380; // 655 - 275
  const VIDEO_HEIGHT = 301; // thumbnail (256) + gap (16) + title (~29)
  const FOOTER_SPACING = 155; // space between last video and footer

  const calculatePosition = (index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    return {
      left: GRID_START_LEFT + (col * COL_SPACING),
      top: GRID_START_TOP + (row * ROW_SPACING),
    };
  };

  // Calculate dynamic height based on number of videos
  const numRows = Math.ceil(videos.length / 2);
  const lastRowTop = GRID_START_TOP + ((numRows - 1) * ROW_SPACING);
  const lastVideoBottom = lastRowTop + VIDEO_HEIGHT;
  const footerTop = lastVideoBottom + FOOTER_SPACING;
  const totalHeight = footerTop + 70; // footer height (~30px) + bottom margin (40px)

  return (
    <section
      data-section="media-wideo"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        height: `${totalHeight}px`,
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

      {/* Video Grid */}
      {videos.map((video, index) => {
        const position = calculatePosition(index);
        return (
          <div
            key={video.id}
            className="absolute flex flex-col"
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
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
