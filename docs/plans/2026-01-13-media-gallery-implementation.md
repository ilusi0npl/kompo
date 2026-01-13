# Media Gallery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add photo gallery at `/media/galeria/:id` with arrow/keyboard/swipe navigation

**Architecture:** New MediaGaleria page components (Desktop/Mobile) with local state for photo navigation. Extend existing media-config.js with image arrays. Update Media grid to link to gallery.

**Tech Stack:** React, React Router, react-swipeable, existing ResponsiveWrapper/SmoothImage

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install react-swipeable**

```bash
npm install react-swipeable@^7.0.1
```

Expected: Package added to package.json and node_modules

**Step 2: Verify installation**

```bash
npm list react-swipeable
```

Expected: Shows `react-swipeable@7.x.x`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add react-swipeable for gallery swipe gestures

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Download Arrow Assets

**Files:**
- Create: `public/assets/media/arrow-right.svg`

**Step 1: Download arrow-right.svg from Figma**

```bash
curl -s "https://www.figma.com/api/mcp/asset/b39e51f5-6fee-4442-a2bf-3baf356878d4" \
  -o public/assets/media/arrow-right.svg
```

Expected: SVG file created

**Step 2: Verify file is valid SVG**

```bash
file public/assets/media/arrow-right.svg
head -5 public/assets/media/arrow-right.svg
```

Expected: File type shows "SVG Scalable Vector Graphics image" and content starts with `<svg`

**Step 3: Commit**

```bash
git add public/assets/media/arrow-right.svg
git commit -m "assets: add arrow-right.svg for gallery navigation

Downloaded from Figma design (node 208-446)
60x60px for desktop, 40x40px for mobile (CSS scaled)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Note:** We'll use CSS `transform: rotate(180deg)` for left arrow instead of separate asset

---

## Task 3: Extend media-config.js with Gallery Data

**Files:**
- Modify: `src/pages/Media/media-config.js`

**Step 1: Read current config**

```bash
cat src/pages/Media/media-config.js
```

Expected: See existing `photos` array with 6 items

**Step 2: Add images array to each photo object**

Add `images` array and `getAlbumById` helper at the end of file:

```javascript
// Add to each photo object in photos array:
images: [
  '/assets/media/photo1.jpg',  // Use cover as first image
  '/assets/media/photo1.jpg',  // Placeholder duplicates for now
  '/assets/media/photo1.jpg',
]

// At the end of file, after photos array:

// Helper to get album by ID
export const getAlbumById = (id) => {
  return photos.find(photo => photo.id === parseInt(id));
};
```

Full updated structure for first album:

```javascript
export const photos = [
  {
    id: 1,
    image: '/assets/media/photo1.jpg',
    title: 'Festiwal Klang',
    photographer: 'Alexander Banck-Petersen',
    images: [  // NEW
      '/assets/media/photo1.jpg',
      '/assets/media/photo1.jpg',
      '/assets/media/photo1.jpg',
    ]
  },
  // ... repeat for all 6 albums
];

// NEW - Helper function
export const getAlbumById = (id) => {
  return photos.find(photo => photo.id === parseInt(id));
};
```

**Step 3: Test in dev server**

```bash
npm run dev
```

Then in browser console (F12):
```javascript
import { getAlbumById } from './media-config.js'
getAlbumById(1)
```

Expected: Returns album object with `images` array

**Step 4: Commit**

```bash
git add src/pages/Media/media-config.js
git commit -m "feat: extend media config with gallery images

- Add images[] array to each album (3 placeholder photos each)
- Add getAlbumById() helper function
- Prepares data structure for gallery feature

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Update DesktopMedia to Link to Gallery

**Files:**
- Modify: `src/pages/Media/DesktopMedia.jsx:51-80` (photo rendering section)

**Step 1: Read current photo rendering**

```bash
sed -n '51,80p' src/pages/Media/DesktopMedia.jsx
```

Expected: See `SmoothImage` components without Links

**Step 2: Wrap each photo in Link**

Find the section where photos are rendered (around line 51-80) and wrap each `SmoothImage` in a `Link`:

