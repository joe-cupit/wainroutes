import styles from "../Walk.module.css";
import fontStyles from "@/app/fonts.module.css";
import buttonStyles from "@/app/buttons.module.css";

import { XMLParser } from "fast-xml-parser";

import Walk from "@/types/Walk";
import { DownloadIcon } from "@/icons/WalkIcons";
import { useHillMarkers } from "@/hooks/useMapMarkers";
import { getDistanceValue, getElevationValue } from "@/utils/unitConversions";
import haversineDistance from "@/utils/haversineDistance";

import LakeMap, { GeoRoute } from "@/app/components/Map/Map";
import ElevationChart from "@/app/components/ElevationChart/ElevationChart";


type ElevationPoint = {
  dist: number;
  ele: number;
  waypoint?: string
}


import { readFileSync } from 'fs';
import path from 'path';


export default function Route({ wainwrights, center, slug } : { wainwrights: Walk["wainwrights"]; center: [number, number]; slug: string }) {

  const filePath = path.join(process.cwd(), 'src', 'data', `${slug}.gpx`);
  const gpxStr = readFileSync(filePath, 'utf-8');

  const hillMarkers = useHillMarkers(wainwrights);

  const parseGpx = (gpx: string) => {

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: ""
    });
    const doc = parser.parse(gpx);

    const coordinates : [number, number][] = [];
    const elevations : ElevationPoint[] = [];

    let dist = 0;
    let prevPoint = null;
    let prevEle = 0;

    const nodes = doc.gpx.trk.trkpt;
    for (const node of nodes) {
      const point : [number, number] = [parseFloat(node.lon), parseFloat(node.lat)];
      coordinates.push(point);

      if (prevPoint) {
        dist += haversineDistance(point, prevPoint);
      }
      const ele : ElevationPoint = {
        "dist": getDistanceValue((dist / 1000)) ?? 0,
        "ele": node.ele ? (getElevationValue(Number(node.ele)) ?? prevEle) : prevEle
      }
      if (node.name?.length > 0) {
        ele["waypoint"] = node.name;
      }
      elevations.push(ele);

      prevPoint = point;
      prevEle = ele.ele;
    }

    return {
      gpxPoints: coordinates,
      elevationData: elevations
    }
  }

  const gpx = parseGpx(gpxStr);


  return (
    <div>
      <div className={styles.routeTitle}>
        <h2 className={fontStyles.subheading} id="walk_route">Route</h2>
        <button className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.small}`} title="Download GPX file"
          // onClick={handleDownload}
        >
          <DownloadIcon /> Download GPX
        </button>
      </div>
      <div className={styles.section}>
        <div className={styles.map}>
          <LakeMap
            gpxPoints={gpx.gpxPoints} mapMarkers={hillMarkers}
            defaultCenter={center} defaultZoom={14} >
              <GeoRoute points={gpx.gpxPoints} activeIndex={null} />
          </LakeMap>
        </div>
        <div className={styles.elevation}>
          <ElevationChart
            data={gpx.elevationData}
            setActiveIndex={undefined}
            showHillMarkers={true}
          />
        </div>
      </div>
    </div>
  )
}