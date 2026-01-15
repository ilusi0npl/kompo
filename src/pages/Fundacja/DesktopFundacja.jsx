import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import {
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
  BACKGROUND_COLOR,
  TEXT_COLOR,
  LINK_COLOR,
  fundacjaData,
  projectsData,
  accessibilityDeclaration,
} from './fundacja-config';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#01936F';

export default function DesktopFundacja() {
  const { t, language } = useTranslation();
  const [isDeclarationExpanded, setIsDeclarationExpanded] = useState(false);
  const [sectionMinHeight, setSectionMinHeight] = useState(DESKTOP_HEIGHT);
  const contentRef = useRef(null);

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

  return (
    <section
      data-section="fundacja"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        minHeight: `${sectionMinHeight}px`,
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Pionowe linie dekoracyjne */}
      {LINE_POSITIONS.map((x) => (
        <div
          key={x}
          className="absolute top-0"
          style={{
            left: `${x}px`,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Logo */}
      <Link to="/">
        <img
          src="/assets/logo.svg"
          alt="Kompopolex"
          className="absolute"
          style={{
            left: '185px',
            top: '60px',
            width: '149px',
            height: '60px',
          }}
        />
      </Link>

      {/* Fundacja - pionowy tekst po lewej (rotacja 90 stopni) */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '94px',
          top: '180px',
          width: '45px',
          height: '307px',
        }}
      >
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '64px',
            lineHeight: 1.1,
            color: TEXT_COLOR,
            transform: 'rotate(90deg)',
            whiteSpace: 'nowrap',
          }}
        >
          {t('fundacja.sideTitle')}
        </p>
      </div>

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
            color: TEXT_COLOR,
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
            color: TEXT_COLOR,
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
            marginBottom: '64px',
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
              color: isDeclarationExpanded ? LINK_COLOR : TEXT_COLOR,
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
              color: TEXT_COLOR,
            }}
          >
            {accessibilityDeclaration[language].map((paragraph, index) => (
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

      {/* Prawa nawigacja */}
      <div
        className="absolute"
        style={{
          left: '1265px',
          top: '60px',
          width: '100px',
        }}
      >
        {/* Language Toggle */}
        <LanguageToggle textColor={TEXT_COLOR} />

        {/* Menu items */}
        <nav
          className="absolute flex flex-col"
          style={{
            top: '308px',
            left: '0',
            gap: '22px',
          }}
        >
          {[
            { key: 'bio', href: '/bio', active: false },
            { key: 'media', href: '/media', active: false },
            { key: 'kalendarz', href: '/kalendarz', active: false },
            { key: 'repertuar', href: '/repertuar', active: false },
            { key: 'fundacja', href: '/fundacja', active: true },
            { key: 'kontakt', href: '/kontakt', active: false },
          ].map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className={`nav-link ${item.active ? 'nav-link--active' : ''}`}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: 1.48,
                color: TEXT_COLOR,
              }}
            >
              {t(`common.nav.${item.key}`)}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
