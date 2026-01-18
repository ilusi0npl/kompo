// Komponent HorizontalFlash - efekt poziomych pasków podczas przejść między slajdami
import { useMemo } from 'react';

/**
 * Renderuje poziome paski, które pojawiają się podczas przejść
 * @param {boolean} isActive - czy efekt jest aktywny
 * @param {number} progress - postęp przejścia 0-1
 * @param {string} color - kolor pasków (domyślnie biały)
 * @param {number} width - szerokość kontenera
 * @param {number} height - wysokość kontenera
 */
export function HorizontalFlash({
  isActive = false,
  progress = 0,
  color = 'var(--contrast-bg)',
  width = 1440,
  height = 700,
  barCount = 8,
}) {
  // Generuj pozycje pasków
  const bars = useMemo(() => {
    const result = [];
    const barHeight = height / barCount;

    for (let i = 0; i < barCount; i++) {
      result.push({
        id: i,
        top: i * barHeight,
        height: barHeight,
        // Różne opóźnienia dla efektu kaskady
        delay: i * 0.05,
      });
    }
    return result;
  }, [height, barCount]);

  if (!isActive) {
    return null;
  }

  // Oblicz opacity na podstawie progress (peak w środku przejścia)
  // progress 0.3-0.5: rośnie, 0.5-0.7: maleje
  const normalizedProgress = (progress - 0.3) / 0.4; // 0 do 1 w zakresie 0.3-0.7
  const opacity = Math.sin(normalizedProgress * Math.PI) * 0.85;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {bars.map((bar) => {
        // Każdy pasek ma lekko różną animację
        const barProgress = Math.max(0, Math.min(1, normalizedProgress - bar.delay));
        const barOpacity = Math.sin(barProgress * Math.PI) * opacity;

        // Szerokość paska animuje od 0 do 100% i z powrotem
        const barWidth = Math.sin(barProgress * Math.PI) * 100;

        return (
          <div
            key={bar.id}
            style={{
              position: 'absolute',
              top: bar.top,
              left: '50%',
              transform: 'translateX(-50%)',
              width: `${barWidth}%`,
              height: bar.height,
              backgroundColor: color,
              opacity: barOpacity,
              transition: 'none',
            }}
          />
        );
      })}
    </div>
  );
}

export default HorizontalFlash;
