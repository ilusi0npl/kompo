import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopSpecjalne from './DesktopSpecjalne';
import MobileSpecjalne from './MobileSpecjalne';

export default function Specialne() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopSpecjalne />}
      mobileContent={<MobileSpecjalne />}
      desktopHeight={827}
      mobileHeight={1264}
      hideLines={true}
    />
  );
}
