import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

const DEFAULT_PARAMS = { amplitudeX: 1.4, amplitudeY: 1.0, phaseDelta: 90, rotation: 15 };

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function degreesToPiLabel(deg) {
  if (deg === 0) return '0';
  const divisor = gcd(Math.abs(deg), 180);
  const numerator = deg / divisor;
  const denominator = 180 / divisor;
  const sign = numerator < 0 ? '-' : '';
  const numeratorLabel = Math.abs(numerator) === 1 ? '' : String(Math.abs(numerator));
  return denominator === 1 ? `${sign}${numeratorLabel}π` : `${sign}${numeratorLabel}π/${denominator}`;
}

// Reproduce, con los valores actuales del simulador, la misma lógica de resolución
// que Problema1.pdf aplica a los casos a) lineal, b) circular y c) elíptica.
function buildProblema1Analysis({ amplitudeX, amplitudeY, phaseDelta, phaseRad, isLinear, isCircular }) {
  const ax = amplitudeX.toFixed(1);
  const ay = amplitudeY.toFixed(1);
  const deltaRadLabel = degreesToPiLabel(phaseDelta);
  const deltaLabel = phaseDelta === 0 ? '0' : `${phaseDelta}° = ${deltaRadLabel} rad`;

  const steps = [
    {
      label: 'Datos ingresados',
      lines: [`Ax = ${ax}`, `Ay = ${ay}`, `δ = ${deltaLabel}`]
    },
    {
      label: 'Campo eléctrico',
      lines: ['Ex(t) = Ax·cos(ωt)', 'Ey(t) = Ay·cos(ωt + δ)']
    },
    {
      label: 'Sustituyendo',
      lines: [`Ex(t) = ${ax}·cos(ωt)`, `Ey(t) = ${ay}·cos(ωt + ${deltaRadLabel})`]
    }
  ];

  let conclusionLabel;
  let interpretation;

  if (isLinear) {
    const inPhase = Math.abs(phaseDelta) < 5;
    const slope = (inPhase ? amplitudeY : -amplitudeY) / amplitudeX;
    const angleDeg = (Math.atan(slope) * 180) / Math.PI;

    steps.push({
      label: inPhase
        ? 'Como δ ≈ 0, las componentes están en fase'
        : 'Como δ ≈ π, las componentes están en contrafase',
      lines: inPhase
        ? ['E(t) = [i·Ax + j·Ay]·cos(ωt)']
        : ['cos(ωt + π) = −cos(ωt)', 'E(t) = [i·Ax − j·Ay]·cos(ωt)']
    });

    steps.push({
      label: 'Ángulo de vibración del campo',
      lines: [`tan α = ${inPhase ? '' : '−'}Ay/Ax = ${slope.toFixed(2)}`, `α ≈ ${angleDeg.toFixed(1)}°`]
    });

    conclusionLabel = 'Polarización lineal';
    interpretation = 'El campo eléctrico mantiene una dirección de vibración fija en el plano (Ex, Ey); su punta se desplaza siempre sobre la misma recta.';

    return { steps, conclusionLabel, interpretation, angleDeg };
  } else if (isCircular) {
    const isRight = phaseDelta < 0;

    steps.push({
      label: isRight
        ? 'Usando la identidad cos(ωt − π/2) = sen(ωt)'
        : 'Usando la identidad cos(ωt + π/2) = −sen(ωt)',
      lines: [isRight ? `Ey(t) = ${ay}·sen(ωt)` : `Ey(t) = −${ay}·sen(ωt)`]
    });

    steps.push({
      label: 'Como Ax ≈ Ay, la trayectoria cumple',
      lines: ['Ex² + Ey² = A²', `con A ≈ ${ax}`]
    });

    conclusionLabel = isRight ? 'Polarización circular derecha' : 'Polarización circular izquierda';
    interpretation = `El campo eléctrico mantiene un módulo constante y rota uniformemente alrededor de la dirección de propagación, en sentido ${isRight ? 'horario' : 'antihorario'} para un observador que mira hacia la fuente.`;
  } else {
    const cosDelta = Math.cos(phaseRad).toFixed(2);
    const sinSquaredDelta = (Math.sin(phaseRad) ** 2).toFixed(2);

    steps.push({
      label: 'Eliminando el parámetro ωt entre ambas componentes',
      lines: ['(Ex/Ax)² + (Ey/Ay)² − 2·(Ex·Ey)/(Ax·Ay)·cos δ = sen² δ']
    });

    steps.push({
      label: 'Sustituyendo los valores actuales',
      lines: [`(Ex/${ax})² + (Ey/${ay})² − 2·(Ex·Ey)/(${ax}·${ay})·(${cosDelta}) = ${sinSquaredDelta}`]
    });

    conclusionLabel = 'Polarización elíptica';
    interpretation = 'El campo eléctrico varía en módulo y dirección: su extremo describe una elipse. Es el caso más general de polarización.';
  }

  return { steps, conclusionLabel, interpretation };
}

