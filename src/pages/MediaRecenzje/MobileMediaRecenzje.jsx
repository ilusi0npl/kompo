import { Link } from 'react-router';
import MobileHeader, { MobileHeaderSpacer } from '../../components/MobileHeader/MobileHeader';
import MobileFooter from '../../components/Footer/MobileFooter';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useTranslation } from '../../hooks/useTranslation';
import {
  reviewCountLabel,
  BACKGROUND_COLOR,
  LINE_COLOR,
  TEXT_COLOR,
  ACTIVE_TAB_COLOR,
} from './recenzje-config';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const MONO = "'IBM Plex Mono', monospace";

const label14 = { fontFamily: MONO, fontWeight: 500, fontSize: '14px', lineHeight: 1.48, color: TEXT_COLOR };
const caps14 = { fontFamily: MONO, fontWeight: 600, fontSize: '14px', lineHeight: 1.48, color: TEXT_COLOR, textTransform: 'uppercase' };

function EventTiles({ events, t }) {
  return (
    <div className="flex flex-col" style={{ gap: '40px' }}>
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/media/recenzje/${event.id}`}
          className="flex flex-col"
          style={{ gap: '12px', textDecoration: 'none' }}
        >
          <SmoothImage
            src={event.image}
            alt={event.title}
            containerStyle={{ width: '350px', height: '250px' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }}
            placeholderColor="#e5e5e5"
          />
          <p
            style={{
              fontFamily: MONO,
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: 1.44,
              color: TEXT_COLOR,
              textDecoration: 'underline',
              textTransform: 'uppercase',
            }}
          >
            {event.title}
          </p>
          {event.festival && <p style={label14}>{event.festival}</p>}
          <p style={label14}>
            {[event.date, event.place, reviewCountLabel(event.reviews.length, t('media.reviews.count'))]
              .filter(Boolean)
              .join(' | ')}
          </p>
        </Link>
      ))}
    </div>
  );
}

function Review({ review, t }) {
  return (
    <article
      className="flex flex-col"
      style={{ borderTop: `1px solid ${TEXT_COLOR}`, padding: '24px 0 40px', gap: '20px' }}
    >
      <div className="flex flex-wrap" style={{ ...caps14, gap: '4px 16px' }}>
        <span style={{ fontWeight: 700 }}>{review.outlet}</span>
        {review.author && <span>{review.author}</span>}
        {review.date && <span>{review.date}</span>}
      </div>

      <div className="flex flex-col" style={{ gap: '16px' }}>
        {review.paragraphs.map((paragraph, i) => (
          <p key={i} style={{ fontFamily: MONO, fontWeight: 500, fontSize: '14px', lineHeight: 1.48, color: TEXT_COLOR }}>
            {paragraph}
          </p>
        ))}
      </div>

      {review.photo && (
        <figure className="flex flex-col" style={{ gap: '8px' }}>
          <img src={review.photo} alt={review.photoCaption || review.outlet} style={{ width: '100%', display: 'block' }} loading="lazy" />
          {review.photoCaption && (
            <figcaption style={{ fontFamily: MONO, fontSize: '12px', color: TEXT_COLOR }}>{review.photoCaption}</figcaption>
          )}
        </figure>
      )}

      <div className="flex flex-col" style={{ gap: '4px' }}>
        <span style={{ ...label14, fontSize: '12px' }}>
          {t('media.reviews.source')}: {review.outlet}{review.author ? `, ${review.author}` : ''}
        </span>
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...caps14, textDecoration: 'underline', overflowWrap: 'anywhere' }}
        >
          {review.sourceTitle} ↗
        </a>
      </div>
    </article>
  );
}

function EventReviews({ event, t }) {
  return (
    <div className="flex flex-col">
      <Link to="/media/recenzje" style={{ ...caps14, color: ACTIVE_TAB_COLOR, textDecoration: 'none', alignSelf: 'flex-start' }}>
        ← <span style={{ textDecoration: 'underline' }}>{t('media.reviews.back')}</span>
      </Link>
      <div className="flex flex-col" style={{ gap: '6px', margin: '24px 0 32px' }}>
        {event.festival && <p style={label14}>{event.festival}</p>}
        <h1
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: '28px',
            lineHeight: 1.2,
            color: TEXT_COLOR,
            textTransform: 'uppercase',
            overflowWrap: 'anywhere',
          }}
        >
          {event.title}
        </h1>
        <p style={label14}>{[event.date, event.place].filter(Boolean).join(' | ')}</p>
      </div>
      {event.reviews.map((review) => (
        <Review key={review.key} review={review} t={t} />
      ))}
    </div>
  );
}

export default function MobileMediaRecenzje({ events, event }) {
  const { t } = useTranslation();

  return (
    <section
      data-section="media-recenzje-mobile"
      className="relative overflow-hidden"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: '100vh',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Pionowe linie */}
      {mobileLinePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0 decorative-line"
          style={{ left: `${left}px`, width: '1px', height: '100%', backgroundColor: LINE_COLOR }}
        />
      ))}

      <MobileHeader
        title={t('media.sideTitle')}
        textColor={TEXT_COLOR}
        backgroundColor={BACKGROUND_COLOR}
        lineColor={LINE_COLOR}
        isFixed={true}
        headerHeight={326}
        activeColor={ACTIVE_TAB_COLOR}
        navLinksTop={257}
        navLinksGap={40}
        navLinksFontSize={20}
        navLinks={[
          { label: t('common.tabs.photos'), to: '/media', isActive: false },
          { label: t('common.tabs.video'), to: '/media/wideo', isActive: false },
          { label: t('common.tabs.reviews'), to: '/media/recenzje', isActive: true },
        ]}
      />
      <MobileHeaderSpacer height={326} />

      <div className="relative" style={{ padding: '0 20px', width: `${MOBILE_WIDTH}px` }}>
        {event ? <EventReviews event={event} t={t} /> : <EventTiles events={events} t={t} />}
      </div>

      <MobileFooter
        className="mt-16"
        style={{ marginLeft: '20px', marginRight: '20px', marginBottom: '40px', width: '350px' }}
        textColor={TEXT_COLOR}
      />
    </section>
  );
}
