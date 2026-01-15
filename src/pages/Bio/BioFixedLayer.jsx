import { Link } from 'react-router';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';

const TRANSITION_DURATION = '1s';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];

export default function BioFixedLayer({ currentColors, scale = 1 }) {
  const { t } = useTranslation();

  return (
    <>
      {/* Pionowe linie dekoracyjne - fixed */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      >
        {LINE_POSITIONS.map((x) => (
          <div
            key={x}
            className="absolute top-0"
            style={{
              left: `${x * scale}px`,
              width: `${1 * scale}px`,
              height: '100%',
              backgroundColor: currentColors.lineColor,
              transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            }}
          />
        ))}
      </div>

      {/* FIXED LAYER - Logo, Menu, Bio text */}
      <div
        style={{
          position: 'fixed',
          zIndex: 100,
          pointerEvents: 'none',
          width: `${1440 * scale}px`,
          height: `${700 * scale}px`,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            position: 'absolute',
            left: `${185 * scale}px`,
            top: `${60 * scale}px`,
            pointerEvents: 'auto',
            zIndex: 101,
          }}
        >
          <img
            src={currentColors.logoSrc}
            alt="Kompopolex"
            style={{
              width: `${149 * scale}px`,
              height: `${60 * scale}px`,
              transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            }}
          />
        </Link>

        {/* "Bio" SVG pionowy tekst po lewej */}
        <svg
          className="absolute"
          width={49 * scale}
          height={107 * scale}
          viewBox="0 0 49 107"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            left: `${94 * scale}px`,
            top: `${524 * scale}px`,
            transition: `fill ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            zIndex: 101,
          }}
        >
          <path
            d="M45.4401 5.23087e-06L45.4401 15.552C45.4401 19.776 44.3734 23.0187 42.2401 25.28C40.1494 27.584 37.2907 28.736 33.6641 28.736C31.1041 28.736 29.0561 28.096 27.5201 26.816C25.9841 25.5787 24.8747 23.808 24.1921 21.504L23.8721 21.504C23.2321 24.192 22.0587 26.304 20.3521 27.84C18.6881 29.4187 16.3201 30.208 13.2481 30.208C11.3707 30.208 9.66407 29.888 8.12807 29.248C6.63473 28.6507 5.3334 27.776 4.22407 26.624C3.11473 25.5147 2.2614 24.1493 1.66407 22.528C1.06673 20.9493 0.768065 19.1573 0.768065 17.152L0.768066 3.2782e-06L45.4401 5.23087e-06ZM6.84807 14.592C6.84807 16.9387 7.27473 18.688 8.12807 19.84C9.02407 21.0347 10.5387 21.632 12.6721 21.632L14.7841 21.632C16.8747 21.632 18.3467 21.0347 19.2001 19.84C20.0961 18.688 20.5441 16.9387 20.5441 14.592L20.5441 8.192L6.84807 8.192L6.84807 14.592ZM26.3681 13.504C26.3681 15.7653 26.7734 17.4293 27.5841 18.496C28.3947 19.6053 29.8027 20.16 31.8081 20.16L33.9201 20.16C35.9254 20.16 37.3334 19.6053 38.1441 18.496C38.9547 17.4293 39.3601 15.7653 39.3601 13.504L39.3601 8.192L26.3681 8.192L26.3681 13.504ZM38.9121 54.503C38.9121 52.583 39.3174 51.2177 40.1281 50.407C40.9387 49.639 41.9201 49.255 43.0721 49.255L44.6081 49.255C45.7601 49.255 46.7414 49.639 47.5521 50.407C48.3627 51.2177 48.7681 52.583 48.7681 54.503C48.7681 56.423 48.3627 57.767 47.5521 58.535C46.7414 59.3457 45.7601 59.751 44.6081 59.751L43.0721 59.751C41.9201 59.751 40.9387 59.3457 40.1281 58.535C39.3174 57.767 38.9121 56.423 38.9121 54.503ZM7.23206 39.527L7.23206 50.407L27.3281 50.407L27.3281 39.527L33.7921 39.527L33.7921 58.599L7.23206 58.599L7.23206 68.711L0.768063 68.711L0.768064 39.527L7.23206 39.527ZM6.22055e-05 90.83C6.23155e-05 88.3127 0.405396 86.0513 1.21606 84.046C2.02673 82.0833 3.17873 80.398 4.67206 78.99C6.1654 77.6247 7.97873 76.558 10.1121 75.79C12.2454 75.0647 14.6347 74.702 17.2801 74.702C19.9254 74.702 22.3147 75.0647 24.4481 75.79C26.5814 76.558 28.3947 77.6247 29.8881 78.99C31.3814 80.398 32.5334 82.0833 33.3441 84.046C34.1547 86.0513 34.5601 88.3127 34.5601 90.83C34.5601 93.3047 34.1547 95.5447 33.3441 97.55C32.5334 99.5553 31.3814 101.241 29.8881 102.606C28.3947 104.014 26.5814 105.081 24.4481 105.806C22.3147 106.574 19.9254 106.958 17.2801 106.958C14.6347 106.958 12.2454 106.574 10.1121 105.806C7.97873 105.081 6.1654 104.014 4.67206 102.606C3.17873 101.241 2.02673 99.5553 1.21606 97.55C0.405395 95.5447 6.20973e-05 93.3047 6.22055e-05 90.83ZM6.27206 90.83C6.27206 93.1767 6.97606 95.0327 8.38406 96.398C9.83473 97.7633 11.9467 98.446 14.7201 98.446L19.8401 98.446C22.6134 98.446 24.7041 97.7633 26.1121 96.398C27.5627 95.0327 28.2881 93.1767 28.2881 90.83C28.2881 88.4833 27.5627 86.6273 26.1121 85.262C24.7041 83.8967 22.6134 83.214 19.8401 83.214L14.7201 83.214C11.9467 83.214 9.83473 83.8967 8.38406 85.262C6.97606 86.6273 6.27206 88.4833 6.27206 90.83Z"
            fill={currentColors.textColor}
            style={{
              transition: `fill ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            }}
          />
        </svg>

        {/* Language Toggle - top right */}
        <div
          style={{
            position: 'absolute',
            left: `${1265 * scale}px`,
            top: `${60 * scale}px`,
            pointerEvents: 'auto',
            zIndex: 101,
          }}
        >
          <LanguageToggle
            textColor={currentColors.textColor}
            transition={`${TRANSITION_DURATION} ${TRANSITION_EASING}`}
            scale={scale}
          />
        </div>

        {/* Prawa nawigacja - menu items */}
        <nav
          className="absolute flex flex-col"
          style={{
            left: `${1265 * scale}px`,
            top: `${368 * scale}px`,
            gap: `${22 * scale}px`,
            pointerEvents: 'auto',
            zIndex: 101,
            fontSize: `${18 * scale}px`,
          }}
        >
            {[
              { key: 'bio', href: '/bio', active: true, isRoute: true },
              { key: 'media', href: '/media', active: false, isRoute: true },
              { key: 'kalendarz', href: '/kalendarz', active: false, isRoute: true },
              { key: 'repertuar', href: '/repertuar', active: false, isRoute: true },
              { key: 'fundacja', href: '/fundacja', active: false, isRoute: true },
              { key: 'kontakt', href: '/kontakt', active: false, isRoute: false },
            ].map((item) =>
              item.isRoute ? (
                <Link
                  key={item.key}
                  to={item.href}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 700,
                    fontSize: `${18 * scale}px`,
                    lineHeight: 1.48,
                    color: currentColors.textColor,
                    textDecoration: item.active ? 'underline' : 'none',
                    transition: `color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
                  }}
                >
                  {t(`common.nav.${item.key}`)}
                </Link>
              ) : (
                <a
                  key={item.key}
                  href={item.href}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 700,
                    fontSize: `${18 * scale}px`,
                    lineHeight: 1.48,
                    color: currentColors.textColor,
                    textDecoration: item.active ? 'underline' : 'none',
                    transition: `color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
                  }}
                >
                  {t(`common.nav.${item.key}`)}
                </a>
              )
            )}
        </nav>
      </div>
    </>
  );
}
