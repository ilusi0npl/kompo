// Hook do obsługi slide transitions ze scrollowalnym contentem
// Przejście do następnego slajdu gdy user jest na dole i swipe'uje dalej
// Przejście do poprzedniego slajdu gdy user jest na górze i swipe'uje w górę
import { useState, useEffect, useCallback, useRef } from 'react';

export function useScrollableSlides(totalSlides = 4, containerRef) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isAnimating = useRef(false);

  // Touch tracking refs
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  // Wheel tracking
  const accumulatedDelta = useRef(0);
  const lastWheelTime = useRef(0);

  const TOUCH_THRESHOLD = 50;
  const WHEEL_THRESHOLD = 100;
  const TRANSITION_DURATION = 600;

  const goToSlide = useCallback((toSlide) => {
    if (isAnimating.current) return;
    if (toSlide < 0 || toSlide >= totalSlides) return;

    isAnimating.current = true;
    setIsTransitioning(true);
    setCurrentSlide(toSlide);

    // Scroll to top when changing slides
    if (containerRef?.current) {
      containerRef.current.scrollTop = 0;
    }
    // Also scroll window to top
    window.scrollTo(0, 0);

    setTimeout(() => {
      setIsTransitioning(false);
      isAnimating.current = false;
      accumulatedDelta.current = 0;
    }, TRANSITION_DURATION);
  }, [totalSlides, containerRef]);

  // Check if at scroll boundaries
  const getScrollPosition = useCallback(() => {
    // Check both container and window scroll
    const container = containerRef?.current;

    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      return {
        isAtTop: scrollTop <= 5,
        isAtBottom: scrollTop + clientHeight >= scrollHeight - 5,
      };
    }

    // Fallback to window scroll
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    return {
      isAtTop: scrollTop <= 5,
      isAtBottom: scrollTop + clientHeight >= scrollHeight - 5,
    };
  }, [containerRef]);

  // Wheel handler
  useEffect(() => {
    const handleWheel = (e) => {
      if (isAnimating.current) return;

      const { isAtTop, isAtBottom } = getScrollPosition();
      const now = performance.now();

      // Reset accumulator after timeout
      if (now - lastWheelTime.current > 200) {
        accumulatedDelta.current = 0;
      }
      lastWheelTime.current = now;

      // At bottom, scrolling down → next slide
      if (isAtBottom && e.deltaY > 0 && currentSlide < totalSlides - 1) {
        e.preventDefault();
        accumulatedDelta.current += e.deltaY;
        if (accumulatedDelta.current > WHEEL_THRESHOLD) {
          goToSlide(currentSlide + 1);
        }
      }
      // At top, scrolling up → previous slide
      else if (isAtTop && e.deltaY < 0 && currentSlide > 0) {
        e.preventDefault();
        accumulatedDelta.current += Math.abs(e.deltaY);
        if (accumulatedDelta.current > WHEEL_THRESHOLD) {
          goToSlide(currentSlide - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSlide, totalSlides, goToSlide, getScrollPosition]);

  // Touch handlers
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (isAnimating.current) return;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchEnd = (e) => {
      if (isAnimating.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;
      const deltaTime = Date.now() - touchStartTime.current;

      // Must be a quick swipe
      if (deltaTime > 400) return;
      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

      const { isAtTop, isAtBottom } = getScrollPosition();

      // Swipe up at bottom → next slide
      if (isAtBottom && deltaY > TOUCH_THRESHOLD && currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      }
      // Swipe down at top → previous slide
      else if (isAtTop && deltaY < -TOUCH_THRESHOLD && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSlide, totalSlides, goToSlide, getScrollPosition]);

  return {
    currentSlide,
    isTransitioning,
    goToSlide,
  };
}

export default useScrollableSlides;
