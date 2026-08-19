import { useMemo, useState } from 'react';

const DEFAULT_PARAMS = { n1: 1, thetaP: 54.5 };

// Vidrios reales típicos rondan n ≈ 1.45–1.9; fuera de ese rango el resultado
// sigue siendo matemáticamente válido pero deja de representar un vidrio común.
const TYPICAL_GLASS_MIN = 1.3;
const TYPICAL_GLASS_MAX = 2.0;

// Motor matemático puro (sin React), siguiendo la resolución de Problema2.pdf paso a
// paso — incluyendo su redondeo intermedio: el PDF calcula n2, lo redondea a 2 cifras
// (n2 = 1,40) y USA ESE VALOR REDONDEADO en la ley de Snell del paso siguiente, en vez
// del valor sin redondear. Por eso θr da 35,55° y no exactamente 90°−θp (35,50°). Este
// motor reproduce la misma cadena para que, con los valores del enunciado, el resultado
// coincida exactamente con el PDF.
// 1) tan(θp) = n2/n1 → n2 = n1·tan(θp)
// 2) Ley de Snell, con n2 ya redondeado: n1·sen(θp) = n2·sen(θr) → θr = sen⁻¹(n1·sen(θp)/n2)
function computeBrewsterAnalysis({ n1, thetaP }) {
  const thetaPRad = (thetaP * Math.PI) / 180;
  const n2 = n1 * Math.tan(thetaPRad);
  const n2Rounded = Math.round(n2 * 100) / 100;
  const sinThetaR = Math.min(1, Math.max(-1, (n1 * Math.sin(thetaPRad)) / n2Rounded));
  const thetaRRad = Math.asin(sinThetaR);
  const thetaR = (thetaRRad * 180) / Math.PI;
  const complementCheck = thetaP + thetaR;
  const isTypicalGlass = n2 >= TYPICAL_GLASS_MIN && n2 <= TYPICAL_GLASS_MAX;

  const n1Label = n1.toFixed(2);
  const thetaPLabel = thetaP.toFixed(1);
  const n2Label = n2Rounded.toFixed(2);
  const thetaRLabel = thetaR.toFixed(2);

  const steps = [
    {
      label: 'Datos ingresados',
      lines: [
        `n1 (medio incidente) = ${n1Label}`,
        `θp = θi = ${thetaPLabel}° (ángulo de incidencia = ángulo de polarización, ya que el reflejado sale totalmente polarizado)`
      ]
    },
    {
      label: 'Principio físico — Ley de Brewster',
      lines: ['tan(θp) = n2 / n1']
    },
    {
      label: 'Despejando el índice de refracción del segundo medio',
      lines: [`n2 = n1 · tan(θp) = ${n1Label} × tan(${thetaPLabel}°)`, `n2 = ${n2Label}`]
    },
    {
      label: 'Ley de Snell de la refracción',
      lines: ['n1 · sen(θp) = n2 · sen(θr)']
    },
    {
      label: 'Despejando el ángulo de refracción',
      lines: [
        `θr = sen⁻¹( n1 · sen(θp) / n2 ) = sen⁻¹( ${n1Label} × sen(${thetaPLabel}°) / ${n2Label} )`,
        `θr = ${thetaRLabel}°`
      ]
    },
    {
      label: 'Verificación física (reflejado ⟂ refractado)',
      lines: Math.abs(complementCheck - 90) < 0.005
        ? [`θp + θr = ${thetaPLabel}° + ${thetaRLabel}° = ${complementCheck.toFixed(2)}° ✓ exactamente 90°`]
        : [
            `θp + θr = ${thetaPLabel}° + ${thetaRLabel}° = ${complementCheck.toFixed(2)}°`,
            `✓ ≈ 90° (la diferencia de ${Math.abs(complementCheck - 90).toFixed(2)}° se debe a redondear n2 a 2 cifras antes de aplicar Snell, igual que en la resolución original)`
          ]
    }
  ];

  const conclusionLabel = `n2 = ${n2Label}  ·  θr = ${thetaRLabel}°`;
  const interpretation = `Con n1 = ${n1Label} y un ángulo de incidencia de ${thetaPLabel}°, el segundo medio necesita un índice de refracción n2 = ${n2Label} para que ese ángulo sea el ángulo de Brewster. En esas condiciones el rayo reflejado queda 100% polarizado linealmente (con su campo eléctrico paralelo a la superficie), mientras que el rayo refractado conserva solo una polarización parcial.`;

  return { steps, conclusionLabel, interpretation, n2: n2Rounded, thetaR, complementCheck, isTypicalGlass };
}

