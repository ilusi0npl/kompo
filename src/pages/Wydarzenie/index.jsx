import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopWydarzenie from './DesktopWydarzenie';
import MobileWydarzenie from './MobileWydarzenie';
import { DESKTOP_HEIGHT } from './wydarzenie-config';

export default function Wydarzenie() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopWydarzenie />}
      mobileContent={<MobileWydarzenie />}
      desktopHeight={DESKTOP_HEIGHT}
      mobileHeight={2200}
      backgroundColor="#FDFDFD"
      lineColor="#A0E38A"
      hideLines={true}
    />
  );
}
