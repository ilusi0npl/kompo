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
