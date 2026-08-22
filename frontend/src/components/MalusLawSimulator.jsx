import { useMemo, useState } from 'react';
import { computeMalusIntensity, toRad } from '../utils/malusLaw';

const DEFAULT_PARAMS = { theta: 0, i0: 100 };

// Puntos de referencia de los tres casos del enunciado, para marcarlos sobre
// la curva del gráfico (no se usan para ningún cálculo, solo como referencia visual).
const REFERENCE_ANGLES = [22.5, 45, 67.5];

// Construye, a partir de los valores actuales del simulador, la misma secuencia
// de resolución que Problema6.pdf (identificación del fenómeno → estado tras el
// primer polarizador → ángulo → ley de Malus → sustitución → cálculo → fracción
// → porcentaje). Usa computeMalusIntensity (utils/malusLaw.js) para el cálculo,
// nunca resultados hardcodeados.
function computeMalusAnalysis({ theta, i0 }) {
  const { ratio, intensity, transmittedPercent, blockedPercent } = computeMalusIntensity({ thetaDeg: theta, i0 });
  const thetaLabel = theta.toFixed(1);
  const ratioLabel = ratio.toFixed(4);
  const percentLabel = transmittedPercent.toFixed(1);

  const steps = [
    {
      label: '1. Identificación del fenómeno',
      lines: ['Luz linealmente polarizada atraviesa un segundo polarizador (analizador). La intensidad transmitida depende del ángulo entre los ejes de transmisión de ambos filtros: Ley de Malus.']
    },
    {
      label: '2. Estado de polarización después del primer filtro',
      lines: ['Al atravesar el primer polarizador, la luz queda linealmente polarizada a lo largo de su eje de transmisión, con intensidad máxima I0 (la transmisión es máxima cuando el analizador está alineado con el polarizador, θ = 0°).']
    },
    {
      label: '3. Ángulo entre polarizador y analizador',
      lines: [`θ = ${thetaLabel}°`]
    },
    {
      label: '4. Aplicación de la Ley de Malus',
      lines: ['I = I0 · cos²(θ)']
    },
    {
      label: '5. Sustitución del ángulo',
      lines: [`I = I0 · cos²(${thetaLabel}°)`]
    },
    {
      label: '6. Cálculo',
      lines: [`I / I0 = cos²(${thetaLabel}°) = ${ratioLabel}`]
    },
    {
      label: '7. Resultado como fracción',
      lines: [`I / I0 = ${ratioLabel}`]
    },
    {
      label: '8. Resultado como porcentaje',
      lines: [`${percentLabel}% de la intensidad incidente se transmite (I = ${intensity.toFixed(2)}, con I0 = ${i0})`]
    }
  ];

  const conclusionLabel = `I/I0 = ${ratioLabel}  ·  ${percentLabel}% transmitido`;

  return { steps, conclusionLabel, ratio, intensity, transmittedPercent, blockedPercent };
}

function arrowheadPoints(tipX, tipY, dirX, dirY, len = 0.22, width = 0.16) {
  const perpX = -dirY;
  const perpY = dirX;
  const baseX = tipX - dirX * len;
  const baseY = tipY - dirY * len;
  const c1x = baseX + perpX * width / 2;
  const c1y = baseY + perpY * width / 2;
  const c2x = baseX - perpX * width / 2;
  const c2y = baseY - perpY * width / 2;
  return `${tipX},${tipY} ${c1x},${c1y} ${c2x},${c2y}`;
}

