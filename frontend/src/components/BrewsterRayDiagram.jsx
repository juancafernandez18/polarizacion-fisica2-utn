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
// Se ubican pegadas a los bordes del diagrama (mismo criterio que las etiquetas
// de medio), en las cuatro esquinas, ancladas hacia adentro (textAnchor "start"
// a la izquierda, "end" a la derecha) para que el texto crezca hacia el centro
// del diagrama en vez de salirse del viewBox. Los rayos tienen como máximo
// radio 2.15 desde el origen; estas posiciones quedan siempre a radio mayor a
// esa distancia, así el texto nunca queda cerca de una flecha sin importar el
// ángulo θp elegido.
const RAY_NAME_LABELS = {
  incident: { x: -2.45, y: -2.0, anchor: 'start', text: 'Rayo incidente' },
  reflected: { x: 2.45, y: -2.0, anchor: 'end', text: 'Rayo reflejado' },
  refracted: { x: 2.45, y: 2.45, anchor: 'end', text: 'Rayo refractado' }
};

// Diagrama de rayos, compartido entre problemas que resuelven la condición de
// Brewster: interfaz horizontal (y=0), medio incidente arriba (y<0), medio
// transmitido abajo (y>0). El rayo incidente llega desde arriba-izquierda, el
// reflejado sale hacia arriba-derecha y el refractado continúa hacia
// abajo-derecha, todos coincidiendo en el punto de incidencia (origen). El
// arco de 90° entre reflejado y refractado es la propiedad que define al
// ángulo de Brewster. `medium1Label`/`medium2Label` permiten reutilizar el
// mismo diagrama con distintos pares de medios (aire/vidrio, agua/vidrio, ...)
// sin duplicar la geometría del SVG.
function BrewsterRayDiagram({ thetaP, thetaR, medium1Label = 'n1 (aire)', medium2Label = 'n2 (vidrio)' }) {
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
      <svg viewBox="-2.8 -2.8 5.6 5.6" role="img" aria-label="Rayo incidente, reflejado y refractado sobre una interfaz entre dos medios">
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

        <text x="-2.45" y="-2.3" className="axis-label medium-label">{medium1Label}</text>
        <text x="-2.45" y="2.45" className="axis-label medium-label">{medium2Label}</text>
        <text x="0.1" y="-2.55" className="axis-label">Normal</text>
      </svg>
    </div>
  );
}

export default BrewsterRayDiagram;
