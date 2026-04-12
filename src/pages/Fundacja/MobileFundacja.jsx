import { useState } from 'react';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '../../components/PortableTextComponents';
import MobileHeader, { MobileHeaderSpacer } from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useSanityFundacjaPage } from '../../hooks/useSanityFundacjaPage';
import {
  BACKGROUND_COLOR,
  TEXT_COLOR,
  LINK_COLOR,
  fundacjaData,
  accessibilityDeclaration,
} from './fundacja-config';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const LINE_COLOR = '#01936F';
const HEADER_HEIGHT = 257;

export default function MobileFundacja() {
  const { t, language } = useTranslation();
  const [isDeclarationExpanded, setIsDeclarationExpanded] = useState(false);
  const { data: sanityData, loading, error } = useSanityFundacjaPage();

  const fundacjaInfo = USE_SANITY && sanityData
    ? {
        krs: sanityData.krs,
        regon: sanityData.regon,
        nip: sanityData.nip,
        bankAccount: sanityData.bankAccount,
        email: sanityData.email,
      }
    : fundacjaData;

  const toggleDeclaration = () => {
    setIsDeclarationExpanded(!isDeclarationExpanded);
  };

  if (USE_SANITY && loading) {
    return (
      <section
        data-section="fundacja-mobile"
        className="relative overflow-hidden"
        style={{
          width: `${MOBILE_WIDTH}px`,
          minHeight: '100vh',
          backgroundColor: BACKGROUND_COLOR,
        }}
      >
        <MobileHeader
          title={t('fundacja.sideTitle')}
          textColor={TEXT_COLOR}
          backgroundColor={BACKGROUND_COLOR}
          lineColor={LINE_COLOR}
          isFixed={true}
        />
        <MobileHeaderSpacer />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '16px',
            color: TEXT_COLOR,
          }}
        >
          {t('common.loading.foundation')}
        </div>
      </section>
    );
  }

  if (USE_SANITY && error) {
    return (
      <section
        data-section="fundacja-mobile"
        className="relative overflow-hidden"
        style={{
          width: `${MOBILE_WIDTH}px`,
          minHeight: '100vh',
          backgroundColor: BACKGROUND_COLOR,
        }}
      >
        <MobileHeader
          title={t('fundacja.sideTitle')}
          textColor={TEXT_COLOR}
          backgroundColor={BACKGROUND_COLOR}
          lineColor={LINE_COLOR}
          isFixed={true}
        />
        <MobileHeaderSpacer />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '16px',
            color: '#FF0000',
          }}
        >
          Błąd ładowania strony fundacji.
        </div>
      </section>
    );
  }

  return (
    <section
      data-section="fundacja-mobile"
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
          className="absolute top-0 decorative-line"
          style={{
            left: `${left}px`,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Header z tytułem - fixed */}
      <MobileHeader
        title={t('fundacja.sideTitle')}
        textColor={TEXT_COLOR}
        backgroundColor={BACKGROUND_COLOR}
        lineColor={LINE_COLOR}
        isFixed={true}
      />
      <MobileHeaderSpacer />

      {/* Zdjęcie zespołu z smooth loading - 341x473px centered */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          paddingLeft: '9px',
        }}
      >
        <SmoothImage
          src="/assets/fundacja/team-photo.jpg"
          alt="Zespół Kompopolex"
          containerStyle={{
            width: '341px',
            height: '473px',
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '50% 50%',
          }}
          placeholderColor="#e5e5e5"
        />
      </div>

      {/* Treść główna */}
      <div
        className="flex flex-col"
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: '40px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '350px',
          gap: '60px',
        }}
      >
        {/* Tytuł + Opis */}
        <div className="flex flex-col" style={{ gap: '24px' }}>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '40px',
              lineHeight: 1.35,
              color: TEXT_COLOR,
            }}
          >
            {t('fundacja.title')}
          </p>

          <div
            data-testid="fundacja-description"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: 1.48,
              color: TEXT_COLOR,
            }}
          >
            {USE_SANITY && sanityData?.descriptionPl ? (
              <PortableText components={portableTextComponents} value={language === 'pl' ? sanityData.descriptionPl : sanityData.descriptionEn} />
            ) : (
              <p>{t('fundacja.description')}</p>
            )}
          </div>
        </div>

        {/* Dane fundacji */}
        <div
          className="flex flex-col"
          style={{
            gap: '24px',
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: 1.44,
              color: TEXT_COLOR,
              textDecoration: 'underline',
              textTransform: 'uppercase',
            }}
          >
            {t('fundacja.dataTitle')}
          </p>

          <div
            className="flex flex-col"
            style={{
              gap: '16px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: 1.48,
              color: TEXT_COLOR,
              textTransform: 'uppercase',
            }}
          >
            <p>KRS: {fundacjaInfo.krs}</p>
            <p>REGON: {fundacjaInfo.regon}</p>
            <p>NIP: {fundacjaInfo.nip}</p>
            <p>NR KONTA: {fundacjaInfo.bankAccount}</p>
            <p>{fundacjaInfo.email}</p>
          </div>
        </div>

        {/* Deklaracja dostępności - toggle button */}
        <button
          onClick={toggleDeclaration}
          className="flex items-start"
          style={{
            gap: '6px',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            alignSelf: 'flex-start',
            textAlign: 'left',
            width: 'auto',
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: 1.44,
              color: isDeclarationExpanded ? LINK_COLOR : TEXT_COLOR,
              textTransform: 'uppercase',
              textAlign: 'left',
              flex: '1 0 0',
              minWidth: 0,
            }}
          >
            {t('fundacja.accessibilityTitle')}
          </span>
          <img
            src={
              isDeclarationExpanded
                ? '/assets/fundacja/close-icon.svg'
                : '/assets/fundacja/plus-icon.svg'
            }
            alt={isDeclarationExpanded ? 'Collapse' : 'Expand'}
            style={{
              width: '30px',
              height: '30px',
              flexShrink: 0,
            }}
          />
        </button>

        {/* Deklaracja dostępności - expanded content */}
        {isDeclarationExpanded && (
          <div
            style={{
              marginTop: '-36px',
            }}
          >
            <div
              className="flex flex-col"
              style={{
                gap: '12px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: 1.48,
                color: TEXT_COLOR,
              }}
            >
              {(() => {
                const text = USE_SANITY && sanityData
                  ? (language === 'pl'
                      ? sanityData.accessibilityDeclarationPl
                      : sanityData.accessibilityDeclarationEn) || []
                  : accessibilityDeclaration[language];
                // Sanity stores as plain string array; render as paragraphs
                if (Array.isArray(text) && text.length > 0 && typeof text[0] === 'string') {
                  return text.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ));
                }
                // Portable Text blocks
                if (Array.isArray(text) && text.length > 0 && typeof text[0] === 'object') {
                  return <PortableText components={portableTextComponents} value={text} />;
                }
                return null;
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Stopka */}
      <MobileFooter
        className="mt-16"
        style={{
          position: 'relative',
          zIndex: 1,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '40px',
          width: '350px',
        }}
        textColor={TEXT_COLOR}
      />
    </section>
  );
}
