import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopHomepage from './DesktopHomepage';
import MobileHomepage from './MobileHomepage';

export default function Homepage() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopHomepage />}
      mobileContent={<MobileHomepage />}
      desktopHeight={700}
      mobileHeight={683}
    />
  );
}
