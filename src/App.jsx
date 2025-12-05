import { BrowserRouter, Routes, Route } from 'react-router';
import Homepage from './pages/Homepage';
import Bio from './pages/Bio';
import Kalendarz from './pages/Kalendarz';
import Archiwalne from './pages/Archiwalne';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/bio" element={<Bio />} />
        <Route path="/kalendarz" element={<Kalendarz />} />
        <Route path="/archiwalne" element={<Archiwalne />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
