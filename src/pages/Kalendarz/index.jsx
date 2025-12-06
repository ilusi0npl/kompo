import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopKalendarz from './DesktopKalendarz';
import MobileKalendarz from './MobileKalendarz';

export default function Kalendarz() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopKalendarz />}
      mobileContent={<MobileKalendarz />}
      desktopHeight={2008}
      mobileHeight="auto"
      backgroundColor="#FDFDFD"
      lineColor="#A0E38A"
    />
  );
}
