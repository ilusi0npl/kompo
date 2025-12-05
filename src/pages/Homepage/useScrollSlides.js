// Hook do obsługi wheel-based slide transitions
import { useState, useEffect, useCallback, useRef } from 'react';

export function useScrollSlides(totalSlides = 4) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isAnimating = useRef(false);
  const accumulatedDelta = useRef(0);
  const lastWheelTime = useRef(0);

  const DELTA_THRESHOLD = 80;
  const TRANSITION_DURATION = 1000;

  const goToSlide = useCallback((toSlide) => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    setIsTransitioning(true);
    setCurrentSlide(toSlide);

    setTimeout(() => {
      setIsTransitioning(false);
      isAnimating.current = false;
      accumulatedDelta.current = 0;
    }, TRANSITION_DURATION);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();

    if (isAnimating.current) {
      return;
    }

    const now = performance.now();
    if (now - lastWheelTime.current > 150) {
      accumulatedDelta.current = 0;
    }
    lastWheelTime.current = now;

    accumulatedDelta.current += e.deltaY;

    if (accumulatedDelta.current > DELTA_THRESHOLD && currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    } else if (accumulatedDelta.current < -DELTA_THRESHOLD && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, totalSlides, goToSlide]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return {
    currentSlide,
    isTransitioning,
  };
}

export default useScrollSlides;
