# Formulas - Módulo 1

---

# Simplificación matemática utilizada por el simulador

Las ecuaciones originales describen una onda electromagnética que se propaga en la dirección **Z**.

Las expresiones completas son:

\[
E_x(z,t)=E_{0x}\cos(kz-\omega t)
\]

\[
E_y(z,t)=E_{0y}\cos(kz-\omega t+\delta)
\]

donde:

- \(k\) representa el número de onda.
- \(z\) representa la dirección de propagación.
- \(\omega\) es la frecuencia angular.
- \(t\) representa el tiempo.

---

## Simplificación para PolarLab

El objetivo del simulador no es representar la propagación espacial de la onda, sino visualizar cómo evoluciona el **estado de polarización** en el plano XY.

Por este motivo se considera un punto fijo del espacio, es decir:

\[
z = \text{constante}
\]

De esta manera, el término \(kz\) permanece constante y puede absorberse dentro de la fase.

Se define entonces una nueva variable angular:

\[
\theta=\omega t
\]

Con esta simplificación, las ecuaciones implementadas por el simulador serán:

\[
E_x(\theta)=E_{0x}\cos(\theta)
\]

\[
E_y(\theta)=E_{0y}\cos(\theta+\delta)
\]

Estas expresiones producen exactamente la misma trayectoria del vector eléctrico en el plano XY que las ecuaciones originales para un punto fijo del espacio.

---

# Ventajas de esta simplificación

Esta representación permite:

- Reducir la complejidad matemática del simulador.
- Facilitar la animación en tiempo real.
- Mantener el mismo comportamiento físico respecto al estado de polarización.
- Centrar la visualización en la evolución del vector eléctrico.
- Evitar cálculos innecesarios relacionados con la propagación espacial.

---
## Condiciones de polarización

La trayectoria de la punta del vector eléctrico en el plano XY se obtiene como:

[\
(E_x(\theta), E_y(\theta))
\]

El estado de polarización depende de `E_{0x}`, `E_{0y}` y `δ`:

- `δ = 0` o múltiplos de `2π` → polarización lineal.
- `δ = +π/2` o `δ = -π/2` con `E_{0x} = E_{0y}` → polarización circular.
- valores intermedios de `δ` con `E_{0x} \neq E_{0y}` → polarización elíptica.

Estas condiciones están alineadas con los estados descritos en `TeoriaModulo1.md`.

---
# Variables utilizadas por el motor del simulador

El motor de simulación trabajará con las siguientes variables:

## Parámetros definidos por el usuario

- Amplitud sobre X:

\[
E_{0x}
\]

- Amplitud sobre Y:

\[
E_{0y}
\]

- Diferencia de fase:

\[
\delta
\]

---

## Variable interna

Durante la animación se utilizará:

\[
\theta
\]

que aumentará continuamente para representar la evolución temporal de la onda.

Por ejemplo:

\[
\theta=\theta+\Delta\theta
\]

en cada cuadro de animación (frame).

---

# Algoritmo general del simulador

En cada frame de la animación se realizará el siguiente procedimiento:

1. Incrementar el valor de \(\theta\).
2. Calcular \(E_x(\theta)\).
3. Calcular \(E_y(\theta)\).
4. Dibujar el vector eléctrico resultante.
5. Registrar la posición de la punta del vector.
6. Actualizar la trayectoria recorrida.
7. Analizar las condiciones de amplitud y diferencia de fase.
8. Determinar automáticamente el estado de polarización.
9. Actualizar la explicación mostrada al usuario.

---

# Justificación

Esta simplificación no modifica el fenómeno físico que se desea estudiar.

El estudiante continúa observando exactamente los mismos estados de polarización:

- Polarización lineal.
- Polarización circular.
- Polarización elíptica.

La única diferencia es que el simulador representa la evolución temporal del campo eléctrico en un punto fijo del espacio, en lugar de representar toda la propagación de la onda.

Esta decisión permite una implementación más sencilla, un mejor rendimiento y una experiencia de aprendizaje más clara sin perder el fundamento físico explicado por el profesor.