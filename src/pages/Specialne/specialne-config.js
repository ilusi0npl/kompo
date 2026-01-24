// Konfiguracja strony Projekty Specjalne
// Dane bazowane na designie Figma node 171-329 (desktop) i 189-1534 (mobile)

import { isLargeTestMode, generateSpecialProjects } from '../../test-data/large-data-generator';

export const DESKTOP_WIDTH = 1440;
export const DESKTOP_HEIGHT = 827; // From Figma node 171-329
export const MOBILE_WIDTH = 390;
export const MOBILE_HEIGHT = 1264; // Calculated: footnote(996) + height(48) + margin(50) + footer(120) + bottom(50)

// Pozycje pionowych linii (z Figma)
export const desktopLinePositions = [155, 375, 595, 815, 1035, 1255];
export const mobileLinePositions = [97, 195, 292];

// Lista kompozytorów dla projektów specjalnych
// Utwory wykonywane z zaproszonymi osobami gościnnymi
const realComposers = [
  {
    name: 'Michael Beil',
    year: '(1963)',
    works: [{ title: 'Caravan (2017)', isSpecial: false }],
  },
  {
    name: 'Cezary Duchnowski',
    year: '(1971)',
    works: [{ title: 'Wściekłość (2018)', isSpecial: true }],
  },
  {
    name: 'Kuba Krzewiński',
    year: '(1988)',
    works: [{ title: 'Another Air (2017)', isSpecial: true }],
  },
  {
    name: 'Simon Løffler',
    year: '(1981)',
    works: [{ title: 'H (2014-2018)', isSpecial: false }],
  },
  {
    name: 'Bogusław Schaeffer',
    year: '(1929-2019)',
    works: [{ title: 'TIS MW2 (1963)', isSpecial: false }],
  },
  {
    name: 'Jacek Sotomski',
    year: '(1987)',
    works: [{ title: 'CREDOPOL (2018, rev. 2019)', isSpecial: true }],
  },
  {
    name: 'Marek Chołoniewski',
    year: '(1953)',
    works: [{ title: 'Assemblages dla konkretnych wykonawców (1975-79)', isSpecial: false }],
  },
];

// Export - use large test data when VITE_LARGE_TEST_DATA=true
export const composers = isLargeTestMode ? generateSpecialProjects(50) : realComposers;