```jsx
import { Link } from 'react-router';
// ... existing imports

{/* Replace photo rendering section with: */}
{gridPositions.map((pos, index) => {
  const photo = photos[index];
  if (!photo) return null;

  return (
    <Link
      key={photo.id}
      to={`/media/galeria/${photo.id}`}
      style={{
        position: 'absolute',
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        width: '310px',
        height: '310px',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      <SmoothImage
        src={photo.image}
        alt={photo.title}
        containerStyle={{
          width: '100%',
          height: '100%',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 50%',
        }}
        placeholderColor="#e5e5e5"
      />
    </Link>
  );
})}
```

**Step 3: Test in browser**

```bash
npm run dev
```

Visit http://localhost:5173/media

Expected: Clicking photos tries to navigate to `/media/galeria/1` (404 for now)

**Step 4: Commit**

```bash
git add src/pages/Media/DesktopMedia.jsx
git commit -m "feat: link desktop media grid to gallery

Wrap each photo in Link to /media/galeria/:id
Photos are now clickable and navigate to gallery view

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Update MobileMedia to Link to Gallery

**Files:**
- Modify: `src/pages/Media/MobileMedia.jsx` (photo rendering section)

**Step 1: Find photo rendering section**

```bash
grep -n "SmoothImage" src/pages/Media/MobileMedia.jsx
```

Expected: Line numbers where photos are rendered

**Step 2: Wrap photos in Link (same as desktop)**

Apply same pattern as Task 4:

```jsx
import { Link } from 'react-router';
// ... existing imports

