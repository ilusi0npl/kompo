import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopArchiwalne from './DesktopArchiwalne';

export default function Archiwalne() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopArchiwalne />}
      mobileContent={<DesktopArchiwalne />} // TODO: Mobile version
      desktopHeight={1792}
      mobileHeight={1792}
    />
  );
}
