// Konfiguracja slajdów Homepage
// Dane bazowane na designie Figma

export const desktopSlides = [
  {
    id: 1,
    backgroundColor: '#FDFDFD',
    word: 'Trio',
    wordSvg: '/assets/slides/word-trio.svg',
    wordY: 446,
    wordHeight: 149,  // SVG height from Figma
    wordWidth: 49,    // SVG width from Figma
    tagline: 'specjalizujemy się w muzyce najnowszej',
    taglineX: 514,
    image: '/assets/slides/hero-1.jpg',
    textColor: '#131313',
    lineColor: '#A0E38A',
    logoSrc: '/assets/logo.svg'
  },
  {
    id: 2,
    backgroundColor: '#761FE0',
    word: 'Kompo',
    wordSvg: '/assets/slides/word-kompo.svg',
    wordY: 408,
    wordHeight: 185,  // SVG height from Figma
    wordWidth: 58,    // SVG width from Figma
    tagline: 'gramy wszystko i na wszystkim',
    taglineX: 612,
    image: '/assets/slides/hero-2.jpg',
    textColor: '#FDFDFD',
    lineColor: '#A0E38A',
    logoSrc: '/assets/logo-white.svg'
  },
  {
    id: 3,
    backgroundColor: '#34B898',
    word: 'Polex',
    wordSvg: '/assets/slides/word-polex.svg',
    wordY: 408,
    wordHeight: 185,  // SVG height from Figma
    wordWidth: 49,    // SVG width from Figma
    tagline: 'jesteśmy z Polski',
    taglineX: 741,
    image: '/assets/slides/hero-3.jpg',
    textColor: '#131313',
    lineColor: '#A0E38A',
    logoSrc: '/assets/logo.svg'
  },
  {
    id: 4,
    backgroundColor: '#FFBD19',
    word: 'Ensemble',
    wordSvg: '/assets/slides/word-ensemble.svg',
    wordY: 293,
    wordHeight: 299,  // SVG height from Figma
    wordWidth: 49,    // SVG width from Figma
    tagline: 'komponuje dla nas cały świat',
    taglineX: 622,
    image: '/assets/slides/hero-4.jpg',
    textColor: '#131313',
    lineColor: '#5B5B5B',
    logoSrc: '/assets/logo.svg'
  }
];

export const mobileSlides = [
  {
    id: 1,
    backgroundColor: '#FDFDFD',
    word: 'Trio',
    tagline: 'specjalizujące się w muzyce najnowszej',
    image: '/assets/slides/hero-1.jpg',
    textColor: '#131313',
    lineColor: '#A0E38A',
    logoSrc: '/assets/logo.svg'
  },
  {
    id: 2,
    backgroundColor: '#761FE0',
    word: 'Kompo',
    tagline: 'gramy wszystko i na wszystkim',
    image: '/assets/slides/hero-2.jpg',
    textColor: '#FDFDFD',
    lineColor: '#A0E38A',
    logoSrc: '/assets/logo-white.svg'
  },
  {
    id: 3,
    backgroundColor: '#34B898',
    word: 'Polex',
    tagline: 'jesteśmy z Polski',
    image: '/assets/slides/hero-3.jpg',
    textColor: '#131313',
    lineColor: '#A0E38A',
    logoSrc: '/assets/logo.svg'
  },
  {
    id: 4,
    backgroundColor: '#FFBD19',
    word: 'Ensemble',
    tagline: 'komponuje dla nas cały świat',
    image: '/assets/slides/hero-4.jpg',
    textColor: '#131313',
    lineColor: '#5B5B5B',
    logoSrc: '/assets/logo.svg'
  }
];

// Pozycje pionowych linii
export const desktopLinePositions = [155, 375, 595, 815, 1035, 1255];
export const mobileLinePositions = [97, 195, 292];

// Wymiary
export const DESKTOP_WIDTH = 1440;
export const DESKTOP_HEIGHT = 700;
export const MOBILE_WIDTH = 390;
export const MOBILE_HEIGHT = 683;
