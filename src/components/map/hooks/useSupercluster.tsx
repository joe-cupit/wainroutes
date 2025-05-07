import { useEffect, useMemo, useState } from "react"
import Supercluster from 'supercluster';
import { MapMarker } from "../../../hooks/useMarkers";


export const useSupercluster = (mapMarkers?: MapMarker[]) => {
  if (!mapMarkers) return;

  const points = useMemo(() => mapMarkers ?? [], [mapMarkers]);
  const [supercluster, setSupercluster] = useState<Supercluster>();

  useEffect(() => {
    const index = new Supercluster({ radius: 20 });

    index.load(points?.map(point => ({
      type: "Feature",
      geometry: {
        coordinates: point.coordinates,
        type: "Point"
      },
      properties: point.properties
    })));

    setSupercluster(index);
  }, [points]);

  return supercluster;
}