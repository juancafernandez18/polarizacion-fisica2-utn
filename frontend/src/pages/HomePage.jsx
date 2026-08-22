import PolarizationHeroIllustration from '../components/PolarizationHeroIllustration';

// Íconos de línea minimalistas, propios de la Home (24×24, trazo currentColor).
// No se extraen a un archivo aparte todavía: solo se usan acá.
const icons = {
  atom: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="9" ry="3.4" stroke="currentColor" strokeWidth="1.8" transform="rotate(0 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.4" stroke="currentColor" strokeWidth="1.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.4" stroke="currentColor" strokeWidth="1.8" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5c2-1 5-1 8 .5 3-1.5 6-1.5 8-.5v13c-2-1-5-1-8 .5-3-1.5-6-1.5-8-.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 6v13" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  wave: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 14c1.8-5 3.6-5 5.4 0s3.6 5 5.4 0 3.6-5 5.4 0 3.6 5 3.8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sliders: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 20V13M5 9V4M12 20v-4M12 12V4M19 20v-7M19 9V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="5" cy="11" r="1.8" fill="currentColor" />
      <circle cx="12" cy="14" r="1.8" fill="currentColor" />
      <circle cx="19" cy="11" r="1.8" fill="currentColor" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12c2.4-4.5 6-7 10-7s7.6 2.5 10 7c-2.4 4.5-6 7-10 7s-7.6-2.5-10-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  graduation: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 9l10-4 10 4-10 4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M6 11v5c0 1.4 2.7 3 6 3s6-1.6 6-3v-5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M21 9.5V16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

const features = [
  { icon: 'wave', title: 'Fenómenos reales', description: 'Comprendé conceptos de polarización mediante representaciones visuales.' },
  { icon: 'sliders', title: 'Interacción dinámica', description: 'Modificá parámetros y observá cómo cambian los resultados.' },
  { icon: 'eye', title: 'Visualización intuitiva', description: 'Gráficos y animaciones que facilitan la comprensión.' },
  { icon: 'graduation', title: 'Aprendizaje guiado', description: 'Explicaciones y desarrollos pensados para Física II.' }
];

const concepts = ['Polarización lineal', 'Polarización por reflexión', 'Ley de Brewster', 'Ley de Malus'];

function HomePage() {
  return (
    <main className="page home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-badge">PolarLab · Física II</p>
          <h1>
            Explorá la <span className="text-gradient">polarización</span><br />
            de la <span className="text-gradient">luz</span>
          </h1>
          <p className="lead">
            Laboratorio virtual interactivo para comprender los fenómenos de polarización,
            visualizar conceptos clave y experimentar con modelos físicos.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/simulador">
              <span className="btn-icon">{icons.atom}</span>
              Ir al simulador
            </a>
            <a className="btn btn-secondary" href="#explorar">
              <span className="btn-icon">{icons.book}</span>
              Explorar teoría
            </a>
          </div>
        </div>

        <PolarizationHeroIllustration />
      </section>

      <section className="section">
        <div className="cards compact features-grid">
          {features.map((feature) => (
            <article key={feature.title} className="card feature-card">
              <span className="card-icon">{icons[feature.icon]}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="explorar" className="section">
        <h2>¿Qué vas a explorar?</h2>
        <p className="lead">Estos son algunos de los temas centrales del laboratorio.</p>
        <div className="topic-tags">
          {concepts.map((concept) => (
            <span key={concept} className="topic-tag">{concept}</span>
          ))}
        </div>
      </section>

      <section className="section cta-banner">
        <div className="cta-banner-text">
          <span className="card-icon">{icons.graduation}</span>
          <div>
            <h3>Hecho para tu aprendizaje</h3>
            <p>Herramienta educativa desarrollada para acompañar tu comprensión de la polarización de la luz.</p>
          </div>
        </div>
        <a className="btn btn-primary" href="/simulador">
          Comenzar ahora
          <span className="btn-icon">{icons.arrow}</span>
        </a>
      </section>
    </main>
  );
}

export default HomePage;