{/* Wrap each photo in Link */}
{photos.map((photo, index) => {
  const pos = mobilePositions[index]; // Or however mobile positions work

  return (
    <Link
      key={photo.id}
      to={`/media/galeria/${photo.id}`}
      style={{
        // ... position styles
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      <SmoothImage
        src={photo.image}
        alt={photo.title}
        // ... existing props
      />
    </Link>
  );
})}
```

**Step 3: Test on mobile viewport**

```bash
npm run dev
```

Open DevTools → Responsive Mode → 390px width
Visit http://localhost:5173/media

Expected: Photos clickable, navigate to gallery

**Step 4: Commit**

```bash
git add src/pages/Media/MobileMedia.jsx
git commit -m "feat: link mobile media grid to gallery

Wrap each photo in Link to /media/galeria/:id
Mobile photos now navigate to gallery view

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Create MediaGaleria Index

**Files:**
- Create: `src/pages/MediaGaleria/index.jsx`

**Step 1: Create directory**

```bash
mkdir -p src/pages/MediaGaleria
```

**Step 2: Create index.jsx with ResponsiveWrapper**

```javascript
import { useParams, Navigate } from 'react-router';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopMediaGaleria from './DesktopMediaGaleria';
import MobileMediaGaleria from './MobileMediaGaleria';
import { getAlbumById } from '../Media/media-config';

export default function MediaGaleria() {
  const { id } = useParams();
  const album = getAlbumById(id);

  // Redirect if album not found
  if (!album) {
    return <Navigate to="/media" replace />;
  }

  return (
    <ResponsiveWrapper
      desktopContent={<DesktopMediaGaleria album={album} />}
      mobileContent={<MobileMediaGaleria album={album} />}
      desktopHeight={1043}
      mobileHeight={900}
      backgroundColor="#34B898"
      lineColor="#01936F"
      hideLines={true}
    />
  );
}
```

**Step 3: Create placeholder Desktop component**

```bash
echo "export default function DesktopMediaGaleria() { return <div>Desktop Gallery</div>; }" > src/pages/MediaGaleria/DesktopMediaGaleria.jsx
```

**Step 4: Create placeholder Mobile component**

```bash
echo "export default function MobileMediaGaleria() { return <div>Mobile Gallery</div>; }" > src/pages/MediaGaleria/MobileMediaGaleria.jsx
```

**Step 5: Add route to App.jsx**

Edit `src/App.jsx`:

```jsx
import MediaGaleria from './pages/MediaGaleria';

// In Routes:
<Route path="/media/galeria/:id" element={<MediaGaleria />} />
```

**Step 6: Test navigation**

```bash
npm run dev
```

Visit http://localhost:5173/media → click photo

Expected: See "Desktop Gallery" or "Mobile Gallery" text

**Step 7: Commit**

```bash
git add src/pages/MediaGaleria/index.jsx \
        src/pages/MediaGaleria/DesktopMediaGaleria.jsx \
        src/pages/MediaGaleria/MobileMediaGaleria.jsx \
        src/App.jsx
git commit -m "feat: add MediaGaleria page with routing

- Create MediaGaleria wrapper with ResponsiveWrapper
- Add route /media/galeria/:id
- Redirect to /media if album not found
- Add placeholder Desktop and Mobile components

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Implement DesktopMediaGaleria Component

**Files:**
- Modify: `src/pages/MediaGaleria/DesktopMediaGaleria.jsx`

**Step 1: Write complete Desktop component**

```javascript
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import Footer from '../../components/Footer/Footer';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import { useTranslation } from '../../hooks/useTranslation';

const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#01936F';
const BACKGROUND_COLOR = '#34B898';
const TEXT_COLOR = '#131313';

export default function DesktopMediaGaleria({ album }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Navigation handlers
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          navigate('/media');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, navigate]);

  // Preload next and previous images
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % album.images.length;
    const prevIndex = (currentIndex - 1 + album.images.length) % album.images.length;

    const nextImg = new Image();
    nextImg.src = album.images[nextIndex];

    const prevImg = new Image();
    prevImg.src = album.images[prevIndex];
  }, [currentIndex, album.images]);

  const currentImage = album.images[currentIndex];

  return (
    <section
      data-section="media-galeria"
      className="relative"
      style={{
        width: '1440px',
        height: '1043px',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Vertical lines */}
      {LINE_POSITIONS.map((x) => (
        <div
          key={x}
          className="absolute top-0"
          style={{
            left: `${x}px`,
            width: '1px',
            height: '100%',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Logo */}
      <Link
        to="/"
        className="absolute"
        style={{
          left: '185px',
          top: '76px',
          width: '149px',
          height: '60px',
        }}
      >
        <img
          src="/assets/logo.svg"
          alt="Kompopolex"
          style={{ width: '100%', height: '100%' }}
        />
      </Link>

      {/* "Zdjęcia" vertical text */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '94px',
          top: '180px',
          width: '45px',
          height: '269px',
        }}
      >
        <p
          style={{
            transform: 'rotate(90deg)',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '64px',
            lineHeight: 1.4,
            color: TEXT_COLOR,
          }}
        >
          Zdjęcia
        </p>
      </div>

      {/* Main photo */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(50% + 0.5px)',
          top: '180px',
          transform: 'translateX(-50%)',
          width: '631px',
          height: '447px',
        }}
      >
        <SmoothImage
          src={currentImage}
          alt={album.title}
          containerStyle={{ width: '100%', height: '100%' }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          placeholderColor="#e5e5e5"
        />
      </div>

      {/* Left arrow */}
      <button
        onClick={handlePrev}
        aria-label="Previous photo"
        style={{
          position: 'absolute',
          left: '315px',
          top: '374px',
          width: '60px',
          height: '60px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <img
          src="/assets/media/arrow-right.svg"
          alt="Previous"
          style={{
            width: '100%',
            height: '100%',
            transform: 'rotate(180deg)',
          }}
        />
      </button>

      {/* Right arrow */}
      <button
        onClick={handleNext}
        aria-label="Next photo"
        style={{
          position: 'absolute',
          left: '1066px',
          top: '374px',
          width: '60px',
          height: '60px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <img
          src="/assets/media/arrow-right.svg"
          alt="Next"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </button>

      {/* Title and credit */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(50% - 165px)',
          top: '643px',
          transform: 'translateX(-50%)',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          color: TEXT_COLOR,
        }}
      >
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: 1.45,
            textDecoration: 'underline',
            textTransform: 'uppercase',
          }}
        >
          {album.title}
        </p>
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: 1.48,
          }}
        >
          fot. {album.photographer}
        </p>
      </div>

      {/* Footer */}
      <Footer
        className="absolute"
        style={{
          bottom: '40px',
          left: 'calc(50% - 275px)',
          transform: 'translateX(-50%)',
          width: '520px',
        }}
      />

      {/* Right navigation menu */}
      <div
        className="absolute flex flex-col"
        style={{
          left: '1265px',
          top: '60px',
          width: '100px',
          gap: '279px',
        }}
      >
        <LanguageToggle />

        <nav
          className="flex flex-col"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: 1.48,
            color: TEXT_COLOR,
            gap: '22px',
          }}
        >
          <Link to="/bio" style={{ color: TEXT_COLOR, textDecoration: 'none' }}>Bio</Link>
          <Link to="/media" style={{ color: TEXT_COLOR, textDecoration: 'underline' }}>Media</Link>
          <Link to="/kalendarz" style={{ color: TEXT_COLOR, textDecoration: 'none' }}>Kalendarz</Link>
          <Link to="/repertuar" style={{ color: TEXT_COLOR, textDecoration: 'none' }}>Repertuar</Link>
          <Link to="/fundacja" style={{ color: TEXT_COLOR, textDecoration: 'none' }}>Fundacja</Link>
          <Link to="/kontakt" style={{ color: TEXT_COLOR, textDecoration: 'none' }}>Kontakt</Link>
        </nav>
      </div>
    </section>
  );
}
```

**Step 2: Test all features**

```bash
npm run dev
```

Visit http://localhost:5173/media → click photo

Test:
- ✅ Photo displays
- ✅ Left/right arrows work
- ✅ Keyboard arrows work
- ✅ ESC returns to /media
- ✅ Title and photographer display
- ✅ Cycling works (last → first, first → last)

**Step 3: Commit**

```bash
git add src/pages/MediaGaleria/DesktopMediaGaleria.jsx
git commit -m "feat: implement desktop gallery with full navigation

