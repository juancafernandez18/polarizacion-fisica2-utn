# MÓDULO 1 – ESTADOS DE POLARIZACIÓN

## Proyecto

**PolarLab** – Laboratorio Virtual de Polarización

Carrera: Ingeniería en Sistemas de Información  
Materia: Física II  
Universidad Tecnológica Nacional – Facultad Regional Resistencia (UTN FRRe)

---

# 1. Descripción

Este módulo representa el primer tema del laboratorio virtual y tiene como finalidad que el estudiante comprenda el fenómeno de la polarización de la luz mediante simulaciones interactivas.

El módulo está basado en el material oficial de la cátedra:

- Video teórico del profesor.
- Guía de Trabajos Prácticos N.º 14 – Polarización.
- Resolución del Problema 1.

No se pretende construir una calculadora de ejercicios, sino un entorno donde el alumno pueda experimentar con las variables físicas y comprender visualmente el fenómeno.

---

# 2. Objetivos de aprendizaje

Al finalizar este módulo el estudiante deberá ser capaz de:

- Comprender qué es la polarización.
- Diferenciar luz natural de luz polarizada.
- Comprender el significado físico de Ex y Ey.
- Comprender el efecto de la diferencia de fase δ.
- Identificar los distintos estados de polarización.
- Relacionar la simulación con el Problema 1 de la guía.

---

# 3. Fundamentación teórica

Este documento opera junto a los archivos de apoyo:

- `TeoriaModulo1.md` para los conceptos físicos.
- `Formulas-modulo1.md` para las expresiones matemáticas.
- `Arquitectura modulo1.md` para la implementación técnica.

## ¿Qué es la polarización?

La polarización es un fenómeno característico de las ondas electromagnéticas.

Describe el estado de vibración de los campos eléctricos y magnéticos de una onda electromagnética.

La luz es una onda electromagnética y la dirección de vibración del campo eléctrico determina su estado de polarización.

---

## Luz natural

La luz emitida por fuentes naturales o artificiales (Sol, lámparas, velas, etc.) está formada por una enorme cantidad de dipolos emisores.

Cada dipolo genera un campo eléctrico cuya dirección de vibración es aleatoria.

Como consecuencia, el campo eléctrico puede vibrar en cualquier dirección perpendicular a la propagación.

Este tipo de luz se denomina **luz no polarizada**.

---

## Luz polarizada

Cuando el campo eléctrico deja de vibrar aleatoriamente y adopta un patrón determinado se dice que la luz está polarizada.

La polarización puede producirse mediante distintos procesos físicos, como:

- Reflexión.
- Refracción.
- Dispersión.
- Birrefringencia.

---

# 4. Estados de polarización

Este módulo deberá permitir visualizar los tres estados fundamentales explicados por el profesor.

---

## Polarización lineal

### Condiciones

- Ex y Ey en fase.
- Diferencia de fase:

δ = 0

o cualquier múltiplo de 2π.

### Características

- El campo eléctrico mantiene una dirección constante.
- La punta del vector describe una línea recta.
- La amplitud permanece constante.

Corresponde al inciso A del Problema 1.

---

## Polarización circular

### Condiciones

- Ex = Ey
- δ = +π/2
- ó
- δ = -π/2

### Características

- La amplitud permanece constante.
- El campo eléctrico rota continuamente.
- La punta del vector describe una circunferencia.

Dependiendo del signo del desfase, la rotación será:

- Circular derecha.
- Circular izquierda.

Corresponde al inciso B del Problema 1.

---

## Polarización elíptica

### Condiciones

- Ex ≠ Ey
- Diferencia de fase arbitraria.

### Características

- La punta del vector describe una elipse.
- Es el caso más general de polarización.

Corresponde al inciso C del Problema 1.

---

# 5. Objetivo del simulador

> Nota: la detección automática del estado de polarización se basa en los criterios de amplitud y desfase descritos en `TeoriaModulo1.md` y `Formulas-modulo1.md`.



