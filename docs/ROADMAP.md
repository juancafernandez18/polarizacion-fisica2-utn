# ROADMAP — PolarLab

Este documento resume el estado actual del proyecto y el trabajo previsto. Se actualiza a medida que avanza el desarrollo; no es una promesa de fechas, es una guía de prioridades.

---

## Estado actual

- Landing (`HomePage`), índice de simulador (`SimulatorIndexPage`) y página de problema (`ProblemPage`) implementadas con React + Vite + JavaScript plano (sin TypeScript todavía).
- Simulador de polarización (Ex, Ey, δ, rotación) funcionando con SVG y `requestAnimationFrame`, duplicado entre `HomePage.jsx` y `ProblemPage.jsx`. `HomePage.jsx` además renderiza una vista previa en vivo del mismo simulador en el hero.
- Tres problemas cargados como datos estáticos en `ProblemPage.jsx` (Problema 1: polarización, Problema 2: Ley de Malus, Problema 3: Ley de Brewster) — solo Problema 1 tiene simulación específica a su teoría; los otros dos reutilizan el mismo simulador de Ex/Ey/δ sin ajustarlo a su fenómeno.
- Problema 1 incluye los tres casos del enunciado oficial (`Problema1.pdf`) como botones de "Modo Resolver" (Caso A / Caso B / Caso C / Restablecer) en `problemData['problema-1'].quickCases`, que configuran Ex, Ey y δ automáticamente y muestran una descripción del caso seleccionado.
- Problema 1 incluye una sección "Resultados del análisis matemático" (`buildProblema1Analysis` en `ProblemPage.jsx`, registrada en `mathAnalysisBuilders` por `problemId`) que recalcula en vivo, a partir de Ex/Ey/δ, la misma secuencia de resolución que `Problema1.pdf` (sustitución numérica, identidad trigonométrica aplicable, ecuación resultante, tipo de polarización con dirección circular derecha/izquierda, interpretación física). Verificado línea por línea contra el PDF: mismas identidades, mismo signo, misma ecuación general de la elipse.
- Sección 3 de Problema 1 incluye además los tres enunciados oficiales a/b/c (`problemData['problema-1'].casesSummary`), como referencia estática de la cátedra, con link conceptual a los botones "Caso A/B/C" y a la sección 5.
- Cuando el caso activo es lineal, la sección 4 (Simulación interactiva) dibuja `PolarizationPlaneDiagram` justo debajo del gráfico Ex/Ey principal: una ilustración (no una imagen fija) del plano de polarización del PDF — el plano fijo que contiene la dirección de propagación Z y el vector E (en rojo, como en el PDF) —, recalculada en vivo con el ángulo α real. Usa X horizontal / Y vertical + Z como única diagonal a propósito: con los tres ejes a 120° simétricos el bisector X-Y (el caso Ax=Ay, el más común) queda matemáticamente colineal con Z y el plano se dibuja invisible; con esta base solo degenera en un valor puntual de α (~‑34.5°), no en el caso por defecto.
- Estilos en un único `styles.css` global, con un breakpoint responsive (700px).

## Pendiente — Módulo 1 (Polarización)

Según los criterios de aceptación de `MODULO_1_POLARIZACION.md`:

- [ ] Detección automática del estado de polarización expuesta como resultado explícito (tipo + condiciones detectadas), no solo como texto derivado inline (el pill "Estado actual" sigue usando solo Lineal/Circular/Elíptica; la distinción derecha/izquierda hoy vive únicamente en la sección de análisis matemático).
- [ ] Explicación textual generada según el resultado detectado (`ExplanationCard` en la arquitectura planeada) — parcialmente cubierto por la sección de análisis matemático de Problema 1.
- [ ] Migrar la lógica matemática (`calculateEx`, `calculateEy`, detección de estado) a utilidades independientes de React, reutilizables entre páginas — hoy está duplicada e inline en cada componente. `buildProblema1Analysis` ya es una función pura sin dependencias de React, pensada para poder moverse a `utils/` sin cambios cuando se haga esta migración.
- [ ] Sección "Resultados del análisis matemático" para Problema 2 (Ley de Malus) y Problema 3 (Ley de Brewster) — bloqueado hasta que cada uno tenga su propio simulador con las variables correctas (ángulo del polarizador; índices de refracción), ver "Próximos módulos" abajo. Armar la derivación matemática antes de eso mostraría física incorrecta (usaría Ex/Ey/δ, que no son las variables de esos problemas).

## Migración de arquitectura

`Arquitectura modulo1.md` describe la estructura objetivo (TypeScript, TailwindCSS, Canvas, `hooks/`, `utils/`, `types/`, componentes bajo `components/polarization/`). El código actual no sigue esa estructura todavía. Migrar de forma incremental:

1. Extraer el motor matemático (`polarizationMath.ts` / `.js`) fuera de los componentes de página.
2. Extraer el detector de estado (`polarizationDetector.ts` / `.js`).
3. Dividir `ProblemPage.jsx` en subcomponentes (`ParameterPanel`, `SimulationCanvas` o su equivalente SVG, `ResultCard`, `ExplanationCard`) para eliminar la duplicación con `HomePage.jsx`.
4. Evaluar la adopción de TypeScript y TailwindCSS solo cuando haya justificación concreta (no como paso obligatorio previo a lo anterior).

## Próximos módulos

Según `Arquitectura modulo1.md` (sección Escalabilidad) y los problemas ya listados en `SimulatorIndexPage.jsx`:

- **Ley de Malus** (Problema 2): requiere su propia simulación (intensidad transmitida vs. ángulo del polarizador), distinta del simulador Ex/Ey/δ actual.
- **Ángulo de Brewster** (Problema 3): requiere su propia simulación (reflexión/refracción en una interfaz), también distinta del simulador actual.

Cada módulo nuevo debe agregar sus propios componentes y utilidades sin modificar el código de los módulos existentes (ver principio de escalabilidad en `../Arquitectura modulo1.md`).

## Fuera de alcance por ahora

- Backend o persistencia de datos (no existe backend en este repo).
- Autenticación o perfiles de usuario — el campo "Nombre" del footer es solo un input local sin guardado.
- Tests automatizados y linting — no hay scripts configurados en `frontend/package.json` todavía.
