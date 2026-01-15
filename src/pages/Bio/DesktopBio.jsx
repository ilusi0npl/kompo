import { useState, useEffect, useRef } from 'react';
import { useScrollColorChange } from '../../hooks/useScrollColorChange';
import {
  desktopBioSlides,
  DESKTOP_WIDTH,
  DESKTOP_HEIGHT,
} from './bio-config';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from '../../hooks/useTranslation';

const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Map slide indices to translation keys
const slideTranslationKeys = ['ensemble', 'aleksandra', 'rafal', 'jacek'];

export default function DesktopBio({ setCurrentColors }) {
  const { t } = useTranslation();
  const [loadedImages, setLoadedImages] = useState(new Set());
  const sectionsRef = useRef([]);

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

  // Total height: 4 sections × 700px each
  const totalHeight = desktopBioSlides.length * DESKTOP_HEIGHT;

  return (
    <section
      data-section="bio"
      className="relative"
      style={{
        width: `${DESKTOP_WIDTH}px`,
        minHeight: `${totalHeight}px`,
        backgroundColor: currentColors.backgroundColor,
        transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
      }}
    >
      {/* SCROLLABLE LAYER - Bio sections (document scroll) - pod fixedowymi elementami */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {desktopBioSlides.map((slide, index) => (
          <section
            key={slide.id}
            ref={(el) => (sectionsRef.current[index] = el)}
            data-color={slide.id}
            style={{
              height: `${DESKTOP_HEIGHT}px`,
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
              }}
            >
              {t(`bio.slides.${slideTranslationKeys[index]}.name`)}
            </p>

            {/* Paragrafy tekstu */}
            <div>
              {Array.isArray(
                t(`bio.slides.${slideTranslationKeys[index]}.paragraphs`)
              ) &&
                t(`bio.slides.${slideTranslationKeys[index]}.paragraphs`).map(
                  (text, pIndex) => (
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
                      }}
                    >
                      {text}
                    </p>
                  )
                )}
            </div>

            {/* Stopka (tylko dla slide 4 - bio4) */}
            {slide.hasFooter && (
              <Footer
                className="absolute"
                style={{
                  left: '185px',
                  top: '652px',
                  width: '520px',
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
