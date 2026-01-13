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

  // Calculate total height: header + tabs + composers list + footnote + footer + spacing
  // Figma frame height: 2533px, but actual composers list is 457px taller (2281px vs 1824px)
  // Adjusted total height: 2533 + 457 = 2990px
  const totalHeight = 2990;

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
    'Michael Beil',
    'Cezary Duchnowski',
    'Kuba Krzewiński',
    'Bogusław Schaeffer',
    'Jacek Sotomski',
    'Marek Chołoniewski',
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
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: 1.44,
            color: '#761FE0',
            textDecoration: 'underline',
            textUnderlinePosition: 'from-font',
            margin: 0,
          }}
        >
          {t('repertuar.tabs.full')}
        </p>
        <Link
          to="/repertuar/specjalne"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: 1.44,
            color: '#131313',
            textDecoration: 'none',
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
          top: '2696px',
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
          left: '20px',
          bottom: '50px',
        }}
        textColor="#131313"
      />
    </section>
  );
}
