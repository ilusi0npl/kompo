import { BrowserRouter, Routes, Route } from 'react-router';
import { LanguageProvider } from './context/LanguageContext';
import { AriaLiveProvider } from './components/AriaLiveAnnouncer/AriaLiveAnnouncer';
import SkipLink from './components/SkipLink/SkipLink';
import Homepage from './pages/Homepage';
import Bio from './pages/Bio';
import BioEnsemble from './pages/BioEnsemble';
import Kalendarz from './pages/Kalendarz';
import Archiwalne from './pages/Archiwalne';
import Wydarzenie from './pages/Wydarzenie';
import Wydarzenie2 from './pages/Wydarzenie2';
import Media from './pages/Media';
import MediaWideo from './pages/MediaWideo';
import MediaGaleria from './pages/MediaGaleria';
import Kontakt from './pages/Kontakt';
import Repertuar from './pages/Repertuar';
import Specialne from './pages/Specialne';
import Fundacja from './pages/Fundacja';

function App() {
  return (
    <LanguageProvider>
      <AriaLiveProvider>
        <BrowserRouter>
          <SkipLink />
        <main id="main-content">
          <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/bio" element={<Bio />} />
          <Route path="/bio/ensemble" element={<BioEnsemble />} />
          <Route path="/media" element={<Media />} />
          <Route path="/media/wideo" element={<MediaWideo />} />
          <Route path="/media/galeria/:id" element={<MediaGaleria />} />
          <Route path="/kalendarz" element={<Kalendarz />} />
          <Route path="/archiwalne" element={<Archiwalne />} />
          <Route path="/wydarzenie/2" element={<Wydarzenie2 />} />
          <Route path="/wydarzenie/:id" element={<Wydarzenie />} />
          <Route path="/repertuar" element={<Repertuar />} />
          <Route path="/specialne" element={<Specialne />} />
          <Route path="/fundacja" element={<Fundacja />} />
          <Route path="/kontakt" element={<Kontakt />} />
          </Routes>
          </main>
        </BrowserRouter>
      </AriaLiveProvider>
    </LanguageProvider>
  );
}

export default App;
