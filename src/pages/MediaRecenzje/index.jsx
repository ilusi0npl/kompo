import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import MediaFixedLayer from '../Media/MediaFixedLayer';
import DesktopMediaRecenzje from './DesktopMediaRecenzje';
import MobileMediaRecenzje from './MobileMediaRecenzje';
import { reviewEvents, BACKGROUND_COLOR, LINE_COLOR, TEXT_COLOR } from './recenzje-config';
import { useSanityReviewEvents, normalizeReviewEvents } from '../../hooks/useSanityReviewEvents';
import { useTranslation } from '../../hooks/useTranslation';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';
const DESKTOP_WIDTH = 1440;
const BREAKPOINT = 768;

function Status({ children, color = TEXT_COLOR }) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '16px',
        color,
      }}
    >
      {children}
    </div>
  );
}

export default function MediaRecenzje() {
  const { id } = useParams();
  const { t, language } = useTranslation();
  const { events: sanityEvents, loading, error } = useSanityReviewEvents();
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : DESKTOP_WIDTH
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (USE_SANITY && loading) return <Status>{t('common.loading.reviews')}</Status>;
  if (USE_SANITY && error) return <Status color="#FF0000">{t('media.reviews.error')}</Status>;

  const events = USE_SANITY ? sanityEvents : normalizeReviewEvents(reviewEvents, language);
  const event = id ? events.find(e => e.id === id) : null;

  if (id && !event) {
    return <Navigate to="/media/recenzje" replace />;
  }

  const isMobile = viewportWidth <= BREAKPOINT;
  const scale = viewportWidth / DESKTOP_WIDTH;

  return (
    <>
      {!isMobile && (
        <MediaFixedLayer scale={scale} viewportHeight={window.innerHeight} activeTab="reviews" />
      )}

      <ResponsiveWrapper
        desktopContent={<DesktopMediaRecenzje events={events} event={event} />}
        mobileContent={<MobileMediaRecenzje events={events} event={event} />}
        desktopHeight="auto"
        mobileHeight="auto"
        backgroundColor={BACKGROUND_COLOR}
        lineColor={LINE_COLOR}
        hideLines={!isMobile}
      />
    </>
  );
}
