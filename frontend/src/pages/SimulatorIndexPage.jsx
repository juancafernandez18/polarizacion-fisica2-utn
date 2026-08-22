import { Link } from 'react-router-dom';

const problems = [
  {
    title: 'Problema 1',
    description: 'Análisis de polarización de ondas electromagnéticas y su representación en el plano (Ex, Ey).',
    path: '/simulador/problema-1'
  },
  {
    title: 'Problema 2',
    description: 'Ángulo de Brewster: polarización total por reflexión al incidir sobre una superficie de vidrio.',
    path: '/simulador/problema-2'
  },
  {
    title: 'Problema 3',
    description: 'Ángulo de Brewster agua–vidrio: a partir del ángulo de incidencia y el índice del agua, se calcula el índice de refracción del vidrio que hace que el reflejado y el refractado formen 90°.',
    path: '/simulador/problema-3'
  },
  {
    title: 'Problema 6',
    description: 'Ley de Malus: un polarizador y un analizador en serie. Al girar el analizador un ángulo θ, la intensidad transmitida cae siguiendo I/I0 = cos²(θ).',
    path: '/simulador/problema-6'
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
              {problem.comingSoon && <span className="topic-tag">Próximamente</span>}
              <p>{problem.description}</p>
              <Link className="text-link" to={problem.path}>
                {problem.comingSoon ? 'Ver estado' : 'Abrir problema'}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default SimulatorIndexPage;
