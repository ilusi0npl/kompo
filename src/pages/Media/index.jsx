import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopMedia from './DesktopMedia';

export default function Media() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopMedia />}
      mobileContent={<DesktopMedia />} // TODO: Mobile version
      desktopHeight={1043}
      mobileHeight={1043}
    />
  );
}
