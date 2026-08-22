# STYLE GUIDE — PolarLab

Convenciones de código y diseño observadas y esperadas en `frontend/`. El objetivo es mantener consistencia sin introducir herramientas o abstracciones que el proyecto no usa todavía (ver `docs/ROADMAP.md` para qué está planeado pero no implementado).

---

## Lenguaje y estructura de componentes

- JavaScript plano con JSX (`.jsx`), no TypeScript, hasta que el roadmap indique la migración.
- Componentes funcionales con hooks (`useState`, `useEffect`, `useMemo`). No usar clases.
- Un componente de página por archivo en `frontend/src/pages/`, exportado como `export default function NombrePage()`.
- Cada problema con simulación propia vive en su propio componente en `frontend/src/components/` (ver `EllipsePolarizationSimulator.jsx`, `BrewsterSimulator.jsx`, `BrewsterWaterGlassSimulator.jsx`), no inline en `ProblemPage.jsx`. `problemData` en `ProblemPage.jsx` declara qué simulador usa cada problema mediante el campo `simulatorKind`, y `ProblemPage.jsx` lo renderiza por lookup en el objeto `simulators`. Un problema nuevo agrega su propio componente sin modificar los de los demás (ver `Arquitectura modulo1.md`, sección Escalabilidad).
- Cuando dos problemas comparten el mismo fenómeno físico con datos de entrada distintos (ver `BrewsterSimulator.jsx` y `BrewsterWaterGlassSimulator.jsx`, ambos ángulo de Brewster), se generaliza y comparte únicamente la parte puramente visual/geométrica (ver `BrewsterRayDiagram.jsx`, parametrizado por `medium1Label`/`medium2Label`) — la lógica matemática de cada problema (orden de derivación, pasos mostrados, redondeos) se mantiene en una función pura separada por componente, nunca compartida ni parametrizada con un flag de "modo".
- Animaciones siempre con `window.requestAnimationFrame`; nunca `setInterval`/`setTimeout` para loops de animación (ver `Arquitectura modulo1.md`).
- Los datos de contenido (problemas, módulos de teoría) se definen como objetos/arrays planos al inicio del archivo (ver `problemData` en `ProblemPage.jsx`, `problems` en `SimulatorIndexPage.jsx`, `theoryModules`/`practiceCards` en `HomePage.jsx`), no hardcodeados dentro del JSX.
- La lógica matemática de la simulación no debe depender de React (sin hooks, sin JSX) — debe poder llamarse como función pura, aunque hoy todavía esté inline dentro de los componentes. Excepción: cuando una fórmula es explícitamente pensada para reutilizarse en más de un problema (ver `frontend/src/utils/malusLaw.js`, la Ley de Malus), va en `frontend/src/utils/` en vez de vivir dentro del componente — primer caso real de esa carpeta; el resto de la migración de matemática a `utils/` sigue pendiente (ver ROADMAP).

## Estilos (CSS)

- Un único stylesheet global, `frontend/src/styles.css`. No se usan CSS Modules ni styled-components.
- Paleta: fondo oscuro degradado (`#07111f` → `#10253e`), texto claro (`#e8f0ff`, `#f8fafc`), acento celeste (`#7dd3fc`, `#38bdf8`), acento de énfasis puntual en ámbar (`#fbbf24`) para el punto del vector.
- Bloques de contenido reutilizan las clases existentes en vez de crear nuevas equivalentes: `.section` (bloque con fondo translúcido), `.card`/`.cards` (grid de tarjetas con `auto-fit`), `.btn`/`.btn-primary`/`.btn-secondary`, `.text-link`, `.breadcrumb`.
- Dos formas válidas de mostrar resultados, según el caso: `.step-list`/`.step-item` para un desarrollo secuencial (pasos de resolución, uno abajo del otro); `.cards`/`.card` para un resumen final de valores independientes entre sí (ver "Resultados del análisis matemático" de `BrewsterWaterGlassSimulator.jsx`) — ya colapsa a 1 columna en mobile sin CSS adicional.
- Layouts con Flexbox y CSS Grid; unidades relativas (`rem`, `%`, `clamp()`) en vez de `px` fijos para tipografía y espaciados que deban escalar.

## Responsive (obligatorio, ver `docs/arq.md`)

- Mobile-first: todo componente nuevo debe funcionar en 360px de ancho antes de optimizarse para desktop.
- Verificar como mínimo en 360, 390, 768, 1024 y 1440px.
- Sin scroll horizontal, sin componentes exclusivos de escritorio.
- El breakpoint actual del proyecto es `@media (max-width: 700px)` en `styles.css` — agregar reglas dentro de ese bloque (o uno nuevo, documentando el motivo) en vez de duplicar selectores.
- Los elementos interactivos (sliders, botones) deben mantener un tamaño cómodo para uso táctil.

## Rutas y navegación

- Rutas declaradas en `App.jsx` con `react-router-dom`. Un nuevo problema no requiere una nueva ruta: se agrega como entrada de datos en `ProblemPage.jsx` (`problemData`) y `SimulatorIndexPage.jsx` (`problems`), ya que la ruta `/simulador/:problemId` es genérica.

## Contenido y precisión física

- Todo texto teórico o fórmula debe ser consistente con `docs/teoria/` y `docs/formulas/`. No introducir información externa a la cátedra salvo indicación explícita (ver `PROJECT_CONTEXT.md`).
- Priorizar visualización sobre texto: ninguna pantalla debe limitarse a mostrar fórmulas sin una simulación o gráfico asociado.
- Nunca agregar un botón de "Calcular": toda actualización de parámetros debe reflejarse de inmediato en la simulación.
