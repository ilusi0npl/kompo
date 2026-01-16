import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { useScrollColorChange } from '../../hooks/useScrollColorChange';
import {
  desktopBioSlides as configSlides,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './bio-config';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';
import { useSanityBioProfiles } from '../../hooks/useSanityBioProfiles';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Map slide indices to translation keys
const slideTranslationKeys = ['ensemble', 'aleksandra', 'rafal', 'jacek'];

// Transform Sanity profiles to match config structure
function transformSanityProfiles(profiles) {
  return profiles.map((profile, index) => ({
    id: `bio${profile.order}`,
    backgroundColor: profile.backgroundColor,
    name: profile.name,
    lineColor: profile.lineColor,
    textColor: profile.textColor,
    image: profile.imageUrl,
    imageStyle: profile.imageStyle || {},
    paragraphs: profile.paragraphs,
    paragraphTops: profile.paragraphTops,
    hasFooter: profile.hasFooter,
    height: profile.hasFooter ? 850 : DESKTOP_HEIGHT,
  }));
}

export default function DesktopBio({ setCurrentColors }) {
  const { t } = useTranslation();
  const [loadedImages, setLoadedImages] = useState(new Set());
  const sectionsRef = useRef([]);

  // Fetch from Sanity if enabled
  const { profiles: sanityProfiles, loading, error } = useSanityBioProfiles();

  // Transform and use Sanity data if enabled, otherwise use config
  const desktopBioSlides = USE_SANITY
    ? transformSanityProfiles(sanityProfiles)
    : configSlides;

  // Use scroll-based color detection
  const currentColors = useScrollColorChange(sectionsRef, desktopBioSlides);

  // Pass colors to parent (for fixed layer outside ResponsiveWrapper)
  useEffect(() => {
    if (setCurrentColors) {
      setCurrentColors(currentColors);
    }
  }, [currentColors, setCurrentColors]);

  // Preload wszystkich obrazów Bio
  useEffect(() => {
    desktopBioSlides.forEach((slide, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(index));
      };
      img.src = slide.image;
    });
  }, []);

  // Reset scroll position on mount (document scroll)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync background and line colors with CSS variables for ResponsiveWrapper
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', currentColors.backgroundColor);
    document.documentElement.style.setProperty('--line-color', currentColors.lineColor);
  }, [currentColors.backgroundColor, currentColors.lineColor]);

  // Total height: sum of all section heights (3×700px + 1×850px)
  const totalHeight = desktopBioSlides.reduce((sum, slide) => sum + (slide.height || DESKTOP_HEIGHT), 0);

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <section
        data-section="bio"
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          minHeight: `${DESKTOP_HEIGHT}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '16px',
            color: '#131313',
          }}
        >
          Ładowanie profili...
        </div>
      </section>
    );
  }

  // Show error state only when using Sanity
  if (USE_SANITY && error) {
    return (
      <section
        data-section="bio"
        className="relative"
        style={{
          width: `${DESKTOP_WIDTH}px`,
          minHeight: `${DESKTOP_HEIGHT}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '16px',
            color: '#FF0000',
          }}
        >
          Błąd ładowania profili. Spróbuj ponownie później.
        </div>
      </section>
    );
  }

  return (
    <section
      data-section="bio"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        minHeight: `${totalHeight}px`,
      }}
    >
      {/* SCROLLABLE LAYER - Bio sections (document scroll) - pod fixedowymi elementami */}
      <div
        style={{
          position: 'relative',
        }}
      >
        {desktopBioSlides.map((slide, index) => (
          <section
            key={slide.id}
            ref={(el) => (sectionsRef.current[index] = el)}
            data-color={slide.id}
            style={{
              height: `${slide.height || DESKTOP_HEIGHT}px`,
              position: 'relative',
              width: `${DESKTOP_WIDTH}px`,
            }}
          >
            {/* Zdjęcie - 300x460px, centered at left calc(50% - 385px) */}
            <div
              className="absolute"
              style={{
                left: 'calc(50% - 385px)',
                transform: 'translateX(-50%)',
                top: '180px',
                width: '300px',
                height: '460px',
                overflow: 'hidden',
                backgroundColor: slide.backgroundColor,
                zIndex: 60,
              }}
            >
              <img
                src={slide.image}
                alt={slide.name}
                style={{
                  ...slide.imageStyle,
                  opacity: loadedImages.has(index) ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                }}
              />
            </div>

            {/* Tytuł (imię) */}
            <p
              className="absolute"
              style={{
                left: '625px',
                top: '180px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                fontSize: '40px',
                lineHeight: 1.35,
                color: slide.textColor,
                zIndex: 60,
              }}
            >
              {USE_SANITY
                ? slide.name
                : t(`bio.slides.${slideTranslationKeys[index]}.name`)}
            </p>

            {/* Paragrafy tekstu */}
            <div>
              {(USE_SANITY
                ? slide.paragraphs
                : t(`bio.slides.${slideTranslationKeys[index]}.paragraphs`)
              ).map((text, pIndex) => (
                <p
                  key={pIndex}
                  className="absolute"
                  style={{
                    left: '625px',
                    top: `${slide.paragraphTops[pIndex]}px`,
                    width: '520px',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: 1.48,
                    color: slide.textColor,
                    whiteSpace: 'pre-wrap',
                    zIndex: 60,
                  }}
                >
                  {text}
                </p>
              ))}
            </div>

            {/* Link "WIĘCEJ" (tylko dla bio1 - ensemble) */}
            {slide.id === 'bio1' && (
              <Link
                to="/bio/ensemble"
                className="absolute"
                style={{
                  left: '625px',
                  top: '624px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: 1.48,
                  color: '#761FE0',
                  textDecoration: 'underline',
                  textTransform: 'uppercase',
                  zIndex: 60,
                }}
              >
                {t('bio.ensemble.more')}
              </Link>
            )}

            {/* Stopka (tylko dla slide 4 - bio4) */}
            {slide.hasFooter && (
              <Footer
                className="absolute"
                style={{
                  left: '185px',
                  top: '752px',
                  width: '520px',
                  zIndex: 60,
                }}
                textColor={slide.textColor}
              />
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
