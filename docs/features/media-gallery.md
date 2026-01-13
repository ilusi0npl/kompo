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

```javascript
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
```

**Assets:**
- Arrow icon: `/public/assets/media/arrow-right.svg`
- Left arrow uses CSS `transform: rotate(180deg)`
