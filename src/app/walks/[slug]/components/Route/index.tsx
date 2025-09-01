import styles from "../../Walk.module.css";
import fontStyles from "@/app/fonts.module.css";

import { XMLParser } from "fast-xml-parser";
import { readFileSync } from 'fs';
import path from 'path';

import type Walk from "@/types/Walk";
import { useHillMarkers } from "@/hooks/useMapMarkers";
import { getDistanceValue, getElevationValue } from "@/utils/unitConversions";
import haversineDistance from "@/utils/haversineDistance";

import DownloadButton from "./Components/DownloadButton";
import InteractiveRoute from "./Components/InteractiveRoute";


type ElevationPoint = {
  dist: number;
  ele: number;
  waypoint?: string
}

export type ParsedGPX = {
  gpxPoints: [number, number][];
  elevationData: ElevationPoint[];
}


export default function Route({ wainwrights, defaultCenter, slug } : { wainwrights: Walk["wainwrights"]; defaultCenter: [number, number]; slug: string }) {

  const filePath = path.join(process.cwd(), 'src', 'data', 'gpx', `${slug}.gpx`);
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

    const nodes = doc.gpx.trk.trkseg.trkpt;
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
    <div id="walk-route">
      <div className={styles.routeTitle}>
        <h2 className={fontStyles.subheading} id="walk_route">Route</h2>
        <DownloadButton slug={slug} />
      </div>
      <InteractiveRoute
        gpx={gpx}
        hillMarkers={hillMarkers}
        defaultCenter={defaultCenter}
      />
    </div>
  )
}