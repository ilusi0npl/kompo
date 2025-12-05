/**
 * Footer component with email and social media links
 * Used across multiple pages: Bio, Kalendarz, Archiwalne, Wydarzenie
 */
export default function Footer({
  style = {},
  className = '',
  textColor = '#131313',
}) {
  const baseStyles = {
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: 1.48,
    color: textColor,
    textTransform: 'uppercase',
    ...style,
  };

  return (
    <div
      className={`flex items-center justify-between ${className}`}
      style={baseStyles}
    >
      <p>KOMPOPOLEX@GMAIL.COM</p>
      <a
        href="https://www.facebook.com/ensemblekompopolex/?locale=pl_PL"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'underline' }}
      >
        FACEBOOK
      </a>
      <a
        href="https://www.instagram.com/kompopolex/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'underline' }}
      >
        INSTAGRAM
      </a>
    </div>
  );
}