Features:
- Display 631x447px photo centered
- Left/right arrow buttons (60x60px)
- Keyboard navigation (←/→/ESC)
- Cyclic navigation through album
- Preload next/previous images
- Display title and photographer credit
- Full layout per Figma design (node 208-446)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Implement MobileMediaGaleria Component

**Files:**
- Modify: `src/pages/MediaGaleria/MobileMediaGaleria.jsx`

**Step 1: Write complete Mobile component with swipe**

```javascript
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useTranslation } from '../../hooks/useTranslation';

const MOBILE_WIDTH = 390;
const mobileLinePositions = [97, 195, 292];
const BACKGROUND_COLOR = '#34B898';
const LINE_COLOR = '#01936F';
const TEXT_COLOR = '#131313';

export default function MobileMediaGaleria({ album }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Navigation handlers
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

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  // Keyboard navigation (works on mobile browsers with keyboard)
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          navigate('/media');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, navigate]);

  // Preload next and previous images
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % album.images.length;
    const prevIndex = (currentIndex - 1 + album.images.length) % album.images.length;

    const nextImg = new Image();
    nextImg.src = album.images[nextIndex];

    const prevImg = new Image();
    prevImg.src = album.images[prevIndex];
  }, [currentIndex, album.images]);

  const currentImage = album.images[currentIndex];

  return (
    <section
      data-section="media-galeria-mobile"
      className="relative"
      style={{
        width: `${MOBILE_WIDTH}px`,
        minHeight: '900px',
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Vertical lines */}
      {mobileLinePositions.map((x) => (
        <div
          key={x}
          className="absolute"
          style={{
            left: `${x}px`,
            top: '-38px',
            width: '1px',
            height: '3863px',
            backgroundColor: LINE_COLOR,
          }}
        />
      ))}

      {/* Header */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '390px',
          height: '240px',
          backgroundColor: BACKGROUND_COLOR,
          overflow: 'clip',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            position: 'absolute',
            left: '20px',
            top: '40px',
            width: '104px',
            height: '42px',
          }}
        >
          <img
            src="/assets/logo.svg"
            alt="Kompopolex"
            style={{ width: '100%', height: '100%' }}
          />
        </Link>

        {/* MENU text */}
        <p
          style={{
            position: 'absolute',
            left: '312px',
            top: '43px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: 'normal',
            color: TEXT_COLOR,
          }}
        >
          MENU
        </p>

        {/* "Zdjęcia" title - horizontal, NOT rotated */}
        <p
          style={{
            position: 'absolute',
            left: '20px',
            top: '166px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: '48px',
            lineHeight: 1.1,
            color: TEXT_COLOR,
          }}
        >
          Zdjęcia
        </p>
      </div>

      {/* Title + Photo section */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '260px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Title and credit (before photo on mobile) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            color: TEXT_COLOR,
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: 1.45,
              textDecoration: 'underline',
              textTransform: 'uppercase',
            }}
          >
            {album.title}
          </p>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: 1.48,
            }}
          >
            fot. {album.photographer}
          </p>
        </div>

        {/* Photo with swipe */}
        <div
          {...swipeHandlers}
          style={{
            width: '350px',
            height: '250px',
          }}
        >
          <SmoothImage
            src={currentImage}
            alt={album.title}
            containerStyle={{ width: '100%', height: '100%' }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            placeholderColor="#e5e5e5"
          />
        </div>
      </div>

      {/* Navigation arrows */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '625px',
          width: '350px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left arrow */}
        <button
          onClick={handlePrev}
          aria-label="Previous photo"
          style={{
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <img
            src="/assets/media/arrow-right.svg"
            alt="Previous"
            style={{
              width: '100%',
              height: '100%',
              transform: 'rotate(180deg)',
            }}
          />
        </button>

        {/* Right arrow */}
        <button
          onClick={handleNext}
          aria-label="Next photo"
          style={{
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <img
            src="/assets/media/arrow-right.svg"
            alt="Next"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '39px',
          left: 'calc(25% + 18.5px)',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: 1.48,
          color: TEXT_COLOR,
          textTransform: 'uppercase',
        }}
      >
        <p>KOMPOPOLEX@GMAIL.COM</p>
        <p style={{ textDecoration: 'underline' }}>FACEBOOK</p>
        <p style={{ textDecoration: 'underline' }}>INSTAGRAM</p>
      </div>
    </section>
  );
}
```

