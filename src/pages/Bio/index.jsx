import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopBio from './DesktopBio';
import MobileBio from './MobileBio';
import { DESKTOP_HEIGHT, MOBILE_HEIGHT } from './bio-config';

export default function Bio() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopBio />}
      mobileContent={<MobileBio />}
      desktopHeight={DESKTOP_HEIGHT}
      mobileHeight={MOBILE_HEIGHT}
    />
  );
}
