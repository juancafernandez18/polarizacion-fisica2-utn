import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SimulatorIndexPage from './pages/SimulatorIndexPage';
import ProblemPage from './pages/ProblemPage';

function App() {
  const year = new Date().getFullYear();

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <Link to="/" className="brand">
            <span className="brand-mark">
              <svg viewBox="0 0 24 24" fill="none" role="img" aria-hidden="true">
                <path d="M2 13c2-6 4-6 5-3s3 3 5 0 3-9 5-3 3 6 5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>
              <p className="brand-name">PolarLab</p>
              <p className="brand-subtitle">Física II</p>
            </span>
          </Link>

          <div className="header-catedra">
            <p className="eyebrow">Laboratorio de polarización</p>
            <h1 className="site-title">Cátedra Física II · UTN FRRe</h1>
          </div>

          <Link to="/simulador" className="btn btn-primary header-cta">Ir al simulador</Link>
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