const toRad = (deg) => (deg * Math.PI) / 180;

function unitPerp(dx, dy) {
  const len = Math.hypot(dx, dy) || 1;
  return { x: -dy / len, y: dx / len };
}

function arrowheadPoints(tip, dir) {
  const arrowLen = 0.16;
  const arrowWidth = 0.12;
  const perp = unitPerp(dir.x, dir.y);
  const base = { x: tip.x - dir.x * arrowLen, y: tip.y - dir.y * arrowLen };
  const corner1 = { x: base.x + perp.x * arrowWidth / 2, y: base.y + perp.y * arrowWidth / 2 };
  const corner2 = { x: base.x - perp.x * arrowWidth / 2, y: base.y - perp.y * arrowWidth / 2 };
  return [tip, corner1, corner2].map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' ');
}

// Marcadores de polarización a lo largo de un rayo: puntos = vector E saliendo/entrando
// de la página (perpendicular al plano de incidencia); trazos = E en el plano de la
// página (paralelo al plano de incidencia). 'unpolarized' alterna ambos (luz natural),
// 'perpendicular' solo puntos (reflejado, totalmente polarizado), 'partial' mayoría
// puntos con algunos trazos (refractado, parcialmente polarizado).
function buildPolarizationMarkers(p1, p2, kind) {
  const count = 5;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const perp = { x: -dy / len, y: dx / len };
  const markers = [];
  for (let i = 1; i <= count; i += 1) {
    const t = i / (count + 1);
    const point = { x: p1.x + dx * t, y: p1.y + dy * t };
    let dot = false;
    let tick = false;
    if (kind === 'unpolarized') {
      dot = i % 2 === 0;
      tick = i % 2 !== 0;
    } else if (kind === 'perpendicular') {
      dot = true;
    } else if (kind === 'partial') {
      dot = true;
      tick = i % 2 !== 0;
    }
    markers.push({ point, perp, dot, tick });
  }
  return markers;
}

function shortArc(dir1, dir2, r) {
  const a1 = Math.atan2(dir1.y, dir1.x);
  const a2 = Math.atan2(dir2.y, dir2.x);
  let diff = a2 - a1;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  const sweepFlag = diff > 0 ? 1 : 0;
  const p1 = { x: dir1.x * r, y: dir1.y * r };
  const p2 = { x: dir2.x * r, y: dir2.y * r };
  return {
    d: `M ${p1.x.toFixed(3)} ${p1.y.toFixed(3)} A ${r} ${r} 0 0 ${sweepFlag} ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`,
    midAngle: a1 + diff / 2
  };
}

// Posiciones fijas de los nombres de cada rayo: no dependen de θp/θr, así el
// texto no se mueve ni sigue a la línea cuando el usuario mueve el slider.
// Se ubican pegadas a los bordes del diagrama (mismo criterio que "n1 (aire)"
// / "n2 (vidrio)"), en las cuatro esquinas, ancladas hacia adentro
// (textAnchor "start" a la izquierda, "end" a la derecha) para que el texto
// crezca hacia el centro del diagrama en vez de salirse del viewBox. Los rayos
// tienen como máximo radio 2.15 desde el origen; estas posiciones quedan
// siempre a radio mayor a esa distancia, así el texto nunca queda cerca de
// una flecha sin importar el ángulo θp elegido.
const RAY_NAME_LABELS = {
  incident: { x: -2.45, y: -2.0, anchor: 'start', text: 'Rayo incidente' },
  reflected: { x: 2.45, y: -2.0, anchor: 'end', text: 'Rayo reflejado' },
  refracted: { x: 2.45, y: 2.45, anchor: 'end', text: 'Rayo refractado' }
};

