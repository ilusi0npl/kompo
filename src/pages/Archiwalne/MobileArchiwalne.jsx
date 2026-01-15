import { Link } from 'react-router';
import MobileHeader, { MobileHeaderSpacer } from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { archivedEvents } from './archiwalne-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#FDFDFD';
const LINE_COLOR = '#A0E38A';
const TEXT_COLOR = '#131313';

export default function MobileArchiwalne() {
  const { t } = useTranslation();

  return (
    <section
      data-section="archiwalne-mobile"
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
        title={t('kalendarz.sideTitle')}
        textColor={TEXT_COLOR}
        backgroundColor={BACKGROUND_COLOR}
        lineColor={LINE_COLOR}
        isFixed={true}
        headerHeight={326}
        navLinksTop={257}
        navLinksGap={55}
        navLinksFontSize={20}
        navLinks={[
          { label: t('common.tabs.upcoming'), to: '/kalendarz', isActive: false },
          { label: t('common.tabs.archived'), to: '/archiwalne', isActive: true },
        ]}
      />
      <MobileHeaderSpacer height={326} />

      {/* Lista eventów */}
      <div
        className="flex flex-col"
        style={{
          padding: '0 20px',
          gap: '40px',
        }}
      >
        {archivedEvents.map((event) => (
          <div key={event.id} className="flex flex-col" style={{ gap: '16px' }}>
            {/* Zdjęcie z smooth loading - klikalny plakat */}
            <Link
              to={`/wydarzenie/${event.id}`}
              className="event-poster-link"
              style={{
                width: '300px',
                height: '420px',
                alignSelf: 'center',
                border: event.hasBorder ? '1px solid #131313' : 'none',
              }}
            >
              <SmoothImage
                src={event.image}
                alt={event.title}
                containerStyle={{
                  width: '300px',
                  height: '420px',
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 50%',
                }}
                placeholderColor="#e5e5e5"
              />
            </Link>

            {/* Data */}
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: 1.48,
                color: TEXT_COLOR,
              }}
            >
              {event.date}
            </p>

            {/* Tytuł (link) z hover na fiolet */}
            <Link
              to={`/wydarzenie/${event.id}`}
              className="event-title-link"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: 1.45,
                color: TEXT_COLOR,
                textTransform: 'uppercase',
              }}
            >
              {event.title}
            </Link>

            {/* Wykonawcy */}
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: 1.48,
                color: TEXT_COLOR,
              }}
            >
              {event.performers}
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
