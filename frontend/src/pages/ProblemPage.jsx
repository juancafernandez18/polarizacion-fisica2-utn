import { Link, useParams } from 'react-router-dom';
import EllipsePolarizationSimulator from '../components/EllipsePolarizationSimulator';
import BrewsterSimulator from '../components/BrewsterSimulator';
import BrewsterWaterGlassSimulator from '../components/BrewsterWaterGlassSimulator';

// Cada problema declara qué simulador propio usa (ver src/components/). Un problema
// nuevo agrega su propio componente acá sin tocar el de los demás.
const simulators = {
  ellipse: EllipsePolarizationSimulator,
  brewster: BrewsterSimulator,
  brewsterWaterGlass: BrewsterWaterGlassSimulator
};

const problemData = {
  'problema-1': {
    title: 'Problema 1',
    subtitle: 'Análisis de polarización de una onda electromagnética',
    simulatorKind: 'ellipse',
    statement: 'Una onda electromagnética se propaga en el vacío y su campo eléctrico puede describirse mediante dos componentes ortogonales Ex(t) y Ey(t). Se desea analizar cómo cambia el estado de polarización al modificar la amplitud de cada componente, la diferencia de fase y la orientación del sistema.',
    theory: 'La polarización de una onda se determina por la trayectoria del extremo del vector eléctrico en el plano (Ex, Ey). Según la relación entre amplitudes y fase, la trayectoria puede ser lineal, circular o elíptica.',
    equations: [
      'Ex(t) = E0x cos(ωt)',
      'Ey(t) = E0y cos(ωt + δ)',
      'x = Ex(t), y = Ey(t)'
    ],
    steps: [
      'Se define la amplitud de la componente X.',
      'Se define la amplitud de la componente Y.',
      'Se introduce la diferencia de fase δ.',
      'Se observa la trayectoria resultante en el plano.'
    ],
    casesSummary: [
      {
        id: 'a',
        condition: 'Ex = Ey; δ = 0, ±2π, ±4π, … (2mπ)',
        outcome: 'Polarización lineal.'
      },
      {
        id: 'b',
        condition: 'Ex = Ey; δ = −π/2 + 2mπ',
        outcome: 'Polarización circular derecha (circular izquierda si δ = +π/2 + 2mπ).'
      },
      {
        id: 'c',
        condition: 'Ex ≠ Ey; δ arbitraria',
        outcome: 'Polarización elíptica — caso más general.'
      }
    ],
    quickCases: [
      {
        label: 'Caso A',
        result: 'Lineal',
        description: 'Ex = Ey y δ = 0 (o ±2π, ±4π, …). El campo eléctrico mantiene una dirección fija: polarización lineal.',
        amplitudeX: 1.5,
        amplitudeY: 1.5,
        phaseDelta: 0,
        rotation: 0
      },
      {
        label: 'Caso B',
        result: 'Circular',
        description: 'Ex = Ey y δ = −π/2 (+2mπ). El campo eléctrico rota con amplitud constante: polarización circular derecha.',
        amplitudeX: 1.5,
        amplitudeY: 1.5,
        phaseDelta: -90,
        rotation: 0
      },
      {
        label: 'Caso C',
        result: 'Elíptica',
        description: 'Ex ≠ Ey y δ arbitraria. La punta del vector describe una elipse: polarización elíptica, el caso más general.',
        amplitudeX: 1.6,
        amplitudeY: 0.9,
        phaseDelta: 40,
        rotation: 0
      }
    ]
  },
  'problema-2': {
    title: 'Problema 2',
    subtitle: 'Ángulo de Brewster — Polarización por reflexión',
    simulatorKind: 'brewster',
    statement: 'Un haz paralelo de luz no polarizada, en aire, incide con un ángulo de 54,5° respecto de la normal sobre una superficie plana de vidrio. El haz reflejado resulta linealmente polarizado en su totalidad. Se pide calcular el índice de refracción del vidrio y el ángulo de refracción del haz transmitido.',
    theory: 'La polarización por reflexión permite separar, total o parcialmente, las vibraciones del campo eléctrico según su dirección. Cuando la luz natural incide sobre una superficie reflectante, el vector de campo eléctrico de cada rayo puede descomponerse en dos componentes: una paralela a la superficie (perpendicular al plano de incidencia) y otra perpendicular a la superficie (contenida en el plano de incidencia). Se observa experimentalmente que la componente paralela a la superficie se refleja con mayor intensidad que la perpendicular, por lo que para un ángulo de incidencia genérico el rayo reflejado queda solo parcialmente polarizado (si el ángulo es 0° ni siquiera eso: el reflejado sale totalmente no polarizado). Existe un único ángulo de incidencia para el cual esa reflexión preferencial se vuelve total: aquel en el que el rayo reflejado y el rayo refractado forman 90° entre sí. En ese ángulo particular, llamado ángulo de polarización o ángulo de Brewster θp, el rayo reflejado queda totalmente polarizado —con su E paralelo a la superficie— mientras que el refractado permanece solo parcialmente polarizado.',
    equations: [
      'tan(θp) = n2 / n1',
      'n2 = n1 · tan(θp)',
      'n1 · sen(θp) = n2 · sen(θr)   (ley de Snell)',
      'θr = sen⁻¹( n1 · sen(θp) / n2 )'
    ],
    steps: [
      'Se identifica el ángulo de incidencia como el ángulo de polarización θp, dado que el haz reflejado sale totalmente polarizado.',
      'Se aplica la relación de Brewster tan(θp) = n2/n1 para hallar el índice de refracción del vidrio.',
      'Se aplica la ley de Snell de la refracción para hallar el ángulo de refracción θr del haz transmitido.',
      'Se verifica que el rayo reflejado y el refractado formen 90° entre sí (θp + θr = 90°).'
    ]
  },
  'problema-3': {
    title: 'Problema 3',
    subtitle: 'Ángulo de Brewster — Polarización por reflexión (agua → vidrio)',
    simulatorKind: 'brewsterWaterGlass',
    statement: 'La luz que viaja en agua incide sobre una placa de vidrio con un ángulo de incidencia de 53,0°. Una parte del haz se refleja y otra se refracta. Las porciones reflejada y refractada forman un ángulo de 90° entre sí. Se pide calcular el índice de refracción del vidrio.',
    theory: 'Es el mismo fenómeno de polarización por reflexión del Problema 2 (ángulo de Brewster), aplicado a otro par de medios: acá la luz viaja primero por agua en vez de aire. Cuando el rayo reflejado y el rayo refractado quedan exactamente perpendiculares entre sí, el ángulo de incidencia en el que ocurre esto es el ángulo de polarización o ángulo de Brewster θp, y el rayo reflejado queda totalmente polarizado. Como en este problema el ángulo de incidencia y la condición de 90° ya vienen dados, θp coincide con el ángulo de incidencia; a partir de la geometría (θ_reflejado + θ_refractado = 90°, con θ_reflejado = θi por la ley de reflexión) se obtiene primero el ángulo de refracción, y luego, aplicando la ley de Brewster, el índice de refracción del vidrio.',
    equations: [
      'θ_reflejado = θi   (ley de reflexión)',
      'θ_reflejado + θ_refractado = 90°',
      'θp = θi',
      'tan(θp) = n_vidrio / n_agua',
      'n_vidrio = n_agua · tan(θp)'
    ],
    steps: [
      'Se identifica que el ángulo de reflexión es igual al de incidencia (ley de reflexión).',
      'Como el rayo reflejado y el refractado forman 90°, se despeja el ángulo de refracción: θ_refractado = 90° − θi.',
      'Se reconoce que el ángulo de incidencia dado es el ángulo de Brewster, ya que en él el rayo reflejado sale totalmente polarizado.',
      'Se aplica la ley de Brewster tan(θp) = n_vidrio/n_agua para hallar el índice de refracción del vidrio.'
    ]
  }
};

