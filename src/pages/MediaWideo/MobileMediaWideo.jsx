import MobileHeader, { MobileHeaderSpacer } from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { videos, ACTIVE_TAB_COLOR } from './media-wideo-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#73A1FE';
const LINE_COLOR = '#3478FF';
const TEXT_COLOR = '#131313';

export default function MobileMediaWideo() {
  const { t } = useTranslation();

  return (
    <section
      data-section="media-wideo-mobile"
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
        activeColor={ACTIVE_TAB_COLOR}
        navLinks={[
          { label: t('common.tabs.photos'), to: '/media', isActive: false },
          { label: t('common.tabs.video'), to: '/media/wideo', isActive: true },
        ]}
      />
      <MobileHeaderSpacer />

      {/* Lista wideo */}
      <div
        className="flex flex-col"
        style={{
          padding: '0 20px',
          gap: '40px',
        }}
      >
        {videos.map((video) => (
          <div key={video.id} className="flex flex-col" style={{ gap: '16px' }}>
            {/* Miniaturka wideo z przyciskiem play - smooth loading */}
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block"
              style={{
                width: '350px',
                height: '197px',
              }}
            >
              <SmoothImage
                src={video.thumbnail}
                alt={video.title}
                containerStyle={{
                  width: '350px',
                  height: '197px',
                }}
                style={{
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
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '50px',
                  height: '50px',
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

            {/* Tytuł wideo */}
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: 1.44,
                color: TEXT_COLOR,
                textTransform: 'uppercase',
              }}
            >
              {video.title}
            </p>
          </div>
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
