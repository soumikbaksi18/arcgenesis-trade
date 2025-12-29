import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Markets } from './pages/Markets';
import { Portfolio } from './pages/Portfolio';
import { Trading } from './pages/Trading';
import { Strategies } from './pages/Strategies';
import { CreateStrategy } from './pages/CreateStrategy';
import { Navbar } from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/trading/spot" element={<Trading />} />
          <Route path="/trading/perps" element={<Trading />} />
          <Route path="/trading/options" element={<Trading />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/strategies/create" element={<CreateStrategy />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;