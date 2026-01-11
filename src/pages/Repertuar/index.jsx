import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopRepertuar from './DesktopRepertuar';
import MobileRepertuar from './MobileRepertuar';

export default function Repertuar() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopRepertuar />}
      mobileContent={<MobileRepertuar />}
      desktopHeight={2177}
      mobileHeight="auto"
      hideLines={true}
    />
  );
}
