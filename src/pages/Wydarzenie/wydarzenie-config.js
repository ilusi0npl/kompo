// Konfiguracja strony Wydarzenie (Event Details)
// Dane bazowane na designie Figma node 29-1501

import { isLargeTestMode, generateEventDetail } from '../../test-data/large-data-generator';

const realEventData = {
  title: 'ENSEMBLE KOMPOPOLEX',
  date: '13.12.25 ',
  time: '18:00 ',
  location: 'ASP WROCŁAW, PL. POLSKI 3/4 ',
  image: '/assets/wydarzenie/poster.jpg',
  description: 'Dorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl.',
  artists: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
  program: [
    { composer: 'La Monte Young ', piece: 'Composition #10 ' },
    { composer: 'Marta Śniady', piece: ' Body X Ultra ' },
    { composer: 'Martin A. Hirsti-Kvam', piece: ' Memory Box #2 ' },
    { composer: 'Jennifer Walshe ', piece: 'EVERYTHING YOU OWN HAS BEEN TAKEN TO A DEPOT SOMEWHERE ' },
    { composer: 'Rafał Ryterski', piece: ' Breathe ' },
    { composer: 'La Monte Young', piece: ' Composition #13' },
  ],
  partners: [
    { name: 'Wrocław', logo: '/assets/wydarzenie/partner-wroclaw.png', width: 323, height: 42 },
    { name: 'ZAIKS', logo: '/assets/wydarzenie/partner-zaiks.png', width: 93, height: 42 },
    { name: 'Recepcja', logo: '/assets/wydarzenie/partner-recepcja.png', width: 122, height: 42 },
    { name: 'Polmic', logo: '/assets/wydarzenie/partner-polmic.png', width: 129, height: 42 },
  ],
};

// Pozycje pionowych linii (z Figma)
export const desktopLinePositions = [155, 375, 595, 815, 1035, 1255];

// Wymiary
export const DESKTOP_WIDTH = 1440;
export const DESKTOP_HEIGHT = 1941;

// Export - use large test data when VITE_LARGE_TEST_DATA=true
export const eventData = isLargeTestMode ? generateEventDetail(30) : realEventData;