// Cada problema con simulador propio agrega acá su propio builder (misma firma de datos de entrada).
const mathAnalysisBuilders = {
  'problema-1': buildProblema1Analysis
};

const scaleVec = (v, s) => ({ x: v.x * s, y: v.y * s });
const addVec = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const subVec = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });

// Arco más corto entre dos puntos de un círculo de radio r centrado en el origen.
function shortArcPath(p1, p2, r) {
  const a1 = Math.atan2(p1.y, p1.x);
  const a2 = Math.atan2(p2.y, p2.x);
  let diff = a2 - a1;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  const sweepFlag = diff > 0 ? 1 : 0;
  return {
    d: `M ${p1.x.toFixed(3)} ${p1.y.toFixed(3)} A ${r} ${r} 0 0 ${sweepFlag} ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`,
    midAngle: a1 + diff / 2
  };
}

// Ilustra, para el caso lineal, el plano fijo (contiene la dirección de propagación Z
// y la dirección de vibración de E) del que habla la resolución del PDF. Se recalcula
// con el ángulo α actual en vez de ser una imagen fija.
function PolarizationPlaneDiagram({ angleDeg }) {
  const angleRad = (angleDeg * Math.PI) / 180;
  // X horizontal y Y vertical (igual que el gráfico Ex/Ey principal); Z es la única
  // diagonal, así E — que solo combina X e Y — nunca puede quedar alineado con Z.
  const yUnit = { x: 0, y: -1 };
  const xUnit = { x: 1, y: 0 };
  const zRaw = { x: 0.8, y: 0.55 };
  const zLen0 = Math.hypot(zRaw.x, zRaw.y);
  const zUnit = { x: zRaw.x / zLen0, y: zRaw.y / zLen0 };

  const eRaw = addVec(scaleVec(xUnit, Math.cos(angleRad)), scaleVec(yUnit, Math.sin(angleRad)));
  const eNorm = Math.hypot(eRaw.x, eRaw.y);
  const eUnit = { x: eRaw.x / eNorm, y: eRaw.y / eNorm };

  const axisLen = 1.9;
  const axisLine = (dir) => ({
    x1: dir.x * -0.25 * axisLen,
    y1: dir.y * -0.25 * axisLen,
    x2: dir.x * 1.05 * axisLen,
    y2: dir.y * 1.05 * axisLen
  });
  const labelAt = (dir) => ({ x: dir.x * axisLen * 1.2, y: dir.y * axisLen * 1.2 });

  const planeZLen = 1.6;
  const planeELen = 1.3;
  const planePoints = [
    addVec(scaleVec(zUnit, planeZLen), scaleVec(eUnit, planeELen)),
    subVec(scaleVec(zUnit, planeZLen), scaleVec(eUnit, planeELen)),
    subVec(scaleVec(zUnit, -0.3 * planeZLen), scaleVec(eUnit, planeELen)),
    addVec(scaleVec(zUnit, -0.3 * planeZLen), scaleVec(eUnit, planeELen))
  ].map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' ');

  // E vibra a ambos lados del origen (no es un vector con origen fijo en 0),
  // así que la recta se dibuja completa, con puntas en los dos extremos.
  const vectorTip = scaleVec(eUnit, planeELen * 0.85);
  const vectorTail = scaleVec(eUnit, -planeELen * 0.85);
  const perpUnit = { x: -eUnit.y, y: eUnit.x };
  const arrowhead = (tip, dir) => {
    const arrowLen = 0.16;
    const arrowWidth = 0.12;
    const base = subVec(tip, scaleVec(dir, arrowLen));
    const corner1 = addVec(base, scaleVec(perpUnit, arrowWidth / 2));
    const corner2 = subVec(base, scaleVec(perpUnit, arrowWidth / 2));
    return [tip, corner1, corner2].map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' ');
  };
  const tipArrow = arrowhead(vectorTip, eUnit);
  const tailArrow = arrowhead(vectorTail, scaleVec(eUnit, -1));

  const arcRadius = 0.5;
  const arc = shortArcPath(scaleVec(xUnit, arcRadius), scaleVec(eUnit, arcRadius), arcRadius);
  const labelRadius = arcRadius + 0.35;
  const angleLabelPos = { x: labelRadius * Math.cos(arc.midAngle), y: labelRadius * Math.sin(arc.midAngle) };

  const xLine = axisLine(xUnit);
  const yLine = axisLine(yUnit);
  const zLine = axisLine(zUnit);
  const xLabel = labelAt(xUnit);
  const yLabel = labelAt(yUnit);
  const zLabel = labelAt(zUnit);

  return (
    <div className="plane-diagram">
      <div className="simulator-display" aria-label="Plano de polarización, calculado con el ángulo α actual">
        <svg viewBox="-2.6 -2.6 5.2 5.2" role="img" aria-label="Plano que contiene la dirección de propagación Z y el vector E">
          <polygon points={planePoints} className="plane-fill" />
          <line x1={xLine.x1} y1={xLine.y1} x2={xLine.x2} y2={xLine.y2} className="guide-line" />
          <line x1={yLine.x1} y1={yLine.y1} x2={yLine.x2} y2={yLine.y2} className="guide-line" />
          <line x1={zLine.x1} y1={zLine.y1} x2={zLine.x2} y2={zLine.y2} className="guide-line" />
          <line x1={vectorTail.x.toFixed(3)} y1={vectorTail.y.toFixed(3)} x2={vectorTip.x.toFixed(3)} y2={vectorTip.y.toFixed(3)} className="plane-vector-line" />
          <polygon points={tipArrow} className="plane-vector-arrow" />
          <polygon points={tailArrow} className="plane-vector-arrow" />
          <path d={arc.d} className="angle-arc" />
          <text x={angleLabelPos.x.toFixed(3)} y={angleLabelPos.y.toFixed(3)} className="axis-label">α</text>
          <text x={xLabel.x.toFixed(3)} y={xLabel.y.toFixed(3)} className="axis-label">X</text>
          <text x={yLabel.x.toFixed(3)} y={yLabel.y.toFixed(3)} className="axis-label">Y</text>
          <text x={zLabel.x.toFixed(3)} y={zLabel.y.toFixed(3)} className="axis-label">Z</text>
        </svg>
      </div>
      <p className="hero-caption">
        Plano de polarización: el vector E vibra siempre dentro de este plano fijo, que contiene la dirección de propagación Z y forma un ángulo α con el eje X.
      </p>
    </div>
  );
}

