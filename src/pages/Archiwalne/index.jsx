import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopArchiwalne from './DesktopArchiwalne';
import MobileArchiwalne from './MobileArchiwalne';

export default function Archiwalne() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopArchiwalne />}
      mobileContent={<MobileArchiwalne />}
      desktopHeight={1792}
      mobileHeight={4000}
      backgroundColor="#FDFDFD"
      lineColor="#A0E38A"
    />
  );
}
