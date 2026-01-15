import { Link } from 'react-router';
import { useState } from 'react';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import MobileFooter from '../../components/Footer/MobileFooter';
import { useTranslation } from '../../hooks/useTranslation';
import {
  composers,
  MOBILE_WIDTH,
  mobileLinePositions,
} from './repertuar-config';

const LINE_COLOR = '#A0E38A';

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
            color: '#131313',
          }}
        >
          {composer.name}{' '}
        </span>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '16px',
            color: '#131313',
          }}
        >
          {composer.year}
        </span>
      </p>
      {composer.works.map((work, idx) => (
        <p
          key={idx}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '16px',
            color: '#131313',
            lineHeight: 1.48,
            marginBottom: idx === composer.works.length - 1 ? 0 : '8px',
          }}
        >
          {work.title}
          {work.isSpecial && (
            <span style={{ color: '#761FE0' }}>*</span>
          )}
        </p>
      ))}
    </div>
  );
};

export default function MobileRepertuar() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calculate total height based on content
  // Footnote at 2239px + footnote height (~48px for 2 lines) + margin (50px) + footer height (~120px) + bottom margin (50px)
  const footnoteTop = 2239;
  const footnoteHeight = 48; // Approximate height for 2-line text
  const marginToFooter = 50;
  const footerHeight = 120; // Approximate footer height
  const bottomMargin = 50;
  const totalHeight = footnoteTop + footnoteHeight + marginToFooter + footerHeight + bottomMargin;

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
      style={{
        width: `${MOBILE_WIDTH}px`,
        height: `${totalHeight}px`,
        backgroundColor: '#FDFDFD',
        position: 'relative',
      }}
    >
      {/* Pionowe linie dekoracyjne - renderowane ręcznie */}
      {mobileLinePositions.map((x) => (
        <div
          key={x}
          className="absolute"
          style={{
            left: `${x}px`,
            top: 0,
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
          color: '#131313',
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
        style={{
          position: 'absolute',
          left: '20px',
          top: '152px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '48px',
          lineHeight: 1.35,
          color: '#131313',
          margin: 0,
        }}
      >
        {t('repertuar.sideTitle')}
      </p>

      {/* MobileMenu overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Navigation Tabs */}
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
          className="nav-link--active"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: 1.44,
            color: '#761FE0',
            margin: 0,
          }}
        >
          {t('repertuar.tabs.full')}
        </span>
        <Link
          to="/specialne"
          className="nav-link"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: 1.44,
            color: '#131313',
            margin: 0,
          }}
        >
          {t('repertuar.tabs.special')}
        </Link>
      </div>

      {/* Composers List - Single column */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '375px',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {sortedComposers.map((composer, idx) => (
          <ComposerEntry key={idx} composer={composer} />
        ))}
      </div>

      {/* Footnote */}
      <p
        className="absolute"
        style={{
          left: '20px',
          top: '2239px',
          width: '350px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: 1.48,
          color: '#761FE0',
          margin: 0,
        }}
      >
        {t('repertuar.footnote')}
      </p>

      {/* Footer */}
      <MobileFooter
        style={{
          position: 'absolute',
          left: 'calc(25% + 18.5px)',
          transform: 'translateX(-50%)',
          top: `${footnoteTop + footnoteHeight + marginToFooter}px`,
        }}
        textColor="#131313"
      />
    </section>
  );
}
