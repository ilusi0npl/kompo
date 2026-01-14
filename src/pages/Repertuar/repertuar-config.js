// Konfiguracja strony Repertuar
// Dane bazowane na designie Figma node 171-189 (desktop) i 189-1365 (mobile)

export const DESKTOP_WIDTH = 1440;
export const DESKTOP_HEIGHT = 1285; // From Figma node 171-189
export const MOBILE_WIDTH = 390;
export const MOBILE_HEIGHT = 2507; // Calculated: footnote(2239) + height(48) + margin(50) + footer(120) + bottom(50)

// Pozycje pionowych linii (z Figma)
export const desktopLinePositions = [155, 375, 595, 815, 1035, 1255];
export const mobileLinePositions = [97, 195, 292];

// Lista wszystkich kompozytorów i ich utworów
// Utwory z isSpecial: true zostały napisane specjalnie dla Ensemble Kompopolex
export const composers = [
  {
    name: 'Carola Bauckholt',
    year: '(1959)',
    works: [{ title: 'Geräusche (1992)', isSpecial: false }],
  },
  {
    name: 'Piotr Bednarczyk',
    year: '(1994)',
    works: [{ title: 'triggered (2020)', isSpecial: true }],
  },
  {
    name: 'Jorge Sanchez-Chiong',
    year: '(1969)',
    works: [{ title: 'Salt Water (2014/15)', isSpecial: false }],
  },
  {
    name: 'Monika Dalach',
    year: '(1993)',
    works: [{ title: 'CARBON IS THE NEW BLACK (2020)', isSpecial: true }],
  },
  {
    name: 'Nina Fukuoka',
    year: '(1988)',
    works: [{ title: 'uncanny valley (2018)', isSpecial: true }],
  },
  {
    name: 'Aleksandra Gryka',
    year: '(1977)',
    works: [{ title: 'PLASTIC (2021)', isSpecial: false }],
  },
  {
    name: 'Katarina Gryvul',
    year: '(1993)',
    works: [{ title: 'Chasm (2023)', isSpecial: true }],
  },
  {
    name: 'Eloain Lovis Hübner',
    year: '(1993)',
    works: [{ title: 'trauma und zwischenraum (2021)', isSpecial: true }],
  },
  {
    name: 'Neo Hülcker',
    year: '(1987)',
    works: [{ title: 'we speak (2019)', isSpecial: false }],
  },
  {
    name: 'La Monte Young',
    year: '(1935)',
    works: [{ title: 'Composition #7, #10, #13', isSpecial: false }],
  },
  {
    name: 'Martin A. Hirsti-Kvam',
    year: '(1991)',
    works: [{ title: 'Memory Box #2 (2023)', isSpecial: true }],
  },
  {
    name: 'Simon Løffler',
    year: '(1981)',
    works: [
      { title: 'b (2012)', isSpecial: false },
    ],
  },
  {
    name: 'Paweł Malinowski',
    year: '(1994)',
    works: [{ title: 'Imaginarium Polkolor (2020)', isSpecial: true }],
  },
  {
    name: 'Celeste Oram',
    year: '(1990)',
    works: [{ title: 'XEROX ROCK (2015)', isSpecial: false }],
  },
  {
    name: 'Piotr Peszat',
    year: '(1990)',
    works: [{ title: 'Untitled Folder #3 (2019)', isSpecial: false }],
  },
  {
    name: 'Rafał Zapała',
    year: '(1975)',
    works: [{ title: 'black serial MIDI music (2023)', isSpecial: true }],
  },
  {
    name: 'Rafał Ryterski',
    year: '(1992)',
    works: [{ title: 'Breathe (2021)', isSpecial: true }],
  },
  {
    name: 'Kelley Sheehan',
    year: '(1989)',
    works: [{ title: 'BrainZaps (2020)', isSpecial: false }],
  },
  {
    name: 'Agata Zemla',
    year: '(1994)',
    works: [{ title: 'Simona (2021)', isSpecial: true }],
  },
  {
    name: 'Monika Szpyrka',
    year: '(1993)',
    works: [{ title: 'Angle of Reflection (2022)', isSpecial: true }],
  },
  {
    name: 'Olgierd Żemojtel',
    year: '',
    works: [{ title: 'BANKSY________ (2022)', isSpecial: true }],
  },
  {
    name: 'Teoniki Rożynek',
    year: '(1991)',
    works: [
      { title: 'bol (2017)', isSpecial: false },
      { title: 'The Most Satysfying Music in the World (2017)', isSpecial: false },
    ],
  },
  {
    name: 'Jenniffer Walshe',
    year: '(1974)',
    works: [
      {
        title: 'EVERYTHING YOU OWN HAS BEEN TAKEN TO A DEPOT SOMEWHERE (2013)',
        isSpecial: false,
      },
    ],
  },
  {
    name: 'Matthew Shlomowitz',
    year: '(1975)',
    works: [{ title: 'Weird Audio Guide (2011 rev. 2020)', isSpecial: false }],
  },
  {
    name: 'Marta Śniady',
    year: '(1986)',
    works: [
      { title: 'c_ut|e_#1 (2017)', isSpecial: false },
      { title: 'Body X Ultra (2023)', isSpecial: true },
    ],
  },
];
