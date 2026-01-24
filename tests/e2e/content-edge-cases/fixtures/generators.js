/**
 * Data generators for content edge case testing
 * Creates mock data with controllable parameters for testing various scenarios
 */

let idCounter = 0;
const generateId = (prefix = 'mock') => `${prefix}-${++idCounter}-${Date.now()}`;

// ============================================
// TEXT GENERATORS
// ============================================
export const text = {
  /**
   * Generate short text of specified length
   */
  short: (chars = 10) => 'A'.repeat(chars),

  /**
   * Generate long lorem ipsum text
   */
  long: (chars = 5000) => {
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. ';
    return lorem.repeat(Math.ceil(chars / lorem.length)).slice(0, chars);
  },

  /**
   * Generate text with multiple paragraphs (newline separated)
   */
  withNewlines: (lines = 10) => {
    return Array(lines)
      .fill(null)
      .map((_, i) => `Paragraph ${i + 1}. This is sample text content for testing purposes.`)
      .join('\n\n');
  },

  /**
   * Generate text with special characters and potential XSS
   */
  withSpecialChars: () => 'Test <script>alert("xss")</script> & "quotes" \'apostrophe\' <b>bold</b>',

  /**
   * Generate text with Polish special characters
   */
  withPolishChars: () => 'Zażółć gęślą jaźń ĄĘÓŁŃŹŻĆŚ',

  /**
   * Empty string
   */
  empty: () => '',

  /**
   * Whitespace only
   */
  whitespace: () => '   \n\t   ',
};

// ============================================
// EVENT GENERATOR
// ============================================
export const event = (overrides = {}) => ({
  _id: overrides._id || generateId('event'),
  titlePl: 'Koncert testowy',
  titleEn: 'Test Concert',
  date: new Date().toISOString(),
  performersPl: 'Wykonawcy testowi',
  performersEn: 'Test Performers',
  program: [
    { composer: 'J.S. Bach', piece: 'Toccata i fuga d-moll' },
  ],
  descriptionPl: 'Opis wydarzenia testowego w języku polskim.',
  descriptionEn: 'Test event description in English.',
  locationPl: 'Filharmonia Narodowa, Warszawa',
  locationEn: 'National Philharmonic, Warsaw',
  imageUrl: '/assets/placeholder-event.jpg',
  ticketUrl: 'https://tickets.example.com',
  showTicketButton: true,
  partners: [],
  status: 'upcoming',
  publishedAt: new Date().toISOString(),
  ...overrides,
});

// ============================================
// BIO PROFILE GENERATOR
// ============================================
export const bioProfile = (overrides = {}) => ({
  _id: overrides._id || generateId('bio'),
  namePl: 'Jan Kowalski',
  nameEn: 'John Smith',
  imageUrl: '/assets/placeholder-bio.jpg',
  paragraphsPl: [
    'Pierwszy paragraf biografii w języku polskim.',
    'Drugi paragraf z dodatkowymi informacjami.',
  ],
  paragraphsEn: [
    'First paragraph of biography in English.',
    'Second paragraph with additional information.',
  ],
  publishedAt: new Date().toISOString(),
  ...overrides,
});

// ============================================
// HOMEPAGE SLIDE GENERATOR
// ============================================
export const slide = (overrides = {}) => ({
  _id: overrides._id || generateId('slide'),
  wordPl: 'Trio',
  wordEn: 'Trio',
  taglinePl: 'Tagline po polsku',
  taglineEn: 'Tagline in English',
  imageUrl: '/assets/placeholder-slide.jpg',
  publishedAt: new Date().toISOString(),
  ...overrides,
});

// ============================================
// PHOTO ALBUM GENERATOR
// ============================================
export const photoAlbum = (overrides = {}) => ({
  _id: overrides._id || generateId('album'),
  titlePl: 'Album testowy',
  titleEn: 'Test Album',
  photographer: 'Jan Fotograf',
  thumbnailUrl: '/assets/placeholder-thumbnail.jpg',
  imageUrls: [
    '/assets/photo-1.jpg',
    '/assets/photo-2.jpg',
    '/assets/photo-3.jpg',
  ],
  publishedAt: new Date().toISOString(),
  ...overrides,
});

// ============================================
// VIDEO GENERATOR
// ============================================
export const video = (overrides = {}) => ({
  _id: overrides._id || generateId('video'),
  titlePl: 'Wideo testowe',
  titleEn: 'Test Video',
  descriptionPl: 'Opis wideo',
  descriptionEn: 'Video description',
  type: 'video',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  thumbnailUrl: '/assets/placeholder-video.jpg',
  publishedAt: new Date().toISOString(),
  ...overrides,
});

// ============================================
// FUNDACJA PAGE GENERATOR (singleton)
// ============================================
export const fundacjaPage = (overrides = {}) => ({
  _id: 'fundacjaPage',
  krs: '0000123456',
  regon: '123456789',
  nip: '1234567890',
  bankAccount: 'PL12 3456 7890 1234 5678 9012 3456',
  email: 'KONTAKT@FUNDACJA.PL',
  projects: [
    {
      textPl: 'Projekt testowy',
      textEn: 'Test project',
      linkTextPl: 'Zobacz więcej',
      linkTextEn: 'See more',
      linkUrl: 'https://example.com/project',
    },
  ],
  accessibilityDeclarationPl: [
    'Paragraf 1 deklaracji dostępności.',
    'Paragraf 2 deklaracji dostępności.',
    'Paragraf 3 deklaracji dostępności.',
  ],
  accessibilityDeclarationEn: [
    'Accessibility declaration paragraph 1.',
    'Accessibility declaration paragraph 2.',
    'Accessibility declaration paragraph 3.',
  ],
  publishedAt: new Date().toISOString(),
  ...overrides,
});

// ============================================
// KONTAKT PAGE GENERATOR (singleton)
// ============================================
export const kontaktPage = (overrides = {}) => ({
  _id: 'kontaktPage',
  email: 'KONTAKT@EXAMPLE.COM',
  teamImageUrl: '/assets/placeholder-team.jpg',
  publishedAt: new Date().toISOString(),
  ...overrides,
});

// ============================================
// COMPOSER GENERATOR
// ============================================
export const composer = (overrides = {}) => ({
  _id: overrides._id || generateId('composer'),
  name: 'Johann Sebastian Bach',
  year: '(1685-1750)',
  works: [
    { title: 'Toccata i fuga d-moll', isSpecial: false },
    { title: 'Koncert brandenburski nr 3', isSpecial: false },
  ],
  category: 'repertuar',
  publishedAt: new Date().toISOString(),
  ...overrides,
});

// ============================================
// HELPER: Generate array of items
// ============================================
export const array = (generator, count, baseOverrides = {}) => {
  return Array.from({ length: count }, (_, index) =>
    generator({
      _id: `${baseOverrides._id || 'item'}-${index}`,
      ...baseOverrides,
    })
  );
};

// ============================================
// EXPORT ALL GENERATORS
// ============================================
export const generators = {
  text,
  event,
  bioProfile,
  slide,
  photoAlbum,
  video,
  fundacjaPage,
  kontaktPage,
  composer,
  array,
};

export default generators;