function ProblemPage() {
  const { problemId } = useParams();
  const problem = problemData[problemId];

  if (!problem) {
    return (
      <main className="page">
        <section className="section">
          <h1>Problema no encontrado</h1>
          <Link className="text-link" to="/simulador">Volver al simulador</Link>
        </section>
      </main>
    );
  }

  const Simulator = simulators[problem.simulatorKind];

  return (
    <main className="page">
      <section className="section">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/simulador">Simulador</Link>
          <span>›</span>
          <span>{problem.title}</span>
        </div>

        <h1>{problem.title}</h1>
        <p className="lead">{problem.subtitle}</p>
      </section>

      {problem.comingSoon ? (
        <section className="section">
          <h2>Estado del módulo</h2>
          <p>{problem.statement}</p>
        </section>
      ) : (
        <>
          <section className="section">
            <h2>1. Introducción del problema</h2>
            <p>{problem.statement}</p>
          </section>

          <section className="section">
            <h2>2. Marco teórico</h2>
            <p>{problem.theory}</p>
          </section>

          <section className="section">
            <h2>3. Desarrollo matemático</h2>
            <ul>
              {problem.equations.map((equation) => (
                <li key={equation}>{equation}</li>
              ))}
            </ul>
            <ol>
              {problem.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            {problem.casesSummary && (
              <>
                <p className="lead">Casos analizados por la cátedra (enunciado original):</p>
                <div className="step-list">
                  {problem.casesSummary.map((c) => (
                    <div key={c.id} className="step-item">
                      <p className="step-item-label">{c.id}) {c.condition}</p>
                      <p className="step-item-line">{c.outcome}</p>
                    </div>
                  ))}
                </div>
                <p className="hero-caption">
                  Podés reproducir cada caso con los botones &quot;Caso A/B/C&quot; de la simulación, y ver la resolución completa recalculada en la sección 5.
                </p>
              </>
            )}
          </section>

          {Simulator && <Simulator problem={problem} />}
        </>
      )}

      <section className="section">
        <Link className="btn btn-secondary" to="/simulador">← Volver a Simulador</Link>
      </section>
    </main>
  );
}

export default ProblemPage;
