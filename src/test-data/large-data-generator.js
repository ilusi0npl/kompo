/**
 * Large Test Data Generator
 *
 * Generates large amounts of test data for manual testing.
 * Enable by setting VITE_LARGE_TEST_DATA=true in .env
 *
 * Usage in config files:
 *   import { isLargeTestMode, generateComposers } from '../../test-data/large-data-generator';
 *   export const composers = isLargeTestMode ? generateComposers(100) : realComposers;
 */

export const isLargeTestMode = import.meta.env.VITE_LARGE_TEST_DATA === 'true';

// ============================================================================
// REPERTUAR - Composers with works
// ============================================================================

const composerNames = [
  'Krzysztof Penderecki', 'Witold Lutosławski', 'Henryk Górecki', 'Karol Szymanowski',
  'Grażyna Bacewicz', 'Andrzej Panufnik', 'Wojciech Kilar', 'Paweł Mykietyn',
  'Agata Zubel', 'Paweł Szymański', 'Aleksander Nowak', 'Mikołaj Górecki',
  'Hanna Kulenty', 'Zygmunt Krauze', 'Eugeniusz Knapik', 'Rafał Augustyn',
  'Marcin Stańczyk', 'Dobromiła Jaskot', 'Monika Zielińska', 'Cezary Duchnowski',
  'Sławomir Kupczak', 'Artur Zagajewski', 'Jagoda Szmytka', 'Wojciech Blecharz',
  'Andrzej Krzanowski', 'Krzysztof Meyer', 'Marta Ptaszyńska', 'Tadeusz Baird',
  'Kazimierz Serocki', 'Roman Haubenstock-Ramati', 'Bogusław Schaeffer', 'Tomasz Sikorski'
];

const workTypes = [
  'Symfonia nr', 'Koncert na skrzypce i orkiestrę', 'Kwartet smyczkowy nr',
  'Sonata na fortepian', 'Trio fortepianowe', 'Koncert na fortepian',
  'Poemat symfoniczny', 'Suita orkiestrowa', 'Wariacje na orkiestrę',
  'Koncert na wiolonczelę', 'Sekstет smyczkowy', 'Muzyka na smyczki',
  'Koncert na flet', 'Koncert na klarnet', 'Koncert podwójny',
  'Pieśni na sopran i orkiestrę', 'Kantata', 'Requiem', 'Stabat Mater',
  'Muzyka elektroniczna nr', 'Instalacja dźwiękowa', 'Performance muzyczny'
];

export function generateComposers(count = 100) {
  const composers = [];

  for (let i = 0; i < count; i++) {
    const baseName = composerNames[i % composerNames.length];
    const name = i < composerNames.length ? baseName : `${baseName} ${Math.floor(i / composerNames.length) + 1}`;
    const birthYear = 1900 + (i % 100);

    const worksCount = 3 + (i % 5); // 3-7 works per composer
    const works = [];

    for (let j = 0; j < worksCount; j++) {
      const workType = workTypes[(i + j) % workTypes.length];
      const workNumber = (j % 3) + 1;
      works.push({
        title: `${workType} ${workNumber}`,
        isSpecial: j === 0 && i % 5 === 0, // Every 5th composer has a special work
      });
    }

    composers.push({
      name,
      year: birthYear,
      works,
    });
  }

  return composers;
}

// ============================================================================
// SPECJALNE - Special projects
// ============================================================================

export function generateSpecialProjects(count = 50) {
  const projects = [];

  for (let i = 0; i < count; i++) {
    const name = composerNames[i % composerNames.length];
    const year = 2010 + (i % 15);

    projects.push({
      name: i < composerNames.length ? name : `${name} (projekt ${Math.floor(i / composerNames.length) + 1})`,
      year,
      works: [
        {
          title: `Utwór zamówiony nr ${i + 1} na ensemble i elektronikę`,
          isSpecial: true,
        },
        {
          title: `Prawykonanie światowe - Festiwal ${2015 + (i % 10)}`,
          isSpecial: true,
        },
      ],
    });
  }

  return projects;
}