const problemData = {
  'problema-1': {
    title: 'Problema 1',
    subtitle: 'Análisis de polarización de una onda electromagnética',
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
    subtitle: 'Ley de Malus',
    statement: 'Una onda linealmente polarizada incide sobre un polarizador. Se desea estudiar cómo cambia la intensidad transmitida al variar el ángulo entre la dirección de polarización de la onda y el eje del polarizador.',
    theory: 'La ley de Malus establece que la intensidad transmitida es proporcional al cuadrado del coseno del ángulo entre el eje del polarizador y la dirección de polarización de la onda incidente.',
    equations: [
      'I = I0 cos² θ',
      'I/I0 = cos² θ'
    ],
    steps: [
      'Se identifica el ángulo de incidencia.',
      'Se aplica la ley de Malus.',
      'Se interpreta el resultado físico.'
    ]
  },
  'problema-3': {
    title: 'Problema 3',
    subtitle: 'Ley de Brewster',
    statement: 'Una onda luminosa incide sobre una interfaz entre dos medios. Se desea hallar el ángulo de incidencia para el cual la luz reflejada queda completamente polarizada.',
    theory: 'El ángulo de Brewster se define como el ángulo de incidencia para el cual el ángulo de refracción es complementario al de incidencia y la reflexión se vuelve totalmente polarizada.',
    equations: [
      'tan θB = n2 / n1',
      'θr = 90° - θB'
    ],
    steps: [
      'Se identifica el índice de refracción de cada medio.',
      'Se aplica la relación de Brewster.',
      'Se interpreta el fenómeno de polarización por reflexión.'
    ]
  }
};

