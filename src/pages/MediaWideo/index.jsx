import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopMediaWideo from './DesktopMediaWideo';
import MobileMediaWideo from './MobileMediaWideo';

export default function MediaWideo() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopMediaWideo />}
      mobileContent={<MobileMediaWideo />}
      desktopHeight={1175}
      mobileHeight="auto"
      backgroundColor="#73A1FE"
      lineColor="#3478FF"
    />
  );
}