El simulador debe permitir observar cómo cambian los estados de polarización cuando el usuario modifica las variables físicas.

La prioridad del módulo es la comprensión visual del fenómeno.

Las fórmulas actúan como apoyo, no como elemento principal.

---

# 6. Parámetros modificables

El usuario podrá modificar en tiempo real:

- Amplitud Ex.
- Amplitud Ey.
- Diferencia de fase δ (en radianes).

Todos los cambios deberán reflejarse inmediatamente en la simulación.

---

# 7. Visualizaciones

El simulador deberá representar simultáneamente:

## Componentes

- Campo eléctrico Ex.
- Campo eléctrico Ey.

## Resultado

- Vector eléctrico resultante.
- Trayectoria de la punta del vector.
- Plano XY.
- Dirección de propagación.

---

# 8. Análisis automático

Mientras el usuario modifica los parámetros, el sistema deberá determinar automáticamente el estado de polarización.

Los posibles resultados son:

- Polarización lineal.
- Polarización circular derecha.
- Polarización circular izquierda.
- Polarización elíptica.

No deberá existir un botón de "Calcular".

La actualización debe ser inmediata.

---

# 9. Modo Explorar

El estudiante puede modificar libremente:

- Ex.
- Ey.
- δ.

El objetivo es descubrir cómo influyen estas variables en el resultado.

---

# 10. Modo Resolver

El simulador deberá incluir accesos rápidos para reproducir automáticamente los casos de la guía.

## Caso A

Configurar automáticamente:

Ex = Ey

δ = 0

Resultado esperado:

Polarización lineal.

---

## Caso B

Configurar automáticamente:

Ex = Ey

δ = ±π/2

Resultado esperado:

Polarización circular.

---

## Caso C

Configurar automáticamente:

Ex ≠ Ey

δ arbitrario.

Resultado esperado:

Polarización elíptica.

---

# 11. Estructura de la pantalla

La interfaz estará organizada en cinco bloques.

## 1. Introducción

Breve explicación del concepto.

Animación de:

- Luz natural.
- Luz polarizada.

---

## 2. Panel de parámetros

Controles para modificar:

- Ex.
- Ey.
- δ.

Botones rápidos:

- Caso A.
- Caso B.
- Caso C.
- Restablecer.

---

## 3. Simulación

Debe mostrar en tiempo real:

- Vector eléctrico.
- Trayectoria.
- Ejes de referencia.
- Dirección de propagación.

---

## 4. Resultado

Mostrar automáticamente:

- Tipo de polarización.
- Valores actuales.
- Condiciones detectadas.

---

## 5. Explicación

El sistema deberá explicar por qué se obtuvo ese resultado.

Ejemplo:

"Como ambas componentes tienen igual amplitud y la diferencia de fase es cero, el campo eléctrico mantiene una dirección constante. Por ello la polarización es lineal."

---

# 12. Relación con la guía

Este módulo implementa completamente el Problema 1 de la Guía de Trabajos Prácticos 14.

El estudiante podrá validar visualmente los tres casos propuestos por la cátedra.

---

# 13. Criterios de aceptación

El módulo se considera finalizado cuando:

- Es posible modificar Ex.
- Es posible modificar Ey.
- Es posible modificar δ.
- La simulación responde en tiempo real.
- Se dibuja correctamente la trayectoria del campo eléctrico.
- El sistema identifica automáticamente el estado de polarización.
- Se pueden reproducir los tres casos del Problema 1.
- Cada resultado incluye una explicación conceptual.
- La interfaz es responsive.
- El código está organizado en componentes reutilizables.

---

# 14. Filosofía de desarrollo

PolarLab debe comportarse como un laboratorio virtual.

El estudiante debe aprender experimentando.

La simulación es el elemento central del módulo.

La teoría debe acompañar a la simulación.

Las ecuaciones deben reforzar la comprensión del fenómeno, pero nunca reemplazar la visualización.