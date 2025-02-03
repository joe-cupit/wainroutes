import { useEffect, useState } from "react";

import { useHillMarkers } from "../../../hooks/useMarkers";

import { GeoRoute, LakeMap } from "../../../components/map";
import ElevationChart from "../../../components/ElevationChart";

import haversineDistance from "../../../utils/haversine";
import { getDistanceValue, getElevationValue } from "../../../utils/unitConversions";


export function Route({ secRef, wainwrights, center, slug }) {

  const hillMarkers = useHillMarkers(wainwrights);

  const [gpxPoints, setGpxPoints] = useState(null);
  const [elevationData, setElevationData] = useState(null);
  useEffect(() => {
    fetch(`/gpx/${slug}.gpx`)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(doc => {
        let coordinates = []
        let elevations = []

        let dist = 0
        let prevPoint = null

        const nodes = [...doc.getElementsByTagName("trkpt")];
        for (let node of nodes) {
          let point = [parseFloat(node.getAttribute("lon")), parseFloat(node.getAttribute("lat"))]

          if (prevPoint) {
            dist += haversineDistance(point, prevPoint)
          }

          coordinates.push(point)

          let ele = {
            "dist": getDistanceValue((dist / 1000)),
            "ele": getElevationValue(node.getElementsByTagName("ele")[0]?.textContent)
          }
          if (node.getElementsByTagName("name").length > 0) {
            ele["waypoint"] = node.getElementsByTagName("name")[0]?.textContent
          }
          elevations.push(ele)

          // if (node.getElementsByTagName("name").length > 0) {
          //   console.log(node.getElementsByTagName("name")[0]?.textContent)
          //   elevations.push(elevationGroup)
          //   elevationGroup = []
          // }

          prevPoint = point
        }

        setGpxPoints(coordinates);
        setElevationData(elevations)
      });
  }, [slug]);

  const [hoveredIndex, setHoveredIndex] = useState(null)


  return (
    <div ref={secRef}>
      <div className="walk-page_route-title flex-row flex-apart">
        <h2 className="subheading" id="walk_route">Route</h2>
        <button className="primary small bottom-left button">
          Download GPX
        </button>
      </div>
      <div className="walks-page_section flex-column">
        <div className="walk-page_map">
          <LakeMap
            gpxPoints={gpxPoints} mapMarkers={hillMarkers}
            defaultCenter={center} defaultZoom={14} >
              <GeoRoute points={gpxPoints} activeIndex={hoveredIndex} />
          </LakeMap>
        </div>
        <div className="walk-page_elevation">
          <ElevationChart
            data={elevationData}
            setActiveIndex={setHoveredIndex}
            showHillMarkers={false}
          />
        </div>
      </div>
    </div>
  )
}