// ============================================================================
// KALENDARZ - Events
// ============================================================================

const venues = [
  'Filharmonia Wrocławska, ul. Piłsudskiego 19',
  'Narodowe Forum Muzyki, pl. Wolności 1',
  'ASP Wrocław, pl. Polski 3/4',
  'BWA Wrocław, ul. Ruska 46',
  'Centrum Sztuki Impart, ul. Mazowiecka 17',
  'Synagoga Pod Białym Bocianem',
  'Klub Firlej, ul. Grabiszyńska 56',
  'Opera Wrocławska, ul. Świdnicka 35',
];

const eventTitles = [
  'Koncert Muzyki Współczesnej',
  'Wieczór z Muzyką Nową',
  'Dźwięki XXI wieku',
  'Nowe Horyzonty Dźwięku',
  'Muzyka Elektroniczna Live',
  'Spotkanie z Kompozytorem',
  'Prawykonanie Światowe',
  'Festiwal Nowej Muzyki',
];

export function generateEvents(count = 50, type = 'upcoming') {
  const events = [];
  const baseDate = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(baseDate);
    if (type === 'upcoming') {
      date.setDate(date.getDate() + i * 7 + 1); // Future dates
    } else {
      date.setDate(date.getDate() - (i + 1) * 14); // Past dates
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    events.push({
      id: `event-${type}-${i + 1}`,
      date: `${day}.${month}.${year}`,
      title: `${eventTitles[i % eventTitles.length]} #${i + 1}`,
      performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski' + (i % 3 === 0 ? ', goście specjalni' : ''),
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.${i % 2 === 0 ? ' Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.' : ''}`,
      location: venues[i % venues.length],
      image: '/assets/kalendarz/wydarzenie-placeholder.jpg',
      program: i % 3 === 0 ? [
        { composer: composerNames[i % composerNames.length], piece: `Utwór nr ${i + 1}` },
        { composer: composerNames[(i + 1) % composerNames.length], piece: 'Koncert na ensemble' },
        { composer: composerNames[(i + 2) % composerNames.length], piece: 'Prawykonanie' },
      ] : undefined,
    });
  }

  return events;
}

// ============================================================================
// ARCHIWALNE - Archived events
// ============================================================================

// Grid layout constants (matching DesktopArchiwalne)
const ARCHIVE_COLUMNS = [185, 515, 845]; // X positions for 3 columns
const ARCHIVE_ROW_START = 275; // First row Y position
const ARCHIVE_ROW_HEIGHT = 674; // Height per row (card 420px + text ~254px)

export function generateArchivedEvents(count = 100) {
  const events = [];

  for (let i = 0; i < count; i++) {
    const year = 2020 + Math.floor(i / 20);
    const month = (i % 12) + 1;
    const day = (i % 28) + 1;

    // Calculate grid position
    const column = i % 3;
    const row = Math.floor(i / 3);

    events.push({
      id: `archive-${i + 1}`,
      date: `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`,
      title: `${eventTitles[i % eventTitles.length]} - Archiwum`,
      performers: 'Ensemble Kompopolex',
      image: '/assets/archiwalne/archive-placeholder.jpg',
      position: {
        left: ARCHIVE_COLUMNS[column],
        top: ARCHIVE_ROW_START + (row * ARCHIVE_ROW_HEIGHT),
      },
      hasBorder: i % 4 === 0,
    });
  }

  return events;
}

// ============================================================================
// MEDIA - Photo albums
// ============================================================================

const photographers = [
  'Jan Kowalski', 'Anna Nowak', 'Piotr Wiśniewski', 'Maria Dąbrowska',
  'Tomasz Zieliński', 'Katarzyna Szymańska', 'Michał Wójcik', 'Ewa Kaźmierczak'
];

export function generatePhotoAlbums(count = 30) {
  const albums = [];

  for (let i = 0; i < count; i++) {
    const photosCount = 10 + (i % 15); // 10-24 photos per album
    const images = [];

    for (let j = 0; j < photosCount; j++) {
      images.push(`/assets/media/album-${i + 1}/photo-${j + 1}.jpg`);
    }

    albums.push({
      id: `album-${i + 1}`,
      thumbnail: '/assets/media/album-placeholder.jpg',
      title: `Galeria z koncertu #${i + 1}: ${eventTitles[i % eventTitles.length]}`,
      photographer: photographers[i % photographers.length],
      images,
    });
  }

  return albums;
}

