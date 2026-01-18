import { Link } from 'react-router';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import { useFixedMobileHeader } from '../../hooks/useFixedMobileHeader';
import { useSanityRepertuarComposers } from '../../hooks/useSanityRepertuarComposers';
import {
  composers as configComposers,
  MOBILE_WIDTH,
  mobileLinePositions,
} from './repertuar-config';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

const BACKGROUND_COLOR = 'var(--contrast-bg)';
const LINE_COLOR = 'var(--contrast-line)';
const TEXT_COLOR = 'var(--contrast-text)';
const HEADER_HEIGHT = 355;

// Helper component to render a single composer entry
const ComposerEntry = ({ composer }) => {
  return (
    <div style={{ width: '300px' }}>
      <p style={{ marginBottom: 0, lineHeight: 1.48 }}>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '16px',
            color: TEXT_COLOR,
          }}
        >
          {composer.name}{' '}
        </span>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '16px',
            color: TEXT_COLOR,
          }}
        >
          {composer.year}
        </span>
      </p>
      {composer.works.map((work, idx) => (
        <p
          key={work._key || work.title || idx}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '16px',
            color: TEXT_COLOR,
            lineHeight: 1.48,
            marginBottom: idx === composer.works.length - 1 ? 0 : '8px',
          }}
        >
          {work.title}
          {work.isSpecial && (
            <span style={{ color: 'var(--contrast-accent)' }}>*</span>
          )}
        </p>
      ))}
    </div>
  );
};

export default function MobileRepertuar() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scale } = useFixedMobileHeader();

  // Fetch from Sanity if enabled
  const { composers: sanityComposers, loading, error } = useSanityRepertuarComposers();

  // Use Sanity data if enabled, otherwise use config
  const composers = USE_SANITY ? sanityComposers : configComposers;

  // Loading state
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="repertuar-mobile"
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          width: `${MOBILE_WIDTH}px`,
          minHeight: '100vh',
          backgroundColor: BACKGROUND_COLOR,
        }}
      >
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '16px' }}>
          {t('common.loading.repertoire')}
        </p>
      </section>
    );
  }

  // Error state
  if (USE_SANITY && error) {
    console.error('Failed to load repertuar composers from Sanity:', error);
    return (
      <section
        data-section="repertuar-mobile"
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          width: `${MOBILE_WIDTH}px`,
          minHeight: '100vh',
          backgroundColor: BACKGROUND_COLOR,
        }}
      >
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '16px', color: 'var(--contrast-error)' }}>
          Błąd ładowania repertuaru
        </p>
      </section>
    );
  }

  // Mobile-specific ordering (from Figma design 189-1365)
  const mobileOrder = [
    'Carola Bauckholt',
    'Monika Dalach',
    'Katarina Gryvul',
    'La Monte Young',
    'Paweł Malinowski',
    'Rafał Zapała',
    'Agata Zemla',
    'Teoniki Rożynek',
    'Marta Śniady',
    'Piotr Bednarczyk',
    'Nina Fukuoka',
    'Eloain Lovis Hübner',
    'Martin A. Hirsti-Kvam',
    'Celeste Oram',
    'Rafał Ryterski',
    'Monika Szpyrka',
    'Jenniffer Walshe',
    'Jorge Sanchez-Chiong',
    'Aleksandra Gryka',
    'Neo Hülcker',
    'Simon Løffler',
    'Piotr Peszat',
    'Kelley Sheehan',
    'Olgierd Żemojtel',
    'Matthew Shlomowitz',
  ];

  // Sort composers according to mobile order
  const sortedComposers = [...composers].sort((a, b) => {
    const indexA = mobileOrder.indexOf(a.name);
    const indexB = mobileOrder.indexOf(b.name);
    // If not in mobile order, keep original position
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <section
      data-section="repertuar-mobile"
      className="relative overflow-hidden"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: '100vh',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Pionowe linie dekoracyjne */}
      {mobileLinePositions.map((x) => (
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

      {/* Fixed header via portal */}
      {typeof document !== 'undefined' && createPortal(
        <div
          className="fixed top-0 left-0"
          style={{
            width: `${MOBILE_WIDTH}px`,
            height: `${HEADER_HEIGHT}px`,
            backgroundColor: BACKGROUND_COLOR,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            zIndex: 100,
          }}
        >
          {/* Pionowe linie w fixed headerze */}
          {mobileLinePositions.map((x) => (
            <div
              key={`header-line-${x}`}
              className="absolute top-0"
              style={{
                left: `${x}px`,
                width: '1px',
                height: `${HEADER_HEIGHT}px`,
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
                left: '20px',
                top: '40px',
                width: '104px',
                height: '42px',
              }}
            />
          </Link>

          {/* MENU button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="absolute"
            style={{
              left: '312px',
              top: '43px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: 'normal',
              color: TEXT_COLOR,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            MENU
          </button>

          {/* Tytuł "Repertuar" */}
          <p
            className="absolute"
            style={{
              left: '20px',
              top: '152px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '48px',
              lineHeight: 1.35,
              color: TEXT_COLOR,
              margin: 0,
            }}
          >
            {t('repertuar.sideTitle')}
          </p>

          {/* Navigation Tabs - fixed */}
          <div
            className="absolute"
            style={{
              left: '20px',
              top: '237px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: 1.44,
                color: 'var(--contrast-accent)',
                textDecoration: 'underline',
              }}
            >
              {t('repertuar.tabs.full')}
            </span>
            <Link
              to="/specialne"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: 1.44,
                color: TEXT_COLOR,
                textDecoration: 'none',
              }}
            >
              {t('repertuar.tabs.special')}
            </Link>
          </div>

          {/* MobileMenu inside portal */}
          <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>,
        document.body
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: `${HEADER_HEIGHT}px` }} />

      {/* Composers List - Single column */}
      <div
        style={{
          marginLeft: '20px',
          marginTop: '20px',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {sortedComposers.map((composer, idx) => (
          <ComposerEntry key={composer._id || idx} composer={composer} />
        ))}
      </div>

      {/* Footnote */}
      <p
        style={{
          width: '350px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: 1.48,
          color: 'var(--contrast-accent)',
          margin: 0,
          marginLeft: '20px',
          marginTop: '40px',
        }}
      >
        {t('repertuar.footnote')}
      </p>

      {/* Footer */}
      <MobileFooter
        className="mt-12"
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
