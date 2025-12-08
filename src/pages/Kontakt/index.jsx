import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopKontakt from './DesktopKontakt';
import MobileKontakt from './MobileKontakt';

export default function Kontakt() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopKontakt />}
      mobileContent={<MobileKontakt />}
      desktopHeight={847}
      mobileHeight={1250}
      backgroundColor="#FF734C"
      lineColor="#FFBD19"
    />
  );
}
