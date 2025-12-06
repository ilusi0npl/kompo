import { BrowserRouter, Routes, Route } from 'react-router';
import { LanguageProvider } from './context/LanguageContext';
import Homepage from './pages/Homepage';
import Bio from './pages/Bio';
import Kalendarz from './pages/Kalendarz';
import Archiwalne from './pages/Archiwalne';
import Wydarzenie from './pages/Wydarzenie';
import Media from './pages/Media';
import MediaWideo from './pages/MediaWideo';
import Kontakt from './pages/Kontakt';
import TestMobileMenu from './pages/TestMobileMenu';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/bio" element={<Bio />} />
          <Route path="/media" element={<Media />} />
          <Route path="/media/wideo" element={<MediaWideo />} />
          <Route path="/kalendarz" element={<Kalendarz />} />
          <Route path="/archiwalne" element={<Archiwalne />} />
          <Route path="/wydarzenie/:id" element={<Wydarzenie />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/test-mobile-menu" element={<TestMobileMenu />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
