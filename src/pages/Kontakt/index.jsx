import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopKontakt from './DesktopKontakt';

export default function Kontakt() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopKontakt />}
      mobileContent={<DesktopKontakt />} // TODO: Mobile version
      desktopHeight={847}
      mobileHeight={847}
      backgroundColor="#FF734C"
      lineColor="#FFBD19"
    />
  );
}
