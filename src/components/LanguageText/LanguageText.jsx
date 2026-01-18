import { useLanguage } from '../../context/LanguageContext';

export default function LanguageText({
  textColor = 'var(--contrast-text)',
  style = {},
  transition = null,
  scale = 1,
  fontSize = null,
  asMenuItem = false,
}) {
  const { language, toggleLanguage } = useLanguage();

  // Display the opposite language as the toggle option
  const displayText = language === 'pl' ? 'ENG' : 'PL';

  // Render as menu item (simple styled element)
  if (asMenuItem) {
    return (
      <p
        onClick={toggleLanguage}
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: fontSize || `${20 * scale}px`,
          lineHeight: 1.48,
          color: textColor,
          cursor: 'pointer',
          margin: 0,
          padding: 0,
          ...(transition ? { transition: `color ${transition}` } : {}),
          ...style,
        }}
      >
        {displayText}
      </p>
    );
  }

  // Original button version
  return (
    <button
      onClick={toggleLanguage}
      className="language-toggle"
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
