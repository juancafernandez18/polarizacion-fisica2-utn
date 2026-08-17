# ROADMAP — PolarLab

Este documento resume el estado actual del proyecto y el trabajo previsto. Se actualiza a medida que avanza el desarrollo; no es una promesa de fechas, es una guía de prioridades.

---

## Estado actual

- Landing (`HomePage`), índice de simulador (`SimulatorIndexPage`) y página de problema (`ProblemPage`) implementadas con React + Vite + JavaScript plano (sin TypeScript todavía).
- `ProblemPage.jsx` ya no contiene la lógica de simulación inline: cada problema declara un `simulatorKind` (`'ellipse'`, `'brewster'`) y `ProblemPage` delega el render de las secciones "Simulación interactiva" / "Resultados del análisis matemático" al componente correspondiente en `src/components/`. Este es el primer paso concreto de la migración descrita más abajo (punto 3).
- **Problema 1** (`src/components/EllipsePolarizationSimulator.jsx`): simulador Ex/Ey/δ/rotación con SVG y `requestAnimationFrame`, extraído sin cambios de comportamiento desde `ProblemPage.jsx`. Incluye los tres casos del enunciado oficial (`Problema1.pdf`) como botones "Modo Resolver" (Caso A/B/C/Restablecer), la sección "Resultados del análisis matemático" (`buildProblema1Analysis`) verificada línea por línea contra el PDF, y `PolarizationPlaneDiagram` para el caso lineal. `HomePage.jsx` sigue teniendo su propia copia reducida del mismo simulador para la vista previa del hero (duplicación consciente, ver `Pendiente` abajo).
- **Problema 2** (`src/components/BrewsterSimulator.jsx`): ángulo de Brewster / polarización por reflexión, implementado a partir de `Problema2.pdf` (el PDF real trata este fenómeno, no Ley de Malus como decía un placeholder anterior sin fuente). Controles interactivos n1 (medio incidente) y θp (ángulo de incidencia = ángulo de polarización); calcula n2 = n1·tan(θp) y θr por ley de Snell, replicando el redondeo intermedio del PDF (n2 se redondea a 2 cifras antes de aplicarlo en Snell) para que los valores por defecto coincidan exactamente con el enunciado (n2 = 1,40, θr = 35,55°/35,56° según redondeo). Diagrama SVG propio del rayo incidente/reflejado/refractado con marcadores de polarización (puntos = E perpendicular al plano de incidencia, trazos = E paralelo) y el arco de 90° que define el ángulo de Brewster. Marco teórico y conclusión cruzados contra `docs/teoria/TeoriaModulo2.md` (transcripción del video de la cátedra): se agregó la mención del caso general (fuera del ángulo de Brewster la reflexión es solo parcialmente polarizada) y el ejemplo real que da el profesor (reflejos en agua/vidrio/nieve, anteojos de sol polarizados).
- **Problema 3**: sin PDF de la cátedra cargado todavía. Se muestra como "Próximamente" (`problemData['problema-3'].comingSoon`), sin física inventada — ver `Próximos módulos`.
- Sección 3 de Problema 1 incluye además los tres enunciados oficiales a/b/c (`problemData['problema-1'].casesSummary`), como referencia estática de la cátedra, con link conceptual a los botones "Caso A/B/C" y a la sección 5.
- Estilos en un único `styles.css` global, con un breakpoint responsive (700px).

## Pendiente — Módulo 1 (Polarización)

Según los criterios de aceptación de `MODULO_1_POLARIZACION.md`:

- [ ] Detección automática del estado de polarización expuesta como resultado explícito (tipo + condiciones detectadas), no solo como texto derivado inline (el pill "Estado actual" sigue usando solo Lineal/Circular/Elíptica; la distinción derecha/izquierda hoy vive únicamente en la sección de análisis matemático).
- [ ] Explicación textual generada según el resultado detectado (`ExplanationCard` en la arquitectura planeada) — parcialmente cubierto por la sección de análisis matemático de Problema 1 y Problema 2.
- [ ] Migrar la lógica matemática (`calculateEx`, `calculateEy`, detección de estado, `computeBrewsterAnalysis`) a utilidades independientes de React bajo `utils/`, reutilizables entre páginas — hoy cada simulador la trae inline en su propio componente de `src/components/`. Ambas ya son funciones puras sin dependencias de React, pensadas para poder moverse sin cambios cuando se haga esta migración.
- [ ] `HomePage.jsx` sigue duplicando una versión reducida del simulador Ex/Ey/δ para la vista previa del hero, en vez de reutilizar `EllipsePolarizationSimulator`. No se unificó en esta iteración porque el hero usa un subconjunto mínimo (sin controles) — evaluar si conviene una variante `compact` del componente.
- [ ] Sección "Resultados del análisis matemático" para Problema 3 — bloqueada hasta contar con el PDF oficial de la cátedra para ese problema (ver `Próximos módulos`).

## Migración de arquitectura

`Arquitectura modulo1.md` describe la estructura objetivo (TypeScript, TailwindCSS, Canvas, `hooks/`, `utils/`, `types/`, componentes bajo `components/polarization/`). El código actual no sigue esa estructura todavía. Migrar de forma incremental:

1. Extraer el motor matemático (`polarizationMath.ts` / `.js`) fuera de los componentes de página.
2. Extraer el detector de estado (`polarizationDetector.ts` / `.js`).
3. ~~Dividir `ProblemPage.jsx` en subcomponentes~~ — hecho parcialmente: `EllipsePolarizationSimulator.jsx` y `BrewsterSimulator.jsx` viven en `src/components/` y `ProblemPage.jsx` delega en ellos por `simulatorKind`. Falta todavía extraer subcomponentes más finos (`ParameterPanel`, `ResultCard`, `ExplanationCard`) dentro de cada simulador y eliminar la duplicación restante con `HomePage.jsx`.
4. Evaluar la adopción de TypeScript y TailwindCSS solo cuando haya justificación concreta (no como paso obligatorio previo a lo anterior).

## Próximos módulos

- **Problema 3**: pendiente de que la cátedra provea el PDF con el enunciado y la resolución oficial. Hasta entonces la ruta `/simulador/problema-3` muestra un estado "Próximamente" en vez de contenido inventado (ver `PROJECT_CONTEXT.md`: toda la teoría debe basarse en material oficial, no en fuentes externas).
- **Ley de Malus**: no tiene todavía un problema numerado de la guía asociado en este repositorio; se incorporará como módulo nuevo (con su propio `simulatorKind`) si/cuando la cátedra provea su enunciado en PDF.

Cada módulo nuevo debe agregar su propio componente en `src/components/` y declarar su `simulatorKind` en `problemData`, sin modificar el código de los módulos existentes (ver principio de escalabilidad en `../Arquitectura modulo1.md`).

## Fuera de alcance por ahora

- Backend o persistencia de datos (no existe backend en este repo).
- Autenticación o perfiles de usuario — el campo "Nombre" del footer es solo un input local sin guardado.
- Tests automatizados y linting — no hay scripts configurados en `frontend/package.json` todavía.
