import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopMediaWideo from './DesktopMediaWideo';

export default function MediaWideo() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopMediaWideo />}
      mobileContent={<DesktopMediaWideo />} // TODO: Mobile version
      desktopHeight={1175}
      mobileHeight={1175}
      backgroundColor="#73A1FE"
      lineColor="#3478FF"
    />
  );
}
