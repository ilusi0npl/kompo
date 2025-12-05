import { BrowserRouter, Routes, Route } from 'react-router';
import Homepage from './pages/Homepage';
import Bio from './pages/Bio';
import Kalendarz from './pages/Kalendarz';
import Archiwalne from './pages/Archiwalne';
import Wydarzenie from './pages/Wydarzenie';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/bio" element={<Bio />} />
        <Route path="/kalendarz" element={<Kalendarz />} />
        <Route path="/archiwalne" element={<Archiwalne />} />
        <Route path="/wydarzenie/:id" element={<Wydarzenie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
