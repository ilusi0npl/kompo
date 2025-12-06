// Hook do obsługi wheel i touch-based slide transitions
import { useState, useEffect, useCallback, useRef } from 'react';

// Read slide from URL query param (?slide=0, ?slide=1, etc.)
function getInitialSlide() {
  if (typeof window === 'undefined') return 0;
  const params = new URLSearchParams(window.location.search);
  const slideParam = params.get('slide');
  if (slideParam !== null) {
    const parsed = parseInt(slideParam, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      return parsed;
    }
  }
  return 0;
}

export function useScrollSlides(totalSlides = 4) {
  const [currentSlide, setCurrentSlide] = useState(() => {
    const initial = getInitialSlide();
    return Math.min(initial, totalSlides - 1);
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isAnimating = useRef(false);
  const accumulatedDelta = useRef(0);
  const lastWheelTime = useRef(0);

  // Touch tracking refs
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const touchMoveY = useRef(0);
  const isVerticalSwipe = useRef(false);

  const DELTA_THRESHOLD = 80;
  const TOUCH_THRESHOLD = 30; // Minimum swipe distance in pixels
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

  // Wheel handler (desktop/trackpad)
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

  // Touch handlers (mobile)
  const handleTouchStart = useCallback((e) => {
    if (isAnimating.current) return;

    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchMoveY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isVerticalSwipe.current = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (isAnimating.current) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = Math.abs(touchStartY.current - currentY);
    const deltaX = Math.abs(touchStartX.current - currentX);

    // Determine if this is primarily a vertical swipe
    if (!isVerticalSwipe.current && (deltaY > 10 || deltaX > 10)) {
      isVerticalSwipe.current = deltaY > deltaX;
    }

    // Only prevent default scroll if it's a vertical swipe
    if (isVerticalSwipe.current) {
      e.preventDefault();
    }

    touchMoveY.current = currentY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (isAnimating.current) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const deltaTime = Date.now() - touchStartTime.current;

    // Calculate velocity (pixels per millisecond)
    const velocity = Math.abs(deltaY) / deltaTime;

    // Require either:
    // 1. A quick swipe (high velocity) with minimal distance
    // 2. A longer swipe (lower velocity) with more distance
    const isQuickSwipe = velocity > 0.3 && Math.abs(deltaY) > 20;
    const isLongSwipe = Math.abs(deltaY) > TOUCH_THRESHOLD && deltaTime < 500;

    if (!isQuickSwipe && !isLongSwipe) return;
    if (!isVerticalSwipe.current) return;

    if (deltaY > 0 && currentSlide < totalSlides - 1) {
      // Swipe up - go to next slide
      goToSlide(currentSlide + 1);
    } else if (deltaY < 0 && currentSlide > 0) {
      // Swipe down - go to previous slide
      goToSlide(currentSlide - 1);
    }

    isVerticalSwipe.current = false;
  }, [currentSlide, totalSlides, goToSlide]);

  // Wheel event listener
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Touch event listeners - bind to document for better capture
  useEffect(() => {
    const options = { passive: false };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, options);
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    currentSlide,
    isTransitioning,
    goToSlide, // Expose goToSlide for manual navigation (e.g., dot indicators)
  };
}

export default useScrollSlides;
