import { useEffect, useState } from "react"


export default function useOpenGpx(file) {

  const [gpxPoints, setGpxPoints] = useState(null)

  const reader = new FileReader()
  reader.onload = function() {
    const xmldoc = new window.DOMParser().parseFromString(reader.result, "text/xml")
    const xmlnodes = [...xmldoc.getElementsByTagName("trkpt"), ...xmldoc.getElementsByTagName("rtept")]

    var points = []
    for (const node of xmlnodes) {
      let coords = [parseFloat(node.getAttribute("lon")), parseFloat(node.getAttribute("lat"))]
      let ele = Number(node.getElementsByTagName("ele")[0]?.textContent)

      points.push({coordinates: coords, elevation: ele})
    }

    setGpxPoints(points)
  }

  useEffect(() => {
    if (file === null || file === undefined) return;
    if (!file?.name?.endsWith(".gpx")) {
      return alert("File uploaded is not a valid GPX file.")
    }

    reader.readAsText(file)
  }, [file])

  return gpxPoints
}