// Diagrama de rayos: interfaz horizontal (y=0), aire arriba (y<0), vidrio abajo (y>0).
// El rayo incidente llega desde arriba-izquierda, el reflejado sale hacia arriba-derecha
// y el refractado continúa hacia abajo-derecha, todos coincidiendo en el punto de
// incidencia (origen). El arco de 90° entre reflejado y refractado es la propiedad que
// define al ángulo de Brewster.
function BrewsterRayDiagram({ thetaP, thetaR }) {
  const thetaPRad = toRad(thetaP);
  const thetaRRad = toRad(thetaR);
  const L = 2.15;

  const incidentDir = { x: Math.sin(thetaPRad), y: -Math.cos(thetaPRad) };
  const reflectedDir = { x: Math.sin(thetaPRad), y: -Math.cos(thetaPRad) };
  // reflectedDir se refleja respecto a la normal: mismo ángulo, lado opuesto en x.
  reflectedDir.x = -Math.sin(thetaPRad);
  const refractedDir = { x: Math.sin(thetaRRad), y: Math.cos(thetaRRad) };

  const incidentSource = { x: -Math.sin(thetaPRad) * L, y: -Math.cos(thetaPRad) * L };
  const reflectedTip = { x: Math.sin(thetaPRad) * L, y: -Math.cos(thetaPRad) * L };
  const refractedTip = { x: Math.sin(thetaRRad) * L, y: Math.cos(thetaRRad) * L };
  const origin = { x: 0, y: 0 };

  const incidentArrow = arrowheadPoints(origin, incidentDir);
  const reflectedArrow = arrowheadPoints(reflectedTip, { x: Math.sin(thetaPRad), y: -Math.cos(thetaPRad) });
  const refractedArrow = arrowheadPoints(refractedTip, refractedDir);

  const incidentMarkers = buildPolarizationMarkers(incidentSource, origin, 'unpolarized');
  const reflectedMarkers = buildPolarizationMarkers(origin, reflectedTip, 'perpendicular');
  const refractedMarkers = buildPolarizationMarkers(origin, refractedTip, 'partial');

  const normalUp = { x: 0, y: -1 };
  const normalDown = { x: 0, y: 1 };
  const incidentBackDir = { x: -Math.sin(thetaPRad), y: -Math.cos(thetaPRad) };
  const reflectedOutDir = { x: Math.sin(thetaPRad), y: -Math.cos(thetaPRad) };

  const thetaPArcIn = shortArc(normalUp, incidentBackDir, 0.55);
  const thetaPArcOut = shortArc(normalUp, reflectedOutDir, 0.55);
  const thetaRArc = shortArc(normalDown, refractedDir, 0.55);
  const rightAngleArc = shortArc(reflectedOutDir, refractedDir, 0.95);

  const labelAt = (arc, r) => ({ x: r * Math.cos(arc.midAngle), y: r * Math.sin(arc.midAngle) });
  const thetaPInLabel = labelAt(thetaPArcIn, 0.85);
  const thetaPOutLabel = labelAt(thetaPArcOut, 0.85);
  const thetaRLabelPos = labelAt(thetaRArc, 0.85);
  const rightAngleLabel = labelAt(rightAngleArc, 1.25);


  const renderMarkers = (markers, className) => markers.map((m, index) => (
    <g key={`${className}-${index}`}>
      {m.dot && <circle cx={m.point.x.toFixed(3)} cy={m.point.y.toFixed(3)} r="0.05" className="pol-dot" />}
      {m.tick && (
        <line
          x1={(m.point.x - m.perp.x * 0.13).toFixed(3)}
          y1={(m.point.y - m.perp.y * 0.13).toFixed(3)}
          x2={(m.point.x + m.perp.x * 0.13).toFixed(3)}
          y2={(m.point.y + m.perp.y * 0.13).toFixed(3)}
          className="pol-tick"
        />
      )}
    </g>
  ));

  return (
    <div className="simulator-display" aria-label="Diagrama de reflexión y refracción en el ángulo de Brewster">
      <svg viewBox="-2.8 -2.8 5.6 5.6" role="img" aria-label="Rayo incidente, reflejado y refractado sobre una interfaz aire-vidrio">
        <rect x="-2.6" y="-2.6" width="5.2" height="2.6" className="medium-fill-air" />
        <rect x="-2.6" y="0" width="5.2" height="2.6" className="medium-fill-glass" />
        <line x1="-2.6" x2="2.6" y1="0" y2="0" className="interface-line" />
        <line x1="0" y1="-2.5" x2="0" y2="2.5" className="normal-line" />

        <path d={thetaPArcIn.d} className="angle-arc" />
        <path d={thetaPArcOut.d} className="angle-arc" />
        <path d={thetaRArc.d} className="angle-arc" />
        <path d={rightAngleArc.d} className="angle-arc angle-arc-right" />

        <line x1={incidentSource.x.toFixed(3)} y1={incidentSource.y.toFixed(3)} x2={origin.x} y2={origin.y} className="ray-incident" />
        <polygon points={incidentArrow} className="ray-incident-arrow" />
        {renderMarkers(incidentMarkers, 'inc')}

        <line x1={origin.x} y1={origin.y} x2={reflectedTip.x.toFixed(3)} y2={reflectedTip.y.toFixed(3)} className="ray-reflected" />
        <polygon points={reflectedArrow} className="ray-reflected-arrow" />
        {renderMarkers(reflectedMarkers, 'refl')}

        <line x1={origin.x} y1={origin.y} x2={refractedTip.x.toFixed(3)} y2={refractedTip.y.toFixed(3)} className="ray-refracted" />
        <polygon points={refractedArrow} className="ray-refracted-arrow" />
        {renderMarkers(refractedMarkers, 'refr')}

        <text x={thetaPInLabel.x.toFixed(3)} y={thetaPInLabel.y.toFixed(3)} className="axis-label">θp</text>
        <text x={thetaPOutLabel.x.toFixed(3)} y={thetaPOutLabel.y.toFixed(3)} className="axis-label">θp</text>
        <text x={thetaRLabelPos.x.toFixed(3)} y={thetaRLabelPos.y.toFixed(3)} className="axis-label">θr</text>
        <text x={rightAngleLabel.x.toFixed(3)} y={rightAngleLabel.y.toFixed(3)} className="axis-label angle-right-label">90°</text>

        <text x={RAY_NAME_LABELS.incident.x} y={RAY_NAME_LABELS.incident.y} textAnchor={RAY_NAME_LABELS.incident.anchor} className="axis-label ray-name-label">{RAY_NAME_LABELS.incident.text}</text>
        <text x={RAY_NAME_LABELS.reflected.x} y={RAY_NAME_LABELS.reflected.y} textAnchor={RAY_NAME_LABELS.reflected.anchor} className="axis-label ray-name-label">{RAY_NAME_LABELS.reflected.text}</text>
        <text x={RAY_NAME_LABELS.refracted.x} y={RAY_NAME_LABELS.refracted.y} textAnchor={RAY_NAME_LABELS.refracted.anchor} className="axis-label ray-name-label">{RAY_NAME_LABELS.refracted.text}</text>

        <text x="-2.45" y="-2.3" className="axis-label medium-label">n1 (aire)</text>
        <text x="-2.45" y="2.45" className="axis-label medium-label">n2 (vidrio)</text>
        <text x="0.1" y="-2.55" className="axis-label">Normal</text>
      </svg>
    </div>
  );
}