function ProblemPage() {
  const { problemId } = useParams();
  const problem = problemData[problemId];

  const [amplitudeX, setAmplitudeX] = useState(DEFAULT_PARAMS.amplitudeX);
  const [amplitudeY, setAmplitudeY] = useState(DEFAULT_PARAMS.amplitudeY);
  const [phaseDelta, setPhaseDelta] = useState(DEFAULT_PARAMS.phaseDelta);
  const [rotation, setRotation] = useState(DEFAULT_PARAMS.rotation);
  const [time, setTime] = useState(0);

  const applyQuickCase = (quickCase) => {
    setAmplitudeX(quickCase.amplitudeX);
    setAmplitudeY(quickCase.amplitudeY);
    setPhaseDelta(quickCase.phaseDelta);
    setRotation(quickCase.rotation);
  };

  const resetToDefaults = () => {
    setAmplitudeX(DEFAULT_PARAMS.amplitudeX);
    setAmplitudeY(DEFAULT_PARAMS.amplitudeY);
    setPhaseDelta(DEFAULT_PARAMS.phaseDelta);
    setRotation(DEFAULT_PARAMS.rotation);
  };

  const isActiveCase = (quickCase) => (
    amplitudeX === quickCase.amplitudeX
    && amplitudeY === quickCase.amplitudeY
    && phaseDelta === quickCase.phaseDelta
    && rotation === quickCase.rotation
  );

  useEffect(() => {
    let frameId = 0;
    let animationFrame;
    const tick = () => {
      setTime((prev) => prev + 0.02);
      animationFrame = window.requestAnimationFrame(tick);
    };
    frameId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const phaseRad = (phaseDelta * Math.PI) / 180;
  const rotationRad = (rotation * Math.PI) / 180;

  const ellipsePoints = useMemo(() => Array.from({ length: 260 }, (_, index) => {
    const angle = (index / 259) * 2 * Math.PI;
    const x = amplitudeX * Math.cos(angle);
    const y = amplitudeY * Math.cos(angle + phaseRad);
    const rotatedX = x * Math.cos(rotationRad) - y * Math.sin(rotationRad);
    const rotatedY = x * Math.sin(rotationRad) + y * Math.cos(rotationRad);
    return { x: rotatedX, y: rotatedY };
  }), [amplitudeX, amplitudeY, phaseDelta, rotation, phaseRad, rotationRad]);

  const pathD = ellipsePoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');

  const vectorAngle = time * 1.2;
  const vectorX = amplitudeX * Math.cos(vectorAngle);
  const vectorY = amplitudeY * Math.cos(vectorAngle + phaseRad);
  const vectorRotX = vectorX * Math.cos(rotationRad) - vectorY * Math.sin(rotationRad);
  const vectorRotY = vectorX * Math.sin(rotationRad) + vectorY * Math.cos(rotationRad);

  const isLinear = Math.abs(phaseDelta) < 5 || Math.abs(phaseDelta - 180) < 5 || Math.abs(phaseDelta + 180) < 5;
  const isCircular = Math.abs(amplitudeX - amplitudeY) < 0.15 && (Math.abs(phaseDelta - 90) < 5 || Math.abs(phaseDelta + 90) < 5);
  const polarizationState = isCircular ? 'Circular' : isLinear ? 'Lineal' : 'Elíptica';

  const analysis = useMemo(() => {
    const buildAnalysis = mathAnalysisBuilders[problemId];
    if (!buildAnalysis) return null;
    return buildAnalysis({ amplitudeX, amplitudeY, phaseDelta, phaseRad, isLinear, isCircular });
  }, [problemId, amplitudeX, amplitudeY, phaseDelta, phaseRad, isLinear, isCircular]);

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

      <section className="section simulator-section">
        <div className="simulator-controls">
          <h2>4. Simulación interactiva</h2>
          <p>Modificá los parámetros y observá cómo cambia el estado de polarización.</p>

          <div className="control-group">
            <label htmlFor="amplitude-x">Amplitud Ex</label>
            <input id="amplitude-x" type="range" min="0.2" max="2.2" step="0.1" value={amplitudeX} onChange={(event) => setAmplitudeX(Number(event.target.value))} />
            <span>{amplitudeX.toFixed(1)}</span>
          </div>

          <div className="control-group">
            <label htmlFor="amplitude-y">Amplitud Ey</label>
            <input id="amplitude-y" type="range" min="0.2" max="2.2" step="0.1" value={amplitudeY} onChange={(event) => setAmplitudeY(Number(event.target.value))} />
            <span>{amplitudeY.toFixed(1)}</span>
          </div>

          <div className="control-group">
            <label htmlFor="phase-delta">Diferencia de fase δ</label>
            <input id="phase-delta" type="range" min="-180" max="180" step="5" value={phaseDelta} onChange={(event) => setPhaseDelta(Number(event.target.value))} />
            <span>{phaseDelta}°</span>
          </div>

          <div className="control-group">
            <label htmlFor="rotation">Rotación</label>
            <input id="rotation" type="range" min="-90" max="90" step="1" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} />
            <span>{rotation}°</span>
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
                <button type="button" className="btn btn-secondary" onClick={resetToDefaults}>
                  Restablecer
                </button>
              </div>
              {problem.quickCases.filter(isActiveCase).map((quickCase) => (
                <p key={quickCase.label} className="hero-caption">{quickCase.description}</p>
              ))}
            </div>
          )}

          <div className="state-pill">Estado actual: {polarizationState}</div>
        </div>

        <div className="simulator-display-column">
          <div className="simulator-display" aria-label="Simulación de polarización">
            <svg viewBox="-2.8 -2.8 5.6 5.6" role="img" aria-label="Traza del estado de polarización">
              <rect x="-2.6" y="-2.6" width="5.2" height="5.2" className="plot-background" />
              <line x1="-2.6" x2="2.6" y1="0" y2="0" className="guide-line" />
              <line x1="0" x2="0" y1="-2.6" y2="2.6" className="guide-line" />
              <line x1="-2.6" x2="2.6" y1="1.3" y2="1.3" className="grid-line" />
              <line x1="-2.6" x2="2.6" y1="-1.3" y2="-1.3" className="grid-line" />
              <line x1="1.3" x2="1.3" y1="-2.6" y2="2.6" className="grid-line" />
              <line x1="-1.3" x2="-1.3" y1="-2.6" y2="2.6" className="grid-line" />
              <path d={`${pathD} Z`} className="ellipse-path" />
              <line x1="0" y1="0" x2={vectorRotX} y2={vectorRotY} className="vector-line" />
              <circle cx={vectorRotX} cy={vectorRotY} r="0.08" className="vector-dot" />
              <text x="2.3" y="0.22" className="axis-label">Ex</text>
              <text x="0.12" y="-2.3" className="axis-label">Ey</text>
            </svg>
          </div>

          {isLinear && analysis?.angleDeg !== undefined && (
            <PolarizationPlaneDiagram angleDeg={analysis.angleDeg} />
          )}
        </div>
      </section>

      {analysis && (
        <section className="section">
          <h2>5. Resultados del análisis matemático</h2>
          <p>Se recalcula automáticamente a partir de los valores actuales del simulador.</p>

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

          <div className="state-pill">✔ {analysis.conclusionLabel}</div>
          <p className="hero-caption">{analysis.interpretation}</p>
        </section>
      )}

      <section className="section">
        <h2>{analysis ? 6 : 5}. Interpretación del resultado</h2>
        <p>
          El resultado físico muestra cómo cambian la amplitud, la fase y la orientación del vector eléctrico. Estas variaciones permiten interpretar el estado de polarización de manera visual y cuantitativa.
        </p>
      </section>

      <section className="section">
        <Link className="btn btn-secondary" to="/simulador">← Volver a Simulador</Link>
      </section>
    </main>
  );
}

export default ProblemPage;
