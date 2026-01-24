// Konfiguracja strony Archiwalne
// Dane bazowane na designie Figma node 19-127

import { isLargeTestMode, generateArchivedEvents } from '../../test-data/large-data-generator';

const realArchivedEvents = [
  // Row 1
  {
    id: 1,
    date: '13.12.25 ',
    title: 'ENSEMBLE KOMPOPOLEX',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
    image: '/assets/archiwalne/event1.jpg',
    position: { left: 185, top: 275 },
    hasBorder: true,
  },
  {
    id: 2,
    date: '10.12.24 ',
    title: 'KOMPOPOLEX x martyna zakrzewska',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski, Martyna Zakrzewska',
    image: '/assets/archiwalne/event2.jpg',
    position: { left: 515, top: 275 },
    hasBorder: false,
  },
  {
    id: 3,
    date: '20.12.23',
    title: 'społeczne komponowanie',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
    image: '/assets/archiwalne/event3.jpg',
    position: { left: 845, top: 275 },
    hasBorder: false,
  },
  // Row 2
  {
    id: 4,
    date: '13.12.25 ',
    title: 'ENSEMBLE KOMPOPOLEX',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
    image: '/assets/archiwalne/event4.jpg',
    position: { left: 185, top: 949 },
    hasBorder: true,
  },
  {
    id: 5,
    date: '10.12.24 ',
    title: 'KOMPOPOLEX x martyna zakrzewska',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski, Martyna Zakrzewska',
    image: '/assets/archiwalne/event5.jpg',
    position: { left: 515, top: 949 },
    hasBorder: false,
  },
  {
    id: 6,
    date: '20.12.23',
    title: 'społeczne komponowanie',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
    image: '/assets/archiwalne/event6.jpg',
    position: { left: 845, top: 949 },
    hasBorder: false,
  },
];

// Pozycje pionowych linii (z Figma)
export const desktopLinePositions = [155, 375, 595, 815, 1035, 1255];

// Wymiary
export const DESKTOP_WIDTH = 1440;
export const DESKTOP_HEIGHT = 1792; // Full page height from Figma

// Export - use large test data when VITE_LARGE_TEST_DATA=true
export const archivedEvents = isLargeTestMode ? generateArchivedEvents(100) : realArchivedEvents;
