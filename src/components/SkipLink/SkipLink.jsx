import { useLanguage } from '../../context/LanguageContext';

/**
 * SkipLink - WCAG 2.4.1 Bypass Blocks
 *
 * Allows keyboard users to skip repetitive navigation and go directly to main content.
 * Visually hidden until focused, then appears at the top of the viewport.
 */
export default function SkipLink() {
  const { language } = useLanguage();

  const linkText = language === 'pl' ? 'Przejdź do treści' : 'Skip to content';

  return (
    <a
      href="#main-content"
      className="skip-link"
      style={{
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        padding: '12px 24px',
        backgroundColor: '#131313',
        color: '#FFFFFF',
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 700,
        fontSize: '16px',
        textDecoration: 'none',
        borderRadius: '4px',
        transition: 'top 0.2s ease',
      }}
    >
      {linkText}
    </a>
  );
}
