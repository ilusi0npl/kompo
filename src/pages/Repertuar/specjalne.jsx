import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopRepertuarSpecjalne from './DesktopRepertuarSpecjalne';
import MobileRepertuarSpecjalne from './MobileRepertuarSpecjalne';

export default function RepertuarSpecjalne() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopRepertuarSpecjalne />}
      mobileContent={<MobileRepertuarSpecjalne />}
      desktopHeight={2177}
      mobileHeight="auto"
      hideLines={true}
    />
  );
}
