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
import { isLargeTestMode } from '../../test-data/large-data-generator';
import { calculateBioFontSize, calculateTitleFontSize } from '../../hooks/useResponsiveFontSize';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Map slide indices to translation keys
const slideTranslationKeys = ['ensemble', 'aleksandra', 'rafal', 'jacek'];

// Transform Sanity profiles to match config structure
// Merges CMS content (name, image, paragraphs) with hardcoded design values
function transformSanityProfiles(sanityProfiles) {
  return configSlides.map((configSlide, index) => {
    const sanityProfile = sanityProfiles[index];
    if (!sanityProfile) return configSlide;

    return {
      ...configSlide, // All design from bio-config.js
      name: sanityProfile.name,
      image: sanityProfile.imageUrl,
      paragraphs: sanityProfile.paragraphs,
    };
  });
}

export default function DesktopBio({ setCurrentColors }) {
  const { t } = useTranslation();
  const [loadedImages, setLoadedImages] = useState(new Set());
  const sectionsRef = useRef([]);

  // Fetch from Sanity if enabled
  const { profiles: sanityProfiles, loading, error } = useSanityBioProfiles();

  // Transform and use Sanity data if enabled, otherwise use config
  // MUST BE BEFORE ANY CONDITIONAL RETURNS (React Hooks rule)
  const desktopBioSlides = USE_SANITY && sanityProfiles && sanityProfiles.length > 0
    ? transformSanityProfiles(sanityProfiles)
    : configSlides;

  // Use scroll-based color detection
  // MUST BE BEFORE ANY CONDITIONAL RETURNS (React Hooks rule)
  const currentColors = useScrollColorChange(sectionsRef, desktopBioSlides);

  // ALL useEffect HOOKS MUST BE BEFORE CONDITIONAL RETURNS (React Hooks rule)

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {t('common.loading.profiles')}
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
            color: '#ff0000',
          }}
        >
          Błąd ładowania profili
        </div>
      </section>
    );
  }

  // Total height: sum of all section heights (3×700px + 1×850px)
  const totalHeight = desktopBioSlides.reduce((sum, slide) => sum + (slide.height || DESKTOP_HEIGHT), 0);

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

            {/* Kontener tekstu - tytuł i paragrafy */}
            {(() => {
              // Get content for this slide
              const slideName = USE_SANITY || isLargeTestMode
                ? slide.name
                : t(`bio.slides.${slideTranslationKeys[index]}.name`);
              const slideParagraphs = USE_SANITY || isLargeTestMode
                ? slide.paragraphs
                : t(`bio.slides.${slideTranslationKeys[index]}.paragraphs`);

              // Calculate responsive font sizes (only reduces when content exceeds limits)
              const titleFontSize = calculateTitleFontSize(slideName, {
                baseFontSize: 40,
                minFontSize: 28,
                maxChars: 25,
              });
              const paragraphFontSize = calculateBioFontSize(slideParagraphs, {
                baseFontSize: 16,
                minFontSize: 12,
                maxParagraphs: 2,
                maxCharsPerParagraph: 400,
              });

              return (
                <div
                  className="absolute"
                  style={{
                    left: '625px',
                    top: '180px',
                    width: '520px',
                    zIndex: 60,
                  }}
                >
                  {/* Tytuł (imię) */}
                  <p
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontWeight: 600,
                      fontSize: `${titleFontSize}px`,
                      lineHeight: 1.35,
                      color: slide.textColor,
                      marginBottom: '26px',
                    }}
                  >
                    {slideName}
                  </p>

                  {/* Paragrafy tekstu */}
                  {slideParagraphs.map((text, pIndex) => (
                    <p
                      key={pIndex}
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: 500,
                        fontSize: `${paragraphFontSize}px`,
                        lineHeight: 1.48,
                        color: slide.textColor,
                        whiteSpace: 'pre-wrap',
                        marginBottom: '24px',
                      }}
                    >
                      {text}
                    </p>
                  ))}

                  {/* Link "WIĘCEJ" (tylko dla bio1 - ensemble) */}
                  {slide.id === 'bio1' && (
                    <Link
                      to="/bio/ensemble"
                      style={{
                        display: 'inline-block',
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: 1.48,
                        color: '#761FE0',
                        textDecoration: 'underline',
                        textTransform: 'uppercase',
                      }}
                    >
                      {t('bio.ensemble.more')}
                    </Link>
                  )}
                </div>
              );
            })()}

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
