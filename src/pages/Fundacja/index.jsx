import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopFundacja from './DesktopFundacja';
import MobileFundacja from './MobileFundacja';

export default function Fundacja() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopFundacja />}
      mobileContent={<MobileFundacja />}
      desktopHeight="auto"
      mobileHeight="auto"
      backgroundColor="#34B898"
      lineColor="#01936F"
    />
  );
}
