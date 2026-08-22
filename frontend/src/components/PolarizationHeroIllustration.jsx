// Ilustración conceptual para el hero de la Home: luz → polarizador → onda
// filtrada. A propósito NO es una pantalla del simulador (sin ejes, sin
// controles, sin valores numéricos) — es solo una composición visual que
// evoca el fenómeno, reutilizable en cualquier lugar de la Home que necesite
// esta misma idea sin duplicar el SVG.
const CENTER_Y = 190;
const WAVELENGTH = 70;
const FREQUENCY = (2 * Math.PI) / WAVELENGTH;
const DISC_1_X = 230;
const DISC_2_X = 340;
const WAVE_START_X = 108;
const WAVE_END_X = 522;

function amplitudeAt(x) {
  if (x <= DISC_1_X) return 15;
  if (x <= DISC_2_X) return 25;
  return 42;
}

function buildWaveSegment(fromX, toX) {
  const points = [];
  for (let x = fromX; x <= toX; x += 4) {
    const y = CENTER_Y + amplitudeAt(x) * Math.sin((x - WAVE_START_X) * FREQUENCY);
    points.push(`${points.length === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ');
}

function PolarizationHeroIllustration() {
  const segmentBefore = buildWaveSegment(WAVE_START_X, DISC_1_X);
  const segmentMiddle = buildWaveSegment(DISC_1_X, DISC_2_X);
  const segmentAfter = buildWaveSegment(DISC_2_X, WAVE_END_X);

  const stars = [
    { x: 40, y: 60, r: 1.4, o: 0.5 }, { x: 540, y: 50, r: 1.2, o: 0.4 },
    { x: 480, y: 300, r: 1.6, o: 0.5 }, { x: 150, y: 320, r: 1.2, o: 0.35 },
    { x: 380, y: 40, r: 1, o: 0.4 }, { x: 90, y: 260, r: 1.3, o: 0.35 },
    { x: 560, y: 190, r: 1.1, o: 0.3 }, { x: 260, y: 350, r: 1, o: 0.3 }
  ];

  return (
    <div className="hero-illustration" aria-hidden="true">
      <svg viewBox="0 0 600 380" role="img" aria-label="Ilustración conceptual: un haz de luz atraviesa dos polarizadores y su onda se transforma">
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fefce8" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#fde68a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
          <pattern id="discHatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="7" className="hero-illustration-hatch-line" />
          </pattern>
        </defs>

        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} className="hero-illustration-star-dot" style={{ opacity: s.o }} />
        ))}

        <path d={segmentBefore} className="hero-illustration-wave hero-illustration-wave-1" />
        <path d={segmentMiddle} className="hero-illustration-wave hero-illustration-wave-2" />
        <path d={segmentAfter} className="hero-illustration-wave hero-illustration-wave-3" />

        <ellipse cx={DISC_1_X} cy={CENTER_Y} rx="11" ry="60" className="hero-illustration-disc hero-illustration-disc-1" />
        <ellipse cx={DISC_2_X} cy={CENTER_Y} rx="11" ry="60" className="hero-illustration-disc hero-illustration-disc-2" />

        <g className="hero-illustration-star" style={{ transformOrigin: '70px 190px' }}>
          <circle cx="70" cy={CENTER_Y} r="26" fill="url(#starGlow)" />
          <line x1="70" y1={CENTER_Y - 22} x2="70" y2={CENTER_Y + 22} className="hero-illustration-spark" />
          <line x1="48" y1={CENTER_Y} x2="92" y2={CENTER_Y} className="hero-illustration-spark" />
          <line x1="54" y1={CENTER_Y - 16} x2="86" y2={CENTER_Y + 16} className="hero-illustration-spark hero-illustration-spark-thin" />
          <line x1="54" y1={CENTER_Y + 16} x2="86" y2={CENTER_Y - 16} className="hero-illustration-spark hero-illustration-spark-thin" />
          <circle cx="70" cy={CENTER_Y} r="4.5" className="hero-illustration-star-core" />
        </g>
      </svg>
    </div>
  );
}

export default PolarizationHeroIllustration;