// Simulador del Problema 2 (ángulo de Brewster / polarización por reflexión).
// Estado propio e independiente del simulador Ex/Ey/δ de Problema 1.
function BrewsterSimulator() {
  const [n1, setN1] = useState(DEFAULT_PARAMS.n1);
  const [thetaP, setThetaP] = useState(DEFAULT_PARAMS.thetaP);

  const resetToDefaults = () => {
    setN1(DEFAULT_PARAMS.n1);
    setThetaP(DEFAULT_PARAMS.thetaP);
  };

  const isDefault = n1 === DEFAULT_PARAMS.n1 && thetaP === DEFAULT_PARAMS.thetaP;

  const analysis = useMemo(() => computeBrewsterAnalysis({ n1, thetaP }), [n1, thetaP]);

  return (
    <>
      <section className="section simulator-section">
        <div className="simulator-controls">
          <h2>4. Simulación interactiva</h2>
          <p>Modificá el índice del medio incidente y el ángulo de incidencia, y observá cómo cambian el índice del vidrio y el ángulo de refracción.</p>

          <div className="control-group">
            <label htmlFor="n1-index">Índice de refracción n1 (medio incidente)</label>
            <input id="n1-index" type="range" min="1" max="2" step="0.01" value={n1} onChange={(event) => setN1(Number(event.target.value))} />
            <span>{n1.toFixed(2)}</span>
          </div>

          <div className="control-group">
            <label htmlFor="theta-p">Ángulo de incidencia θp</label>
            <input id="theta-p" type="range" min="1" max="89" step="0.1" value={thetaP} onChange={(event) => setThetaP(Number(event.target.value))} />
            <span>{thetaP.toFixed(1)}°</span>
          </div>

          <div className="quick-cases">
            <div className="quick-case-buttons">
              <button type="button" className={`btn ${isDefault ? 'btn-primary' : 'btn-secondary'}`} onClick={resetToDefaults}>
                Restablecer al enunciado
              </button>
            </div>
            <p className="hero-caption">
              Valores del enunciado: n1 = 1 (aire), θp = 54,5° → n2 = 1,40 y θr = 35,55°.
            </p>
          </div>

          {!analysis.isTypicalGlass && (
            <p className="warning-note">
              ⚠ Con estos parámetros n2 = {analysis.n2.toFixed(2)}, fuera del rango típico de un vidrio real (≈1,30–2,00). El resultado sigue siendo matemáticamente válido.
            </p>
          )}

          <div className="state-pill">n2 = {analysis.n2.toFixed(2)}  ·  θr = {analysis.thetaR.toFixed(2)}°</div>
        </div>

        <div className="simulator-display-column">
          <BrewsterRayDiagram thetaP={thetaP} thetaR={analysis.thetaR} />
          <p className="hero-caption">
            Puntos = campo E perpendicular al plano de incidencia (paralelo a la superficie). Trazos = componente de E en el plano de incidencia. El rayo reflejado solo conserva la componente perpendicular: queda totalmente polarizado.
          </p>
        </div>
      </section>

      <section className="section">
        <h2>5. Resultados del análisis matemático</h2>
        <p>Se recalcula automáticamente a partir de n1 y θp actuales, siguiendo la misma resolución que el enunciado original.</p>

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

      <section className="section">
        <h2>6. Interpretación física</h2>
        <p>
          El ángulo de Brewster es el único ángulo de incidencia para el cual el rayo reflejado y el rayo refractado quedan exactamente perpendiculares entre sí (θp + θr = 90°). En ese punto, la componente del campo eléctrico paralela al plano de incidencia no puede reflejarse — solo se transmite — por lo que la luz reflejada queda linealmente polarizada en su totalidad, con su vector E vibrando paralelo a la superficie.
        </p>
      </section>

      <section className="section">
        <h2>7. Conclusión</h2>
        <p>
          El fenómeno permite polarizar luz por reflexión sin usar ningún polarizador: alcanza con hacer incidir luz natural sobre una superficie dieléctrica exactamente en su ángulo de Brewster. Como tan(θp) = n2/n1 depende solo de los índices de refracción de los dos medios, cada combinación de materiales tiene un único ángulo de polarización.
        </p>
        <p>
          Este fenómeno es común fuera del laboratorio: la luz solar reflejada en el agua, en el vidrio o en la nieve queda parcialmente polarizada, con una componente horizontal intensa cuando la superficie reflectante es horizontal. Los anteojos de sol fabricados con material polarizador aprovechan justamente esto — bloquean esa componente y reducen el brillo (encandilamiento) de la luz reflejada.
        </p>
      </section>
    </>
  );
}

export default BrewsterSimulator;
