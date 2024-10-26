
export default function buildXML(gpxpoints) {
  let gpxText = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
  gpxText += "\n<gpx version=\"1.1\" creator=\"wainroutes.co.uk\" xmlns=\"http://www.topografix.com/GPX/1/1\">"
  // add metadata

  gpxText += "\n  <trk>"
  for (let p of gpxpoints) {
    gpxText += `\n    <trkpt lat="${p[1]}" lon="${p[0]}" />`
  }
  gpxText += "\n  </trk>"
  gpxText += "\n</gpx>"

  return gpxText
}