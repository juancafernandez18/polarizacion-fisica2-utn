import { useEffect, useState } from 'react';

const theoryModules = [
  {
    title: 'Módulo 1: Conceptos fundamentales de polarización',
    description: 'Introducción al comportamiento del campo eléctrico en ondas electromagnéticas. Diferencia entre luz natural y luz polarizada.',
    topics: ['Onda electromagnética', 'Campo eléctrico y magnético', 'Dirección de propagación', 'Estados de polarización']
  },
  {
    title: 'Módulo 2: Estados de polarización',
    description: 'Análisis de las trayectorias del vector campo eléctrico y clasificación de los estados de polarización.',
    topics: ['Polarización lineal', 'Polarización circular', 'Polarización elíptica']
  },
  {
    title: 'Módulo 3: Métodos de obtención de luz polarizada',
    description: 'Métodos físicos utilizados para generar luz polarizada.',
    topics: ['Polarizadores Polaroid', 'Ley de Malus', 'Polarización por reflexión', 'Ángulo de Brewster', 'Dispersión', 'Doble refracción']
  }
];

const practiceCards = [
  {
    title: 'Problema 1',
    description: 'Primer ejercicio práctico a simular',
    link: '/Problema1.pdf'
  },
  {
    title: 'Ley de Malus',
    description: 'Análisis del paso de luz polarizada a través de un polarizador',
    link: '#'
  },
  {
    title: 'Polarización por reflexión',
    description: 'Estudio del comportamiento de la luz al incidir sobre superficies',
    link: '#'
  },
  {
    title: 'Ángulo de Brewster',
    description: 'Aplicación del ángulo crítico para la polarización por reflexión',
    link: '#'
  }
];

function HomePage() {
  const [amplitudeX, setAmplitudeX] = useState(1.4);
  const [amplitudeY, setAmplitudeY] = useState(1.0);
  const [phaseDelta, setPhaseDelta] = useState(90);
  const [rotation, setRotation] = useState(15);
  const [time, setTime] = useState(0);

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

  const ellipsePoints = Array.from({ length: 220 }, (_, index) => {
    const angle = (index / 219) * 2 * Math.PI;
    const x = amplitudeX * Math.cos(angle);
    const y = amplitudeY * Math.cos(angle + phaseRad);
    const rotatedX = x * Math.cos(rotationRad) - y * Math.sin(rotationRad);
    const rotatedY = x * Math.sin(rotationRad) + y * Math.cos(rotationRad);

    return { x: rotatedX, y: rotatedY };
  });

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

  const stepComments = [
    `Ex = ${amplitudeX.toFixed(1)} y Ey = ${amplitudeY.toFixed(1)}. La amplitud de cada componente define la energía relativa de la onda.`,
    `Δδ = ${phaseDelta}°. La diferencia de fase determina si la superposición produce una recta, una elipse o un círculo.`,
    `Rotación = ${rotation}°. El sistema gira para mostrar cómo cambia la orientación del vector resultante.`,
    `Estado observado: ${polarizationState}. La trayectoria resultante se refleja visualmente en la figura.`
  ];

  return (
    <main className="page home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">PolarLab · Física II</p>
          <h1>PolarLab</h1>
          <h2>Laboratorio virtual de polarización</h2>
          <p className="lead">
            Simulador interactivo para estudiar los fenómenos de polarización de la luz,
            comprender sus fundamentos físicos y resolver problemas mediante modelos visuales.
          </p>
          <div className="hero-actions">
            <a className="btn btn-secondary" href="#theory">Explorar teoría</a>
            <a className="btn btn-primary" href="/simulador">Ir al simulador</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="simulator-display" aria-label="Vista previa en vivo de la simulación de polarización">
            <svg viewBox="-2.8 -2.8 5.6 5.6" role="img" aria-label="Traza del estado de polarización">
              <rect x="-2.6" y="-2.6" width="5.2" height="5.2" className="plot-background" />
              <line x1="-2.6" x2="2.6" y1="0" y2="0" className="guide-line" />
              <line x1="0" x2="0" y1="-2.6" y2="2.6" className="guide-line" />
              <path d={`${pathD} Z`} className="ellipse-path" />
              <line x1="0" y1="0" x2={vectorRotX} y2={vectorRotY} className="vector-line" />
              <circle cx={vectorRotX} cy={vectorRotY} r="0.08" className="vector-dot" />
              <text x="2.3" y="0.22" className="axis-label">Ex</text>
              <text x="0.12" y="-2.3" className="axis-label">Ey</text>
            </svg>
          </div>
          <div className="state-pill">Estado actual: {polarizationState}</div>
          <p className="hero-caption">{stepComments[3]}</p>
        </div>
      </section>

      <section className="section">
        <h2>¿Qué es PolarLab?</h2>
        <p>
          PolarLab transforma los conceptos teóricos del módulo de polarización en una experiencia
          interactiva donde se pueden visualizar estados de polarización, analizar campos eléctricos
          y experimentar con diferentes parámetros físicos.
        </p>
      </section>

      <section id="theory" className="section">
        <h2>Fundamentos teóricos</h2>
        <div className="cards">
          {theoryModules.map((module) => (
            <article key={module.title} className="card">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <div className="topic-tags">
                {module.topics.map((topic) => (
                  <span key={topic} className="topic-tag">{topic}</span>
                ))}
              </div>
              <a className="text-link" href="#">Ver teoría</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Resolución de problemas</h2>
        <p>
          Aplica los conceptos estudiados resolviendo ejercicios de la guía de problemas de Polarización.
        </p>
        <div className="cards compact">
          {practiceCards.map((item) => (
            <article key={item.title} className="card practice-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.link !== '#' ? (
                <a className="text-link" href={item.link} target="_blank" rel="noreferrer">Abrir PDF</a>
              ) : (
                <span className="text-link muted-link">Próximamente</span>
              )}
            </article>
          ))}
        </div>
        <a className="btn btn-secondary" href="/simulador">Comenzar ejercicios</a>
      </section>
    </main>
  );
}

export default HomePage;
