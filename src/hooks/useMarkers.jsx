import { useMemo } from "react"
import { useHills } from "./useHills";
import { useWalks } from "./useWalks";


export const useHillMarkers = (filters=null) => {
  const hillData = useHills(null);

  const hillMarkers = useMemo(() => hillData 
    ? Object.values(hillData)
        .map(hill => ({
          coordinates: [hill.latitude, hill.longitude],
          properties: {
            type: "hill",
            slug: hill.slug,
            name: hill.name,
            book: hill.book
          }
        }))
        .filter(a => filters===null || filters.includes(a.properties.slug))
    : []
  , [hillData]);

  return hillMarkers
}


export const useWalkMarkers = (filters=null) => {
  const walkData = useWalks(null);

  const walkMarkers = useMemo(() => walkData 
    ? Object.values(walkData).map(walk => (
      walk.startLocation
      ? {
          coordinates: [walk.startLocation.latitude, walk.startLocation.longitude],
          properties: {
            type: "walk",
            slug: walk.slug,
            name: walk.title
          }
        }
      : null))
    : []
  , [walkData]);

  return walkMarkers.filter(w => w);
}
