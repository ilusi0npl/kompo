/**
 * Predefined test scenarios for content edge cases
 * Each scenario represents a specific edge case to test
 */

import { generators, text, event, bioProfile, slide, photoAlbum, video, fundacjaPage, kontaktPage, composer, array } from './generators.js';

// ============================================
// EMPTY STATE - No data at all
// ============================================
export const empty = {
  events: [],
  upcomingEvents: [],
  archivedEvents: [],
  bioProfiles: [],
  slides: [],
  photoAlbums: [],
  videos: [],
  composers: [],
  fundacjaPage: null,
  kontaktPage: null,
};

// ============================================
// MINIMAL - Single elements, shortest possible content
// ============================================
export const minimal = {
  events: [
    event({
      titlePl: 'A',
      titleEn: 'A',
      performersPl: null,
      performersEn: null,
      program: null,
      descriptionPl: 'B',
      descriptionEn: 'B',
      locationPl: 'C',
      locationEn: 'C',
      partners: [],
      ticketUrl: null,
      showTicketButton: false,
    }),
  ],
  upcomingEvents: [
    event({
      titlePl: 'A',
      titleEn: 'A',
      descriptionPl: 'B',
      descriptionEn: 'B',
    }),
  ],
  archivedEvents: [],
  bioProfiles: [
    bioProfile({
      namePl: 'X',
      nameEn: 'X',
      paragraphsPl: ['Y'],
      paragraphsEn: ['Y'],
    }),
  ],
  slides: [
    slide({
      wordPl: 'K',
      wordEn: 'K',
      taglinePl: 'T',
      taglineEn: 'T',
    }),
  ],
  photoAlbums: [
    photoAlbum({
      titlePl: 'A',
      titleEn: 'A',
      photographer: 'P',
      imageUrls: ['/assets/single.jpg'],
    }),
  ],
  videos: [
    video({
      titlePl: 'V',
      titleEn: 'V',
      descriptionPl: null,
      descriptionEn: null,
    }),
  ],
  fundacjaPage: fundacjaPage(),
  kontaktPage: kontaktPage(),
};

// ============================================
// EXTREME LENGTH - Very long text content
// ============================================
export const extremeLength = {
  events: [
    event({
      titlePl: text.long(500),
      titleEn: text.long(500),
      performersPl: text.withNewlines(30),
      performersEn: text.withNewlines(30),
      descriptionPl: text.long(10000),
      descriptionEn: text.long(10000),
      locationPl: text.long(300),
      locationEn: text.long(300),
      program: Array(50).fill(null).map((_, i) => ({
        composer: `Composer ${i} with a very long name that goes on and on`,
        piece: `Piece ${i} - ${text.long(200)}`,
      })),
      partners: Array(20).fill(null).map((_, i) => ({
        name: `Partner ${i} with extremely long organization name`,
        logoUrl: '/assets/partner-logo.jpg',
      })),
    }),
  ],
  upcomingEvents: [
    event({
      titlePl: text.long(500),
      titleEn: text.long(500),
      descriptionPl: text.long(10000),
      descriptionEn: text.long(10000),
    }),
  ],
  archivedEvents: [],
  bioProfiles: [
    bioProfile({
      namePl: text.long(200),
      nameEn: text.long(200),
      paragraphsPl: Array(20).fill(null).map(() => text.long(2000)),
      paragraphsEn: Array(20).fill(null).map(() => text.long(2000)),
    }),
  ],
  slides: [
    slide({
      wordPl: text.long(100),
      wordEn: text.long(100),
      taglinePl: text.long(500),
      taglineEn: text.long(500),
    }),
  ],
  photoAlbums: [
    photoAlbum({
      titlePl: text.long(300),
      titleEn: text.long(300),
      photographer: text.long(100),
    }),
  ],
  videos: [
    video({
      titlePl: text.long(300),
      titleEn: text.long(300),
      descriptionPl: text.long(5000),
      descriptionEn: text.long(5000),
    }),
  ],
  fundacjaPage: fundacjaPage({
    projects: Array(20).fill(null).map((_, i) => ({
      textPl: text.long(1000),
      textEn: text.long(1000),
      linkTextPl: text.long(100),
      linkTextEn: text.long(100),
      linkUrl: 'https://example.com/project',
    })),
    accessibilityDeclarationPl: [text.long(3000), text.long(3000), text.long(3000)],
    accessibilityDeclarationEn: [text.long(3000), text.long(3000), text.long(3000)],
  }),
  kontaktPage: kontaktPage(),
};

