import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopKalendarz from './DesktopKalendarz';

export default function Kalendarz() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopKalendarz />}
      mobileContent={<DesktopKalendarz />} // TODO: Mobile version
      desktopHeight={2008}
      mobileHeight={2008}
    />
  );
}
