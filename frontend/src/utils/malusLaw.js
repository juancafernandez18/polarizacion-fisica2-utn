// Ley de Malus, aislada como utilidad pura (sin dependencias de React) para que
// pueda reutilizarse en cualquier problema futuro que involucre un polarizador
// y un analizador, no solo en Problema 6. Ver docs/ROADMAP.md.
//
// I = I0 · cos²(θ), donde θ es el ángulo entre los ejes de transmisión del
// polarizador y el analizador. Es máxima (I = I0) cuando θ = 0° (ejes
// paralelos) y nula cuando θ = 90° (ejes cruzados).

export const toRad = (deg) => (deg * Math.PI) / 180;

/**
 * Calcula la intensidad transmitida a través de un analizador según la ley
 * de Malus, a partir del ángulo θ (en grados) entre los ejes de transmisión
 * del polarizador y el analizador, y de la intensidad máxima I0.
 *
 * @param {{ thetaDeg: number, i0?: number }} params
 * @returns {{ ratio: number, intensity: number, transmittedPercent: number, blockedPercent: number }}
 */
export function computeMalusIntensity({ thetaDeg, i0 = 100 }) {
  const ratio = Math.cos(toRad(thetaDeg)) ** 2;
  return {
    ratio,
    intensity: i0 * ratio,
    transmittedPercent: ratio * 100,
    blockedPercent: (1 - ratio) * 100
  };
}
