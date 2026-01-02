import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Trading } from './pages/Trading';
import { Strategies } from './pages/Strategies';
import { CreateStrategy } from './pages/CreateStrategy';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Router>
        <Navbar />
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Home />} />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="/portfolio" 
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trading" 
            element={
              <ProtectedRoute>
                <Trading />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trading/spot" 
            element={
              <ProtectedRoute>
                <Trading />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trading/perps" 
            element={
              <ProtectedRoute>
                <Trading />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trading/options" 
            element={
              <ProtectedRoute>
                <Trading />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/strategies" 
            element={
              <ProtectedRoute>
                <Strategies />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/strategies/create" 
            element={
              <ProtectedRoute>
                <CreateStrategy />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
