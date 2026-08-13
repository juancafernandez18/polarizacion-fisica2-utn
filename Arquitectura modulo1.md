# ARQUITECTURA_MODULO_01.md

# Arquitectura de Implementación
## Módulo 1 - Estados de Polarización

Proyecto: PolarLab

---

# Objetivo

Este documento define la arquitectura técnica del Módulo 1.

No contiene teoría física.

No contiene explicaciones matemáticas.

Su objetivo es indicar cómo debe implementarse el simulador utilizando React, TypeScript y Canvas.

---

# Tecnologías

- React
- Vite
- TypeScript
- TailwindCSS
- HTML5 Canvas
- React Hooks

---

# Filosofía

La aplicación debe comportarse como un laboratorio virtual.

El usuario debe percibir que está manipulando un experimento de Física.

Todos los cambios deben verse reflejados inmediatamente.

No deben existir botones de "Calcular".

Todo debe actualizarse en tiempo real.

---

# Arquitectura de carpetas

src/

components/

polarization/

ParameterPanel.tsx

TheoryCard.tsx

SimulationCanvas.tsx

TrajectoryCanvas.tsx

ElectricFieldVector.tsx

ResultCard.tsx

ExplanationCard.tsx

QuickCases.tsx

Legend.tsx

pages/

PolarizationPage.tsx

hooks/

usePolarization.ts

useAnimation.ts

utils/

polarizationMath.ts

polarizationDetector.ts

constants.ts

types/

polarization.ts

---

# Flujo general

Usuario

↓

Modifica sliders

↓

React actualiza estado

↓

Motor matemático

↓

Canvas

↓

Resultado

↓

Explicación

---

# Estado principal

Toda la simulación dependerá únicamente de tres parámetros.

Ex

Ey

δ

Estos valores serán el estado principal del módulo.

Ejemplo conceptual:

Ex = 5

Ey = 5

δ = 0°

---

# Hook principal

Crear un hook

usePolarization()

Responsabilidades:

- almacenar Ex

- almacenar Ey

- almacenar δ

- actualizar parámetros

- calcular Ex(t)

- calcular Ey(t)

- informar el tipo de polarización

---

# Hook de animación

Crear

useAnimation()

Responsabilidades

- iniciar animación

- detener animación

- reiniciar trayectoria

- actualizar θ

No debe contener cálculos físicos.

Solo controlar la animación.

---

# Motor matemático

Archivo

polarizationMath.ts

Responsabilidades:

- calcular las componentes instantáneas `E_x(θ)` y `E_y(θ)` a partir de `E_{0x}`, `E_{0y}` y `δ`
- determinar la posición de la punta del vector eléctrico en el plano XY
- definir la trayectoria que se dibuja en el canvas
- separar la lógica física de la lógica de animación
- exportar datos para el detector de polarización (`polarizationDetector.ts`)

## Relación con teoría y fórmulas

La implementación debe alinearse con los documentos de apoyo:

- `TeoriaModulo1.md` para los conceptos físicos clave.
- `Formulas-modulo1.md` para las expresiones matemáticas y la simplificación utilizada.

Esta arquitectura define la estructura técnica y no reemplaza la base teórica del módulo.

Responsabilidad

Implementar únicamente las ecuaciones físicas.

Funciones sugeridas

calculateEx()

calculateEy()

calculateVector()

calculateTrajectoryPoint()

No debe conocer React.

Debe ser completamente independiente.

---

# Detector de polarización

Archivo

polarizationDetector.ts

Responsabilidad

Analizar los parámetros.

Determinar automáticamente

- Lineal

- Circular derecha

- Circular izquierda

- Elíptica

El detector no dibuja nada.

Solo devuelve un resultado.

Ejemplo

return

{

type:

"LINEAR"

}

---

# Canvas principal

SimulationCanvas

Responsabilidades

Dibujar

- ejes

- vector eléctrico

- dirección de propagación

Actualizar cada frame.

No realizar cálculos físicos.

---

# Canvas de trayectoria

TrajectoryCanvas

Responsabilidades

Guardar todas las posiciones

(E_x,E_y)

y dibujar la curva.

Debe permitir:

- limpiar trayectoria

- reiniciar

- continuar

---

# Panel de parámetros

ParameterPanel

Contendrá

Slider Ex

Slider Ey

Slider δ

Cada modificación actualiza inmediatamente el estado.

---

# Casos rápidos

QuickCases

Botones

Caso A

Caso B

Caso C

Cada botón modifica automáticamente:

Ex

Ey

δ

---

# Resultado

ResultCard

Debe mostrar

Tipo de polarización

Parámetros actuales

Condiciones detectadas

Icono representativo

---

# Explicación

ExplanationCard

Recibe

Tipo de polarización

Genera una explicación textual.

No contiene lógica matemática.

Solo presenta información.

---

# Rendimiento

Toda la animación deberá ejecutarse mediante

requestAnimationFrame()

Nunca utilizar

setInterval()

Nunca utilizar

setTimeout()

para animaciones.

---

# Estado React

Se recomienda utilizar

useState()

para:

Ex

Ey

δ

---

useMemo()

Para evitar cálculos repetidos.

---

useCallback()

Para funciones compartidas.

---

useRef()

Para:

Canvas

Animación

Trayectoria

---

# Constantes

Crear

constants.ts

Ejemplo

DEFAULT_EX

DEFAULT_EY

DEFAULT_PHASE

FRAME_SPEED

MAX_HISTORY

COLORS

---

# Tipos

Crear

types/polarization.ts

Ejemplo

type PolarizationType =

"LINEAR"

|

"CIRCULAR_RIGHT"

|

"CIRCULAR_LEFT"

|

"ELLIPTICAL"

---

# Escalabilidad

Toda la arquitectura deberá permitir agregar nuevos módulos sin modificar el código existente.

Los módulos futuros serán:

- Ángulo de Brewster

- Ley de Malus

Cada uno tendrá sus propios componentes y utilidades.

---

# Criterios de calidad

Cada componente deberá tener una única responsabilidad.

La lógica matemática nunca deberá mezclarse con la interfaz gráfica.

Los cálculos físicos deberán permanecer desacoplados de React.

El código deberá ser reutilizable.

Las funciones deberán ser pequeñas y fácilmente testeables.

---

# Objetivo final

El usuario debe sentir que está utilizando un laboratorio virtual interactivo.

El código debe ser claro, modular y preparado para el crecimiento del proyecto.

La arquitectura debe facilitar la incorporación de nuevos módulos sin necesidad de reescribir el código existente.