// ============================================================================
// MEDIA WIDEO - Videos
// ============================================================================

export function generateVideos(count = 50) {
  const videos = [];

  for (let i = 0; i < count; i++) {
    videos.push({
      id: `video-${i + 1}`,
      thumbnail: '/assets/media-wideo/video-placeholder.jpg',
      title: `Nagranie z koncertu #${i + 1}: ${eventTitles[i % eventTitles.length]}`,
      youtubeUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, // Placeholder
      year: 2020 + (i % 5),
      description: `Rejestracja koncertu z cyklu "${eventTitles[i % eventTitles.length]}" w ${venues[i % venues.length].split(',')[0]}.`,
    });
  }

  return videos;
}

// ============================================================================
// BIO - Profiles
// ============================================================================

const bioNames = [
  'Aleksandra Gołaj', 'Rafał Łuc', 'Jacek Sotomski',
  'Maria Kowalska', 'Jan Nowak', 'Katarzyna Wiśniewska',
  'Piotr Zieliński', 'Anna Wójcik', 'Tomasz Kamiński',
  'Ewa Lewandowska'
];

const instruments = [
  'fortepian', 'skrzypce', 'wiolonczela', 'flet', 'klarnet',
  'obój', 'fagot', 'trąbka', 'puzon', 'perkusja'
];

const bioParagraph = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;

export function generateBioProfiles(count = 10) {
  const profiles = [];
  const colors = [
    { bg: '#FDFDFD', line: '#A0E38A', text: '#131313' },
    { bg: '#FF734C', line: '#FFBD19', text: '#131313' },
    { bg: '#34B898', line: '#01936F', text: '#131313' },
    { bg: '#73A1FE', line: '#3478FF', text: '#131313' },
    { bg: '#761FE0', line: '#A0E38A', text: '#FDFDFD' },
  ];

  // Use real images that exist
  const realImages = [
    '/assets/bio/bio1-ensemble.webp',
    '/assets/bio/bio2-aleksandra.webp',
    '/assets/bio/bio3-rafal.webp',
    '/assets/bio/bio4-jacek.webp',
  ];

  // Height calculation constants (based on DesktopBio layout)
  const BASE_HEIGHT = 700; // Default DESKTOP_HEIGHT
  const CONTENT_START = 180; // Top padding before content
  const TITLE_HEIGHT = 80; // Title + margin
  const FOOTER_EXTRA = 150; // Extra space for footer

  // Font scaling thresholds (must match useResponsiveFontSize.js)
  const MAX_PARAGRAPHS_BEFORE_SCALING = 2;
  const BASE_FONT_SIZE = 16;
  const MIN_FONT_SIZE = 12;

  for (let i = 0; i < count; i++) {
    const color = colors[i % colors.length];
    const paragraphCount = 2 + (i % 3); // 2-4 paragraphs
    const paragraphs = [];
    const paragraphTops = [];

    for (let j = 0; j < paragraphCount; j++) {
      paragraphs.push(bioParagraph + (j % 2 === 0 ? ' Excepteur sint occaecat cupidatat non proident.' : ''));
      // Calculate paragraph tops (starting at 260, each paragraph ~130-160px apart)
      paragraphTops.push(260 + j * 160);
    }

    const isLightBg = color.bg === '#FDFDFD' || color.bg === '#FF734C' || color.bg === '#34B898' || color.bg === '#73A1FE';
    const isLast = i === count - 1;

    // Calculate font scale factor (same logic as useResponsiveFontSize)
    const paragraphOverflow = paragraphCount / MAX_PARAGRAPHS_BEFORE_SCALING;
    const fontScale = paragraphOverflow <= 1 ? 1 : 1 / Math.pow(paragraphOverflow, 0.4);
    const actualFontSize = Math.max(MIN_FONT_SIZE, Math.round(BASE_FONT_SIZE * fontScale));

    // Paragraph height scales with font size (base ~170px at 16px font)
    const paragraphHeight = Math.round(170 * (actualFontSize / BASE_FONT_SIZE));
    const bottomPadding = 60;

    // Calculate required height based on actual (scaled) content
    const contentHeight = CONTENT_START + TITLE_HEIGHT + (paragraphCount * paragraphHeight) + bottomPadding;
    const requiredHeight = Math.max(BASE_HEIGHT, contentHeight) + (isLast ? FOOTER_EXTRA : 0);

    profiles.push({
      id: `bio${i + 1}`,
      name: i < bioNames.length ? bioNames[i] : `Muzyk Testowy ${i + 1}`,
      image: realImages[i % realImages.length],
      // Use simple cover style for all generated profiles
      imageStyle: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: '50% 50%',
      },
      logoSrc: isLightBg ? '/assets/logo.svg' : '/assets/logo-white.svg',
      paragraphs,
      paragraphTops,
      backgroundColor: color.bg,
      lineColor: color.line,
      textColor: color.text,
      hasFooter: isLast,
      height: requiredHeight,
    });
  }

  return profiles;
}

