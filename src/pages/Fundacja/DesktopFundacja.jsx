import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  DESKTOP_WIDTH,
  TEXT_COLOR,
  LINK_COLOR,
  fundacjaData,
  accessibilityDeclaration,
} from './fundacja-config';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '../../components/PortableTextComponents';
import { useSanityFundacjaPage } from '../../hooks/useSanityFundacjaPage';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#01936F';

export default function DesktopFundacja() {
  const { t, language } = useTranslation();
  const [isDeclarationExpanded, setIsDeclarationExpanded] = useState(false);
  const [sectionMinHeight, setSectionMinHeight] = useState(1300);
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

  const [footerTop, setFooterTop] = useState(null);

  // Measure content and position footer dynamically below both text and photo
  useLayoutEffect(() => {
    if (contentRef.current) {
      const contentBottom = 180 + contentRef.current.offsetHeight;
      const imageEl = contentRef.current.closest('section')?.querySelector('.absolute.overflow-hidden');
      const imageBottom = imageEl
        ? parseFloat(imageEl.style.top) + parseFloat(imageEl.style.height)
        : contentBottom;
      const footerMargin = 80;
      const footerHeight = 70;

      const calculatedFooterTop = Math.max(contentBottom, imageBottom) + footerMargin;
      setFooterTop(calculatedFooterTop);

      setSectionMinHeight(calculatedFooterTop + footerHeight + 40);
    }
  }, [isDeclarationExpanded, language, sanityData]);

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="fundacja"
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          minHeight: `${1300}px`,
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
          {t('common.loading.foundation')}
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
          minHeight: `${1300}px`,
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
        <div
          data-testid="fundacja-description"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: 1.48,
            color: textColor,
            marginBottom: '42px',
          }}
        >
          {USE_SANITY && sanityData?.descriptionPl ? (
            <PortableText components={portableTextComponents} value={language === 'pl' ? sanityData.descriptionPl : sanityData.descriptionEn} />
          ) : (
            <p>{t('fundacja.description')}</p>
          )}
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
            {(() => {
              const text = USE_SANITY && sanityData
                ? (language === 'pl'
                    ? sanityData.accessibilityDeclarationPl
                    : sanityData.accessibilityDeclarationEn) || []
                : accessibilityText[language];
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
        )}

      </div>

      {/* Stopka — dynamically positioned below content */}
      <Footer
        className="absolute"
        style={{
          left: '185px',
          top: footerTop ? `${footerTop}px` : 'auto',
          width: '520px',
        }}
      />
    </section>
  );
}
