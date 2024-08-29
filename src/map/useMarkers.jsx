import { useMemo } from "react"
import { useHills } from "../hooks/useHills";
import { useWalks } from "../hooks/useWalks";


export const useHillMarkers = (filters=null) => {
  const hillData = useHills(null);

  const hillMarkers = useMemo(() => hillData 
    ? Object.values(hillData).map(hill => ({
        coordinates: [hill.latitude, hill.longitude],
        properties: {
          type: "hill",
          slug: hill.slug,
          name: hill.name,
          book: hill.book
        }
      }))
    : []
  , [hillData]);

  return hillMarkers
}


export const useWalkMarkers = (filters=null) => {
  const walkData = useWalks(null);

  const walkMarkers = useMemo(() => walkData 
    ? Object.values(walkData).map(walk => ({
        coordinates: walk.start_lat_lang,
        properties: {
          type: "walk",
          slug: walk.slug,
          name: walk.name
        }
      }))
    : []
  , [walkData]);

  return walkMarkers
}
