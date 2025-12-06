import { useState, useEffect } from 'react';

/**
 * SmoothSlideshow - komponent do płynnego ładowania slideshow
 * Preloaduje wszystkie obrazy i pokazuje placeholder do momentu załadowania pierwszego
 */
export default function SmoothSlideshow({
  slides,
  currentSlide,
  className = '',
  containerStyle = {},
  imageStyle = {},
  placeholderColor = '#e5e5e5',
  transitionDuration = '1s',
  transitionEasing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  getImageSrc = (slide) => slide.image,
  getAlt = (slide, index) => `Slide ${index + 1}`,
}) {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);

  // Preload wszystkich obrazów
  useEffect(() => {
    slides.forEach((slide, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => {
          const newSet = new Set(prev);
          newSet.add(index);
          return newSet;
        });
        if (index === 0) {
          setIsFirstLoaded(true);
        }
      };
      img.src = getImageSrc(slide);
    });
  }, [slides, getImageSrc]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: placeholderColor,
        ...containerStyle,
      }}
    >
      {slides.map((slide, index) => (
        <img
          key={slide.id || index}
          src={getImageSrc(slide)}
          alt={getAlt(slide, index)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            ...imageStyle,
            opacity: isFirstLoaded && index === currentSlide ? 1 : 0,
            transition: `opacity ${transitionDuration} ${transitionEasing}`,
          }}
        />
      ))}
    </div>
  );
}
