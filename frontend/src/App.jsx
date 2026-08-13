import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SimulatorIndexPage from './pages/SimulatorIndexPage';
import ProblemPage from './pages/ProblemPage';

function App() {
  const year = new Date().getFullYear();

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <div>
            <p className="eyebrow">Laboratorio de polarización</p>
            <h1 className="site-title">Cátedra Física II · UTN FRRe</h1>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulador" element={<SimulatorIndexPage />} />
          <Route path="/simulador/:problemId" element={<ProblemPage />} />
        </Routes>

        <footer className="site-footer">
          <div className="footer-block">
            <p className="footer-label">Alumno</p>
            <p className="footer-text">Fernández, Juan Carlos</p>
          </div>

          <div className="footer-block">
            <p className="footer-label">Cátedra</p>
            <p className="footer-text">Física II · Unidad Temática 14 · Polarización · UTN FRRe · {year}</p>
          </div>

          <span className="footer-version">v1.0</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
