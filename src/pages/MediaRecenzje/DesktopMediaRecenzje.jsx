import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useTranslation } from '../../hooks/useTranslation';
import { reviewCountLabel, TEXT_COLOR, ACTIVE_TAB_COLOR } from './recenzje-config';

const DESKTOP_WIDTH = 1440;
const CONTENT_LEFT = 185;
const CONTENT_TOP = 276;
const TEXT_WIDTH = 780;
const MONO = "'IBM Plex Mono', monospace";

const label16 = { fontFamily: MONO, fontWeight: 500, fontSize: '16px', lineHeight: 1.48, color: TEXT_COLOR };
const caps16 = { fontFamily: MONO, fontWeight: 600, fontSize: '16px', lineHeight: 1.48, color: TEXT_COLOR, textTransform: 'uppercase' };

function EventTiles({ events, t }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 300px)', columnGap: '30px', rowGap: '40px' }}>
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/media/recenzje/${event.id}`}
          className="flex flex-col"
          style={{ gap: '16px', textDecoration: 'none' }}
        >
          <SmoothImage
            src={event.image}
            alt={event.title}
            containerStyle={{ width: '300px', height: '214px' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }}
            placeholderColor="#e5e5e5"
          />
          <div className="flex flex-col" style={{ gap: '8px' }}>
            <p
              style={{
                fontFamily: MONO,
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: 1.45,
                color: TEXT_COLOR,
                textDecoration: 'underline',
                textTransform: 'uppercase',
              }}
            >
              {event.title}
            </p>
            {event.festival && <p style={label16}>{event.festival}</p>}
            <p style={label16}>
              {[event.date, event.place, reviewCountLabel(event.reviews.length, t('media.reviews.count'))]
                .filter(Boolean)
                .join(' | ')}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function Review({ review, t }) {
  return (
    <article
      className="flex flex-col"
      style={{ borderTop: `1px solid ${TEXT_COLOR}`, padding: '32px 0 48px', gap: '24px', width: `${TEXT_WIDTH}px` }}
    >
      <div className="flex flex-wrap" style={{ ...caps16, gap: '6px 24px' }}>
        <span style={{ fontWeight: 700 }}>{review.outlet}</span>
        {review.author && <span>{review.author}</span>}
        {review.date && <span>{review.date}</span>}
      </div>

      <div className="flex flex-col" style={{ gap: '20px' }}>
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
            <figcaption style={{ fontFamily: MONO, fontSize: '14px', color: TEXT_COLOR }}>{review.photoCaption}</figcaption>
          )}
        </figure>
      )}

      <div className="flex flex-col" style={{ gap: '4px' }}>
        <span style={{ ...label16, fontSize: '14px' }}>
          {t('media.reviews.source')}: {review.outlet}{review.author ? `, ${review.author}` : ''}
        </span>
        <a href={review.url} target="_blank" rel="noopener noreferrer" style={{ ...caps16, textDecoration: 'underline' }}>
          {review.sourceTitle} ↗
        </a>
      </div>
    </article>
  );
}

function EventReviews({ event, t }) {
  return (
    <div className="flex flex-col">
      <Link to="/media/recenzje" style={{ ...caps16, color: ACTIVE_TAB_COLOR, textDecoration: 'none', alignSelf: 'flex-start' }}>
        ← <span style={{ textDecoration: 'underline' }}>{t('media.reviews.back')}</span>
      </Link>
      <div className="flex flex-col" style={{ gap: '8px', margin: '32px 0 48px' }}>
        {event.festival && <p style={label16}>{event.festival}</p>}
        <h1
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: '40px',
            lineHeight: 1.2,
            color: TEXT_COLOR,
            textTransform: 'uppercase',
            width: '850px',
          }}
        >
          {event.title}
        </h1>
        <p style={label16}>{[event.date, event.place].filter(Boolean).join(' | ')}</p>
      </div>
      {event.reviews.map((review) => (
        <Review key={review.key} review={review} t={t} />
      ))}
    </div>
  );
}

export default function DesktopMediaRecenzje({ events, event }) {
  const { t } = useTranslation();

  return (
    <section
      data-section="media-recenzje"
      className="relative flex flex-col"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        paddingLeft: `${CONTENT_LEFT}px`,
        paddingTop: `${CONTENT_TOP}px`,
        backgroundColor: 'transparent',
        zIndex: 60,
      }}
    >
      {event ? <EventReviews event={event} t={t} /> : <EventTiles events={events} t={t} />}

      <Footer style={{ width: '520px', marginTop: '80px', marginBottom: '40px' }} />
    </section>
  );
}
