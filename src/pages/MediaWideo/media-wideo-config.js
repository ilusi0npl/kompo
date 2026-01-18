// Media Wideo page configuration
// Based on Figma design: node 71-370

export const DESKTOP_WIDTH = 1440;
export const DESKTOP_HEIGHT = 1175;

// Vertical decorative lines - same positions, different color
export const desktopLinePositions = [155, 375, 595, 815, 1035, 1255];

// Line color for Media Wideo page (darker blue)
export const LINE_COLOR = 'var(--contrast-button-primary-hover)';

// Background color (light blue)
export const BACKGROUND_COLOR = '#73A1FE';

// Active tab color (purple)
export const ACTIVE_TAB_COLOR = 'var(--contrast-accent)';

// Videos configuration
export const videos = [
  {
    id: 1,
    thumbnail: '/assets/media-wideo/video1.jpg',
    title: 'Rafał Zapała - black serial MIDI music',
    youtubeUrl: 'https://www.youtube.com/watch?v=YBwiarivOio',
  },
  {
    id: 2,
    thumbnail: '/assets/media-wideo/video2.jpg',
    title: 'Michael Beil - Key Jane',
    youtubeUrl: 'https://www.youtube.com/watch?v=gDZOeN8r9jY',
  },
  {
    id: 3,
    thumbnail: '/assets/media-wideo/video3.jpg',
    title: "Viacheslav Kyrylov - I'm the real pig blood soaked fucking homecoming queen",
    youtubeUrl: 'https://www.youtube.com/watch?v=rd-vz7qARGo',
  },
  {
    id: 4,
    thumbnail: '/assets/media-wideo/video4.jpg',
    title: 'Marta Śniady - Body X Ultra: Limited Edition',
    youtubeUrl: 'https://www.youtube.com/watch?v=ayGAJlgoxP4',
  },
];
