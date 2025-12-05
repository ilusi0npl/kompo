import BackgroundLines from '../../components/BackgroundLines/BackgroundLines';
import HeroSection from './HeroSection';

export default function Homepage() {
  return (
    <div
      className="relative"
      style={{
        width: '1440px',
        backgroundColor: '#FDFDFD'
      }}
    >
      {/* Wspólne tło z liniami dla całej strony */}
      <BackgroundLines />

      {/* Sekcje strony */}
      <div className="relative" style={{ zIndex: 1 }}>
        <HeroSection />
      </div>
    </div>
  );
}
