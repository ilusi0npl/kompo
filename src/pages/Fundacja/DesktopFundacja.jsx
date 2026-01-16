import { useState, useRef, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
  TEXT_COLOR,
  LINK_COLOR,
  fundacjaData,
  projectsData,
  accessibilityDeclaration,
} from './fundacja-config';
import { useSanityFundacjaPage } from '../../hooks/useSanityFundacjaPage';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

export default function DesktopFundacja() {
  const { t, language } = useTranslation();
  const [isDeclarationExpanded, setIsDeclarationExpanded] = useState(false);
  const [sectionMinHeight, setSectionMinHeight] = useState(DESKTOP_HEIGHT);
  const contentRef = useRef(null);

  // Fetch from Sanity if enabled
  const { data: sanityData, loading, error } = useSanityFundacjaPage();

  // Use Sanity data if enabled, otherwise use config
  const fundacjaInfo = USE_SANITY && sanityData
    ? {
        krs: sanityData.krs,
        regon: sanityData.regon,
        nip: sanityData.nip,
        bankAccount: sanityData.bankAccount,
        email: sanityData.email,
      }
    : fundacjaData;

  const projects = USE_SANITY && sanityData ? sanityData.projects : projectsData;

  const accessibilityText = USE_SANITY && sanityData
    ? {
        pl: sanityData.accessibilityDeclarationPl || [],
        en: sanityData.accessibilityDeclarationEn || [],
      }
    : accessibilityDeclaration;

  // Use hardcoded design colors (not from CMS)
  const textColor = TEXT_COLOR;
  const linkColor = LINK_COLOR;

  const toggleDeclaration = () => {
    setIsDeclarationExpanded(!isDeclarationExpanded);
  };

  // Measure content and calculate section height
  useEffect(() => {
    if (contentRef.current) {
      // Wait for render to complete
      setTimeout(() => {
        const contentHeight = contentRef.current.offsetHeight;
        const contentTop = 180; // top position of content div
        const spaceBelowContent = 100; // space for footer + margins

        // Calculate total section height needed
        const calculatedHeight = contentTop + contentHeight + spaceBelowContent;

        // Use at least DESKTOP_HEIGHT (1379px)
        const finalHeight = Math.max(calculatedHeight, DESKTOP_HEIGHT);

        setSectionMinHeight(finalHeight);
      }, 100);
    }
  }, [isDeclarationExpanded, language]);

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="fundacja"
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          minHeight: `${DESKTOP_HEIGHT}px`,
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
          Ładowanie strony fundacji...
        </div>
      </section>
    );
  }

  // Show error state only when using Sanity
  if (USE_SANITY && error) {
    return (
      <section
        data-section="fundacja"
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          minHeight: `${DESKTOP_HEIGHT}px`,
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
          Błąd ładowania strony fundacji. Spróbuj ponownie później.
        </div>
      </section>
    );
  }

  return (
    <section
      data-section="fundacja"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        minHeight: `${sectionMinHeight}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
      {/* Zdjęcie zespołu z smooth loading - 300x948px */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: '185px',
          top: '180px',
          width: '300px',
          height: '948px',
        }}
      >
        <SmoothImage
          src="/assets/fundacja/team-photo.jpg"
          alt="Zespół Kompopolex"
          containerStyle={{
            width: '677px',
            height: '948px',
          }}
          style={{
            position: 'absolute',
            left: '-211px',
            top: 0,
            width: '677px',
            height: '948px',
            objectFit: 'cover',
          }}
          placeholderColor="#e5e5e5"
        />
      </div>

      {/* Treść główna - prawa strona */}
      <div
        ref={contentRef}
        className="absolute flex flex-col"
        style={{
          left: '625px',
          top: '180px',
          width: '520px',
        }}
      >
        {/* Tytuł */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '40px',
            lineHeight: 1.35,
            color: textColor,
            marginBottom: '32px',
          }}
        >
          {t('fundacja.title')}
        </p>

        {/* Opis */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: 1.48,
            color: textColor,
            marginBottom: '42px',
          }}
        >
          {t('fundacja.description')}
        </p>

        {/* Projekty */}
        <div
          className="flex flex-col"
          style={{
            gap: '20px',
            marginBottom: '64px',
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: 1.48,
              color: textColor,
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
            {projects.map((project, index) => (
              <div key={index} className="flex flex-col" style={{ gap: '12px' }}>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: 1.48,
                    color: textColor,
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
                  {USE_SANITY && sanityData ? project.text : t(`fundacja.projects.${index}.text`)}
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
                        color: linkColor,
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
            marginBottom: '64px',
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: 1.44,
              color: textColor,
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
              color: textColor,
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
          className="flex items-center"
          style={{
            gap: '6px',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: 1.44,
              color: isDeclarationExpanded ? linkColor : textColor,
              textTransform: 'uppercase',
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
            }}
          />
        </button>

        {/* Deklaracja dostępności - expanded content */}
        {isDeclarationExpanded && (
          <div
            className="flex flex-col"
            style={{
              gap: '12px',
              marginTop: '32px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: 1.48,
              color: textColor,
            }}
          >
            {accessibilityText[language].map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>

      {/* Stopka */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          bottom: '40px',
          width: '520px',
        }}
      />
    </section>
  );
}
