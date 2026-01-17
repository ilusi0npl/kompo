import { useState, useEffect } from 'react';

export default function ContrastToggle({
  iconColor = '#131313',
  style = {},
  transition = null,
  scale = 1,
  onClick = null,
}) {
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Restore high contrast state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('highContrast');
    if (saved === 'true') {
      setIsHighContrast(true);
      document.body.classList.add('high-contrast');
    }
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const newValue = !isHighContrast;
      setIsHighContrast(newValue);

      if (newValue) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }

      localStorage.setItem('highContrast', newValue);
    }
  };

  // Active state - yellow, inactive - from props (design color)
  const activeColor = '#FFBD19'; // Yellow from Kompopolex design
  const currentColor = isHighContrast ? activeColor : iconColor;

  return (
    <button
      onClick={handleClick}
      className="contrast-toggle-btn"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        width: `${28 * scale}px`,
        height: `${28 * scale}px`,
        ...style,
      }}
      aria-label={isHighContrast ? 'Disable high contrast' : 'Enable high contrast'}
      aria-pressed={isHighContrast}
    >
      <svg
        width={28 * scale}
        height={28 * scale}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          color: currentColor,
          ...(transition ? { transition: `color ${transition}` } : {}),
        }}
      >
        <path
          d="M14 21.0001C8.11767 21.0083 2.33333 17.8664 2.33333 14.0001C2.33333 10.1338 8.148 6.98026 14 7.00009C19.852 7.01993 25.6667 10.1338 25.6667 14.0001C25.6667 17.8664 19.8823 20.9919 14 21.0001ZM14 18.6668C15.2377 18.6668 16.4247 18.1751 17.2998 17.2999C18.175 16.4248 18.6667 15.2378 18.6667 14.0001C18.6667 12.7624 18.175 11.5754 17.2998 10.7003C16.4247 9.82509 15.2377 9.33343 14 9.33343C12.7623 9.33343 11.5753 9.82509 10.7002 10.7003C9.825 11.5754 9.33333 12.7624 9.33333 14.0001C9.33333 15.2378 9.825 16.4248 10.7002 17.2999C11.5753 18.1751 12.7623 18.6668 14 18.6668ZM14 16.3334C13.3812 16.3334 12.7877 16.0876 12.3501 15.65C11.9125 15.2124 11.6667 14.6189 11.6667 14.0001C11.6667 13.3813 11.9125 12.7878 12.3501 12.3502C12.7877 11.9126 13.3812 11.6668 14 11.6668C14.6188 11.6668 15.2123 11.9126 15.6499 12.3502C16.0875 12.7878 16.3333 13.3813 16.3333 14.0001C16.3333 14.6189 16.0875 15.2124 15.6499 15.65C15.2123 16.0876 14.6188 16.3334 14 16.3334Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
