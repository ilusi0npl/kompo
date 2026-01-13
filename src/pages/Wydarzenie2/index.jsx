import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopWydarzenie2 from './DesktopWydarzenie2';
import MobileWydarzenie2 from './MobileWydarzenie2';
import { DESKTOP_HEIGHT } from './wydarzenie-config';

export default function Wydarzenie2() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopWydarzenie2 />}
      mobileContent={<MobileWydarzenie2 />}
      desktopHeight={DESKTOP_HEIGHT}
      mobileHeight={2500}
      backgroundColor="#FDFDFD"
      lineColor="#A0E38A"
      hideLines={true}
    />
  );
}
