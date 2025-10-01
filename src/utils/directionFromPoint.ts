export default function directionFromPoint (a: [number, number], b: [number, number]) {
  const northing = b[1] - a[1];
  const easting = b[0] - a[0];

  const isNorth = northing >= 0;
  const isEast = easting >= 0;

  return (
    (Math.abs(northing) > Math.abs(easting) * 0.5 ? (isNorth ? "N" : "S") : "") +
    (Math.abs(easting) > Math.abs(northing) * 0.5 ? (isEast ? "E" : "W") : "")
  );
}