// ============================================
// MASSIVE COUNT - Many elements
// ============================================
export const massiveCount = {
  events: array(event, 100),
  upcomingEvents: array(event, 50),
  archivedEvents: array((o) => event({ ...o, status: 'archived' }), 50),
  bioProfiles: array(bioProfile, 50),
  slides: array(slide, 30),
  photoAlbums: [
    photoAlbum({
      imageUrls: Array(200).fill('/assets/photo.jpg'),
    }),
    ...array(photoAlbum, 30),
  ],
  videos: array(video, 50),
  composers: array(composer, 100),
  fundacjaPage: fundacjaPage({
    projects: Array(50).fill(null).map((_, i) => ({
      textPl: `Projekt ${i}`,
      textEn: `Project ${i}`,
      linkTextPl: 'Link',
      linkTextEn: 'Link',
      linkUrl: `https://example.com/project-${i}`,
    })),
  }),
  kontaktPage: kontaktPage(),
};

// ============================================
// MISSING OPTIONAL - Optional fields are null/undefined
// ============================================
export const missingOptional = {
  events: [
    event({
      performersPl: null,
      performersEn: null,
      program: null,
      ticketUrl: null,
      showTicketButton: false,
      partners: [],
    }),
    event({
      performersPl: undefined,
      performersEn: undefined,
      program: [],
      partners: null,
    }),
  ],
  upcomingEvents: [
    event({
      performersPl: null,
      performersEn: null,
      program: null,
    }),
  ],
  archivedEvents: [],
  bioProfiles: [
    bioProfile({
      nameEn: null,
      paragraphsEn: null,
    }),
  ],
  slides: [
    slide({
      taglinePl: null,
      taglineEn: null,
    }),
  ],
  photoAlbums: [
    photoAlbum({
      titleEn: null,
    }),
  ],
  videos: [
    video({
      descriptionPl: null,
      descriptionEn: null,
      thumbnailUrl: null,
    }),
  ],
  fundacjaPage: fundacjaPage({
    projects: [
      {
        textPl: 'Projekt bez linku',
        textEn: 'Project without link',
        linkTextPl: null,
        linkTextEn: null,
        linkUrl: null,
      },
    ],
  }),
  kontaktPage: kontaktPage(),
};

// ============================================
// MISSING IMAGES - No image URLs
// ============================================
export const missingImages = {
  events: [
    event({ imageUrl: null }),
    event({ imageUrl: undefined }),
    event({ imageUrl: '' }),
  ],
  upcomingEvents: [event({ imageUrl: null })],
  archivedEvents: [],
  bioProfiles: [
    bioProfile({ imageUrl: null }),
    bioProfile({ imageUrl: '' }),
  ],
  slides: [
    slide({ imageUrl: null }),
    slide({ imageUrl: undefined }),
  ],
  photoAlbums: [
    photoAlbum({
      thumbnailUrl: null,
      imageUrls: [],
    }),
    photoAlbum({
      thumbnailUrl: '',
      imageUrls: [null, undefined, ''],
    }),
  ],
  videos: [
    video({ thumbnailUrl: null }),
  ],
  fundacjaPage: fundacjaPage(),
  kontaktPage: kontaktPage({
    teamImageUrl: null,
  }),
};

