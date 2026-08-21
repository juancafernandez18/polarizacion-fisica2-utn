import { useMemo, useState } from 'react';
import BrewsterRayDiagram from './BrewsterRayDiagram';

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
          <BrewsterRayDiagram thetaP={thetaP} thetaR={analysis.thetaR} medium1Label="n1 (aire)" medium2Label="n2 (vidrio)" />
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
