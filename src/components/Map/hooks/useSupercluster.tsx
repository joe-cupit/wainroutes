import { useEffect, useMemo, useState } from "react";
import Supercluster from 'supercluster';

import MapMarker from "@/types/MapMarker";


export const useSupercluster = (mapMarkers?: MapMarker[]) => {

  const [supercluster, setSupercluster] = useState<Supercluster>();

  useEffect(() => {
    if (!mapMarkers) return;

    const index = new Supercluster({ radius: 15 });

    index.load(
      mapMarkers?.map(point => ({
        type: "Feature",
        geometry: {
          coordinates: point.coordinates,
          type: "Point"
        },
        properties: point.properties
      }))
    );

    setSupercluster(index);
  }, [mapMarkers]);


  return supercluster;
}