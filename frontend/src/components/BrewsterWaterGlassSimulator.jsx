import { useMemo, useState } from 'react';
import BrewsterRayDiagram from './BrewsterRayDiagram';

const DEFAULT_PARAMS = { nAgua: 1.33, thetaI: 53.0 };

// Vidrios reales típicos rondan n ≈ 1.45–1.9; fuera de ese rango el resultado
// sigue siendo matemáticamente válido pero deja de representar un vidrio común.
const TYPICAL_GLASS_MIN = 1.3;
const TYPICAL_GLASS_MAX = 2.0;

const toRad = (deg) => (deg * Math.PI) / 180;

// Motor matemático puro (sin React) del Problema 3, siguiendo el orden real de
// Problema3.pdf — distinto del de Problema 2 (BrewsterSimulator.jsx): acá el
// ángulo de refracción se obtiene directo de la relación geométrica
// reflejado+refractado=90° (dato del enunciado), SIN pasar por la ley de Snell
// numéricamente, y recién después se aplica Brewster para hallar n_vidrio.
// Por eso, a diferencia de Problema 2, no hace falta redondear ningún valor
// intermedio: la verificación cruzada con Snell coincide casi exactamente.
// 1) θ_reflejado = θi                              (ley de reflexión)
// 2) θ_reflejado + θ_refractado = 90°  →  θ_refractado = 90° − θi
// 3) El ángulo de incidencia dado ES el ángulo de Brewster: θp = θi
// 4) tan(θp) = n_vidrio / n_agua  →  n_vidrio = n_agua · tan(θp)
function computeBrewsterWaterGlassAnalysis({ nAgua, thetaI }) {
  const thetaIRad = toRad(thetaI);
  const thetaReflejado = thetaI;
  const thetaRefractado = 90 - thetaI;
  const thetaP = thetaI;
  const nVidrio = nAgua * Math.tan(thetaIRad);
  const complementCheck = thetaReflejado + thetaRefractado;
  const isTypicalGlass = nVidrio >= TYPICAL_GLASS_MIN && nVidrio <= TYPICAL_GLASS_MAX;

  const snellLeft = nAgua * Math.sin(thetaIRad);
  const snellRight = nVidrio * Math.sin(toRad(thetaRefractado));
  const snellGap = Math.abs(snellLeft - snellRight);

  const nAguaLabel = nAgua.toFixed(2);
  const thetaILabel = thetaI.toFixed(1);
  const thetaRefractadoLabel = thetaRefractado.toFixed(1);
  const nVidrioLabel = nVidrio.toFixed(2);

  const steps = [
    {
      label: 'Datos ingresados',
      lines: [
        `n_agua (medio incidente) = ${nAguaLabel}`,
        `θi (ángulo de incidencia) = ${thetaILabel}°`
      ]
    },
    {
      label: 'Relación angular entre el rayo reflejado y el refractado',
      lines: [
        'θ_reflejado = θi                         (ley de reflexión)',
        `θ_reflejado + θ_refractado = 90°  →  θ_refractado = 90° − ${thetaILabel}° = ${thetaRefractadoLabel}°`
      ]
    },
    {
      label: 'Identificación de la condición de Brewster',
      lines: [
        'El ángulo de incidencia para el cual el reflejado y el refractado son perpendiculares es, por definición, el ángulo de polarización θp.',
        `θp = θi = ${thetaILabel}°`
      ]
    },
    {
      label: 'Fórmula de Brewster',
      lines: ['tan(θp) = n_vidrio / n_agua']
    },
    {
      label: 'Sustitución de valores',
      lines: [`n_vidrio = n_agua · tan(θp) = ${nAguaLabel} × tan(${thetaILabel}°)`]
    },
    {
      label: 'Cálculo',
      lines: [`n_vidrio = ${nVidrioLabel}`]
    },
    {
      label: 'Verificación cruzada con la ley de Snell',
      lines: [
        `n_agua · sen(θp) = ${snellLeft.toFixed(4)}   vs   n_vidrio · sen(θ_refractado) = ${snellRight.toFixed(4)}`,
        snellGap < 0.001
          ? '✓ coinciden (a diferencia de Problema 2, acá no hay redondeo intermedio antes de aplicar Snell)'
          : `diferencia = ${snellGap.toFixed(4)}`
      ]
    }
  ];

  const conclusionLabel = `n_vidrio = ${nVidrioLabel}`;
  const interpretation = `Con n_agua = ${nAguaLabel} y un ángulo de incidencia de ${thetaILabel}°, el vidrio necesita un índice de refracción n_vidrio = ${nVidrioLabel} para que ese ángulo sea el ángulo de Brewster. En esas condiciones el rayo reflejado queda 100% polarizado linealmente (con su campo eléctrico paralelo a la superficie), mientras que el rayo refractado conserva solo una polarización parcial.`;

  return {
    steps,
    conclusionLabel,
    interpretation,
    thetaReflejado,
    thetaRefractado,
    thetaP,
    nVidrio,
    complementCheck,
    isTypicalGlass
  };
}

