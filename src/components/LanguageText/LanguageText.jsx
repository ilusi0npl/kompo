import { useLanguage } from '../../context/LanguageContext';
import { useAnnounce } from '../AriaLiveAnnouncer/AriaLiveAnnouncer';

export default function LanguageText({
  textColor = '#131313',
  style = {},
  transition = null,
  scale = 1,
  fontSize = null,
  asMenuItem = false,
}) {
  const { language, toggleLanguage } = useLanguage();
  const announce = useAnnounce();

  // Display the opposite language as the toggle option
  const displayText = language === 'pl' ? 'ENG' : 'PL';

  // Aria label for accessibility - describes action in current language
  const ariaLabel = language === 'pl' ? 'Przełącz na angielski' : 'Switch to Polish';

  // Handle toggle with announcement
  const handleToggle = () => {
    toggleLanguage();
    // Announce in the NEW language (after toggle)
    const newLanguage = language === 'pl' ? 'en' : 'pl';
    announce(newLanguage === 'pl' ? 'Język zmieniony na polski' : 'Language changed to English');
  };

  // Render as menu item (button styled to look like menu text)
  if (asMenuItem) {
    return (
      <button
        onClick={handleToggle}
        className="language-toggle"
        aria-label={ariaLabel}
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: fontSize || `${20 * scale}px`,
          lineHeight: 1.48,
          color: textColor,
          cursor: 'pointer',
          margin: 0,
          padding: 0,
          background: 'none',
          border: 'none',
          textAlign: 'left', // Align text left to match nav links
          ...(transition ? { transition: `color ${transition}` } : {}),
          ...style,
        }}
      >
        {displayText}
      </button>
    );
  }

  // Original button version
  return (
    <button
      onClick={handleToggle}
      className="language-toggle"
      aria-label={ariaLabel}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: fontSize || `${20 * scale}px`,
          lineHeight: 1.48,
          color: textColor,
          textTransform: 'uppercase',
          ...(transition ? { transition: `color ${transition}` } : {}),
          ...style,
        }}
      >
        {displayText}
      </span>
    </button>
  );
}
