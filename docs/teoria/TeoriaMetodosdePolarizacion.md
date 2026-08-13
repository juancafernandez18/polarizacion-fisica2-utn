# Métodos de obtención de luz polarizada

## 1. Introducción

La luz natural es una onda electromagnética cuyo campo eléctrico puede vibrar en múltiples direcciones perpendiculares a la dirección de propagación.

La luz polarizada se obtiene mediante diferentes métodos que permiten seleccionar o modificar la orientación del campo eléctrico.

Los principales métodos son:

- Emisión selectiva mediante antenas.
- Absorción selectiva mediante polarizadores (Polaroid).
- Polarización por reflexión.
- Polarización por dispersión.
- Polarización por doble refracción.

---

# 2. Emisión selectiva mediante antenas

Las antenas son generadoras de ondas electromagnéticas y pueden emitir ondas cuyo campo eléctrico ya se encuentra polarizado.

Dependiendo del diseño de la antena, la polarización generada puede ser:

- Polarización lineal.
- Polarización circular.
- Polarización elíptica.

Este método es utilizado principalmente en sistemas de transmisión electromagnética.

---

# 3. Absorción selectiva: Polarizadores Polaroid

El método más utilizado para producir luz polarizada es mediante materiales que transmiten únicamente determinadas componentes del campo eléctrico.

En 1938 Edwin Land desarrolló el material denominado **Polaroid**, capaz de polarizar la luz mediante absorción selectiva.

## Funcionamiento del Polaroid

El material está formado por largas cadenas de hidrocarburos alineadas durante su fabricación.

Luego se incorporan moléculas de yodo que convierten esas cadenas en conductoras eléctricas.

Los electrones pueden desplazarse fácilmente a lo largo de las cadenas.

Cuando una onda electromagnética incide:

- Si el campo eléctrico es paralelo a las cadenas:
  - Los electrones oscilan.
  - Se absorbe energía.
  - La luz no atraviesa el material.

- Si el campo eléctrico es perpendicular a las cadenas:
  - Los electrones no pueden desplazarse.
  - La luz atraviesa el material.

Como resultado, la luz transmitida queda polarizada perpendicularmente a las cadenas moleculares.

Esta dirección se denomina:

**Eje de transmisión del polarizador.**

---

# 4. Polarizador y analizador

Un sistema de polarización puede utilizar dos elementos:

## Polarizador

Es el primer material que transforma luz no polarizada en luz polarizada.

Ejemplo:

Una luz no polarizada incide sobre un polarizador cuyo eje de transmisión es vertical.

La luz que emerge queda polarizada verticalmente.

---

## Analizador

Es un segundo polarizador utilizado para estudiar la orientación de la luz polarizada.

El eje del analizador forma un ángulo θ con respecto al eje del primer polarizador.

Solo pasa la componente del campo eléctrico paralela al eje del analizador:

\[
E = E_0 cos(\theta)
\]

---

# 5. Ley de Malus

La intensidad luminosa depende del cuadrado de la amplitud del campo eléctrico:

\[
I \propto E^2
\]

Por lo tanto:

\[
I = I_{max} cos^2(\theta)
\]

Donde:

- I = intensidad transmitida.
- Imax = intensidad máxima incidente sobre el analizador.
- θ = ángulo entre los ejes de transmisión.

## Casos particulares

### Ejes paralelos

\[
\theta = 0^\circ
\]

\[
I=I_{max}
\]

La transmisión es máxima.

---

### Ejes formando 45°

\[
\theta=45^\circ
\]

\[
I=\frac{I_{max}}{2}
\]

La intensidad disminuye.

---

### Polarizadores cruzados

\[
\theta=90^\circ
\]

\[
I=0
\]

No existe transmisión.

---

# 6. Porcentaje de polarización

El grado de polarización puede calcularse como:

\[
P=
\frac{I_{max}-I_{min}}
{I_{max}+I_{min}}
\times100
\]

Donde:

- Imax es la intensidad máxima.
- Imin es la intensidad mínima.

---

# 7. Polarización por reflexión

Cuando un haz de luz no polarizada incide sobre una superficie, la luz reflejada puede quedar:

- No polarizada.
- Parcialmente polarizada.
- Totalmente polarizada.

Depende del ángulo de incidencia.

La luz reflejada queda completamente polarizada cuando el ángulo entre el rayo reflejado y el refractado es de 90°.

Este ángulo se denomina:

- Ángulo de polarización.
- Ángulo de Brewster.

---

# 8. Ley de Brewster

En el ángulo de Brewster:

\[
\theta_B+\theta_2=90^\circ
\]

Aplicando la ley de Snell:

\[
\frac{n_2}{n_1}
=
\frac{sin(\theta_B)}
{sin(\theta_2)}
\]

Como:

\[
\theta_2=90^\circ-\theta_B
\]

Entonces:

\[
\frac{n_2}{n_1}
=
\frac{sin(\theta_B)}
{cos(\theta_B)}
\]

Finalmente:

\[
tan(\theta_B)=\frac{n_2}{n_1}
\]

---

# 9. Polarización por dispersión

La dispersión ocurre cuando la luz interactúa con partículas o moléculas del medio.

Los electrones del material absorben energía y luego vuelven a emitir radiación.

En la atmósfera:

- La luz solar interactúa con moléculas de gases.
- Los electrones comienzan a oscilar.
- Estas oscilaciones generan nueva radiación polarizada.

Si un observador mira directamente hacia arriba:

- Las oscilaciones verticales no generan radiación hacia el observador.
- Solo observa la componente horizontal.

Por eso la luz del cielo puede estar parcialmente polarizada.

---

# 10. Polarización por doble refracción

Algunos materiales cristalinos poseen diferentes índices de refracción dependiendo de la dirección de propagación.

Ejemplos:

- Calcita.
- Cuarzo.

Estos materiales se denominan:

- Birrefringentes.
- De doble refracción.

---

## Separación de rayos

Cuando la luz no polarizada ingresa a un material birrefringente aparecen dos rayos:

### Rayo ordinario (o)

- Tiene índice de refracción:

\[
n_o
\]

### Rayo extraordinario (e)

- Tiene índice de refracción:

\[
n_e
\]

Ambos rayos:

- Están polarizados en direcciones perpendiculares.
- Viajan con velocidades diferentes.

---

# 11. Aplicación: análisis de esfuerzo óptico

Algunos materiales como plástico o vidrio pueden volverse birrefringentes cuando están sometidos a esfuerzo.

Configuración:

Polarizador → Material sometido a esfuerzo → Analizador

Sin esfuerzo:

- El material no modifica la polarización.
- Si los polarizadores están cruzados no pasa luz.

Con esfuerzo:

- Aparecen regiones con diferente polarización.
- Se observan bandas claras y oscuras.

Esta técnica se utiliza en ingeniería para estudiar tensiones mecánicas en estructuras.