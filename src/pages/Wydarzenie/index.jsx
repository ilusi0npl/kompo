import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopWydarzenie from './DesktopWydarzenie';
import { DESKTOP_HEIGHT } from './wydarzenie-config';

export default function Wydarzenie() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopWydarzenie />}
      mobileContent={<DesktopWydarzenie />}
      desktopHeight={DESKTOP_HEIGHT}
      mobileHeight={DESKTOP_HEIGHT}
    />
  );
}
