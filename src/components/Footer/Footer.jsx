import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const EMAIL = 'kompopolex@gmail.com';

/**
 * Footer component with email and social media links
 * Used across multiple pages: Bio, Kalendarz, Archiwalne, Wydarzenie
 */
export default function Footer({
  style = {},
  className = '',
  textColor = '#131313',
}) {
  const { language } = useLanguage();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const baseStyles = {
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: 1.48,
    color: textColor,
    textTransform: 'uppercase',
    ...style,
  };

  const linkStyle = (id) => ({
    textDecoration: 'underline',
    opacity: hoveredLink === id ? 0.7 : 1,
    transition: 'opacity 0.2s',
    cursor: 'pointer',
  });

  const hoverHandlers = (id) => ({
    onMouseEnter: () => setHoveredLink(id),
    onMouseLeave: () => setHoveredLink(null),
  });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / non-HTTPS
      const textarea = document.createElement('textarea');
      textarea.value = EMAIL;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer
      className={`flex items-center justify-between ${className}`}
      style={baseStyles}
    >
      <span
        role="button"
        tabIndex={0}
        onClick={copyEmail}
        onKeyDown={(e) => e.key === 'Enter' && copyEmail()}
        style={linkStyle('email')}
        {...hoverHandlers('email')}
      >
        {copied ? (language === 'pl' ? 'SKOPIOWANO!' : 'COPIED!') : 'KOMPOPOLEX@GMAIL.COM'}
      </span>
      <a
        href="https://www.facebook.com/ensemblekompopolex/?locale=pl_PL"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle('facebook')}
        {...hoverHandlers('facebook')}
      >
        FACEBOOK
      </a>
      <a
        href="https://www.instagram.com/kompopolex/"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle('instagram')}
        {...hoverHandlers('instagram')}
      >
        INSTAGRAM
      </a>
    </footer>
  );
}
