// Konfiguracja strony Kalendarz
// Dane bazowane na designie Figma node 19-49

export const events = [
  {
    id: 1,
    date: '13.12.25 | 18:00',
    title: 'ENSEMBLE KOMPOPOLEX',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
    description: 'Lorem ipsum dolor sit amet consectetur. Nunc aenean in auctor eu. Tellus non nulla odio donec. Eu lorem vitae praesent dictumst elit malesuada ultricies. Magna dolor sed in dui. Viverra consequat in suspendisse massa. Gravida aliquet dignissim ut eget.',
    location: 'ASP WROCŁAW, PL. POLSKI 3/4',
    image: '/assets/kalendarz/event1.webp',
    imageStyle: {
      objectFit: 'cover',
      objectPosition: '50% 50%',
    },
  },
  {
    id: 2,
    date: '20.12.25 | 18:00',
    title: 'SPOŁECZNE KOMPONOWANIE 2025',
    performers: 'Julia Łabowska, Karolina Kułaga, Oleś Kulczewicz, Szymon Kępczyński, Tymoteusz Lasik',
    description: 'Lorem ipsum dolor sit amet consectetur. Nunc aenean in auctor eu. Tellus non nulla odio donec. Eu lorem vitae praesent dictumst elit malesuada ultricies. Magna dolor sed in dui. Viverra consequat in suspendisse massa. Gravida aliquet dignissim ut eget.',
    location: 'Akademia Muzyczna im. K. Lipińskiego\nwe Wrocławiu',
    image: '/assets/kalendarz/event2.webp',
    imageStyle: {
      position: 'absolute',
      width: '209.97%',
      height: '100%',
      left: '-33.17%',
      top: '0',
      maxWidth: 'none',
    },
  },
  {
    id: 3,
    date: '16.01.26 | 20:00',
    title: 'MIXTUR FESTIVAL',
    performers: null,
    program: [
      { composer: 'La Monte Young', piece: 'Composition #10' },
      { composer: 'Marta Śniady', piece: 'Body X Ultra' },
      { composer: 'Martin A. Hirsti-Kvam', piece: 'Memory Box #2' },
      { composer: 'Jennifer Walshe', piece: 'EVERYTHING YOU OWN HAS BEEN TAKEN TO A DEPOT SOMEWHERE' },
      { composer: 'Rafał Ryterski', piece: 'Breathe' },
      { composer: 'La Monte Young', piece: 'Composition #13' },
    ],
    location: 'Nau Bostik, Barcelona',
    image: '/assets/kalendarz/event3.webp',
    imageStyle: {
      objectFit: 'cover',
      objectPosition: '50% 50%',
    },
  },
];

// Pozycje pionowych linii (z Figma)
export const desktopLinePositions = [155, 375, 595, 815, 1035, 1255];

// Wymiary
export const DESKTOP_WIDTH = 1440;
export const DESKTOP_HEIGHT = 2008; // Full page height from Figma
