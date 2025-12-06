import { useState, useRef, useEffect } from 'react';

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
        rootMargin: '100px', // Zacznij ładować 100px przed widokiem
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