// Diagrama del sistema polarizador + analizador: fuente de luz no polarizada,
// primer filtro (eje fijo, vertical), tramo de luz linealmente polarizada,
// segundo filtro (el analizador, que rota visualmente según θ) y el tramo de
// luz transmitida, cuyo brillo/opacidad refleja I/I0. Es específico de este
// problema (no reutiliza BrewsterRayDiagram): el fenómeno —dos filtros sobre
// un mismo haz recto— no tiene nada en común geométricamente con la reflexión
// y refracción en una interfaz.
function PolarizerAnalyzerDiagram({ theta, ratio }) {
  const sourceX = -0.5;
  const polarizerX = 2.2;
  const analyzerX = 6.5;
  const outputEndX = 9.6;
  const plateHalfHeight = 1.05;
  const axisHalfLength = 1.25;

  const beamOpacity = 0.18 + 0.82 * ratio;
  const outputArrow = arrowheadPoints(outputEndX, 0, 1, 0);

  const unpolarizedMarkers = [-0.05, 0.55, 1.15].map((x, i) => (
    <line
      key={`unpol-${i}`}
      x1={x} y1={-0.28} x2={x} y2={0.28}
      className="malus-unpolarized-tick"
      transform={`rotate(${i * 60} ${x} 0)`}
    />
  ));

  const polarizedMarkers = [2.7, 3.6, 4.5, 5.4].map((x) => (
    <line key={`pol-${x}`} x1={x} y1={-0.32} x2={x} y2={0.32} className="malus-polarized-tick" />
  ));

  return (
    <div className="simulator-display" aria-label="Diagrama del polarizador y el analizador">
      <svg viewBox="-1.1 -2.4 11.2 4.8" role="img" aria-label="Fuente de luz, polarizador, y analizador rotado un ángulo θ, con la intensidad transmitida">
        <line x1={sourceX} y1="0" x2={polarizerX - 0.25} y2="0" className="malus-beam-line malus-beam-unpolarized" />
        {unpolarizedMarkers}

        <circle cx={sourceX} cy="0" r="0.16" className="malus-source-dot" />
        <text x={sourceX} y="-0.55" textAnchor="middle" className="axis-label malus-caption">Fuente</text>
        <text x={sourceX} y="0.85" textAnchor="middle" className="axis-label malus-caption">no polarizada</text>

        <rect x={polarizerX - 0.09} y={-plateHalfHeight} width="0.18" height={plateHalfHeight * 2} rx="0.05" className="malus-plate" />
        <line x1={polarizerX} y1={-axisHalfLength} x2={polarizerX} y2={axisHalfLength} className="malus-axis-line malus-axis-fixed" />
        <text x={polarizerX} y={-axisHalfLength - 0.25} textAnchor="middle" className="axis-label malus-caption">Polarizador</text>
        <text x={polarizerX} y={axisHalfLength + 0.45} textAnchor="middle" className="axis-label malus-caption">eje fijo (0°)</text>

        <line x1={polarizerX + 0.25} y1="0" x2={analyzerX - 0.6} y2="0" className="malus-beam-line malus-beam-polarized" />
        {polarizedMarkers}

        <line x1={analyzerX} y1={-axisHalfLength} x2={analyzerX} y2={axisHalfLength} className="malus-axis-line malus-axis-reference" />
        <g transform={`rotate(${theta} ${analyzerX} 0)`}>
          <rect x={analyzerX - 0.09} y={-plateHalfHeight} width="0.18" height={plateHalfHeight * 2} rx="0.05" className="malus-plate malus-plate-analyzer" />
          <line x1={analyzerX} y1={-axisHalfLength} x2={analyzerX} y2={axisHalfLength} className="malus-axis-line malus-axis-rotating" />
        </g>
        <text x={analyzerX} y={-axisHalfLength - 0.25} textAnchor="middle" className="axis-label malus-caption">Analizador</text>
        <text x={analyzerX} y={axisHalfLength + 0.45} textAnchor="middle" className="axis-label malus-caption">{`eje a θ = ${theta.toFixed(1)}°`}</text>

        <line
          x1={analyzerX + 0.25} y1="0" x2={outputEndX - 0.25} y2="0"
          className="malus-beam-line malus-beam-transmitted"
          style={{ opacity: beamOpacity }}
        />
        <polygon points={outputArrow} className="malus-beam-arrow" style={{ opacity: beamOpacity }} />
        <text x={outputEndX - 0.3} y="-0.55" textAnchor="end" className="axis-label malus-caption">Transmitida</text>
        <text x={outputEndX - 0.3} y="0.85" textAnchor="end" className="axis-label malus-caption">{`${(ratio * 100).toFixed(1)}% de I0`}</text>
      </svg>
    </div>
  );
}