// ============================================
// SPECIAL CHARACTERS - XSS, HTML entities, Polish chars
// ============================================
export const specialChars = {
  events: [
    event({
      titlePl: '<script>alert("xss")</script>',
      titleEn: '<img src=x onerror=alert(1)>',
      descriptionPl: 'Test & "quotes" \'apostrophe\' <b>bold</b> ąęółńźżćś',
      descriptionEn: '"><script>alert("xss")</script>',
      locationPl: '   \n\t  whitespace  \n  ',
      locationEn: '<iframe src="evil.com"></iframe>',
    }),
  ],
  upcomingEvents: [
    event({
      titlePl: text.withSpecialChars(),
      titleEn: text.withSpecialChars(),
    }),
  ],
  archivedEvents: [],
  bioProfiles: [
    bioProfile({
      namePl: '"><img src=x onerror=alert(1)>',
      nameEn: '<script>document.cookie</script>',
      paragraphsPl: [
        'Line 1\n\nLine 2\n\n\n\nLine 3',
        text.withSpecialChars(),
        text.withPolishChars(),
      ],
      paragraphsEn: [
        '<div onclick="alert(1)">Click me</div>',
        'Normal text with <em>emphasis</em>',
      ],
    }),
  ],
  slides: [
    slide({
      wordPl: '<script>',
      wordEn: '</script>',
      taglinePl: text.withPolishChars(),
      taglineEn: '&lt;escaped&gt;',
    }),
  ],
  photoAlbums: [
    photoAlbum({
      titlePl: text.withSpecialChars(),
      titleEn: text.withSpecialChars(),
      photographer: '<script>alert("xss")</script>',
    }),
  ],
  videos: [
    video({
      titlePl: text.withPolishChars(),
      titleEn: text.withSpecialChars(),
    }),
  ],
  fundacjaPage: fundacjaPage({
    email: '<SCRIPT>ALERT(1)</SCRIPT>@EVIL.COM',
  }),
  kontaktPage: kontaktPage({
    email: '<SCRIPT>ALERT(1)</SCRIPT>@EVIL.COM',
  }),
};

// ============================================
// MIXED LANGUAGE - Missing or empty translations
// ============================================
export const mixedLanguage = {
  events: [
    event({ titleEn: null, descriptionEn: null, locationEn: null, performersEn: null }),
    event({ titlePl: null, descriptionPl: null, locationPl: null, performersPl: null }),
    event({ titlePl: 'PL only', titleEn: '' }),
    event({ titlePl: '', titleEn: 'EN only' }),
  ],
  upcomingEvents: [
    event({ titleEn: null, descriptionEn: null }),
  ],
  archivedEvents: [
    event({ titlePl: null, descriptionPl: null, status: 'archived' }),
  ],
  bioProfiles: [
    bioProfile({ nameEn: null, paragraphsEn: null }),
    bioProfile({ namePl: null, paragraphsPl: null }),
    bioProfile({ paragraphsEn: [] }),
    bioProfile({ paragraphsPl: [], paragraphsEn: ['Only EN content'] }),
  ],
  slides: [
    slide({ wordEn: null, taglineEn: null }),
    slide({ wordPl: '', taglinePl: '' }),
  ],
  photoAlbums: [
    photoAlbum({ titleEn: null }),
    photoAlbum({ titlePl: null }),
  ],
  videos: [
    video({ titleEn: null, descriptionEn: null }),
  ],
  fundacjaPage: fundacjaPage({
    accessibilityDeclarationEn: null,
    projects: [
      { textPl: 'Tylko PL', textEn: null, linkTextPl: 'Link', linkTextEn: null, linkUrl: null },
    ],
  }),
  kontaktPage: kontaktPage(),
};

// ============================================
// DATES - Various date edge cases
// ============================================
export const dateEdgeCases = {
  events: [
    event({ date: new Date('1999-01-01').toISOString() }), // Past
    event({ date: new Date('2099-12-31').toISOString() }), // Far future
    event({ date: null }), // No date
    event({ date: 'invalid-date' }), // Invalid format
    event({ date: new Date().toISOString() }), // Today
  ],
  upcomingEvents: [
    event({ date: new Date('2099-12-31').toISOString() }),
  ],
  archivedEvents: [
    event({ date: new Date('1999-01-01').toISOString(), status: 'archived' }),
  ],
  bioProfiles: [bioProfile()],
  slides: [slide()],
  photoAlbums: [photoAlbum()],
  videos: [video()],
  fundacjaPage: fundacjaPage(),
  kontaktPage: kontaktPage(),
};

// ============================================
// EXPORT ALL SCENARIOS
// ============================================
export const scenarios = {
  empty,
  minimal,
  extremeLength,
  massiveCount,
  missingOptional,
  missingImages,
  specialChars,
  mixedLanguage,
  dateEdgeCases,
};

export default scenarios;
