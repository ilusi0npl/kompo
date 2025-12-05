import { useScrollSlides } from '../Homepage/useScrollSlides';
import {
  mobileBioSlides,
  mobileLinePositions,
  MOBILE_WIDTH,
  MOBILE_HEIGHT,
} from './bio-config';
import { Link } from 'react-router';

const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

export default function MobileBio() {
  const { currentSlide } = useScrollSlides(mobileBioSlides.length);
  const currentData = mobileBioSlides[currentSlide];

  return (
    <section
      data-section="bio-mobile"
      className="relative overflow-hidden"
      style={{
        width: `${MOBILE_WIDTH}px`,
        height: `${MOBILE_HEIGHT}px`,
        backgroundColor: currentData.backgroundColor,
        transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
      }}
    >
      {/* Pionowe linie w tle */}
      {mobileLinePositions.map((left, index) => (
        <div
          key={index}
          className="absolute top-0"
          style={{
            left: `${left}px`,
            width: '1px',
            height: '100%',
            backgroundColor: currentData.lineColor,
            transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
          }}
        />
      ))}

      {/* Header z logo i menu */}
      <div
        className="absolute left-0 top-0 overflow-hidden"
        style={{
          width: `${MOBILE_WIDTH}px`,
          height: '281px',
          backgroundColor: currentData.backgroundColor,
          transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
        }}
      >
        {/* Logo */}
        {mobileBioSlides.map((slide, index) => (
          <Link to="/" key={slide.id}>
            <img
              src={slide.logoSrc}
              alt="Kompopolex"
              className="absolute"
              style={{
                left: '20px',
                top: '40px',
                width: '104px',
                height: '42px',
                opacity: index === currentSlide ? 1 : 0,
                transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
                pointerEvents: index === currentSlide ? 'auto' : 'none',
              }}
            />
          </Link>
        ))}

        {/* MENU */}
        <p
          className="absolute"
          style={{
            left: '312px',
            top: '43px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: 'normal',
            color: currentData.textColor,
            transition: `color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
          }}
        >
          MENU
        </p>

        {/* Bio - obrócony tekst */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: '45px',
            top: '192px',
            width: '107px',
            height: '49px',
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '44px',
              lineHeight: 1,
              color: currentData.textColor,
              transform: 'rotate(-90deg)',
              whiteSpace: 'nowrap',
              transition: `color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            }}
          >
            Bio
          </p>
        </div>
      </div>

      {/* Zdjęcie - 300x460px centered */}
      <div
        className="absolute"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          top: '281px',
          width: '300px',
          height: '460px',
          overflow: 'hidden',
        }}
      >
        {mobileBioSlides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            }}
          />
        ))}
      </div>

      {/* Tytuł (imię) */}
      {mobileBioSlides.map((slide, index) => (
        <p
          key={slide.id}
          className="absolute"
          style={{
            left: '20px',
            top: '801px',
            width: '258px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '40px',
            lineHeight: 1.2,
            color: slide.textColor,
            opacity: index === currentSlide ? 1 : 0,
            transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            pointerEvents: index === currentSlide ? 'auto' : 'none',
            whiteSpace: 'pre-wrap',
          }}
        >
          {slide.name}
        </p>
      ))}

      {/* Paragrafy tekstu */}
      {mobileBioSlides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute"
          style={{
            opacity: index === currentSlide ? 1 : 0,
            transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            pointerEvents: index === currentSlide ? 'auto' : 'none',
          }}
        >
          {slide.paragraphs.map((text, pIndex) => (
            <p
              key={pIndex}
              className="absolute"
              style={{
                left: '20px',
                top: `${921 + pIndex * 256}px`,
                width: '350px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: 1.48,
                color: slide.textColor,
                whiteSpace: 'pre-wrap',
              }}
            >
              {text}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}