// Gráfico I/I0 = cos²(θ) en función de θ (0°–90°): curva completa, marcadores
// tenues en los tres casos del enunciado y un punto destacado en la posición
// actual del slider, con líneas guía hacia ambos ejes.
function MalusCurveChart({ theta, ratio }) {
  const xScale = (deg) => deg * 0.1;
  const yScale = (r) => (1 - r) * 4;

  const curvePoints = useMemo(() => Array.from({ length: 46 }, (_, i) => {
    const deg = i * 2;
    const r = Math.cos(toRad(deg)) ** 2;
    return `${i === 0 ? 'M' : 'L'} ${xScale(deg).toFixed(3)} ${yScale(r).toFixed(3)}`;
  }).join(' '), []);

  const currentX = xScale(theta);
  const currentY = yScale(ratio);

  return (
    <div className="simulator-display" aria-label="Gráfico de la Ley de Malus">
      <svg viewBox="-1.5 -0.6 11.3 5.6" role="img" aria-label="Curva de intensidad relativa I sobre I0 en función del ángulo θ, con el punto actual marcado">
        <line x1="0" y1="0" x2="0" y2="4" className="guide-line" />
        <line x1="0" y1="4" x2="9" y2="4" className="guide-line" />

        {[0, 22.5, 45, 67.5, 90].map((deg) => (
          <g key={`x-${deg}`}>
            <line x1={xScale(deg)} y1="4" x2={xScale(deg)} y2="4.12" className="grid-line" />
            <text x={xScale(deg)} y="4.5" textAnchor="middle" className="axis-label malus-chart-label">{deg}°</text>
          </g>
        ))}
        {[0, 0.5, 1].map((r) => (
          <g key={`y-${r}`}>
            <line x1="-0.12" y1={yScale(r)} x2="0" y2={yScale(r)} className="grid-line" />
            <text x="-0.3" y={yScale(r) + 0.14} textAnchor="end" className="axis-label malus-chart-label">{r.toFixed(1)}</text>
          </g>
        ))}

        <path d={curvePoints} className="malus-curve" />

        {REFERENCE_ANGLES.map((deg) => {
          const r = Math.cos(toRad(deg)) ** 2;
          return <circle key={deg} cx={xScale(deg)} cy={yScale(r)} r="0.07" className="malus-reference-dot" />;
        })}

        <line x1={currentX} y1={currentY} x2={currentX} y2="4" className="normal-line" />
        <line x1={currentX} y1={currentY} x2="0" y2={currentY} className="normal-line" />
        <circle cx={currentX} cy={currentY} r="0.11" className="vector-dot" />

        <text x="4.5" y="5.15" textAnchor="middle" className="axis-label malus-chart-title">θ (°)</text>
        <text x="-1.1" y="0.1" textAnchor="start" className="axis-label malus-chart-title">I/I0</text>
      </svg>
    </div>
  );
}

