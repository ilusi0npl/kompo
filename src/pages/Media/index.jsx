import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopMedia from './DesktopMedia';
import MobileMedia from './MobileMedia';

export default function Media() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopMedia />}
      mobileContent={<MobileMedia />}
      desktopHeight={1043}
      mobileHeight="auto"
      backgroundColor="#34B898"
      lineColor="#01936F"
      hideLines={true}
    />
  );
}
