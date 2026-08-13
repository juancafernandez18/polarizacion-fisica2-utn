# 8. Arquitectura Responsive

## Objetivo

PolarLab debe desarrollarse como una aplicación web totalmente responsive, garantizando una experiencia consistente en computadoras, tablets y dispositivos móviles.

La adaptabilidad forma parte de la arquitectura del sistema y no debe considerarse una mejora posterior.

---

## Principios

Todo componente desarrollado para el proyecto deberá cumplir con los siguientes principios:

- Diseño Mobile First.
- Adaptación automática a diferentes tamaños de pantalla.
- Uso de layouts flexibles mediante Flexbox y CSS Grid.
- Evitar dimensiones fijas cuando existan alternativas responsivas.
- Utilizar unidades relativas (`rem`, `%`, `vw`, `vh`) cuando corresponda.
- Mantener una correcta jerarquía visual en cualquier resolución.

---

## Componentes

Todos los componentes deberán ser responsive, incluyendo:

- Navbar
- Hero
- Tarjetas de contenido
- Paneles informativos
- Formularios
- Simulador
- Animaciones
- Diagramas
- Gráficos
- Footer

No deberá existir ningún componente exclusivo para escritorio.

---

## Simulador

El simulador constituye el núcleo del proyecto.

Por lo tanto deberá:

- reorganizar automáticamente sus controles según el ancho disponible;
- mantener controles táctiles cómodos en dispositivos móviles;
- redimensionar correctamente SVG, Canvas o gráficos;
- evitar scroll horizontal;
- conservar la legibilidad de etiquetas, vectores y ecuaciones.

---

## Navegación

La navegación deberá adaptarse automáticamente.

En dispositivos móviles se recomienda utilizar un menú tipo hamburguesa o una solución equivalente.

---

## Breakpoints de referencia

Durante el desarrollo deberán verificarse, como mínimo, los siguientes anchos:

- 360 px
- 390 px
- 768 px
- 1024 px
- 1440 px

Los valores podrán ajustarse según las necesidades del proyecto.

---

## Validación

Antes de dar una funcionalidad por finalizada deberá comprobarse que:

- no existan desbordamientos horizontales;
- el contenido sea completamente legible;
- los elementos interactivos sean utilizables mediante interacción táctil;
- las animaciones mantengan su funcionamiento;
- la interfaz conserve una apariencia consistente.

---

## Regla de desarrollo

Toda nueva funcionalidad implementada deberá cumplir estos lineamientos desde su desarrollo inicial.

No se aceptarán implementaciones que requieran una etapa posterior de adaptación responsive.