// Simulador del Problema 6 (Ley de Malus). Motor matemático propio y puro
// (delegado a utils/malusLaw.js para que otros problemas puedan reutilizarlo),
// con dos visualizaciones específicas de este fenómeno: el sistema
// polarizador+analizador y la curva I/I0 = cos²(θ).
function MalusLawSimulator({ problem }) {
  const [theta, setTheta] = useState(DEFAULT_PARAMS.theta);
  const [i0, setI0] = useState(DEFAULT_PARAMS.i0);

  const resetToDefaults = () => {
    setTheta(DEFAULT_PARAMS.theta);
    setI0(DEFAULT_PARAMS.i0);
  };

  const applyQuickCase = (quickCase) => {
    setTheta(quickCase.theta);
  };

  const isActiveCase = (quickCase) => theta === quickCase.theta;
  const isDefault = theta === DEFAULT_PARAMS.theta && i0 === DEFAULT_PARAMS.i0;

  const analysis = useMemo(() => computeMalusAnalysis({ theta, i0 }), [theta, i0]);

  return (
    <>
      <section className="section simulator-section">
        <div className="simulator-controls">
          <h2>4. Simulación interactiva</h2>
          <p>Modificá el ángulo entre el polarizador y el analizador, y observá cómo cambia la intensidad transmitida.</p>

          <div className="control-group">
            <label htmlFor="malus-theta">Ángulo θ (polarizador–analizador)</label>
            <input id="malus-theta" type="range" min="0" max="90" step="0.1" value={theta} onChange={(event) => setTheta(Number(event.target.value))} />
            <span>{theta.toFixed(1)}°</span>
          </div>

          <div className="control-group">
            <label htmlFor="malus-i0">Intensidad máxima I0 (unidades arbitrarias)</label>
            <input id="malus-i0" type="range" min="1" max="200" step="1" value={i0} onChange={(event) => setI0(Number(event.target.value))} />
            <span>{i0}</span>
          </div>

          {problem.quickCases && (
            <div className="quick-cases">
              <p className="quick-cases-label">Casos del problema</p>
              <div className="quick-case-buttons">
                {problem.quickCases.map((quickCase) => (
                  <button
                    key={quickCase.label}
                    type="button"
                    className={`btn ${isActiveCase(quickCase) ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => applyQuickCase(quickCase)}
                  >
                    {quickCase.label}
                  </button>
                ))}
                <button type="button" className={`btn ${isDefault ? 'btn-primary' : 'btn-secondary'}`} onClick={resetToDefaults}>
                  Restablecer (θ = 0°)
                </button>
              </div>
              {problem.quickCases.filter(isActiveCase).map((quickCase) => (
                <p key={quickCase.label} className="hero-caption">{quickCase.description}</p>
              ))}
            </div>
          )}

          <div className="state-pill">{analysis.conclusionLabel}</div>
        </div>

        <div className="simulator-display-column">
          <PolarizerAnalyzerDiagram theta={theta} ratio={analysis.ratio} />
          <p className="hero-caption">
            El brillo del tramo final representa I/I0: máximo cuando el analizador está alineado con el polarizador (θ = 0°), nulo cuando quedan cruzados (θ = 90°).
          </p>
        </div>
      </section>

      <section className="section">
        <h2>5. Gráfico de la Ley de Malus</h2>
        <p>Curva I/I0 = cos²(θ) para θ entre 0° y 90°. El punto destacado es la posición actual del slider; los puntos tenues marcan los tres casos del enunciado.</p>
        <MalusCurveChart theta={theta} ratio={analysis.ratio} />
      </section>

      <section className="section">
        <h2>6. Análisis matemático</h2>
        <p>Se recalcula automáticamente a partir de θ e I0 actuales, siguiendo la misma resolución que el enunciado original.</p>

        <div className="step-list">
          {analysis.steps.map((step) => (
            <div key={step.label} className="step-item">
              <p className="step-item-label">{step.label}</p>
              {step.lines.map((line) => (
                <p key={line} className="step-item-line">{line}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>7. Resultados del análisis matemático</h2>
        <p>Valores recalculados en vivo a partir de θ e I0 actuales.</p>

        <div className="cards">
          <article className="card">
            <p className="step-item-label">Ángulo θ</p>
            <p className="state-pill">{theta.toFixed(1)}°</p>
          </article>
          <article className="card">
            <p className="step-item-label">Intensidad máxima I0</p>
            <p className="state-pill">{i0}</p>
          </article>
          <article className="card">
            <p className="step-item-label">Intensidad relativa I/I0</p>
            <p className="state-pill">{analysis.ratio.toFixed(4)}</p>
          </article>
          <article className="card">
            <p className="step-item-label">Intensidad transmitida (I)</p>
            <p className="state-pill">{analysis.intensity.toFixed(2)}</p>
          </article>
          <article className="card">
            <p className="step-item-label">% de luz transmitida</p>
            <p className="state-pill">{analysis.transmittedPercent.toFixed(1)}%</p>
          </article>
          <article className="card">
            <p className="step-item-label">% de luz no transmitida</p>
            <p className="state-pill">{analysis.blockedPercent.toFixed(1)}%</p>
          </article>
        </div>
      </section>

      <section className="section">
        <h2>8. Interpretación física</h2>
        <p>
          La intensidad transmitida no disminuye linealmente con el ángulo: sigue una curva cos²(θ). Por eso, entre 0° y 45° la intensidad cae más lentamente (de 100% a 50%), mientras que entre 45° y 90° cae más rápido (de 50% a 0%) — la curva es más pronunciada en la segunda mitad del recorrido, no simétrica en la forma en que uno podría esperar de una disminución uniforme.
        </p>
      </section>

      <section className="section">
        <h2>9. Conclusión</h2>
        <p>
          Con dos polarizadores en serie, el estudiante controla la intensidad transmitida simplemente rotando el segundo (el analizador): total en 0°, mitad en 45°, nula en 90°. Este principio es la base de filtros de intensidad variable, visores LCD y técnicas de fotografía para reducir reflejos, todos construidos sobre la misma Ley de Malus.
        </p>
      </section>
    </>
  );
}

export default MalusLawSimulator;
