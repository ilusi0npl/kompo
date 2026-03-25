import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const EMAIL = 'kompopolex@gmail.com';

/**
 * Mobile Footer component with vertical layout
 * All elements stacked one below another
 */
export default function MobileFooter({
  style = {},
  className = '',
  textColor = '#131313',
}) {
  const { language } = useLanguage();
  const [activeLink, setActiveLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const baseStyles = {
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: 1.48,
    color: textColor,
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '20px',
    ...style,
  };

  const linkStyle = (id) => ({
    textDecoration: 'underline',
    opacity: activeLink === id ? 0.7 : 1,
    transition: 'opacity 0.2s',
    cursor: 'pointer',
  });

  const touchHandlers = (id) => ({
    onTouchStart: () => setActiveLink(id),
    onTouchEnd: () => setActiveLink(null),
  });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
    <footer className={className} style={baseStyles}>
      <span
        role="button"
        tabIndex={0}
        onClick={copyEmail}
        onKeyDown={(e) => e.key === 'Enter' && copyEmail()}
        style={linkStyle('email')}
        {...touchHandlers('email')}
      >
        {copied ? (language === 'pl' ? 'SKOPIOWANO!' : 'COPIED!') : 'KOMPOPOLEX@GMAIL.COM'}
      </span>
      <a
        href="https://www.facebook.com/ensemblekompopolex/?locale=pl_PL"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle('facebook')}
        {...touchHandlers('facebook')}
      >
        FACEBOOK
      </a>
      <a
        href="https://www.instagram.com/kompopolex/"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle('instagram')}
        {...touchHandlers('instagram')}
      >
        INSTAGRAM
      </a>
    </footer>
  );
}
