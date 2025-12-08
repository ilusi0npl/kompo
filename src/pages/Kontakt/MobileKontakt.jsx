import MobileHeader from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { fundacjaData } from './kontakt-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#FF734C';
const LINE_COLOR = '#FFBD19';
const TEXT_COLOR = '#131313';

export default function MobileKontakt() {
  const { t } = useTranslation();

  return (
    <section
      data-section="kontakt-mobile"
      className="relative overflow-hidden"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: '100vh',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Pionowe linie w tle */}
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
        title={t('kontakt.sideTitle')}
        textColor={TEXT_COLOR}
      />

      {/* Zdjęcie zespołu z smooth loading - 300x460px centered */}
      <SmoothImage
        src="/assets/kontakt/team-photo.jpg"
        alt="Zespół Kompopolex"
        className="mx-auto"
        containerStyle={{
          width: '300px',
          height: '460px',
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 50%',
        }}
        placeholderColor="#e5e5e5"
      />

      {/* Dane fundacji */}
      <div
        className="flex flex-col"
        style={{
          marginTop: '40px',
          marginLeft: '20px',
          width: '350px',
          gap: '16px',
        }}
      >
        {/* Tytuł */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: 1.4,
            color: TEXT_COLOR,
            textDecoration: 'underline',
            textTransform: 'uppercase',
          }}
        >
          {t('kontakt.title')}
        </p>

        {/* Dane */}
        <div
          className="flex flex-col"
          style={{
            gap: '16px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: 1.48,
            color: TEXT_COLOR,
          }}
        >
          <p>{t('kontakt.krs')} {fundacjaData.krs}</p>
          <p>{t('kontakt.regon')} {fundacjaData.regon}</p>
          <p>{t('kontakt.nip')} {fundacjaData.nip}</p>
          <div>
            <p>{t('kontakt.bankAccount')}</p>
            <p>{fundacjaData.bankAccount}</p>
          </div>
        </div>

        {/* Email */}
        <a
          href={`mailto:${fundacjaData.email}`}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: 1.48,
            color: TEXT_COLOR,
            textDecoration: 'underline',
            textTransform: 'uppercase',
          }}
        >
          {fundacjaData.email}
        </a>
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
