import { GPXPoint } from "../hooks/useOpenGpx";


export default function buildXML(gpxpoints: GPXPoint[]) {
  let gpxText = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
  gpxText += "\n<gpx version=\"1.1\" creator=\"wainroutes.co.uk\" xmlns=\"http://www.topografix.com/GPX/1/1\">";
  // add metadata

  gpxText += "\n  <trk>";
  for (let p of gpxpoints) {
    if (p.elevation || p.waypoint) {
      gpxText += `\n    <trkpt lat="${p.coordinates[1]}" lon="${p.coordinates[0]}">`;
      if (p.elevation) {
        gpxText += `\n      <ele>${p.elevation}</ele>`;
      }
      if (p.waypoint) {
        gpxText += `\n      <name>${p.waypoint}</name>`;
      }
      gpxText += `\n    </trkpt>`;
    }
    else {
      gpxText += `\n    <trkpt lat="${p.coordinates[1]}" lon="${p.coordinates[0]}" />`;
    }
  }
  gpxText += "\n  </trk>";
  gpxText += "\n</gpx>";

  return gpxText;
}