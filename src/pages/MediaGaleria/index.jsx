import { useParams, Navigate } from 'react-router';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopMediaGaleria from './DesktopMediaGaleria';
import MobileMediaGaleria from './MobileMediaGaleria';
import { getAlbumById } from '../Media/media-config';
import { useSanityPhotoAlbums } from '../../hooks/useSanityPhotoAlbums';

const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

export default function MediaGaleria() {
  const { id } = useParams();

  // Fetch from Sanity if enabled
  const { albums: sanityAlbums, loading, error } = useSanityPhotoAlbums();

  // Get album from Sanity or config
  let album;
  if (USE_SANITY && sanityAlbums) {
    // Find album by Sanity _id
    const sanityAlbum = sanityAlbums.find(a => a._id === id);
    if (sanityAlbum) {
      album = {
        id: sanityAlbum._id,
        image: sanityAlbum.thumbnailUrl,
        title: sanityAlbum.title,
        photographer: sanityAlbum.photographer,
        images: sanityAlbum.imageUrls || [],
      };
    }
  } else {
    // Use local config
    album = getAlbumById(id);
  }

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '16px',
          color: '#131313',
        }}
      >
        {t('common.loading.album')}
      </div>
    );
  }

  // Show error state only when using Sanity
  if (USE_SANITY && error) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '16px',
          color: '#FF0000',
        }}
      >
        Błąd ładowania albumu. Spróbuj ponownie później.
      </div>
    );
  }

  // Redirect if album not found
  if (!album) {
    return <Navigate to="/media" replace />;
  }

  return (
    <ResponsiveWrapper
      desktopContent={<DesktopMediaGaleria album={album} />}
      mobileContent={<MobileMediaGaleria album={album} />}
      desktopHeight="auto"
      mobileHeight="auto"
      backgroundColor="#34B898"
      lineColor="#01936F"
      hideLines={true}
    />
  );
}
