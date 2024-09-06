import { useEffect, useMemo, useState } from "react"
import Supercluster from 'supercluster';


export const useSupercluster = (mapMarkers) => {
  const points = useMemo(() => mapMarkers ?? [], [mapMarkers]);
  const [supercluster, setSupercluster] = useState(null);

  useEffect(() => {
    const index = new Supercluster({ radius: 20 });

    index.load(points?.map(point => ({
      geometry: {
        coordinates: point.coordinates,
        type: "Point"
      },
      properties: point.properties
    })));

    setSupercluster(index)
  }, [points]);

  return supercluster;
}