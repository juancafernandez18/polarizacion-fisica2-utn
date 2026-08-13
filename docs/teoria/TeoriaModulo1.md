# TEORÍA - MÓDULO 1
# Estados de Polarización

Proyecto: PolarLab

Materia: Física II

Universidad Tecnológica Nacional - Facultad Regional Resistencia

Fuente principal:
- Video teórico del profesor sobre Polarización.
- Guía de Trabajos Prácticos N.º 14.

---

# Introducción

La polarización es un fenómeno característico de las ondas electromagnéticas y se debe a su naturaleza ondulatoria.

La polarización describe el estado de vibración de los campos eléctricos y magnéticos de una onda electromagnética.

En este módulo nos concentraremos principalmente en el comportamiento del campo eléctrico, ya que la dirección de vibración de dicho campo determina el estado de polarización de la luz.

---

# ¿Qué es la luz?

La luz es una onda electromagnética compuesta por un campo eléctrico y un campo magnético mutuamente perpendiculares.

Ambos campos también son perpendiculares a la dirección de propagación de la onda.

Cuando la onda avanza, el campo eléctrico oscila en un plano perpendicular a dicha propagación.

La dirección de esa oscilación determina el estado de polarización.

---

# Luz natural

La mayoría de las fuentes luminosas de uso cotidiano producen luz no polarizada.

Ejemplos:

- El Sol.
- Una lámpara.
- Una vela.

En estos casos existen millones de dipolos emisores.

Cada uno genera una onda electromagnética cuya dirección de vibración es diferente.

Como consecuencia, el campo eléctrico puede vibrar en cualquier dirección perpendicular a la propagación.

Por este motivo la luz natural se considera no polarizada.

---

# Luz polarizada

La luz se encuentra polarizada cuando la vibración del campo eléctrico deja de ser completamente aleatoria y adquiere una orientación o comportamiento definido.

La polarización puede producirse mediante distintos procesos físicos, entre ellos:

- Reflexión.
- Refracción.
- Dispersión.
- Birrefringencia.

---

# Aplicaciones

La polarización tiene numerosas aplicaciones tecnológicas.

Algunos ejemplos mencionados por el profesor son:

- Anteojos para el Sol.
- Microscopios por polarización.
- Pantallas de cristal líquido (LCD).
- Antenas para telecomunicaciones.
- Sistemas de visualización 3D.

---

# Sistema de referencia

Durante todo el módulo se utilizará el siguiente sistema de referencia.

La onda electromagnética se propaga en la dirección Z.

El plano XY representa el plano donde vibra el campo eléctrico.

Se consideran dos componentes ortogonales del campo eléctrico:

Ex(z,t)

Ey(z,t)

La superposición de ambas componentes determina el estado de polarización.

---

# Ecuaciones de referencia

En el simulador se considera un punto fijo del espacio, es decir, `z = constante`.

La evolución temporal se describe mediante la variable angular:

\[
\theta = \omega t
\]

Con esta simplificación las expresiones utilizadas en el simulador son:

\[
E_x(\theta) = E_{0x} \cos(\theta)
\]

\[
E_y(\theta) = E_{0y} \cos(\theta + \delta)
\]

Donde:

- `E_{0x}` y `E_{0y}` son las amplitudes de las componentes X e Y.
- `δ` es la diferencia de fase entre ambas componentes.
- `θ` representa el avance temporal de la onda.

La diferencia de fase `δ` controla la forma de la trayectoria de la punta del vector eléctrico en el plano XY:

- `δ = 0` o múltiples de `2π` → polarización lineal.
- `δ = ±π/2` y `E_{0x} = E_{0y}` → polarización circular.
- valores intermedios de `δ` con amplitudes distintas → polarización elíptica.

Ver `Formulas-modulo1.md` para la justificación matemática de esta simplificación.

---

# Polarización lineal

La polarización lineal ocurre cuando ambas componentes del campo eléctrico se encuentran en fase.

Esto sucede cuando la diferencia de fase cumple:

δ = 0

o cualquier múltiplo entero de 2π.

En estas condiciones el campo eléctrico mantiene siempre una dirección fija.

La punta del vector del campo eléctrico describe una línea recta.

El ángulo de polarización depende de la relación entre las amplitudes Ex y Ey.

Este comportamiento corresponde al inciso A del Problema 1 de la guía.

---

# Polarización circular

La polarización circular ocurre cuando:

- Las amplitudes son iguales.
- Existe una diferencia de fase de ±π/2.

En estas condiciones el módulo del campo eléctrico permanece constante.

Sin embargo, su dirección cambia continuamente.

La punta del vector del campo eléctrico describe una circunferencia.

Según el sentido de rotación existen dos casos:

## Polarización circular derecha

El vector gira en sentido horario para un observador que mira hacia la fuente.

## Polarización circular izquierda

El vector gira en sentido antihorario para un observador que mira hacia la fuente.

Este comportamiento corresponde al inciso B del Problema 1.

---

# Polarización elíptica

La polarización elíptica representa el caso más general.

Se produce cuando:

- Las amplitudes de Ex y Ey son diferentes.
- La diferencia de fase es arbitraria.

En estas condiciones la punta del vector del campo eléctrico describe una elipse.

La orientación de dicha elipse depende tanto de las amplitudes como de la diferencia de fase.

La polarización lineal y la polarización circular pueden considerarse casos particulares de la polarización elíptica.

Este comportamiento corresponde al inciso C del Problema 1.

---

# Relación con el simulador

El simulador desarrollado en PolarLab permitirá modificar en tiempo real:

- Amplitud Ex.
- Amplitud Ey.
- Diferencia de fase δ.

Cada modificación actualizará automáticamente:

- La animación del campo eléctrico.
- La trayectoria de la punta del vector.
- El tipo de polarización detectado.

El objetivo es que el estudiante comprenda el fenómeno mediante la experimentación y pueda relacionar los resultados obtenidos con los conceptos explicados en clase y con los ejercicios de la guía.

---

# Conceptos clave

Al finalizar este módulo el estudiante debería poder responder las siguientes preguntas:

- ¿Qué es la polarización?
- ¿Qué diferencia existe entre luz natural y luz polarizada?
- ¿Qué representan Ex y Ey?
- ¿Qué representa la diferencia de fase δ?
- ¿Cuándo la polarización es lineal?
- ¿Cuándo la polarización es circular?
- ¿Cuándo la polarización es elíptica?
- ¿Qué trayectoria describe la punta del vector del campo eléctrico en cada caso?

---

# Alcance del módulo

Este módulo implementa y explica el Problema 1 de la Guía de Trabajos Prácticos N.º 14.

Los conceptos desarrollados aquí servirán como base para los módulos posteriores dedicados al Ángulo de Brewster y a la Ley de Malus.