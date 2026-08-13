import { Link } from 'react-router-dom';

const problems = [
  {
    title: 'Problema 1',
    description: 'Análisis de polarización de ondas electromagnéticas y su representación en el plano (Ex, Ey).',
    path: '/simulador/problema-1'
  },
  {
    title: 'Problema 2',
    description: 'Ley de Malus y relación entre intensidad transmitida y ángulo del polarizador.',
    path: '/simulador/problema-2'
  },
  {
    title: 'Problema 3',
    description: 'Ley de Brewster y polarización por reflexión en interfaces dielectrías.',
    path: '/simulador/problema-3'
  }
];

function SimulatorIndexPage() {
  return (
    <main className="page">
      <section className="section">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>Simulador</span>
        </div>

        <h1>Simulador de Física 2 - Polarización</h1>
        <p>
          Seleccioná un problema para ingresar a una unidad didáctica completa con teoría,
          desarrollo matemático y simulación interactiva.
        </p>

        <div className="cards">
          {problems.map((problem) => (
            <article key={problem.title} className="card problem-card">
              <h3>{problem.title}</h3>
              <p>{problem.description}</p>
              <Link className="text-link" to={problem.path}>Abrir problema</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default SimulatorIndexPage;
