import { useEffect, useState } from "react";

import { Walk } from "../WalkPage";
import { useHillMarkers } from "../../../hooks/useMarkers";

import { GeoRoute, LakeMap } from "../../../components/map";
import ElevationChart, { ElevationPoint } from "../../../components/ElevationChart";

import haversineDistance from "../../../utils/haversine";
import { getDistanceValue, getElevationValue } from "../../../utils/unitConversions";
import { DownloadIcon } from "../../../components/Icons";


export function Route({ secRef, wainwrights, center, slug } : { secRef: React.RefObject<HTMLDivElement>; wainwrights: Walk["wainwrights"]; center: [number, number]; slug: string }) {

  const hillMarkers = useHillMarkers(wainwrights);

  const [gpxPoints, setGpxPoints] = useState<[number, number][]>([]);
  const [gpxLoading, setGpxLoading] = useState(true);
  const [elevationData, setElevationData] = useState<ElevationPoint[]>([]);
  useEffect(() => {
    setGpxLoading(true);

    fetch(`https://data.wainroutes.co.uk/gpx/${slug}.gpx`)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(doc => {
        let coordinates = [];
        let elevations = [];

        let dist = 0;
        let prevPoint = null;
        let prevEle = 0;

        const nodes = [...doc.getElementsByTagName("trkpt")];
        for (let node of nodes) {
          let point : [number, number] = [parseFloat(node.getAttribute("lon") ?? ""), parseFloat(node.getAttribute("lat") ?? "")];

          if (prevPoint) {
            dist += haversineDistance(point, prevPoint);
          }

          coordinates.push(point);

          let ele : ElevationPoint = {
            "dist": getDistanceValue((dist / 1000)) ?? 0,
            "ele": getElevationValue(Number(node.getElementsByTagName("ele")[0]?.textContent ?? prevEle)) ?? 0
          }
          if (node.getElementsByTagName("name").length > 0) {
            ele["waypoint"] = node.getElementsByTagName("name")[0]?.textContent ?? "";
          }
          elevations.push(ele);

          // if (node.getElementsByTagName("name").length > 0) {
          //   console.log(node.getElementsByTagName("name")[0]?.textContent)
          //   elevations.push(elevationGroup)
          //   elevationGroup = []
          // }

          prevPoint = point;
          prevEle = ele.ele;
        }

        setGpxPoints(coordinates);
        setElevationData(elevations);
      })
      .finally(() => setGpxLoading(false));
  }, [slug]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/gpx/" + slug + ".gpx";
    link.download = slug + ".gpx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  return (
    <div ref={secRef}>
      <div className="walk-page_route-title flex-row flex-apart">
        <h2 className="subheading" id="walk_route">Route</h2>
        <button className="button primary small" title="Download GPX file" onClick={handleDownload}>
          <DownloadIcon /> Download GPX
        </button>
      </div>
      <div className="walks-page_section flex-column">
        <div className="walk-page_map">
          <LakeMap
            gpxPoints={gpxLoading ? undefined : gpxPoints} mapMarkers={hillMarkers}
            defaultCenter={center} defaultZoom={14} >
              <GeoRoute points={gpxPoints} activeIndex={hoveredIndex} />
          </LakeMap>
        </div>
        <div className="walk-page_elevation">
          <ElevationChart
            data={elevationData}
            setActiveIndex={setHoveredIndex}
            showHillMarkers={true}
          />
        </div>
      </div>
    </div>
  )
}