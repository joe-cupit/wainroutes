
export default function zoomToFit(coordinates: [number, number][]) {
  const lonList = coordinates.map(point => point[0]);
  const latList = coordinates.map(point => point[1]);

  let minLon = Math.min(...lonList);
  let maxLon = Math.max(...lonList);
  let minLat = Math.min(...latList);
  let maxLat = Math.max(...latList);

  const mapBounds = document.getElementById("editor-map")?.getBoundingClientRect();
  if (!mapBounds) return [[0, 0], 10];

  let newcenter = [(minLat+maxLat)/2, (minLon+maxLon)/2];
  let newzoom = -Math.max(Math.log((maxLat-minLat)/(mapBounds.height-200))/Math.log(2), Math.log((maxLon-minLon)/mapBounds.width)/Math.log(2));
  return [newcenter, newzoom];
}