**Step 2: Test on mobile viewport**

```bash
npm run dev
```

DevTools → Responsive Mode → 390px width
Visit http://localhost:5173/media → click photo

Test:
- ✅ Photo displays (350x250px)
- ✅ Title before photo (not after)
- ✅ Swipe left/right works
- ✅ Arrow buttons work
- ✅ "Zdjęcia" is horizontal (not rotated)

**Step 3: Commit**

```bash
git add src/pages/MediaGaleria/MobileMediaGaleria.jsx
git commit -m "feat: implement mobile gallery with swipe gestures

Features:
- Display 350x250px photo
- Title and credit before photo (mobile pattern)
- Swipe gestures for navigation (react-swipeable)
- Arrow buttons (40x40px)
- Keyboard navigation support
- Cyclic navigation and preloading
- Full layout per Figma design (node 208-671)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Manual Testing & Verification

**Files:**
- None (testing only)

**Step 1: Test all albums (desktop)**

```bash
npm run dev
```

Visit http://localhost:5173/media

Test each of 6 albums:
- Click each photo (1-6)
- Verify gallery opens with correct title/photographer
- Navigate with arrows
- Test keyboard (←/→/ESC)
- Verify cyclic navigation

**Step 2: Test all albums (mobile)**

DevTools → Responsive Mode → 390px

Test each album:
- Click photos
- Test swipe gestures
- Test arrow buttons
- Verify layout matches design

**Step 3: Test edge cases**

- Try invalid URL: http://localhost:5173/media/galeria/999
  - Expected: Redirects to /media
- Try empty album ID: http://localhost:5173/media/galeria/
  - Expected: 404 or redirect
- Rapid arrow clicking
  - Expected: No errors, smooth transitions

**Step 4: Visual verification**

Compare with Figma designs:
- Desktop: https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=208-446
- Mobile: https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=208-671

Check:
- ✅ Colors match (#34B898 background, #01936F lines)
- ✅ Spacing matches design
- ✅ Fonts and sizes correct
- ✅ Photo sizes correct (631x447 desktop, 350x250 mobile)

**Step 5: Performance check**

- Open DevTools → Network tab
- Navigate through gallery
- Verify preloading: next/prev images load in background
- Check for console errors

---

## Task 10: Update Documentation

**Files:**
- Create: `docs/features/media-gallery.md`

**Step 1: Document the feature**

```markdown
# Media Gallery

