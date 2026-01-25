import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * SmoothImage - komponent do płynnego ładowania dużych obrazów
 * Używa lazy loading + fade-in transition po załadowaniu
 */
export default function SmoothImage({
  src,
  alt,
  className = '',
  style = {},
  containerStyle = {},
  placeholderColor = '#e5e5e5',
  transitionDuration = '0.5s',
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // Manual check if element is in viewport (fallback for IntersectionObserver issues)
  const checkInView = useCallback(() => {
    if (isInView || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if element is within 2000px of viewport (matching rootMargin)
    // Account for scaled layouts by using a larger margin
    const margin = 3000;
    if (rect.top < windowHeight + margin && rect.bottom > -margin) {
      setIsInView(true);
    }
  }, [isInView]);

  // Intersection Observer dla lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '2000px', // Zacznij ładować 2000px przed widokiem (dla pełnych stron)
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Also do a manual check after a short delay (handles scaled layouts and initial render timing)
    const timeoutId = setTimeout(checkInView, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [checkInView]);

  // Fallback: check on scroll if observer didn't trigger
  useEffect(() => {
    if (isInView) return;

    const handleScroll = () => {
      checkInView();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    checkInView();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isInView, checkInView]);

  // Reset stanu przy zmianie src
  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: placeholderColor,
        ...containerStyle,
      }}
    >
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          style={{
            ...style,
            opacity: isLoaded ? 1 : 0,
            transition: `opacity ${transitionDuration} ease-in-out`,
          }}
          {...props}
        />
      )}
    </div>
  );
}
