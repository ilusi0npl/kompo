# Media Gallery Design

**Date:** 2026-01-13
**Feature:** Photo gallery with navigation and swipe support
**Figma:** Desktop [208-446](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=208-446), Mobile [208-671](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=208-671)

## Overview

Add photo gallery functionality to `/media` page. Users click album covers in grid (6 items) to open full-screen gallery at `/media/galeria/:id` with navigation arrows and keyboard/swipe support.

## Architecture

### Routing

```
/media                    → Media page (existing, grid of 6 albums)
/media/galeria/:id        → Gallery view (new, :id = 1-6)
```

**URL Structure:**
- `:id` refers to album number (1-6), not individual photo
- Navigation within album managed by local state (`currentIndex`)
- Optional: query param for direct photo link: `/media/galeria/1?photo=5`

### File Structure

```
src/pages/
├── Media/                          # Existing
│   ├── index.jsx                   # Update: add Links to gallery
│   ├── DesktopMedia.jsx            # Update: wrap photos in <Link>
│   ├── MobileMedia.jsx             # Update: wrap photos in <Link>
│   └── media-config.js             # Update: add images[] array
└── MediaGaleria/                   # NEW
    ├── index.jsx                   # Wrapper with ResponsiveWrapper
    ├── DesktopMediaGaleria.jsx     # Desktop gallery (1440x1043px)
    └── MobileMediaGaleria.jsx      # Mobile gallery (390px)
```

### Dependencies

```json
{
  "react-swipeable": "^7.0.1"
}
```

## Data Structure

### Extended media-config.js

```javascript
export const photos = [
  {
    id: 1,
    image: '/assets/media/photo1.jpg',      // Cover image for grid
    title: 'Festiwal Klang',
    photographer: 'Alexander Banck-Petersen',
    images: [                                 // NEW - gallery photos
      '/assets/media/klang/img1.jpg',
      '/assets/media/klang/img2.jpg',
      '/assets/media/klang/img3.jpg',
      // ... more photos
    ]
  },
  // ... 5 more albums
];

// Helper function
export const getAlbumById = (id) => {
  return photos.find(photo => photo.id === parseInt(id));
};
```

**Key Points:**
- Each album has cover (`image`) + gallery (`images[]`)
- Grid shows covers, clicking opens first photo of album
- Gallery navigation cycles through `images[]` array

## UI Specifications

### Desktop (1440x1043px)

**Layout:**
- Background: `#34B898` (green)
- Vertical lines: `#01936F` at x = [155, 375, 595, 815, 1035, 1255]
- Logo: top-left (185px, 76px) - 149x60px
- "Zdjęcia" vertical text: left (94px, 180px) - rotated 90°, 64px font

**Photo Display:**
- Size: 631x447px
- Position: centered horizontally, top: 180px
- Object-fit: cover

**Navigation Arrows:**
- Size: 60x60px
- Left arrow: (315px, 374px)
- Right arrow: (1066px, 374px)
- Transparent background, SVG icons
- Hover: cursor pointer

**Title & Credit:**
- Position: centered, top: 643px, width: 300px
- Title: 24px SemiBold, underlined, uppercase, `#131313`
- Credit: 16px Medium, "fot. {photographer}", `#131313`
- Gap: 8px

**Footer:**
- Position: bottom 40px, centered (calc(50% - 275px))
- Same as other pages: email + social links

### Mobile (390px)

**Layout:**
- Background: `#34B898`
- Vertical lines: `#01936F` at x = [97, 195, 292]
- Header: 240px height
  - Logo: (20px, 40px) - 104x42px
  - MENU: top-right (312px, 43px)
  - "Zdjęcia": (20px, 166px) - 48px, NOT rotated

**Content (top: 260px, left: 20px):**
- Title + Credit (same style as desktop)
- Gap: 24px
- Photo: 350x250px
- Gap: 8px between title and credit

**Navigation Arrows:**
- Position: top: 625px, width: 350px
- Size: 40x40px (smaller than desktop)
- Flex: space-between
- Same SVG icons as desktop

**Footer:**
- Position: bottom 39px, left: calc(25% + 18.5px)
- Vertical layout (flex-col), gap: 20px

## Functionality

### Navigation

**Arrows:**
- Left (←): previous photo
- Right (→): next photo
- Cyclic: last → first, first → last

**Keyboard (desktop + mobile):**
- Arrow Left: previous
- Arrow Right: next
- Escape: back to `/media`

**Swipe (mobile only):**
- Swipe left: next photo
- Swipe right: previous photo
- Library: `react-swipeable`
- Prevent scroll on swipe

### State Management

```jsx
const [currentIndex, setCurrentIndex] = useState(0);

const handlePrev = () => {
  setCurrentIndex(prev =>
    prev === 0 ? album.images.length - 1 : prev - 1
  );
};

const handleNext = () => {
  setCurrentIndex(prev =>
    prev === album.images.length - 1 ? 0 : prev + 1
  );
};
```

### Performance Optimizations

**Preloading:**
```jsx
useEffect(() => {
  const nextIndex = (currentIndex + 1) % album.images.length;
  const prevIndex = (currentIndex - 1 + album.images.length) % album.images.length;

  const nextImg = new Image();
  nextImg.src = album.images[nextIndex];

  const prevImg = new Image();
  prevImg.src = album.images[prevIndex];
}, [currentIndex, album.images]);
```

Preload next and previous images in background for instant transitions.

### Error Handling

**Invalid album ID:**
```jsx
const album = getAlbumById(id);
if (!album) {
  return <Navigate to="/media" replace />;
}
```

**Empty images array:**
- Show placeholder or redirect
- Validate data in config

## Assets

**Arrow Icons:**
- Desktop: 60x60px
- Mobile: 40x40px
- Format: SVG
- Location: `/public/assets/media/`
  - `arrow-right.svg`
  - `arrow-left.svg` (or use CSS `transform: rotate(180deg)`)

**Figma URLs (7-day expiry):**
- Right arrow: `https://www.figma.com/api/mcp/asset/b39e51f5-6fee-4442-a2bf-3baf356878d4`
- Left arrow: use rotation or separate asset

## Implementation Steps

1. **Data setup:**
   - Extend `media-config.js` with `images[]` arrays
   - Add `getAlbumById()` helper
   - Add sample photos for each album

2. **Update existing Media page:**
   - Wrap grid photos in `<Link to={/media/galeria/${photo.id}}>`
   - Update both Desktop and Mobile components

3. **Create MediaGaleria components:**
   - index.jsx (ResponsiveWrapper)
   - DesktopMediaGaleria.jsx
   - MobileMediaGaleria.jsx

4. **Add route:**
   - `<Route path="/media/galeria/:id" element={<MediaGaleria />} />`

5. **Download assets:**
   - arrow-right.svg, arrow-left.svg

6. **Install dependencies:**
   - `npm install react-swipeable`

7. **Testing:**
   - All 6 albums open correctly
   - Navigation cycles properly
   - Keyboard shortcuts work
   - Swipe works on mobile
   - Preloading improves performance
   - Back navigation returns to grid

## Design Colors

- Background: `#34B898` (green)
- Lines: `#01936F` (dark green)
- Text: `#131313` (dark gray)
- Fonts: IBM Plex Mono (SemiBold 600, Medium 500, Bold 700)

## Future Enhancements (Not in MVP)

- Photo counter: "3/15"
- Transition animations: fade or slide
- Lightbox zoom on click
- Share functionality
- Direct photo URLs with query params
