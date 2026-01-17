import { useLanguage } from '../../context/LanguageContext';

export default function LanguageText({
  textColor = '#131313',
  style = {},
  transition = null,
  scale = 1,
}) {
  const { language, toggleLanguage } = useLanguage();

  // Display the opposite language as the toggle option
  const displayText = language === 'pl' ? 'ENG' : 'PL';

  return (
    <button
      onClick={toggleLanguage}
      className="language-toggle"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: `${20 * scale}px`,
          lineHeight: 1.44,
          color: textColor,
          textTransform: 'uppercase',
          ...(transition ? { transition: `color ${transition}` } : {}),
        }}
      >
        {displayText}
      </span>
    </button>
  );
}
