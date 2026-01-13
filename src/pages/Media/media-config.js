// Media page configuration
// Based on Figma design: node 21-242

export const DESKTOP_WIDTH = 1440;
export const DESKTOP_HEIGHT = 1080;

// Vertical decorative lines - same as other pages but with green color
export const desktopLinePositions = [155, 375, 595, 815, 1035, 1255];

// Line color for Media page (darker green)
export const LINE_COLOR = '#01936F';

// Background color
export const BACKGROUND_COLOR = '#34B898';

// Active tab color (purple)
export const ACTIVE_TAB_COLOR = '#761FE0';

// Photos grid configuration
// Row 1: photo1 (taniec), photo3 (rozmowa przy stole), photo5 (perkusja)
// Row 2: photo2 (laptop/klawisze), photo4 (kartki REINDEER), photo6 (akordeon)
export const photos = [
  {
    id: 1,
    image: '/assets/media/photo1.jpg',
    title: 'Festiwal Klang',
    photographer: 'Alexander Banck-Petersen',
    images: [
      '/assets/media/photo1.jpg',
      '/assets/media/photo1-2.jpg',
      '/assets/media/photo1.jpg',
    ],
  },
  {
    id: 2,
    image: '/assets/media/photo3.jpg',
    title: 'Nazwa wydarzenia',
    photographer: 'Wojciech Chrubasik',
    images: [
      '/assets/media/photo3.jpg',
      '/assets/media/photo3.jpg',
      '/assets/media/photo3.jpg',
    ],
  },
  {
    id: 3,
    image: '/assets/media/photo5.jpg',
    title: 'Nazwa konceru',
    photographer: 'Alexander Banck-Petersen',
    images: [
      '/assets/media/photo5.jpg',
      '/assets/media/photo5.jpg',
      '/assets/media/photo5.jpg',
    ],
  },
  {
    id: 4,
    image: '/assets/media/photo2.jpg',
    title: 'Festiwal Klang',
    photographer: 'Alexander Banck-Petersen',
    images: [
      '/assets/media/photo2.jpg',
      '/assets/media/photo2.jpg',
      '/assets/media/photo2.jpg',
    ],
  },
  {
    id: 5,
    image: '/assets/media/photo4.jpg',
    title: 'Nazwa wydarzenia',
    photographer: 'Wojciech Chrubasik',
    images: [
      '/assets/media/photo4.jpg',
      '/assets/media/photo4.jpg',
      '/assets/media/photo4.jpg',
    ],
  },
  {
    id: 6,
    image: '/assets/media/photo6.jpg',
    title: 'Nazwa konceru',
    photographer: 'Alexander Banck-Petersen',
    images: [
      '/assets/media/photo6.jpg',
      '/assets/media/photo6.jpg',
      '/assets/media/photo6.jpg',
    ],
  },
];

// Helper to get album by ID
export const getAlbumById = (id) => {
  return photos.find(photo => photo.id === parseInt(id));
};
