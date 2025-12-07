import MobileHeader from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { eventData } from './wydarzenie-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#FDFDFD';
const LINE_COLOR = '#A0E38A';
const TEXT_COLOR = '#131313';

export default function MobileWydarzenie() {
  const { t, language } = useTranslation();

  return (
    <section
      data-section="wydarzenie-mobile"
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

      {/* Header z tytułem */}
      <MobileHeader
        title={t('wydarzenie.sideTitle')}
        textColor={TEXT_COLOR}
      />

      {/* Treść wydarzenia */}
      <div
        className="flex flex-col"
        style={{
          padding: '0 20px',
          gap: '24px',
        }}
      >
        {/* Tytuł wydarzenia */}
        <h1
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: 1.35,
            color: '#761FE0',
            textDecoration: 'underline',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {eventData.title}
        </h1>

        {/* Zdjęcie z smooth loading */}
        <SmoothImage
          src={eventData.image}
          alt={eventData.title}
          containerStyle={{
            width: '300px',
            height: '420px',
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

        {/* Data i godzina */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: 1.48,
            color: TEXT_COLOR,
            textAlign: 'center',
          }}
        >
          {eventData.date}| {eventData.time}
        </p>

        {/* Lokalizacja */}
        <div
          className="flex items-center justify-center"
          style={{ gap: '8px' }}
        >
          <img
            src="/assets/wydarzenie/place-icon.svg"
            alt="Location"
            style={{ width: '24px', height: '24px', flexShrink: 0 }}
          />
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: 1.44,
              color: TEXT_COLOR,
              textTransform: 'uppercase',
            }}
          >
            {eventData.location}
          </p>
        </div>

        {/* Opis */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: 1.48,
            color: TEXT_COLOR,
            width: '350px',
          }}
        >
          {eventData.description}
        </p>

        {/* Artyści */}
        <div className="flex flex-col" style={{ gap: '16px' }}>
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
            {t('common.labels.artists')}
          </p>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: 1.48,
              color: TEXT_COLOR,
            }}
          >
            {eventData.artists}
          </p>
        </div>

        {/* Program */}
        <div className="flex flex-col" style={{ gap: '16px' }}>
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
            {t('common.labels.program')}
          </p>
          <ul
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '14px',
              lineHeight: 1.48,
              color: TEXT_COLOR,
              listStyleType: 'disc',
              paddingLeft: '20px',
            }}
          >
            {eventData.program.map((item, idx) => (
              <li key={idx} style={{ marginBottom: idx < eventData.program.length - 1 ? '6px' : '0' }}>
                <span style={{ fontWeight: 700 }}>{item.composer}</span>
                <span style={{ fontWeight: 500 }}>- {item.piece}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Partnerzy */}
        <div className="flex flex-col" style={{ gap: '20px' }}>
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
            {t('common.labels.partners')}
          </p>
          {/* Partner logos - w kolumnie na mobile */}
          <div
            className="flex flex-wrap items-center justify-center"
            style={{ gap: '16px' }}
          >
            {eventData.partners.map((partner, idx) => (
              <img
                key={idx}
                src={partner.logo}
                alt={partner.name}
                style={{
                  height: '32px',
                  objectFit: 'contain',
                }}
              />
            ))}
          </div>
        </div>
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