// ============================================================================
// WYDARZENIE - Event detail
// ============================================================================

export function generateEventDetail(programItemsCount = 30) {
  const program = [];

  for (let i = 0; i < programItemsCount; i++) {
    program.push({
      composer: composerNames[i % composerNames.length],
      piece: `${workTypes[i % workTypes.length]} ${(i % 5) + 1}`,
    });
  }

  return {
    id: 'large-test-event',
    title: 'Wielki Koncert Muzyki Współczesnej - Edycja Specjalna',
    date: '15.06.25',
    time: '19:00',
    location: 'Filharmonia Wrocławska, ul. Piłsudskiego 19, Wrocław',
    image: '/assets/wydarzenie/event-placeholder.jpg',
    description: `${bioParagraph} ${bioParagraph}`,
    artists: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski oraz 15 muzyków gościnnych z całej Europy',
    program,
    partners: [
      { name: 'Partner 1', logo: '/assets/partners/partner-placeholder.png' },
      { name: 'Partner 2', logo: '/assets/partners/partner-placeholder.png' },
      { name: 'Partner 3', logo: '/assets/partners/partner-placeholder.png' },
      { name: 'Partner 4', logo: '/assets/partners/partner-placeholder.png' },
      { name: 'Partner 5', logo: '/assets/partners/partner-placeholder.png' },
    ],
  };
}

// ============================================================================
// FUNDACJA - Foundation projects
// ============================================================================

export function generateFundacjaProjects(count = 20) {
  const projects = [];

  for (let i = 0; i < count; i++) {
    projects.push({
      textPl: `Projekt ${i + 1}: Edukacja Muzyczna ${2020 + (i % 5)} - Program warsztatów i koncertów edukacyjnych dla młodzieży szkolnej, realizowany w ramach działalności statutowej fundacji. ${bioParagraph}`,
      textEn: `Project ${i + 1}: Music Education ${2020 + (i % 5)} - Workshop and educational concert program for school youth, implemented as part of the foundation's statutory activities.`,
      linkTextPl: i % 3 === 0 ? 'Więcej informacji' : null,
      linkTextEn: i % 3 === 0 ? 'More information' : null,
      linkUrl: i % 3 === 0 ? `https://example.com/project-${i + 1}` : null,
    });
  }

  return projects;
}

