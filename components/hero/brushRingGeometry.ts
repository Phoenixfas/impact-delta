// Geometry for a flattened "rope" ellipse wrapping the hero image stack —
// as if a circle were tilted ~90° on the X axis, seen almost edge-on.
// Split into a front (bottom) half-arc and a back (top) half-arc so the
// cards can be layered between them, selling the wrap-around illusion.
// All values are deterministic (sine/cosine of index, not Math.random) so
// server- and client-rendered markup match exactly.

export const RING_VIEWBOX = "0 0 600 220";

const CENTER_X = 300;
const CENTER_Y = 110;
const RX = 258;
const RY = 76;
const POINT_COUNT = 32; // full loop resolution; split in half at the seams

type Point = [number, number];

// Low-frequency, low-amplitude wobble (long period relative to point
// spacing) so the smoothed curve undulates gently instead of zig-zagging.
function buildEllipsePoints(): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    const angle = (i / POINT_COUNT) * Math.PI * 2;
    const jitterX = Math.sin(i * 0.55 + 0.6) * 5;
    const jitterY = Math.cos(i * 0.45 + 1.1) * 4;
    points.push([CENTER_X + Math.cos(angle) * RX + jitterX, CENTER_Y + Math.sin(angle) * RY + jitterY]);
  }
  return points;
}

// Catmull-Rom -> cubic-bezier smoothing for an OPEN polyline (clamped ends).
function smoothOpenPath(points: Point[]): string {
  const n = points.length;
  let d = "";
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, n - 1)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    if (i === 0) d += `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} `;
    d += `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }
  return d.trim();
}

const ELLIPSE_POINTS = buildEllipsePoints();
const HALF = POINT_COUNT / 2; // index 0 = rightmost point, HALF = leftmost point

// Angle 0..PI (sin >= 0) is the lower half of the loop — the strand that
// passes in FRONT of whatever it's wrapped around.
export const FRONT_ARC_D = smoothOpenPath(ELLIPSE_POINTS.slice(0, HALF + 1));

// Angle PI..2PI (sin <= 0) is the upper half — the strand that passes BEHIND.
export const BACK_ARC_D = smoothOpenPath([...ELLIPSE_POINTS.slice(HALF), ELLIPSE_POINTS[0]]);
