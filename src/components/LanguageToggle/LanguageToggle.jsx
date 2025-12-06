import { useLanguage } from '../../context/LanguageContext';

export default function LanguageToggle({
  textColor = '#131313',
  style = {},
  transition = null,
}) {
  const { language, toggleLanguage } = useLanguage();

  // Display the opposite language as the toggle option
  const displayText = language === 'pl' ? 'ENG' : 'PL';

  return (
    <button
      onClick={toggleLanguage}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 700,
        fontSize: '20px',
        lineHeight: 1.44,
        color: textColor,
        textTransform: 'uppercase',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        ...(transition ? { transition: `color ${transition}` } : {}),
        ...style,
      }}
    >
      {displayText}
    </button>
  );
}