**Routes:**
- `/media` - Grid of 6 album covers
- `/media/galeria/:id` - Gallery view for album (id: 1-6)

**Components:**
- `MediaGaleria/` - Main wrapper with ResponsiveWrapper
- `DesktopMediaGaleria` - Desktop gallery (1440x1043px)
- `MobileMediaGaleria` - Mobile gallery (390px)

**Features:**
- Arrow navigation (60x60px desktop, 40x40px mobile)
- Keyboard shortcuts: ←/→ (navigate), ESC (exit)
- Swipe gestures on mobile (react-swipeable)
- Cyclic navigation (loops at edges)
- Image preloading for smooth transitions
- Invalid album ID redirects to /media

**Data Structure:**
Each album in `media-config.js` has:
- `id` - Album number (1-6)
- `image` - Cover photo for grid
- `title` - Album title
- `photographer` - Photo credit
- `images[]` - Array of gallery photos

**Adding Photos:**
Edit `src/pages/Media/media-config.js`:

\```javascript
{
  id: 1,
  title: 'Album Name',
  photographer: 'Photographer Name',
  images: [
    '/assets/media/album1/photo1.jpg',
    '/assets/media/album1/photo2.jpg',
    // Add more photos...
  ]
}
\```

**Assets:**
- Arrow icon: `/public/assets/media/arrow-right.svg`
- Left arrow uses CSS `transform: rotate(180deg)`
```

**Step 2: Commit**

```bash
git add docs/features/media-gallery.md
git commit -m "docs: add media gallery feature documentation

Document routes, components, features, and how to add photos

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Final Verification Checklist

**Desktop (1440px):**
- [  ] Gallery opens from grid click
- [  ] Photo displays centered (631x447px)
- [  ] Left arrow at (315px, 374px) works
- [  ] Right arrow at (1066px, 374px) works
- [  ] Keyboard ← → ESC work
- [  ] Title and credit display correctly
- [  ] Cyclic navigation works
- [  ] Logo links to home
- [  ] Footer displays at bottom
- [  ] Menu navigation works

**Mobile (390px):**
- [  ] Gallery opens from grid click
- [  ] Photo displays (350x250px)
- [  ] Title appears BEFORE photo
- [  ] Swipe left/right works
- [  ] Arrow buttons work (40x40px)
- [  ] "Zdjęcia" is horizontal (not rotated)
- [  ] Footer displays correctly

**All Albums:**
- [  ] Album 1 opens and navigates
- [  ] Album 2 opens and navigates
- [  ] Album 3 opens and navigates
- [  ] Album 4 opens and navigates
- [  ] Album 5 opens and navigates
- [  ] Album 6 opens and navigates

**Edge Cases:**
- [  ] Invalid ID redirects to /media
- [  ] Preloading works (no delays)
- [  ] No console errors
- [  ] Works in Chrome, Firefox, Safari

---

## Post-Implementation Tasks

**Optional enhancements (NOT in this plan):**
- Add photo counter "3/15"
- Add transition animations
- Add URL query params for direct photo link
- Add more real photos to albums (currently placeholders)
- Add lightbox zoom on click
- Add share button

**Maintenance:**
- Replace placeholder photos with real album photos
- Test with production data
- Monitor performance with many photos per album
