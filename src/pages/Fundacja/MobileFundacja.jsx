import { useState } from 'react';
import MobileHeader, { MobileHeaderSpacer } from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  BACKGROUND_COLOR,
  TEXT_COLOR,
  LINK_COLOR,
  fundacjaData,
  projectsData,
  accessibilityDeclaration,
} from './fundacja-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const LINE_COLOR = '#01936F';
const HEADER_HEIGHT = 257;

export default function MobileFundacja() {
  const { t, language } = useTranslation();
  const [isDeclarationExpanded, setIsDeclarationExpanded] = useState(false);

  const toggleDeclaration = () => {
    setIsDeclarationExpanded(!isDeclarationExpanded);
  };

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
          className="absolute top-0"
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

          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: 1.48,
              color: TEXT_COLOR,
            }}
          >
            {t('fundacja.description')}
          </p>
        </div>

        {/* Projekty */}
        <div
          className="flex flex-col"
          style={{
            gap: '20px',
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: 1.48,
              color: TEXT_COLOR,
            }}
          >
            {t('fundacja.projectsTitle')}
          </p>

          <div
            className="flex flex-col"
            style={{
              gap: '32px',
            }}
          >
            {projectsData.map((project, index) => (
              <div key={index} className="flex flex-col" style={{ gap: '12px' }}>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: 1.48,
                    color: TEXT_COLOR,
                    paddingLeft: '24px',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                    }}
                  >
                    •
                  </span>
                  {t(`fundacja.projects.${index}.text`)}
                </p>
                {project.linkText && (
                  <a
                    href={project.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center external-link-btn"
                    style={{
                      gap: '6px',
                      justifyContent: 'flex-end',
                      width: project.linkText.includes('CROSSFADE') ? '347px' : '174px',
                    }}
                  >
                    <span
                      className="external-link-btn__text"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: 1.48,
                        color: LINK_COLOR,
                        textTransform: 'uppercase',
                      }}
                    >
                      {project.linkText}
                    </span>
                    <img
                      src="/assets/fundacja/arrow-up-right.svg"
                      alt="External link"
                      className="external-link-btn__arrow"
                      style={{
                        width: '24px',
                        height: '24px',
                      }}
                    />
                  </a>
                )}
              </div>
            ))}
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
            <p>KRS: {fundacjaData.krs}</p>
            <p>REGON: {fundacjaData.regon}</p>
            <p>NIP: {fundacjaData.nip}</p>
            <p>NR KONTA: {fundacjaData.bankAccount}</p>
            <p>{fundacjaData.email}</p>
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
              {accessibilityDeclaration[language].map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stopka */}
      <MobileFooter
        className="mt-16"
        style={{
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