export function generateAccessibilityDeclaration(paragraphsCount = 15) {
  const paragraphs = [];

  for (let i = 0; i < paragraphsCount; i++) {
    paragraphs.push(`${i + 1}. ${bioParagraph}`);
  }

  return paragraphs;
}

// ============================================================================
// HOMEPAGE - Slides (usually fixed, but can be extended)
// ============================================================================

export function generateHomepageSlides(count = 8) {
  const slides = [];

  // Use real slide data as templates, cycling through them
  const templates = [
    {
      backgroundColor: '#FDFDFD',
      word: 'Trio',
      wordSvg: '/assets/slides/word-trio.svg',
      wordY: 446,
      wordHeight: 149,
      wordWidth: 49,
      tagline: 'specjalizujemy się w muzyce najnowszej',
      taglineX: 514,
      image: '/assets/slides/hero-1.webp',
      textColor: '#131313',
      lineColor: '#A0E38A',
      logoSrc: '/assets/logo.svg'
    },
    {
      backgroundColor: '#761FE0',
      word: 'Kompo',
      wordSvg: '/assets/slides/word-kompo.svg',
      wordY: 408,
      wordHeight: 185,
      wordWidth: 58,
      tagline: 'gramy wszystko i na wszystkim',
      taglineX: 612,
      image: '/assets/slides/hero-2.webp',
      textColor: '#FDFDFD',
      lineColor: '#A0E38A',
      logoSrc: '/assets/logo-white.svg'
    },
    {
      backgroundColor: '#34B898',
      word: 'Polex',
      wordSvg: '/assets/slides/word-polex.svg',
      wordY: 408,
      wordHeight: 185,
      wordWidth: 49,
      tagline: 'jesteśmy z Polski',
      taglineX: 741,
      image: '/assets/slides/hero-3.webp',
      textColor: '#131313',
      lineColor: '#01936F',
      logoSrc: '/assets/logo.svg'
    },
    {
      backgroundColor: '#FFBD19',
      word: 'Ensemble',
      wordSvg: '/assets/slides/word-ensemble.svg',
      wordY: 293,
      wordHeight: 299,
      wordWidth: 49,
      tagline: 'komponuje dla nas cały świat',
      taglineX: 622,
      image: '/assets/slides/hero-4.webp',
      textColor: '#131313',
      lineColor: '#5B5B5B',
      logoSrc: '/assets/logo.svg'
    },
  ];

  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    slides.push({
      id: i + 1,
      ...template,
      // Modify tagline slightly for each repeated slide
      tagline: i < templates.length ? template.tagline : `${template.tagline} (${Math.floor(i / templates.length) + 1})`,
    });
  }

  return slides;
}

// ============================================================================
// BIO ENSEMBLE - Extended bio page
// ============================================================================

export function generateBioEnsembleData(paragraphCount = 10) {
  const paragraphs = [];

  for (let i = 0; i < paragraphCount; i++) {
    // Vary paragraph lengths
    const baseParagraph = bioParagraph;
    const extended = i % 3 === 0
      ? `${baseParagraph} Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`
      : i % 3 === 1
        ? `${baseParagraph} Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.`
        : baseParagraph;

    paragraphs.push(`${i + 1}. ${extended}`);
  }

  return {
    title: 'Ensemble KOMPOPOLEX - Rozszerzona Historia Zespołu',
    extendedParagraphs: paragraphs,
    upcomingEvents: 'Najbliższe wydarzenia i koncerty',
  };
}

// ============================================================================
// Console info when enabled
// ============================================================================

if (isLargeTestMode) {
  console.log('%c🧪 LARGE TEST DATA MODE ENABLED', 'background: #ff9800; color: #000; padding: 8px 16px; font-size: 16px; font-weight: bold;');
  console.log('%cPages will display large amounts of test data for manual testing.', 'color: #ff9800;');
  console.log('%cSet VITE_LARGE_TEST_DATA=false in .env to disable.', 'color: #888;');
}