// Simulador del Problema 3 (ángulo de Brewster / polarización por reflexión,
// agua→vidrio). Motor matemático y estado propios, independientes de
// BrewsterSimulator.jsx (Problema 2); reutiliza únicamente el diagrama de
// rayos compartido (BrewsterRayDiagram).
function BrewsterWaterGlassSimulator() {
  const [nAgua, setNAgua] = useState(DEFAULT_PARAMS.nAgua);
  const [thetaI, setThetaI] = useState(DEFAULT_PARAMS.thetaI);

  const resetToDefaults = () => {
    setNAgua(DEFAULT_PARAMS.nAgua);
    setThetaI(DEFAULT_PARAMS.thetaI);
  };

  const isDefault = nAgua === DEFAULT_PARAMS.nAgua && thetaI === DEFAULT_PARAMS.thetaI;

  const analysis = useMemo(() => computeBrewsterWaterGlassAnalysis({ nAgua, thetaI }), [nAgua, thetaI]);

  return (
    <>
      <section className="section simulator-section">
        <div className="simulator-controls">
          <h2>4. Simulación interactiva</h2>
          <p>Modificá el índice del agua y el ángulo de incidencia, y observá cómo cambian el ángulo de refracción y el índice del vidrio.</p>

          <div className="control-group">
            <label htmlFor="n-agua">Índice de refracción n_agua (medio incidente)</label>
            <input id="n-agua" type="range" min="1" max="2" step="0.01" value={nAgua} onChange={(event) => setNAgua(Number(event.target.value))} />
            <span>{nAgua.toFixed(2)}</span>
          </div>

          <div className="control-group">
            <label htmlFor="theta-i">Ángulo de incidencia θi</label>
            <input id="theta-i" type="range" min="1" max="89" step="0.1" value={thetaI} onChange={(event) => setThetaI(Number(event.target.value))} />
            <span>{thetaI.toFixed(1)}°</span>
          </div>

          <div className="quick-cases">
            <div className="quick-case-buttons">
              <button type="button" className={`btn ${isDefault ? 'btn-primary' : 'btn-secondary'}`} onClick={resetToDefaults}>
                Restablecer al enunciado
              </button>
            </div>
            <p className="hero-caption">
              Valores del enunciado: n_agua = 1,33, θi = 53,0° → n_vidrio ≈ 1,76 y θ_refracción = 37,0°.
            </p>
          </div>

          {!analysis.isTypicalGlass && (
            <p className="warning-note">
              ⚠ Con estos parámetros n_vidrio = {analysis.nVidrio.toFixed(2)}, fuera del rango típico de un vidrio real (≈1,30–2,00). El resultado sigue siendo matemáticamente válido.
            </p>
          )}

          <div className="state-pill">n_vidrio = {analysis.nVidrio.toFixed(2)}  ·  θ_refracción = {analysis.thetaRefractado.toFixed(1)}°</div>
        </div>

        <div className="simulator-display-column">
          <BrewsterRayDiagram thetaP={thetaI} thetaR={analysis.thetaRefractado} medium1Label="n1 (agua)" medium2Label="n2 (vidrio)" />
          <p className="hero-caption">
            Puntos = campo E perpendicular al plano de incidencia (paralelo a la superficie). Trazos = componente de E en el plano de incidencia. El rayo reflejado solo conserva la componente perpendicular: queda totalmente polarizado.
          </p>
        </div>
      </section>

      <section className="section">
        <h2>5. Análisis matemático</h2>
        <p>Se recalcula automáticamente a partir de n_agua y θi actuales, siguiendo la misma resolución que el enunciado original.</p>

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
        <h2>6. Resultados del análisis matemático</h2>
        <p>Valores recalculados en vivo a partir de n_agua y θi actuales.</p>

        <div className="cards">
          <article className="card">
            <p className="step-item-label">Ángulo de incidencia (θi)</p>
            <p className="state-pill">{thetaI.toFixed(1)}°</p>
          </article>
          <article className="card">
            <p className="step-item-label">Ángulo de reflexión</p>
            <p className="state-pill">{analysis.thetaReflejado.toFixed(1)}°</p>
          </article>
          <article className="card">
            <p className="step-item-label">Ángulo de refracción</p>
            <p className="state-pill">{analysis.thetaRefractado.toFixed(1)}°</p>
          </article>
          <article className="card">
            <p className="step-item-label">Ángulo de Brewster (θp)</p>
            <p className="state-pill">{analysis.thetaP.toFixed(1)}°</p>
          </article>
          <article className="card">
            <p className="step-item-label">Índice de refracción del agua</p>
            <p className="state-pill">{nAgua.toFixed(2)}</p>
          </article>
          <article className="card">
            <p className="step-item-label">Índice de refracción del vidrio (calculado)</p>
            <p className="state-pill">{analysis.nVidrio.toFixed(2)}</p>
          </article>
          <article className="card">
            <p className="step-item-label">Verificación: reflejado + refractado</p>
            <p className="state-pill">✔ {analysis.complementCheck.toFixed(1)}° = 90°</p>
          </article>
        </div>
      </section>

      <section className="section">
        <h2>7. Interpretación física</h2>
        <p>
          El ángulo de Brewster es el único ángulo de incidencia para el cual el rayo reflejado y el rayo refractado quedan exactamente perpendiculares entre sí (θ_reflejado + θ_refractado = 90°). En ese punto, la componente del campo eléctrico paralela al plano de incidencia no puede reflejarse — solo se transmite — por lo que la luz reflejada queda linealmente polarizada en su totalidad, con su vector E vibrando paralelo a la superficie.
        </p>
      </section>

      <section className="section">
        <h2>8. Conclusión</h2>
        <p>
          Este problema es el mismo fenómeno del Problema 2 (ángulo de Brewster), aplicado a otro par de medios: acá la luz viaja primero por agua (n≈1,33) en vez de aire (n≈1,00). Como tan(θp) = n_vidrio/n_agua depende de la razón entre los dos índices, el mismo ángulo de incidencia de 53° exige un vidrio con un índice mayor (≈1,76) que el del Problema 2 (≈1,40) para cumplir la condición de Brewster — el medio incidente cambia el resultado aunque el vidrio del otro lado sea el mismo material.
        </p>
      </section>
    </>
  );
}

export default BrewsterWaterGlassSimulator;
